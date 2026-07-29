export interface Alerta {
  id: string;
  tipo: 'critica' | 'preventiva';
  titulo: string;
  descripcion: string;
  fecha?: string;
}

export interface Diagnostico {
  id: number;
  fecha: string;
  tipo: 'Consulta General' | 'Urgencia' | 'Especialidad';
  descripcion: string;
  doctor: string;
  estado: string;
  estadoColor: string;
  tipoColor: string;
  clinica: string;
}

export interface Vacuna {
  id: number;
  fecha: string;
  nombre: string;
  lote: string;
  veterinario: string;
  proximaFecha: string;
  estado: 'Aplicada' | 'Pendiente' | 'Vencida';
  estadoColor: string;
}

export interface Desparasitacion {
  id: number;
  fecha: string;
  tipo: 'Interna' | 'Externa';
  producto: string;
  pesoMascota: string;
  dosis: string;
  proximaFecha: string;
  veterinario: string;
}

export interface Medicamento {
  id: number;
  nombre: string;
  dosis: string;
  frecuencia: string;
  duracion: string;
  fechaInicio: string;
  veterinario: string;
  estado: 'Activo' | 'Completado';
}

export interface LabParametro {
  nombre: string;
  resultado: number | string;
  unidad: string;
  rangoReferencia: string;
  estado: 'Normal' | 'Alto' | 'Bajo';
}

export interface Laboratorio {
  id: string;
  fecha: string;
  examen: string;
  laboratorio: string;
  telefono: string;
  sitioWeb: string;
  direccion: string;
  convenio: string;
  directorTecnico: string;
  resultados: LabParametro[];
  notasGenerales?: string;
}

export interface ImagenMedica {
  id: number;
  fecha: string;
  tipo: 'Radiografía' | 'Ecografía' | 'Endoscopía';
  nombre: string;
  indicacion: string;
  informe: string;
  doctor: string;
  imagenUrl: string;
}

export interface PesoRegistro {
  fecha: string;
  peso: number;
}

export interface DiarioRegistro {
  id: number;
  fecha: string;
  sintoma: string;
  estado: 'Normal' | 'Atención' | 'Alerta';
  nota: string;
}

export interface Pet {
  id: string;
  nombre: string;
  especie: 'Perro' | 'Gato';
  raza: string;
  edad: string;
  sexo: string;
  pesoActual: string;
  fechaNacimiento: string;
  microchip: string;
  foto: string;
  seguro: string;
  clinicaFrecuente: string;
  propietario: {
    nombre: string;
    rut: string;
    telefono: string;
    email: string;
    direccion: string;
  };
  alertas: Alerta[];
  diagnosticos: Diagnostico[];
  vacunas: Vacuna[];
  desparasitaciones: Desparasitacion[];
  medicamentos: Medicamento[];
  laboratorios: Laboratorio[];
  imagenes: ImagenMedica[];
  pesoHistorial: PesoRegistro[];
  diario: DiarioRegistro[];
}

