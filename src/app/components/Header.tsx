import { Settings, ChevronDown, Plus, Shield, User as UserIcon, LogIn, LogOut } from 'lucide-react';
import { Pet } from '../data/petData';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  activePet: Pet;
  allPets: Pet[];
  onSelectPet: (id: string) => void;
  onOpenAddPet: () => void;
  onOpenSettings?: () => void;
  onOpenAdmin?: () => void;
}

export default function Header({ activePet, allPets, onSelectPet, onOpenAddPet, onOpenSettings, onOpenAdmin }: HeaderProps) {
  const { user, isAuthenticated, isAdmin, openAuthModal, logout } = useAuth();

  return (
    <div className="bg-white border-b border-gray-200 p-3.5 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      <div className="flex items-center gap-2.5">
        {/* Pet Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/10 shadow-xs bg-gray-100 shrink-0">
          <img 
            src={activePet.foto} 
            alt={activePet.nombre} 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTgiIGZpbGw9IiNFM0YyRkQiLz48dGV4dCB4PSI1MCUiIHk9IjU1JSIgZm9udC1zaXplPSIxNiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzE1NjVDNCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UEVUPC90ZXh0Pjwvc3ZnPg==';
            }}
          />
        </div>

        {/* Pet Switcher Dropdown */}
        <div className="relative group">
          <label className="text-[9px] text-gray-400 font-bold block leading-none mb-0.5 uppercase tracking-wider">
            Mascota activa
          </label>
          <div className="flex items-center gap-1 cursor-pointer">
            <select
              value={activePet.id}
              onChange={(e) => {
                if (e.target.value === '__NEW_PET__') {
                  onOpenAddPet();
                } else {
                  onSelectPet(e.target.value);
                }
              }}
              className="font-bold text-gray-900 pr-5 bg-transparent appearance-none border-none outline-none cursor-pointer text-sm focus:ring-0 py-0"
            >
              {allPets.map((pet) => (
                <option key={pet.id} value={pet.id} className="font-semibold text-xs">
                  {pet.nombre} ({pet.especie})
                </option>
              ))}
              <option value="__NEW_PET__" className="font-black text-xs text-[#00AEEF]">
                + Agregar nueva mascota...
              </option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-0 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {/* SuperAdmin Portal Button (if admin) */}
        {isAdmin && (
          <button
            onClick={onOpenAdmin}
            className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 px-2.5 py-1.5 rounded-xl text-[10px] font-black transition-all flex items-center gap-1 shrink-0"
            title="Abrir Panel SuperAdmin"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        )}

        {/* Auth / User status */}
        {isAuthenticated ? (
          <div className="flex items-center gap-1">
            <button
              onClick={() => logout()}
              className="w-8 h-8 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-full flex items-center justify-center transition-colors"
              title={`Cerrar sesión (${user?.email})`}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => openAuthModal('login')}
            className="bg-blue-50 text-[#00AEEF] hover:bg-[#00AEEF] hover:text-white px-2.5 py-1.5 rounded-xl text-[10px] font-black transition-all flex items-center gap-1 shrink-0"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Ingresar</span>
          </button>
        )}

        {/* Add Pet Button */}
        <button
          onClick={onOpenAddPet}
          className="bg-[#E6F7FF] text-[#00AEEF] hover:bg-[#00AEEF] hover:text-white px-2.5 py-1.5 rounded-xl text-[10px] font-black transition-all flex items-center gap-1 shrink-0 shadow-xs"
          title="Agregar nueva mascota"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Nueva</span>
        </button>

        {/* Settings Button */}
        <button 
          onClick={onOpenSettings}
          className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all text-gray-400 hover:text-gray-600"
          title="Ajustes"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

