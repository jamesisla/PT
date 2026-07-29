import { useState } from 'react';
import { ArrowLeft, Bug, Calendar, Pencil, Trash2, X } from 'lucide-react';
import { Desparasitacion } from '../data/petData';

interface DesparasitacionesProps {
  desparasitaciones: Desparasitacion[];
  onBack: () => void;
  onUpdateDeworming: (dewormingId: number, record: any) => void;
  onDeleteDeworming: (dewormingId: number) => void;
}

export default function Desparasitaciones({ desparasitaciones, onBack, onUpdateDeworming, onDeleteDeworming }: DesparasitacionesProps) {
  // Edit form states
  const [editingDesparasitacion, setEditingDesparasitacion] = useState<Desparasitacion | null>(null);
  const [editFecha, setEditFecha] = useState('');
  const [editTipo, setEditTipo] = useState<'Interna' | 'Externa'>('Interna');
  const [editProducto, setEditProducto] = useState('');
  const [editPesoMascota, setEditPesoMascota] = useState('');
  const [editDosis, setEditDosis] = useState('');
  const [editProximaFecha, setEditProximaFecha] = useState('');
  const [editVeterinario, setEditVeterinario] = useState('');

  const handleStartEdit = (des: Desparasitacion) => {
    setEditingDesparasitacion(des);
    setEditFecha(des.fecha || '');
    setEditTipo(des.tipo || 'Interna');
    setEditProducto(des.producto || '');
    setEditPesoMascota(des.pesoMascota || '');
    setEditDosis(des.dosis || '');
    setEditProximaFecha(des.proximaFecha || '');
    setEditVeterinario(des.veterinario || '');
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
    if (!editingDesparasitacion || !editProducto) return;

    onUpdateDeworming(editingDesparasitacion.id, {
      fecha: ensureESDate(editFecha),
      tipo: editTipo,
      producto: editProducto,
      pesoMascota: editPesoMascota.includes('kg') ? editPesoMascota : `${editPesoMascota} kg`,
      dosis: editDosis,
      proximaFecha: editProximaFecha,
      veterinario: editVeterinario
    });
    setEditingDesparasitacion(null);
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
            <Bug className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Desparasitación</h1>
            <p className="text-white/70 text-[10px] uppercase font-bold tracking-wider mt-0.5">Control Antiparasitario</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">
        
        {/* Next Deworming Calendar */}
        <div className="space-y-3">
          <h3 className="text-gray-900 font-extrabold text-sm px-1">Próximos Controles</h3>
          {desparasitaciones && desparasitaciones.length > 0 ? (
            desparasitaciones.slice(0, 2).map((des) => (
              <div 
                key={des.id} 
                className="bg-amber-50/70 border border-amber-200 rounded-3xl p-4 flex items-start gap-3 shadow-sm relative group hover:shadow transition-all"
              >
                <div className="bg-amber-500 p-2 rounded-xl text-white shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-extrabold text-gray-900 text-xs">Control {des.tipo}</h4>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[8px] font-black px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded uppercase">
                        Sugerido
                      </span>
                      
                      {/* Action buttons on next controls */}
                      <div className="flex gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity ml-1">
                        <button 
                          onClick={() => handleStartEdit(des)}
                          className="p-1 hover:bg-white rounded text-gray-400 hover:text-[#00AEEF] transition-colors"
                          title="Editar desparasitación"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm('¿Estás seguro de que deseas eliminar este control?')) {
                              onDeleteDeworming(des.id);
                            }
                          }}
                          className="p-1 hover:bg-white rounded text-gray-400 hover:text-red-500 transition-colors"
                          title="Eliminar desparasitación"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-600 font-bold mt-1">
                    Fecha límite: <span className="font-black text-gray-800">{des.proximaFecha}</span>
                  </p>
                  <p className="text-[9px] text-gray-400 font-bold mt-0.5">Producto sugerido: {des.producto}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl p-6 text-center border border-dashed border-gray-200">
              <p className="text-gray-400 text-xs font-semibold">No hay próximos controles programados.</p>
            </div>
          )}
        </div>

        {/* History Log */}
        <div className="space-y-3">
          <h3 className="text-gray-900 font-extrabold text-sm px-1">Historial de Controles</h3>
          <div className="space-y-3.5">
            {desparasitaciones && desparasitaciones.length > 0 ? (
              desparasitaciones.map((des) => (
                <div 
                  key={des.id}
                  className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 relative overflow-hidden flex items-start gap-4 hover:border-amber-200 transition-colors group"
                >
                  <div className="absolute top-0 bottom-0 left-0 w-1 bg-amber-400" />
                  
                  <div className="bg-gray-50 p-2.5 rounded-2xl text-gray-500 shrink-0">
                    <Bug className="w-5 h-5 text-amber-500" />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-gray-900 text-sm leading-none">{des.producto}</h4>
                        <p className="text-[10px] text-gray-400 font-bold mt-1">{des.tipo} • {des.fecha}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-gray-100 text-gray-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase shrink-0">
                          Aplicado
                        </span>
                        
                        {/* Edit & Delete Action Buttons */}
                        <div className="flex gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleStartEdit(des)}
                            className="p-1 hover:bg-gray-50 rounded text-gray-400 hover:text-[#00AEEF] transition-colors"
                            title="Editar desparasitación"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm('¿Estás seguro de que deseas eliminar este registro?')) {
                                onDeleteDeworming(des.id);
                              }
                            }}
                            className="p-1 hover:bg-gray-50 rounded text-gray-400 hover:text-red-500 transition-colors"
                            title="Eliminar desparasitación"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-50 text-[10px] font-bold text-gray-500">
                      <div>
                        <span className="block text-[8px] text-gray-400 uppercase tracking-wider">Dosis</span>
                        <span className="text-gray-700">{des.dosis}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] text-gray-400 uppercase tracking-wider">Peso Mascota</span>
                        <span className="text-gray-700">{des.pesoMascota}</span>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-dashed border-gray-50 flex flex-col sm:flex-row sm:justify-between">
                        <div>
                          <span className="block text-[8px] text-gray-400 uppercase tracking-wider">Veterinario</span>
                          <span className="text-gray-750">{des.veterinario || 'Auto-administrado'}</span>
                        </div>
                        <div className="mt-1 sm:mt-0">
                          <span className="block text-[8px] text-gray-400 uppercase tracking-wider">Próximo Refuerzo</span>
                          <span className="text-[#00AEEF] flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#00AEEF]" />
                            {des.proximaFecha}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-3xl p-6 text-center border border-dashed border-gray-200">
                <p className="text-gray-400 text-xs font-semibold">No hay aplicaciones registradas.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Editing Dialog Modal Drawer */}
      {editingDesparasitacion && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center animate-in fade-in duration-200"
          onClick={() => setEditingDesparasitacion(null)}
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
              onClick={() => setEditingDesparasitacion(null)} 
              className="absolute right-4 top-4 p-1.5 bg-gray-50 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <h3 className="font-extrabold text-gray-900 text-base">Modificar Desparasitación</h3>
              
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Producto</label>
                <input 
                  type="text" 
                  required
                  value={editProducto}
                  onChange={e => setEditProducto(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fecha de Aplicación</label>
                  <input 
                    type="text" 
                    required
                    value={editFecha}
                    onChange={e => setEditFecha(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Próximo Control</label>
                  <input 
                    type="text" 
                    required
                    value={editProximaFecha}
                    onChange={e => setEditProximaFecha(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Dosis</label>
                  <input 
                    type="text" 
                    required
                    value={editDosis}
                    onChange={e => setEditDosis(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Peso de Mascota</label>
                  <input 
                    type="text" 
                    required
                    value={editPesoMascota}
                    onChange={e => setEditPesoMascota(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Veterinario</label>
                <input 
                  type="text" 
                  required
                  value={editVeterinario}
                  onChange={e => setEditVeterinario(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Tipo</label>
                <div className="flex gap-2">
                  {['Interna', 'Externa'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setEditTipo(t as any)}
                      className={`flex-1 py-2.5 text-xs font-black rounded-xl border transition-all ${
                        editTipo === t 
                          ? 'bg-amber-500 text-white border-amber-500 shadow-sm' 
                          : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {t}
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
