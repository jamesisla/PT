package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/jamesisla/PT/internal/database"
	"github.com/jamesisla/PT/internal/models"
)

// Helper to write JSON response
func writeJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if data != nil {
		_ = json.NewEncoder(w).Encode(data)
	}
}

// Helper to write error response
func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}

// GET /api/pets
func ListPets(w http.ResponseWriter, r *http.Request) {
	rows, err := database.DB.Query("SELECT id, nombre, especie, raza, edad, foto FROM mascotas")
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	var list []models.PetSummary
	for rows.Next() {
		var p models.PetSummary
		var raza, edad, foto sql.NullString
		if err := rows.Scan(&p.ID, &p.Nombre, &p.Especie, &raza, &edad, &foto); err != nil {
			writeError(w, http.StatusInternalServerError, err.Error())
			return
		}
		p.Raza = raza.String
		p.Edad = edad.String
		p.Foto = foto.String
		list = append(list, p)
	}

	if list == nil {
		list = []models.PetSummary{}
	}
	writeJSON(w, http.StatusOK, list)
}

// GET /api/pets/{pet_id}
func GetPetDetail(w http.ResponseWriter, r *http.Request) {
	petID := chi.URLParam(r, "pet_id")

	var pet models.Pet
	var raza, edad, sexo, peso, fechaNac, microchip, foto, seguro, clinica sql.NullString

	err := database.DB.QueryRow(`
		SELECT id, nombre, especie, raza, edad, sexo, peso_actual, fecha_nacimiento, microchip, foto, seguro, clinica_frecuente
		FROM mascotas WHERE id = ?
	`, petID).Scan(
		&pet.ID, &pet.Nombre, &pet.Especie, &raza, &edad, &sexo, &peso, &fechaNac, &microchip, &foto, &seguro, &clinica,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			writeError(w, http.StatusNotFound, "Pet medical profile not found")
			return
		}
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	pet.Raza = raza.String
	pet.Edad = edad.String
	pet.Sexo = sexo.String
	pet.PesoActual = peso.String
	pet.FechaNacimiento = fechaNac.String
	pet.Microchip = microchip.String
	pet.Foto = foto.String
	pet.Seguro = seguro.String
	pet.ClinicaFrecuente = clinica.String

	// 1. Propietario
	var prop models.Propietario
	var rut, tel, email, dir sql.NullString
	err = database.DB.QueryRow("SELECT nombre, rut, telefono, email, direccion FROM propietarios WHERE mascota_id = ?", petID).Scan(
		&prop.Nombre, &rut, &tel, &email, &dir,
	)
	if err == nil {
		prop.RUT = rut.String
		prop.Telefono = tel.String
		prop.Email = email.String
		prop.Direccion = dir.String
		pet.Propietario = &prop
	}

	// 2. Alertas
	aRows, _ := database.DB.Query("SELECT id, tipo, titulo, descripcion, estado, fecha FROM alertas WHERE mascota_id = ?", petID)
	pet.Alertas = []models.Alerta{}
	if aRows != nil {
		defer aRows.Close()
		for aRows.Next() {
			var a models.Alerta
			var desc, f sql.NullString
			_ = aRows.Scan(&a.ID, &a.Tipo, &a.Titulo, &desc, &a.Estado, &f)
			a.Descripcion = desc.String
			a.Fecha = f.String
			pet.Alertas = append(pet.Alertas, a)
		}
	}

	// 3. Diagnosticos
	dRows, _ := database.DB.Query("SELECT id, fecha, tipo, tipo_color, descripcion, doctor, estado, estado_color, clinica FROM diagnosticos WHERE mascota_id = ? ORDER BY id DESC", petID)
	pet.Diagnosticos = []models.Diagnostico{}
	if dRows != nil {
		defer dRows.Close()
		for dRows.Next() {
			var d models.Diagnostico
			var desc, doc, clinica sql.NullString
			_ = dRows.Scan(&d.ID, &d.Fecha, &d.Tipo, &d.TipoColor, &desc, &doc, &d.Estado, &d.EstadoColor, &clinica)
			d.Descripcion = desc.String
			d.Doctor = doc.String
			d.Clinica = clinica.String
			pet.Diagnosticos = append(pet.Diagnosticos, d)
		}
	}

	// 4. Vacunas
	vRows, _ := database.DB.Query("SELECT id, fecha, nombre, lote, veterinario, proxima_fecha, estado, estado_color FROM vacunas WHERE mascota_id = ? ORDER BY id DESC", petID)
	pet.Vacunas = []models.Vacuna{}
	if vRows != nil {
		defer vRows.Close()
		for vRows.Next() {
			var v models.Vacuna
			var lote, vet, prox sql.NullString
			_ = vRows.Scan(&v.ID, &v.Fecha, &v.Nombre, &lote, &vet, &prox, &v.Estado, &v.EstadoColor)
			v.Lote = lote.String
			v.Veterinario = vet.String
			v.ProximaFecha = prox.String
			pet.Vacunas = append(pet.Vacunas, v)
		}
	}

	// 5. Desparasitaciones
	dpRows, _ := database.DB.Query("SELECT id, fecha, tipo, producto, peso_mascota, dosis, proxima_fecha, veterinario FROM desparasitaciones WHERE mascota_id = ? ORDER BY id DESC", petID)
	pet.Desparasitaciones = []models.Desparasitacion{}
	if dpRows != nil {
		defer dpRows.Close()
		for dpRows.Next() {
			var dp models.Desparasitacion
			var peso, dosis, prox, vet sql.NullString
			_ = dpRows.Scan(&dp.ID, &dp.Fecha, &dp.Tipo, &dp.Producto, &peso, &dosis, &prox, &vet)
			dp.PesoMascota = peso.String
			dp.Dosis = dosis.String
			dp.ProximaFecha = prox.String
			dp.Veterinario = vet.String
			pet.Desparasitaciones = append(pet.Desparasitaciones, dp)
		}
	}

	// 6. Medicamentos
	mRows, _ := database.DB.Query("SELECT id, nombre, dosis, frecuencia, duracion, fecha_inicio, veterinario, estado FROM medicamentos WHERE mascota_id = ? ORDER BY id DESC", petID)
	pet.Medicamentos = []models.Medicamento{}
	if mRows != nil {
		defer mRows.Close()
		for mRows.Next() {
			var m models.Medicamento
			var dosis, freq, dur, fIni, vet sql.NullString
			_ = mRows.Scan(&m.ID, &m.Nombre, &dosis, &freq, &dur, &fIni, &vet, &m.Estado)
			m.Dosis = dosis.String
			m.Frecuencia = freq.String
			m.Duracion = dur.String
			m.FechaInicio = fIni.String
			m.Veterinario = vet.String
			pet.Medicamentos = append(pet.Medicamentos, m)
		}
	}

	// 7. Laboratorios
	lRows, _ := database.DB.Query("SELECT id, fecha, examen, laboratorio, telefono, sitio_web, direccion, convenio, director_tecnico, notas_generales FROM laboratorios WHERE mascota_id = ? ORDER BY id DESC", petID)
	pet.Laboratorios = []models.Laboratorio{}
	if lRows != nil {
		defer lRows.Close()
		for lRows.Next() {
			var l models.Laboratorio
			var lab, tel, web, dir, conv, dt, notas sql.NullString
			_ = lRows.Scan(&l.ID, &l.Fecha, &l.Examen, &lab, &tel, &web, &dir, &conv, &dt, &notas)
			l.Laboratorio = lab.String
			l.Telefono = tel.String
			l.SitioWeb = web.String
			l.Direccion = dir.String
			l.Convenio = conv.String
			l.DirectorTecnico = dt.String
			l.NotasGenerales = notas.String

			// Results for lab
			resRows, _ := database.DB.Query("SELECT id, nombre, resultado, unidad, rango_referencia, estado FROM laboratorio_resultados WHERE laboratorio_id = ?", l.ID)
			l.Resultados = []models.LabResult{}
			if resRows != nil {
				for resRows.Next() {
					var r models.LabResult
					var res, un, rr, est sql.NullString
					_ = resRows.Scan(&r.ID, &r.Nombre, &res, &un, &rr, &est)
					r.Resultado = res.String
					r.Unidad = un.String
					r.RangoReferencia = rr.String
					r.Estado = est.String
					l.Resultados = append(l.Resultados, r)
				}
				resRows.Close()
			}
			pet.Laboratorios = append(pet.Laboratorios, l)
		}
	}

	// 8. Imagenes
	iRows, _ := database.DB.Query("SELECT id, fecha, tipo, nombre, indicacion, informe, doctor, imagen_url FROM imagenes WHERE mascota_id = ? ORDER BY id DESC", petID)
	pet.Imagenes = []models.ImagenMedica{}
	if iRows != nil {
		defer iRows.Close()
		for iRows.Next() {
			var img models.ImagenMedica
			var ind, inf, doc, url sql.NullString
			_ = iRows.Scan(&img.ID, &img.Fecha, &img.Tipo, &img.Nombre, &ind, &inf, &doc, &url)
			img.Indicacion = ind.String
			img.Informe = inf.String
			img.Doctor = doc.String
			img.ImagenURL = url.String
			pet.Imagenes = append(pet.Imagenes, img)
		}
	}

	// 9. Peso Historial
	pRows, _ := database.DB.Query("SELECT id, fecha, peso FROM peso_historial WHERE mascota_id = ? ORDER BY id ASC", petID)
	pet.PesoHistorial = []models.PesoRegistro{}
	if pRows != nil {
		defer pRows.Close()
		for pRows.Next() {
			var pr models.PesoRegistro
			_ = pRows.Scan(&pr.ID, &pr.Fecha, &pr.Peso)
			pet.PesoHistorial = append(pet.PesoHistorial, pr)
		}
	}

	// 10. Diario
	diaRows, _ := database.DB.Query("SELECT id, fecha, sintoma, estado, nota FROM diario WHERE mascota_id = ? ORDER BY id DESC", petID)
	pet.Diario = []models.DiarioRegistro{}
	if diaRows != nil {
		defer diaRows.Close()
		for diaRows.Next() {
			var dr models.DiarioRegistro
			var nota sql.NullString
			_ = diaRows.Scan(&dr.ID, &dr.Fecha, &dr.Sintoma, &dr.Estado, &nota)
			dr.Nota = nota.String
			pet.Diario = append(pet.Diario, dr)
		}
	}

	writeJSON(w, http.StatusOK, pet)
}

