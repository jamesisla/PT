import { Pet, petsDatabase, savePetsDatabase } from '../data/petData';

const BASE_URL = typeof window !== 'undefined' 
  ? `http://${window.location.hostname}:8000/api` 
  : 'http://localhost:8000/api';


export async function getPetsList(): Promise<any[]> {
  try {
    const res = await fetch(`${BASE_URL}/pets`);
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (err) {
    console.warn('FastAPI backend unreachable. Falling back to local offline mock database.');
    return Object.values(petsDatabase).map(p => ({
      id: p.id,
      nombre: p.nombre,
      especie: p.especie,
      raza: p.raza,
      edad: p.edad,
      foto: p.foto
    }));
  }
}

export async function getPetDetail(petId: string): Promise<Pet> {
  try {
    const res = await fetch(`${BASE_URL}/pets/${petId}`);
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (err) {
    console.warn(`FastAPI backend unreachable. Falling back to local offline data for pet ${petId}.`);
    return petsDatabase[petId];
  }
}

export async function addSymptomRecord(petId: string, record: any): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/pets/${petId}/sintomas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fecha: record.fecha,
        sintoma: record.sintoma,
        estado: record.estado,
        nota: record.nota || ''
      }),
    });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (err) {
    console.warn('FastAPI backend unreachable. Saving record to local memory state.');
    if (petsDatabase[petId]) {
      petsDatabase[petId].diario = [record, ...petsDatabase[petId].diario];
      savePetsDatabase();
    }
    return record;
  }
}

export async function addWeightRecord(petId: string, record: any): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/pets/${petId}/peso`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fecha: record.fecha,
        peso: record.peso
      }),
    });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (err) {
    console.warn('FastAPI backend unreachable. Saving record to local memory state.');
    if (petsDatabase[petId]) {
      petsDatabase[petId].pesoActual = `${record.peso} kg`;
      petsDatabase[petId].pesoHistorial = [...petsDatabase[petId].pesoHistorial, record];
      savePetsDatabase();
    }
    return record;
  }
}

export async function addVaccineRecord(petId: string, record: any): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/pets/${petId}/vacunas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fecha: record.fecha,
        nombre: record.nombre,
        lote: record.lote,
        veterinario: record.veterinario,
        proxima_fecha: record.proximaFecha,
        estado: record.estado,
        estado_color: record.estadoColor
      }),
    });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (err) {
    console.warn('FastAPI backend unreachable. Saving record to local memory state.');
    if (petsDatabase[petId]) {
      petsDatabase[petId].vacunas = [record, ...petsDatabase[petId].vacunas];
      savePetsDatabase();
    }
    return record;
  }
}

export async function addAlertRecord(petId: string, record: any): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/pets/${petId}/alertas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tipo: record.tipo,
        titulo: record.titulo,
        descripcion: record.descripcion
      }),
    });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (err) {
    console.warn('FastAPI backend unreachable. Saving record to local memory state.');
    if (petsDatabase[petId]) {
      petsDatabase[petId].alertas = [record, ...petsDatabase[petId].alertas];
      savePetsDatabase();
    }
    return record;
  }
}

export async function updateAlertAction(alertId: string, action: string, petId: string): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/alertas/${alertId}/action?action=${action}`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (err) {
    console.warn('FastAPI backend unreachable. Updating alert state in local memory.');
    if (petsDatabase[petId]) {
      const alert = petsDatabase[petId].alertas.find(a => a.id === alertId);
      if (alert) {
        alert.estado = action === 'posponer' ? 'pospuesta' : action === 'solucionar' ? 'solucionada' : 'olvidada';
        savePetsDatabase();
      }
    }
    return { id: alertId, estado: action };
  }
}

