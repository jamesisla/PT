import { FileText, Activity, Clock, Calendar, Bell } from 'lucide-react';

interface AddMenuProps {
  onClose: () => void;
}

export default function AddMenu({ onClose }: AddMenuProps) {
  const options = [
    {
      id: 'journal',
      icon: FileText,
      title: 'Journal',
      subtitle: 'Registrar síntomas u observaciones',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      id: 'episodio',
      icon: Activity,
      title: 'Subir Episodio',
      subtitle: 'Registrar evento clínico',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      id: 'antecedente',
      icon: Clock,
      title: 'Agregar Antecedente',
      subtitle: 'Antecedentes médicos personales',
      color: 'bg-cyan-50 text-cyan-600'
    },
    {
      id: 'evento',
      icon: Calendar,
      title: 'Agregar Próximo Evento',
      subtitle: 'Citas, controles y procedimientos',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      id: 'alerta',
      icon: Bell,
      title: 'Agregar Alerta/Recordatorio',
      subtitle: 'Alertas y recordatorios médicos',
      color: 'bg-cyan-50 text-cyan-600'
    }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-t-3xl w-full max-w-md p-6 pb-8 animate-[slideUp_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-center mb-6">
          ¿Qué deseas registrar?
        </h2>
        <div className="space-y-3">
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                <div className={`p-3 rounded-xl ${option.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900">
                    {option.title}
                  </h3>
                  <p className="text-sm text-gray-500">{option.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}