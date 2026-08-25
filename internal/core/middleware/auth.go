package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/jamesisla/PT/internal/core/response"
	"github.com/jamesisla/PT/internal/core/security"
)

type contextKey string

const UserContextKey contextKey = "currentUser"

// Authenticate extracts JWT from Authorization Header or Cookie and attaches to context
func Authenticate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenString := ""

		// 1. Check Authorization Header
		authHeader := r.Header.Get("Authorization")
		if strings.HasPrefix(authHeader, "Bearer ") {
			tokenString = strings.TrimPrefix(authHeader, "Bearer ")
		}

		// 2. Fallback to Cookie
		if tokenString == "" {
			if cookie, err := r.Cookie("saniapet_token"); err == nil {
				tokenString = cookie.Value
			}
		}

		if tokenString != "" {
			claims, err := security.ValidateToken(tokenString)
			if err == nil && claims != nil {
				ctx := context.WithValue(r.Context(), UserContextKey, claims)
				next.ServeHTTP(w, r.WithContext(ctx))
				return
			}
		}

		next.ServeHTTP(w, r)
	})
}

// RequireAuth enforces that a valid user is authenticated
func RequireAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		user := GetUser(r)
		if user == nil {
			response.Error(w, http.StatusUnauthorized, "Se requiere autenticación para acceder a este recurso")
			return
		}
		next.ServeHTTP(w, r)
	})
}

// RequireAdmin enforces that the authenticated user is an administrator
func RequireAdmin(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		user := GetUser(r)
		if user == nil {
			response.Error(w, http.StatusUnauthorized, "Acceso no autorizado")
			return
		}
		if user.Rol != "superadmin" && user.Rol != "admin" {
			response.Error(w, http.StatusForbidden, "Permisos insuficientes: se requiere rol de Administrador")
			return
		}
		next.ServeHTTP(w, r)
	})
}

// GetUser retrieves the authenticated user claims from context
func GetUser(r *http.Request) *security.UserClaims {
	if claims, ok := r.Context().Value(UserContextKey).(*security.UserClaims); ok {
		return claims
	}
	return nil
}