// POST /api/pets - Create new pet
func CreatePet(w http.ResponseWriter, r *http.Request) {
	var input map[string]any
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid JSON body")
		return
	}

	nombre, _ := input["nombre"].(string)
	if strings.TrimSpace(nombre) == "" {
		writeError(w, http.StatusBadRequest, "nombre is required")
		return
	}

	id := strings.ToLower(strings.ReplaceAll(nombre, " ", "-"))
	// Make unique if needed
	var count int
	_ = database.DB.QueryRow("SELECT COUNT(*) FROM mascotas WHERE id = ?", id).Scan(&count)
	if count > 0 {
		id = fmt.Sprintf("%s-%d", id, count+1)
	}

	especie, _ := input["especie"].(string)
	raza, _ := input["raza"].(string)
	edad, _ := input["edad"].(string)
	sexo, _ := input["sexo"].(string)
	peso, _ := input["pesoActual"].(string)
	fechaNac, _ := input["fechaNacimiento"].(string)
	chip, _ := input["microchip"].(string)
	foto, _ := input["foto"].(string)
	seguro, _ := input["seguro"].(string)
	clinica, _ := input["clinicaFrecuente"].(string)

	if foto == "" {
		if strings.ToLower(especie) == "gato" {
			foto = "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300&h=300"
		} else {
			foto = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300&h=300"
		}
	}

	_, err := database.DB.Exec(`
		INSERT INTO mascotas (id, nombre, especie, raza, edad, sexo, peso_actual, fecha_nacimiento, microchip, foto, seguro, clinica_frecuente)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`, id, nombre, especie, raza, edad, sexo, peso, fechaNac, chip, foto, seguro, clinica)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	// Owner details
	var propName, propTel, propEmail, propDir string
	if propMap, ok := input["propietario"].(map[string]any); ok {
		propName, _ = propMap["nombre"].(string)
		propTel, _ = propMap["telefono"].(string)
		propEmail, _ = propMap["email"].(string)
		propDir, _ = propMap["direccion"].(string)
	}
	if propName == "" {
		propName = "Dueño Registrado"
	}
	_, _ = database.DB.Exec(`
		INSERT INTO propietarios (mascota_id, nombre, rut, telefono, email, direccion)
		VALUES (?, ?, ?, ?, ?, ?)
	`, id, propName, "N/A", propTel, propEmail, propDir)

	writeJSON(w, http.StatusCreated, map[string]any{"id": id, "nombre": nombre, "especie": especie, "foto": foto})
}

