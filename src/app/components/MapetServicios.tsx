import { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import { 
  ArrowLeft, MapPin, Star, Phone, Search, Navigation, Coffee, ShoppingBag, 
  BedDouble, UserCheck, Check, Sparkles, AlertTriangle, MessageCircle, 
  Plus, Locate, X, Share2, Compass, ShieldAlert, HeartHandshake,
  UtensilsCrossed, Stethoscope, ChevronRight, Eye, Info
} from 'lucide-react';
import { Place, LostPet } from '../data/mapData';
import { 
  getServicios, 
  createServicio, 
  getMascotasPerdidas, 
  reportarMascotaPerdida, 
  updateEstadoMascotaPerdida 
} from '../services/api';
import { Pet } from '../data/petData';

interface MapetServiciosProps {
  onBack: () => void;
  activePet?: Pet | null;
  allPets?: Pet[];
  initialMode?: 'servicios' | 'sos';
  openReportModalOnMount?: boolean;
}

export default function MapetServicios({
  onBack,
  activePet,
  allPets = [],
  initialMode = 'servicios',
  openReportModalOnMount = false
}: MapetServiciosProps) {
  // Mode: 'servicios' vs 'sos'
  const [activeMode, setActiveMode] = useState<'servicios' | 'sos'>(initialMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  
  // Data
  const [places, setPlaces] = useState<Place[]>([]);
  const [lostPets, setLostPets] = useState<LostPet[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected item cards
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedLostPet, setSelectedLostPet] = useState<LostPet | null>(null);
  
  // Modals
  const [showReportModal, setShowReportModal] = useState(openReportModalOnMount);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [contactSuccessToast, setContactSuccessToast] = useState<string | null>(null);

  // User location
  const [userLocation, setUserLocation] = useState<[number, number] | null>([-33.4265, -70.6120]);
  const [locatingUser, setLocatingUser] = useState(false);

  // Map picking mode (when creating a lost pet or service)
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [pickedLocation, setPickedLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Report Lost Pet Form States
  const [selectedPetForReport, setSelectedPetForReport] = useState<string>('manual');
  const [repNombre, setRepNombre] = useState('');
  const [repEspecie, setRepEspecie] = useState('Perro');
  const [repRaza, setRepRaza] = useState('');
  const [repColor, setRepColor] = useState('');
  const [repFoto, setRepFoto] = useState('');
  const [repFecha, setRepFecha] = useState('Hoy');
  const [repReferencia, setRepReferencia] = useState('');
  const [repRecompensa, setRepRecompensa] = useState('');
  const [repContactoNombre, setRepContactoNombre] = useState('');
  const [repContactoTel, setRepContactoTel] = useState('');
  const [repContactoWsp, setRepContactoWsp] = useState('');
  const [repDescripcion, setRepDescripcion] = useState('');
  const [repRadio, setRepRadio] = useState(300);

  // Add Service Form States
  const [newSrvNombre, setNewSrvNombre] = useState('');
  const [newSrvCategoria, setNewSrvCategoria] = useState<'veterinaria' | 'tienda' | 'alimento' | 'paseador' | 'cuidador' | 'hotel' | 'petfriendly'>('veterinaria');
  const [newSrvSubtipo, setNewSrvSubtipo] = useState('');
  const [newSrvDireccion, setNewSrvDireccion] = useState('');
  const [newSrvTelefono, setNewSrvTelefono] = useState('');
  const [newSrvWhatsapp, setNewSrvWhatsapp] = useState('');
  const [newSrvTarifa, setNewSrvTarifa] = useState('');
  const [newSrvHorario, setNewSrvHorario] = useState('Lun - Sáb: 09:00 a 19:00');
  const [newSrvDescripcion, setNewSrvDescripcion] = useState('');

  // Map DOM & Instance Refs
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const radiusCircleRef = useRef<L.Circle | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const pickMarkerRef = useRef<L.Marker | null>(null);

  // Categories config
  const categories = [
    { id: 'todos', label: 'Todos', color: 'bg-[#00AEEF] text-white border-[#00AEEF]' },
    { id: 'veterinaria', label: 'Veterinarias', color: 'bg-emerald-600 text-white border-emerald-600' },
    { id: 'tienda', label: 'Tiendas & Accesorios', color: 'bg-rose-500 text-white border-rose-500' },
    { id: 'alimento', label: 'Comida & BARF', color: 'bg-orange-500 text-white border-orange-500' },
    { id: 'paseador', label: 'Paseadores', color: 'bg-amber-500 text-white border-amber-500' },
    { id: 'cuidador', label: 'Cuidadores', color: 'bg-purple-500 text-white border-purple-500' },
    { id: 'hotel', label: 'Hoteles', color: 'bg-teal-500 text-white border-teal-500' },
    { id: 'petfriendly', label: 'Pet-Friendly', color: 'bg-cyan-500 text-white border-cyan-500' }
  ];

  // Fetch initial data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [servicesData, lostData] = await Promise.all([
          getServicios(),
          getMascotasPerdidas()
        ]);
        setPlaces(servicesData);
        setLostPets(lostData);
      } catch (err) {
        console.error('Error loading map data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Default center Providencia, Santiago
    const initialLat = -33.4265;
    const initialLng = -70.6120;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 14,
      zoomControl: false
    });

    // High quality OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Layer groups for markers
    const markersGroup = L.layerGroup().addTo(map);
    markersLayerGroupRef.current = markersGroup;
    mapInstanceRef.current = map;

    // User location marker
    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 30px; height: 30px;">
          <div style="position: absolute; width: 28px; height: 28px; background-color: rgba(0, 174, 239, 0.35); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 14px; height: 14px; background-color: #00AEEF; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3); z-index: 10;"></div>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    const uMarker = L.marker([initialLat, initialLng], { icon: userIcon }).addTo(map);
    userMarkerRef.current = uMarker;

    // Map click handler
    map.on('click', (e: L.LeafletMouseEvent) => {
      setPickedLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    // Invalidate size shortly after mount to ensure smooth tile loading
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 200);

    // Cleanup
    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Invalidate map size on mode switch
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [activeMode]);

  // Update Picked location marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (pickedLocation) {
      if (pickMarkerRef.current) {
        pickMarkerRef.current.setLatLng([pickedLocation.lat, pickedLocation.lng]);
      } else {
        const pickIcon = L.divIcon({
          className: 'pick-location-marker',
          html: `
            <div style="display: flex; flex-direction: column; align-items: center; transform: translateY(-100%);">
              <div style="background-color: #EF4444; color: white; font-size: 9px; font-weight: 900; padding: 2px 8px; border-radius: 9999px; box-shadow: 0 2px 8px rgba(0,0,0,0.25); white-space: nowrap; margin-bottom: 2px;">
                Punto Seleccionado
              </div>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#EF4444" stroke="#ffffff" stroke-width="1.5">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="3" fill="#ffffff" />
              </svg>
            </div>
          `,
          iconSize: [32, 40],
          iconAnchor: [16, 40]
        });
        pickMarkerRef.current = L.marker([pickedLocation.lat, pickedLocation.lng], { icon: pickIcon }).addTo(mapInstanceRef.current);
      }
    } else if (pickMarkerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(pickMarkerRef.current);
      pickMarkerRef.current = null;
    }
  }, [pickedLocation]);

  // Request current GPS location
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización.');
      return;
    }
    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocatingUser(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLocation([lat, lng]);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([lat, lng], 15, { duration: 1.2 });
          if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng([lat, lng]);
          }
        }
      },
      (err) => {
        setLocatingUser(false);
        console.warn('Error fetching GPS coordinates', err);
        // Center default
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([-33.4265, -70.6120], 14);
        }
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Helper colors & SVG strings for category icons
  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'veterinaria':
        return { bg: '#059669', badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Veterinaria' };
      case 'tienda':
        return { bg: '#F43F5E', badgeBg: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Tienda' };
      case 'alimento':
        return { bg: '#F97316', badgeBg: 'bg-orange-50 text-orange-700 border-orange-200', label: 'Comida & BARF' };
      case 'paseador':
        return { bg: '#F59E0B', badgeBg: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Paseador' };
      case 'cuidador':
        return { bg: '#A855F7', badgeBg: 'bg-purple-50 text-purple-700 border-purple-200', label: 'Cuidador' };
      case 'hotel':
        return { bg: '#14B8A6', badgeBg: 'bg-teal-50 text-teal-700 border-teal-200', label: 'Hotel' };
      case 'petfriendly':
        return { bg: '#06B6D4', badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200', label: 'Pet-Friendly' };
      default:
        return { bg: '#3B82F6', badgeBg: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Servicio' };
    }
  };

  // Filter places
  const filteredPlaces = useMemo(() => {
    return places.filter(place => {
      const matchCat = selectedCategory === 'todos' || place.categoria === selectedCategory;
      const matchSearch = place.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          place.subtipo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          place.direccion.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [places, selectedCategory, searchQuery]);

  // Filter lost pets (only show active lost or sighted)
  const filteredLostPets = useMemo(() => {
    return lostPets.filter(pet => {
      const matchSearch = pet.nombreMascota.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pet.raza.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pet.direccionReferencia.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [lostPets, searchQuery]);

  // Render markers onto the Leaflet map whenever mode, filteredPlaces, filteredLostPets change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerGroupRef.current) return;
    const group = markersLayerGroupRef.current;
    group.clearLayers();

    // Clear existing radius circle
    if (radiusCircleRef.current) {
      radiusCircleRef.current.remove();
      radiusCircleRef.current = null;
    }

    if (activeMode === 'servicios') {
      filteredPlaces.forEach(place => {
        const theme = getCategoryTheme(place.categoria);
        const isSelected = selectedPlace?.id === place.id;

        const iconHtml = `
          <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.2s; transform: scale(${isSelected ? '1.25' : '1.0'});">
            <div style="background-color: ${theme.bg}; color: #ffffff; padding: 6px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.25); border: 2.5px solid #ffffff; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
            </div>
            <div style="background-color: rgba(17, 24, 39, 0.85); backdrop-filter: blur(4px); color: #ffffff; font-size: 8px; font-weight: 800; padding: 2px 6px; border-radius: 6px; margin-top: 3px; white-space: nowrap; max-width: 110px; overflow: hidden; text-overflow: ellipsis; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
              ${place.nombre}
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          className: 'service-pin-marker',
          html: iconHtml,
          iconSize: [36, 52],
          iconAnchor: [18, 26]
        });

        const marker = L.marker([place.lat, place.lng], { icon: customIcon });
        marker.on('click', () => {
          setSelectedPlace(place);
          setSelectedLostPet(null);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([place.lat, place.lng], 15, { duration: 0.8 });
          }
        });
        group.addLayer(marker);
      });
    } else {
      // SOS Mascotas Perdidas Mode
      filteredLostPets.forEach(pet => {
        const isSelected = selectedLostPet?.id === pet.id;
        const isFound = pet.estado === 'encontrada';
        const color = isFound ? '#10B981' : '#EF4444';

        const iconHtml = `
          <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: scale(${isSelected ? '1.2' : '1.0'}); transition: transform 0.2s;">
            <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
              ${!isFound ? `
                <div style="position: absolute; width: 48px; height: 48px; background-color: rgba(239, 68, 68, 0.35); border-radius: 50%; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              ` : ''}
              <div style="position: relative; width: 38px; height: 38px; border-radius: 50%; border: 3px solid ${color}; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 10;">
                <img src="${pet.foto}" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
              <div style="position: absolute; top: -4px; right: -4px; background-color: ${color}; color: #ffffff; font-size: 8px; font-weight: 900; padding: 1px 4px; border-radius: 6px; border: 1.5px solid #ffffff; z-index: 20; text-transform: uppercase;">
                ${isFound ? '¡Encontrada!' : 'SOS'}
              </div>
            </div>
            <div style="background-color: ${color}; color: #ffffff; font-size: 8px; font-weight: 900; padding: 2px 7px; border-radius: 6px; margin-top: 3px; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.25);">
              ${pet.nombreMascota} (${pet.raza || pet.especie})
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          className: 'lost-pet-pin-marker',
          html: iconHtml,
          iconSize: [48, 60],
          iconAnchor: [24, 30]
        });

        const marker = L.marker([pet.lat, pet.lng], { icon: customIcon });
        marker.on('click', () => {
          setSelectedLostPet(pet);
          setSelectedPlace(null);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([pet.lat, pet.lng], 16, { duration: 0.8 });
            
            // Draw search radius
            if (radiusCircleRef.current) {
              radiusCircleRef.current.remove();
            }
            radiusCircleRef.current = L.circle([pet.lat, pet.lng], {
              radius: pet.radioMetros || 300,
              color: color,
              fillColor: color,
              fillOpacity: 0.12,
              weight: 2,
              dashArray: '5, 5'
            }).addTo(mapInstanceRef.current);
          }
        });
        group.addLayer(marker);
      });
    }
  }, [activeMode, filteredPlaces, filteredLostPets, selectedPlace, selectedLostPet]);

  // Handle reporting a pet as lost
  const handleSelectPetForReport = (petId: string) => {
    setSelectedPetForReport(petId);
    if (petId === 'manual') {
      setRepNombre('');
      setRepEspecie('Perro');
      setRepRaza('');
      setRepColor('');
      setRepFoto('');
      setRepContactoNombre(activePet?.propietario?.nombre || '');
      setRepContactoTel(activePet?.propietario?.telefono || '');
    } else {
      const selected = allPets.find(p => p.id === petId) || (activePet?.id === petId ? activePet : null);
      if (selected) {
        setRepNombre(selected.nombre);
        setRepEspecie(selected.especie);
        setRepRaza(selected.raza || '');
        setRepFoto(selected.foto || '');
        setRepContactoNombre(selected.propietario?.nombre || 'Dueño Registrado');
        setRepContactoTel(selected.propietario?.telefono || '+56 9 8765 4321');
        setRepContactoWsp(selected.propietario?.telefono?.replace(/[^0-9]/g, '') || '');
      }
    }
  };

  const handleSaveReportLostPet = async () => {
    if (!repNombre.trim()) {
      alert('Por favor indica el nombre de la mascota.');
      return;
    }
    if (!repContactoTel.trim()) {
      alert('Por favor indica un teléfono de contacto.');
      return;
    }

    const targetLat = pickedLocation ? pickedLocation.lat : (userLocation ? userLocation[0] : -33.4265);
    const targetLng = pickedLocation ? pickedLocation.lng : (userLocation ? userLocation[1] : -70.6120);

    const newReport: Partial<LostPet> = {
      mascotaId: selectedPetForReport !== 'manual' ? selectedPetForReport : null,
      nombreMascota: repNombre.trim(),
      especie: repEspecie,
      raza: repRaza.trim() || 'Mestizo',
      color: repColor.trim() || 'No especificado',
      foto: repFoto.trim() || (repEspecie.toLowerCase() === 'gato'
        ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400&h=400'
        : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400&h=400'),
      fechaExtravio: repFecha.trim() || 'Hoy',
      lat: targetLat,
      lng: targetLng,
      direccionReferencia: repReferencia.trim() || 'Sector Providencia / Santiago',
      recompensa: repRecompensa.trim(),
      contactoNombre: repContactoNombre.trim() || 'Dueño/a',
      contactoTelefono: repContactoTel.trim(),
      contactoWhatsapp: repContactoWsp.trim() || repContactoTel.replace(/[^0-9]/g, ''),
      descripcion: repDescripcion.trim() || 'Mascota extraviada. Por favor si la ves, da aviso inmediato.',
      estado: 'perdida',
      radioMetros: repRadio
    };

    const created = await reportarMascotaPerdida(newReport);
    setLostPets([created, ...lostPets]);
    setShowReportModal(false);
    setActiveMode('sos');
    setSelectedLostPet(created);
    setPickedLocation(null);
    setIsPickingLocation(false);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([targetLat, targetLng], 15, { duration: 1.0 });
    }

    setContactSuccessToast('¡Alerta de extravío publicada con éxito en el mapa!');
    setTimeout(() => setContactSuccessToast(null), 3500);
  };

  // Handle adding a new service
  const handleSaveNewService = async () => {
    if (!newSrvNombre.trim() || !newSrvDireccion.trim()) {
      alert('Por favor ingresa el nombre y la dirección del servicio.');
      return;
    }

    const targetLat = pickedLocation ? pickedLocation.lat : (userLocation ? userLocation[0] : -33.4265);
    const targetLng = pickedLocation ? pickedLocation.lng : (userLocation ? userLocation[1] : -70.6120);

    const created = await createServicio({
      nombre: newSrvNombre.trim(),
      categoria: newSrvCategoria,
      subtipo: newSrvSubtipo.trim() || 'Servicio Profesional',
      direccion: newSrvDireccion.trim(),
      telefono: newSrvTelefono.trim(),
      whatsapp: newSrvWhatsapp.trim(),
      tarifa: newSrvTarifa.trim() || 'A consultar',
      horario: newSrvHorario.trim(),
      lat: targetLat,
      lng: targetLng,
      descripcion: newSrvDescripcion.trim() || 'Servicio verificado para mascotas.',
      rating: 5.0,
      reviews: 1
    });

    setPlaces([created, ...places]);
    setShowAddServiceModal(false);
    setActiveMode('servicios');
    setSelectedPlace(created);
    setPickedLocation(null);
    setIsPickingLocation(false);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([targetLat, targetLng], 15, { duration: 1.0 });
    }

    setContactSuccessToast('¡Servicio agregado exitosamente al directorio de Mapet!');
    setTimeout(() => setContactSuccessToast(null), 3500);
  };

  // Mark lost pet as found
  const handleMarkAsFound = async (id: number) => {
    const updated = await updateEstadoMascotaPerdida(id, 'encontrada');
    if (updated) {
      setLostPets(lostPets.map(p => p.id === id ? updated : p));
      setSelectedLostPet(updated);
      setContactSuccessToast('🎉 ¡Felicitaciones! Mascota marcada como encontrada.');
      setTimeout(() => setContactSuccessToast(null), 3500);
    }
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-gray-50 pb-16 relative">
      {/* Notification Toast */}
      {contactSuccessToast && (
        <div className="absolute top-4 left-4 right-4 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-in slide-in-from-top duration-300">
          <Sparkles className="w-5 h-5 shrink-0" />
          <p className="text-xs font-black leading-snug">{contactSuccessToast}</p>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-[#00AEEF] via-[#1A5AD7] to-indigo-700 p-4 pb-5 rounded-b-3xl text-white shadow-md shrink-0 z-10">
        <div className="flex justify-between items-center mb-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-xs font-semibold">Volver al Inicio</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleLocateUser}
              disabled={locatingUser}
              className={`p-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                locatingUser ? 'bg-white/40 animate-pulse' : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
              title="Mi Ubicación GPS"
            >
              <Locate className="w-4 h-4" />
              <span className="text-[10px] hidden sm:inline">Mi GPS</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-white/20 p-2.5 rounded-2xl shadow-inner backdrop-blur-sm">
              <Compass className="w-6 h-6 text-white animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-tight">Mapet OpenMap & SOS</h1>
              <p className="text-white/80 text-[9px] uppercase font-black tracking-widest mt-0.5">
                {activeMode === 'servicios' ? 'Directorio de Servicios & Locales' : 'Radar Comunitario de Mascotas'}
              </p>
            </div>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 mt-4 bg-black/20 p-1 rounded-2xl backdrop-blur-md">
          <button
            onClick={() => {
              setActiveMode('servicios');
              setSelectedLostPet(null);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
              activeMode === 'servicios'
                ? 'bg-white text-gray-900 shadow-md scale-[1.02]'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#00AEEF]" />
            <span>Servicios ({places.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveMode('sos');
              setSelectedPlace(null);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all relative ${
              activeMode === 'sos'
                ? 'bg-red-500 text-white shadow-md scale-[1.02]'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-red-200" />
            <span>SOS Perdidos</span>
            {lostPets.filter(p => p.estado === 'perdida').length > 0 && (
              <span className="bg-white text-red-600 text-[9px] px-1.5 py-0.2 rounded-full font-black">
                {lostPets.filter(p => p.estado === 'perdida').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-3 bg-white border-b border-gray-100 space-y-2.5 shadow-sm shrink-0 z-10">
        <div className="relative">
          <input
            type="text"
            placeholder={
              activeMode === 'servicios'
                ? 'Buscar veterinaria, comida BARF, paseadores...'
                : 'Buscar por nombre, raza o sector...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-bold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00AEEF] transition-all"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
        </div>

        {/* Category Pills (Visible only in Servicios mode) */}
        {activeMode === 'servicios' && (
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSelectedPlace(null);
                  }}
                  className={`px-3.5 py-1.5 text-[10px] font-black rounded-full border whitespace-nowrap transition-all uppercase tracking-wide ${
                    isSelected
                      ? cat.color + ' shadow-sm scale-105'
                      : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Map Interactive View */}
      <div className="flex-1 relative bg-gray-200 overflow-hidden">
        {/* Leaflet container */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Location Picking Banner if active */}
        {isPickingLocation && (
          <div className="absolute top-3 left-3 right-3 z-20 bg-gray-900/90 backdrop-blur-md text-white p-3 rounded-2xl shadow-xl flex items-center justify-between border border-white/20 animate-in fade-in">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-400 animate-bounce" />
              <div>
                <p className="text-xs font-extrabold">Toca el mapa para fijar el punto</p>
                <p className="text-[9px] text-gray-300">
                  {pickedLocation ? `Coordenadas: ${pickedLocation.lat.toFixed(4)}, ${pickedLocation.lng.toFixed(4)}` : 'Haz clic en la zona aproximada'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsPickingLocation(false)}
              className="bg-white text-gray-900 text-[10px] font-black px-3 py-1.5 rounded-xl uppercase hover:bg-gray-100"
            >
              Listo
            </button>
          </div>
        )}

        {/* Quick Action Floating Buttons on Map */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          {activeMode === 'sos' ? (
            <button
              onClick={() => {
                handleSelectPetForReport(activePet ? activePet.id : 'manual');
                setShowReportModal(true);
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-black text-xs px-3.5 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 transition-all active:scale-95 border-2 border-white/50"
            >
              <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
              <span className="tracking-wide">Reportar Pérdida</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAddServiceModal(true)}
              className="bg-[#00AEEF] hover:bg-[#0099D6] text-white font-black text-xs px-3.5 py-2.5 rounded-2xl shadow-lg flex items-center gap-1.5 transition-all active:scale-95 border-2 border-white/50"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="tracking-wide">Publicar Servicio</span>
            </button>
          )}
        </div>

        {/* Bottom Details Card: Service Place */}
        {selectedPlace && activeMode === 'servicios' && (
          <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-3xl p-4 border border-gray-100 shadow-2xl z-20 animate-in slide-in-from-bottom duration-300 max-h-[75vh] overflow-y-auto">
            <button
              onClick={() => setSelectedPlace(null)}
              className="absolute right-3.5 top-3.5 p-1.5 bg-gray-100 rounded-full text-gray-400 hover:bg-gray-200 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-start gap-3">
              {selectedPlace.imagenUrl ? (
                <img
                  src={selectedPlace.imagenUrl}
                  alt={selectedPlace.nombre}
                  className="w-16 h-16 rounded-2xl object-cover shadow-sm shrink-0 border border-gray-100"
                />
              ) : (
                <div className={`w-14 h-14 rounded-2xl text-white flex items-center justify-center shrink-0 shadow-sm`} style={{ backgroundColor: getCategoryTheme(selectedPlace.categoria).bg }}>
                  <MapPin className="w-6 h-6" />
                </div>
              )}

              <div className="flex-1 min-w-0 pr-4">
                <span className={`inline-block px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider border ${getCategoryTheme(selectedPlace.categoria).badgeBg}`}>
                  {selectedPlace.subtipo}
                </span>
                <h3 className="font-black text-gray-900 text-sm leading-snug mt-1">{selectedPlace.nombre}</h3>
                
                <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold text-gray-500">
                  <div className="flex items-center text-amber-500 gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-500 stroke-none" />
                    <span className="font-black text-gray-800">{selectedPlace.rating}</span>
                  </div>
                  <span>•</span>
                  <span>{selectedPlace.reviews} opiniones</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-gray-600 font-medium mt-3 bg-gray-50 p-2.5 rounded-2xl leading-normal border border-gray-100">
              {selectedPlace.descripcion}
            </p>

            <div className="grid grid-cols-2 gap-2 mt-3 text-[10px] font-bold text-gray-600 bg-gray-50/60 p-2.5 rounded-2xl">
              <div>
                <span className="text-[8px] text-gray-400 font-bold uppercase block">Tarifa / Precios</span>
                <span className="text-gray-900 font-extrabold">{selectedPlace.tarifa}</span>
              </div>
              <div>
                <span className="text-[8px] text-gray-400 font-bold uppercase block">Horario</span>
                <span className="text-emerald-700 font-black">{selectedPlace.horario}</span>
              </div>
              <div className="col-span-2 pt-1 border-t border-gray-200/50 flex items-center gap-1 text-gray-700">
                <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                <span className="truncate">{selectedPlace.direccion}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2 mt-3.5">
              {selectedPlace.telefono && (
                <a
                  href={`tel:${selectedPlace.telefono}`}
                  className="flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-black text-[11px] uppercase py-3 rounded-2xl transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Llamar
                </a>
              )}

              {selectedPlace.whatsapp && (
                <a
                  href={`https://wa.me/${selectedPlace.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola, te contacto desde Sania Pet por el servicio de ${selectedPlace.nombre}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[11px] uppercase py-3 rounded-2xl shadow-sm transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
              )}

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${selectedPlace.lat},${selectedPlace.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 bg-[#00AEEF] hover:bg-[#0099D6] text-white font-black text-[11px] uppercase py-3 rounded-2xl shadow-sm transition-all"
              >
                <Navigation className="w-3.5 h-3.5" />
                Ruta
              </a>
            </div>
          </div>
        )}

        {/* Bottom Details Card: Lost Pet (SOS) */}
        {selectedLostPet && activeMode === 'sos' && (
          <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-3xl p-4 border border-red-100 shadow-2xl z-20 animate-in slide-in-from-bottom duration-300 max-h-[75vh] overflow-y-auto">
            <button
              onClick={() => {
                setSelectedLostPet(null);
                if (radiusCircleRef.current) {
                  radiusCircleRef.current.remove();
                  radiusCircleRef.current = null;
                }
              }}
              className="absolute right-3.5 top-3.5 p-1.5 bg-gray-100 rounded-full text-gray-400 hover:bg-gray-200 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* SOS Banner Header */}
            <div className="flex items-center gap-2 mb-3">
              <div className={`px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                selectedLostPet.estado === 'encontrada'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-red-500 text-white animate-pulse'
              }`}>
                <AlertTriangle className="w-3.5 h-3.5" />
                {selectedLostPet.estado === 'encontrada' ? '¡Mascota Encontrada!' : 'Alerta de Mascota Perdida (SOS)'}
              </div>
              {selectedLostPet.recompensa && (
                <div className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-1 rounded-xl text-[9px] font-black uppercase">
                  Recompensa: {selectedLostPet.recompensa}
                </div>
              )}
            </div>

            <div className="flex items-start gap-3">
              <img
                src={selectedLostPet.foto}
                alt={selectedLostPet.nombreMascota}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-red-500 shadow-md shrink-0"
              />

              <div className="flex-1 min-w-0 pr-4">
                <h3 className="font-black text-gray-900 text-base leading-tight">{selectedLostPet.nombreMascota}</h3>
                <p className="text-xs text-gray-600 font-bold mt-0.5">
                  {selectedLostPet.especie} • {selectedLostPet.raza} ({selectedLostPet.color})
                </p>
                <div className="flex items-center gap-1 text-[10px] text-red-600 font-black mt-1.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{selectedLostPet.direccionReferencia}</span>
                </div>
                <p className="text-[9px] text-gray-400 font-bold mt-0.5">
                  Extraviado: {selectedLostPet.fechaExtravio}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-gray-700 font-medium mt-3 bg-red-50/70 p-3 rounded-2xl leading-normal border border-red-100">
              {selectedLostPet.descripcion}
            </p>

            {/* Owner & Contact Card */}
            <div className="mt-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-[8px] text-gray-400 font-bold uppercase block">Contacto del Dueño</span>
                <span className="font-black text-gray-900">{selectedLostPet.contactoNombre}</span>
              </div>
              <span className="text-xs font-bold text-gray-600">{selectedLostPet.contactoTelefono}</span>
            </div>

            {/* Actions for Community / Owner */}
            <div className="grid grid-cols-2 gap-2.5 mt-3.5">
              <a
                href={`tel:${selectedLostPet.contactoTelefono}`}
                className="flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-black text-white font-black text-xs uppercase py-3.5 rounded-2xl shadow-md transition-all active:scale-[0.98]"
              >
                <Phone className="w-4 h-4" />
                Llamar Dueño
              </a>

              <a
                href={`https://wa.me/${(selectedLostPet.contactoWhatsapp || selectedLostPet.contactoTelefono).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola ${selectedLostPet.contactoNombre}, te contacto desde Sania Pet porque tengo información sobre ${selectedLostPet.nombreMascota}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase py-3.5 rounded-2xl shadow-md transition-all active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4" />
                Dar Aviso (Wsp)
              </a>
            </div>

            {/* Owner action: Mark as found */}
            {selectedLostPet.estado !== 'encontrada' && (
              <button
                onClick={() => handleMarkAsFound(selectedLostPet.id)}
                className="w-full mt-2.5 flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-black text-[10px] uppercase py-2.5 rounded-2xl transition-all"
              >
                <HeartHandshake className="w-4 h-4 text-emerald-600" />
                ¿Es tu mascota y apareció? Marcar como ¡Encontrada!
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal: Reportar Mascota Perdida (SOS) */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => {
                setShowReportModal(false);
                setIsPickingLocation(false);
              }}
              className="absolute right-4 top-4 p-1.5 bg-gray-100 rounded-full text-gray-400 hover:bg-gray-200"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2.5 bg-red-100 text-red-600 rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-gray-900 text-base">Publicar Alerta SOS de Pérdida</h3>
                <p className="text-[10px] text-gray-400 font-bold">Avisa a la comunidad y veterinarias cercanas</p>
              </div>
            </div>

            {/* Select from existing pets */}
            {allPets.length > 0 && (
              <div className="mb-4 bg-red-50/50 p-3 rounded-2xl border border-red-100">
                <label className="block text-[9px] font-black text-red-800 uppercase mb-2">
                  ¿Extraviaste a una de tus mascotas registradas?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {allPets.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectPetForReport(p.id)}
                      className={`p-2 rounded-xl flex flex-col items-center gap-1 text-center transition-all ${
                        selectedPetForReport === p.id
                          ? 'bg-red-500 text-white shadow-md font-black'
                          : 'bg-white text-gray-700 border border-gray-200 font-bold hover:bg-gray-50'
                      }`}
                    >
                      <img src={p.foto} alt={p.nombre} className="w-8 h-8 rounded-full object-cover border" />
                      <span className="text-[10px] truncate max-w-full">{p.nombre}</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleSelectPetForReport('manual')}
                    className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 text-center transition-all ${
                      selectedPetForReport === 'manual'
                        ? 'bg-gray-900 text-white shadow-md font-black'
                        : 'bg-white text-gray-700 border border-gray-200 font-bold hover:bg-gray-50'
                    }`}
                  >
                    <Plus className="w-5 h-5" />
                    <span className="text-[9px]">Otra mascota</span>
                  </button>
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Nombre de la Mascota *</label>
                  <input
                    type="text"
                    value={repNombre}
                    onChange={(e) => setRepNombre(e.target.value)}
                    placeholder="Ej. Thor, Luna..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Especie</label>
                  <select
                    value={repEspecie}
                    onChange={(e) => setRepEspecie(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:border-red-500"
                  >
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Raza</label>
                  <input
                    type="text"
                    value={repRaza}
                    onChange={(e) => setRepRaza(e.target.value)}
                    placeholder="Ej. Golden, Mestizo..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Color / Rasgos</label>
                  <input
                    type="text"
                    value={repColor}
                    onChange={(e) => setRepColor(e.target.value)}
                    placeholder="Ej. Blanco con manchas café"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">URL de Foto</label>
                <input
                  type="text"
                  value={repFoto}
                  onChange={(e) => setRepFoto(e.target.value)}
                  placeholder="https://... (o dejar vacía para usar foto por defecto)"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-800 focus:outline-none"
                />
              </div>

              {/* Location Picker Section */}
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[9px] font-black text-gray-700 uppercase flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    Ubicación donde se perdió
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowReportModal(false);
                      setIsPickingLocation(true);
                    }}
                    className="text-[9px] font-black text-[#00AEEF] hover:underline"
                  >
                    Fijar en mapa interactivo &gt;
                  </button>
                </div>
                <input
                  type="text"
                  value={repReferencia}
                  onChange={(e) => setRepReferencia(e.target.value)}
                  placeholder="Ej. Calle Pocuro esquina Av. Tobalaba, Providencia"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none mb-2"
                />
                <div className="flex items-center justify-between text-[10px] text-gray-500 font-bold">
                  <span>Radio de búsqueda visual:</span>
                  <span className="font-extrabold text-red-600">{repRadio} metros</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={repRadio}
                  onChange={(e) => setRepRadio(parseInt(e.target.value))}
                  className="w-full mt-1 accent-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Fecha / Hora</label>
                  <input
                    type="text"
                    value={repFecha}
                    onChange={(e) => setRepFecha(e.target.value)}
                    placeholder="Ej. Hoy 14:00 hrs"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Recompensa (Opcional)</label>
                  <input
                    type="text"
                    value={repRecompensa}
                    onChange={(e) => setRepRecompensa(e.target.value)}
                    placeholder="Ej. $100.000"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-amber-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Descripción y Detalles del collar</label>
                <textarea
                  rows={2}
                  value={repDescripcion}
                  onChange={(e) => setRepDescripcion(e.target.value)}
                  placeholder="Llevaba collar azul, es asustadizo, responde al nombre..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-medium text-gray-800 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Tu Nombre *</label>
                  <input
                    type="text"
                    value={repContactoNombre}
                    onChange={(e) => setRepContactoNombre(e.target.value)}
                    placeholder="Nombre del dueño"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Teléfono / WhatsApp *</label>
                  <input
                    type="text"
                    value={repContactoTel}
                    onChange={(e) => setRepContactoTel(e.target.value)}
                    placeholder="+56 9..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveReportLostPet}
              className="w-full mt-5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
              Publicar Alerta SOS Inmediata
            </button>
          </div>
        </div>
      )}

      {/* Modal: Publicar Nuevo Servicio */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setShowAddServiceModal(false)}
              className="absolute right-4 top-4 p-1.5 bg-gray-100 rounded-full text-gray-400 hover:bg-gray-200"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2.5 bg-[#00AEEF]/15 text-[#00AEEF] rounded-2xl">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-gray-900 text-base">Publicar Servicio o Negocio</h3>
                <p className="text-[10px] text-gray-400 font-bold">Agrégate al mapa interactivo de Sania Pet</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Nombre del Servicio / Local *</label>
                <input
                  type="text"
                  value={newSrvNombre}
                  onChange={(e) => setNewSrvNombre(e.target.value)}
                  placeholder="Ej. Clínica Veterinaria San Cristóbal..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Categoría</label>
                  <select
                    value={newSrvCategoria}
                    onChange={(e: any) => setNewSrvCategoria(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none"
                  >
                    <option value="veterinaria">Veterinaria</option>
                    <option value="tienda">Tienda / Pet Shop</option>
                    <option value="alimento">Comida & Dietas</option>
                    <option value="paseador">Paseador</option>
                    <option value="cuidador">Cuidador</option>
                    <option value="hotel">Hotel / Guardería</option>
                    <option value="petfriendly">Lugar Pet-Friendly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Subtipo / Especialidad</label>
                  <input
                    type="text"
                    value={newSrvSubtipo}
                    onChange={(e) => setNewSrvSubtipo(e.target.value)}
                    placeholder="Ej. Urgencias 24/7, BARF..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Dirección Completa *</label>
                <input
                  type="text"
                  value={newSrvDireccion}
                  onChange={(e) => setNewSrvDireccion(e.target.value)}
                  placeholder="Av. Providencia 1234, Providencia"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={newSrvTelefono}
                    onChange={(e) => setNewSrvTelefono(e.target.value)}
                    placeholder="+56 9..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={newSrvWhatsapp}
                    onChange={(e) => setNewSrvWhatsapp(e.target.value)}
                    placeholder="+56 9..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Tarifas / Precios</label>
                  <input
                    type="text"
                    value={newSrvTarifa}
                    onChange={(e) => setNewSrvTarifa(e.target.value)}
                    placeholder="Ej. Desde $15.000"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Horario</label>
                  <input
                    type="text"
                    value={newSrvHorario}
                    onChange={(e) => setNewSrvHorario(e.target.value)}
                    placeholder="Lun - Vie: 09:00 - 20:00"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Descripción del Servicio</label>
                <textarea
                  rows={2}
                  value={newSrvDescripcion}
                  onChange={(e) => setNewSrvDescripcion(e.target.value)}
                  placeholder="Detalles sobre lo que ofreces, equipamiento, experiencia..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-medium text-gray-800 focus:outline-none resize-none"
                />
              </div>
            </div>

            <button
              onClick={handleSaveNewService}
              className="w-full mt-5 bg-[#00AEEF] hover:bg-[#0099D6] text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              Guardar y Publicar en el Mapa
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
