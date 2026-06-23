import { useState } from 'react';
import { ClipboardList, BookOpen, AlertCircle, HeartPulse, ChevronDown, Pencil, Trash2, X } from 'lucide-react';
import { DiarioRegistro } from '../data/petData';

interface DiarioSaludProps {
  diario: DiarioRegistro[];
  onUpdateSymptom: (sintomaId: number, record: any) => void;
  onDeleteSymptom: (sintomaId: number) => void;
}

export default function DiarioSalud({ diario, onUpdateSymptom, onDeleteSymptom }: DiarioSaludProps) {
  const [filter, setFilter] = useState('todos');

  // Edit form states
  const [editingLog, setEditingLog] = useState<any | null>(null);
  const [editSintoma, setEditSintoma] = useState('');
  const [editEstado, setEditEstado] = useState<'Normal' | 'Atención' | 'Alerta'>('Normal');
  const [editNota, setEditNota] = useState('');

  const filteredLogs = diario.filter((log) => {
    if (filter === 'todos') return true;
    return log.estado.toLowerCase() === filter;
  });

  const handleStartEdit = (log: any) => {
    setEditingLog(log);
    setEditSintoma(log.sintoma);
    setEditEstado(log.estado);
    setEditNota(log.nota || '');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSintoma) return;
    
    onUpdateSymptom(editingLog.id, {
      fecha: editingLog.fecha, // Preserve date
      sintoma: editSintoma,
      estado: editEstado,
      nota: editNota
    });
    setEditingLog(null);
  };

  return (
    <div className="flex-1 overflow-auto pb-24 bg-gray-50/50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00AEEF] to-[#1A5AD7] p-5 pb-6 rounded-b-3xl text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Diario de Salud</h1>
            <p className="text-white/70 text-[10px] uppercase font-bold tracking-wider mt-0.5">Bitácora de Síntomas</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Intro */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-2xl text-[#00AEEF] shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
            Registra observaciones cotidianas como cambios en apetito, ánimo o deposiciones para ayudar a tu veterinario en la consulta.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
          <span className="text-xs font-bold text-gray-500 shrink-0">Filtrar por estado:</span>
          <div className="relative flex-1">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 pr-8 text-xs font-bold text-gray-700 appearance-none cursor-pointer focus:outline-none focus:border-[#00AEEF] transition-colors"
            >
              <option value="todos">Todos los eventos</option>
              <option value="normal">Normal</option>
              <option value="atención">Atención</option>
              <option value="alerta">Alerta crítica</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Timeline List */}
        <div className="relative pl-4 border-l-2 border-gray-100 ml-3.5 space-y-5">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => {
              const statusColor = 
                log.estado === 'Alerta' 
                  ? 'bg-red-500 ring-4 ring-red-100' 
                  : log.estado === 'Atención' 
                    ? 'bg-amber-500 ring-4 ring-amber-100' 
                    : 'bg-emerald-500 ring-4 ring-emerald-100';

              return (
                <div key={log.id} className="relative space-y-1.5">
                  {/* Timeline bullet dot */}
                  <div className={`absolute -left-7 top-1.5 w-3 h-3 rounded-full ${statusColor}`} />
                  
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] text-gray-400 font-black tracking-wider uppercase">{log.fecha}</span>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${
                      log.estado === 'Alerta' 
                        ? 'bg-red-50 text-red-700' 
                        : log.estado === 'Atención' 
                          ? 'bg-amber-50 text-amber-700' 
                          : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {log.estado}
                    </span>
                  </div>

                  {/* Symptom Card */}
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-1.5 relative group hover:border-[#00AEEF]/20 transition-all">
                    <div className="flex justify-between items-start">
                      <h4 className="font-extrabold text-gray-800 text-sm leading-tight">{log.sintoma}</h4>
                      
                      {/* Action buttons (Edit & Delete) */}
                      <div className="flex gap-1.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleStartEdit(log)}
                          className="p-1 hover:bg-gray-50 rounded-md text-gray-400 hover:text-[#00AEEF] transition-colors"
                          title="Editar síntoma"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm('¿Estás seguro de que deseas eliminar este síntoma?')) {
                              onDeleteSymptom(log.id);
                            }
                          }}
                          className="p-1 hover:bg-gray-50 rounded-md text-gray-400 hover:text-red-500 transition-colors"
                          title="Eliminar síntoma"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    {log.nota && (
                      <p className="text-gray-500 font-semibold text-[11px] leading-relaxed pt-0.5">
                        {log.nota}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-gray-200 -ml-4">
              <HeartPulse className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 font-extrabold text-sm">Sin anotaciones registradas</p>
              <p className="text-xs text-gray-400 mt-1">Usa el botón (+) para registrar un nuevo síntoma.</p>
            </div>
          )}
        </div>
      </div>

      {/* Editing Dialog Modal Drawer */}
      {editingLog && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center animate-in fade-in duration-200"
          onClick={() => setEditingLog(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          
          {/* Modal content */}
          <div 
            className="relative bg-white rounded-t-[32px] w-full max-w-md p-6 pb-9 border-t border-gray-100 shadow-2xl z-50 animate-in slide-in-from-bottom duration-250"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 -mt-2" />
            <button 
              onClick={() => setEditingLog(null)} 
              className="absolute right-4 top-4 p-1.5 bg-gray-50 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <h3 className="font-extrabold text-gray-900 text-base">Modificar Observación</h3>
              
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Síntoma o Comportamiento</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Falta de apetito, Dolor abdominal" 
                  value={editSintoma}
                  onChange={e => setEditSintoma(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Estado</label>
                <div className="flex gap-2">
                  {['Normal', 'Atención', 'Alerta'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setEditEstado(st as any)}
                      className={`flex-1 py-2 text-xs font-black rounded-xl border transition-all ${
                        editEstado === st 
                          ? st === 'Alerta' 
                            ? 'bg-red-500 text-white border-red-500' 
                            : st === 'Atención' 
                              ? 'bg-amber-500 text-white border-amber-500' 
                              : 'bg-emerald-500 text-white border-emerald-500'
                          : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Detalles Adicionales</label>
                <textarea 
                  placeholder="Anota observaciones como horas, cambios en la comida, etc." 
                  value={editNota}
                  onChange={e => setEditNota(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#00AEEF] h-20 resize-none"
                />
              </div>

              <button type="submit" className="w-full bg-[#00AEEF] text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md hover:bg-[#0099D6] transition-colors">
                Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