export async function updateSymptomRecord(petId: string, sintomaId: number, record: any): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/pets/${petId}/sintomas/${sintomaId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fecha: record.fecha,
        sintoma: record.sintoma,
        estado: record.estado,
        nota: record.nota || ''
      }),
    });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (err) {
    console.warn('FastAPI backend unreachable. Updating record in local memory.');
    if (petsDatabase[petId]) {
      const idx = petsDatabase[petId].diario.findIndex(d => d.id === sintomaId);
      if (idx !== -1) {
        petsDatabase[petId].diario[idx] = { ...petsDatabase[petId].diario[idx], ...record };
        savePetsDatabase();
      }
    }
    return record;
  }
}

export async function deleteSymptomRecord(petId: string, sintomaId: number): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/pets/${petId}/sintomas/${sintomaId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (err) {
    console.warn('FastAPI backend unreachable. Deleting record from local memory.');
    if (petsDatabase[petId]) {
      petsDatabase[petId].diario = petsDatabase[petId].diario.filter(d => d.id !== sintomaId);
      savePetsDatabase();
    }
    return { status: 'success' };
  }
}

export async function updateVaccineRecord(petId: string, vacunaId: number, record: any): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/pets/${petId}/vacunas/${vacunaId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fecha: record.fecha,
        nombre: record.nombre,
        lote: record.lote,
        veterinario: record.veterinario,
        proxima_fecha: record.proximaFecha,
        estado: record.estado,
        estado_color: record.estadoColor
      }),
    });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (err) {
    console.warn('FastAPI backend unreachable. Updating vaccine in local memory.');
    if (petsDatabase[petId]) {
      const idx = petsDatabase[petId].vacunas.findIndex(v => v.id === vacunaId);
      if (idx !== -1) {
        petsDatabase[petId].vacunas[idx] = { ...petsDatabase[petId].vacunas[idx], ...record };
        savePetsDatabase();
      }
    }
    return record;
  }
}

export async function deleteVaccineRecord(petId: string, vacunaId: number): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/pets/${petId}/vacunas/${vacunaId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (err) {
    console.warn('FastAPI backend unreachable. Deleting vaccine from local memory.');
    if (petsDatabase[petId]) {
      petsDatabase[petId].vacunas = petsDatabase[petId].vacunas.filter(v => v.id !== vacunaId);
      savePetsDatabase();
    }
    return { status: 'success' };
  }
}

export async function addMedicationRecord(petId: string, record: any): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/pets/${petId}/medicamentos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: record.nombre,
        dosis: record.dosis,
        frecuencia: record.frecuencia,
        duracion: record.duracion,
        fecha_inicio: record.fechaInicio,
        veterinario: record.veterinario,
        estado: record.estado
      }),
    });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (err) {
    console.warn('FastAPI backend unreachable. Saving medication to local memory.');
    if (petsDatabase[petId]) {
      petsDatabase[petId].medicamentos = [record, ...petsDatabase[petId].medicamentos];
      savePetsDatabase();
    }
    return record;
  }
}

export async function updateMedicationRecord(petId: string, medicamentoId: number, record: any): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/pets/${petId}/medicamentos/${medicamentoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: record.nombre,
        dosis: record.dosis,
        frecuencia: record.frecuencia,
        duracion: record.duracion,
        fecha_inicio: record.fechaInicio,
        veterinario: record.veterinario,
        estado: record.estado
      }),
    });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (err) {
    console.warn('FastAPI backend unreachable. Updating medication in local memory.');
    if (petsDatabase[petId]) {
      const idx = petsDatabase[petId].medicamentos.findIndex(m => m.id === medicamentoId);
      if (idx !== -1) {
        petsDatabase[petId].medicamentos[idx] = { ...petsDatabase[petId].medicamentos[idx], ...record };
        savePetsDatabase();
      }
    }
    return record;
  }
}

export async function deleteMedicationRecord(petId: string, medicamentoId: number): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/pets/${petId}/medicamentos/${medicamentoId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (err) {
    console.warn('FastAPI backend unreachable. Deleting medication from local memory.');
    if (petsDatabase[petId]) {
      petsDatabase[petId].medicamentos = petsDatabase[petId].medicamentos.filter(m => m.id !== medicamentoId);
      savePetsDatabase();
    }
    return { status: 'success' };
  }
}

