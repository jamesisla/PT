import { useState, useEffect } from 'react';
import { Pet } from './data/petData';
import { 
  getPetsList, 
  getPetDetail, 
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
import MapetServicios from './components/MapetServicios';
import { AlertTriangle, Bell, Info, Clock, Check, Trash2, X } from 'lucide-react';

export default function App() {
  const [petsList, setPetsList] = useState<any[]>([]);
  const [activePetId, setActivePetId] = useState('luna');
  const [activePet, setActivePet] = useState<Pet | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [activeScreen, setActiveScreen] = useState<string | null>(null);
  const [selectedLabId, setSelectedLabId] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
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
  };

  const handleBack = () => {
    setActiveScreen(null);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setActiveScreen(null);
  };

  const handleSelectPet = (petId: string) => {
    setActivePetId(petId);
    setActiveScreen(null);
    setActiveTab('home');
  };

  const handleAddRecord = async (type: string, record: any) => {
    if (!activePet) return;

    try {
      if (type === 'sintoma') {
        await addSymptomRecord(activePetId, record);
      } else if (type === 'peso') {
        await addWeightRecord(activePetId, record);
      } else if (type === 'vacuna') {
        await addVaccineRecord(activePetId, record);
      } else if (type === 'alerta') {
        await addAlertRecord(activePetId, record);
      } else if (type === 'medicamento') {
        await addMedicationRecord(activePetId, record);
      } else if (type === 'diagnostico') {
        await addDiagnosisRecord(activePetId, record);
      } else if (type === 'desparasitacion') {
        await addDewormingRecord(activePetId, record);
      } else if (type === 'laboratorio') {
        await addLaboratoryRecord(activePetId, record);
      } else if (type === 'imagen') {
        await addMedicalImageRecord(activePetId, record);
      }

      // Refresh from backend to display the newly saved DB record
      const updatedDetail = await getPetDetail(activePetId);
      setActivePet(updatedDetail);
    } catch (err) {
      console.error('Error saving record', err);
    }
  };

  const handleAlertAction = async (alertId: string, action: string) => {
    if (!activePet) return;
    try {
      await updateAlertAction(alertId, action, activePetId);
      const updatedDetail = await getPetDetail(activePetId);
      setActivePet(updatedDetail);
    } catch (err) {
      console.error('Error handling alert action', err);
    }
  };

  const handleUpdateSymptom = async (sintomaId: number, record: any) => {
    if (!activePet) return;
    try {
      await updateSymptomRecord(activePetId, sintomaId, record);
      const updatedDetail = await getPetDetail(activePetId);
      setActivePet(updatedDetail);
    } catch (err) {
      console.error('Error updating symptom', err);
    }
  };

  const handleDeleteSymptom = async (sintomaId: number) => {
    if (!activePet) return;
    try {
      await deleteSymptomRecord(activePetId, sintomaId);
      const updatedDetail = await getPetDetail(activePetId);
      setActivePet(updatedDetail);
    } catch (err) {
      console.error('Error deleting symptom', err);
    }
  };

  const handleUpdateVaccine = async (vacunaId: number, record: any) => {
    if (!activePet) return;
    try {
      await updateVaccineRecord(activePetId, vacunaId, record);
      const updatedDetail = await getPetDetail(activePetId);
      setActivePet(updatedDetail);
    } catch (err) {
      console.error('Error updating vaccine', err);
    }
  };

  const handleDeleteVaccine = async (vacunaId: number) => {
    if (!activePet) return;
    try {
      await deleteVaccineRecord(activePetId, vacunaId);
      const updatedDetail = await getPetDetail(activePetId);
      setActivePet(updatedDetail);
    } catch (err) {
      console.error('Error deleting vaccine', err);
    }
  };

  const handleUpdateMedication = async (medicamentoId: number, record: any) => {
    if (!activePet) return;
    try {
      await updateMedicationRecord(activePetId, medicamentoId, record);
      const updatedDetail = await getPetDetail(activePetId);
      setActivePet(updatedDetail);
    } catch (err) {
      console.error('Error updating medication', err);
    }
  };

  const handleDeleteMedication = async (medicamentoId: number) => {
    if (!activePet) return;
    try {
      await deleteMedicationRecord(activePetId, medicamentoId);
      const updatedDetail = await getPetDetail(activePetId);
      setActivePet(updatedDetail);
    } catch (err) {
      console.error('Error deleting medication', err);
    }
  };

  const handleUpdatePetProfile = async (petData: any) => {
    if (!activePet) return;
    try {
      await updatePetProfile(activePetId, petData);
      const updatedDetail = await getPetDetail(activePetId);
      setActivePet(updatedDetail);
      // Refresh summary pet list in case name/photo changed
      const list = await getPetsList();
      setPetsList(list);
    } catch (err) {
      console.error('Error updating pet profile', err);
    }
  };

  const handleUpdatePetOwner = async (ownerData: any) => {
    if (!activePet) return;
    try {
      await updatePetOwner(activePetId, ownerData);
      const updatedDetail = await getPetDetail(activePetId);
      setActivePet(updatedDetail);
    } catch (err) {
      console.error('Error updating owner profile', err);
    }
  };

  const handleUpdateDiagnosis = async (diagnosticoId: number, record: any) => {
    if (!activePet) return;
    try {
      await updateDiagnosisRecord(activePetId, diagnosticoId, record);
      const updatedDetail = await getPetDetail(activePetId);
      setActivePet(updatedDetail);
    } catch (err) {
      console.error('Error updating diagnosis', err);
    }
  };

  const handleDeleteDiagnosis = async (diagnosticoId: number) => {
    if (!activePet) return;
    try {
      await deleteDiagnosisRecord(activePetId, diagnosticoId);
      const updatedDetail = await getPetDetail(activePetId);
      setActivePet(updatedDetail);
    } catch (err) {
      console.error('Error deleting diagnosis', err);
    }
  };

  const handleUpdateDeworming = async (dewormingId: number, record: any) => {
    if (!activePet) return;
    try {
      await updateDewormingRecord(activePetId, dewormingId, record);
      const updatedDetail = await getPetDetail(activePetId);
      setActivePet(updatedDetail);
    } catch (err) {
      console.error('Error updating deworming', err);
    }
  };

  const handleDeleteDeworming = async (dewormingId: number) => {
    if (!activePet) return;
    try {
      await deleteDewormingRecord(activePetId, dewormingId);
      const updatedDetail = await getPetDetail(activePetId);
      setActivePet(updatedDetail);
    } catch (err) {
      console.error('Error deleting deworming', err);
    }
  };

  const handleUpdateLaboratory = async (labId: string, record: any) => {
    if (!activePet) return;
    try {
      await updateLaboratoryRecord(activePetId, labId, record);
      const updatedDetail = await getPetDetail(activePetId);
      setActivePet(updatedDetail);
    } catch (err) {
      console.error('Error updating laboratory record', err);
    }
  };

  const handleDeleteLaboratory = async (labId: string) => {
    if (!activePet) return;
    try {
      await deleteLaboratoryRecord(activePetId, labId);
      const updatedDetail = await getPetDetail(activePetId);
      setActivePet(updatedDetail);
    } catch (err) {
      console.error('Error deleting laboratory record', err);
    }
  };

  const handleUpdateMedicalImage = async (imageId: number, record: any) => {
    if (!activePet) return;
    try {
      await updateMedicalImageRecord(activePetId, imageId, record);
      const updatedDetail = await getPetDetail(activePetId);
      setActivePet(updatedDetail);
    } catch (err) {
      console.error('Error updating medical image record', err);
    }
  };

  const handleDeleteMedicalImage = async (imageId: number) => {
    if (!activePet) return;
    try {
      await deleteMedicalImageRecord(activePetId, imageId);
      const updatedDetail = await getPetDetail(activePetId);
      setActivePet(updatedDetail);
    } catch (err) {
      console.error('Error deleting medical image record', err);
    }
  };



  // Loading Screen
  if (loading || !activePet) {
    return (
      <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-full max-w-md h-[812px] bg-white flex flex-col items-center justify-center p-6 rounded-[40px] shadow-2xl border border-gray-200">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#00AEEF] mb-4"></div>
          <p className="text-sm font-semibold text-gray-500">Cargando Ficha Médica...</p>
        </div>
      </div>
    );
  }

  // Render content depending on navigation state
  const renderContent = () => {
    if (activeScreen === 'consultas') {
      return (
        <Consultas 
          diagnosticos={activePet.diagnosticos} 
          onBack={handleBack} 
          onUpdateDiagnosis={handleUpdateDiagnosis}
          onDeleteDiagnosis={handleDeleteDiagnosis}
        />
      );
    }

    if (activeScreen === 'vacunas') {
      return (
        <Vacunas 
          vacunas={activePet.vacunas} 
          onBack={handleBack} 
          onUpdateVaccine={handleUpdateVaccine}
          onDeleteVaccine={handleDeleteVaccine}
        />
      );
    }

    if (activeScreen === 'desparasitaciones') {
      return (
        <Desparasitaciones 
          desparasitaciones={activePet.desparasitaciones} 
          onBack={handleBack} 
          onUpdateDeworming={handleUpdateDeworming}
          onDeleteDeworming={handleDeleteDeworming}
        />
      );
    }

    if (activeScreen === 'medicamentos') {
      return (
        <Medicamentos 
          medicamentos={activePet.medicamentos} 
          onBack={handleBack} 
          onUpdateMedication={handleUpdateMedication}
          onDeleteMedication={handleDeleteMedication}
        />
      );
    }

    if (activeScreen === 'laboratorios') {
      return (
        <LaboratoriosList 
          laboratorios={activePet.laboratorios} 
          onBack={handleBack} 
          onSelectLab={(id) => {
            setSelectedLabId(id);
            setActiveScreen('laboratorios-detalle');
          }} 
        />
      );
    }

    if (activeScreen === 'laboratorios-detalle') {
      return (
        <LaboratoriosDetalle 
          pet={activePet} 
          labId={selectedLabId || ''} 
          onBack={() => setActiveScreen('laboratorios')} 
          onUpdateLaboratory={handleUpdateLaboratory}
          onDeleteLaboratory={handleDeleteLaboratory}
        />
      );
    }

    if (activeScreen === 'imagenes') {
      return (
        <ImagenesMedicas 
          imagenes={activePet.imagenes} 
          onBack={handleBack} 
          onUpdateMedicalImage={handleUpdateMedicalImage}
          onDeleteMedicalImage={handleDeleteMedicalImage}
        />
      );
    }

    if (activeScreen === 'perfil-detalle') {
      return (
        <PerfilMascota 
          pet={activePet} 
          onUpdatePetProfile={handleUpdatePetProfile}
          onUpdatePetOwner={handleUpdatePetOwner}
        />
      );
    }

    if (activeScreen === 'mapet-servicios') {
      return <MapetServicios onBack={handleBack} />;
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
            {/* Header */}
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
                    className={`bg-white rounded-3xl p-5 shadow-sm border relative overflow-hidden flex items-start gap-3.5 cursor-pointer hover:border-gray-200 transition-all active:scale-[0.99] ${
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
            pet={activePet} 
            onUpdatePetProfile={handleUpdatePetProfile}
            onUpdatePetOwner={handleUpdatePetOwner}
          />
        );
      default:
        return <Dashboard activePet={activePet} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center py-0 sm:py-8">
      <div className="w-full max-w-md min-h-screen sm:min-h-[812px] sm:h-[812px] bg-gray-50 flex flex-col relative overflow-hidden sm:rounded-[40px] sm:shadow-2xl border border-gray-200/50">
        
        <Header 
          activePet={activePet} 
          allPets={petsList.length > 0 ? petsList : [activePet]} 
          onSelectPet={handleSelectPet}
          onOpenSettings={() => alert('Configuración: Simulación de ajustes.')}
        />
        
        {renderContent()}
        
        {/* Bottom Nav Bar */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onAddClick={() => setShowAddMenu(true)}
          alertCount={activePet.alertas ? activePet.alertas.filter(a => !a.estado || a.estado === 'activa').length : 0}
        />
        
        {showAddMenu && (
          <AddMenu 
            onClose={() => setShowAddMenu(false)} 
            onAddRecord={handleAddRecord}
            initialOption={(() => {
              if (activeScreen === 'consultas') return 'diagnostico';
              if (activeScreen === 'vacunas') return 'vacuna';
              if (activeScreen === 'desparasitaciones') return 'desparasitacion';
              if (activeScreen === 'medicamentos') return 'medicamento';
              if (activeScreen === 'laboratorios' || activeScreen === 'laboratorios-detalle') return 'laboratorio';
              if (activeScreen === 'imagenes') return 'imagen';
              
              if (!activeScreen) {
                if (activeTab === 'diario') return 'sintoma';
                if (activeTab === 'alertas') return 'alerta';
              }
              return null;
            })()}
          />
        )}

        {/* Global Alert Action Modal */}
        {selectedAlertForAction && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedAlertForAction(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            
            {/* Modal content */}
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
      </div>
    </div>
  );
}
