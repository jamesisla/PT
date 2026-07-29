import { useState } from 'react';
import { ArrowLeft, ShieldCheck, Calendar, CheckCircle2, AlertCircle, Syringe, Pencil, Trash2, X } from 'lucide-react';
import { Vacuna } from '../data/petData';

interface VacunasProps {
  vacunas: Vacuna[];
  onBack: () => void;
  onUpdateVaccine: (vacunaId: number, record: any) => void;
  onDeleteVaccine: (vacunaId: number) => void;
}

export default function Vacunas({ vacunas, onBack, onUpdateVaccine, onDeleteVaccine }: VacunasProps) {
  // Edit form states
  const [editingVacuna, setEditingVacuna] = useState<any | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [editFecha, setEditFecha] = useState('');
  const [editLote, setEditLote] = useState('');
  const [editVeterinario, setEditVeterinario] = useState('');
  const [editProximaFecha, setEditProximaFecha] = useState('');
  const [editEstado, setEditEstado] = useState<'Aplicada' | 'Vencida' | 'Pendiente'>('Aplicada');

  const handleStartEdit = (vac: any) => {
    setEditingVacuna(vac);
    setEditNombre(vac.nombre);
    setEditFecha(vac.fecha || '');
    setEditLote(vac.lote || 'N/A');
    setEditVeterinario(vac.veterinario || 'Dr. Veterinario Externo');
    setEditProximaFecha(vac.proximaFecha || 'No programada');
    setEditEstado(vac.estado === 'Applied' ? 'Aplicada' : vac.estado);
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
    if (!editNombre) return;

    onUpdateVaccine(editingVacuna.id, {
      fecha: ensureESDate(editFecha),
      nombre: editNombre,
      lote: editLote,
      veterinario: editVeterinario,
      proximaFecha: editProximaFecha,
      estado: editEstado,
      estadoColor: 
        editEstado === 'Aplicada' 
          ? 'bg-green-100 text-green-700' 
          : editEstado === 'Vencida' 
            ? 'bg-red-100 text-red-700' 
            : 'bg-orange-100 text-orange-700'
    });
    setEditingVacuna(null);
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
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Vacunación</h1>
            <p className="text-white/70 text-[10px] uppercase font-bold tracking-wider mt-0.5">Control de Inmunización</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">
        
        {/* Next Vaccine Alerts */}
        <div className="space-y-3">
          <h3 className="text-gray-900 font-extrabold text-sm px-1">Próximos Refuerzos</h3>
          {vacunas.some(vac => vac.estado === 'Vencida' || vac.estado === 'Pendiente') ? (
            vacunas.map((vac) => {
              const isVencida = vac.estado === 'Vencida';
              const isApplied = vac.estado === 'Applied' || vac.estado === 'Aplicada';
              
              if (isApplied) return null; // Only show pending/upcoming calendar

              return (
                <div 
                  key={vac.id} 
                  className={`p-4 rounded-3xl border flex items-start gap-3 shadow-sm relative group hover:shadow transition-all ${
                    isVencida ? 'bg-red-50/70 border-red-200' : 'bg-orange-50/70 border-orange-200'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${isVencida ? 'bg-red-500' : 'bg-orange-500'}`}>
                    <AlertCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-extrabold text-gray-900 text-xs mr-2">{vac.nombre}</h4>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                          isVencida ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {isVencida ? 'Vencida' : 'Pendiente'}
                        </span>
                        
                        {/* Edit & Delete Action Buttons */}
                        <div className="flex gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity ml-1.5">
                          <button 
                            onClick={() => handleStartEdit(vac)}
                            className="p-1 hover:bg-white rounded text-gray-400 hover:text-[#00AEEF] transition-colors"
                            title="Editar vacuna"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm('¿Estás seguro de que deseas eliminar esta vacuna?')) {
                                onDeleteVaccine(vac.id);
                              }
                            }}
                            className="p-1 hover:bg-white rounded text-gray-400 hover:text-red-500 transition-colors"
                            title="Eliminar vacuna"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500 font-bold mt-1">Refuerzo requerido: {vac.proximaFecha}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-3xl p-6 text-center border border-dashed border-gray-200">
              <p className="text-gray-400 text-xs font-semibold">No hay vacunas pendientes.</p>
            </div>
          )}
        </div>

        {/* Applied Vaccines Log */}
        <div className="space-y-3">
          <h3 className="text-gray-900 font-extrabold text-sm px-1">Historial de Aplicaciones</h3>
          <div className="space-y-3.5">
            {vacunas.some(vac => vac.estado === 'Applied' || vac.estado === 'Aplicada') ? (
              vacunas.map((vac) => {
                if (vac.estado === 'Vencida' || vac.estado === 'Pendiente') return null; // already shown above

                return (
                  <div 
                    key={vac.id}
                    className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 relative overflow-hidden flex items-start gap-4 hover:border-emerald-200 transition-colors group"
                  >
                    <div className="bg-emerald-50 p-2.5 rounded-2xl text-emerald-500 shrink-0">
                      <Syringe className="w-5 h-5" />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-extrabold text-gray-900 text-sm leading-tight mr-2">{vac.nombre}</h4>
                          <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Aplicada el {vac.fecha}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-emerald-50 text-emerald-700 text-[8px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 uppercase shrink-0">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Vigente
                          </span>
                          
                          {/* Edit & Delete Action Buttons */}
                          <div className="flex gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleStartEdit(vac)}
                              className="p-1 hover:bg-gray-50 rounded text-gray-400 hover:text-[#00AEEF] transition-colors"
                              title="Editar vacuna"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => {
                                if (confirm('¿Estás seguro de que deseas eliminar esta vacuna?')) {
                                  onDeleteVaccine(vac.id);
                                }
                              }}
                              className="p-1 hover:bg-gray-50 rounded text-gray-400 hover:text-red-500 transition-colors"
                              title="Eliminar vacuna"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-50 text-[10px] font-bold text-gray-500">
                        <div>
                          <span className="block text-[8px] text-gray-400 uppercase tracking-wider">Lote</span>
                          <span className="text-gray-700">{vac.lote}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] text-gray-400 uppercase tracking-wider">Veterinario</span>
                          <span className="text-gray-700 line-clamp-1">{vac.veterinario}</span>
                        </div>
                        <div className="col-span-2 pt-1">
                          <span className="block text-[8px] text-gray-400 uppercase tracking-wider">Próximo Refuerzo</span>
                          <span className="text-gray-800 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#00AEEF]" />
                            {vac.proximaFecha}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-3xl p-6 text-center border border-dashed border-gray-200">
                <p className="text-gray-400 text-xs font-semibold">No hay aplicaciones registradas.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Editing Dialog Modal Drawer */}
      {editingVacuna && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center animate-in fade-in duration-200"
          onClick={() => setEditingVacuna(null)}
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
              onClick={() => setEditingVacuna(null)} 
              className="absolute right-4 top-4 p-1.5 bg-gray-50 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <h3 className="font-extrabold text-gray-900 text-base">Modificar Vacuna</h3>
              
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Nombre de Vacuna</label>
                <input 
                  type="text" 
                  required
                  value={editNombre}
                  onChange={e => setEditNombre(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fecha Aplicación</label>
                  <input 
                    type="text" 
                    value={editFecha}
                    onChange={e => setEditFecha(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Próximo Refuerzo</label>
                  <input 
                    type="text" 
                    value={editProximaFecha}
                    onChange={e => setEditProximaFecha(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Lote / Serie</label>
                  <input 
                    type="text" 
                    value={editLote}
                    onChange={e => setEditLote(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Veterinario</label>
                  <input 
                    type="text" 
                    value={editVeterinario}
                    onChange={e => setEditVeterinario(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Estado</label>
                <div className="flex gap-2">
                  {['Aplicada', 'Pendiente', 'Vencida'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setEditEstado(st as any)}
                      className={`flex-1 py-2 text-xs font-black rounded-xl border transition-all ${
                        editEstado === st 
                          ? st === 'Vencida' 
                            ? 'bg-red-500 text-white border-red-500' 
                            : st === 'Pendiente' 
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
