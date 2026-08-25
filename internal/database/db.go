package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"

	_ "modernc.org/sqlite"
)

var DB *sql.DB

// InitDB initializes the SQLite database with WAL mode and creates all required tables
func InitDB(dbPath string) (*sql.DB, error) {
	if dbPath == "" {
		dbPath = os.Getenv("DATABASE_PATH")
		if dbPath == "" {
			dbPath = "saniapet.db"
		}
	}

	// Ensure parent directory exists if path contains directories
	dir := filepath.Dir(dbPath)
	if dir != "" && dir != "." {
		if err := os.MkdirAll(dir, 0755); err != nil {
			return nil, fmt.Errorf("failed to create db directory: %w", err)
		}
	}

	// DSN with WAL mode and high performance pragmas
	dsn := fmt.Sprintf("%s?_pragma=journal_mode(WAL)&_pragma=busy_timeout(5000)&_pragma=synchronous(NORMAL)&_pragma=foreign_keys(1)", dbPath)
	db, err := sql.Open("sqlite", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to open sqlite db: %w", err)
	}

	// Recommended connection pool settings for SQLite
	db.SetMaxOpenConns(1) // Single writer for SQLite concurrency safety
	db.SetMaxIdleConns(1)

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping sqlite db: %w", err)
	}

	DB = db

	// Create tables schema
	if err := createTables(db); err != nil {
		return nil, fmt.Errorf("failed to create tables: %w", err)
	}

	// Check if database needs initial seeding
	if err := AutoSeedIfEmpty(db); err != nil {
		log.Printf("Warning: auto-seeding failed: %v", err)
	}

	log.Printf("SQLite database successfully initialized at: %s (WAL mode)", dbPath)
	return db, nil
}

func createTables(db *sql.DB) error {
	schema := `
	CREATE TABLE IF NOT EXISTS mascotas (
		id TEXT PRIMARY KEY,
		nombre TEXT NOT NULL,
		especie TEXT NOT NULL,
		raza TEXT,
		edad TEXT,
		sexo TEXT,
		peso_actual TEXT,
		fecha_nacimiento TEXT,
		microchip TEXT,
		foto TEXT,
		seguro TEXT,
		clinica_frecuente TEXT
	);

	CREATE TABLE IF NOT EXISTS propietarios (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		mascota_id TEXT NOT NULL UNIQUE,
		nombre TEXT NOT NULL,
		rut TEXT,
		telefono TEXT,
		email TEXT,
		direccion TEXT,
		FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE
	);

	CREATE TABLE IF NOT EXISTS alertas (
		id TEXT PRIMARY KEY,
		mascota_id TEXT NOT NULL,
		tipo TEXT,
		titulo TEXT NOT NULL,
		descripcion TEXT,
		estado TEXT DEFAULT 'activa',
		fecha TEXT,
		FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE
	);

	CREATE TABLE IF NOT EXISTS diagnosticos (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		mascota_id TEXT NOT NULL,
		fecha TEXT,
		tipo TEXT,
		tipo_color TEXT,
		descripcion TEXT,
		doctor TEXT,
		estado TEXT,
		estado_color TEXT,
		clinica TEXT,
		FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE
	);

	CREATE TABLE IF NOT EXISTS vacunas (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		mascota_id TEXT NOT NULL,
		fecha TEXT,
		nombre TEXT NOT NULL,
		lote TEXT,
		veterinario TEXT,
		proxima_fecha TEXT,
		estado TEXT,
		estado_color TEXT,
		FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE
	);

	CREATE TABLE IF NOT EXISTS desparasitaciones (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		mascota_id TEXT NOT NULL,
		fecha TEXT,
		tipo TEXT,
		producto TEXT,
		peso_mascota TEXT,
		dosis TEXT,
		proxima_fecha TEXT,
		veterinario TEXT,
		FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE
	);

	CREATE TABLE IF NOT EXISTS medicamentos (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		mascota_id TEXT NOT NULL,
		nombre TEXT NOT NULL,
		dosis TEXT,
		frecuencia TEXT,
		duracion TEXT,
		fecha_inicio TEXT,
		veterinario TEXT,
		estado TEXT,
		FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE
	);

	CREATE TABLE IF NOT EXISTS laboratorios (
		id TEXT PRIMARY KEY,
		mascota_id TEXT NOT NULL,
		fecha TEXT,
		examen TEXT NOT NULL,
		laboratorio TEXT,
		telefono TEXT,
		sitio_web TEXT,
		direccion TEXT,
		convenio TEXT,
		director_tecnico TEXT,
		notas_generales TEXT,
		FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE
	);

	CREATE TABLE IF NOT EXISTS laboratorio_resultados (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		laboratorio_id TEXT NOT NULL,
		nombre TEXT NOT NULL,
		resultado TEXT,
		unidad TEXT,
		rango_referencia TEXT,
		estado TEXT,
		FOREIGN KEY (laboratorio_id) REFERENCES laboratorios(id) ON DELETE CASCADE
	);

	CREATE TABLE IF NOT EXISTS imagenes (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		mascota_id TEXT NOT NULL,
		fecha TEXT,
		tipo TEXT,
		nombre TEXT NOT NULL,
		indicacion TEXT,
		informe TEXT,
		doctor TEXT,
		imagen_url TEXT,
		FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE
	);

	CREATE TABLE IF NOT EXISTS peso_historial (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		mascota_id TEXT NOT NULL,
		fecha TEXT,
		peso REAL NOT NULL,
		FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE
	);

	CREATE TABLE IF NOT EXISTS diario (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		mascota_id TEXT NOT NULL,
		fecha TEXT,
		sintoma TEXT NOT NULL,
		estado TEXT,
		nota TEXT,
		FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE
	);

	CREATE TABLE IF NOT EXISTS servicios_pet (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		nombre TEXT NOT NULL,
		categoria TEXT NOT NULL,
		subtipo TEXT,
		rating REAL DEFAULT 5.0,
		reviews INTEGER DEFAULT 0,
		direccion TEXT NOT NULL,
		telefono TEXT,
		whatsapp TEXT,
		tarifa TEXT,
		horario TEXT,
		lat REAL NOT NULL,
		lng REAL NOT NULL,
		descripcion TEXT,
		imagen_url TEXT
	);

	CREATE TABLE IF NOT EXISTS mascotas_perdidas (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		mascota_id TEXT,
		nombre_mascota TEXT NOT NULL,
		especie TEXT NOT NULL,
		raza TEXT,
		color TEXT,
		foto TEXT,
		fecha_extravio TEXT NOT NULL,
		lat REAL NOT NULL,
		lng REAL NOT NULL,
		direccion_referencia TEXT NOT NULL,
		recompensa TEXT,
		contacto_nombre TEXT NOT NULL,
		contacto_telefono TEXT NOT NULL,
		contacto_whatsapp TEXT,
		descripcion TEXT,
		estado TEXT DEFAULT 'perdida',
		radio_metros INTEGER DEFAULT 300,
		created_at TEXT
	);
	`
	_, err := db.Exec(schema)
	return err
}
