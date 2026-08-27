package admin

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/jamesisla/PT/internal/core/middleware"
	"github.com/jamesisla/PT/internal/core/response"
	"github.com/jamesisla/PT/internal/database"
	"github.com/jamesisla/PT/internal/modules/auth"
)

func Routes() chi.Router {
	r := chi.NewRouter()

	// All admin routes strictly require SuperAdmin or Admin role
	r.Use(middleware.RequireAdmin)

	r.Get("/stats", GetDashboardStats)
	r.Get("/users", ListUsers)
	r.Patch("/users/{id}/role", UpdateUserRole)
	r.Patch("/users/{id}/status", UpdateUserStatus)
	r.Delete("/users/{id}", DeleteUser)

	r.Get("/pets", ListAllPets)

	return r
}

func GetDashboardStats(w http.ResponseWriter, r *http.Request) {
	var totalUsers, totalPets, totalAlerts, totalServices, totalLostPets, totalEvents int

	query := `
		SELECT 
			(SELECT COUNT(*) FROM usuarios),
			(SELECT COUNT(*) FROM mascotas),
			(SELECT COUNT(*) FROM alertas WHERE estado = 'activa'),
			(SELECT COUNT(*) FROM servicios_pet),
			(SELECT COUNT(*) FROM mascotas_perdidas WHERE estado = 'perdida'),
			(SELECT COUNT(*) FROM analytics_events)
	`
	_ = database.DB.QueryRow(query).Scan(&totalUsers, &totalPets, &totalAlerts, &totalServices, &totalLostPets, &totalEvents)

	dbSize := "0.1 MB"
	if fi, err := os.Stat("saniapet.db"); err == nil {
		dbSize = fmt.Sprintf("%.2f MB", float64(fi.Size())/(1024*1024))
	}

	response.JSON(w, http.StatusOK, map[string]any{
		"totalUsers":     totalUsers,
		"totalPets":      totalPets,
		"activeAlerts":   totalAlerts,
		"totalServices":  totalServices,
		"activeLostPets": totalLostPets,
		"totalEvents":    totalEvents,
		"dbSize":         dbSize,
	})
}

func ListUsers(w http.ResponseWriter, r *http.Request) {
	search := r.URL.Query().Get("q")
	role := r.URL.Query().Get("role")

	query := "SELECT id, email, nombre, telefono, rut, rol, estado, created_at FROM usuarios WHERE 1=1"
	var args []any

	if search != "" {
		query += " AND (email LIKE ? OR nombre LIKE ? OR rut LIKE ?)"
		pattern := "%" + search + "%"
		args = append(args, pattern, pattern, pattern)
	}
	if role != "" && role != "todos" {
		query += " AND rol = ?"
		args = append(args, role)
	}
	query += " ORDER BY created_at DESC LIMIT 100"

	rows, err := database.DB.Query(query, args...)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	var list []auth.User
	for rows.Next() {
		var u auth.User
		var tel, rut sql.NullString
		if err := rows.Scan(&u.ID, &u.Email, &u.Nombre, &tel, &rut, &u.Rol, &u.Estado, &u.CreatedAt); err != nil {
			continue
		}
		u.Telefono = tel.String
		u.RUT = rut.String
		list = append(list, u)
	}

	if list == nil {
		list = []auth.User{}
	}
	response.JSON(w, http.StatusOK, list)
}

func UpdateUserRole(w http.ResponseWriter, r *http.Request) {
	userID := chi.URLParam(r, "id")
	var body struct {
		Rol string `json:"rol"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.Rol == "" {
		response.Error(w, http.StatusBadRequest, "Rol inválido")
		return
	}

	_, err := database.DB.Exec("UPDATE usuarios SET rol = ? WHERE id = ?", body.Rol, userID)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(w, "Rol actualizado con éxito")
}

func UpdateUserStatus(w http.ResponseWriter, r *http.Request) {
	userID := chi.URLParam(r, "id")
	var body struct {
		Estado string `json:"estado"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.Estado == "" {
		response.Error(w, http.StatusBadRequest, "Estado inválido")
		return
	}

	_, err := database.DB.Exec("UPDATE usuarios SET estado = ? WHERE id = ?", body.Estado, userID)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(w, "Estado de usuario actualizado con éxito")
}

func DeleteUser(w http.ResponseWriter, r *http.Request) {
	userID := chi.URLParam(r, "id")
	_, err := database.DB.Exec("DELETE FROM usuarios WHERE id = ?", userID)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}
	response.Success(w, "Usuario eliminado")
}

func ListAllPets(w http.ResponseWriter, r *http.Request) {
	rows, err := database.DB.Query(`
		SELECT m.id, m.nombre, m.especie, m.raza, m.edad, m.peso_actual, m.foto, COALESCE(p.nombre, 'Sin propietario') as dueno
		FROM mascotas m
		LEFT JOIN propietarios p ON p.mascota_id = m.id
		ORDER BY m.nombre ASC
	`)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	type AdminPetItem struct {
		ID         string `json:"id"`
		Nombre     string `json:"nombre"`
		Especie    string `json:"especie"`
		Raza       string `json:"raza"`
		Edad       string `json:"edad"`
		PesoActual string `json:"pesoActual"`
		Foto       string `json:"foto"`
		Dueno      string `json:"dueno"`
	}

	var list []AdminPetItem
	for rows.Next() {
		var item AdminPetItem
		var raza, edad, peso, foto sql.NullString
		if err := rows.Scan(&item.ID, &item.Nombre, &item.Especie, &raza, &edad, &peso, &foto, &item.Dueno); err != nil {
			continue
		}
		item.Raza = raza.String
		item.Edad = edad.String
		item.PesoActual = peso.String
		item.Foto = foto.String
		list = append(list, item)
	}

	if list == nil {
		list = []AdminPetItem{}
	}
	response.JSON(w, http.StatusOK, list)
}
