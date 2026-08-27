import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Pet } from './data/petData';
import { 
  getPetsList, 
  getPetDetail, 
  createNewPet,
  addSymptomRecord, 
  addWeightRecord, 
  addVaccineRecord, 
  addAlertRecord, 
  updateAlertAction,
  updateSymptomRecord,
  deleteSymptomRecord,
  updateVaccineRecord,
  deleteVaccineRecord,
  addMedicationRecord,
  updateMedicationRecord,
  deleteMedicationRecord,
  updatePetProfile,
  updatePetOwner,
  addDiagnosisRecord,
  updateDiagnosisRecord,
  deleteDiagnosisRecord,
  addDewormingRecord,
  updateDewormingRecord,
  deleteDewormingRecord,
  addLaboratoryRecord,
  updateLaboratoryRecord,
  deleteLaboratoryRecord,
  addMedicalImageRecord,
  updateMedicalImageRecord,
  deleteMedicalImageRecord
} from './services/api';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import Consultas from './components/Consultas';
import Vacunas from './components/Vacunas';
import Desparasitaciones from './components/Desparasitaciones';
import Medicamentos from './components/Medicamentos';
import LaboratoriosList from './components/LaboratoriosList';
import LaboratoriosDetalle from './components/LaboratoriosDetalle';
import ImagenesMedicas from './components/ImagenesMedicas';
import DiarioSalud from './components/DiarioSalud';
import PerfilMascota from './components/PerfilMascota';
import AddMenu from './components/AddMenu';
import AddPetModal from './components/AddPetModal';
import AuthModal from './components/AuthModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { 
  AlertTriangle, Bell, Info, Clock, Check, Trash2, X,
  Home, MapPin, ClipboardList, Stethoscope, ShieldCheck,
  Bug, Pill, FlaskConical, Image as ImageIcon, Plus, Shield,
  User, LogIn, LogOut, ChevronDown, Activity
} from 'lucide-react';

// Code splitting / Lazy Loading for heavy modules
const MapetServicios = lazy(() => import('./components/MapetServicios'));
const AdminPortal = lazy(() => import('./components/AdminPortal'));