// PUT /api/pets/{pet_id}/perfil
func UpdatePetProfile(w http.ResponseWriter, r *http.Request) {
	petID := chi.URLParam(r, "pet_id")
	var input models.Pet
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid JSON body")
		return
	}

	_, err := database.DB.Exec(`
		UPDATE mascotas 
		SET nombre = ?, especie = ?, raza = ?, edad = ?, sexo = ?, fecha_nacimiento = ?, microchip = ?, foto = ?, seguro = ?, clinica_frecuente = ?
		WHERE id = ?
	`, input.Nombre, input.Especie, input.Raza, input.Edad, input.Sexo, input.FechaNacimiento, input.Microchip, input.Foto, input.Seguro, input.ClinicaFrecuente, petID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "success"})
}

// PUT /api/pets/{pet_id}/propietario
func UpdatePetOwner(w http.ResponseWriter, r *http.Request) {
	petID := chi.URLParam(r, "pet_id")
	var input models.Propietario
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid JSON body")
		return
	}

	_, err := database.DB.Exec(`
		INSERT INTO propietarios (mascota_id, nombre, rut, telefono, email, direccion)
		VALUES (?, ?, ?, ?, ?, ?)
		ON CONFLICT(mascota_id) DO UPDATE SET
		nombre = excluded.nombre,
		rut = excluded.rut,
		telefono = excluded.telefono,
		email = excluded.email,
		direccion = excluded.direccion
	`, petID, input.Nombre, input.RUT, input.Telefono, input.Email, input.Direccion)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, input)
}

