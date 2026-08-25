# Sania Pet - Medical Record Dashboard 🐾

Sania Pet es un panel médico digital móvil e inteligente para el control y seguimiento clínico de mascotas. Está diseñado con un enfoque estético premium ("mobile-first") inspirado en el look & feel original del proyecto Sania, y cuenta con un backend completamente funcional desarrollado en **FastAPI** que interactúa con una base de datos **PostgreSQL** mediante **Docker Compose**.

---

## 🚀 Arquitectura y Stack Tecnológico

El proyecto está dividido en dos capas totalmente desacopladas que se comunican mediante una API RESTful:

*   **Frontend**: 
    *   **React (TypeScript)** y **Vite** para un desarrollo ágil y alto rendimiento.
    *   Diseño móvil-first simulado en pantalla para una experiencia nativa de app de smartphone.
    *   Gráficos biométricos interactivos mediante **Recharts**.
    *   Iconografía premium con **Lucide React**.
*   **Backend**:
    *   **FastAPI (Python 3.11)** para una API REST veloz con documentación automática.
    *   **SQLAlchemy** como ORM para la interacción con la base de datos.
    *   **Pydantic** para validación de datos de entrada/salida y mapeo automático entre nomenclatura `snake_case` (base de datos) y `camelCase` (frontend React).
*   **Base de Datos y Contenedores**:
    *   **PostgreSQL 15** ejecutándose en contenedores.
    *   **Docker y Docker Compose** para orquestar la base de datos y la API sin ensuciar la máquina local.

---

## 🚀 Despliegue en Producción (OCI con Alpine Linux)

Si vas a desplegar en una máquina virtual de **Oracle Cloud Infrastructure (OCI) con Alpine Linux** corriendo todo de forma **100% nativa (Bare Metal / VM)** para máximo rendimiento, consulta la guía detallada:

👉 **[Guía de Despliegue Nativo en OCI con Alpine Linux (DEPLOY_OCI_ALPINE.md)](./DEPLOY_OCI_ALPINE.md)**

---

## 🛠️ Requisitos e Instalación Local / Docker

Asegúrate de tener instalados **Node.js** (v18 o superior), **Docker** y **Docker Compose**.

### 1. Clonar y configurar variables de entorno
El proyecto utiliza puertos personalizados para evitar colisiones en la máquina local (ej. la base de datos se expone en el puerto `5433` de la máquina host). No se requieren cambios de configuración adicionales.

### 2. Iniciar la base de datos y la API (Docker)
Ejecuta el siguiente comando en la raíz del proyecto para construir e iniciar los servicios de backend y base de datos:

```bash
docker compose up -d --build
```

Esto levantará:
*   La base de datos **Postgres** en el puerto local `5433` (puerto interno `5432`).
*   La API de **FastAPI** en el puerto local `8000`.

### 3. Poblar la Base de Datos (Seeder)
Para inicializar la base de datos con los perfiles médicos de ejemplo de **Luna** (Perra Beagle) y **Max** (Gato Persa), ejecuta el script de siembra dentro del contenedor del backend:

```bash
docker compose exec backend python seed.py
```

### 4. Iniciar el Frontend (React + Vite)
Instala las dependencias del frontend e inicia el servidor de desarrollo de Vite:

```bash
# Instalar dependencias npm
npm install

# Iniciar servidor local
npm run dev
```

