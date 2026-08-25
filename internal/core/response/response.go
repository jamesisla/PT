package response

import (
	"encoding/json"
	"net/http"
)

// JSON writes a standard JSON response with status code
func JSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if data != nil {
		_ = json.NewEncoder(w).Encode(data)
	}
}

// Error writes a structured error response
func Error(w http.ResponseWriter, status int, message string) {
	JSON(w, status, map[string]string{
		"error": message,
	})
}

// Success writes a standard success message
func Success(w http.ResponseWriter, message string) {
	JSON(w, http.StatusOK, map[string]string{
		"status":  "success",
		"message": message,
	})
}