// POST /api/pets/{pet_id}/sintomas
func AddSymptom(w http.ResponseWriter, r *http.Request) {
	petID := chi.URLParam(r, "pet_id")
	var input models.DiarioRegistro
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid JSON body")
		return
	}

	res, err := database.DB.Exec("INSERT INTO diario (mascota_id, fecha, sintoma, estado, nota) VALUES (?, ?, ?, ?, ?)",
		petID, input.Fecha, input.Sintoma, input.Estado, input.Nota)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	input.ID, _ = res.LastInsertId()
	writeJSON(w, http.StatusCreated, input)
}

// PUT /api/pets/{pet_id}/sintomas/{id}
func UpdateSymptom(w http.ResponseWriter, r *http.Request) {
	petID := chi.URLParam(r, "pet_id")
	id := chi.URLParam(r, "id")
	var input models.DiarioRegistro
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid JSON body")
		return
	}
	_, err := database.DB.Exec("UPDATE diario SET fecha = ?, sintoma = ?, estado = ?, nota = ? WHERE id = ? AND mascota_id = ?",
		input.Fecha, input.Sintoma, input.Estado, input.Nota, id, petID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, input)
}

// DELETE /api/pets/{pet_id}/sintomas/{id}
func DeleteSymptom(w http.ResponseWriter, r *http.Request) {
	petID := chi.URLParam(r, "pet_id")
	id := chi.URLParam(r, "id")
	_, _ = database.DB.Exec("DELETE FROM diario WHERE id = ? AND mascota_id = ?", id, petID)
	writeJSON(w, http.StatusOK, map[string]string{"status": "deleted"})
}

// POST /api/pets/{pet_id}/peso
func AddWeight(w http.ResponseWriter, r *http.Request) {
	petID := chi.URLParam(r, "pet_id")
	var input models.PesoRegistro
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid JSON body")
		return
	}
	res, err := database.DB.Exec("INSERT INTO peso_historial (mascota_id, fecha, peso) VALUES (?, ?, ?)",
		petID, input.Fecha, input.Peso)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	input.ID, _ = res.LastInsertId()
	// Update pet peso_actual
	_, _ = database.DB.Exec("UPDATE mascotas SET peso_actual = ? WHERE id = ?", fmt.Sprintf("%.1f kg", input.Peso), petID)
	writeJSON(w, http.StatusCreated, input)
}

