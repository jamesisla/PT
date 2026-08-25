package auth

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/jamesisla/PT/internal/core/middleware"
	"github.com/jamesisla/PT/internal/core/response"
	"github.com/jamesisla/PT/internal/core/security"
	"github.com/jamesisla/PT/internal/database"
)

type User struct {
	ID        string `json:"id"`
	Email     string `json:"email"`
	Nombre    string `json:"nombre"`
	Telefono  string `json:"telefono"`
	RUT       string `json:"rut"`
	Rol       string `json:"rol"`
	Estado    string `json:"estado"`
	CreatedAt string `json:"createdAt"`
}

func Routes() chi.Router {
	r := chi.NewRouter()

	r.Post("/register", Register)
	r.Post("/login", Login)
	r.Post("/logout", Logout)
	r.With(middleware.RequireAuth).Get("/me", GetCurrentUser)

	return r
}

func Register(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		Nombre   string `json:"nombre"`
		Telefono string `json:"telefono"`
		RUT      string `json:"rut"`
		Rol      string `json:"rol"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid JSON body")
		return
	}

	email := strings.ToLower(strings.TrimSpace(input.Email))
	if email == "" || len(input.Password) < 6 {
		response.Error(w, http.StatusBadRequest, "Email y contraseña (mínimo 6 caracteres) son requeridos")
		return
	}

	if input.Nombre == "" {
		input.Nombre = "Usuario SaniaPet"
	}
	if input.Rol == "" {
		input.Rol = "propietario"
	}

	// Check if email already exists
	var count int
	_ = database.DB.QueryRow("SELECT COUNT(*) FROM usuarios WHERE email = ?", email).Scan(&count)
	if count > 0 {
		response.Error(w, http.StatusConflict, "El correo electrónico ya está registrado")
		return
	}

	hash, err := security.HashPassword(input.Password)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Error al procesar la contraseña")
		return
	}

	id := fmt.Sprintf("usr-%d", time.Now().UnixNano()/1e6)
	createdAt := time.Now().Format("2006-01-02 15:04:05")

	_, err = database.DB.Exec(`
		INSERT INTO usuarios (id, email, password_hash, nombre, telefono, rut, rol, estado, created_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, 'activo', ?)
	`, id, email, hash, input.Nombre, input.Telefono, input.RUT, input.Rol, createdAt)

	if err != nil {
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	// Generate JWT
	token, err := security.GenerateToken(id, email, input.Nombre, input.Rol)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Error al generar la sesión")
		return
	}

	// Set cookie
	http.SetCookie(w, &http.Cookie{
		Name:     "saniapet_token",
		Value:    token,
		Path:     "/",
		Expires:  time.Now().Add(7 * 24 * time.Hour),
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})

	user := User{
		ID:        id,
		Email:     email,
		Nombre:    input.Nombre,
		Telefono:  input.Telefono,
		RUT:       input.RUT,
		Rol:       input.Rol,
		Estado:    "activo",
		CreatedAt: createdAt,
	}

	response.JSON(w, http.StatusCreated, map[string]any{
		"token": token,
		"user":  user,
	})
}

func Login(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		response.Error(w, http.StatusBadRequest, "Invalid JSON body")
		return
	}

	email := strings.ToLower(strings.TrimSpace(input.Email))

	var u User
	var hash string
	err := database.DB.QueryRow(`
		SELECT id, email, password_hash, nombre, telefono, rut, rol, estado, created_at
		FROM usuarios WHERE email = ?
	`, email).Scan(&u.ID, &u.Email, &hash, &u.Nombre, &u.Telefono, &u.RUT, &u.Rol, &u.Estado, &u.CreatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			response.Error(w, http.StatusUnauthorized, "Credenciales incorrectas")
			return
		}
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	if u.Estado == "suspendido" || u.Estado == "bloqueado" {
		response.Error(w, http.StatusForbidden, "Esta cuenta ha sido suspendida. Contacte a soporte.")
		return
	}

	if !security.CheckPasswordHash(input.Password, hash) {
		response.Error(w, http.StatusUnauthorized, "Credenciales incorrectas")
		return
	}

	token, err := security.GenerateToken(u.ID, u.Email, u.Nombre, u.Rol)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "Error al generar la sesión")
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "saniapet_token",
		Value:    token,
		Path:     "/",
		Expires:  time.Now().Add(7 * 24 * time.Hour),
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})

	response.JSON(w, http.StatusOK, map[string]any{
		"token": token,
		"user":  u,
	})
}

func Logout(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, &http.Cookie{
		Name:     "saniapet_token",
		Value:    "",
		Path:     "/",
		Expires:  time.Unix(0, 0),
		HttpOnly: true,
		MaxAge:   -1,
	})
	response.Success(w, "Sesión cerrada correctamente")
}

func GetCurrentUser(w http.ResponseWriter, r *http.Request) {
	claims := middleware.GetUser(r)
	if claims == nil {
		response.Error(w, http.StatusUnauthorized, "No autenticado")
		return
	}

	var u User
	err := database.DB.QueryRow(`
		SELECT id, email, nombre, telefono, rut, rol, estado, created_at
		FROM usuarios WHERE id = ?
	`, claims.UserID).Scan(&u.ID, &u.Email, &u.Nombre, &u.Telefono, &u.RUT, &u.Rol, &u.Estado, &u.CreatedAt)

	if err != nil {
		response.Error(w, http.StatusNotFound, "Usuario no encontrado")
		return
	}

	response.JSON(w, http.StatusOK, u)
}
