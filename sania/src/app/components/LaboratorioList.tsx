import { ArrowLeft, ChevronRight, FlaskConical, Calendar, Building2 } from 'lucide-react';

interface LaboratorioListProps {
  onBack: () => void;
  onSelectSet: (id: string) => void;
}

const examSets = [
  {
    id: '001294643',
    laboratorio: 'LABORATORIO CLINICO BLANCO',
    fecha: '11/01/2025',
    resumen: 'Hemoglobina Glicosilada, Insulina, TSH, T4 Libre',
    status: 'Completado'
  },
  {
    id: '001285512',
    laboratorio: 'CENTRO MÉDICO SALUD',
    fecha: '05/12/2024',
    resumen: 'Perfil Bioquímico, Electrolitos Plasmáticos',
    status: 'Completado'
  },
  {
    id: '001378373',
    laboratorio: 'LABORATORIO CLINICO BLANCO',
    fecha: '03/03/2026',
    resumen: 'Hemograma Completo, Perfil Lipídico, Bioquímico, Vitaminas, Electrolitos',
    status: 'Completado'
  }
];

export default function LaboratorioList({ onBack, onSelectSet }: LaboratorioListProps) {
  return (
    <div className="flex-1 overflow-auto pb-24 bg-gray-50/50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#27AE60] to-[#1E8449] p-6 text-white shadow-lg sticky top-0 z-10 rounded-b-3xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/90 mb-4 hover:text-white transition-colors group"
        >
          <div className="bg-white/20 p-1.5 rounded-lg group-hover:bg-white/30 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-medium">Dashboard</span>
        </button>
        
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md">
            <FlaskConical className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Mis Exámenes</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between px-2 mb-2">
          <h2 className="text-gray-900 font-bold text-lg">Historial de Pruebas</h2>
          <span className="text-xs text-gray-500 font-medium">{examSets.length} sets encontrados</span>
        </div>

        {examSets.map((set) => (
          <div
            key={set.id}
            onClick={() => onSelectSet(set.id)}
            className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-green-100 transition-all cursor-pointer group active:scale-[0.98]"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2 text-[#27AE60]">
                <Building2 className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{set.laboratorio}</span>
              </div>
              <span className="bg-green-50 text-[#27AE60] text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                {set.status}
              </span>
            </div>

            <h3 className="font-bold text-gray-900 text-base mb-2 group-hover:text-[#27AE60] transition-colors line-clamp-1">
              Orden #{set.id}
            </h3>

            <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">
              {set.resumen}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">{set.fecha}</span>
              </div>
              <div className="flex items-center gap-1 text-[#27AE60] font-bold text-xs">
                <span>Ver detalles</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
