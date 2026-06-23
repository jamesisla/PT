import { useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';

interface ProcedimientosProps {
  onBack: () => void;
}

export default function Procedimientos({ onBack }: ProcedimientosProps) {
  const [filter, setFilter] = useState('programados');

  const items = [
    {
      id: 1,
      titulo: 'Electrocardiograma (ECG)',
      fecha: '02/05/2026',
      hora: '09:30 AM',
      lugar: 'Box 4 - Cardiología',
      estado: 'Programado',
      estadoColor: 'bg-orange-100 text-orange-700',
      urgencia: 'Normal',
      urgenciaColor: 'bg-blue-100 text-blue-700'
    },
    {
      id: 2,
      titulo: 'Test de Esfuerzo',
      fecha: '05/05/2026',
      hora: '11:00 AM',
      lugar: 'Pabellón A',
      estado: 'Pendiente autorizar',
      estadoColor: 'bg-yellow-100 text-yellow-700',
      urgencia: 'Prioritario',
      urgenciaColor: 'bg-red-100 text-red-700'
    }
  ];

  return (
    <div className="flex-1 overflow-auto pb-20 bg-gray-50">
      <div className="bg-gradient-to-r from-[#E67E22] to-[#D35400] p-4 pb-6 shadow-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white mb-3 hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver al Menú</span>
        </button>
        <h1 className="text-white text-2xl font-bold">Procedimientos</h1>
      </div>

      <div className="p-4">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-gray-600">Estado:</span>
          <div className="relative flex-1">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm appearance-none cursor-pointer"
            >
              <option value="programados">Programados</option>
              <option value="pendientes">Pendientes</option>
              <option value="completados">Completados</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${item.estadoColor}`}>
                      {item.estado}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${item.urgenciaColor}`}>
                      {item.urgencia}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base leading-tight mb-1">
                    {item.titulo}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-3 border-t border-gray-50 pt-3">
                <div>
                  <span className="text-gray-500 text-[10px] uppercase font-bold block">Fecha y Hora</span>
                  <p className="text-gray-900 font-semibold text-xs">{item.fecha} • {item.hora}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px] uppercase font-bold block">Ubicación</span>
                  <p className="text-gray-900 font-semibold text-xs">{item.lugar}</p>
                </div>
              </div>
              
              <button className="w-full mt-4 bg-orange-500 text-white py-2.5 rounded-xl font-bold text-xs hover:bg-orange-600 transition-colors">
                VER PREPARACIÓN
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
