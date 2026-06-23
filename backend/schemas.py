from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel
from typing import List, Optional

class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )

class PropietarioSchema(CamelModel):
    nombre: str
    rut: str
    telefono: str
    email: str
    direccion: str

class AlertaSchema(CamelModel):
    id: str
    tipo: str
    titulo: str
    descripcion: str
    estado: str = "activa"

class AlertaCreate(BaseModel):
    tipo: str
    titulo: str
    descripcion: str

class DiagnosticoSchema(CamelModel):
    id: int
    fecha: str
    tipo: str
    tipo_color: str
    descripcion: str
    doctor: str
    estado: str
    estado_color: str
    clinica: str

class DiagnosticoCreate(BaseModel):
    fecha: str
    tipo: str
    descripcion: str
    doctor: str
    estado: str
    clinica: str
    tipo_color: Optional[str] = "bg-blue-100 text-blue-700 border-blue-200"
    estado_color: Optional[str] = "bg-green-100 text-green-700"

class VacunaSchema(CamelModel):
    id: int
    fecha: str
    nombre: str
    lote: str
    veterinario: str
    proxima_fecha: str
    estado: str
    estado_color: str

class VacunaCreate(BaseModel):
    fecha: str
    nombre: str
    lote: Optional[str] = "N/A"
    veterinario: Optional[str] = "Dr. Veterinario Externo"
    proxima_fecha: Optional[str] = "No programada"
    estado: Optional[str] = "Applied"
    estado_color: Optional[str] = "bg-green-100 text-green-700"

class DesparasitacionSchema(CamelModel):
    id: int
    fecha: str
    tipo: str
    producto: str
    peso_mascota: str
    dosis: str
    proxima_fecha: str
    veterinario: str

class DesparasitacionCreate(BaseModel):
    fecha: str
    tipo: str
    producto: str
    peso_mascota: Optional[str] = "N/A"
    dosis: Optional[str] = "N/A"
    proxima_fecha: Optional[str] = "No programada"
    veterinario: Optional[str] = "Dueño (Auto-administrado)"

class MedicamentoSchema(CamelModel):
    id: int
    nombre: str
    dosis: str
    frecuencia: str
    duracion: str
    fecha_inicio: str
    veterinario: str
    estado: str

class MedicamentoCreate(BaseModel):
    nombre: str
    dosis: Optional[str] = ""
    frecuencia: Optional[str] = ""
    duracion: Optional[str] = ""
    fecha_inicio: Optional[str] = ""
    veterinario: Optional[str] = ""
    estado: Optional[str] = "Activo"

class LabResultSchema(CamelModel):
    nombre: str
    resultado: str
    unidad: str
    rango_referencia: str
    estado: str

class LaboratorioSchema(CamelModel):
    id: str
    fecha: str
    examen: str
    laboratorio: str
    telefono: str
    sitio_web: str
    direccion: str
    convenio: str
    director_tecnico: str
    resultados: List[LabResultSchema]
    notas_generales: Optional[str] = None

class ImagenMedicaSchema(CamelModel):
    id: int
    fecha: str
    tipo: str
    nombre: str
    indicacion: str
    informe: str
    doctor: str
    imagen_url: str

class LabResultCreate(BaseModel):
    nombre: str
    resultado: str
    unidad: str
    rango_referencia: str
    estado: str

class LaboratorioCreate(BaseModel):
    fecha: str
    examen: str
    laboratorio: str
    telefono: str
    sitio_web: str
    direccion: str
    convenio: str
    director_tecnico: str
    resultados: List[LabResultCreate] = []
    notas_generales: Optional[str] = None

class ImagenMedicaCreate(BaseModel):
    fecha: str
    tipo: str
    nombre: str
    indicacion: str
    informe: str
    doctor: str
    imagen_url: str

class PesoRegistroSchema(CamelModel):
    fecha: str
    peso: float

class PesoCreate(BaseModel):
    fecha: str
    peso: float

class DiarioRegistroSchema(CamelModel):
    id: int
    fecha: str
    sintoma: str
    estado: str
    nota: str

class DiarioCreate(BaseModel):
    fecha: str
    sintoma: str
    estado: str
    nota: Optional[str] = ""

class PetDetailSchema(CamelModel):
    id: str
    nombre: str
    especie: str
    raza: str
    edad: str
    sexo: str
    peso_actual: str
    fecha_nacimiento: str
    microchip: str
    foto: str
    seguro: str
    clinica_frecuente: str
    
    propietario: Optional[PropietarioSchema] = None
    alertas: List[AlertaSchema] = []
    diagnosticos: List[DiagnosticoSchema] = []
    vacunas: List[VacunaSchema] = []
    desparasitaciones: List[DesparasitacionSchema] = []
    medicamentos: List[MedicamentoSchema] = []
    laboratorios: List[LaboratorioSchema] = []
    imagenes: List[ImagenMedicaSchema] = []
    peso_historial: List[PesoRegistroSchema] = []
    diario: List[DiarioRegistroSchema] = []

class PetSummarySchema(CamelModel):
    id: str
    nombre: str
    especie: str
    raza: str
    edad: str
    foto: str

class PetUpdate(BaseModel):
    nombre: str
    especie: str
    raza: Optional[str] = ""
    edad: Optional[str] = ""
    sexo: Optional[str] = ""
    fecha_nacimiento: Optional[str] = ""
    microchip: Optional[str] = ""
    foto: Optional[str] = ""
    seguro: Optional[str] = ""
    clinica_frecuente: Optional[str] = ""

class PropietarioUpdate(BaseModel):
    nombre: str
    rut: Optional[str] = ""
    telefono: Optional[str] = ""
    email: Optional[str] = ""
    direccion: Optional[str] = ""
