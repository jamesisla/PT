export interface Place {
  id: number;
  nombre: string;
  categoria: 'veterinaria' | 'tienda' | 'alimento' | 'paseador' | 'cuidador' | 'hotel' | 'petfriendly';
  subtipo: string;
  rating: number;
  reviews: number;
  direccion: string;
  telefono: string;
  whatsapp: string;
  tarifa: string;
  horario: string;
  lat: number;
  lng: number;
  descripcion: string;
  imagenUrl?: string;
}

export interface LostPet {
  id: number;
  mascotaId?: string | null;
  nombreMascota: string;
  especie: string;
  raza: string;
  color: string;
  foto: string;
  fechaExtravio: string;
  lat: number;
  lng: number;
  direccionReferencia: string;
  recompensa?: string;
  contactoNombre: string;
  contactoTelefono: string;
  contactoWhatsapp?: string;
  descripcion: string;
  estado: 'perdida' | 'avistada' | 'encontrada';
  radioMetros: number;
  createdAt?: string;
}

export const initialPlaces: Place[] = [
  {
    id: 1,
    nombre: 'Hospital Veterinario Sania Pet & Urgencias 24h',
    categoria: 'veterinaria',
    subtipo: 'Hospital Clínico Veterinario 24/7',
    rating: 4.9,
    reviews: 312,
    direccion: 'Av. Providencia 1450, Providencia',
    telefono: '+56 2 2987 6543',
    whatsapp: '+56987654321',
    tarifa: 'Consulta general $22.000 / Urgencias $35.000',
    horario: 'Abierto 24 Horas',
    lat: -33.4265,
    lng: -70.6120,
    descripcion: 'Atención médica integral, quirófano de alta complejidad, laboratorio clínico interno y urgencias 24/7.',
    imagenUrl: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&q=80&w=400&h=300'
  },
  {
    id: 2,
    nombre: 'Sania Pet Shop & Farmacia Veterinaria',
    categoria: 'tienda',
    subtipo: 'Boutique, Accesorios y Farmacia',
    rating: 4.8,
    reviews: 189,
    direccion: 'Av. Andrés Bello 2100, local 4B, Providencia',
    telefono: '+56 2 2987 6500',
    whatsapp: '+56912345678',
    tarifa: 'Variedad de precios y convenios',
    horario: 'Lun - Sáb: 09:00 a 20:30',
    lat: -33.4190,
    lng: -70.6080,
    descripcion: 'Alimentos medicados y premium, juguetes interactivos, farmacia veterinaria con receta y accesorios de viaje.',
    imagenUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=400&h=300'
  },
  {
    id: 3,
    nombre: 'Tomás Robles - Paseos Caninos & Socialización',
    categoria: 'paseador',
    subtipo: 'Paseador Certificado & Estudiante Vet',
    rating: 5.0,
    reviews: 64,
    direccion: 'Sector Plaza Las Lilas / Pocuro, Providencia',
    telefono: '+56 9 8765 4321',
    whatsapp: '+56987654321',
    tarifa: '$8.500 / Paseo (1 hr) - Packs mensuales',
    horario: 'Lun - Vie: 07:00 a 19:00',
    lat: -33.4340,
    lng: -70.6020,
    descripcion: 'Paseos en grupos reducidos (máx 3 perros), hidratación constante, collar con GPS satelital y reporte con fotos.',
    imagenUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=400&h=300'
  },
  {
    id: 4,
    nombre: 'NutriPet BARF & Alimento Natural',
    categoria: 'alimento',
    subtipo: 'Dietas Crudas, BARF y Pastelería Canina',
    rating: 4.9,
    reviews: 95,
    direccion: 'Av. Francisco Bilbao 1650, Providencia',
    telefono: '+56 9 9123 4455',
    whatsapp: '+56991234455',
    tarifa: 'Menús desde $3.900',
    horario: 'Mar - Dom: 10:00 a 19:30',
    lat: -33.4385,
    lng: -70.6095,
    descripcion: 'Porciones personalizadas congeladas, suplementos naturales, caldos de hueso y tortas de cumpleaños para mascotas.',
    imagenUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&q=80&w=400&h=300'
  },
  {
    id: 5,
    nombre: 'Valeria Gómez - Cuidado Felino & Canino a Domicilio',
    categoria: 'cuidador',
    subtipo: 'Técnico en Enfermería Veterinaria (TENS Vet)',
    rating: 5.0,
    reviews: 42,
    direccion: 'Calle Los Leones 850, Providencia',
    telefono: '+56 9 2468 1357',
    whatsapp: '+56924681357',
    tarifa: '$15.000 / Visita o Noche',
    horario: 'Disponible con reserva previa',
    lat: -33.4280,
    lng: -70.6050,
    descripcion: 'Visitas de cuidado en casa para gatos y perros tímidos. Administración de medicamentos orales e inyectables.',
    imagenUrl: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=400&h=300'
  },
  {
    id: 6,
    nombre: 'Hotel Felino & Canino Resort Las Palmas',
    categoria: 'hotel',
    subtipo: 'Hotel Boutique & Guardería de Día',
    rating: 4.7,
    reviews: 118,
    direccion: 'Av. El Bosque Sur 120, Las Condes',
    telefono: '+56 2 2345 6789',
    whatsapp: '+56933445566',
    tarifa: '$26.000 / Día (incluye cámaras 24h)',
    horario: 'Recepción: 08:00 a 20:00',
    lat: -33.4160,
    lng: -70.5960,
    descripcion: 'Habitaciones individuales climatizadas, patio de juegos exterior, cámaras de seguridad accesibles desde app.',
    imagenUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=400&h=300'
  },
  {
    id: 7,
    nombre: 'Café & Jardín Pet-Friendly El Botánico',
    categoria: 'petfriendly',
    subtipo: 'Cafetería & Terraza Apta Mascotas',
    rating: 4.8,
    reviews: 230,
    direccion: 'Av. Pocuro 2012, Providencia',
    telefono: '+56 9 9876 5432',
    whatsapp: '+56998765432',
    tarifa: '$4.500 - $9.000 consumo promedio',
    horario: 'Lun - Dom: 08:30 a 21:00',
    lat: -33.4355,
    lng: -70.5980,
    descripcion: 'Amplia terraza arbolada con bebederos de agua fresca, snacks de cortesía y espacio seguro para descanso de mascotas.',
    imagenUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=400&h=300'
  }
];