// POST /api/pets/{pet_id}/vacunas
func AddVaccine(w http.ResponseWriter, r *http.Request) {
	petID := chi.URLParam(r, "pet_id")
	var input models.Vacuna
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid JSON body")
		return
	}
	res, err := database.DB.Exec(`
		INSERT INTO vacunas (mascota_id, fecha, nombre, lote, veterinario, proxima_fecha, estado, estado_color)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`, petID, input.Fecha, input.Nombre, input.Lote, input.Veterinario, input.ProximaFecha, input.Estado, input.EstadoColor)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	input.ID, _ = res.LastInsertId()
	writeJSON(w, http.StatusCreated, input)
}

// PUT /api/pets/{pet_id}/vacunas/{id}
func UpdateVaccine(w http.ResponseWriter, r *http.Request) {
	petID := chi.URLParam(r, "pet_id")
	id := chi.URLParam(r, "id")
	var input models.Vacuna
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid JSON body")
		return
	}
	_, err := database.DB.Exec(`
		UPDATE vacunas SET fecha = ?, nombre = ?, lote = ?, veterinario = ?, proxima_fecha = ?, estado = ?, estado_color = ?
		WHERE id = ? AND mascota_id = ?
	`, input.Fecha, input.Nombre, input.Lote, input.Veterinario, input.ProximaFecha, input.Estado, input.EstadoColor, id, petID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, input)
}

// DELETE /api/pets/{pet_id}/vacunas/{id}
func DeleteVaccine(w http.ResponseWriter, r *http.Request) {
	petID := chi.URLParam(r, "pet_id")
	id := chi.URLParam(r, "id")
	_, _ = database.DB.Exec("DELETE FROM vacunas WHERE id = ? AND mascota_id = ?", id, petID)
	writeJSON(w, http.StatusOK, map[string]string{"status": "deleted"})
}

// POST /api/pets/{pet_id}/alertas
func AddAlert(w http.ResponseWriter, r *http.Request) {
	petID := chi.URLParam(r, "pet_id")
	var input models.Alerta
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid JSON body")
		return
	}
	if input.ID == "" {
		input.ID = fmt.Sprintf("al-%d", time.Now().UnixMilli())
	}
	if input.Estado == "" {
		input.Estado = "activa"
	}
	_, err := database.DB.Exec("INSERT INTO alertas (id, mascota_id, tipo, titulo, descripcion, estado, fecha) VALUES (?, ?, ?, ?, ?, ?, ?)",
		input.ID, petID, input.Tipo, input.Titulo, input.Descripcion, input.Estado, input.Fecha)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusCreated, input)
}

// POST /api/alertas/{id}/action
func HandleAlertAction(w http.ResponseWriter, r *http.Request) {
	alertID := chi.URLParam(r, "id")
	action := r.URL.Query().Get("action")
	var newState string
	switch action {
	case "solucionar":
		newState = "solucionada"
	case "posponer":
		newState = "pospuesta"
	default:
		newState = "olvidada"
	}
	_, _ = database.DB.Exec("UPDATE alertas SET estado = ? WHERE id = ?", newState, alertID)
	writeJSON(w, http.StatusOK, map[string]string{"id": alertID, "estado": newState})
}

// Diagnosticos
func AddDiagnosis(w http.ResponseWriter, r *http.Request) {
	petID := chi.URLParam(r, "pet_id")
	var input models.Diagnostico
	_ = json.NewDecoder(r.Body).Decode(&input)
	res, err := database.DB.Exec("INSERT INTO diagnosticos (mascota_id, fecha, tipo, tipo_color, descripcion, doctor, estado, estado_color, clinica) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
		petID, input.Fecha, input.Tipo, input.TipoColor, input.Descripcion, input.Doctor, input.Estado, input.EstadoColor, input.Clinica)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	input.ID, _ = res.LastInsertId()
	writeJSON(w, http.StatusCreated, input)
}

func UpdateDiagnosis(w http.ResponseWriter, r *http.Request) {
	petID := chi.URLParam(r, "pet_id")
	id := chi.URLParam(r, "id")
	var input models.Diagnostico
	_ = json.NewDecoder(r.Body).Decode(&input)
	_, _ = database.DB.Exec("UPDATE diagnosticos SET fecha = ?, tipo = ?, tipo_color = ?, descripcion = ?, doctor = ?, estado = ?, estado_color = ?, clinica = ? WHERE id = ? AND mascota_id = ?",
		input.Fecha, input.Tipo, input.TipoColor, input.Descripcion, input.Doctor, input.Estado, input.EstadoColor, input.Clinica, id, petID)
	writeJSON(w, http.StatusOK, input)
}

