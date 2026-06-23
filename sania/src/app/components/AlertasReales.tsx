import { useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';

interface AlertasRealesProps {
  onBack: () => void;
}

export default function AlertasReales({ onBack }: AlertasRealesProps) {
  const [filter, setFilter] = useState('criticas');

  const alerts = [
    {
      id: 1,
      type: 'Emergencia',
      typeColor: 'bg-red-100 text-red-700',
      title: 'Alergia a la Penicilina',
      details: 'Paciente con antecedentes de choque anafiláctico a la penicilina.',
      fecha: '30/4/2026',
      emisor: 'Historia Clínica'
    },
    {
      id: 2,
      type: 'Emegencia',
      typeColor: 'bg-red-100 text-red-700',
      title: 'Hipertensión Severa DETECTADA',
      details: 'Presión arterial 160/100 registrada por sensor.',
      fecha: '30/4/2026',
      emisor: 'Dispositivo Smart'
    }
  ];

  return (
    <div className="flex-1 overflow-auto pb-20 bg-gray-50">
      <div className="bg-gradient-to-r from-[#FF6B6B] to-[#D4183D] p-4 pb-6 shadow-lg">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white mb-3 hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver al Menú</span>
        </button>
        <div className="flex items-center gap-3">
          <h1 className="text-white text-2xl font-bold">Alertas Críticas</h1>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-6 flex items-center gap-2">
          <span className="text-sm text-gray-600">Filtrar nivel:</span>
          <div className="relative flex-1">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm appearance-none cursor-pointer"
            >
              <option value="criticas">Críticas (2)</option>
              <option value="moderadas">Moderadas (0)</option>
              <option value="todas">Ver todas</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white rounded-3xl p-5 shadow-sm border border-red-100 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
              <div className="flex items-center justify-between mb-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${alert.typeColor}`}>
                  {alert.type}
                </span>
                <span className="text-xs text-gray-400 font-medium">{alert.fecha}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{alert.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{alert.details}</p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-50 pt-3">
                <div>
                  <span className="block text-[10px] text-gray-400">EMISOR</span>
                  <span className="font-bold text-gray-700">{alert.emisor}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
