import { ArrowLeft, FlaskConical, Calendar, ChevronRight, FileText } from 'lucide-react';
import { Laboratorio } from '../data/petData';

interface LaboratoriosListProps {
  laboratorios: Laboratorio[];
  onBack: () => void;
  onSelectLab: (id: string) => void;
}

export default function LaboratoriosList({ laboratorios, onBack, onSelectLab }: LaboratoriosListProps) {
  return (
    <div className="flex-1 overflow-auto pb-24 bg-gray-50/50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00AEEF] to-[#1A5AD7] p-5 pb-6 rounded-b-3xl text-white shadow-md">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-white/90 mb-3 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-xs font-semibold">Volver</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Exámenes de Laboratorio</h1>
            <p className="text-white/70 text-[10px] uppercase font-bold tracking-wider mt-0.5">Historial Diagnóstico</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="space-y-3">
          {laboratorios.length > 0 ? (
            laboratorios.map((lab) => (
              <div 
                key={lab.id}
                onClick={() => onSelectLab(lab.id)}
                className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center justify-between gap-4 cursor-pointer hover:border-[#00AEEF]/20 hover:shadow-md transition-all active:scale-[0.98] group"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-green-50 p-3 rounded-2xl text-[#27AE60] shrink-0 group-hover:bg-[#27AE60] group-hover:text-white transition-colors">
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-900 text-sm leading-snug pr-4">{lab.examen}</h4>
                    <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">{lab.laboratorio}</p>
                    
                    <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {lab.fecha}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-gray-400" />
                        Orden #{lab.id}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-2 rounded-xl text-gray-400 group-hover:bg-[#E6F7FF] group-hover:text-[#00AEEF] transition-colors shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-gray-200">
              <FlaskConical className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 font-extrabold text-sm">Sin exámenes registrados</p>
              <p className="text-xs text-gray-400 mt-1">Los resultados de laboratorio aparecerán aquí.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
