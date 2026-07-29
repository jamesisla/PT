import { useState } from 'react';
import { ArrowLeft, Image as ImageIcon, Calendar, User, FileText, ChevronDown, Pencil, Trash2, X } from 'lucide-react';
import { ImagenMedica } from '../data/petData';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ImagenesMedicasProps {
  imagenes: ImagenMedica[];
  onBack: () => void;
  onUpdateMedicalImage: (imageId: number, record: any) => void;
  onDeleteMedicalImage: (imageId: number) => void;
}

export default function ImagenesMedicas({ imagenes, onBack, onUpdateMedicalImage, onDeleteMedicalImage }: ImagenesMedicasProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Edit form states
  const [editingImage, setEditingImage] = useState<ImagenMedica | null>(null);
  const [editFecha, setEditFecha] = useState('');
  const [editTipo, setEditTipo] = useState<'Radiografía' | 'Ecografía' | 'Endoscopía'>('Radiografía');
  const [editNombre, setEditNombre] = useState('');
  const [editIndicacion, setEditIndicacion] = useState('');
  const [editInforme, setEditInforme] = useState('');
  const [editDoctor, setEditDoctor] = useState('');
  const [editUrl, setEditUrl] = useState('');

  const handleStartEdit = (img: ImagenMedica) => {
    setEditingImage(img);
    setEditFecha(img.fecha || '');
    setEditTipo(img.tipo || 'Radiografía');
    setEditNombre(img.nombre || '');
    setEditIndicacion(img.indicacion || '');
    setEditInforme(img.informe || '');
    setEditDoctor(img.doctor || '');
    setEditUrl(img.imagenUrl || '');
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
    if (!editingImage || !editNombre) return;

    onUpdateMedicalImage(editingImage.id, {
      fecha: ensureESDate(editFecha),
      tipo: editTipo,
      nombre: editNombre,
      indicacion: editIndicacion,
      informe: editInforme,
      doctor: editDoctor,
      imagenUrl: editUrl
    });
    setEditingImage(null);
  };

  const toggleExpand = (id: number) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
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
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Imágenes Diagnósticas</h1>
            <p className="text-white/70 text-[10px] uppercase font-bold tracking-wider mt-0.5">Radiografías y Ecografías</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {imagenes && imagenes.length > 0 ? (
          imagenes.map((img) => {
            const isExpanded = expandedId === img.id;
            return (
              <div 
                key={img.id}
                className={`bg-white rounded-3xl overflow-hidden border transition-all duration-300 ${
                  isExpanded ? 'shadow-md border-[#00AEEF]/20' : 'shadow-sm border-gray-100'
                }`}
              >
                {/* Main Card Item */}
                <div 
                  onClick={() => toggleExpand(img.id)}
                  className="p-5 cursor-pointer hover:bg-gray-50/50 transition-colors flex justify-between items-center gap-3"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-50 p-2.5 rounded-2xl text-purple-600 shrink-0">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="bg-purple-50 text-purple-700 text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                        {img.tipo}
                      </span>
                      <h4 className="font-extrabold text-gray-900 text-sm leading-tight mt-1.5 pr-2">{img.nombre}</h4>
                      <p className="text-[10px] text-gray-400 font-bold mt-1 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {img.fecha}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Action buttons */}
                    <div className="flex gap-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEdit(img);
                        }}
                        className="p-1 hover:bg-gray-50 rounded text-gray-400 hover:text-[#00AEEF] transition-colors"
                        title="Editar imagen"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('¿Estás seguro de que deseas eliminar esta imagen médica?')) {
                            onDeleteMedicalImage(img.id);
                          }
                        }}
                        className="p-1 hover:bg-gray-50 rounded text-gray-400 hover:text-red-500 transition-colors"
                        title="Eliminar imagen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    
                    <div className={`p-1.5 rounded-full transition-transform duration-300 ${
                      isExpanded ? 'rotate-180 bg-purple-50 text-purple-600' : 'bg-gray-50 text-gray-400'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Expanded Scan Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1.5 border-t border-gray-50 space-y-4 text-xs text-gray-600 animate-in fade-in slide-in-from-top-2 duration-200">
                    
                    {/* Diagnostic image view */}
                    <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-inner bg-gray-950 aspect-video relative flex items-center justify-center">
                      <ImageWithFallback 
                        src={img.imagenUrl} 
                        alt={img.nombre}
                        className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity"
                      />
                      <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                        Vista Previa
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[11px] font-bold">
                      <div className="bg-gray-50 p-2.5 rounded-2xl border border-gray-100">
                        <span className="block text-[8px] text-gray-400 uppercase tracking-wider mb-0.5">Indicado por</span>
                        <span className="text-gray-800 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          {img.doctor}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-2.5 rounded-2xl border border-gray-100">
                        <span className="block text-[8px] text-gray-400 uppercase tracking-wider mb-0.5">Fecha Reporte</span>
                        <span className="text-gray-800 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {img.fecha}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 space-y-1">
                      <span className="block text-[8px] text-gray-400 uppercase tracking-wider font-black">Indicación Clínica</span>
                      <p className="text-gray-700 font-semibold italic text-[11px] leading-relaxed">{img.indicacion}</p>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] text-gray-500 uppercase font-black tracking-wider flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-gray-400" />
                        Informe Radiológico
                      </span>
                      <p className="text-gray-600 font-semibold bg-gray-50/50 p-4 rounded-2xl border border-gray-100 text-xs leading-relaxed">
                        {img.informe}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-gray-200">
            <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 font-extrabold text-sm">Sin imágenes cargadas</p>
            <p className="text-xs text-gray-400 mt-1">Las radiografías o ecografías aparecerán aquí.</p>
          </div>
        )}
      </div>

      {/* Editing Dialog Modal Drawer */}
      {editingImage && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center animate-in fade-in duration-200"
          onClick={() => setEditingImage(null)}
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
              onClick={() => setEditingImage(null)} 
              className="absolute right-4 top-4 p-1.5 bg-gray-50 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <h3 className="font-extrabold text-gray-900 text-base">Modificar Imagen Médica</h3>
              
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Nombre del Examen / Región</label>
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
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fecha del Reporte</label>
                  <input 
                    type="text" 
                    required
                    value={editFecha}
                    onChange={e => setEditFecha(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Médico Radiólogo</label>
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
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">URL Imagen</label>
                <input 
                  type="text" 
                  required
                  value={editUrl}
                  onChange={e => setEditUrl(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Tipo de Estudio</label>
                <div className="flex gap-2">
                  {['Radiografía', 'Ecografía', 'Endoscopía'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setEditTipo(t as any)}
                      className={`flex-1 py-2 text-xs font-black rounded-xl border transition-all ${
                        editTipo === t 
                          ? 'bg-[#00AEEF] text-white border-[#00AEEF] shadow-sm' 
                          : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Indicación Clínica</label>
                <input 
                  type="text" 
                  required
                  value={editIndicacion}
                  onChange={e => setEditIndicacion(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Informe Diagnóstico</label>
                <textarea 
                  required
                  value={editInforme}
                  onChange={e => setEditInforme(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF] h-16 resize-none"
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
