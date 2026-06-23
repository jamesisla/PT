import { useState, useMemo } from 'react';
import { ArrowLeft, MapPin, Star, Phone, Search, Navigation, Coffee, ShoppingBag, BedDouble, UserCheck, Check, Sparkles } from 'lucide-react';

interface MapetServiciosProps {
  onBack: () => void;
}

interface Place {
  id: number;
  nombre: string;
  categoria: 'paseador' | 'cuidador' | 'hotel' | 'tienda' | 'petfriendly';
  subtipo: string;
  rating: number;
  reviews: number;
  distancia: string;
  direccion: string;
  telefono: string;
  tarifa: string;
  estado: 'Abierto' | 'Disponible' | 'Cerrado';
  coordenadas: { x: number; y: number }; // Simulated grid coordinates (0-100)
  descripcion: string;
}

const mockPlaces: Place[] = [
  {
    id: 1,
    nombre: 'Café de las Mascotas',
    categoria: 'petfriendly',
    subtipo: 'Cafetería & Pastelería',
    rating: 4.8,
    reviews: 124,
    distancia: '350 m',
    direccion: 'Av. Providencia 1450, Providencia',
    telefono: '+56 9 1234 5678',
    tarifa: '$4.000 - $8.000 promedio',
    estado: 'Abierto',
    coordenadas: { x: 35, y: 42 },
    descripcion: 'Cafetería de especialidad con menú dedicado para perros y gatos. Espacio exterior aclimatado y juegos interactivos.'
  },
  {
    id: 2,
    nombre: 'Tomás Robles (Paseos Caninos)',
    categoria: 'paseador',
    subtipo: 'Paseador Certificado',
    rating: 4.9,
    reviews: 56,
    distancia: '600 m',
    direccion: 'Sector Plaza Las Lilas, Providencia',
    telefono: '+56 9 8765 4321',
    tarifa: '$8.500 / Paseo (1 hr)',
    estado: 'Disponible',
    coordenadas: { x: 58, y: 28 },
    descripcion: 'Estudiante de medicina veterinaria y paseador profesional. Salidas en grupos reducidos con GPS en collar.'
  },
  {
    id: 3,
    nombre: 'Sania Pet Shop & Boutique',
    categoria: 'tienda',
    subtipo: 'Tienda de Accesorios y Alimento',
    rating: 4.7,
    reviews: 215,
    distancia: '1.2 km',
    direccion: 'Av. Andrés Bello 2100, local 4B',
    telefono: '+56 2 2987 6500',
    tarifa: 'Precios variados',
    estado: 'Abierto',
    coordenadas: { x: 72, y: 55 },
    descripcion: 'Alimentos premium, juguetes interactivos ecológicos y farmacia veterinaria autorizada.'
  },
  {
    id: 4,
    nombre: 'Valeria Gómez (Cuidado a domicilio)',
    categoria: 'cuidador',
    subtipo: 'Cuidadora Veterinaria',
    rating: 5.0,
    reviews: 32,
    distancia: '800 m',
    direccion: 'Calle Los Leones 850, Providencia',
    telefono: '+56 9 2468 1357',
    tarifa: '$15.000 / Noche',
    estado: 'Disponible',
    coordenadas: { x: 22, y: 65 },
    descripcion: 'Técnico en enfermería veterinaria. Visito a tu gato o perro en casa. Administración de medicamentos.'
  },
  {
    id: 5,
    nombre: 'Hotel Felino & Canino Las Palmas',
    categoria: 'hotel',
    subtipo: 'Hotel de Mascotas',
    rating: 4.6,
    reviews: 98,
    distancia: '2.5 km',
    direccion: 'Av. El Bosque Sur 120, Las Condes',
    telefono: '+56 2 2345 6789',
    tarifa: '$25.000 / Día',
    estado: 'Abierto',
    coordenadas: { x: 80, y: 20 },
    descripcion: 'Habitaciones individuales climatizadas, cámaras de seguridad 24/7 de libre acceso para dueños y patio de juegos gigante.'
  },
  {
    id: 6,
    nombre: 'Restaurante El Jardín Pet-Friendly',
    categoria: 'petfriendly',
    subtipo: 'Restaurante Familiar',
    rating: 4.7,
    reviews: 182,
    distancia: '450 m',
    direccion: 'Av. Pocuro 2012, Providencia',
    telefono: '+56 9 9876 5432',
    tarifa: '$12.000 - $20.000 p/p',
    estado: 'Abierto',
    coordenadas: { x: 45, y: 70 },
    descripcion: 'Amplia terraza arbolada. Ofrecen mantitas, agua fresca y snacks saludables cortesía de la casa para tu mascota.'
  },
  {
    id: 7,
    nombre: 'Camila Soto (Entrenamiento & Cuidado)',
    categoria: 'cuidador',
    subtipo: 'Etóloga y Cuidadora',
    rating: 4.9,
    reviews: 44,
    distancia: '1.5 km',
    direccion: 'Av. Francisco Bilbao 1650, Providencia',
    telefono: '+56 9 1357 2468',
    tarifa: '$18.000 / Noche',
    estado: 'Disponible',
    coordenadas: { x: 12, y: 35 },
    descripcion: 'Especialista en comportamiento canino. Ofrezco estadías familiares sin jaulas en casa amplia con jardín seguro.'
  }
];

