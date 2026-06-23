import { Home, Search, Plus, Bell, User } from 'lucide-react';

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
  alertCount = 2
}: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 px-4 py-3 flex items-center justify-around max-w-md mx-auto">
      <button
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center gap-1 transition-colors ${
          activeTab === 'home' ? 'text-[#00AEEF]' : 'text-gray-400'
        }`}
      >
        <Home className="w-6 h-6" />
        <span className="text-xs">Inicio</span>
      </button>

      <button
        onClick={() => onTabChange('episodios')}
        className={`flex flex-col items-center gap-1 transition-colors ${
          activeTab === 'episodios' ? 'text-[#00AEEF]' : 'text-gray-400'
        }`}
      >
        <Search className="w-6 h-6" />
        <span className="text-xs">Buscar</span>
      </button>

      <button
        onClick={onAddClick}
        className="w-14 h-14 -mt-8 bg-[#00AEEF] rounded-full flex items-center justify-center shadow-lg hover:bg-[#0099D6] transition-all hover:scale-105"
      >
        <Plus className="w-7 h-7 text-white" />
      </button>

      <button
        onClick={() => onTabChange('alertas-criticas')}
        className={`flex flex-col items-center gap-1 relative transition-colors ${
          activeTab === 'alertas-criticas' ? 'text-red-500' : 'text-gray-400'
        }`}
      >
        <div className="relative">
          <Bell className="w-6 h-6" />
          {alertCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
              {alertCount}
            </span>
          )}
        </div>
        <span className="text-xs">Alertas</span>
      </button>

      <button
        onClick={() => onTabChange('perfil')}
        className={`flex flex-col items-center gap-1 transition-colors ${
          activeTab === 'perfil' ? 'text-[#00AEEF]' : 'text-gray-400'
        }`}
      >
        <User className="w-6 h-6" />
        <span className="text-xs">Perfil</span>
      </button>
    </div>
  );
}
