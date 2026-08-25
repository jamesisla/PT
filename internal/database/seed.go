package database

import (
	"database/sql"
	"log"
)

// AutoSeedIfEmpty populates initial demo pets, places, and lost pets if table is empty
func AutoSeedIfEmpty(db *sql.DB) error {
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM mascotas").Scan(&count)
	if err != nil {
		return err
	}

	if count > 0 {
		return nil // Already populated
	}

	log.Println("Empty database detected. Seeding initial pet records, places, and SOS lost pets...")

	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// 1. Insert Luna (Beagle)
	_, err = tx.Exec(`
		INSERT INTO mascotas (id, nombre, especie, raza, edad, sexo, peso_actual, fecha_nacimiento, microchip, foto, seguro, clinica_frecuente)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`, "luna", "Luna", "Perro", "Beagle", "3 años", "Hembra (Esterilizada)", "12.4 kg", "12/03/2023", "981022300456123", "https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&q=80&w=300&h=300", "PetPlan Gold (80% Cobertura)", "Hospital Veterinario Sania Pet")
	if err != nil {
		return err
	}

	// Luna Owner
	_, err = tx.Exec(`
		INSERT INTO propietarios (mascota_id, nombre, rut, telefono, email, direccion)
		VALUES (?, ?, ?, ?, ?, ?)
	`, "luna", "Jota Robles", "17.654.321-K", "+56 9 8765 4321", "jota.robles@saniapet.cl", "Av. Providencia 1234, Santiago")
	if err != nil {
		return err
	}

	// Luna Alerts
	_, err = tx.Exec(`
		INSERT INTO alertas (id, mascota_id, tipo, titulo, descripcion, estado, fecha)
		VALUES 
		(?, ?, ?, ?, ?, ?, ?),
		(?, ?, ?, ?, ?, ?, ?)
	`,
		"al1", "luna", "critica", "ALERGIA A LA IVERMECTINA", "Mutación del gen MDR1 confirmada. No administrar antiparasitarios con esta droga.", "activa", "15/06/2026",
		"al2", "luna", "preventiva", "VACUNA ANTIRRÁBICA PRÓXIMA A VENCER", "Vence el 15/07/2026. Agendar hora de renovación.", "activa", "15/07/2026",
	)
	if err != nil {
		return err
	}

	// Luna Diagnosticos
	_, err = tx.Exec(`
		INSERT INTO diagnosticos (mascota_id, fecha, tipo, tipo_color, descripcion, doctor, estado, estado_color, clinica)
		VALUES 
		('luna', '10/05/2026', 'Consulta General', 'bg-blue-100 text-blue-700 border-blue-200', 'Control sano anual y chequeo de peso.', 'Dra. Sandra Valenzuela', 'Resuelto', 'bg-green-100 text-green-700', 'Hospital Veterinario Sania Pet'),
		('luna', '24/03/2026', 'Urgencia', 'bg-red-100 text-red-700 border-red-200', 'Gastroenteritis aguda alimentaria. Ingesta de restos en la calle.', 'Dr. Roberto Cáceres', 'Resuelto', 'bg-green-100 text-green-700', 'Urgencias Sania Pet 24/7'),
		('luna', '15/01/2026', 'Especialidad', 'bg-purple-100 text-purple-700 border-purple-200', 'Otitis externa bilateral por hongos. Tratamiento indicado.', 'Dra. María Paz Gómez', 'Controlado', 'bg-blue-100 text-blue-700', 'Hospital Veterinario Sania Pet')
	`)
	if err != nil {
		return err
	}

	// Luna Vacunas
	_, err = tx.Exec(`
		INSERT INTO vacunas (mascota_id, fecha, nombre, lote, veterinario, proxima_fecha, estado, estado_color)
		VALUES 
		('luna', '15/07/2025', 'Antirrábica (Rabigen)', 'RAB-9923B', 'Dra. Sandra Valenzuela', '15/07/2026', 'Aplicada', 'bg-green-100 text-green-700'),
		('luna', '12/03/2026', 'Séxtuple Canina (Defensor 6)', 'SEX-8840A', 'Dra. Sandra Valenzuela', '12/03/2027', 'Aplicada', 'bg-green-100 text-green-700'),
		('luna', '05/11/2025', 'KC Bronchicine', 'KC-7721C', 'Dr. Roberto Cáceres', '05/11/2026', 'Aplicada', 'bg-green-100 text-green-700')
	`)
	if err != nil {
		return err
	}

	// Luna Desparasitaciones
	_, err = tx.Exec(`
		INSERT INTO desparasitaciones (mascota_id, fecha, tipo, producto, peso_mascota, dosis, proxima_fecha, veterinario)
		VALUES 
		('luna', '10/06/2026', 'Externa', 'NexGard Spectra M', '12.4 kg', '1 tableta masticable', '10/07/2026', 'Dueño (Auto-administrado)'),
		('luna', '12/03/2026', 'Interna', 'Drontal Plus Perros', '12.1 kg', '1 tableta y cuarto', '12/06/2026', 'Dra. Sandra Valenzuela')
	`)
	if err != nil {
		return err
	}

	// Luna Medicamentos
	_, err = tx.Exec(`
		INSERT INTO medicamentos (mascota_id, nombre, dosis, frecuencia, duracion, fecha_inicio, veterinario, estado)
		VALUES 
		('luna', 'Glandulex Sacs (Suplemento de fibra)', '1 croqueta masticable', 'Cada 24 horas', 'Uso continuo preventivo', '10/05/2026', 'Dra. Sandra Valenzuela', 'Activo')
	`)
	if err != nil {
		return err
	}

	// Luna Lab
	_, err = tx.Exec(`
		INSERT INTO laboratorios (id, mascota_id, fecha, examen, laboratorio, telefono, sitio_web, direccion, convenio, director_tecnico, notas_generales)
		VALUES ('2026-05-883', 'luna', '10/05/2026', 'Hemograma Completo Automatizado', 'Veterinary Diagnostics Lab Sania', '+56 2 2987 6543', 'lab.saniapet.cl', 'Av. Vitacura 5400, Santiago', 'PetPlan Seguro', 'Dr. Fernando Leyton', 'Parámetros hematológicos normales.')
	`)
	if err != nil {
		return err
	}

	_, err = tx.Exec(`
		INSERT INTO laboratorio_resultados (laboratorio_id, nombre, resultado, unidad, rango_referencia, estado)
		VALUES 
		('2026-05-883', 'Hematocrito', '45.2', '%', '37.0 - 55.0', 'Normal'),
		('2026-05-883', 'Hemoglobina', '15.6', 'g/dL', '12.0 - 18.0', 'Normal'),
		('2026-05-883', 'Eritrocitos', '6.8', 'x10^6/uL', '5.5 - 8.5', 'Normal'),
		('2026-05-883', 'Leucocitos Totales', '10.4', 'x10^3/uL', '6.0 - 17.0', 'Normal')
	`)
	if err != nil {
		return err
	}

	// Luna Imagenes
	_, err = tx.Exec(`
		INSERT INTO imagenes (mascota_id, fecha, tipo, nombre, indicacion, informe, doctor, imagen_url)
		VALUES ('luna', '15/02/2026', 'Radiografía', 'Radiografía de Columna Lumbo-Sacra', 'Descartar discopatías o compresión por dolor lumbar.', 'Sin evidencia de pinzamiento discal ni osteofitos.', 'Dr. Patricio Alarcón', 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400&h=300')
	`)
	if err != nil {
		return err
	}

	// Luna Peso Historial
	_, err = tx.Exec(`
		INSERT INTO peso_historial (mascota_id, fecha, peso)
		VALUES 
		('luna', 'Ene 26', 12.0),
		('luna', 'Feb 26', 12.1),
		('luna', 'Mar 26', 12.3),
		('luna', 'Abr 26', 12.2),
		('luna', 'May 26', 12.4)
	`)
	if err != nil {
		return err
	}

	// Luna Diario
	_, err = tx.Exec(`
		INSERT INTO diario (mascota_id, fecha, sintoma, estado, nota)
		VALUES 
		('luna', '18/06/2026', 'Paseo largo en el parque', 'Normal', 'Corrió con otros perros y tomó abundante agua fresca.'),
		('luna', '12/06/2026', 'Leve rascado en oreja derecha', 'Atención', 'Revisar si persiste para aplicar gotas óticas.')
	`)
	if err != nil {
		return err
	}

	// 2. Insert Max (Gato Persa)
	_, err = tx.Exec(`
		INSERT INTO mascotas (id, nombre, especie, raza, edad, sexo, peso_actual, fecha_nacimiento, microchip, foto, seguro, clinica_frecuente)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`, "max", "Max", "Gato", "Persa", "2 años", "Macho (Esterilizado)", "4.8 kg", "20/06/2024", "981022300789456", "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300&h=300", "Seguro Felino Total (70%)", "Clínica de Especialidades Felinas Providencia")
	if err != nil {
		return err
	}

	_, err = tx.Exec(`
		INSERT INTO propietarios (mascota_id, nombre, rut, telefono, email, direccion)
		VALUES (?, ?, ?, ?, ?, ?)
	`, "max", "Camila Silva", "18.987.654-3", "+56 9 7654 3210", "camila.silva@gmail.com", "Calle Suecia 450, Providencia")
	if err != nil {
		return err
	}

	// 3. Insert Map Services
	_, err = tx.Exec(`
		INSERT INTO servicios_pet (nombre, categoria, subtipo, rating, reviews, direccion, telefono, whatsapp, tarifa, horario, lat, lng, descripcion, imagen_url)
		VALUES 
		('Hospital Veterinario Sania Pet & Urgencias 24h', 'veterinaria', 'Hospital Clínico Veterinario 24/7', 4.9, 312, 'Av. Providencia 1450, Providencia', '+56 2 2987 6543', '+56987654321', 'Consulta general $22.000 / Urgencias $35.000', 'Abierto 24 Horas', -33.4265, -70.6120, 'Atención médica integral, quirófano de alta complejidad y urgencias 24/7.', 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&q=80&w=400&h=300'),
		('Sania Pet Shop & Farmacia Veterinaria', 'tienda', 'Boutique, Accesorios y Farmacia', 4.8, 189, 'Av. Andrés Bello 2100, local 4B, Providencia', '+56 2 2987 6500', '+56912345678', 'Variedad de precios y convenios', 'Lun - Sáb: 09:00 a 20:30', -33.4190, -70.6080, 'Alimentos premium, juguetes interactivos y farmacia veterinaria autorizada.', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=400&h=300'),
		('Tomás Robles - Paseos Caninos & Socialización', 'paseador', 'Paseador Certificado & Estudiante Vet', 5.0, 64, 'Sector Plaza Las Lilas / Pocuro, Providencia', '+56 9 8765 4321', '+56987654321', '$8.500 / Paseo (1 hr) - Packs mensuales', 'Lun - Vie: 07:00 a 19:00', -33.4340, -70.6020, 'Paseos en grupos reducidos con GPS en collar y reporte de fotos.', 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=400&h=300'),
		('NutriPet BARF & Alimento Natural', 'alimento', 'Dietas Crudas, BARF y Pastelería Canina', 4.9, 95, 'Av. Francisco Bilbao 1650, Providencia', '+56 9 9123 4455', '+56991234455', 'Menús desde $3.900', 'Mar - Dom: 10:00 a 19:30', -33.4385, -70.6095, 'Porciones personalizadas congeladas, suplementos y tortas para mascotas.', 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&q=80&w=400&h=300'),
		('Valeria Gómez - Cuidado Felino & Canino a Domicilio', 'cuidador', 'Técnico en Enfermería Veterinaria (TENS Vet)', 5.0, 42, 'Calle Los Leones 850, Providencia', '+56 9 2468 1357', '+56924681357', '$15.000 / Visita o Noche', 'Disponible con reserva previa', -33.4280, -70.6050, 'Visitas a domicilio para gatos y perros. Administración de medicamentos.', 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=400&h=300'),
		('Hotel Felino & Canino Resort Las Palmas', 'hotel', 'Hotel Boutique & Guardería de Día', 4.7, 118, 'Av. El Bosque Sur 120, Las Condes', '+56 2 2345 6789', '+56933445566', '$26.000 / Día (incluye cámaras 24h)', 'Recepción: 08:00 a 20:00', -33.4160, -70.5960, 'Habitaciones individuales climatizadas y cámaras de libre acceso.', 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=400&h=300'),
		('Café & Jardín Pet-Friendly El Botánico', 'petfriendly', 'Cafetería & Terraza Apta Mascotas', 4.8, 230, 'Av. Pocuro 2012, Providencia', '+56 9 9876 5432', '+56998765432', '$4.500 - $9.000 consumo promedio', 'Lun - Dom: 08:30 a 21:00', -33.4355, -70.5980, 'Amplia terraza arbolada con bebederos de agua fresca y snacks saludables.', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=400&h=300')
	`)
	if err != nil {
		return err
	}

	// 4. Insert Lost Pets
	_, err = tx.Exec(`
		INSERT INTO mascotas_perdidas (nombre_mascota, especie, raza, color, foto, fecha_extravio, lat, lng, direccion_referencia, recompensa, contacto_nombre, contacto_telefono, contacto_whatsapp, descripcion, estado, radio_metros, created_at)
		VALUES 
		('Thor', 'Perro', 'Golden Retriever', 'Dorado claro', 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400&h=400', 'Ayer a las 18:30 hrs', -33.4310, -70.6060, 'Cerca de Parque Inés de Suárez, Providencia', '$100.000', 'Carlos Mendoza', '+56 9 7788 9900', '+56977889900', 'Se asustó con fuegos artificiales y corrió hacia Bilbao. Lleva collar azul y microchip.', 'perdida', 400, '2026-08-23 19:00'),
		('Mimi', 'Gato', 'Siamés / Mestizo', 'Crema con orejas y cola oscura', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400&h=400', 'Hoy a las 08:00 hrs', -33.4230, -70.6150, 'Sector Metro Manuel Montt / Calle Manuel Montt', '$50.000', 'Marcela Silva', '+56 9 6655 4433', '+56966554433', 'Gatita de interior asustadiza. Se escapó por una ventana en 2do piso. Ojos celestes.', 'perdida', 250, '2026-08-24 08:30')
	`)
	if err != nil {
		return err
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	log.Println("Initial database seed completed successfully.")
	return nil
}
