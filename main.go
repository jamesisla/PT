package main

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	coreMiddleware "github.com/jamesisla/PT/internal/core/middleware"
	"github.com/jamesisla/PT/internal/database"
	"github.com/jamesisla/PT/internal/handlers"
	"github.com/jamesisla/PT/internal/modules/admin"
	"github.com/jamesisla/PT/internal/modules/analytics"
	"github.com/jamesisla/PT/internal/modules/auth"
	"github.com/jamesisla/PT/internal/modules/backups"
)

// Embed frontend build directory into single static binary
//
//go:embed all:dist
var distFS embed.FS

func createAPIRouter() chi.Router {
	api := chi.NewRouter()

	api.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status":"Sania Pet Modular Go API running","version":"2.0.0"}`))
	})

	// Domain 1: Auth & User Profiles
	api.Mount("/auth", auth.Routes())

	// Domain 2: SuperAdmin Management Portal
	api.Mount("/admin", admin.Routes())
	api.Mount("/admin/analytics", analytics.Routes())
	api.Mount("/admin/backups", backups.Routes())

	// Domain 3: Pets & Clinical Records
	api.Get("/pets", handlers.ListPets)
	api.Post("/pets", handlers.CreatePet)
	api.Get("/pets/{pet_id}", handlers.GetPetDetail)
	api.Put("/pets/{pet_id}/perfil", handlers.UpdatePetProfile)
	api.Put("/pets/{pet_id}/propietario", handlers.UpdatePetOwner)

	api.Post("/pets/{pet_id}/sintomas", handlers.AddSymptom)
	api.Put("/pets/{pet_id}/sintomas/{id}", handlers.UpdateSymptom)
	api.Delete("/pets/{pet_id}/sintomas/{id}", handlers.DeleteSymptom)

	api.Post("/pets/{pet_id}/peso", handlers.AddWeight)

	api.Post("/pets/{pet_id}/vacunas", handlers.AddVaccine)
	api.Put("/pets/{pet_id}/vacunas/{id}", handlers.UpdateVaccine)
	api.Delete("/pets/{pet_id}/vacunas/{id}", handlers.DeleteVaccine)

	api.Post("/pets/{pet_id}/alertas", handlers.AddAlert)
	api.Post("/alertas/{id}/action", handlers.HandleAlertAction)

	api.Post("/pets/{pet_id}/diagnosticos", handlers.AddDiagnosis)
	api.Put("/pets/{pet_id}/diagnosticos/{id}", handlers.UpdateDiagnosis)
	api.Delete("/pets/{pet_id}/diagnosticos/{id}", handlers.DeleteDiagnosis)

	api.Post("/pets/{pet_id}/desparasitaciones", handlers.AddDeworming)
	api.Put("/pets/{pet_id}/desparasitaciones/{id}", handlers.UpdateDeworming)
	api.Delete("/pets/{pet_id}/desparasitaciones/{id}", handlers.DeleteDeworming)

	api.Post("/pets/{pet_id}/medicamentos", handlers.AddMedication)
	api.Put("/pets/{pet_id}/medicamentos/{id}", handlers.UpdateMedication)
	api.Delete("/pets/{pet_id}/medicamentos/{id}", handlers.DeleteMedication)

	api.Post("/pets/{pet_id}/laboratorios", handlers.AddLaboratory)
	api.Put("/pets/{pet_id}/laboratorios/{id}", handlers.UpdateLaboratory)
	api.Delete("/pets/{pet_id}/laboratorios/{id}", handlers.DeleteLaboratory)

	api.Post("/pets/{pet_id}/imagenes", handlers.AddMedicalImage)
	api.Put("/pets/{pet_id}/imagenes/{id}", handlers.UpdateMedicalImage)
	api.Delete("/pets/{pet_id}/imagenes/{id}", handlers.DeleteMedicalImage)

	// Domain 4: Map Services & SOS Lost Pet Radar
	api.Get("/servicios", handlers.ListServicios)
	api.Post("/servicios", handlers.CreateServicio)

	api.Get("/mascotas-perdidas", handlers.ListMascotasPerdidas)
	api.Post("/mascotas-perdidas", handlers.ReportMascotaPerdida)
	api.Patch("/mascotas-perdidas/{id}/estado", handlers.UpdateEstadoMascotaPerdida)
	api.Delete("/mascotas-perdidas/{id}", handlers.DeleteMascotaPerdida)

	return api
}

