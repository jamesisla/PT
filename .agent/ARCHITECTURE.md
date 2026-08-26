# 🏛️ Sania Pet — Arquitectura y Topología

## 🌐 Visión General
Panel médico veterinario digital y radar de mascotas perdidas de ultra-bajo consumo (~15 MB RAM) desplegado como un único binario Go en Alpine Linux.

---

## 📂 Mapa del Repositorio
```
PT/
├── .agent/                      # Memoria de trabajo (RULES, STATE, ARCHITECTURE)
├── dist/                        # Build estático generado por Vite (embebido en Go)
├── internal/
│   ├── database/                # Schema SQLite, migraciones y seeders
│   ├── handlers/                # Endpoints HTTP (pets, vaccines, alerts, sos radar)
│   └── modules/                 # auth, admin, analytics, backups
├── src/                         # Frontend React TypeScript
├── main.go                      # Entrypoint Go y router Chi con servidor estático embebido
├── scripts/
│   ├── dev.sh                   # Iniciar backend Go + Vite dev server
│   ├── build.sh                 # Compilar frontend y binario Go
│   └── deploy.sh                # Script de despliegue remoto a Alpine
└── DEPLOY_OCI_ALPINE.md         # Guía de infraestructura y OpenRC
```

---

## 🗄️ Endpoints Clave
* `/api/pets` — CRUD de mascotas y perfiles clínicos.
* `/api/pets/{id}/vacunas` — Registro de vacunas y cálculo de refuerzos.
* `/api/servicios` — Directorio de veterinarias y urgencias.
* `/api/mascotas-perdidas` — Radar SOS con coordenadas geográficas.
