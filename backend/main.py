from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import uuid

import models
import schemas
from database import get_db

app = FastAPI(title="Sania Pet Medical Record API")

# Configure CORS to allow requests from Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "Sania Pet API is running successfully"}

# GET all pets (summarized)
@app.get("/api/pets", response_model=list[schemas.PetSummarySchema])
def list_pets(db: Session = Depends(get_db)):
    pets = db.query(models.Pet).all()
    return pets

# GET a pet's full medical profile
@app.get("/api/pets/{pet_id}", response_model=schemas.PetDetailSchema)
def get_pet_detail(pet_id: str, db: Session = Depends(get_db)):
    pet = db.query(models.Pet).filter(models.Pet.id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet medical profile not found")
    
    # Sort weight history and journal to put newest at the end/beginning
    # Pydantic serialization handles relationship loads automatically
    return pet

# POST a symptom journal entry
@app.post("/api/pets/{pet_id}/sintomas", response_model=schemas.DiarioRegistroSchema)
def add_symptom(pet_id: str, symptom: schemas.DiarioCreate, db: Session = Depends(get_db)):
    pet = db.query(models.Pet).filter(models.Pet.id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    
    db_record = models.DiarioRegistro(
        mascota_id=pet_id,
        fecha=symptom.fecha,
        sintoma=symptom.sintoma,
        estado=symptom.estado,
        nota=symptom.nota
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

# POST a weight entry
@app.post("/api/pets/{pet_id}/peso", response_model=schemas.PesoRegistroSchema)
def add_weight_log(pet_id: str, weight: schemas.PesoCreate, db: Session = Depends(get_db)):
    pet = db.query(models.Pet).filter(models.Pet.id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    
    # Update current weight on the pet table
    pet.peso_actual = f"{weight.peso} kg"
    
    db_record = models.PesoRegistro(
        mascota_id=pet_id,
        fecha=weight.fecha,
        peso=weight.peso
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

# POST a vaccine entry
@app.post("/api/pets/{pet_id}/vacunas", response_model=schemas.VacunaSchema)
def add_vaccine(pet_id: str, vaccine: schemas.VacunaCreate, db: Session = Depends(get_db)):
    pet = db.query(models.Pet).filter(models.Pet.id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    
    db_record = models.Vacuna(
        mascota_id=pet_id,
        fecha=vaccine.fecha,
        nombre=vaccine.nombre,
        lote=vaccine.lote,
        veterinario=vaccine.veterinario,
        proxima_fecha=vaccine.proxima_fecha,
        estado=vaccine.estado,
        estado_color=vaccine.estado_color
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

# POST an alert/reminder
@app.post("/api/pets/{pet_id}/alertas", response_model=schemas.AlertaSchema)
def add_alert(pet_id: str, alert: schemas.AlertaCreate, db: Session = Depends(get_db)):
    pet = db.query(models.Pet).filter(models.Pet.id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    
    alert_id = f"al_{uuid.uuid4().hex[:6]}"
    
    db_record = models.Alerta(
        id=alert_id,
        mascota_id=pet_id,
        tipo=alert.tipo,
        titulo=alert.titulo.upper(),
        descripcion=alert.descripcion
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

# POST action on an alert (posponer, solucionar, olvidar)
@app.post("/api/alertas/{alerta_id}/action", response_model=schemas.AlertaSchema)
def action_alert(alerta_id: str, action: str, db: Session = Depends(get_db)):
    alert = db.query(models.Alerta).filter(models.Alerta.id == alerta_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    if action not in ["posponer", "solucionar", "olvidar"]:
        raise HTTPException(status_code=400, detail="Invalid action. Must be 'posponer', 'solucionar', or 'olvidar'")
    
    if action == "posponer":
        alert.estado = "pospuesta"
    elif action == "solucionar":
        alert.estado = "solucionada"
    elif action == "olvidar":
        alert.estado = "olvidada"
        
    db.commit()
    db.refresh(alert)
    return alert

# PUT update a symptom entry
@app.put("/api/pets/{pet_id}/sintomas/{sintoma_id}", response_model=schemas.DiarioRegistroSchema)
def update_symptom(pet_id: str, sintoma_id: int, symptom: schemas.DiarioCreate, db: Session = Depends(get_db)):
    db_record = db.query(models.DiarioRegistro).filter(
        models.DiarioRegistro.id == sintoma_id,
        models.DiarioRegistro.mascota_id == pet_id
    ).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="Symptom record not found")
    
    db_record.fecha = symptom.fecha
    db_record.sintoma = symptom.sintoma
    db_record.estado = symptom.estado
    db_record.nota = symptom.nota
    
    db.commit()
    db.refresh(db_record)
    return db_record

# DELETE a symptom entry
@app.delete("/api/pets/{pet_id}/sintomas/{sintoma_id}")
def delete_symptom(pet_id: str, sintoma_id: int, db: Session = Depends(get_db)):
    db_record = db.query(models.DiarioRegistro).filter(
        models.DiarioRegistro.id == sintoma_id,
        models.DiarioRegistro.mascota_id == pet_id
    ).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="Symptom record not found")
    
    db.delete(db_record)
    db.commit()
    return {"status": "success", "message": "Symptom record deleted"}

# PUT update a vaccine entry
@app.put("/api/pets/{pet_id}/vacunas/{vacuna_id}", response_model=schemas.VacunaSchema)
def update_vaccine(pet_id: str, vacuna_id: int, vaccine: schemas.VacunaCreate, db: Session = Depends(get_db)):
    db_record = db.query(models.Vacuna).filter(
        models.Vacuna.id == vacuna_id,
        models.Vacuna.mascota_id == pet_id
    ).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="Vaccine record not found")
    
    db_record.fecha = vaccine.fecha
    db_record.nombre = vaccine.nombre
    db_record.lote = vaccine.lote
    db_record.veterinario = vaccine.veterinario
    db_record.proxima_fecha = vaccine.proxima_fecha
    db_record.estado = vaccine.estado
    db_record.estado_color = vaccine.estado_color
    
    db.commit()
    db.refresh(db_record)
    return db_record

# DELETE a vaccine entry
@app.delete("/api/pets/{pet_id}/vacunas/{vacuna_id}")
def delete_vaccine(pet_id: str, vacuna_id: int, db: Session = Depends(get_db)):
    db_record = db.query(models.Vacuna).filter(
        models.Vacuna.id == vacuna_id,
        models.Vacuna.mascota_id == pet_id
    ).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="Vaccine record not found")
    
    db.delete(db_record)
    db.commit()
    return {"status": "success", "message": "Vaccine record deleted"}

# POST a medication entry
@app.post("/api/pets/{pet_id}/medicamentos", response_model=schemas.MedicamentoSchema)
def add_medication(pet_id: str, medication: schemas.MedicamentoCreate, db: Session = Depends(get_db)):
    pet = db.query(models.Pet).filter(models.Pet.id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    
    db_record = models.Medicamento(
        mascota_id=pet_id,
        nombre=medication.nombre,
        dosis=medication.dosis,
        frecuencia=medication.frecuencia,
        duracion=medication.duracion,
        fecha_inicio=medication.fecha_inicio,
        veterinario=medication.veterinario,
        estado=medication.estado
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

# PUT update a medication entry
@app.put("/api/pets/{pet_id}/medicamentos/{medicamento_id}", response_model=schemas.MedicamentoSchema)
def update_medication(pet_id: str, medicamento_id: int, medication: schemas.MedicamentoCreate, db: Session = Depends(get_db)):
    db_record = db.query(models.Medicamento).filter(
        models.Medicamento.id == medicamento_id,
        models.Medicamento.mascota_id == pet_id
    ).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="Medication record not found")
    
    db_record.nombre = medication.nombre
    db_record.dosis = medication.dosis
    db_record.frecuencia = medication.frecuencia
    db_record.duracion = medication.duracion
    db_record.fecha_inicio = medication.fecha_inicio
    db_record.veterinario = medication.veterinario
    db_record.estado = medication.estado
    
    db.commit()
    db.refresh(db_record)
    return db_record

# DELETE a medication entry
@app.delete("/api/pets/{pet_id}/medicamentos/{medicamento_id}")
def delete_medication(pet_id: str, medicamento_id: int, db: Session = Depends(get_db)):
    db_record = db.query(models.Medicamento).filter(
        models.Medicamento.id == medicamento_id,
        models.Medicamento.mascota_id == pet_id
    ).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="Medication record not found")
    
    db.delete(db_record)
    db.commit()
    return {"status": "success", "message": "Medication record deleted"}

# PUT update a pet profile
@app.put("/api/pets/{pet_id}", response_model=schemas.PetDetailSchema)
def update_pet(pet_id: str, pet_data: schemas.PetUpdate, db: Session = Depends(get_db)):
    pet = db.query(models.Pet).filter(models.Pet.id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    
    pet.nombre = pet_data.nombre
    pet.especie = pet_data.especie
    pet.raza = pet_data.raza
    pet.edad = pet_data.edad
    pet.sexo = pet_data.sexo
    pet.fecha_nacimiento = pet_data.fecha_nacimiento
    pet.microchip = pet_data.microchip
    pet.foto = pet_data.foto
    pet.seguro = pet_data.seguro
    pet.clinica_frecuente = pet_data.clinica_frecuente
    
    db.commit()
    db.refresh(pet)
    return pet

# PUT update owner details
@app.put("/api/pets/{pet_id}/propietario", response_model=schemas.PropietarioSchema)
def update_owner(pet_id: str, owner_data: schemas.PropietarioUpdate, db: Session = Depends(get_db)):
    owner = db.query(models.Propietario).filter(models.Propietario.mascota_id == pet_id).first()
    if not owner:
        raise HTTPException(status_code=404, detail="Owner details not found")
    
    owner.nombre = owner_data.nombre
    owner.rut = owner_data.rut
    owner.telefono = owner_data.telefono
    owner.email = owner_data.email
    owner.direccion = owner_data.direccion
    
    db.commit()
    db.refresh(owner)
    return owner

# POST a diagnosis record
@app.post("/api/pets/{pet_id}/diagnosticos", response_model=schemas.DiagnosticoSchema)
def add_diagnosis(pet_id: str, diag: schemas.DiagnosticoCreate, db: Session = Depends(get_db)):
    pet = db.query(models.Pet).filter(models.Pet.id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    
    db_record = models.Diagnostico(
        mascota_id=pet_id,
        fecha=diag.fecha,
        tipo=diag.tipo,
        tipo_color=diag.tipo_color,
        descripcion=diag.descripcion,
        doctor=diag.doctor,
        estado=diag.estado,
        estado_color=diag.estado_color,
        clinica=diag.clinica
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

# PUT update a diagnosis record
@app.put("/api/pets/{pet_id}/diagnosticos/{diagnostico_id}", response_model=schemas.DiagnosticoSchema)
def update_diagnosis(pet_id: str, diagnostico_id: int, diag: schemas.DiagnosticoCreate, db: Session = Depends(get_db)):
    db_record = db.query(models.Diagnostico).filter(
        models.Diagnostico.id == diagnostico_id,
        models.Diagnostico.mascota_id == pet_id
    ).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="Diagnosis record not found")
    
    db_record.fecha = diag.fecha
    db_record.tipo = diag.tipo
    db_record.tipo_color = diag.tipo_color
    db_record.descripcion = diag.descripcion
    db_record.doctor = diag.doctor
    db_record.estado = diag.estado
    db_record.estado_color = diag.estado_color
    db_record.clinica = diag.clinica
    
    db.commit()
    db.refresh(db_record)
    return db_record

# DELETE a diagnosis record
@app.delete("/api/pets/{pet_id}/diagnosticos/{diagnostico_id}")
def delete_diagnosis(pet_id: str, diagnostico_id: int, db: Session = Depends(get_db)):
    db_record = db.query(models.Diagnostico).filter(
        models.Diagnostico.id == diagnostico_id,
        models.Diagnostico.mascota_id == pet_id
    ).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="Diagnosis record not found")
    
    db.delete(db_record)
    db.commit()
    return {"status": "success", "message": "Diagnosis record deleted"}

# POST a deworming record
@app.post("/api/pets/{pet_id}/desparasitaciones", response_model=schemas.DesparasitacionSchema)
def add_deworming(pet_id: str, desp: schemas.DesparasitacionCreate, db: Session = Depends(get_db)):
    pet = db.query(models.Pet).filter(models.Pet.id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    
    db_record = models.Desparasitacion(
        mascota_id=pet_id,
        fecha=desp.fecha,
        tipo=desp.tipo,
        producto=desp.producto,
        peso_mascota=desp.peso_mascota,
        dosis=desp.dosis,
        proxima_fecha=desp.proxima_fecha,
        veterinario=desp.veterinario
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

# PUT update a deworming record
@app.put("/api/pets/{pet_id}/desparasitaciones/{desparasitacion_id}", response_model=schemas.DesparasitacionSchema)
def update_deworming(pet_id: str, desparasitacion_id: int, desp: schemas.DesparasitacionCreate, db: Session = Depends(get_db)):
    db_record = db.query(models.Desparasitacion).filter(
        models.Desparasitacion.id == desparasitacion_id,
        models.Desparasitacion.mascota_id == pet_id
    ).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="Deworming record not found")
    
    db_record.fecha = desp.fecha
    db_record.tipo = desp.tipo
    db_record.producto = desp.producto
    db_record.peso_mascota = desp.peso_mascota
    db_record.dosis = desp.dosis
    db_record.proxima_fecha = desp.proxima_fecha
    db_record.veterinario = desp.veterinario
    
    db.commit()
    db.refresh(db_record)
    return db_record

# DELETE a deworming record
@app.delete("/api/pets/{pet_id}/desparasitaciones/{desparasitacion_id}")
def delete_deworming(pet_id: str, desparasitacion_id: int, db: Session = Depends(get_db)):
    db_record = db.query(models.Desparasitacion).filter(
        models.Desparasitacion.id == desparasitacion_id,
        models.Desparasitacion.mascota_id == pet_id
    ).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="Deworming record not found")
    
    db.delete(db_record)
    db.commit()
    return {"status": "success", "message": "Deworming record deleted"}

# POST a laboratory record
@app.post("/api/pets/{pet_id}/laboratorios", response_model=schemas.LaboratorioSchema)
def add_laboratory(pet_id: str, lab: schemas.LaboratorioCreate, db: Session = Depends(get_db)):
    import uuid
    pet = db.query(models.Pet).filter(models.Pet.id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    
    lab_id = str(uuid.uuid4())
    db_lab = models.Laboratorio(
        id=lab_id,
        mascota_id=pet_id,
        fecha=lab.fecha,
        examen=lab.examen,
        laboratorio=lab.laboratorio,
        telefono=lab.telefono,
        sitio_web=lab.sitio_web,
        direccion=lab.direccion,
        convenio=lab.convenio,
        director_tecnico=lab.director_tecnico,
        notas_generales=lab.notas_generales
    )
    db.add(db_lab)
    
    for res in lab.resultados:
        db_res = models.LabResult(
            laboratorio_id=lab_id,
            nombre=res.nombre,
            resultado=res.resultado,
            unidad=res.unidad,
            rango_referencia=res.rango_referencia,
            estado=res.estado
        )
        db.add(db_res)
        
    db.commit()
    db.refresh(db_lab)
    return db_lab

# PUT update a laboratory record
@app.put("/api/pets/{pet_id}/laboratorios/{laboratorio_id}", response_model=schemas.LaboratorioSchema)
def update_laboratory(pet_id: str, laboratorio_id: str, lab: schemas.LaboratorioCreate, db: Session = Depends(get_db)):
    db_lab = db.query(models.Laboratorio).filter(
        models.Laboratorio.id == laboratorio_id,
        models.Laboratorio.mascota_id == pet_id
    ).first()
    if not db_lab:
        raise HTTPException(status_code=404, detail="Laboratory record not found")
    
    db_lab.fecha = lab.fecha
    db_lab.examen = lab.examen
    db_lab.laboratorio = lab.laboratorio
    db_lab.telefono = lab.telefono
    db_lab.sitio_web = lab.sitio_web
    db_lab.direccion = lab.direccion
    db_lab.convenio = lab.convenio
    db_lab.director_tecnico = lab.director_tecnico
    db_lab.notas_generales = lab.notas_generales
    
    # Delete existing results and recreate them to keep it clean
    db.query(models.LabResult).filter(models.LabResult.laboratorio_id == laboratorio_id).delete()
    
    for res in lab.resultados:
        db_res = models.LabResult(
            laboratorio_id=laboratorio_id,
            nombre=res.nombre,
            resultado=res.resultado,
            unidad=res.unidad,
            rango_referencia=res.rango_referencia,
            estado=res.estado
        )
        db.add(db_res)
        
    db.commit()
    db.refresh(db_lab)
    return db_lab

# DELETE a laboratory record
@app.delete("/api/pets/{pet_id}/laboratorios/{laboratorio_id}")
def delete_laboratory(pet_id: str, laboratorio_id: str, db: Session = Depends(get_db)):
    db_lab = db.query(models.Laboratorio).filter(
        models.Laboratorio.id == laboratorio_id,
        models.Laboratorio.mascota_id == pet_id
    ).first()
    if not db_lab:
        raise HTTPException(status_code=404, detail="Laboratory record not found")
        
    db.delete(db_lab)
    db.commit()
    return {"status": "success", "message": "Laboratory record deleted"}

# POST a medical image record
@app.post("/api/pets/{pet_id}/imagenes", response_model=schemas.ImagenMedicaSchema)
def add_image(pet_id: str, img: schemas.ImagenMedicaCreate, db: Session = Depends(get_db)):
    pet = db.query(models.Pet).filter(models.Pet.id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
        
    db_img = models.ImagenMedica(
        mascota_id=pet_id,
        fecha=img.fecha,
        tipo=img.tipo,
        nombre=img.nombre,
        indicacion=img.indicacion,
        informe=img.informe,
        doctor=img.doctor,
        imagen_url=img.imagen_url
    )
    db.add(db_img)
    db.commit()
    db.refresh(db_img)
    return db_img

# PUT update a medical image record
@app.put("/api/pets/{pet_id}/imagenes/{imagen_id}", response_model=schemas.ImagenMedicaSchema)
def update_image(pet_id: str, imagen_id: int, img: schemas.ImagenMedicaCreate, db: Session = Depends(get_db)):
    db_img = db.query(models.ImagenMedica).filter(
        models.ImagenMedica.id == imagen_id,
        models.ImagenMedica.mascota_id == pet_id
    ).first()
    if not db_img:
        raise HTTPException(status_code=404, detail="Medical image record not found")
        
    db_img.fecha = img.fecha
    db_img.tipo = img.tipo
    db_img.nombre = img.nombre
    db_img.indicacion = img.indicacion
    db_img.informe = img.informe
    db_img.doctor = img.doctor
    db_img.imagen_url = img.imagen_url
    
    db.commit()
    db.refresh(db_img)
    return db_img

# DELETE a medical image record
@app.delete("/api/pets/{pet_id}/imagenes/{imagen_id}")
def delete_image(pet_id: str, imagen_id: int, db: Session = Depends(get_db)):
    db_img = db.query(models.ImagenMedica).filter(
        models.ImagenMedica.id == imagen_id,
        models.ImagenMedica.mascota_id == pet_id
    ).first()
    if not db_img:
        raise HTTPException(status_code=404, detail="Medical image record not found")
        
    db.delete(db_img)
    db.commit()
    return {"status": "success", "message": "Medical image record deleted"}

