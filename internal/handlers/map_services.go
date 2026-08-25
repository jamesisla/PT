package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/jamesisla/PT/internal/database"
	"github.com/jamesisla/PT/internal/models"
)

// GET /api/servicios
func ListServicios(w http.ResponseWriter, r *http.Request) {
	categoria := r.URL.Query().Get("categoria")

	var rows *sql.Rows
	var err error

	if categoria != "" && categoria != "todos" {
		rows, err = database.DB.Query(`
			SELECT id, nombre, categoria, subtipo, rating, reviews, direccion, telefono, whatsapp, tarifa, horario, lat, lng, descripcion, imagen_url
			FROM servicios_pet WHERE categoria = ? ORDER BY id ASC
		`, categoria)
	} else {
		rows, err = database.DB.Query(`
			SELECT id, nombre, categoria, subtipo, rating, reviews, direccion, telefono, whatsapp, tarifa, horario, lat, lng, descripcion, imagen_url
			FROM servicios_pet ORDER BY id ASC
		`)
	}

	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	var list []models.Place
	for rows.Next() {
		var p models.Place
		var sub, tel, wsp, tar, hor, desc, img sql.NullString
		if err := rows.Scan(
			&p.ID, &p.Nombre, &p.Categoria, &sub, &p.Rating, &p.Reviews,
			&p.Direccion, &tel, &wsp, &tar, &hor, &p.Lat, &p.Lng, &desc, &img,
		); err != nil {
			writeError(w, http.StatusInternalServerError, err.Error())
			return
		}
		p.Subtipo = sub.String
		p.Telefono = tel.String
		p.Whatsapp = wsp.String
		p.Tarifa = tar.String
		p.Horario = hor.String
		p.Descripcion = desc.String
		p.ImagenURL = img.String
		list = append(list, p)
	}

	if list == nil {
		list = []models.Place{}
	}
	writeJSON(w, http.StatusOK, list)
}

// POST /api/servicios
func CreateServicio(w http.ResponseWriter, r *http.Request) {
	var input models.Place
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid JSON body")
		return
	}

	if input.Rating == 0 {
		input.Rating = 5.0
	}

	res, err := database.DB.Exec(`
		INSERT INTO servicios_pet (nombre, categoria, subtipo, rating, reviews, direccion, telefono, whatsapp, tarifa, horario, lat, lng, descripcion, imagen_url)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`, input.Nombre, input.Categoria, input.Subtipo, input.Rating, input.Reviews, input.Direccion, input.Telefono, input.Whatsapp, input.Tarifa, input.Horario, input.Lat, input.Lng, input.Descripcion, input.ImagenURL)

	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	input.ID, _ = res.LastInsertId()
	writeJSON(w, http.StatusCreated, input)
}

// GET /api/mascotas-perdidas
func ListMascotasPerdidas(w http.ResponseWriter, r *http.Request) {
	estado := r.URL.Query().Get("estado")

	var rows *sql.Rows
	var err error

	if estado != "" && estado != "todos" {
		rows, err = database.DB.Query(`
			SELECT id, mascota_id, nombre_mascota, especie, raza, color, foto, fecha_extravio, lat, lng, direccion_referencia, recompensa, contacto_nombre, contacto_telefono, contacto_whatsapp, descripcion, estado, radio_metros, created_at
			FROM mascotas_perdidas WHERE estado = ? ORDER BY id DESC
		`, estado)
	} else {
		rows, err = database.DB.Query(`
			SELECT id, mascota_id, nombre_mascota, especie, raza, color, foto, fecha_extravio, lat, lng, direccion_referencia, recompensa, contacto_nombre, contacto_telefono, contacto_whatsapp, descripcion, estado, radio_metros, created_at
			FROM mascotas_perdidas ORDER BY id DESC
		`)
	}

	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer rows.Close()

	var list []models.LostPet
	for rows.Next() {
		var p models.LostPet
		var mID, raza, color, foto, recomp, wsp, desc, cat sql.NullString
		if err := rows.Scan(
			&p.ID, &mID, &p.NombreMascota, &p.Especie, &raza, &color, &foto, &p.FechaExtravio,
			&p.Lat, &p.Lng, &p.DireccionReferencia, &recomp, &p.ContactoNombre, &p.ContactoTelefono, &wsp, &desc, &p.Estado, &p.RadioMetros, &cat,
		); err != nil {
			writeError(w, http.StatusInternalServerError, err.Error())
			return
		}
		if mID.Valid {
			p.MascotaID = &mID.String
		}
		p.Raza = raza.String
		p.Color = color.String
		p.Foto = foto.String
		p.Recompensa = recomp.String
		p.ContactoWhatsapp = wsp.String
		p.Descripcion = desc.String
		p.CreatedAt = cat.String
		list = append(list, p)
	}

	if list == nil {
		list = []models.LostPet{}
	}
	writeJSON(w, http.StatusOK, list)
}

// POST /api/mascotas-perdidas
func ReportMascotaPerdida(w http.ResponseWriter, r *http.Request) {
	var input models.LostPet
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid JSON body")
		return
	}

	if input.Estado == "" {
		input.Estado = "perdida"
	}
	if input.RadioMetros == 0 {
		input.RadioMetros = 300
	}
	if input.CreatedAt == "" {
		input.CreatedAt = time.Now().Format("2006-01-02 15:04")
	}

	res, err := database.DB.Exec(`
		INSERT INTO mascotas_perdidas (mascota_id, nombre_mascota, especie, raza, color, foto, fecha_extravio, lat, lng, direccion_referencia, recompensa, contacto_nombre, contacto_telefono, contacto_whatsapp, descripcion, estado, radio_metros, created_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`, input.MascotaID, input.NombreMascota, input.Especie, input.Raza, input.Color, input.Foto, input.FechaExtravio, input.Lat, input.Lng, input.DireccionReferencia, input.Recompensa, input.ContactoNombre, input.ContactoTelefono, input.ContactoWhatsapp, input.Descripcion, input.Estado, input.RadioMetros, input.CreatedAt)

	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	input.ID, _ = res.LastInsertId()
	writeJSON(w, http.StatusCreated, input)
}

// PATCH /api/mascotas-perdidas/{id}/estado
func UpdateEstadoMascotaPerdida(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var body struct {
		Estado string `json:"estado"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid JSON body")
		return
	}

	_, err := database.DB.Exec("UPDATE mascotas_perdidas SET estado = ? WHERE id = ?", body.Estado, id)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{"id": id, "estado": body.Estado})
}

// DELETE /api/mascotas-perdidas/{id}
func DeleteMascotaPerdida(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	_, err := database.DB.Exec("DELETE FROM mascotas_perdidas WHERE id = ?", id)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "deleted"})
}