Abre tu navegador en [http://localhost:5173/](http://localhost:5173/) para ver la aplicación ejecutándose.

---

## 🗄️ Esquema de Base de Datos (PostgreSQL)

El modelo relacional mapea toda la ficha médica de la mascota. SQLAlchemy autogenera las siguientes tablas al arrancar el contenedor:

1.  **mascotas** (`id`, `nombre`, `especie`, `raza`, `edad`, `sexo`, `peso_actual`, `fecha_nacimiento`, `microchip`, `foto`, `seguro`, `clinica_frecuente`).
2.  **propietarios** (`id`, `mascota_id` (FK), `nombre`, `rut`, `telefono`, `email`, `direccion`).
3.  **alertas** (`id`, `mascota_id` (FK), `tipo` ['critica'|'preventiva'], `titulo`, `descripcion`, `estado` ['activa'|'pospuesta'|'solucionada'|'olvidada']).
4.  **diagnosticos** (`id`, `mascota_id` (FK), `fecha`, `tipo`, `descripcion`, `doctor`, `estado`, `estado_color`, `tipo_color`, `clinica`).
5.  **vacunas** (`id`, `mascota_id` (FK), `fecha`, `nombre`, `lote`, `veterinario`, `proxima_fecha`, `estado`, `estado_color`).
6.  **desparasitaciones** (`id`, `mascota_id` (FK), `fecha`, `tipo`, `producto`, `peso_mascota`, `dosis`, `proxima_fecha`, `veterinario`).
7.  **medicamentos** (`id`, `mascota_id` (FK), `nombre`, `dosis`, `frecuencia`, `duracion`, `fecha_inicio`, `veterinario`, `estado` ['Activo'|'Completado']).
8.  **laboratorios** (`id`, `mascota_id` (FK), `fecha`, `examen`, `laboratorio`, `telefono`, `sitio_web`, `direccion`, `convenio`, `director_tecnico`, `notas_generales`).
9.  **laboratorio_resultados** (`id`, `laboratorio_id` (FK), `nombre`, `resultado`, `unidad`, `rango_referencia`, `estado`).
10. **imagenes** (`id`, `mascota_id` (FK), `fecha`, `tipo`, `nombre`, `indicacion`, `informe`, `doctor`, `imagen_url`).
11. **peso_historial** (`id`, `mascota_id` (FK), `fecha`, `peso`).
12. **diario** (`id`, `mascota_id` (FK), `fecha`, `sintoma`, `estado` ['Normal'|'Atención'|'Alerta'], `nota`).

---

## 📡 Documentación de la API REST

FastAPI incluye documentación interactiva automática en la ruta `http://localhost:8000/docs`. A continuación se detallan los endpoints principales:

### Mascotas e Historial General
*   `GET /api/pets`: Listar todas las mascotas (ID, nombre, especie, foto, edad).
*   `GET /api/pets/{pet_id}`: Retorna la ficha médica detallada de una mascota incluyendo todos sus diagnósticos, vacunas, diario de salud, alertas y peso.
*   `PUT /api/pets/{pet_id}`: Actualiza los datos biométricos de la mascota (nombre, foto, seguro, etc.).

### Propietarios
*   `PUT /api/pets/{pet_id}/propietario`: Actualiza los datos de contacto y domicilio del dueño.

### Diario de Salud (Síntomas)
*   `POST /api/pets/{pet_id}/sintomas`: Registra una nueva entrada en la bitácora diaria.
*   `PUT /api/pets/{pet_id}/sintomas/{sintoma_id}`: Modifica una observación existente.
*   `DELETE /api/pets/{pet_id}/sintomas/{sintoma_id}`: Remueve una observación del diario.

### Historial Clínico (Consultas y Diagnósticos)
*   `POST /api/pets/{pet_id}/diagnosticos`: Registra una nueva consulta/diagnóstico.
*   `PUT /api/pets/{pet_id}/diagnosticos/{diagnostico_id}`: Modifica los detalles de una consulta.
*   `DELETE /api/pets/{pet_id}/diagnosticos/{diagnostico_id}`: Elimina la consulta del historial clínico.

### Vacunas
*   `POST /api/pets/{pet_id}/vacunas`: Registra una vacuna administrada.
*   `PUT /api/pets/{pet_id}/vacunas/{vacuna_id}`: Modifica los detalles de una vacuna.
*   `DELETE /api/pets/{pet_id}/vacunas/{vacuna_id}`: Elimina un registro de inmunización.

### Tratamientos (Medicamentos)
*   `POST /api/pets/{pet_id}/medicamentos`: Registra una nueva receta/tratamiento.
*   `PUT /api/pets/{pet_id}/medicamentos/{med_id}`: Modifica los parámetros o cambia el estado (ej. de Activo a Completado).
*   `DELETE /api/pets/{pet_id}/medicamentos/{med_id}`: Elimina la prescripción.

### Desparasitaciones
*   `POST /api/pets/{pet_id}/desparasitaciones`: Registra un nuevo control de desparasitación (interna/externa).
*   `PUT /api/pets/{pet_id}/desparasitaciones/{des_id}`: Modifica los detalles de una desparasitación.
*   `DELETE /api/pets/{pet_id}/desparasitaciones/{des_id}`: Elimina un registro de desparasitación.

### Historial de Peso
*   `POST /api/pets/{pet_id}/peso`: Registra un nuevo peso del animal. Agrega automáticamente la fecha al historial y actualiza el campo de `peso_actual` de la mascota de forma sincronizada.

### Exámenes de Laboratorio
*   `POST /api/pets/{pet_id}/laboratorios`: Registra una nueva orden de exámenes con resultados/parámetros clínicos.
*   `PUT /api/pets/{pet_id}/laboratorios/{lab_id}`: Modifica los detalles de un examen y actualiza sus parámetros asociados.
*   `DELETE /api/pets/{pet_id}/laboratorios/{lab_id}`: Elimina la orden de laboratorio del historial.

### Imágenes Diagnósticas
*   `POST /api/pets/{pet_id}/imagenes`: Registra un nuevo estudio de imagen médica (Radiografía, Ecografía, etc.).
*   `PUT /api/pets/{pet_id}/imagenes/{imagen_id}`: Modifica los detalles o informe de una imagen médica.
*   `DELETE /api/pets/{pet_id}/imagenes/{imagen_id}`: Elimina el registro de imagen médica.

### Alertas y Notificaciones
*   `POST /api/pets/{pet_id}/alertas`: Agendar una nueva alerta o recordatorio clínico.
*   `POST /api/alertas/{alerta_id}/action?action={action}`: Procesa una acción sobre la alerta (`posponer`, `solucionar`, `olvidar`). Esto cambia su estado de forma que desaparezca de la pantalla de inicio y descuente el marcador de alertas activas global.

---

## ⚡ Confiabilidad y Funcionamiento Offline (Modo Standalone)

Para asegurar que la aplicación frontend React sea útil incluso en entornos sin conexión, el cliente `api.ts` incluye un **mecanismo de contingencia local**:

*   Si el backend de FastAPI no está disponible (p. ej. si no se ha corrido el comando de Docker), el cliente detecta el fallo de conexión e interactúa automáticamente con una base de datos simulada en memoria (`petsDatabase` dentro de `src/app/data/petData.ts`).
*   Esto permite agregar, modificar y eliminar síntomas, vacunas, medicamentos, pesos y alertas directamente en la memoria del navegador, garantizando que el diseño y flujos de la aplicación sean 100% interactivos en demostraciones offline y entornos locales aislados.

---

## 📁 Preparación de Repositorio para GitHub

El archivo `.gitignore` en la raíz está configurado para excluir directorios autogenerados que no deben subirse al repositorio Git:

```text
node_modules/
dist/
.env*
.gemini/
backend/__pycache__/
backend/venv/
backend/.pytest_cache/
```

Para subir el proyecto a GitHub por primera vez, puedes ejecutar los siguientes comandos:

```bash
git init
git add .
git commit -m "feat: setup pet medical records dashboard with fastapi and postgresql crud"
# Reemplazar por tu URL de repositorio de GitHub
git remote add origin https://github.com/tu-usuario/sania-pet-dashboard.git
git branch -M main
git push -u origin main
```
