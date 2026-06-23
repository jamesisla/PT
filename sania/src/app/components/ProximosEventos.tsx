import { useState } from 'react';
import { Syringe, Droplet, Stethoscope, Calendar, Trash2 } from 'lucide-react';

export default function ProximosEventos() {
  const [filter, setFilter] = useState<'todos' | 'andres' | 'maty'>('todos');

  const events = [
    {
      id: 1,
      title: 'Vacunación — 1º Básico',
      location: 'Colegio Himalaya',
      date: '18-04-2026 a las 11:00',
      person: 'Maty',
      type: 'Alerta automática',
      note: '¡Vacuna atrasada! Agende hora de vacunación',
      icon: Syringe,
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      id: 2,
      title: 'Hemoglobina glicosilada',
      location: 'Laboratorio',
      date: '19-04-2026 a las 09:01',
      person: 'Andrés',
      type: 'Control de exámenes diabetes',
      icon: Droplet,
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      id: 3,
      title: 'Control Pediatra',
      location: 'Atención Ambulatoria - Clínica Roja',
      date: '19-05-2026 a las 10:00',
      person: 'Maty',
      type: 'Control de peso y talla',
      icon: Stethoscope,
      color: 'bg-indigo-100 text-indigo-600'
    }
  ];

  const filteredEvents = events.filter((event) => {
    if (filter === 'todos') return true;
    return event.person.toLowerCase() === filter;
  });

  return (
    <div className="flex-1 overflow-auto pb-20">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1">Próximos Eventos</h2>
          <p className="text-sm text-gray-500">
            Tus citas y eventos médicos programados
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('todos')}
            className={`px-4 py-2 rounded-full transition-all ${
              filter === 'todos'
                ? 'bg-[#00AEEF] text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('andres')}
            className={`px-4 py-2 rounded-full transition-all ${
              filter === 'andres'
                ? 'bg-[#00AEEF] text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Andrés
          </button>
          <button
            onClick={() => setFilter('maty')}
            className={`px-4 py-2 rounded-full transition-all ${
              filter === 'maty'
                ? 'bg-[#00AEEF] text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Maty
          </button>
        </div>

        <div className="space-y-4">
          {filteredEvents.map((event) => {
            const Icon = event.icon;
            return (
              <div
                key={event.id}
                className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${event.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {event.location}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                      <span>· {event.person}</span>
                    </div>
                    <p className="text-xs text-gray-500">{event.type}</p>
                    {event.note && (
                      <p className="text-xs text-gray-600 mt-2 italic">
                        {event.note}
                      </p>
                    )}
                  </div>
                  <button className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
