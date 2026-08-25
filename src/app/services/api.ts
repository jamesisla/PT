import { Pet, petsDatabase, savePetsDatabase } from '../data/petData';
import { Place, LostPet, getLocalPlaces, saveLocalPlaces, getLocalLostPets, saveLocalLostPets } from '../data/mapData';

const BASE_URL = typeof window !== 'undefined' 
  ? (window.location.port === '5173' ? `http://${window.location.hostname}:8080/api` : '/api')
  : '/api';


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

// --- MAPET SERVICIOS & MASCOTAS PERDIDAS ---

export async function getServicios(categoria?: string): Promise<Place[]> {
  try {
    const url = categoria && categoria !== 'todos'
      ? `${BASE_URL}/servicios?categoria=${encodeURIComponent(categoria)}`
      : `${BASE_URL}/servicios`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (err) {
    console.warn('FastAPI backend unreachable. Using local places data.');
    const places = getLocalPlaces();
    if (categoria && categoria !== 'todos') {
      return places.filter(p => p.categoria === categoria);
    }
    return places;
  }
}

export async function createServicio(serviceData: Partial<Place>): Promise<Place> {
  const newId = Date.now();
  const fullService: Place = {
    id: serviceData.id || newId,
    nombre: serviceData.nombre || 'Nuevo Servicio',
    categoria: serviceData.categoria || 'veterinaria',
    subtipo: serviceData.subtipo || 'Servicio para Mascotas',
    rating: serviceData.rating || 5.0,
    reviews: serviceData.reviews || 0,
    direccion: serviceData.direccion || 'Santiago, Chile',
    telefono: serviceData.telefono || '',
    whatsapp: serviceData.whatsapp || '',
    tarifa: serviceData.tarifa || 'Consultar',
    horario: serviceData.horario || 'Horario a consultar',
    lat: serviceData.lat || -33.4265,
    lng: serviceData.lng || -70.6120,
    descripcion: serviceData.descripcion || '',
    imagenUrl: serviceData.imagenUrl || 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&q=80&w=400&h=300'
  };

  try {
    const res = await fetch(`${BASE_URL}/servicios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullService)
    });
    if (!res.ok) throw new Error('API error');
    const created = await res.json();
    // Update local cache
    const current = getLocalPlaces();
    saveLocalPlaces([created, ...current]);
    return created;
  } catch (err) {
    console.warn('FastAPI backend unreachable. Saving service locally.');
    const current = getLocalPlaces();
    const updated = [fullService, ...current];
    saveLocalPlaces(updated);
    return fullService;
  }
}

export async function getMascotasPerdidas(estado?: string): Promise<LostPet[]> {
  try {
    const url = estado && estado !== 'todos'
      ? `${BASE_URL}/mascotas-perdidas?estado=${encodeURIComponent(estado)}`
      : `${BASE_URL}/mascotas-perdidas`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch (err) {
    console.warn('FastAPI backend unreachable. Using local lost pets data.');
    const list = getLocalLostPets();
    if (estado && estado !== 'todos') {
      return list.filter(p => p.estado === estado);
    }
    return list;
  }
}

export async function reportarMascotaPerdida(reporteData: Partial<LostPet>): Promise<LostPet> {
  const newId = Date.now();
  const fullReport: LostPet = {
    id: reporteData.id || newId,
    mascotaId: reporteData.mascotaId || null,
    nombreMascota: reporteData.nombreMascota || 'Mascota Extraviada',
    especie: reporteData.especie || 'Perro',
    raza: reporteData.raza || 'Mestizo',
    color: reporteData.color || 'No especificado',
    foto: reporteData.foto || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400&h=400',
    fechaExtravio: reporteData.fechaExtravio || 'Hoy',
    lat: reporteData.lat || -33.4265,
    lng: reporteData.lng || -70.6120,
    direccionReferencia: reporteData.direccionReferencia || 'Sector sin especificar',
    recompensa: reporteData.recompensa || '',
    contactoNombre: reporteData.contactoNombre || 'Dueño/a',
    contactoTelefono: reporteData.contactoTelefono || '+56 9 1234 5678',
    contactoWhatsapp: reporteData.contactoWhatsapp || '',
    descripcion: reporteData.descripcion || '',
    estado: reporteData.estado || 'perdida',
    radioMetros: reporteData.radioMetros || 300,
    createdAt: new Date().toISOString()
  };

  try {
    const res = await fetch(`${BASE_URL}/mascotas-perdidas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullReport)
    });
    if (!res.ok) throw new Error('API error');
    const created = await res.json();
    const current = getLocalLostPets();
    saveLocalLostPets([created, ...current]);
    return created;
  } catch (err) {
    console.warn('FastAPI backend unreachable. Saving lost pet report locally.');
    const current = getLocalLostPets();
    const updated = [fullReport, ...current];
    saveLocalLostPets(updated);
    return fullReport;
  }
}