export const initialLostPets: LostPet[] = [
  {
    id: 1,
    mascotaId: null,
    nombreMascota: 'Thor',
    especie: 'Perro',
    raza: 'Golden Retriever',
    color: 'Dorado claro',
    foto: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400&h=400',
    fechaExtravio: 'Ayer a las 18:30 hrs',
    lat: -33.4310,
    lng: -70.6060,
    direccionReferencia: 'Cerca de Parque Inés de Suárez, Providencia',
    recompensa: '$100.000',
    contactoNombre: 'Carlos Mendoza',
    contactoTelefono: '+56 9 7788 9900',
    contactoWhatsapp: '+56977889900',
    descripcion: 'Se asustó con el ruido de fuegos artificiales y salió corriendo hacia Av. Bilbao. Lleva collar azul con placa y microchip.',
    estado: 'perdida',
    radioMetros: 400,
    createdAt: '2026-08-23 19:00'
  },
  {
    id: 2,
    mascotaId: null,
    nombreMascota: 'Mimi',
    especie: 'Gato',
    raza: 'Siamés / Mestizo',
    color: 'Crema con orejas y cola oscura',
    foto: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400&h=400',
    fechaExtravio: 'Hoy a las 08:00 hrs',
    lat: -33.4230,
    lng: -70.6150,
    direccionReferencia: 'Sector Metro Manuel Montt / Calle Manuel Montt',
    recompensa: '$50.000',
    contactoNombre: 'Marcela Silva',
    contactoTelefono: '+56 9 6655 4433',
    contactoWhatsapp: '+56966554433',
    descripcion: 'Gatita de interior, muy asustadiza. Se escapó por una ventana abierta en el segundo piso. Ojos celestes intensos.',
    estado: 'perdida',
    radioMetros: 250,
    createdAt: '2026-08-24 08:30'
  }
];

const LOCAL_STORAGE_PLACES_KEY = 'sania_pet_places_db';
const LOCAL_STORAGE_LOST_PETS_KEY = 'sania_pet_lost_pets_db';

export function getLocalPlaces(): Place[] {
  if (typeof window === 'undefined') return initialPlaces;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_PLACES_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error reading places from localStorage', e);
  }
  return initialPlaces;
}

export function saveLocalPlaces(places: Place[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_PLACES_KEY, JSON.stringify(places));
  } catch (e) {
    console.error('Error saving places to localStorage', e);
  }
}

export function getLocalLostPets(): LostPet[] {
  if (typeof window === 'undefined') return initialLostPets;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_LOST_PETS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error reading lost pets from localStorage', e);
  }
  return initialLostPets;
}

export function saveLocalLostPets(lostPets: LostPet[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_LOST_PETS_KEY, JSON.stringify(lostPets));
  } catch (e) {
    console.error('Error saving lost pets to localStorage', e);
  }
}