export default function MapetServicios({ onBack }: MapetServiciosProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [simulatedSuccess, setSimulatedSuccess] = useState(false);

  const categories = [
    { id: 'todos', label: 'Todos', color: 'bg-[#00AEEF] text-white border-[#00AEEF]' },
    { id: 'paseador', label: 'Paseadores', color: 'bg-amber-500 text-white border-amber-500' },
    { id: 'cuidador', label: 'Cuidadores', color: 'bg-purple-500 text-white border-purple-500' },
    { id: 'hotel', label: 'Hoteles', color: 'bg-emerald-500 text-white border-emerald-500' },
    { id: 'tienda', label: 'Tiendas', color: 'bg-rose-500 text-white border-rose-500' },
    { id: 'petfriendly', label: 'Pet-Friendly', color: 'bg-cyan-500 text-white border-cyan-500' }
  ];

  // Filter places based on category and search query
  const filteredPlaces = useMemo(() => {
    return mockPlaces.filter((place) => {
      const matchesCategory = selectedCategory === 'todos' || place.categoria === selectedCategory;
      const matchesSearch = place.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            place.subtipo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            place.direccion.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleContact = () => {
    setSimulatedSuccess(true);
    setTimeout(() => {
      setSimulatedSuccess(false);
    }, 2000);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'paseador': return 'bg-amber-500';
      case 'cuidador': return 'bg-purple-500';
      case 'hotel': return 'bg-emerald-500';
      case 'tienda': return 'bg-rose-500';
      case 'petfriendly': return 'bg-cyan-500';
      default: return 'bg-blue-500';
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'paseador': return <Navigation className="w-3.5 h-3.5" />;
      case 'cuidador': return <UserCheck className="w-3.5 h-3.5" />;
      case 'hotel': return <BedDouble className="w-3.5 h-3.5" />;
      case 'tienda': return <ShoppingBag className="w-3.5 h-3.5" />;
      case 'petfriendly': return <Coffee className="w-3.5 h-3.5" />;
      default: return <MapPin className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00AEEF] to-[#1A5AD7] p-5 pb-6 rounded-b-3xl text-white shadow-md shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-white/90 mb-3 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-xs font-semibold">Volver al Inicio</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight leading-tight">mapet lugares & Servicios</h1>
            <p className="text-white/70 text-[9px] uppercase font-black tracking-widest mt-0.5">Maqueta de Geolocalización</p>
          </div>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="p-4 bg-white border-b border-gray-100 space-y-3 shadow-[0_4px_10px_rgba(0,0,0,0.01)] shrink-0">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar paseadores, cafés, veterinarias..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-4 py-3 text-xs font-bold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00AEEF] transition-all"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
        </div>

        {/* Categories Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-2 px-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedPlace(null);
                }}
                className={`px-4 py-2 text-[10px] font-black rounded-full border whitespace-nowrap transition-all uppercase tracking-wide ${
                  isSelected 
                    ? cat.color + ' shadow-sm'
                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Map Area */}
      <div className="flex-1 bg-[#EAEAEA] relative overflow-hidden flex flex-col justify-center">
        {/* Grid city background pattern */}
        <div className="absolute inset-0 bg-[#E8F0FE]" style={{ 
          backgroundImage: `
            radial-gradient(#C6DAFC 1.5px, transparent 1.5px), 
            linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px), 
            linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px, 40px 40px, 40px 40px' 
        }}>
          {/* Main Diagonal Highway (Providencia representation) */}
          <div className="absolute top-1/3 bottom-1/2 left-0 right-0 bg-[#FFF] border-y-4 border-[#FAD7A0] rotate-6 transform scale-110 shadow-inner flex items-center justify-center font-bold text-[8px] text-gray-400 uppercase tracking-widest pointer-events-none">
            Av. Nueva Providencia
          </div>

          {/* Vertical Avenue */}
          <div className="absolute left-1/3 right-1/2 top-0 bottom-0 bg-[#FFF] border-x-4 border-[#FAD7A0] -rotate-12 transform scale-110 shadow-inner flex items-center justify-center pointer-events-none" />

          {/* Parks / Green Zones */}
          <div className="absolute top-10 left-10 w-28 h-20 bg-[#D4EFDF] border border-[#A9DFBF] rounded-[30px] opacity-70 flex items-center justify-center pointer-events-none">
            <span className="text-[7px] text-[#27AE60] font-black uppercase tracking-wider">Parque Las Lilas</span>
          </div>

          <div className="absolute bottom-16 right-8 w-32 h-24 bg-[#D4EFDF] border border-[#A9DFBF] rounded-[40px] opacity-70 flex items-center justify-center pointer-events-none">
            <span className="text-[7px] text-[#27AE60] font-black uppercase tracking-wider">Plaza Inés de Suárez</span>
          </div>

          {/* User Current Position Dot */}
          <div className="absolute left-1/2 top-1/2 -ml-3.5 -mt-3.5 z-20 flex flex-col items-center">
            <div className="w-7 h-7 bg-blue-500/20 rounded-full flex items-center justify-center animate-ping absolute" />
            <div className="w-5 h-5 bg-white rounded-full shadow flex items-center justify-center z-10 border-2 border-blue-500">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
            </div>
            <span className="bg-blue-600 text-white text-[6px] font-black px-1 py-0.5 rounded shadow mt-1 uppercase z-10 whitespace-nowrap">Tu Ubicación</span>
          </div>

          {/* Markers */}
          {filteredPlaces.map((place) => {
            const isSelected = selectedPlace?.id === place.id;
            const markerColor = getCategoryColor(place.categoria);
            return (
              <button
                key={place.id}
                onClick={() => setSelectedPlace(place)}
                style={{ left: `${place.coordenadas.x}%`, top: `${place.coordenadas.y}%` }}
                className={`absolute -ml-5 -mt-8 z-10 flex flex-col items-center group transition-all duration-200 ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                }`}
              >
                {/* Pin Tooltip */}
                <span className={`opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-1 bg-gray-900 text-white text-[8px] font-black py-0.5 px-2 rounded-md shadow uppercase tracking-wider z-40 whitespace-nowrap pointer-events-none`}>
                  {place.nombre}
                </span>

                {/* Marker Body */}
                <div className="relative flex items-center justify-center">
                  {/* Pin SVG */}
                  <svg className={`w-8 h-8 filter drop-shadow-md ${isSelected ? 'text-gray-900' : 'text-white'}`} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  </svg>
                  {/* Icon Circle */}
                  <div className={`absolute top-1.5 w-4.5 h-4.5 rounded-full flex items-center justify-center text-white ${markerColor}`}>
                    {getCategoryIcon(place.categoria)}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected place details panel */}
        {selectedPlace ? (
          <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-3xl p-5 border border-gray-100 shadow-2xl z-30 animate-in slide-in-from-bottom duration-300">
            <button 
              onClick={() => setSelectedPlace(null)}
              className="absolute right-4 top-4 p-1.5 bg-gray-50 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-start gap-3.5">
              <div className={`p-3 rounded-2xl text-white shrink-0 ${getCategoryColor(selectedPlace.categoria)}`}>
                {getCategoryIcon(selectedPlace.categoria)}
              </div>
              <div className="flex-1 min-w-0 pr-4">
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                  {selectedPlace.subtipo}
                </span>
                <h4 className="font-extrabold text-gray-900 text-sm leading-tight mt-1 truncate">{selectedPlace.nombre}</h4>
                
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className="flex items-center text-amber-500 gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-500 stroke-none" />
                    <span className="text-[11px] font-black">{selectedPlace.rating}</span>
                  </div>
                  <span className="text-gray-300 text-[10px]">•</span>
                  <span className="text-gray-500 text-[10px] font-bold">{selectedPlace.reviews} opiniones</span>
                  <span className="text-gray-300 text-[10px]">•</span>
                  <span className="text-gray-800 text-[10px] font-extrabold">{selectedPlace.distancia}</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-gray-600 font-semibold mt-3.5 bg-gray-50 p-3 rounded-2xl leading-normal border border-gray-100">
              {selectedPlace.descripcion}
            </p>

            <div className="grid grid-cols-2 gap-3 mt-4 text-[10px] font-bold text-gray-500">
              <div>
                <span className="block text-[8px] text-gray-400 uppercase tracking-wider mb-0.5">Tarifa / Rango</span>
                <span className="text-gray-800 font-black">{selectedPlace.tarifa}</span>
              </div>
              <div>
                <span className="block text-[8px] text-gray-400 uppercase tracking-wider mb-0.5">Estado / Horario</span>
                <span className={`inline-block px-2 py-0.5 text-[8px] font-black rounded uppercase ${
                  selectedPlace.estado === 'Disponible' || selectedPlace.estado === 'Abierto'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    : 'bg-red-50 text-red-700 border border-red-100'
                }`}>
                  {selectedPlace.estado}
                </span>
              </div>
              <div className="col-span-2 pt-2 border-t border-gray-50 flex items-center gap-2">
                <span className="text-gray-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  {selectedPlace.direccion}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5 mt-5">
              <a
                href={`tel:${selectedPlace.telefono}`}
                className="flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black text-xs uppercase tracking-wider py-3.5 rounded-2xl transition-all active:scale-[0.98]"
              >
                <Phone className="w-4 h-4" />
                Llamar
              </a>

              <button
                onClick={handleContact}
                className={`flex items-center justify-center gap-1.5 font-black text-xs uppercase tracking-wider py-3.5 rounded-2xl shadow-md transition-all active:scale-[0.98] ${
                  simulatedSuccess
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                    : 'bg-[#00AEEF] text-white hover:bg-[#0099D6]'
                }`}
              >
                {simulatedSuccess ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    ¡Enviado!
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Reservar / Contactar
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-3xl p-4 border border-gray-100 shadow-lg text-center z-10 pointer-events-none">
            <span className="text-[10px] text-gray-500 font-black uppercase tracking-wider">
              Toca un pin en el mapa para ver los detalles
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
