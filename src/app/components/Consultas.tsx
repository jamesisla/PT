import { useState } from 'react';
import { ArrowLeft, ChevronDown, Stethoscope, Calendar, User, ShieldAlert, Pencil, Trash2, X } from 'lucide-react';
import { Diagnostico } from '../data/petData';

interface ConsultasProps {
  diagnosticos: Diagnostico[];
  onBack: () => void;
  onUpdateDiagnosis: (diagnosticoId: number, record: any) => void;
  onDeleteDiagnosis: (diagnosticoId: number) => void;
}

export default function Consultas({ diagnosticos, onBack, onUpdateDiagnosis, onDeleteDiagnosis }: ConsultasProps) {
  const [filter, setFilter] = useState('todos');

  // Edit form states
  const [editingDiag, setEditingDiag] = useState<any | null>(null);
  const [editFecha, setEditFecha] = useState('');
  const [editTipo, setEditTipo] = useState<'Consulta General' | 'Urgencia' | 'Especialidad'>('Consulta General');
  const [editDescripcion, setEditDescripcion] = useState('');
  const [editDoctor, setEditDoctor] = useState('');
  const [editEstado, setEditEstado] = useState('Resuelto');
  const [editClinica, setEditClinica] = useState('');

  const filteredDiagnosticos = diagnosticos.filter((d) => {
    if (filter === 'todos') return true;
    if (filter === 'general') return d.tipo === 'Consulta General';
    if (filter === 'urgencia') return d.tipo === 'Urgencia';
    if (filter === 'especialidad') return d.tipo === 'Especialidad';
    return true;
  });

  const parseDate = (dateStr: string) => {
    const parts = (dateStr || '').split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day).getTime();
    }
    return 0;
  };

  const sortedDiagnosticos = [...filteredDiagnosticos].sort((a, b) => {
    const timeA = parseDate(a.fecha);
    const timeB = parseDate(b.fecha);
    if (timeA !== timeB) return timeB - timeA;
    return b.id - a.id;
  });

  const handleStartEdit = (diag: any) => {
    setEditingDiag(diag);
    setEditFecha(diag.fecha);
    setEditTipo(diag.tipo);
    setEditDescripcion(diag.descripcion);
    setEditDoctor(diag.doctor);
    setEditEstado(diag.estado);
    setEditClinica(diag.clinica || 'Hospital Veterinario Sania Pet');
  };

  const ensureESDate = (str: string) => {
    if (!str) return '';
    const trimmed = str.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const [y, m, d] = trimmed.split('-');
      return `${d}/${m}/${y}`;
    }
    return trimmed;
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDescripcion) return;

    onUpdateDiagnosis(editingDiag.id, {
      fecha: ensureESDate(editFecha),
      tipo: editTipo,
      tipoColor: 
        editTipo === 'Urgencia' 
          ? 'bg-red-100 text-red-700 border-red-200' 
          : editTipo === 'Especialidad' 
            ? 'bg-purple-100 text-purple-700 border-purple-200' 
            : 'bg-blue-100 text-blue-700 border-blue-200',
      descripcion: editDescripcion,
      doctor: editDoctor,
      estado: editEstado,
      estadoColor: editEstado === 'Resuelto' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700',
      clinica: editClinica
    });
    setEditingDiag(null);
  };

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
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Historial Clínico</h1>
            <p className="text-white/70 text-[10px] uppercase font-bold tracking-wider mt-0.5">Consultas y Diagnósticos</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
          <span className="text-xs font-bold text-gray-500 shrink-0">Filtrar por:</span>
          <div className="relative flex-1">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 pr-8 text-xs font-bold text-gray-700 appearance-none cursor-pointer focus:outline-none focus:border-[#00AEEF] transition-colors"
            >
              <option value="todos">Todos los eventos</option>
              <option value="general">Consulta General</option>
              <option value="urgencia">Urgencias</option>
              <option value="especialidad">Especialidades</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Consultations List */}
        <div className="space-y-4">
          {sortedDiagnosticos.length > 0 ? (
            sortedDiagnosticos.map((diag) => (
              <div
                key={diag.id}
                className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-3 relative overflow-hidden group hover:border-[#00AEEF]/20 transition-all"
              >
                {/* Visual side indicator depending on urgency */}
                <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${
                  diag.tipo === 'Urgencia' ? 'bg-red-500' : diag.tipo === 'Especialidad' ? 'bg-purple-500' : 'bg-[#00AEEF]'
                }`} />

                <div className="flex items-start justify-between">
                  <div className="flex flex-wrap gap-1.5 max-w-[65%]">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0 ${diag.tipoColor}`}>
                      {diag.tipo === 'Consulta General' ? 'General' : diag.tipo}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gray-100 text-gray-600 shrink-0">
                      {diag.estado}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="flex items-center gap-0.5 text-[10px] font-bold text-gray-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{diag.fecha}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity ml-1.5">
                      <button 
                        onClick={() => handleStartEdit(diag)}
                        className="p-1 hover:bg-gray-50 rounded text-gray-400 hover:text-[#00AEEF] transition-colors"
                        title="Editar consulta"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm('¿Estás seguro de que deseas eliminar esta consulta del historial?')) {
                            onDeleteDiagnosis(diag.id);
                          }
                        }}
                        className="p-1 hover:bg-gray-50 rounded text-gray-400 hover:text-red-500 transition-colors"
                        title="Eliminar consulta"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[9px] text-gray-400 uppercase font-black tracking-wider leading-none">Diagnóstico / Hallazgo</p>
                  <p className="text-gray-900 font-extrabold text-sm leading-snug">
                    {diag.descripcion}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-50 text-[11px] font-bold">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span className="line-clamp-1">{diag.doctor}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500 text-right justify-end">
                    <span className="line-clamp-1 italic text-[10px]">{diag.clinica}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-gray-200">
              <ShieldAlert className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 font-extrabold text-sm">Sin registros para este filtro</p>
              <p className="text-xs text-gray-400 mt-1">Intenta seleccionando otra categoría.</p>
            </div>
          )}
        </div>
      </div>

      {/* Editing Dialog Modal Drawer */}
      {editingDiag && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center animate-in fade-in duration-200"
          onClick={() => setEditingDiag(null)}
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
              onClick={() => setEditingDiag(null)} 
              className="absolute right-4 top-4 p-1.5 bg-gray-50 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <h3 className="font-extrabold text-gray-900 text-base">Modificar Consulta</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fecha</label>
                  <input 
                    type="text" 
                    required
                    value={editFecha}
                    onChange={e => setEditFecha(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Médico Veterinario</label>
                  <input 
                    type="text" 
                    required
                    value={editDoctor}
                    onChange={e => setEditDoctor(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Tipo de Consulta</label>
                <div className="flex gap-2">
                  {['Consulta General', 'Urgencia', 'Especialidad'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setEditTipo(t as any)}
                      className={`flex-1 py-2 text-[10px] font-black rounded-xl border transition-all ${
                        editTipo === t 
                          ? t === 'Urgencia' 
                            ? 'bg-red-500 text-white border-red-500' 
                            : t === 'Especialidad' 
                              ? 'bg-purple-500 text-white border-purple-500' 
                              : 'bg-blue-500 text-white border-blue-500'
                          : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {t === 'Consulta General' ? 'General' : t === 'Urgencia' ? 'Urgencia' : 'Especialidad'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Diagnóstico / Hallazgo</label>
                <textarea 
                  required
                  value={editDescripcion}
                  onChange={e => setEditDescripcion(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#00AEEF] h-16 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Estado Clínico</label>
                  <div className="relative">
                    <select
                      value={editEstado}
                      onChange={e => setEditEstado(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#00AEEF] appearance-none cursor-pointer"
                    >
                      <option value="Resuelto">Resuelto</option>
                      <option value="En control">En control</option>
                      <option value="Controlado">Controlado</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Clínica / Centro</label>
                  <input 
                    type="text" 
                    value={editClinica}
                    onChange={e => setEditClinica(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>
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
