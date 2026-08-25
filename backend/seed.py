from database import Base, engine, SessionLocal
import models

def seed_database():
    print("Iniciando creación de tablas...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("Tablas creadas exitosamente.")

    db = SessionLocal()

    try:
        print("Insertando datos de Luna...")
        luna = models.Pet(
            id="luna",
            nombre="Luna",
            especie="Perro",
            raza="Beagle",
            edad="3 años",
            sexo="Hembra (Esterilizada)",
            peso_actual="12.4 kg",
            fecha_nacimiento="12/03/2023",
            microchip="981022300456123",
            foto="https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&q=80&w=300&h=300",
            seguro="PetPlan Gold (80% Cobertura)",
            clinica_frecuente="Hospital Veterinario Sania Pet"
        )
        db.add(luna)
        db.flush() # obtiene id y locks

        # Propietario
        luna_owner = models.Propietario(
            mascota_id="luna",
            nombre="Jota Robles",
            rut="17.654.321-K",
            telefono="+56 9 8765 4321",
            email="jota.robles@saniapet.cl",
            direccion="Av. Providencia 1234, Santiago"
        )
        db.add(luna_owner)

        # Alertas
        db.add_all([
            models.Alerta(id="al1", mascota_id="luna", tipo="critica", titulo="ALERGIA A LA IVERMECTINA", descripcion="Mutación del gen MDR1 confirmada. No administrar antiparasitarios con esta droga."),
            models.Alerta(id="al2", mascota_id="luna", tipo="preventiva", titulo="VACUNA ANTIRRÁBICA PRÓXIMA A VENCER", descripcion="Vence el 15/07/2026. Agendar hora de renovación.")
        ])

        # Diagnosticos
        db.add_all([
            models.Diagnostico(mascota_id="luna", fecha="10/05/2026", tipo="Consulta General", tipo_color="bg-blue-100 text-blue-700 border-blue-200", descripcion="Control sano anual y chequeo de peso.", doctor="Dra. Sandra Valenzuela", estado="Resuelto", estado_color="bg-green-100 text-green-700", clinica="Hospital Veterinario Sania Pet"),
            models.Diagnostico(mascota_id="luna", fecha="24/03/2026", tipo="Urgencia", tipo_color="bg-red-100 text-red-700 border-red-200", descripcion="Gastroenteritis aguda alimentaria. Ingesta de restos en la calle.", doctor="Dr. Roberto Cáceres", estado="Resuelto", estado_color="bg-green-100 text-green-700", clinica="Urgencias Sania Pet 24/7"),
            models.Diagnostico(mascota_id="luna", fecha="15/01/2026", tipo="Especialidad", tipo_color="bg-purple-100 text-purple-700 border-purple-200", descripcion="Otitis externa bilateral por hongos. Tratamiento ótico indicado.", doctor="Dra. María Paz Gómez (Dermatología)", estado="Controlado", estado_color="bg-blue-100 text-blue-700", clinica="Hospital Veterinario Sania Pet")
        ])

        # Vacunas
        db.add_all([
            models.Vacuna(mascota_id="luna", fecha="15/07/2025", nombre="Antirrábica (Rabigen)", lote="RAB-9923B", veterinario="Dra. Sandra Valenzuela", proxima_fecha="15/07/2026", estado="Aplicada", estado_color="bg-green-100 text-green-700"),
            models.Vacuna(mascota_id="luna", fecha="12/03/2026", nombre="Séxtuple Canina (Defensor 6)", lote="SEX-8840A", veterinario="Dra. Sandra Valenzuela", proxima_fecha="12/03/2027", estado="Aplicada", estado_color="bg-green-100 text-green-700"),
            models.Vacuna(mascota_id="luna", fecha="05/11/2025", nombre="KC Bronchicine (Tos de las perreras)", lote="KC-7721C", veterinario="Dr. Roberto Cáceres", proxima_fecha="05/11/2026", estado="Aplicada", estado_color="bg-green-100 text-green-700"),
            # upcoming to show in alerts
            models.Vacuna(mascota_id="luna", fecha="Pendiente", nombre="Refuerzo Antirrábica", lote="N/A", veterinario="Por designar", proxima_fecha="15/07/2026", estado="Vencida", estado_color="bg-red-100 text-red-700")
        ])

        # Desparasitaciones
        db.add_all([
            models.Desparasitacion(mascota_id="luna", fecha="10/06/2026", tipo="Externa", producto="NexGard Spectra M", peso_mascota="12.4 kg", dosis="1 tableta masticable (15-30 mg)", proxima_fecha="10/07/2026", veterinario="Dueño (Auto-administrado)"),
            models.Desparasitacion(mascota_id="luna", fecha="12/03/2026", tipo="Interna", producto="Drontal Plus Perros", peso_mascota="12.1 kg", dosis="1 tableta y cuarto", proxima_fecha="12/06/2026", veterinario="Dra. Sandra Valenzuela"),
            models.Desparasitacion(mascota_id="luna", fecha="10/03/2026", tipo="Externa", producto="Bravecto Perros Medianos", peso_mascota="12.0 kg", dosis="1 tableta (500 mg)", proxima_fecha="10/06/2026", veterinario="Dueño (Auto-administrado)")
        ])

        # Medicamentos
        db.add_all([
            models.Medicamento(mascota_id="luna", nombre="Prednisona 5mg (Comprimidos)", dosis="1/2 tableta", frecuencia="Cada 24 horas", duracion="Terminado el 20/05/2026", fecha_inicio="15/05/2026", veterinario="Dra. Sandra Valenzuela", estado="Completado"),
            models.Medicamento(mascota_id="luna", nombre="Glandulex Sacs (Suplemento de fibra)", dosis="1 croqueta masticable", frecuencia="Cada 24 horas (Con alimento)", duracion="Uso continuo preventivo", fecha_inicio="10/05/2026", veterinario="Dra. Sandra Valenzuela", estado="Activo")
        ])

        # Laboratorios
        lab1 = models.Laboratorio(
            id="2026-05-883",
            mascota_id="luna",
            fecha="10/05/2026",
            examen="Hemograma Completo Automatizado",
            laboratorio="Veterinary Diagnostics Lab Sania",
            telefono="+56 2 2987 6543",
            sitio_web="lab.saniapet.cl",
            direccion="Av. Vitacura 5400, Santiago",
            convenio="PetPlan Seguro Veterinario",
            director_tecnico="Dr. Fernando Leyton (Patólogo Clínico)",
            notas_generales="Todos los parámetros hematológicos se encuentran dentro de los rangos de referencia para la especie canina. Serie roja y plaquetaria normales. Sin presencia de parásitos hemáticos."
        )
        db.add(lab1)
        db.flush()

        db.add_all([
            models.LabResult(laboratorio_id="2026-05-883", nombre="Hematocrito", resultado="45.2", unidad="%", rango_referencia="37.0 - 55.0", estado="Normal"),
            models.LabResult(laboratorio_id="2026-05-883", nombre="Hemoglobina", resultado="15.6", unidad="g/dL", rango_referencia="12.0 - 18.0", estado="Normal"),
            models.LabResult(laboratorio_id="2026-05-883", nombre="Eritrocitos", resultado="6.8", unidad="x10^6/uL", rango_referencia="5.5 - 8.5", estado="Normal"),
            models.LabResult(laboratorio_id="2026-05-883", nombre="Leucocitos Totales", resultado="10.4", unidad="x10^3/uL", rango_referencia="6.0 - 17.0", estado="Normal"),
            models.LabResult(laboratorio_id="2026-05-883", nombre="Segmentados (Neutrófilos)", resultado="7.2", unidad="x10^3/uL", rango_referencia="3.0 - 11.5", estado="Normal"),
            models.LabResult(laboratorio_id="2026-05-883", nombre="Linfocitos", resultado="2.1", unidad="x10^3/uL", rango_referencia="1.0 - 4.8", estado="Normal"),
            models.LabResult(laboratorio_id="2026-05-883", nombre="Plaquetas", resultado="320", unidad="x10^3/uL", rango_referencia="150 - 500", estado="Normal")
        ])

        lab2 = models.Laboratorio(
            id="2026-03-412",
            mascota_id="luna",
            fecha="24/03/2026",
            examen="Perfil Bioquímico Sanguíneo Básico",
            laboratorio="Veterinary Diagnostics Lab Sania",
            telefono="+56 2 2987 6543",
            sitio_web="lab.saniapet.cl",
            direccion="Av. Vitacura 5400, Santiago",
            convenio="Particular",
            director_tecnico="Dr. Fernando Leyton (Patólogo Clínico)",
            notas_generales="Elevación discreta de GPT/ALT y Amilasa debido a la gastroenteritis aguda de la paciente. Glucosa y función renal óptimas."
        )
        db.add(lab2)
        db.flush()

        db.add_all([
            models.LabResult(laboratorio_id="2026-03-412", nombre="Glucosa", resultado="95", unidad="mg/dL", rango_referencia="70 - 110", estado="Normal"),
            models.LabResult(laboratorio_id="2026-03-412", nombre="Urea", resultado="25", unidad="mg/dL", rango_referencia="10 - 45", estado="Normal"),
            models.LabResult(laboratorio_id="2026-03-412", nombre="Creatinina", resultado="0.9", unidad="mg/dL", rango_referencia="0.5 - 1.5", estado="Normal"),
            models.LabResult(laboratorio_id="2026-03-412", nombre="Proteínas Totales", resultado="6.4", unidad="g/dL", rango_referencia="5.4 - 7.5", estado="Normal"),
            models.LabResult(laboratorio_id="2026-03-412", nombre="GPT / ALT (Hepático)", resultado="92", unidad="U/L", rango_referencia="10 - 80", estado="Alto"),
            models.LabResult(laboratorio_id="2026-03-412", nombre="Fosfatasa Alcalina", resultado="68", unidad="U/L", rango_referencia="20 - 150", estado="Normal")
        ])

        # Imagenes
        db.add(models.ImagenMedica(
            mascota_id="luna",
            fecha="24/03/2026",
            tipo="Radiografía",
            nombre="Radiografía de Abdomen Simple (Lateral/Ventrodorsal)",
            indicacion="Evaluar presencia de cuerpos extraños por gastroenteritis aguda.",
            doctor="Dr. Ignacio Valdivia (Radiólogo)",
            informe="Se observan estómago y asas intestinales con moderada acumulación de gas. No se visualizan imágenes radiopacas compatibles con cuerpos extraños obstructivos metálicos ni óseos. Estructura hepática y silueta vesical dentro de límites normales.",
            imagen_url="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400&h=300"
        ))

        # Peso historial
        db.add_all([
            models.PesoRegistro(mascota_id="luna", fecha="Oct 25", peso=11.5),
            models.PesoRegistro(mascota_id="luna", fecha="Nov 25", peso=11.8),
            models.PesoRegistro(mascota_id="luna", fecha="Dic 25", peso=11.9),
            models.PesoRegistro(mascota_id="luna", fecha="Ene 26", peso=12.0),
            models.PesoRegistro(mascota_id="luna", fecha="Mar 26", peso=12.1),
            models.PesoRegistro(mascota_id="luna", fecha="May 26", peso=12.4)
        ])

        # Diario
        db.add_all([
            models.DiarioRegistro(mascota_id="luna", fecha="22/06/2026", sintoma="Buen apetito", estado="Normal", nota="Comió todo su alimento habitual y anduvo con bastante energía."),
            models.DiarioRegistro(mascota_id="luna", fecha="18/06/2026", sintoma="Prurito leve en oreja derecha", estado="Atención", nota="Se rascó un par de veces por la tarde, pero el canal auditivo se ve limpio y seco.")
        ])


        print("Insertando datos de Max...")
        max_pet = models.Pet(
            id="max",
            nombre="Max",
            especie="Gato",
            raza="Persa",
            edad="5 años",
            sexo="Macho (Castrado)",
            peso_actual="4.8 kg",
            fecha_nacimiento="08/09/2021",
            microchip="981022300456987",
            foto="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300&h=300",
            seguro="Sura Pets Plan Base (60% Cobertura)",
            clinica_frecuente="Hospital Veterinario Sania Pet"
        )
        db.add(max_pet)
        db.flush()

        # Propietario
        max_owner = models.Propietario(
            mascota_id="max",
            nombre="Jota Robles",
            rut="17.654.321-K",
            telefono="+56 9 8765 4321",
            email="jota.robles@saniapet.cl",
            direccion="Av. Providencia 1234, Santiago"
        )
        db.add(max_owner)

        # Alertas
        db.add(models.Alerta(
            id="al3",
            mascota_id="max",
            tipo="critica",
            titulo="SÍNDROME URINARIO FELINO (FLUTD)",
            descripcion="Antecedentes de obstrucción uretral. Monitorear micción diaria y mantener alimento húmedo medicado."
        ))

        # Diagnosticos
        db.add_all([
            models.Diagnostico(mascota_id="max", fecha="18/04/2026", tipo="Consulta General", tipo_color="bg-blue-100 text-blue-700 border-blue-200", descripcion="Control renal preventivo y revisión odontológica general.", doctor="Dr. Francisco Muñoz (Medicina Felina)", estado="En control", estado_color="bg-blue-100 text-blue-700", clinica="Hospital Veterinario Sania Pet"),
            models.Diagnostico(mascota_id="max", fecha="05/12/2025", tipo="Urgencia", tipo_color="bg-red-100 text-red-700 border-red-200", descripcion="Dificultad al orinar (Disuria). Arenilla vesical detectada mediante ecografía.", doctor="Dra. Sandra Valenzuela", estado="Resuelto", estado_color="bg-green-100 text-green-700", clinica="Hospital Veterinario Sania Pet")
        ])

        # Vacunas
        db.add_all([
            models.Vacuna(mascota_id="max", fecha="10/09/2025", nombre="Triple Felina (Feline Vax 3)", lote="TF-2212E", veterinario="Dr. Francisco Muñoz", proxima_fecha="10/09/2026", estado="Aplicada", estado_color="bg-green-100 text-green-700"),
            models.Vacuna(mascota_id="max", fecha="10/09/2025", nombre="Antirrábica Felina", lote="RAB-FEL-92A", veterinario="Dr. Francisco Muñoz", proxima_fecha="10/09/2026", estado="Aplicada", estado_color="bg-green-100 text-green-700"),
            models.Vacuna(mascota_id="max", fecha="15/10/2024", nombre="Leucemia Felina (Leukocell 2)", lote="LF-3401D", veterinario="Dra. Sandra Valenzuela", proxima_fecha="15/10/2025", estado="Vencida", estado_color="bg-red-100 text-red-700")
        ])

        # Desparasitaciones
        db.add_all([
            models.Desparasitacion(mascota_id="max", fecha="20/05/2026", tipo="Externa", producto="Bravecto Plus Gatos (Pipeta)", peso_mascota="4.8 kg", dosis="1 pipeta aplicación tópica (112.5 mg)", proxima_fecha="20/08/2026", veterinario="Dueño (Auto-administrado)"),
            models.Desparasitacion(mascota_id="max", fecha="10/03/2026", tipo="Interna", producto="Milbemax Gatos", peso_mascota="4.7 kg", dosis="1 tableta", proxima_fecha="10/06/2026", veterinario="Dr. Francisco Muñoz")
        ])

        # Medicamentos
        db.add(models.Medicamento(
            mascota_id="max",
            nombre="Royal Canin Urinary S/O Wet (Alimento Húmedo)",
            dosis="1 sobre al día",
            frecuencia="Cada 24 horas",
            duracion="Permanente",
            fecha_inicio="06/12/2025",
            veterinario="Dr. Francisco Muñoz",
            estado="Activo"
        ))

        # Laboratorios
        max_lab = models.Laboratorio(
            id="2026-04-102",
            mascota_id="max",
            fecha="18/04/2026",
            examen="Perfil Bioquímico Felino y Urianálisis",
            laboratorio="Veterinary Diagnostics Lab Sania",
            telefono="+56 2 2987 6543",
            sitio_web="lab.saniapet.cl",
            direccion="Av. Vitacura 5400, Santiago",
            convenio="Particular",
            director_tecnico="Dr. Fernando Leyton (Patólogo Clínico)",
            notas_generales="El perfil renal muestra valores de SDMA, Creatinina y BUN estables. El examen de orina indica un pH de 6.2 con ausencia de cristales de estruvita. Continuar con dieta Urinary S/O."
        )
        db.add(max_lab)
        db.flush()

        db.add_all([
            models.LabResult(laboratorio_id="2026-04-102", nombre="Glucosa", resultado="88", unidad="mg/dL", rango_referencia="70 - 150", estado="Normal"),
            models.LabResult(laboratorio_id="2026-04-102", nombre="BUN (Nitrógeno Ureico)", resultado="22", unidad="mg/dL", rango_referencia="15 - 34", estado="Normal"),
            models.LabResult(laboratorio_id="2026-04-102", nombre="Creatinina Sérica", resultado="1.3", unidad="mg/dL", rango_referencia="0.8 - 2.0", estado="Normal"),
            models.LabResult(laboratorio_id="2026-04-102", nombre="SDMA (Marcador Precoz)", resultado="11", unidad="ug/dL", rango_referencia="0 - 14", estado="Normal"),
            models.LabResult(laboratorio_id="2026-04-102", nombre="Densidad Urinaria", resultado="1.045", unidad="g/ml", rango_referencia="> 1.035", estado="Normal"),
            models.LabResult(laboratorio_id="2026-04-102", nombre="pH Orina", resultado="6.2", unidad="pH", rango_referencia="6.0 - 7.0", estado="Normal")
        ])

        # Imagenes
        db.add(models.ImagenMedica(
            mascota_id="max",
            fecha="05/12/2025",
            tipo="Ecografía",
            nombre="Ecografía de Vías Urinarias y Vejiga",
            indicacion="Descartar urolitos vesicales u obstrucción renal por disuria severa.",
            doctor="Dra. Elena Pastene (Ecografista)",
            informe="Vejiga con pared levemente engrosada (cistitis). Presencia de abundante sedimento urinario en suspensión compatible con arenilla/microcristales. No se aprecian cálculos de gran tamaño productores de sombra acústica. Riñones conservan adecuada relación cortico-medular.",
            imagen_url="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400&h=300"
        ))

        # Peso historial
        db.add_all([
            models.PesoRegistro(mascota_id="max", fecha="Oct 25", peso=4.5),
            models.PesoRegistro(mascota_id="max", fecha="Nov 25", peso=4.6),
            models.PesoRegistro(mascota_id="max", fecha="Dic 25", peso=4.4),
            models.PesoRegistro(mascota_id="max", fecha="Feb 26", peso=4.6),
            models.PesoRegistro(mascota_id="max", fecha="Abr 26", peso=4.8)
        ])

        # Diario
        db.add_all([
            models.DiarioRegistro(mascota_id="max", fecha="22/06/2026", sintoma="Micción normal", estado="Normal", nota="Fue a su caja de arena dos veces, orinando volumen normal sin quejarse."),
            models.DiarioRegistro(mascota_id="max", fecha="21/06/2026", sintoma="Apetito caprichoso", estado="Atención", nota="No se comió todo el alimento húmedo por la mañana, pero terminó el seco de noche.")
        ])

        print("Insertando servicios en el mapa...")
        db.add_all([
            models.Servicio(
                nombre="Hospital Veterinario Sania Pet & Urgencias 24h",
                categoria="veterinaria",
                subtipo="Hospital Clínico Veterinario 24/7",
                rating=4.9,
                reviews=312,
                direccion="Av. Providencia 1450, Providencia",
                telefono="+56 2 2987 6543",
                whatsapp="+56987654321",
                tarifa="Consulta general $22.000 / Urgencias $35.000",
                horario="Abierto 24 Horas",
                lat=-33.4265,
                lng=-70.6120,
                descripcion="Atención médica integral, quirófano de alta complejidad, laboratorio clínico interno y urgencias 24/7.",
                imagen_url="https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&q=80&w=400&h=300"
            ),
            models.Servicio(
                nombre="Sania Pet Shop & Farmacia Veterinaria",
                categoria="tienda",
                subtipo="Boutique, Accesorios y Farmacia",
                rating=4.8,
                reviews=189,
                direccion="Av. Andrés Bello 2100, local 4B, Providencia",
                telefono="+56 2 2987 6500",
                whatsapp="+56912345678",
                tarifa="Variedad de precios y convenios",
                horario="Lun - Sáb: 09:00 a 20:30",
                lat=-33.4190,
                lng=-70.6080,
                descripcion="Alimentos medicados y premium, juguetes interactivos, farmacia veterinaria con receta y accesorios de viaje.",
                imagen_url="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=400&h=300"
            ),
            models.Servicio(
                nombre="Tomás Robles - Paseos Caninos & Socialización",
                categoria="paseador",
                subtipo="Paseador Certificado & Estudiante Vet",
                rating=5.0,
                reviews=64,
                direccion="Sector Plaza Las Lilas / Pocuro, Providencia",
                telefono="+56 9 8765 4321",
                whatsapp="+56987654321",
                tarifa="$8.500 / Paseo (1 hr) - Packs mensuales",
                horario="Lun - Vie: 07:00 a 19:00",
                lat=-33.4340,
                lng=-70.6020,
                descripcion="Paseos en grupos reducidos (máx 3 perros), hidratación constante, collar con GPS satelital y reporte con fotos.",
                imagen_url="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=400&h=300"
            ),
            models.Servicio(
                nombre="NutriPet BARF & Alimento Natural",
                categoria="alimento",
                subtipo="Dietas Crudas, BARF y Pastelería Canina",
                rating=4.9,
                reviews=95,
                direccion="Av. Francisco Bilbao 1650, Providencia",
                telefono="+56 9 9123 4455",
                whatsapp="+56991234455",
                tarifa="Menús desde $3.900",
                horario="Mar - Dom: 10:00 a 19:30",
                lat=-33.4385,
                lng=-70.6095,
                descripcion="Porciones personalizadas congeladas, suplementos naturales, caldos de hueso y tortas de cumpleaños para mascotas.",
                imagen_url="https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&q=80&w=400&h=300"
            ),
            models.Servicio(
                nombre="Valeria Gómez - Cuidado Felino & Canino a Domicilio",
                categoria="cuidador",
                subtipo="Técnico en Enfermería Veterinaria (TENS Vet)",
                rating=5.0,
                reviews=42,
                direccion="Calle Los Leones 850, Providencia",
                telefono="+56 9 2468 1357",
                whatsapp="+56924681357",
                tarifa="$15.000 / Visita o Noche",
                horario="Disponible con reserva previa",
                lat=-33.4280,
                lng=-70.6050,
                descripcion="Visitas de cuidado en casa para gatos y perros tímidos. Administración de medicamentos orales e inyectables.",
                imagen_url="https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=400&h=300"
            ),
            models.Servicio(
                nombre="Hotel Felino & Canino Resort Las Palmas",
                categoria="hotel",
                subtipo="Hotel Boutique & Guardería de Día",
                rating=4.7,
                reviews=118,
                direccion="Av. El Bosque Sur 120, Las Condes",
                telefono="+56 2 2345 6789",
                whatsapp="+56933445566",
                tarifa="$26.000 / Día (incluye cámaras 24h)",
                horario="Recepción: 08:00 a 20:00",
                lat=-33.4160,
                lng=-70.5960,
                descripcion="Habitaciones individuales climatizadas, patio de juegos exterior, cámaras de seguridad accesibles desde app.",
                imagen_url="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=400&h=300"
            ),
            models.Servicio(
                nombre="Café & Jardín Pet-Friendly El Botánico",
                categoria="petfriendly",
                subtipo="Cafetería & Terraza Apta Mascotas",
                rating=4.8,
                reviews=230,
                direccion="Av. Pocuro 2012, Providencia",
                telefono="+56 9 9876 5432",
                whatsapp="+56998765432",
                tarifa="$4.500 - $9.000 consumo promedio",
                horario="Lun - Dom: 08:30 a 21:00",
                lat=-33.4355,
                lng=-70.5980,
                descripcion="Amplia terraza arbolada con bebederos de agua fresca, snacks de cortesía y espacio seguro para descanso de mascotas.",
                imagen_url="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=400&h=300"
            )
        ])

        print("Insertando reportes de mascotas perdidas (SOS)...")
        db.add_all([
            models.MascotaPerdida(
                mascota_id=None,
                nombre_mascota="Thor",
                especie="Perro",
                raza="Golden Retriever",
                color="Dorado claro",
                foto="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400&h=400",
                fecha_extravio="Ayer a las 18:30 hrs",
                lat=-33.4310,
                lng=-70.6060,
                direccion_referencia="Cerca de Parque Inés de Suárez, Providencia",
                recompensa="$100.000",
                contacto_nombre="Carlos Mendoza",
                contacto_telefono="+56 9 7788 9900",
                contacto_whatsapp="+56977889900",
                descripcion="Se asustó con el ruido de fuegos artificiales y salió corriendo hacia Av. Bilbao. Lleva collar azul con placa y microchip.",
                estado="perdida",
                radio_metros=400,
                created_at="2026-08-23 19:00"
            ),
            models.MascotaPerdida(
                mascota_id=None,
                nombre_mascota="Mimi",
                especie="Gato",
                raza="Siamés / Mestizo",
                color="Crema con orejas y cola oscura",
                foto="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400&h=400",
                fecha_extravio="Hoy a las 08:00 hrs",
                lat=-33.4230,
                lng=-70.6150,
                direccion_referencia="Sector Metro Manuel Montt / Calle Manuel Montt",
                recompensa="$50.000",
                contacto_nombre="Marcela Silva",
                contacto_telefono="+56 9 6655 4433",
                contacto_whatsapp="+56966554433",
                descripcion="Gatita de interior, muy asustadiza. Se escapó por una ventana abierta en el segundo piso. Ojos celestes intensos.",
                estado="perdida",
                radio_metros=250,
                created_at="2026-08-24 08:30"
            )
        ])

        db.commit()
        print("Base de datos poblada correctamente.")
    except Exception as e:
        db.rollback()
        print(f"Error al poblar la base de datos: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