func DeleteDiagnosis(w http.ResponseWriter, r *http.Request) {
	petID := chi.URLParam(r, "pet_id")
	id := chi.URLParam(r, "id")
	_, _ = database.DB.Exec("DELETE FROM diagnosticos WHERE id = ? AND mascota_id = ?", id, petID)
	writeJSON(w, http.StatusOK, map[string]string{"status": "deleted"})
}

// Desparasitaciones
func AddDeworming(w http.ResponseWriter, r *http.Request) {
	petID := chi.URLParam(r, "pet_id")
	var input models.Desparasitacion
	_ = json.NewDecoder(r.Body).Decode(&input)
	res, err := database.DB.Exec("INSERT INTO desparasitaciones (mascota_id, fecha, tipo, producto, peso_mascota, dosis, proxima_fecha, veterinario) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
		petID, input.Fecha, input.Tipo, input.Producto, input.PesoMascota, input.Dosis, input.ProximaFecha, input.Veterinario)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	input.ID, _ = res.LastInsertId()
	writeJSON(w, http.StatusCreated, input)
}

func UpdateDeworming(w http.ResponseWriter, r *http.Request) {
	petID := chi.URLParam(r, "pet_id")
	id := chi.URLParam(r, "id")
	var input models.Desparasitacion
	_ = json.NewDecoder(r.Body).Decode(&input)
	_, _ = database.DB.Exec("UPDATE desparasitaciones SET fecha = ?, tipo = ?, producto = ?, peso_mascota = ?, dosis = ?, proxima_fecha = ?, veterinario = ? WHERE id = ? AND mascota_id = ?",
		input.Fecha, input.Tipo, input.Producto, input.PesoMascota, input.Dosis, input.ProximaFecha, input.Veterinario, id, petID)
	writeJSON(w, http.StatusOK, input)
}

func DeleteDeworming(w http.ResponseWriter, r *http.Request) {
	petID := chi.URLParam(r, "pet_id")
	id := chi.URLParam(r, "id")
	_, _ = database.DB.Exec("DELETE FROM desparasitaciones WHERE id = ? AND mascota_id = ?", id, petID)
	writeJSON(w, http.StatusOK, map[string]string{"status": "deleted"})
}

// Medicamentos
func AddMedication(w http.ResponseWriter, r *http.Request) {
	petID := chi.URLParam(r, "pet_id")
	var input models.Medicamento
	_ = json.NewDecoder(r.Body).Decode(&input)
	res, err := database.DB.Exec("INSERT INTO medicamentos (mascota_id, nombre, dosis, frecuencia, duracion, fecha_inicio, veterinario, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
		petID, input.Nombre, input.Dosis, input.Frecuencia, input.Duracion, input.FechaInicio, input.Veterinario, input.Estado)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	input.ID, _ = res.LastInsertId()
	writeJSON(w, http.StatusCreated, input)
}

func UpdateMedication(w http.ResponseWriter, r *http.Request) {
	petID := chi.URLParam(r, "pet_id")
	id := chi.URLParam(r, "id")
	var input models.Medicamento
	_ = json.NewDecoder(r.Body).Decode(&input)
	_, _ = database.DB.Exec("UPDATE medicamentos SET nombre = ?, dosis = ?, frecuencia = ?, duracion = ?, fecha_inicio = ?, veterinario = ?, estado = ? WHERE id = ? AND mascota_id = ?",
		input.Nombre, input.Dosis, input.Frecuencia, input.Duracion, input.FechaInicio, input.Veterinario, input.Estado, id, petID)
	writeJSON(w, http.StatusOK, input)
}

func DeleteMedication(w http.ResponseWriter, r *http.Request) {
	petID := chi.URLParam(r, "pet_id")
	id := chi.URLParam(r, "id")
	_, _ = database.DB.Exec("DELETE FROM medicamentos WHERE id = ? AND mascota_id = ?", id, petID)
	writeJSON(w, http.StatusOK, map[string]string{"status": "deleted"})
}

