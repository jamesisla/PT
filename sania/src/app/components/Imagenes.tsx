import { useState } from 'react';
import { ArrowLeft, ChevronDown, Image as ImageIcon, Maximize2 } from 'lucide-react';

interface ImagenesProps {
  onBack: () => void;
}

export default function Imagenes({ onBack }: ImagenesProps) {
  const [filter, setFilter] = useState('recientes');

  const imagenes = [
    {
      id: 1,
      fecha: '25/4/2026',
      tipo: 'Radiografía',
      region: 'Tórax AP/Lat',
      doctor: 'Dr. Silva',
      status: 'Disponible',
      thumb: 'bg-slate-200'
    },
    {
      id: 2,
      fecha: '12/4/2026',
      tipo: 'Resonancia',
      region: 'Cerebro con Contraste',
      doctor: 'Dra. Luna',
      status: 'Disponible',
      thumb: 'bg-slate-300'
    },
    {
      id: 3,
      fecha: '05/4/2026',
      tipo: 'Ecografía',
      region: 'Abdominal Total',
      doctor: 'Dr. Venegas',
      status: 'Archivado',
      thumb: 'bg-slate-200'
    }
  ];

  return (
    <div className="flex-1 overflow-auto pb-20 bg-gray-50">
      <div className="bg-gradient-to-r from-[#5B6FDB] to-[#4052B5] p-4 pb-6 shadow-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white mb-3 hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver al Menú</span>
        </button>
        <h1 className="text-white text-2xl font-bold">Imágenes Médicas</h1>
      </div>

      <div className="p-4">
        <div className="mb-6 flex items-center gap-2">
          <span className="text-sm text-gray-600">Ordenar por:</span>
          <div className="relative flex-1">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm appearance-none"
            >
              <option value="recientes">Más recientes</option>
              <option value="radiografias">Radiografías</option>
              <option value="resonancias">Resonancias</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {imagenes.map((img) => (
            <div key={img.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex p-3 gap-4">
              <div className={`w-24 h-24 ${img.thumb} rounded-2xl flex items-center justify-center relative group cursor-pointer`}>
                <ImageIcon className="w-8 h-8 text-slate-400" />
                <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                  <Maximize2 className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex-1 py-1">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold text-[#5B6FDB] uppercase tracking-wider">{img.tipo}</span>
                  <span className="text-[10px] text-gray-400">{img.fecha}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{img.region}</h3>
                <p className="text-xs text-gray-500 mb-2">Solicita: {img.doctor}</p>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] px-2 py-0.5 bg-green-50 text-green-600 rounded-md font-bold">{img.status}</span>
                  <button className="text-[11px] font-bold text-[#5B6FDB] hover:underline">VER INFORME</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
