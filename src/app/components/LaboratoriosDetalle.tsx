import { useState } from 'react';
import { ArrowLeft, ChevronDown, FlaskConical, Building2, Phone, Globe, User, AlertCircle, CheckCircle2, Pencil, Trash2, X } from 'lucide-react';
import { Pet, Laboratorio, LabParametro } from '../data/petData';

interface LaboratoriosDetalleProps {
  pet: Pet;
  labId: string;
  onBack: () => void;
  onUpdateLaboratory: (labId: string, record: any) => void;
  onDeleteLaboratory: (labId: string) => void;
}

export default function LaboratoriosDetalle({ pet, labId, onBack, onUpdateLaboratory, onDeleteLaboratory }: LaboratoriosDetalleProps) {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  // Find the selected laboratory record in pet data
  const data = pet.laboratorios.find((l) => l.id === labId);

  // Edit form states
  const [editExamen, setEditExamen] = useState('');
  const [editLaboratorio, setEditLaboratorio] = useState('');
  const [editTelefono, setEditTelefono] = useState('');
  const [editSitioWeb, setEditSitioWeb] = useState('');
  const [editDireccion, setEditDireccion] = useState('');
  const [editConvenio, setEditConvenio] = useState('');
  const [editDirectorTecnico, setEditDirectorTecnico] = useState('');
  const [editNotasGenerales, setEditNotasGenerales] = useState('');
  const [editResultados, setEditResultados] = useState<LabParametro[]>([]);

  // Local parameter form states
  const [paramNombre, setParamNombre] = useState('');
  const [paramResultado, setParamResultado] = useState('');
  const [paramUnidad, setParamUnidad] = useState('');
  const [paramRango, setParamRango] = useState('');
  const [paramEstado, setParamEstado] = useState<'Normal' | 'Alto' | 'Bajo'>('Normal');

  if (!data) {
    return (
      <div className="flex-1 p-6 text-center text-gray-500">
        No se encontró el examen seleccionado.
      </div>
    );
  }

  const handleStartEdit = () => {
    setEditExamen(data.examen || '');
    setEditLaboratorio(data.laboratorio || '');
    setEditTelefono(data.telefono || '');
    setEditSitioWeb(data.sitioWeb || '');
    setEditDireccion(data.direccion || '');
    setEditConvenio(data.convenio || '');
    setEditDirectorTecnico(data.directorTecnico || '');
    setEditNotasGenerales(data.notasGenerales || '');
    setEditResultados(data.resultados || []);
    setIsEditing(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editExamen || !editLaboratorio) return;

    onUpdateLaboratory(data.id, {
      fecha: data.fecha,
      examen: editExamen,
      laboratorio: editLaboratorio,
      telefono: editTelefono,
      sitioWeb: editSitioWeb,
      direccion: editDireccion,
      convenio: editConvenio,
      directorTecnico: editDirectorTecnico,
      resultados: editResultados,
      notasGenerales: editNotasGenerales
    });
    setIsEditing(false);
  };

  const toggleItem = (index: number) => {
    if (expandedItems.includes(index)) {
      setExpandedItems(expandedItems.filter((i) => i !== index));
    } else {
      setExpandedItems([...expandedItems, index]);
    }
  };

  const handleDelete = () => {
    if (confirm('¿Estás seguro de que deseas eliminar este examen de laboratorio?')) {
      onDeleteLaboratory(data.id);
      onBack();
    }
  };

  return (
    <div className="flex-1 overflow-auto pb-24 bg-gray-50/50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#27AE60] to-[#1E8449] p-6 text-white shadow-md sticky top-0 z-10 rounded-b-3xl">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors group"
          >
            <div className="bg-white/20 p-1.5 rounded-lg group-hover:bg-white/30 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-semibold text-xs">Volver al Historial</span>
          </button>

          {/* Edit/Delete controls */}
          <div className="flex gap-2">
            <button 
              onClick={handleStartEdit}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-xl text-white transition-colors"
              title="Editar examen"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button 
              onClick={handleDelete}
              className="bg-white/20 hover:bg-red-600/80 p-2 rounded-xl text-white transition-colors"
              title="Eliminar examen"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight leading-tight">{data.examen}</h1>
            <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mt-0.5">Orden #{data.id}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Lab info */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-green-50 p-2.5 rounded-2xl">
              <Building2 className="w-5 h-5 text-[#27AE60]" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base leading-tight">{data.laboratorio}</h2>
              <p className="text-gray-500 text-[11px] mt-1">{data.direccion}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-50 text-[11px] font-semibold text-gray-600">
            <a href={`tel:${data.telefono}`} className="flex items-center gap-2 hover:text-[#27AE60]">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              {data.telefono}
            </a>
            <a href={`https://${data.sitioWeb}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#27AE60] justify-end text-right">
              <Globe className="w-3.5 h-3.5 text-gray-400" />
              {data.sitioWeb}
            </a>
          </div>
        </div>

        {/* Patient (Pet) info */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 shadow-sm border border-gray-100">
          <div className="grid grid-cols-2 gap-y-3 text-xs">
            <div className="col-span-2 flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-[#00AEEF]" />
              <span className="text-base font-black text-gray-800">{pet.nombre} ({pet.especie})</span>
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] text-gray-400 uppercase font-black tracking-wider">Raza / Sexo</p>
              <p className="text-xs text-gray-700 font-bold">{pet.raza} / {pet.sexo.split(' ')[0]}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] text-gray-400 uppercase font-black tracking-wider">Edad / Peso</p>
              <p className="text-xs text-gray-700 font-bold">{pet.edad} / {pet.pesoActual}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] text-gray-400 uppercase font-black tracking-wider">Fecha Examen</p>
              <p className="text-xs text-gray-700 font-bold">{data.fecha}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] text-gray-400 uppercase font-black tracking-wider">Convenio</p>
              <p className="text-xs text-gray-700 font-bold truncate pr-2">{data.convenio}</p>
            </div>
          </div>
        </div>

        {/* Results list */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-gray-900 font-extrabold text-base">Resultados</h3>
            <span className="bg-gray-100 text-gray-500 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
              {data.resultados.length} Parámetros
            </span>
          </div>

          <div className="space-y-3">
            {data.resultados.map((item, index) => {
              const isExpanded = expandedItems.includes(index);
              const isAlert = item.estado !== 'Normal';

              return (
                <div
                  key={index}
                  className={`bg-white rounded-3xl overflow-hidden border transition-all duration-300 ${
                    isExpanded ? 'shadow-md border-green-200' : 'shadow-sm border-gray-100'
                  }`}
                >
                  <div
                    onClick={() => toggleItem(index)}
                    className="p-4 cursor-pointer hover:bg-gray-50/50 transition-colors flex items-center justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-1.5 py-0.5 rounded-md">
                          Suero/Sangre
                        </span>
                        {isAlert && (
                          <span className="bg-red-50 text-red-600 text-[8px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 uppercase tracking-wide">
                            <AlertCircle className="w-2.5 h-2.5" />
                            {item.estado}
                          </span>
                        )}
                      </div>
                      <h4 className="font-extrabold text-gray-800 text-sm truncate leading-snug">{item.nombre}</h4>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="flex items-baseline gap-0.5">
                          <span className={`text-lg font-black ${isAlert ? 'text-red-500' : 'text-[#27AE60]'}`}>
                            {item.resultado}
                          </span>
                          <span className="text-[9px] font-bold text-gray-400">{item.unidad}</span>
                        </div>
                      </div>
                      <div className={`p-1.5 rounded-full transition-transform duration-300 ${
                        isExpanded ? 'rotate-180 bg-green-50 text-[#27AE60]' : 'bg-gray-50 text-gray-400'
                      }`}>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Expanded result values */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1.5 border-t border-gray-50 space-y-3.5 text-xs text-gray-600">
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="bg-gray-50/50 p-2.5 rounded-2xl border border-gray-100">
                          <p className="text-[8px] text-gray-400 uppercase font-black tracking-wider mb-0.5">Rango de Referencia ({pet.especie}s)</p>
                          <p className="text-xs text-gray-800 font-extrabold">{item.rangoReferencia} {item.unidad}</p>
                        </div>
                        <div className="bg-gray-50/50 p-2.5 rounded-2xl border border-gray-100">
                          <p className="text-[8px] text-gray-400 uppercase font-black tracking-wider mb-0.5">Estado</p>
                          <p className={`text-xs font-black ${isAlert ? 'text-red-500' : 'text-[#27AE60]'}`}>
                            {item.estado === 'Normal' ? 'Normal (Saludable)' : `${item.estado} para la especie`}
                          </p>
                        </div>
                      </div>

                      {isAlert && (
                        <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-100/50 flex items-start gap-2">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                          <p className="text-[10px] text-amber-700 leading-normal italic font-semibold">
                            Observación: Este parámetro se encuentra fuera del rango de normalidad veterinario. Consultar con su médico de cabecera.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Global notes */}
        {data.notasGenerales && (
          <div className="bg-gray-100/50 p-4 rounded-3xl border border-dashed border-gray-200">
            <div className="flex items-center gap-2 mb-2 text-[10px] text-gray-400 uppercase font-black tracking-wider">
              <AlertCircle className="w-3.5 h-3.5 text-gray-400" />
              <span>Notas de Laboratorio</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed italic">{data.notasGenerales}</p>
          </div>
        )}

        {/* Doctor signature details */}
        <div className="text-center pt-4 pb-8 border-t border-gray-100">
          <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black mb-1">Director Técnico Veterinario</p>
          <p className="text-xs text-gray-600 font-extrabold">{data.directorTecnico}</p>
          <div className="flex justify-center items-center gap-1.5 text-[9px] text-emerald-600 font-bold mt-2">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Firma Electrónica Autorizada</span>
          </div>
        </div>
      </div>

      {/* Editing Dialog Modal Drawer */}
      {isEditing && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center animate-in fade-in duration-200"
          onClick={() => setIsEditing(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          
          {/* Modal content */}
          <div 
            className="relative bg-white rounded-t-[32px] w-full max-w-md p-6 pb-9 border-t border-gray-100 shadow-2xl z-50 animate-in slide-in-from-bottom duration-250 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 -mt-2" />
            <button 
              onClick={() => setIsEditing(false)} 
              className="absolute right-4 top-4 p-1.5 bg-gray-50 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <h3 className="font-extrabold text-gray-900 text-base">Modificar Examen de Laboratorio</h3>
              
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Nombre del Examen</label>
                <input 
                  type="text" 
                  required
                  value={editExamen}
                  onChange={e => setEditExamen(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Laboratorio</label>
                  <input 
                    type="text" 
                    required
                    value={editLaboratorio}
                    onChange={e => setEditLaboratorio(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Director Técnico</label>
                  <input 
                    type="text" 
                    required
                    value={editDirectorTecnico}
                    onChange={e => setEditDirectorTecnico(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Convenio / Seguro</label>
                  <input 
                    type="text" 
                    required
                    value={editConvenio}
                    onChange={e => setEditConvenio(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Teléfono Lab</label>
                  <input 
                    type="text" 
                    required
                    value={editTelefono}
                    onChange={e => setEditTelefono(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Sitio Web</label>
                  <input 
                    type="text" 
                    required
                    value={editSitioWeb}
                    onChange={e => setEditSitioWeb(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Dirección</label>
                  <input 
                    type="text" 
                    required
                    value={editDireccion}
                    onChange={e => setEditDireccion(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Notas / Observaciones</label>
                <textarea 
                  value={editNotasGenerales}
                  onChange={e => setEditNotasGenerales(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF] h-16 resize-none"
                />
              </div>

              {/* Dynamic parameters for result parameters */}
              <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-2xl space-y-3">
                <h4 className="text-[11px] font-black text-rose-800 uppercase tracking-wider">Modificar Parámetros</h4>
                
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="Nombre" 
                    value={paramNombre}
                    onChange={e => setParamNombre(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-[11px] font-bold"
                  />
                  <input 
                    type="text" 
                    placeholder="Resultado" 
                    value={paramResultado}
                    onChange={e => setParamResultado(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-[11px] font-bold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="Unidad" 
                    value={paramUnidad}
                    onChange={e => setParamUnidad(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-[11px] font-bold"
                  />
                  <input 
                    type="text" 
                    placeholder="Referencia" 
                    value={paramRango}
                    onChange={e => setParamRango(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-[11px] font-bold"
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-[9px] font-black text-gray-500 uppercase">Estado:</span>
                  {['Normal', 'Alto', 'Bajo'].map(est => (
                    <button
                      key={est}
                      type="button"
                      onClick={() => setParamEstado(est as any)}
                      className={`px-3 py-1 text-[10px] font-black rounded-lg border transition-all ${
                        paramEstado === est 
                          ? 'bg-rose-500 text-white border-rose-500' 
                          : 'bg-white text-gray-500 border-gray-200'
                      }`}
                    >
                      {est}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      if (!paramNombre || !paramResultado) return;
                      setEditResultados([
                        ...editResultados,
                        {
                          nombre: paramNombre,
                          resultado: paramResultado,
                          unidad: paramUnidad || '',
                          rangoReferencia: paramRango || '',
                          estado: paramEstado
                        }
                      ]);
                      setParamNombre('');
                      setParamResultado('');
                      setParamUnidad('');
                      setParamRango('');
                    }}
                    className="ml-auto bg-rose-600 text-white px-3.5 py-1.5 text-[10px] font-black uppercase rounded-lg"
                  >
                    + Add
                  </button>
                </div>

                {editResultados.length > 0 && (
                  <div className="space-y-1.5 pt-1 border-t border-rose-100 max-h-24 overflow-y-auto">
                    {editResultados.map((res, i) => (
                      <div key={i} className="flex justify-between items-center text-[10px] bg-white px-2 py-1 rounded border border-gray-100">
                        <span className="font-extrabold text-gray-800">{res.nombre} ({res.resultado} {res.unidad})</span>
                        <button 
                          type="button" 
                          onClick={() => setEditResultados(editResultados.filter((_, idx) => idx !== i))}
                          className="text-red-500 font-extrabold ml-2"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
