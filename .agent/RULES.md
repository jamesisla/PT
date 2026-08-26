# 📋 Sania Pet — Reglas del Asistente & Convenciones

## 🛠️ Stack Tecnológico
* **Backend:** Go 1.22+, Chi Router, SQLite (modo WAL, `mattn/go-sqlite3` o `modernc.org/sqlite`).
* **Frontend:** React (TypeScript), Vite, Tailwind CSS, Recharts, Leaflet / OpenStreetMap, Lucide React.
* **Empaquetado:** Binario único standalone de Go con frontend embebido (`go:embed all:dist`).
* **Puertos Locales:**
  * Frontend Dev (Vite): `http://localhost:5173`
  * Backend API / Standalone: `http://localhost:8080` (o `$PORT`)

---

## 📐 Convenciones de Código & Arquitectura
1. **Modularidad Go (`internal/`):**
   * Handlers HTTP en `internal/handlers/`.
   * Módulos de dominio en `internal/modules/{auth,admin,analytics,backups}/`.
   * Modelos y base de datos en `internal/database/`.
2. **Higiene de Binarios:**
   * El binario compilado `saniapet` y los archivos `.db` jamás deben incluirse en commits.
3. **Frontend Móvil-First:**
   * La UI está diseñada como un contenedor de smartphone optimizado para respuesta táctil y alta densidad de información clínica.

---

## 🚫 Restricciones Obligatorias
* ❌ **NO agregues dependencias pesadas de base de datos externa (ej. Postgres) sin justificación:** El proyecto está diseñado para funcionar 100% nativo con SQLite embebido.
* ❌ **NO rompas el tag de embebido `go:embed all:dist`:** La compilación de Go requiere que exista la carpeta `dist/` generada por `npm run build`.

---

## 🔄 Protocolo de Sesión
1. **Al iniciar:** Leer `.agent/STATE.md`.
2. **Al finalizar:** Actualizar `.agent/STATE.md` con los avances.