export const initialPetsDatabase: Record<string, Pet> = {
  luna: {
    id: 'luna',
    nombre: 'Luna',
    especie: 'Perro',
    raza: 'Beagle',
    edad: '3 años',
    sexo: 'Hembra (Esterilizada)',
    pesoActual: '12.4 kg',
    fechaNacimiento: '12/03/2023',
    microchip: '981022300456123',
    foto: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&q=80&w=300&h=300',
    seguro: 'PetPlan Gold (80% Cobertura)',
    clinicaFrecuente: 'Hospital Veterinario Sania Pet',
    propietario: {
      nombre: 'Jota Robles',
      rut: '17.654.321-K',
      telefono: '+56 9 8765 4321',
      email: 'jota.robles@saniapet.cl',
      direccion: 'Av. Providencia 1234, Santiago'
    },
    alertas: [
      {
        id: 'al1',
        tipo: 'critica',
        titulo: 'ALERGIA A LA IVERMECTINA',
        descripcion: 'Mutación del gen MDR1 confirmada. No administrar antiparasitarios con esta droga.'
      },
      {
        id: 'al2',
        tipo: 'preventiva',
        titulo: 'VACUNA ANTIRRÁBICA PRÓXIMA A VENCER',
        descripcion: 'Vence el 15/07/2026. Agendar hora de renovación.'
      }
    ],
    diagnosticos: [
      {
        id: 1,
        fecha: '10/05/2026',
        tipo: 'Consulta General',
        tipoColor: 'bg-blue-100 text-blue-700 border-blue-200',
        descripcion: 'Control sano anual y chequeo de peso.',
        doctor: 'Dra. Sandra Valenzuela',
        estado: 'Resuelto',
        estadoColor: 'bg-green-100 text-green-700',
        clinica: 'Hospital Veterinario Sania Pet'
      },
      {
        id: 2,
        fecha: '24/03/2026',
        tipo: 'Urgencia',
        tipoColor: 'bg-red-100 text-red-700 border-red-200',
        descripcion: 'Gastroenteritis aguda alimentaria. Ingesta de restos en la calle.',
        doctor: 'Dr. Roberto Cáceres',
        estado: 'Resuelto',
        estadoColor: 'bg-green-100 text-green-700',
        clinica: 'Urgencias Sania Pet 24/7'
      },
      {
        id: 3,
        fecha: '15/01/2026',
        tipo: 'Especialidad',
        tipoColor: 'bg-purple-100 text-purple-700 border-purple-200',
        descripcion: 'Otitis externa bilateral por hongos. Tratamiento ótico indicado.',
        doctor: 'Dra. María Paz Gómez (Dermatología)',
        estado: 'Controlado',
        estadoColor: 'bg-blue-100 text-blue-700',
        clinica: 'Hospital Veterinario Sania Pet'
      }
    ],
    vacunas: [
      {
        id: 1,
        fecha: '15/07/2025',
        nombre: 'Antirrábica (Rabigen)',
        lote: 'RAB-9923B',
        veterinario: 'Dra. Sandra Valenzuela',
        proximaFecha: '15/07/2026',
        estado: 'Aplicada',
        estadoColor: 'bg-green-100 text-green-700'
      },
      {
        id: 2,
        fecha: '12/03/2026',
        nombre: 'Séxtuple Canina (Defensor 6)',
        lote: 'SEX-8840A',
        veterinario: 'Dra. Sandra Valenzuela',
        proximaFecha: '12/03/2027',
        estado: 'Aplicada',
        estadoColor: 'bg-green-100 text-green-700'
      },
      {
        id: 3,
        fecha: '05/11/2025',
        nombre: 'KC Bronchicine (Tos de las perreras)',
        lote: 'KC-7721C',
        veterinario: 'Dr. Roberto Cáceres',
        proximaFecha: '05/11/2026',
        estado: 'Aplicada',
        estadoColor: 'bg-green-100 text-green-700'
      }
    ],
    desparasitaciones: [
      {
        id: 1,
        fecha: '10/06/2026',
        tipo: 'Externa',
        producto: 'NexGard Spectra M',
        pesoMascota: '12.4 kg',
        dosis: '1 tableta masticable (15-30 mg)',
        proximaFecha: '10/07/2026',
        veterinario: 'Dueño (Auto-administrado)'
      },
      {
        id: 2,
        fecha: '12/03/2026',
        tipo: 'Interna',
        producto: 'Drontal Plus Perros',
        pesoMascota: '12.1 kg',
        dosis: '1 tableta y cuarto',
        proximaFecha: '12/06/2026',
        veterinario: 'Dra. Sandra Valenzuela'
      },
      {
        id: 3,
        fecha: '10/03/2026',
        tipo: 'Externa',
        producto: 'Bravecto Perros Medianos',
        pesoMascota: '12.0 kg',
        dosis: '1 tableta (500 mg)',
        proximaFecha: '10/06/2026',
        veterinario: 'Dueño (Auto-administrado)'
      }
    ],
    medicamentos: [
      {
        id: 1,
        nombre: 'Prednisona 5mg (Comprimidos)',
        dosis: '1/2 tableta',
        frecuencia: 'Cada 24 horas',
        duracion: 'Terminado el 20/05/2026',
        fechaInicio: '15/05/2026',
        veterinario: 'Dra. Sandra Valenzuela',
        estado: 'Completado'
      },
      {
        id: 2,
        nombre: 'Glandulex Sacs (Suplemento de fibra)',
        dosis: '1 croqueta masticable',
        frecuencia: 'Cada 24 horas (Con alimento)',
        duracion: 'Uso continuo preventivo',
        fechaInicio: '10/05/2026',
        veterinario: 'Dra. Sandra Valenzuela',
        estado: 'Activo'
      }
    ],
    laboratorios: [
      {
        id: '2026-05-883',
        fecha: '10/05/2026',
        examen: 'Hemograma Completo Automatizado',
        laboratorio: 'Veterinary Diagnostics Lab Sania',
        telefono: '+56 2 2987 6543',
        sitioWeb: 'lab.saniapet.cl',
        direccion: 'Av. Vitacura 5400, Santiago',
        convenio: 'PetPlan Seguro Veterinario',
        directorTecnico: 'Dr. Fernando Leyton (Patólogo Clínico)',
        notasGenerales: 'Todos los parámetros hematológicos se encuentran dentro de los rangos de referencia para la especie canina. Serie roja y plaquetaria normales. Sin presencia de parásitos hemáticos.',
        resultados: [
          { nombre: 'Hematocrito', resultado: 45.2, unidad: '%', rangoReferencia: '37.0 - 55.0', estado: 'Normal' },
          { nombre: 'Hemoglobina', resultado: 15.6, unidad: 'g/dL', rangoReferencia: '12.0 - 18.0', estado: 'Normal' },
          { nombre: 'Eritrocitos', resultado: 6.8, unidad: 'x10^6/uL', rangoReferencia: '5.5 - 8.5', estado: 'Normal' },
          { nombre: 'Leucocitos Totales', resultado: 10.4, unidad: 'x10^3/uL', rangoReferencia: '6.0 - 17.0', estado: 'Normal' },
          { nombre: 'Segmentados (Neutrófilos)', resultado: 7.2, unidad: 'x10^3/uL', rangoReferencia: '3.0 - 11.5', estado: 'Normal' },
          { nombre: 'Linfocitos', resultado: 2.1, unidad: 'x10^3/uL', rangoReferencia: '1.0 - 4.8', estado: 'Normal' },
          { nombre: 'Plaquetas', resultado: 320, unidad: 'x10^3/uL', rangoReferencia: '150 - 500', estado: 'Normal' }
        ]
      },
      {
        id: '2026-03-412',
        fecha: '24/03/2026',
        examen: 'Perfil Bioquímico Sanguíneo Básico',
        laboratorio: 'Veterinary Diagnostics Lab Sania',
        telefono: '+56 2 2987 6543',
        sitioWeb: 'lab.saniapet.cl',
        direccion: 'Av. Vitacura 5400, Santiago',
        convenio: 'Particular',
        directorTecnico: 'Dr. Fernando Leyton (Patólogo Clínico)',
        notasGenerales: 'Elevación discreta de GPT/ALT y Amilasa debido a la gastroenteritis aguda de la paciente. Glucosa y función renal óptimas.',
        resultados: [
          { nombre: 'Glucosa', resultado: 95, unidad: 'mg/dL', rangoReferencia: '70 - 110', estado: 'Normal' },
          { nombre: 'Urea', resultado: 25, unidad: 'mg/dL', rangoReferencia: '10 - 45', estado: 'Normal' },
          { nombre: 'Creatinina', resultado: 0.9, unidad: 'mg/dL', rangoReferencia: '0.5 - 1.5', estado: 'Normal' },
          { nombre: 'Proteínas Totales', resultado: 6.4, unidad: 'g/dL', rangoReferencia: '5.4 - 7.5', estado: 'Normal' },
          { nombre: 'GPT / ALT (Hepático)', resultado: 92, unidad: 'U/L', rangoReferencia: '10 - 80', estado: 'Alto' },
          { nombre: 'Fosfatasa Alcalina', resultado: 68, unidad: 'U/L', rangoReferencia: '20 - 150', estado: 'Normal' }
        ]
      }
    ],
    imagenes: [
      {
        id: 1,
        fecha: '24/03/2026',
        tipo: 'Radiografía',
        nombre: 'Radiografía de Abdomen Simple (Lateral/Ventrodorsal)',
        indicacion: 'Evaluar presencia de cuerpos extraños por gastroenteritis aguda.',
        doctor: 'Dr. Ignacio Valdivia (Radiólogo)',
        informe: 'Se observan estómago y asas intestinales con moderada acumulación de gas. No se visualizan imágenes radiopacas compatibles con cuerpos extraños obstructivos metálicos ni óseos. Estructura hepática y silueta vesical dentro de límites normales.',
        imagenUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400&h=300'
      }
    ],
    pesoHistorial: [
      { fecha: 'Oct 25', peso: 11.5 },
      { fecha: 'Nov 25', peso: 11.8 },
      { fecha: 'Dic 25', peso: 11.9 },
      { fecha: 'Ene 26', peso: 12.0 },
      { fecha: 'Mar 26', peso: 12.1 },
      { fecha: 'May 26', peso: 12.4 }
    ],
    diario: [
      { id: 1, fecha: '22/06/2026', sintoma: 'Buen apetito', estado: 'Normal', nota: 'Comió todo su alimento habitual y anduvo con bastante energía.' },
      { id: 2, fecha: '18/06/2026', sintoma: 'Prurito leve en oreja derecha', estado: 'Atención', nota: 'Se rascó un par de veces por la tarde, pero el canal auditivo se ve limpio y seco.' }
    ]
  },
  max: {
    id: 'max',
    nombre: 'Max',
    especie: 'Gato',
    raza: 'Persa',
    edad: '5 años',
    sexo: 'Macho (Castrado)',
    pesoActual: '4.8 kg',
    fechaNacimiento: '08/09/2021',
    microchip: '981022300456987',
    foto: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300&h=300',
    seguro: 'Sura Pets Plan Base (60% Cobertura)',
    clinicaFrecuente: 'Hospital Veterinario Sania Pet',
    propietario: {
      nombre: 'Jota Robles',
      rut: '17.654.321-K',
      telefono: '+56 9 8765 4321',
      email: 'jota.robles@saniapet.cl',
      direccion: 'Av. Providencia 1234, Santiago'
    },
    alertas: [
      {
        id: 'al3',
        tipo: 'critica',
        titulo: 'SÍNDROME URINARIO FELINO (FLUTD)',
        descripcion: 'Antecedentes de obstrucción uretral. Monitorear micción diaria y mantener alimento húmedo medicado.'
      }
    ],
    diagnosticos: [
      {
        id: 1,
        fecha: '18/04/2026',
        tipo: 'Consulta General',
        tipoColor: 'bg-blue-100 text-blue-700 border-blue-200',
        descripcion: 'Control renal preventivo y revisión odontológica general.',
        doctor: 'Dr. Francisco Muñoz (Medicina Felina)',
        estado: 'En control',
        estadoColor: 'bg-blue-100 text-blue-700',
        clinica: 'Hospital Veterinario Sania Pet'
      },
      {
        id: 2,
        fecha: '05/12/2025',
        tipo: 'Urgencia',
        tipoColor: 'bg-red-100 text-red-700 border-red-200',
        descripcion: 'Dificultad al orinar (Disuria). Arenilla vesical detectada mediante ecografía.',
        doctor: 'Dra. Sandra Valenzuela',
        estado: 'Resuelto',
        estadoColor: 'bg-green-100 text-green-700',
        clinica: 'Hospital Veterinario Sania Pet'
      }
    ],
    vacunas: [
      {
        id: 1,
        fecha: '10/09/2025',
        nombre: 'Triple Felina (Feline Vax 3)',
        lote: 'TF-2212E',
        veterinario: 'Dr. Francisco Muñoz',
        proximaFecha: '10/09/2026',
        estado: 'Aplicada',
        estadoColor: 'bg-green-100 text-green-700'
      },
      {
        id: 2,
        fecha: '10/09/2025',
        nombre: 'Antirrábica Felina',
        lote: 'RAB-FEL-92A',
        veterinario: 'Dr. Francisco Muñoz',
        proximaFecha: '10/09/2026',
        estado: 'Aplicada',
        estadoColor: 'bg-green-100 text-green-700'
      },
      {
        id: 3,
        fecha: '15/10/2024',
        nombre: 'Leucemia Felina (Leukocell 2)',
        lote: 'LF-3401D',
        veterinario: 'Dra. Sandra Valenzuela',
        proximaFecha: '15/10/2025',
        estado: 'Vencida',
        estadoColor: 'bg-red-100 text-red-700'
      }
    ],
    desparasitaciones: [
      {
        id: 1,
        fecha: '20/05/2026',
        tipo: 'Externa',
        producto: 'Bravecto Plus Gatos (Pipeta)',
        pesoMascota: '4.8 kg',
        dosis: '1 pipeta aplicación tópica (112.5 mg)',
        proximaFecha: '20/08/2026',
        veterinario: 'Dueño (Auto-administrado)'
      },
      {
        id: 2,
        fecha: '10/03/2026',
        tipo: 'Interna',
        producto: 'Milbemax Gatos',
        pesoMascota: '4.7 kg',
        dosis: '1 tableta',
        proximaFecha: '10/06/2026',
        veterinario: 'Dr. Francisco Muñoz'
      }
    ],
    medicamentos: [
      {
        id: 1,
        nombre: 'Royal Canin Urinary S/O Wet (Alimento Húmedo)',
        dosis: '1 sobre al día',
        frecuencia: 'Cada 24 horas',
        duracion: 'Permanente',
        fechaInicio: '06/12/2025',
        veterinario: 'Dr. Francisco Muñoz',
        estado: 'Activo'
      }
    ],
    laboratorios: [
      {
        id: '2026-04-102',
        fecha: '18/04/2026',
        examen: 'Perfil Bioquímico Felino y Urianálisis',
        laboratorio: 'Veterinary Diagnostics Lab Sania',
        telefono: '+56 2 2987 6543',
        sitioWeb: 'lab.saniapet.cl',
        direccion: 'Av. Vitacura 5400, Santiago',
        convenio: 'Particular',
        directorTecnico: 'Dr. Fernando Leyton (Patólogo Clínico)',
        notasGenerales: 'El perfil renal muestra valores de SDMA, Creatinina y BUN estables. El examen de orina indica un pH de 6.2 con ausencia de cristales de estruvita. Continuar con dieta Urinary S/O.',
        resultados: [
          { nombre: 'Glucosa', resultado: 88, unidad: 'mg/dL', rangoReferencia: '70 - 150', estado: 'Normal' },
          { nombre: 'BUN (Nitrógeno Ureico)', resultado: 22, unidad: 'mg/dL', rangoReferencia: '15 - 34', estado: 'Normal' },
          { nombre: 'Creatinina Sérica', resultado: 1.3, unidad: 'mg/dL', rangoReferencia: '0.8 - 2.0', estado: 'Normal' },
          { nombre: 'SDMA (Marcador Precoz)', resultado: 11, unidad: 'ug/dL', rangoReferencia: '0 - 14', estado: 'Normal' },
          { nombre: 'Densidad Urinaria', resultado: 1.045, unidad: 'g/ml', rangoReferencia: '> 1.035', estado: 'Normal' },
          { nombre: 'pH Orina', resultado: 6.2, unidad: 'pH', rangoReferencia: '6.0 - 7.0', estado: 'Normal' }
        ]
      }
    ],
    imagenes: [
      {
        id: 1,
        fecha: '05/12/2025',
        tipo: 'Ecografía',
        nombre: 'Ecografía de Vías Urinarias y Vejiga',
        indicacion: 'Descartar urolitos vesicales u obstrucción renal por disuria severa.',
        doctor: 'Dra. Elena Pastene (Ecografista)',
        informe: 'Vejiga con pared levemente engrosada (cistitis). Presencia de abundante sedimento urinario en suspensión compatible con arenilla/microcristales. No se aprecian cálculos de gran tamaño productores de sombra acústica. Riñones conservan adecuada relación cortico-medular.',
        imagenUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400&h=300'
      }
    ],
    pesoHistorial: [
      { fecha: 'Oct 25', peso: 4.5 },
      { fecha: 'Nov 25', peso: 4.6 },
      { fecha: 'Dic 25', peso: 4.4 },
      { fecha: 'Ene 26', peso: 4.6 },
      { fecha: 'Abr 26', peso: 4.8 }
    ],
    diario: [
      { id: 1, fecha: '22/06/2026', sintoma: 'Micción normal', estado: 'Normal', nota: 'Fue a su caja de arena dos veces, orinando volumen normal sin quejarse.' },
      { id: 2, fecha: '21/06/2026', sintoma: 'Apetito caprichoso', estado: 'Atención', nota: 'No se comió todo el alimento húmedo por la mañana, pero terminó el seco de noche.' }
    ]
  }
};

const LOCAL_STORAGE_KEY = 'saniapet_pets_database_v1';

export function loadPetsDatabase(): Record<string, Pet> {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error loading petsDatabase from localStorage:', e);
    }
  }
  return initialPetsDatabase;
}

export const petsDatabase: Record<string, Pet> = loadPetsDatabase();

export function savePetsDatabase(): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(petsDatabase));
    } catch (e) {
      console.warn('Error saving petsDatabase to localStorage:', e);
    }
  }
}
