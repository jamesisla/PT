import { Home, ClipboardList, Plus, Bell, User } from 'lucide-react';

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
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 flex items-center justify-around max-w-md mx-auto z-20 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
      <button
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center gap-0.5 transition-colors duration-200 ${
          activeTab === 'home' ? 'text-[#00AEEF] font-semibold' : 'text-gray-400'
        }`}
      >
        <Home className="w-6 h-6" />
        <span className="text-[10px]">Inicio</span>
      </button>

      <button
        onClick={() => onTabChange('diario')}
        className={`flex flex-col items-center gap-0.5 transition-colors duration-200 ${
          activeTab === 'diario' ? 'text-[#00AEEF] font-semibold' : 'text-gray-400'
        }`}
      >
        <ClipboardList className="w-6 h-6" />
        <span className="text-[10px]">Diario</span>
      </button>

      {/* Floating Add Action Button */}
      <button
        onClick={onAddClick}
        className="w-14 h-14 -mt-8 bg-[#00AEEF] rounded-full flex items-center justify-center shadow-lg hover:bg-[#0099D6] transition-all hover:scale-105 active:scale-95 text-white z-30"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>

      <button
        onClick={() => onTabChange('alertas')}
        className={`flex flex-col items-center gap-0.5 relative transition-colors duration-200 ${
          activeTab === 'alertas' ? 'text-red-500 font-semibold' : 'text-gray-400'
        }`}
      >
        <div className="relative">
          <Bell className="w-6 h-6" />
          {alertCount > 0 && (
            <span className="absolute -top-1 -right-1.5 w-4.5 h-4.5 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold border-2 border-white animate-pulse">
              {alertCount}
            </span>
          )}
        </div>
        <span className="text-[10px]">Alertas</span>
      </button>

      <button
        onClick={() => onTabChange('perfil')}
        className={`flex flex-col items-center gap-0.5 transition-colors duration-200 ${
          activeTab === 'perfil' ? 'text-[#00AEEF] font-semibold' : 'text-gray-400'
        }`}
      >
        <User className="w-6 h-6" />
        <span className="text-[10px]">Perfil</span>
      </button>
    </div>
  );
}
