import { useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';

interface LaboratorioProps {
  onBack: () => void;
}

export default function Laboratorio({ onBack }: LaboratorioProps) {
  const [filter, setFilter] = useState('todos');

  const pruebas = [
    {
      id: 1,
      fecha: '9/4/2026',
      tipo: 'Hemograma completo',
      resultado: 'Normal',
      resultadoColor: 'bg-green-100 text-green-700',
      valores: 'Glóbulos rojos: 4.5 M/μL',
      estado: 'Completado',
      estadoColor: 'bg-blue-100 text-blue-700'
    },
    {
      id: 2,
      fecha: '14/3/2026',
      tipo: 'Glucosa en sangre',
      resultado: 'Elevado',
      resultadoColor: 'bg-yellow-100 text-yellow-700',
      valores: '145 mg/dL',
      estado: 'Completado',
      estadoColor: 'bg-blue-100 text-blue-700'
    },
    {
      id: 3,
      fecha: '19/2/2026',
      tipo: 'Perfil lipídico',
      resultado: 'Normal',
      resultadoColor: 'bg-green-100 text-green-700',
      valores: 'Colesterol: 180 mg/dL',
      estado: 'Completado',
      estadoColor: 'bg-blue-100 text-blue-700'
    },
    {
      id: 4,
      fecha: '11/1/2026',
      tipo: 'Función renal',
      resultado: 'Normal',
      resultadoColor: 'bg-green-100 text-green-700',
      valores: 'Creatinina: 0.9 mg/dL',
      estado: 'Completado',
      estadoColor: 'bg-blue-100 text-blue-700'
    }
  ];

  return (
    <div className="flex-1 overflow-auto pb-20 bg-gray-50">
      <div className="bg-gradient-to-r from-[#27AE60] to-[#229954] p-4 pb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white mb-3 hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver al Menú</span>
        </button>
        <h1 className="text-white text-2xl font-bold">Laboratorio</h1>
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
              <option value="hemograma">Hemograma</option>
              <option value="glucosa">Glucosa</option>
              <option value="lipidos">Perfil lipídico</option>
              <option value="renal">Función renal</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-3">
          {pruebas.map((prueba) => (
            <div
              key={prueba.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${prueba.resultadoColor}`}>
                      {prueba.resultado}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${prueba.estadoColor}`}>
                      {prueba.estado}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900 mb-1 text-lg">
                    {prueba.tipo}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-gray-500 text-xs">Fecha</span>
                    <p className="text-gray-900 font-medium">{prueba.fecha}</p>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Valores</span>
                  <p className="text-gray-900 font-medium">{prueba.valores}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