func main() {
	log.Println("==================================================")
	log.Println("🐾 Iniciando Sania Pet - Servidor Modular Go + SQLite")
	log.Println("==================================================")

	// 1. Initialize SQLite Database (WAL mode)
	dbPath := os.Getenv("DATABASE_PATH")
	if dbPath == "" {
		dbPath = "saniapet.db"
	}
	db, err := database.InitDB(dbPath)
	if err != nil {
		log.Fatalf("Error al inicializar la base de datos SQLite: %v", err)
	}

	// Sync analytics toggle from database
	analytics.SyncConfigFromDB(db)

	// 2. Configure HTTP Router (Chi)
	r := chi.NewRouter()

	// Global Middlewares
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Compress(5))

	// CORS configuration
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Attach Auth and Analytics Telemetry middleware
	r.Use(coreMiddleware.Authenticate)
	r.Use(analytics.Middleware)

	// 3. Mount Domain Modules at /api and also root aliases for flexible reverse proxies
	apiRouter := createAPIRouter()
	r.Mount("/api", apiRouter)
	r.Mount("/auth", auth.Routes())
	r.Mount("/admin", admin.Routes())

	// 4. Serve Embedded React Frontend SPA
	distSubFS, err := fs.Sub(distFS, "dist")
	if err != nil {
		log.Printf("Warning: error accessing embedded dist directory: %v", err)
	} else {
		fileServer := http.FileServer(http.FS(distSubFS))

		// Handle static files and SPA fallback
		r.NotFound(func(w http.ResponseWriter, r *http.Request) {
			path := strings.TrimPrefix(r.URL.Path, "/")
			if path != "" {
				// If request is targeting an API route that does not exist, return JSON 404
				if strings.HasPrefix(path, "api/") || strings.HasPrefix(path, "auth/") || strings.HasPrefix(path, "admin/") {
					w.Header().Set("Content-Type", "application/json")
					w.WriteHeader(http.StatusNotFound)
					w.Write([]byte(`{"error":"Ruta de API no encontrada"}`))
					return
				}

				// Check if the file exists in embedded dist static assets
				if f, err := distSubFS.Open(path); err == nil {
					f.Close()
					if strings.HasPrefix(path, "assets/") {
						w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
					}
					fileServer.ServeHTTP(w, r)
					return
				}
			}

			// If method is not GET/HEAD, do not serve HTML SPA fallback
			if r.Method != http.MethodGet && r.Method != http.MethodHead {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusNotFound)
				w.Write([]byte(`{"error":"Método no soportado para esta ruta"}`))
				return
			}

			// Fallback to index.html for SPA client-side routing (no-cache for instant updates)
			indexData, err := fs.ReadFile(distSubFS, "index.html")
			if err != nil {
				http.NotFound(w, r)
				return
			}
			w.Header().Set("Content-Type", "text/html; charset=utf-8")
			w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
			w.WriteHeader(http.StatusOK)
			w.Write(indexData)
		})
	}

	// 5. Port listening
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	if !strings.HasPrefix(port, ":") {
		port = ":" + port
	}

	log.Printf("🚀 Sania Pet Modular escuchando en http://0.0.0.0%s", port)
	log.Printf("📱 Frontend, API, Auth, Admin y Analítica listos en un solo binario.")

	if err := http.ListenAndServe(port, r); err != nil {
		log.Fatalf("Error en el servidor HTTP: %v", err)
	}
}
