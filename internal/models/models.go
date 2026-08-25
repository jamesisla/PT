package models

// Pet represents a full pet medical record
type Pet struct {
	ID               string           `json:"id"`
	Nombre           string           `json:"nombre"`
	Especie          string           `json:"especie"`
	Raza             string           `json:"raza"`
	Edad             string           `json:"edad"`
	Sexo             string           `json:"sexo"`
	PesoActual       string           `json:"pesoActual"`
	FechaNacimiento  string           `json:"fechaNacimiento"`
	Microchip        string           `json:"microchip"`
	Foto             string           `json:"foto"`
	Seguro           string           `json:"seguro"`
	ClinicaFrecuente string           `json:"clinicaFrecuente"`
	Propietario      *Propietario     `json:"propietario"`
	Alertas          []Alerta         `json:"alertas"`
	Diagnosticos     []Diagnostico    `json:"diagnosticos"`
	Vacunas          []Vacuna         `json:"vacunas"`
	Desparasitaciones []Desparasitacion `json:"desparasitaciones"`
	Medicamentos     []Medicamento    `json:"medicamentos"`
	Laboratorios     []Laboratorio    `json:"laboratorios"`
	Imagenes         []ImagenMedica   `json:"imagenes"`
	PesoHistorial    []PesoRegistro   `json:"pesoHistorial"`
	Diario           []DiarioRegistro `json:"diario"`
}

// PetSummary represents a lightweight summary for header/switcher
type PetSummary struct {
	ID      string `json:"id"`
	Nombre  string `json:"nombre"`
	Especie string `json:"especie"`
	Raza    string `json:"raza"`
	Edad    string `json:"edad"`
	Foto    string `json:"foto"`
}

type Propietario struct {
	Nombre    string `json:"nombre"`
	RUT       string `json:"rut"`
	Telefono  string `json:"telefono"`
	Email     string `json:"email"`
	Direccion string `json:"direccion"`
}

type Alerta struct {
	ID          string `json:"id"`
	Tipo        string `json:"tipo"`
	Titulo      string `json:"titulo"`
	Descripcion string `json:"descripcion"`
	Estado      string `json:"estado"`
	Fecha       string `json:"fecha,omitempty"`
}

type Diagnostico struct {
	ID          int64  `json:"id"`
	Fecha       string `json:"fecha"`
	Tipo        string `json:"tipo"`
	TipoColor   string `json:"tipoColor"`
	Descripcion string `json:"descripcion"`
	Doctor      string `json:"doctor"`
	Estado      string `json:"estado"`
	EstadoColor string `json:"estadoColor"`
	Clinica     string `json:"clinica"`
}

type Vacuna struct {
	ID          int64  `json:"id"`
	Fecha       string `json:"fecha"`
	Nombre      string `json:"nombre"`
	Lote        string `json:"lote"`
	Veterinario string `json:"veterinario"`
	ProximaFecha string `json:"proximaFecha"`
	Estado      string `json:"estado"`
	EstadoColor string `json:"estadoColor"`
}

type Desparasitacion struct {
	ID          int64  `json:"id"`
	Fecha       string `json:"fecha"`
	Tipo        string `json:"tipo"`
	Producto    string `json:"producto"`
	PesoMascota string `json:"pesoMascota"`
	Dosis       string `json:"dosis"`
	ProximaFecha string `json:"proximaFecha"`
	Veterinario string `json:"veterinario"`
}

type Medicamento struct {
	ID          int64  `json:"id"`
	Nombre      string `json:"nombre"`
	Dosis       string `json:"dosis"`
	Frecuencia  string `json:"frecuencia"`
	Duracion    string `json:"duracion"`
	FechaInicio string `json:"fechaInicio"`
	Veterinario string `json:"veterinario"`
	Estado      string `json:"estado"`
}

type LabResult struct {
	ID              int64  `json:"id,omitempty"`
	Nombre          string `json:"nombre"`
	Resultado       string `json:"resultado"`
	Unidad          string `json:"unidad"`
	RangoReferencia string `json:"rangoReferencia"`
	Estado          string `json:"estado"`
}

type Laboratorio struct {
	ID              string      `json:"id"`
	Fecha           string      `json:"fecha"`
	Examen          string      `json:"examen"`
	Laboratorio     string      `json:"laboratorio"`
	Telefono        string      `json:"telefono"`
	SitioWeb        string      `json:"sitioWeb"`
	Direccion       string      `json:"direccion"`
	Convenio        string      `json:"convenio"`
	DirectorTecnico string      `json:"directorTecnico"`
	Resultados      []LabResult `json:"resultados"`
	NotasGenerales  string      `json:"notasGenerales"`
}

type ImagenMedica struct {
	ID         int64  `json:"id"`
	Fecha      string `json:"fecha"`
	Tipo       string `json:"tipo"`
	Nombre     string `json:"nombre"`
	Indicacion string `json:"indicacion"`
	Informe    string `json:"informe"`
	Doctor     string `json:"doctor"`
	ImagenURL  string `json:"imagenUrl"`
}

type PesoRegistro struct {
	ID    int64   `json:"id,omitempty"`
	Fecha string  `json:"fecha"`
	Peso  float64 `json:"peso"`
}

type DiarioRegistro struct {
	ID      int64  `json:"id"`
	Fecha   string `json:"fecha"`
	Sintoma string `json:"sintoma"`
	Estado  string `json:"estado"`
	Nota    string `json:"nota"`
}

// Place represents a pet business/service on OpenStreetMap
type Place struct {
	ID          int64   `json:"id"`
	Nombre      string  `json:"nombre"`
	Categoria   string  `json:"categoria"`
	Subtipo     string  `json:"subtipo"`
	Rating      float64 `json:"rating"`
	Reviews     int     `json:"reviews"`
	Direccion   string  `json:"direccion"`
	Telefono    string  `json:"telefono"`
	Whatsapp    string  `json:"whatsapp"`
	Tarifa      string  `json:"tarifa"`
	Horario     string  `json:"horario"`
	Lat         float64 `json:"lat"`
	Lng         float64 `json:"lng"`
	Descripcion string  `json:"descripcion"`
	ImagenURL   string  `json:"imagenUrl"`
}

// LostPet represents a community lost pet SOS alert
type LostPet struct {
	ID                  int64   `json:"id"`
	MascotaID           *string `json:"mascotaId,omitempty"`
	NombreMascota       string  `json:"nombreMascota"`
	Especie             string  `json:"especie"`
	Raza                string  `json:"raza"`
	Color               string  `json:"color"`
	Foto                string  `json:"foto"`
	FechaExtravio       string  `json:"fechaExtravio"`
	Lat                 float64 `json:"lat"`
	Lng                 float64 `json:"lng"`
	DireccionReferencia string  `json:"direccionReferencia"`
	Recompensa          string  `json:"recompensa,omitempty"`
	ContactoNombre      string  `json:"contactoNombre"`
	ContactoTelefono    string  `json:"contactoTelefono"`
	ContactoWhatsapp    string  `json:"contactoWhatsapp,omitempty"`
	Descripcion         string  `json:"descripcion"`
	Estado              string  `json:"estado"`
	RadioMetros         int     `json:"radioMetros"`
	CreatedAt           string  `json:"createdAt,omitempty"`
}
