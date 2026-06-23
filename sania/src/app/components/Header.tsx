import { Settings, User, ChevronDown } from 'lucide-react';

export default function Header() {
  return (
    <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 shadow-sm">
          <img 
            src="/felipe_avatar.png" 
            alt="Usuario" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex items-center gap-1">
          <span className="font-semibold">Hola, Usuario</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      <button className="w-10 h-10 bg-[#E6F7FF] rounded-full flex items-center justify-center hover:bg-[#CCF0FF] transition-colors">
        <Settings className="w-5 h-5 text-[#00AEEF]" />
      </button>
    </div>
  );
}
