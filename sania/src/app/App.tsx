import { useState } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import Notificaciones from './components/Notificaciones';
import ProximosEventos from './components/ProximosEventos';
import Episodios from './components/Episodios';
import Perfil from './components/Perfil';
import Diagnosticos from './components/Diagnosticos';
import Cirugias from './components/Cirugias';
import Laboratorio from './components/Laboratorio';
import LaboratorioList from './components/LaboratorioList';
import LaboratorioM from './components/LaboratorioM';
import AlertasReales from './components/AlertasReales';
import Imagenes from './components/Imagenes';
import Procedimientos from './components/Procedimientos';
import AddMenu from './components/AddMenu';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeScreen, setActiveScreen] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [selectedSetId, setSelectedSetId] = useState<string | undefined>(undefined);

  const handleNavigate = (screen: string) => {
    setActiveScreen(screen);
  };

  const handleBack = () => {
    setActiveScreen(null);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') {
      setActiveScreen(null);
    }
  };

  const renderContent = () => {
    if (activeScreen === 'diagnosticos') {
      return <Diagnosticos onBack={handleBack} />;
    }

    if (activeScreen === 'notificaciones') {
      return <Notificaciones onBack={handleBack} />;
    }

    if (activeScreen === 'cirugias') {
      return <Cirugias onBack={handleBack} />;
    }

    if (activeScreen === 'laboratorio') {
      return <Laboratorio onBack={handleBack} />;
    }

    if (activeScreen === 'laboratorioList') {
      return (
        <LaboratorioList 
          onBack={handleBack} 
          onSelectSet={(id) => {
            setSelectedSetId(id);
            setActiveScreen('laboratorioM');
          }} 
        />
      );
    }

    if (activeScreen === 'laboratorioM') {
      return (
        <LaboratorioM 
          setId={selectedSetId}
          onBack={() => setActiveScreen('laboratorioList')} 
        />
      );
    }

    if (activeScreen === 'alertas-criticas') {
      return <AlertasReales onBack={handleBack} />;
    }

    if (activeScreen === 'imagenes') {
      return <Imagenes onBack={handleBack} />;
    }

    if (activeScreen === 'procedimientos') {
      return <Procedimientos onBack={handleBack} />;
    }

    switch (activeTab) {
      case 'home':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'notificaciones':
        return <Notificaciones />;
      case 'eventos':
        return <ProximosEventos />;
      case 'episodios':
        return <Episodios />;
      case 'alertas-criticas':
        return <AlertasReales onBack={() => setActiveTab('home')} />;
      case 'perfil':
        return <Perfil />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="size-full flex flex-col bg-gray-50 max-w-md mx-auto relative">
      <Header />
      {renderContent()}
      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onAddClick={() => setShowAddMenu(true)}
      />
      {showAddMenu && <AddMenu onClose={() => setShowAddMenu(false)} />}
    </div>
  );
}