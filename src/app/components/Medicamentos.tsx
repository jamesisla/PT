import { useState } from 'react';
import { ArrowLeft, Pill, Calendar, Clock, User, CheckCircle2, Pencil, Trash2, X } from 'lucide-react';
import { Medicamento } from '../data/petData';

interface MedicamentosProps {
  medicamentos: Medicamento[];
  onBack: () => void;
  onUpdateMedication: (medicamentoId: number, record: any) => void;
  onDeleteMedication: (medicamentoId: number) => void;
}

export default function Medicamentos({ medicamentos, onBack, onUpdateMedication, onDeleteMedication }: MedicamentosProps) {
  const activeMeds = medicamentos.filter(m => m.estado === 'Activo');
  const completedMeds = medicamentos.filter(m => m.estado === 'Completado');

  // Edit states
  const [editingMed, setEditingMed] = useState<any | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [editDosis, setEditDosis] = useState('');
  const [editFrecuencia, setEditFrecuencia] = useState('');
  const [editDuracion, setEditDuracion] = useState('');
  const [editFechaInicio, setEditFechaInicio] = useState('');
  const [editVeterinario, setEditVeterinario] = useState('');
  const [editEstado, setEditEstado] = useState<'Activo' | 'Completado'>('Activo');

  const handleStartEdit = (med: any) => {
    setEditingMed(med);
    setEditNombre(med.nombre);
    setEditDosis(med.dosis || 'N/A');
    setEditFrecuencia(med.frecuencia || 'N/A');
    setEditDuracion(med.duracion || 'N/A');
    setEditFechaInicio(med.fechaInicio || '');
    setEditVeterinario(med.veterinario || 'Dr. Veterinario Externo');
    setEditEstado(med.estado);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editNombre) return;

    onUpdateMedication(editingMed.id, {
      nombre: editNombre,
      dosis: editDosis,
      frecuencia: editFrecuencia,
      duracion: editDuracion,
      fechaInicio: editFechaInicio,
      veterinario: editVeterinario,
      estado: editEstado
    });
    setEditingMed(null);
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
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Tratamientos</h1>
            <p className="text-white/70 text-[10px] uppercase font-bold tracking-wider mt-0.5">Recetas y Medicación</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">
        
        {/* Active Prescriptions */}
        <div className="space-y-3">
          <h3 className="text-gray-900 font-extrabold text-sm px-1">Prescripciones Activas</h3>
          {activeMeds.length > 0 ? (
            activeMeds.map((med) => (
              <div 
                key={med.id}
                className="bg-white rounded-3xl p-5 shadow-sm border border-indigo-100 relative overflow-hidden space-y-3 group hover:border-[#5B6FDB]/30 transition-all"
              >
                <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-[#5B6FDB]" />
                
                <div className="flex justify-between items-start">
                  <div className="bg-indigo-50 p-2.5 rounded-2xl text-[#5B6FDB]">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-50 text-[#5B6FDB] text-[8px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      En Curso
                    </span>
                    
                    {/* Actions */}
                    <div className="flex gap-1.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity ml-1">
                      <button 
                        onClick={() => handleStartEdit(med)}
                        className="p-1 hover:bg-gray-50 rounded text-gray-400 hover:text-[#00AEEF] transition-colors"
                        title="Editar medicamento"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm('¿Estás seguro de que deseas eliminar este tratamiento?')) {
                            onDeleteMedication(med.id);
                          }
                        }}
                        className="p-1 hover:bg-gray-50 rounded text-gray-400 hover:text-red-500 transition-colors"
                        title="Eliminar medicamento"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-extrabold text-gray-900 text-base leading-tight">{med.nombre}</h4>
                  <p className="text-[10px] text-gray-400 font-bold mt-1">Iniciado el {med.fechaInicio}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-50 text-[11px] font-bold text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="block text-[8px] text-gray-400 uppercase tracking-wider">Dosis / Frecuencia</span>
                      <span className="text-gray-900">{med.dosis} ({med.frecuencia})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="block text-[8px] text-gray-400 uppercase tracking-wider">Duración</span>
                      <span className="text-gray-900">{med.duracion}</span>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center gap-1.5 pt-1.5 border-t border-dashed border-gray-50">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-500 font-semibold">Prescrito por: <span className="text-gray-800 font-bold">{med.veterinario}</span></span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl p-6 text-center border border-dashed border-gray-200">
              <p className="text-gray-400 text-xs font-semibold">No hay tratamientos activos en este momento.</p>
            </div>
          )}
        </div>

        {/* Completed Prescriptions */}
        {completedMeds.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-gray-900 font-extrabold text-sm px-1">Historial de Tratamientos</h3>
            <div className="space-y-3">
              {completedMeds.map((med) => (
                <div 
                  key={med.id}
                  className="bg-white/70 rounded-3xl p-4 shadow-sm border border-gray-100 flex items-center gap-3.5 group hover:border-[#00AEEF]/20 transition-all"
                >
                  <div className="bg-gray-100 p-2 rounded-xl text-gray-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-gray-800 text-xs truncate leading-snug">{med.nombre}</h4>
                    <p className="text-[9px] text-gray-400 font-semibold mt-0.5">
                      Dosis: {med.dosis} • {med.duracion}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[9px] text-gray-400 font-bold">{med.fechaInicio}</span>
                    
                    {/* Action buttons */}
                    <div className="flex gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleStartEdit(med)}
                        className="p-1 hover:bg-white rounded text-gray-400 hover:text-[#00AEEF] transition-colors"
                        title="Editar medicamento"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm('¿Estás seguro de que deseas eliminar este tratamiento?')) {
                            onDeleteMedication(med.id);
                          }
                        }}
                        className="p-1 hover:bg-white rounded text-gray-400 hover:text-red-500 transition-colors"
                        title="Eliminar medicamento"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Editing Dialog Modal Drawer */}
      {editingMed && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center animate-in fade-in duration-200"
          onClick={() => setEditingMed(null)}
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
              onClick={() => setEditingMed(null)} 
              className="absolute right-4 top-4 p-1.5 bg-gray-50 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <h3 className="font-extrabold text-gray-900 text-base">Modificar Tratamiento</h3>
              
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Nombre del Medicamento</label>
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
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Dosis</label>
                  <input 
                    type="text" 
                    value={editDosis}
                    onChange={e => setEditDosis(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Frecuencia</label>
                  <input 
                    type="text" 
                    value={editFrecuencia}
                    onChange={e => setEditFrecuencia(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Duración</label>
                  <input 
                    type="text" 
                    value={editDuracion}
                    onChange={e => setEditDuracion(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fecha Inicio</label>
                  <input 
                    type="text" 
                    value={editFechaInicio}
                    onChange={e => setEditFechaInicio(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>
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

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Estado</label>
                <div className="flex gap-2">
                  {['Activo', 'Completado'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setEditEstado(st as any)}
                      className={`flex-1 py-2 text-xs font-black rounded-xl border transition-all ${
                        editEstado === st 
                          ? 'bg-[#5B6FDB] text-white border-[#5B6FDB]' 
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