function AppContent() {
  const { user, isAuthenticated, isAdmin, openAuthModal, logout } = useAuth();
  const [petsList, setPetsList] = useState<any[]>([]);
  const [activePetId, setActivePetId] = useState('luna');
  const [activePet, setActivePet] = useState<Pet | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [activeScreen, setActiveScreen] = useState<string | null>(null);
  const [selectedLabId, setSelectedLabId] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedAlertForAction, setSelectedAlertForAction] = useState<any | null>(null);

  // Load summary pet list on mount
  useEffect(() => {
    async function loadPets() {
      try {
        const list = await getPetsList();
        setPetsList(list);
        if (list.length > 0) {
          const defaultPet = list.find(p => p.id === 'luna') || list[0];
          setActivePetId(defaultPet.id);
        }
      } catch (err) {
        console.error('Error loading pet list', err);
      }
    }
    loadPets();
  }, []);

  // Fetch full details of the active pet when it changes
  useEffect(() => {
    async function loadActivePet() {
      setLoading(true);
      try {
        const detail = await getPetDetail(activePetId);
        setActivePet(detail);
      } catch (err) {
        console.error('Error loading pet detail', err);
      } finally {
        setLoading(false);
      }
    }
    loadActivePet();
  }, [activePetId]);

  const handleNavigate = (screen: string) => {
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setActiveScreen(null);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setActiveScreen(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPet = (id: string) => {
    setActivePetId(id);
    setActiveScreen(null);
  };

  const handleAddPet = async (petData: any) => {
    try {
      const created = await createNewPet(petData);
      setPetsList(prev => [...prev, created]);
      setActivePetId(created.id);
      setActivePet(created);
      setShowAddPetModal(false);
    } catch (err) {
      alert('Error al crear la mascota');
    }
  };

  // Handlers for medical records
  const handleAddRecord = async (type: string, record: any) => {
    if (!activePet) return;
    try {
      if (type === 'sintoma') {
        const updated = await addSymptomRecord(activePet.id, record);
        setActivePet(updated);
      } else if (type === 'peso') {
        const updated = await addWeightRecord(activePet.id, record);
        setActivePet(updated);
      } else if (type === 'vacuna') {
        const updated = await addVaccineRecord(activePet.id, record);
        setActivePet(updated);
      } else if (type === 'alerta') {
        const updated = await addAlertRecord(activePet.id, record);
        setActivePet(updated);
      } else if (type === 'medicamento') {
        const updated = await addMedicationRecord(activePet.id, record);
        setActivePet(updated);
      } else if (type === 'diagnostico') {
        const updated = await addDiagnosisRecord(activePet.id, record);
        setActivePet(updated);
      } else if (type === 'desparasitacion') {
        const updated = await addDewormingRecord(activePet.id, record);
        setActivePet(updated);
      } else if (type === 'laboratorio') {
        const updated = await addLaboratoryRecord(activePet.id, record);
        setActivePet(updated);
      } else if (type === 'imagen') {
        const updated = await addMedicalImageRecord(activePet.id, record);
        setActivePet(updated);
      } else if (type === 'mascota-perdida') {
        setActiveScreen('mapet-servicios-sos');
      }
    } catch (err) {
      console.error('Error adding record', err);
    }
    setShowAddMenu(false);
  };

  const handleUpdateSymptom = async (id: number, record: any) => {
    if (!activePet) return;
    const updated = await updateSymptomRecord(activePet.id, id, record);
    setActivePet(updated);
  };

  const handleDeleteSymptom = async (id: number) => {
    if (!activePet) return;
    const updated = await deleteSymptomRecord(activePet.id, id);
    setActivePet(updated);
  };

  const handleUpdateVaccine = async (id: number, record: any) => {
    if (!activePet) return;
    const updated = await updateVaccineRecord(activePet.id, id, record);
    setActivePet(updated);
  };

  const handleDeleteVaccine = async (id: number) => {
    if (!activePet) return;
    const updated = await deleteVaccineRecord(activePet.id, id);
    setActivePet(updated);
  };

  const handleUpdateMedication = async (id: number, record: any) => {
    if (!activePet) return;
    const updated = await updateMedicationRecord(activePet.id, id, record);
    setActivePet(updated);
  };

  const handleDeleteMedication = async (id: number) => {
    if (!activePet) return;
    const updated = await deleteMedicationRecord(activePet.id, id);
    setActivePet(updated);
  };

  const handleUpdateDiagnosis = async (id: number, record: any) => {
    if (!activePet) return;
    const updated = await updateDiagnosisRecord(activePet.id, id, record);
    setActivePet(updated);
  };

  const handleDeleteDiagnosis = async (id: number) => {
    if (!activePet) return;
    const updated = await deleteDiagnosisRecord(activePet.id, id);
    setActivePet(updated);
  };

  const handleUpdateDeworming = async (id: number, record: any) => {
    if (!activePet) return;
    const updated = await updateDewormingRecord(activePet.id, id, record);
    setActivePet(updated);
  };

  const handleDeleteDeworming = async (id: number) => {
    if (!activePet) return;
    const updated = await deleteDewormingRecord(activePet.id, id);
    setActivePet(updated);
  };

  const handleUpdateLaboratory = async (id: string, record: any) => {
    if (!activePet) return;
    const updated = await updateLaboratoryRecord(activePet.id, id, record);
    setActivePet(updated);
  };

  const handleDeleteLaboratory = async (id: string) => {
    if (!activePet) return;
    const updated = await deleteLaboratoryRecord(activePet.id, id);
    setActivePet(updated);
    setSelectedLabId(null);
  };

  const handleUpdateMedicalImage = async (id: string, record: any) => {
    if (!activePet) return;
    const updated = await updateMedicalImageRecord(activePet.id, id, record);
    setActivePet(updated);
  };

  const handleDeleteMedicalImage = async (id: string) => {
    if (!activePet) return;
    const updated = await deleteMedicalImageRecord(activePet.id, id);
    setActivePet(updated);
  };

  const handleUpdatePetProfile = async (field: string, value: string) => {
    if (!activePet) return;
    const updated = await updatePetProfile(activePet.id, { [field]: value });
    setActivePet(updated);
  };

  const handleUpdatePetOwner = async (field: string, value: string) => {
    if (!activePet) return;
    const updated = await updatePetOwner(activePet.id, { [field]: value });
    setActivePet(updated);
  };

  const handleAlertAction = async (id: string, action: 'solucionar' | 'posponer' | 'olvidar') => {
    if (!activePet) return;
    const updated = await updateAlertAction(activePet.id, id, action);
    setActivePet(updated);
  };

  if (loading && !activePet) {
    return (
      <div className="w-full min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-[#00AEEF] border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="font-black text-lg">Cargando Sania Pet...</h2>
        <p className="text-xs text-slate-400 mt-1">Conectando a base de datos ultrarrápida Go</p>
      </div>
    );
  }

  if (!activePet) return null;

  // Active Screen / View Router
  const renderContent = () => {
    if (activeScreen === 'consultas') {
      return (
        <Consultas 
          onBack={handleBack} 
          diagnosticos={activePet.diagnosticos || []} 
          onUpdateDiagnosis={handleUpdateDiagnosis}
          onDeleteDiagnosis={handleDeleteDiagnosis}
        />
      );
    }

    if (activeScreen === 'vacunas') {
      return (
        <Vacunas 
          onBack={handleBack} 
          vacunas={activePet.vacunas} 
          onUpdateVaccine={handleUpdateVaccine}
          onDeleteVaccine={handleDeleteVaccine}
        />
      );
    }

    if (activeScreen === 'desparasitaciones') {
      return (
        <Desparasitaciones 
          onBack={handleBack} 
          desparasitaciones={activePet.desparasitaciones || []} 
          onUpdateDeworming={handleUpdateDeworming}
          onDeleteDeworming={handleDeleteDeworming}
        />
      );
    }

    if (activeScreen === 'medicamentos') {
      return (
        <Medicamentos 
          onBack={handleBack} 
          medicamentos={activePet.medicamentos} 
          onUpdateMedication={handleUpdateMedication}
          onDeleteMedication={handleDeleteMedication}
        />
      );
    }

    if (activeScreen === 'laboratorios') {
      return (
        <LaboratoriosList 
          onBack={handleBack} 
          laboratorios={activePet.laboratorios} 
          onSelectLab={(id) => {
            setSelectedLabId(id);
            setActiveScreen('laboratorios-detalle');
          }}
        />
      );
    }

    if (activeScreen === 'laboratorios-detalle' && selectedLabId) {
      const lab = activePet.laboratorios.find(l => l.id === selectedLabId);
      if (!lab) return null;
      return (
        <LaboratoriosDetalle 
          onBack={() => setActiveScreen('laboratorios')} 
          lab={lab} 
          onUpdateLaboratory={(record) => handleUpdateLaboratory(lab.id, record)}
          onDeleteLaboratory={() => handleDeleteLaboratory(lab.id)}
        />
      );
    }

    if (activeScreen === 'imagenes') {
      return (
        <ImagenesMedicas 
          onBack={handleBack} 
          imagenes={activePet.imagenesMedicas} 
          onUpdateImage={handleUpdateMedicalImage}
          onDeleteImage={handleDeleteMedicalImage}
        />
      );
    }

    if (activeScreen === 'perfil-detalle') {
      return (
        <PerfilMascota 
          onBack={handleBack} 
          pet={activePet} 
          onUpdateField={handleUpdatePetProfile}
          onUpdateOwner={handleUpdatePetOwner}
        />
      );
    }

    if (activeScreen === 'mapet-servicios') {
      return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500 font-bold">Cargando Mapa interactivo...</div>}>
          <MapetServicios 
            onBack={handleBack}
            activePet={activePet}
            allPets={petsList.length > 0 ? petsList : [activePet]}
            initialMode="servicios"
          />
        </Suspense>
      );
    }

    if (activeScreen === 'mapet-servicios-sos') {
      return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500 font-bold">Cargando Radar SOS...</div>}>
          <MapetServicios 
            onBack={handleBack}
            activePet={activePet}
            allPets={petsList.length > 0 ? petsList : [activePet]}
            initialMode="sos"
            openReportModalOnMount={true}
          />
        </Suspense>
      );
    }

    if (activeScreen === 'admin-portal') {
      return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500 font-bold">Cargando Panel SuperAdmin...</div>}>
          <AdminPortal onBackToApp={() => setActiveScreen(null)} />
        </Suspense>
      );
    }

    if (activeScreen === 'alertas-detalle') {
      setActiveTab('alertas');
      setActiveScreen(null);
    }

    switch (activeTab) {
      case 'home':
        return (
          <Dashboard 
            activePet={activePet} 
            onNavigate={handleNavigate} 
            onAlertClick={setSelectedAlertForAction} 
          />
        );
      case 'mapa':
        return (
          <Suspense fallback={<div className="p-8 text-center text-gray-500 font-bold">Cargando Mapa...</div>}>
            <MapetServicios 
              onBack={() => setActiveTab('home')}
              activePet={activePet}
              allPets={petsList.length > 0 ? petsList : [activePet]}
              initialMode="servicios"
            />
          </Suspense>
        );
      case 'diario':
        return (
          <DiarioSalud 
            diario={activePet.diario} 
            onUpdateSymptom={handleUpdateSymptom}
            onDeleteSymptom={handleDeleteSymptom}
          />
        );
      case 'alertas':
        const activeAlerts = (activePet.alertas || []).filter(
          (alert) => !alert.estado || alert.estado === 'activa'
        );
        return (
          <div className="flex-1 overflow-auto pb-24 bg-gray-50/50">
            <div className="bg-gradient-to-r from-red-500 to-[#1A5AD7] p-5 pb-6 rounded-b-3xl text-white shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight">Alertas de Salud</h1>
                  <p className="text-white/70 text-[10px] uppercase font-bold tracking-wider mt-0.5">Control de Riesgos y Citas</p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {activeAlerts && activeAlerts.length > 0 ? (
                activeAlerts.map((alert) => (
                  <div 
                    key={alert.id}
                    onClick={() => setSelectedAlertForAction(alert)}
                    className={`bg-white rounded-3xl p-5 shadow-xs border relative overflow-hidden flex items-start gap-3.5 cursor-pointer hover:border-gray-200 transition-all active:scale-[0.99] ${
                      alert.tipo === 'critica' ? 'border-red-100' : 'border-amber-100'
                    }`}
                  >
                    <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${
                      alert.tipo === 'critica' ? 'bg-red-500' : 'bg-amber-400'
                    }`} />
                    
                    <div className={`p-2.5 rounded-2xl shrink-0 ${
                      alert.tipo === 'critica' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${
                          alert.tipo === 'critica' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {alert.tipo === 'critica' ? 'Crítica' : 'Preventiva'}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-gray-900 text-sm mt-1.5 leading-snug">{alert.titulo}</h4>
                      <p className="text-xs text-gray-500 font-semibold mt-1 leading-relaxed">{alert.descripcion}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-gray-200">
                  <Info className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 font-extrabold text-sm">Sin alertas registradas</p>
                  <p className="text-xs text-gray-400 mt-1">Todo se encuentra en perfecto orden.</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'perfil':
        return (
          <PerfilMascota 
            onBack={() => setActiveTab('home')} 
            pet={activePet} 
            onUpdateField={handleUpdatePetProfile}
            onUpdateOwner={handleUpdatePetOwner}
          />
        );
      default:
        return null;
    }
  };

  // Nav Items for Desktop Sidebar
  const navItems = [
    { id: 'home', label: 'Inicio', icon: Home, tab: 'home' },
    { id: 'mapa', label: 'Mapa & Radar SOS', icon: MapPin, tab: 'mapa', badge: 'SOS' },
    { id: 'diario', label: 'Diario de Salud', icon: ClipboardList, tab: 'diario' },
    { id: 'consultas', label: 'Consultas Médicas', icon: Stethoscope, screen: 'consultas' },
    { id: 'vacunas', label: 'Vacunas', icon: ShieldCheck, screen: 'vacunas' },
    { id: 'desparasitaciones', label: 'Desparasitaciones', icon: Bug, screen: 'desparasitaciones' },
    { id: 'medicamentos', label: 'Tratamientos', icon: Pill, screen: 'medicamentos' },
    { id: 'laboratorios', label: 'Laboratorios', icon: FlaskConical, screen: 'laboratorios' },
    { id: 'imagenes', label: 'Imágenes Médicas', icon: ImageIcon, screen: 'imagenes' },
    { id: 'alertas', label: 'Alertas Sanitarias', icon: Bell, tab: 'alertas' },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans text-gray-800">
      {/* ========================================================================= */}
      {/* 🖥️ DESKTOP SIDEBAR NAVIGATION (Visible on screens md: and larger)         */}
      {/* ========================================================================= */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200/80 p-5 shrink-0 shadow-xs justify-between min-h-screen sticky top-0 h-screen overflow-y-auto">
        <div className="space-y-5">
          {/* Brand Logo Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-[#00AEEF] to-[#1A5AD7] rounded-xl flex items-center justify-center shadow-xs">
                <Activity className="w-5 h-5 text-white stroke-[2.5]" />
              </div>
              <div>
                <h1 className="font-black text-gray-900 text-base leading-none">Sania Pet</h1>
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Gestión Clínica</p>
              </div>
            </div>
            <span className="text-[9px] font-black uppercase bg-[#E6F7FF] text-[#00AEEF] px-2 py-0.5 rounded-full">
              v2.0 Go
            </span>
          </div>

          {/* Active Pet Selector Card */}
          <div className="bg-slate-50 border border-gray-200/70 p-3 rounded-2xl">
            <div className="flex items-center gap-2.5 mb-2">
              <img 
                src={activePet.foto} 
                alt={activePet.nombre} 
                className="w-10 h-10 rounded-xl object-cover border border-gray-200 shadow-xs"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTgiIGZpbGw9IiNFM0YyRkQiLz48dGV4dCB4PSI1MCUiIHk9IjU1JSIgZm9udC1zaXplPSIxNiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzE1NjVDNCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UEVUPC90ZXh0Pjwvc3ZnPg==';
                }}
              />
              <div className="flex-1 min-w-0">
                <label className="text-[9px] text-gray-400 font-black block uppercase tracking-wider">
                  Mascota Activa
                </label>
                <div className="relative">
                  <select
                    value={activePet.id}
                    onChange={(e) => {
                      if (e.target.value === '__NEW_PET__') {
                        setShowAddPetModal(true);
                      } else {
                        handleSelectPet(e.target.value);
                      }
                    }}
                    className="font-black text-gray-900 pr-5 bg-transparent appearance-none border-none outline-none cursor-pointer text-xs w-full truncate"
                  >
                    {petsList.map((pet) => (
                      <option key={pet.id} value={pet.id}>
                        {pet.nombre} ({pet.especie})
                      </option>
                    ))}
                    <option value="__NEW_PET__" className="text-[#00AEEF] font-black">
                      + Agregar nueva mascota...
                    </option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-0 top-1 pointer-events-none" />
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowAddPetModal(true)}
              className="w-full py-1.5 bg-white hover:bg-blue-50 text-[#00AEEF] text-[10px] font-black rounded-xl border border-gray-200/80 transition-colors flex items-center justify-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nueva Mascota</span>
            </button>
          </div>

          {/* Quick Action Button: (+ Nuevo Registro) */}
          <button
            onClick={() => setShowAddMenu(true)}
            className="w-full py-3 bg-[#00AEEF] hover:bg-[#0099D6] active:scale-[0.98] text-white rounded-2xl text-xs font-black shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Nuevo Registro</span>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.screen ? activeScreen === item.screen : activeTab === item.tab && !activeScreen;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.screen) {
                      setActiveScreen(item.screen);
                    } else if (item.tab) {
                      handleTabChange(item.tab);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-black transition-colors ${
                    isActive
                      ? 'bg-[#E6F7FF] text-[#00AEEF] shadow-xs'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#00AEEF]' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] bg-red-500 text-white font-black px-1.5 py-0.2 rounded-full uppercase animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* SuperAdmin Sidebar Link (if admin) */}
            {isAdmin && (
              <button
                onClick={() => setActiveScreen('admin-portal')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-black transition-colors mt-2 ${
                  activeScreen === 'admin-portal'
                    ? 'bg-purple-100 text-purple-700 shadow-xs'
                    : 'text-purple-700 bg-purple-50 hover:bg-purple-100/70 border border-purple-200/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-purple-600" />
                  <span>SuperAdmin Portal</span>
                </div>
                <span className="text-[8px] bg-purple-600 text-white font-black px-1.5 py-0.5 rounded-full uppercase">
                  ROOT
                </span>
              </button>
            )}
          </nav>
        </div>

        {/* Sidebar Footer: User profile & Auth */}
        <div className="pt-4 border-t border-gray-100">
          {isAuthenticated ? (
            <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-2xl border border-gray-200/60">
              <div className="min-w-0 pr-2">
                <div className="text-xs font-black text-gray-900 truncate">{user?.nombre || user?.email}</div>
                <div className="text-[9px] font-bold text-[#00AEEF] uppercase">{user?.rol}</div>
              </div>
              <button
                onClick={() => logout()}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-black rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Iniciar Sesión</span>
            </button>
          )}
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 📱 MOBILE FRAME OR 🖥️ DESKTOP MAIN WORKSPACE                               */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col min-h-screen bg-gray-50 md:bg-slate-100/60 overflow-x-hidden">
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="block md:hidden">
          <Header 
            activePet={activePet} 
            allPets={petsList.length > 0 ? petsList : [activePet]} 
            onSelectPet={handleSelectPet}
            onOpenAddPet={() => setShowAddPetModal(true)}
            onOpenSettings={() => alert('Configuración: Simulación de ajustes.')}
            onOpenAdmin={() => setActiveScreen('admin-portal')}
          />
        </div>

        {/* Desktop Top Header Bar */}
        <div className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200/80 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black text-gray-900 capitalize">
              {activeScreen ? activeScreen.replace('-', ' ') : activeTab === 'home' ? 'Panel General' : activeTab}
            </h2>
            <span className="text-xs text-gray-400 font-semibold">• Mascota: <strong>{activePet.nombre}</strong></span>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={() => setActiveScreen('admin-portal')}
                className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-black border border-purple-200 flex items-center gap-1.5 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Panel SuperAdmin</span>
              </button>
            )}

            {!isAuthenticated && (
              <button
                onClick={() => openAuthModal('login')}
                className="px-4 py-1.5 bg-[#00AEEF] hover:bg-[#0099D6] text-white rounded-xl text-xs font-black transition-colors"
              >
                Ingresar
              </button>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {renderContent()}
        </div>

        {/* Mobile Bottom Navigation (Hidden on Desktop) */}
        <div className="block md:hidden">
          <BottomNav
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onAddClick={() => setShowAddMenu(true)}
            alertCount={activePet.alertas ? activePet.alertas.filter(a => !a.estado || a.estado === 'activa').length : 0}
          />
        </div>

        {/* Modals & Dialogs */}
        {showAddPetModal && (
          <AddPetModal 
            onClose={() => setShowAddPetModal(false)}
            onAddPet={handleAddPet}
          />
        )}

        {/* Contextual Action Menu (Always opens full options menu) */}
        {showAddMenu && (
          <AddMenu 
            onClose={() => setShowAddMenu(false)} 
            onAddRecord={handleAddRecord}
            initialOption={null}
          />
        )}

        {/* Global Alert Action Modal */}
        {selectedAlertForAction && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedAlertForAction(null)}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            
            <div 
              className="relative bg-white rounded-3xl p-6 w-full max-w-sm border border-gray-100 shadow-2xl z-50 animate-in zoom-in-95 duration-200"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedAlertForAction(null)} 
                className="absolute right-4 top-4 p-1.5 bg-gray-50 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-3 mb-4 mt-2">
                <div className={`p-2.5 rounded-2xl shrink-0 ${
                  selectedAlertForAction.tipo === 'critica' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'
                }`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-gray-900 text-sm leading-tight uppercase tracking-wide">{selectedAlertForAction.titulo}</h4>
                  <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">
                    {selectedAlertForAction.tipo === 'critica' ? 'Alerta Crítica' : 'Recordatorio'}
                  </p>
                </div>
              </div>
              
              <p className="text-xs text-gray-600 font-semibold mb-6 leading-relaxed bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                {selectedAlertForAction.descripcion}
              </p>
              
              <div className="space-y-2.5">
                <button 
                  onClick={() => {
                    handleAlertAction(selectedAlertForAction.id, 'solucionar');
                    setSelectedAlertForAction(null);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-2xl shadow-md transition-all active:scale-[0.98]"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  Marcar como Solucionado
                </button>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      handleAlertAction(selectedAlertForAction.id, 'posponer');
                      setSelectedAlertForAction(null);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-2xl shadow-md transition-all active:scale-[0.98]"
                  >
                    <Clock className="w-4 h-4 stroke-[2.5]" />
                    Posponer
                  </button>
                  
                  <button 
                    onClick={() => {
                      handleAlertAction(selectedAlertForAction.id, 'olvidar');
                      setSelectedAlertForAction(null);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black text-xs uppercase tracking-wider py-3.5 rounded-2xl transition-all active:scale-[0.98]"
                  >
                    <Trash2 className="w-4 h-4" />
                    Olvidar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Auth Modal */}
        <AuthModal />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
