import { Settings, ChevronDown, Plus } from 'lucide-react';
import { Pet } from '../data/petData';

interface HeaderProps {
  activePet: Pet;
  allPets: Pet[];
  onSelectPet: (id: string) => void;
  onOpenAddPet: () => void;
  onOpenSettings?: () => void;
}

export default function Header({ activePet, allPets, onSelectPet, onOpenAddPet, onOpenSettings }: HeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Pet Avatar */}
        <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-primary/10 shadow-sm bg-gray-100 shrink-0">
          <img 
            src={activePet.foto} 
            alt={activePet.nombre} 
            className="w-full h-full object-cover"
            onError={(e) => {
              // fallback if unsplash fails
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTgiIGZpbGw9IiNFM0YyRkQiLz48dGV4dCB4PSI1MCUiIHk9IjU1JSIgZm9udC1zaXplPSIxNiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzE1NjVDNCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UEVUPC90ZXh0Pjwvc3ZnPg==';
            }}
          />
        </div>

        {/* Pet Switcher Dropdown */}
        <div className="relative group">
          <label className="text-[10px] text-gray-400 font-bold block leading-none mb-0.5 uppercase tracking-wider">
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
              className="font-bold text-gray-900 pr-5 bg-transparent appearance-none border-none outline-none cursor-pointer text-base focus:ring-0 py-0"
            >
              {allPets.map((pet) => (
                <option key={pet.id} value={pet.id} className="font-semibold text-sm">
                  {pet.nombre} ({pet.especie})
                </option>
              ))}
              <option value="__NEW_PET__" className="font-black text-sm text-[#00AEEF]">
                + Agregar nueva mascota...
              </option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-0 top-3.5 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Add Pet Button */}
        <button
          onClick={onOpenAddPet}
          className="bg-[#E6F7FF] text-[#00AEEF] hover:bg-[#00AEEF] hover:text-white px-3 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 shadow-xs"
          title="Agregar nueva mascota"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Nueva</span>
        </button>

        {/* Settings Button */}
        <button 
          onClick={onOpenSettings}
          className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 text-gray-400 hover:text-gray-600"
          title="Ajustes"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