// Laboratorios
func AddLaboratory(w http.ResponseWriter, r *http.Request) {
	petID := chi.URLParam(r, "pet_id")
	var input models.Laboratorio
	_ = json.NewDecoder(r.Body).Decode(&input)
	_, err := database.DB.Exec("INSERT INTO laboratorios (id, mascota_id, fecha, examen, laboratorio, telefono, sitio_web, direccion, convenio, director_tecnico, notas_generales) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		input.ID, petID, input.Fecha, input.Examen, input.Laboratorio, input.Telefono, input.SitioWeb, input.Direccion, input.Convenio, input.DirectorTecnico, input.NotasGenerales)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	for _, res := range input.Resultados {
		_, _ = database.DB.Exec("INSERT INTO laboratorio_resultados (laboratorio_id, nombre, resultado, unidad, rango_referencia, estado) VALUES (?, ?, ?, ?, ?, ?)",
			input.ID, res.Nombre, res.Resultado, res.Unidad, res.RangoReferencia, res.Estado)
	}
	writeJSON(w, http.StatusCreated, input)
}

func UpdateLaboratory(w http.ResponseWriter, r *http.Request) {
	petID := chi.URLParam(r, "pet_id")
	id := chi.URLParam(r, "id")
	var input models.Laboratorio
	_ = json.NewDecoder(r.Body).Decode(&input)
	_, _ = database.DB.Exec("UPDATE laboratorios SET fecha = ?, examen = ?, laboratorio = ?, telefono = ?, sitio_web = ?, direccion = ?, convenio = ?, director_tecnico = ?, notas_generales = ? WHERE id = ? AND mascota_id = ?",
		input.Fecha, input.Examen, input.Laboratorio, input.Telefono, input.SitioWeb, input.Direccion, input.Convenio, input.DirectorTecnico, input.NotasGenerales, id, petID)
	// Replace results
	_, _ = database.DB.Exec("DELETE FROM laboratorio_resultados WHERE laboratorio_id = ?", id)
	for _, res := range input.Resultados {
		_, _ = database.DB.Exec("INSERT INTO laboratorio_resultados (laboratorio_id, nombre, resultado, unidad, rango_referencia, estado) VALUES (?, ?, ?, ?, ?, ?)",
			id, res.Nombre, res.Resultado, res.Unidad, res.RangoReferencia, res.Estado)
	}
	writeJSON(w, http.StatusOK, input)
}

func DeleteLaboratory(w http.ResponseWriter, r *http.Request) {
	petID := chi.URLParam(r, "pet_id")
	id := chi.URLParam(r, "id")
	_, _ = database.DB.Exec("DELETE FROM laboratorios WHERE id = ? AND mascota_id = ?", id, petID)
	writeJSON(w, http.StatusOK, map[string]string{"status": "deleted"})
}

// Imagenes
func AddMedicalImage(w http.ResponseWriter, r *http.Request) {
	petID := chi.URLParam(r, "pet_id")
	var input models.ImagenMedica
	_ = json.NewDecoder(r.Body).Decode(&input)
	res, err := database.DB.Exec("INSERT INTO imagenes (mascota_id, fecha, tipo, nombre, indicacion, informe, doctor, imagen_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
		petID, input.Fecha, input.Tipo, input.Nombre, input.Indicacion, input.Informe, input.Doctor, input.ImagenURL)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	input.ID, _ = res.LastInsertId()
	writeJSON(w, http.StatusCreated, input)
}

func UpdateMedicalImage(w http.ResponseWriter, r *http.Request) {
	petID := chi.URLParam(r, "pet_id")
	id := chi.URLParam(r, "id")
	var input models.ImagenMedica
	_ = json.NewDecoder(r.Body).Decode(&input)
	_, _ = database.DB.Exec("UPDATE imagenes SET fecha = ?, tipo = ?, nombre = ?, indicacion = ?, informe = ?, doctor = ?, imagen_url = ? WHERE id = ? AND mascota_id = ?",
		input.Fecha, input.Tipo, input.Nombre, input.Indicacion, input.Informe, input.Doctor, input.ImagenURL, id, petID)
	writeJSON(w, http.StatusOK, input)
}

func DeleteMedicalImage(w http.ResponseWriter, r *http.Request) {
	petID := chi.URLParam(r, "pet_id")
	id := chi.URLParam(r, "id")
	_, _ = database.DB.Exec("DELETE FROM imagenes WHERE id = ? AND mascota_id = ?", id, petID)
	writeJSON(w, http.StatusOK, map[string]string{"status": "deleted"})
}
