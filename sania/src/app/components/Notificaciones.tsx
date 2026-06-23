import { useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';

interface NotificacionesProps {
  onBack: () => void;
}

export default function Notificaciones({ onBack }: NotificacionesProps) {
  const [filter, setFilter] = useState('criticas');

  const alerts = [
    {
      id: 1,
      type: 'Crítica',
      automatic: true,
      title: 'Control niño - 6 meses',
      subtitle: 'Control de Pediatria - Maty',
      action: 'Agendar evaluación médica',
      fecha: '30/4/2026',
      emisor: 'Sistema'
    },
    {
      id: 2,
      type: 'Crítica',
      automatic: true,
      title: 'Control Diabetes',
      subtitle: 'Hemoglobina glicosilada - Andrés',
      action: 'Agendar evaluación médica',
      fecha: '29/4/2026',
      emisor: 'Sistema'
    },
    {
      id: 3,
      type: 'Recordatorio',
      automatic: false,
      title: 'Exámenes muy importantes',
      subtitle: 'Recordatorio importante de salud',
      action: 'Revisar detalles',
      fecha: '28/4/2026',
      emisor: 'Dr. González'
    }
  ];

  return (
    <div className="flex-1 overflow-auto pb-20 bg-gray-50">
      <div className="bg-gradient-to-r from-[#50C878] to-[#2E8B57] p-4 pb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white mb-3 hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver al Menú</span>
        </button>
        <h1 className="text-white text-2xl font-bold">Notificaciones</h1>
      </div>

      <div className="p-4">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-gray-600">Filtrar por:</span>
          <div className="relative flex-1">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm appearance-none cursor-pointer"
            >
              <option value="criticas">Críticas</option>
              <option value="todas">Todas</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      alert.type === 'Crítica' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {alert.type}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      alert.automatic ? 'bg-gray-100 text-gray-600' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {alert.automatic ? 'Automática' : 'Manual'}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900 mb-1">
                    {alert.title}
                  </p>
                  <p className="text-sm text-gray-600">{alert.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm mb-3">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-gray-500 text-xs">Fecha</span>
                    <p className="text-gray-900 font-medium">{alert.fecha}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Emisor</span>
                    <p className="text-gray-900 font-medium">{alert.emisor}</p>
                  </div>
                </div>
              </div>

              <button className="w-full bg-[#50C878] text-white py-3 rounded-xl hover:bg-[#45b66b] transition-colors font-semibold text-sm">
                {alert.action}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