export async function updatePetProfile(petId: string, petData: any): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/pets/${petId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: petData.nombre,
        especie: petData.especie,
        raza: petData.raza,
        edad: petData.edad,
        sexo: petData.sexo,
        fecha_nacimiento: petData.fechaNacimiento,
        microchip: petData.microchip,
        foto: petData.foto,
        seguro: petData.seguro,
        clinica_frecuente: petData.clinicaFrecuente
      }),
    });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (err) {
    console.warn('FastAPI backend unreachable. Updating pet in local memory.');
    if (petsDatabase[petId]) {
      petsDatabase[petId] = { ...petsDatabase[petId], ...petData };
      savePetsDatabase();
    }
    return petsDatabase[petId];
  }
}

export async function updatePetOwner(petId: string, ownerData: any): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/pets/${petId}/propietario`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: ownerData.nombre,
        rut: ownerData.rut,
        telefono: ownerData.telefono,
        email: ownerData.email,
        direccion: ownerData.direccion
      }),
    });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (err) {
    console.warn('FastAPI backend unreachable. Updating owner in local memory.');
    if (petsDatabase[petId]) {
      petsDatabase[petId].propietario = { ...petsDatabase[petId].propietario, ...ownerData };
      savePetsDatabase();
    }
    return petsDatabase[petId].propietario;
  }
}

export async function addDiagnosisRecord(petId: string, record: any): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/pets/${petId}/diagnosticos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fecha: record.fecha,
        tipo: record.tipo,
        tipo_color: record.tipoColor,
        descripcion: record.descripcion,
        doctor: record.doctor,
        estado: record.estado,
        estado_color: record.estadoColor,
        clinica: record.clinica
      }),
    });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (err) {
    console.warn('FastAPI backend unreachable. Saving diagnosis to local memory.');
    if (petsDatabase[petId]) {
      petsDatabase[petId].diagnosticos = [record, ...petsDatabase[petId].diagnosticos];
      savePetsDatabase();
    }
    return record;
  }
}

export async function updateDiagnosisRecord(petId: string, diagnosticoId: number, record: any): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/pets/${petId}/diagnosticos/${diagnosticoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fecha: record.fecha,
        tipo: record.tipo,
        tipo_color: record.tipoColor,
        descripcion: record.descripcion,
        doctor: record.doctor,
        estado: record.estado,
        estado_color: record.estadoColor,
        clinica: record.clinica
      }),
    });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (err) {
    console.warn('FastAPI backend unreachable. Updating diagnosis in local memory.');
    if (petsDatabase[petId]) {
      const idx = petsDatabase[petId].diagnosticos.findIndex(d => d.id === diagnosticoId);
      if (idx !== -1) {
        petsDatabase[petId].diagnosticos[idx] = { ...petsDatabase[petId].diagnosticos[idx], ...record };
        savePetsDatabase();
      }
    }
    return record;
  }
}

export async function deleteDiagnosisRecord(petId: string, diagnosticoId: number): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/pets/${petId}/diagnosticos/${diagnosticoId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (err) {
    console.warn('FastAPI backend unreachable. Deleting diagnosis from local memory.');
    if (petsDatabase[petId]) {
      petsDatabase[petId].diagnosticos = petsDatabase[petId].diagnosticos.filter(d => d.id !== diagnosticoId);
      savePetsDatabase();
    }
    return { status: 'success' };
  }
}

export async function addDewormingRecord(petId: string, record: any): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/pets/${petId}/desparasitaciones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fecha: record.fecha,
        tipo: record.tipo,
        producto: record.producto,
        peso_mascota: record.pesoMascota,
        dosis: record.dosis,
        proxima_fecha: record.proximaFecha,
        veterinario: record.veterinario
      }),
    });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (err) {
    console.warn('FastAPI backend unreachable. Saving deworming to local memory.');
    if (petsDatabase[petId]) {
      petsDatabase[petId].desparasitaciones = [record, ...petsDatabase[petId].desparasitaciones];
      savePetsDatabase();
    }
    return record;
  }
}

export async function updateDewormingRecord(petId: string, dewormingId: number, record: any): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/pets/${petId}/desparasitaciones/${dewormingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fecha: record.fecha,
        tipo: record.tipo,
        producto: record.producto,
        peso_mascota: record.pesoMascota,
        dosis: record.dosis,
        proxima_fecha: record.proximaFecha,
        veterinario: record.veterinario
      }),
    });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (err) {
    console.warn('FastAPI backend unreachable. Updating deworming in local memory.');
    if (petsDatabase[petId]) {
      const idx = petsDatabase[petId].desparasitaciones.findIndex(d => d.id === dewormingId);
      if (idx !== -1) {
        petsDatabase[petId].desparasitaciones[idx] = { ...petsDatabase[petId].desparasitaciones[idx], ...record };
        savePetsDatabase();
      }
    }
    return record;
  }
}

export async function deleteDewormingRecord(petId: string, dewormingId: number): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/pets/${petId}/desparasitaciones/${dewormingId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (err) {
    console.warn('FastAPI backend unreachable. Deleting deworming from local memory.');
    if (petsDatabase[petId]) {
      petsDatabase[petId].desparasitaciones = petsDatabase[petId].desparasitaciones.filter(d => d.id !== dewormingId);
      savePetsDatabase();
    }
    return { status: 'success' };
  }
}

export async function addLaboratoryRecord(petId: string, record: any): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/pets/${petId}/laboratorios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fecha: record.fecha,
        examen: record.examen,
        laboratorio: record.laboratorio,
        telefono: record.telefono,
        sitio_web: record.sitioWeb,
        direccion: record.direccion,
        convenio: record.convenio,
        director_tecnico: record.directorTecnico,
        resultados: record.resultados || [],
        notas_generales: record.notasGenerales
      }),
    });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (err) {
    console.warn('FastAPI backend unreachable. Saving laboratory to local memory.');
    if (petsDatabase[petId]) {
      const newRec = { ...record, id: record.id || Math.random().toString(36).substr(2, 9) };
      petsDatabase[petId].laboratorios = [newRec, ...petsDatabase[petId].laboratorios];
      savePetsDatabase();
      return newRec;
    }
    return record;
  }
}

export async function updateLaboratoryRecord(petId: string, labId: string, record: any): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/pets/${petId}/laboratorios/${labId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fecha: record.fecha,
        examen: record.examen,
        laboratorio: record.laboratorio,
        telefono: record.telefono,
        sitio_web: record.sitioWeb,
        direccion: record.direccion,
        convenio: record.convenio,
        director_tecnico: record.directorTecnico,
        resultados: record.resultados || [],
        notas_generales: record.notasGenerales
      }),
    });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (err) {
    console.warn('FastAPI backend unreachable. Updating laboratory in local memory.');
    if (petsDatabase[petId]) {
      const idx = petsDatabase[petId].laboratorios.findIndex(l => l.id === labId);
      if (idx !== -1) {
        petsDatabase[petId].laboratorios[idx] = { ...petsDatabase[petId].laboratorios[idx], ...record, id: labId };
        savePetsDatabase();
      }
    }
    return record;
  }
}

export async function deleteLaboratoryRecord(petId: string, labId: string): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/pets/${petId}/laboratorios/${labId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (err) {
    console.warn('FastAPI backend unreachable. Deleting laboratory from local memory.');
    if (petsDatabase[petId]) {
      petsDatabase[petId].laboratorios = petsDatabase[petId].laboratorios.filter(l => l.id !== labId);
      savePetsDatabase();
    }
    return { status: 'success' };
  }
}

export async function addMedicalImageRecord(petId: string, record: any): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/pets/${petId}/imagenes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fecha: record.fecha,
        tipo: record.tipo,
        nombre: record.nombre,
        indicacion: record.indicacion,
        informe: record.informe,
        doctor: record.doctor,
        imagen_url: record.imagenUrl
      }),
    });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (err) {
    console.warn('FastAPI backend unreachable. Saving medical image to local memory.');
    if (petsDatabase[petId]) {
      const newRec = { ...record, id: record.id || Math.floor(Math.random() * 100000) };
      petsDatabase[petId].imagenes = [newRec, ...petsDatabase[petId].imagenes];
      savePetsDatabase();
      return newRec;
    }
    return record;
  }
}

export async function updateMedicalImageRecord(petId: string, imageId: number, record: any): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/pets/${petId}/imagenes/${imageId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fecha: record.fecha,
        tipo: record.tipo,
        nombre: record.nombre,
        indicacion: record.indicacion,
        informe: record.informe,
        doctor: record.doctor,
        imagen_url: record.imagenUrl
      }),
    });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (err) {
    console.warn('FastAPI backend unreachable. Updating medical image in local memory.');
    if (petsDatabase[petId]) {
      const idx = petsDatabase[petId].imagenes.findIndex(img => img.id === imageId);
      if (idx !== -1) {
        petsDatabase[petId].imagenes[idx] = { ...petsDatabase[petId].imagenes[idx], ...record, id: imageId };
        savePetsDatabase();
      }
    }
    return record;
  }
}

export async function deleteMedicalImageRecord(petId: string, imageId: number): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/pets/${petId}/imagenes/${imageId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (err) {
    console.warn('FastAPI backend unreachable. Deleting medical image from local memory.');
    if (petsDatabase[petId]) {
      petsDatabase[petId].imagenes = petsDatabase[petId].imagenes.filter(img => img.id !== imageId);
      savePetsDatabase();
    }
    return { status: 'success' };
  }
}

export async function createNewPet(newPetData: any): Promise<Pet> {
  const newId = newPetData.nombre.toLowerCase().trim().replace(/\s+/g, '_') + '_' + Date.now().toString(36);
  
  const defaultFoto = newPetData.especie?.toLowerCase() === 'gato'
    ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300&h=300'
    : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300&h=300';

  const fullPet: Pet = {
    id: newId,
    nombre: newPetData.nombre,
    especie: newPetData.especie || 'Perro',
    raza: newPetData.raza || 'Mestizo',
    edad: newPetData.edad || '1 año',
    sexo: newPetData.sexo || 'Macho (Esterilizado)',
    pesoActual: newPetData.pesoActual ? `${newPetData.pesoActual} kg` : '0 kg',
    fechaNacimiento: newPetData.fechaNacimiento || '01/01/2025',
    microchip: newPetData.microchip || 'No registrado',
    foto: newPetData.foto || defaultFoto,
    seguro: newPetData.seguro || 'Sin seguro registrado',
    clinicaFrecuente: newPetData.clinicaFrecuente || 'Hospital Veterinario Sania Pet',
    propietario: {
      nombre: newPetData.propietarioNombre || 'Dueño Registrado',
      rut: 'N/A',
      telefono: newPetData.propietarioTelefono || '+56 9 1234 5678',
      email: newPetData.propietarioEmail || 'contacto@saniapet.cl',
      direccion: 'Santiago, Chile'
    },
    alertas: [],
    diagnosticos: [],
    vacunas: [],
    desparasitaciones: [],
    medicamentos: [],
    laboratorios: [],
    imagenes: [],
    pesoHistorial: newPetData.pesoActual ? [{ fecha: 'Actual', peso: parseFloat(newPetData.pesoActual) }] : [],
    diario: []
  };

  try {
    const res = await fetch(`${BASE_URL}/pets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fullPet),
    });
    if (!res.ok) throw new Error('API error');
  } catch (err) {
    console.warn('FastAPI backend unreachable. Saving new pet to local database.');
  }

  petsDatabase[newId] = fullPet;
  savePetsDatabase();
  return fullPet;
}