export async function updateEstadoMascotaPerdida(reporteId: number, estado: 'perdida' | 'avistada' | 'encontrada'): Promise<LostPet | null> {
  try {
    const res = await fetch(`${BASE_URL}/mascotas-perdidas/${reporteId}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado })
    });
    if (!res.ok) throw new Error('API error');
    const updated = await res.json();
    const current = getLocalLostPets();
    const newLost = current.map(p => p.id === reporteId ? { ...p, estado } : p);
    saveLocalLostPets(newLost);
    return updated;
  } catch (err) {
    console.warn('FastAPI backend unreachable. Updating lost pet state locally.');
    const current = getLocalLostPets();
    let updatedItem: LostPet | null = null;
    const newLost = current.map(p => {
      if (p.id === reporteId) {
        updatedItem = { ...p, estado };
        return updatedItem;
      }
      return p;
    });
    saveLocalLostPets(newLost);
    return updatedItem;
  }
}

export async function deleteMascotaPerdida(reporteId: number): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/mascotas-perdidas/${reporteId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('API error');
  } catch (err) {
    console.warn('Backend unreachable. Deleting lost pet locally.');
  }
  const current = getLocalLostPets();
  saveLocalLostPets(current.filter(p => p.id !== reporteId));
  return true;
}

// ----------------------------------------------------
// SuperAdmin Management & Analytics APIs
// ----------------------------------------------------

export async function getAdminStats(): Promise<any> {
  const res = await fetch(`${BASE_URL}/admin/stats`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('saniapet_jwt') || ''}` }
  });
  if (!res.ok) throw new Error('Failed to fetch admin stats');
  return await res.json();
}

export async function getAdminUsers(search = '', role = 'todos'): Promise<any[]> {
  const res = await fetch(`${BASE_URL}/admin/users?q=${encodeURIComponent(search)}&role=${encodeURIComponent(role)}`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('saniapet_jwt') || ''}` }
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  return await res.json();
}

export async function updateUserRole(userId: string, rol: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/admin/users/${userId}/role`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('saniapet_jwt') || ''}`
    },
    body: JSON.stringify({ rol })
  });
  if (!res.ok) throw new Error('Failed to update role');
  return await res.json();
}

export async function updateUserStatus(userId: string, estado: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/admin/users/${userId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('saniapet_jwt') || ''}`
    },
    body: JSON.stringify({ estado })
  });
  if (!res.ok) throw new Error('Failed to update status');
  return await res.json();
}

export async function deleteAdminUser(userId: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/admin/users/${userId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('saniapet_jwt') || ''}` }
  });
  if (!res.ok) throw new Error('Failed to delete user');
  return await res.json();
}

export async function getAdminPets(): Promise<any[]> {
  const res = await fetch(`${BASE_URL}/admin/pets`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('saniapet_jwt') || ''}` }
  });
  if (!res.ok) throw new Error('Failed to fetch pets list');
  return await res.json();
}

// ----------------------------------------------------
// Telemetry & Analytics APIs (with ON/OFF Kill-Switch)
// ----------------------------------------------------

export async function getAnalyticsConfig(): Promise<{ enabled: boolean; totalEvents: number }> {
  const res = await fetch(`${BASE_URL}/admin/analytics/config`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('saniapet_jwt') || ''}` }
  });
  if (!res.ok) throw new Error('Failed to fetch analytics config');
  return await res.json();
}

export async function toggleAnalyticsTracking(enabled: boolean): Promise<any> {
  const res = await fetch(`${BASE_URL}/admin/analytics/toggle`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('saniapet_jwt') || ''}`
    },
    body: JSON.stringify({ enabled })
  });
  if (!res.ok) throw new Error('Failed to toggle tracking');
  return await res.json();
}

export async function getAnalyticsMetrics(): Promise<any> {
  const res = await fetch(`${BASE_URL}/admin/analytics/metrics`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('saniapet_jwt') || ''}` }
  });
  if (!res.ok) throw new Error('Failed to fetch analytics metrics');
  return await res.json();
}

export async function purgeAnalytics(): Promise<any> {
  const res = await fetch(`${BASE_URL}/admin/analytics/purge`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('saniapet_jwt') || ''}` }
  });
  if (!res.ok) throw new Error('Failed to purge analytics');
  return await res.json();
}

// ----------------------------------------------------
// SQLite Hot Backups APIs
// ----------------------------------------------------

export async function getBackupsList(): Promise<any[]> {
  const res = await fetch(`${BASE_URL}/admin/backups`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('saniapet_jwt') || ''}` }
  });
  if (!res.ok) throw new Error('Failed to fetch backups list');
  return await res.json();
}

export async function createHotBackup(): Promise<any> {
  const res = await fetch(`${BASE_URL}/admin/backups/create`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('saniapet_jwt') || ''}` }
  });
  if (!res.ok) throw new Error('Failed to create backup');
  return await res.json();
}

export async function deleteBackupFile(filename: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/admin/backups/${encodeURIComponent(filename)}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('saniapet_jwt') || ''}` }
  });
  if (!res.ok) throw new Error('Failed to delete backup file');
  return await res.json();
}



