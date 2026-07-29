from sqlalchemy import Column, Integer, String, Text, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Pet(Base):
    __tablename__ = "mascotas"

    id = Column(String, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    especie = Column(String, nullable=False)
    raza = Column(String)
    edad = Column(String)
    sexo = Column(String)
    peso_actual = Column(String)
    fecha_nacimiento = Column(String)
    microchip = Column(String)
    foto = Column(String)
    seguro = Column(String)
    clinica_frecuente = Column(String)

    propietario = relationship("Propietario", back_populates="pet", uselist=False, cascade="all, delete-orphan")
    alertas = relationship("Alerta", back_populates="pet", cascade="all, delete-orphan")
    diagnosticos = relationship("Diagnostico", back_populates="pet", cascade="all, delete-orphan")
    vacunas = relationship("Vacuna", back_populates="pet", cascade="all, delete-orphan")
    desparasitaciones = relationship("Desparasitacion", back_populates="pet", cascade="all, delete-orphan")
    medicamentos = relationship("Medicamento", back_populates="pet", cascade="all, delete-orphan")
    laboratorios = relationship("Laboratorio", back_populates="pet", cascade="all, delete-orphan")
    imagenes = relationship("ImagenMedica", back_populates="pet", cascade="all, delete-orphan")
    peso_historial = relationship("PesoRegistro", back_populates="pet", cascade="all, delete-orphan")
    diario = relationship("DiarioRegistro", back_populates="pet", cascade="all, delete-orphan")

class Propietario(Base):
    __tablename__ = "propietarios"

    id = Column(Integer, primary_key=True, index=True)
    mascota_id = Column(String, ForeignKey("mascotas.id", ondelete="CASCADE"), nullable=False, unique=True)
    nombre = Column(String, nullable=False)
    rut = Column(String)
    telefono = Column(String)
    email = Column(String)
    direccion = Column(String)

    pet = relationship("Pet", back_populates="propietario")

class Alerta(Base):
    __tablename__ = "alertas"

    id = Column(String, primary_key=True, index=True)
    mascota_id = Column(String, ForeignKey("mascotas.id", ondelete="CASCADE"), nullable=False)
    fecha = Column(String, nullable=True)
    tipo = Column(String)  # 'critica' or 'preventiva'
    titulo = Column(String, nullable=False)
    descripcion = Column(Text)
    estado = Column(String, default="activa")

    pet = relationship("Pet", back_populates="alertas")

class Diagnostico(Base):
    __tablename__ = "diagnosticos"

    id = Column(Integer, primary_key=True, index=True)
    mascota_id = Column(String, ForeignKey("mascotas.id", ondelete="CASCADE"), nullable=False)
    fecha = Column(String)
    tipo = Column(String)
    descripcion = Column(Text)
    doctor = Column(String)
    estado = Column(String)
    estado_color = Column(String)
    tipo_color = Column(String)
    clinica = Column(String)

    pet = relationship("Pet", back_populates="diagnosticos")

class Vacuna(Base):
    __tablename__ = "vacunas"

    id = Column(Integer, primary_key=True, index=True)
    mascota_id = Column(String, ForeignKey("mascotas.id", ondelete="CASCADE"), nullable=False)
    fecha = Column(String)
    nombre = Column(String, nullable=False)
    lote = Column(String)
    veterinario = Column(String)
    proxima_fecha = Column(String)
    estado = Column(String)
    estado_color = Column(String)

    pet = relationship("Pet", back_populates="vacunas")

class Desparasitacion(Base):
    __tablename__ = "desparasitaciones"

    id = Column(Integer, primary_key=True, index=True)
    mascota_id = Column(String, ForeignKey("mascotas.id", ondelete="CASCADE"), nullable=False)
    fecha = Column(String)
    tipo = Column(String)
    producto = Column(String)
    peso_mascota = Column(String)
    dosis = Column(String)
    proxima_fecha = Column(String)
    veterinario = Column(String)

    pet = relationship("Pet", back_populates="desparasitaciones")

class Medicamento(Base):
    __tablename__ = "medicamentos"

    id = Column(Integer, primary_key=True, index=True)
    mascota_id = Column(String, ForeignKey("mascotas.id", ondelete="CASCADE"), nullable=False)
    nombre = Column(String, nullable=False)
    dosis = Column(String)
    frecuencia = Column(String)
    duracion = Column(String)
    fecha_inicio = Column(String)
    veterinario = Column(String)
    estado = Column(String)

    pet = relationship("Pet", back_populates="medicamentos")

class Laboratorio(Base):
    __tablename__ = "laboratorios"

    id = Column(String, primary_key=True, index=True)
    mascota_id = Column(String, ForeignKey("mascotas.id", ondelete="CASCADE"), nullable=False)
    fecha = Column(String)
    examen = Column(String, nullable=False)
    laboratorio = Column(String)
    telefono = Column(String)
    sitio_web = Column(String)
    direccion = Column(String)
    convenio = Column(String)
    director_tecnico = Column(String)
    notas_generales = Column(Text)

    pet = relationship("Pet", back_populates="laboratorios")
    resultados = relationship("LabResult", back_populates="laboratorio", cascade="all, delete-orphan")

class LabResult(Base):
    __tablename__ = "laboratorio_resultados"

    id = Column(Integer, primary_key=True, index=True)
    laboratorio_id = Column(String, ForeignKey("laboratorios.id", ondelete="CASCADE"), nullable=False)
    nombre = Column(String, nullable=False)
    resultado = Column(String)
    unidad = Column(String)
    rango_referencia = Column(String)
    estado = Column(String)

    laboratorio = relationship("Laboratorio", back_populates="resultados")

class ImagenMedica(Base):
    __tablename__ = "imagenes"

    id = Column(Integer, primary_key=True, index=True)
    mascota_id = Column(String, ForeignKey("mascotas.id", ondelete="CASCADE"), nullable=False)
    fecha = Column(String)
    tipo = Column(String)
    nombre = Column(String, nullable=False)
    indicacion = Column(Text)
    informe = Column(Text)
    doctor = Column(String)
    imagen_url = Column(String)

    pet = relationship("Pet", back_populates="imagenes")

class PesoRegistro(Base):
    __tablename__ = "peso_historial"

    id = Column(Integer, primary_key=True, index=True)
    mascota_id = Column(String, ForeignKey("mascotas.id", ondelete="CASCADE"), nullable=False)
    fecha = Column(String)
    peso = Column(Numeric(precision=5, scale=2), nullable=False)

    pet = relationship("Pet", back_populates="peso_historial")

class DiarioRegistro(Base):
    __tablename__ = "diario"

    id = Column(Integer, primary_key=True, index=True)
    mascota_id = Column(String, ForeignKey("mascotas.id", ondelete="CASCADE"), nullable=False)
    fecha = Column(String)
    sintoma = Column(String, nullable=False)
    estado = Column(String)
    nota = Column(Text)

    pet = relationship("Pet", back_populates="diario")
