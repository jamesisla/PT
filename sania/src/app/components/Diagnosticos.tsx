import { useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';

interface DiagnosticosProps {
  onBack: () => void;
}

export default function Diagnosticos({ onBack }: DiagnosticosProps) {
  const [filter, setFilter] = useState('todos');

  const diagnosticos = [
    {
      id: 1,
      fecha: '14/4/2026',
      tipo: 'Hipertensión',
      tipoColor: 'bg-blue-100 text-blue-700',
      descripcion: 'Hipertensión arterial moderada',
      doctor: 'Dr. Pérez',
      estado: 'Activo',
      estadoColor: 'bg-green-100 text-green-700'
    },
    {
      id: 2,
      fecha: '19/3/2026',
      tipo: 'Diabetes',
      tipoColor: 'bg-purple-100 text-purple-700',
      descripcion: 'Diabetes tipo 2 controlada',
      doctor: 'Dra. Martínez',
      estado: 'En tratamiento',
      estadoColor: 'bg-yellow-100 text-yellow-700'
    },
    {
      id: 3,
      fecha: '9/2/2026',
      tipo: 'Alergia',
      tipoColor: 'bg-red-100 text-red-700',
      descripcion: 'Alergia a penicilina',
      doctor: 'Dr. González',
      estado: 'Activo',
      estadoColor: 'bg-green-100 text-green-700'
    },
    {
      id: 4,
      fecha: '4/1/2026',
      tipo: 'Hipertensión',
      tipoColor: 'bg-blue-100 text-blue-700',
      descripcion: 'Control de presión arterial',
      doctor: 'Dr. Pérez',
      estado: 'Controlado',
      estadoColor: 'bg-blue-100 text-blue-700'
    }
  ];

  return (
    <div className="flex-1 overflow-auto pb-20 bg-gray-50">
      <div className="bg-gradient-to-r from-[#00AEEF] to-[#1A5AD7] p-4 pb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white mb-3 hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver al Menú</span>
        </button>
        <h1 className="text-white text-2xl font-bold">Diagnósticos</h1>
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
              <option value="hipertension">Hipertensión</option>
              <option value="diabetes">Diabetes</option>
              <option value="alergia">Alergia</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-3">
          {diagnosticos.map((diagnostico) => (
            <div
              key={diagnostico.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${diagnostico.tipoColor}`}>
                      {diagnostico.tipo}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${diagnostico.estadoColor}`}>
                      {diagnostico.estado}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900 mb-1">
                    {diagnostico.descripcion}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-gray-500 text-xs">Fecha</span>
                    <p className="text-gray-900 font-medium">{diagnostico.fecha}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Doctor</span>
                    <p className="text-gray-900 font-medium">{diagnostico.doctor}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
