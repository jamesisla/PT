import { Home, MapPin, Plus, ClipboardList, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddClick: () => void;
  alertCount?: number;
}

export default function BottomNav({
  activeTab,
  onTabChange,
  onAddClick,
  alertCount = 0
}: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 px-3 py-2.5 flex items-center justify-around max-w-md mx-auto z-20 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
      <button
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center gap-0.5 transition-colors duration-200 ${
          activeTab === 'home' ? 'text-[#00AEEF] font-black' : 'text-gray-400 font-semibold'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[9px]">Inicio</span>
      </button>

      <button
        onClick={() => onTabChange('mapa')}
        className={`flex flex-col items-center gap-0.5 relative transition-colors duration-200 ${
          activeTab === 'mapa' ? 'text-[#00AEEF] font-black' : 'text-gray-400 font-semibold'
        }`}
      >
        <div className="relative">
          <MapPin className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
        </div>
        <span className="text-[9px]">Mapa & SOS</span>
      </button>

      {/* Floating Add Action Button */}
      <button
        onClick={onAddClick}
        className="w-13 h-13 -mt-7 bg-[#00AEEF] rounded-full flex items-center justify-center shadow-lg hover:bg-[#0099D6] transition-all hover:scale-105 active:scale-95 text-white z-30"
        title="Crear registro"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      <button
        onClick={() => onTabChange('diario')}
        className={`flex flex-col items-center gap-0.5 transition-colors duration-200 ${
          activeTab === 'diario' ? 'text-[#00AEEF] font-black' : 'text-gray-400 font-semibold'
        }`}
      >
        <ClipboardList className="w-5 h-5" />
        <span className="text-[9px]">Diario</span>
      </button>

      <button
        onClick={() => onTabChange('perfil')}
        className={`flex flex-col items-center gap-0.5 transition-colors duration-200 ${
          activeTab === 'perfil' ? 'text-[#00AEEF] font-black' : 'text-gray-400 font-semibold'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[9px]">Perfil</span>
      </button>
    </div>
  );
}

