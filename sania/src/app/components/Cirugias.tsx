import { useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';

interface CirugiasProps {
  onBack: () => void;
}

export default function Cirugias({ onBack }: CirugiasProps) {
  const [filter, setFilter] = useState('todos');

  const cirugias = [
    {
      id: 1,
      fecha: '14/11/2025',
      tipo: 'Apendicectomía',
      cirujano: 'Dr. Ramírez',
      ubicacion: 'Hospital Central',
      estado: 'Completada',
      estadoColor: 'bg-green-100 text-green-700'
    },
    {
      id: 2,
      fecha: '19/6/2024',
      tipo: 'Cirugía de rodilla',
      cirujano: 'Dra. Torres',
      ubicacion: 'Clínica San José',
      estado: 'Completada',
      estadoColor: 'bg-green-100 text-green-700'
    }
  ];

  return (
    <div className="flex-1 overflow-auto pb-20 bg-gray-50">
      <div className="bg-gradient-to-r from-[#9B59B6] to-[#8E44AD] p-4 pb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white mb-3 hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver al Menú</span>
        </button>
        <h1 className="text-white text-2xl font-bold">Cirugías</h1>
      </div>

      <div className="p-4">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-gray-600">Filtrar por tipo:</span>
          <div className="relative flex-1">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm appearance-none cursor-pointer"
            >
              <option value="todos">Todos</option>
              <option value="apendicectomia">Apendicectomía</option>
              <option value="rodilla">Cirugía de rodilla</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-3">
          {cirugias.map((cirugia) => (
            <div
              key={cirugia.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cirugia.estadoColor}`}>
                      {cirugia.estado}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900 mb-1 text-lg">
                    {cirugia.tipo}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-gray-500 text-xs">Fecha</span>
                    <p className="text-gray-900 font-medium">{cirugia.fecha}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Cirujano</span>
                    <p className="text-gray-900 font-medium">{cirugia.cirujano}</p>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Ubicación</span>
                  <p className="text-gray-900 font-medium">{cirugia.ubicacion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
