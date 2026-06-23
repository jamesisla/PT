import { Stethoscope, AlertTriangle, Scissors, FlaskConical, Image, Clipboard } from 'lucide-react';

interface DashboardProps {
  onNavigate: (screen: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const menuItems = [
    {
      id: 'diagnosticos',
      icon: Stethoscope,
      title: 'Diagnósticos',
      subtitle: 'Ver registros y datos',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-[#4A90E2]',
      iconColor: 'text-white'
    },
    {
      id: 'notificaciones',
      icon: AlertTriangle,
      title: 'Notificaciones',
      subtitle: 'Ver registros y datos',
      bgColor: 'bg-emerald-50',
      iconBg: 'bg-[#50C878]',
      iconColor: 'text-white'
    },
    {
      id: 'laboratorioList',
      icon: FlaskConical,
      title: 'Laboratorio',
      subtitle: 'Historial de exámenes',
      bgColor: 'bg-green-50',
      iconBg: 'bg-[#27AE60]',
      iconColor: 'text-white'
    },
    {
      id: 'laboratorio',
      icon: FlaskConical,
      title: 'Lab (V-Antigua)',
      subtitle: 'Vista previa',
      bgColor: 'bg-gray-50',
      iconBg: 'bg-gray-400',
      iconColor: 'text-white'
    },
    {
      id: 'imagenes',
      icon: Image,
      title: 'Imágenes',
      subtitle: 'Ver registros y datos',
      bgColor: 'bg-indigo-50',
      iconBg: 'bg-[#5B6FDB]',
      iconColor: 'text-white'
    },
    {
      id: 'cirugias',
      icon: Scissors,
      title: 'Cirugías',
      subtitle: 'Ver registros y datos',
      bgColor: 'bg-purple-50',
      iconBg: 'bg-[#9B59B6]',
      iconColor: 'text-white'
    },
    {
      id: 'procedimientos',
      icon: Clipboard,
      title: 'Procedimientos y Pruebas',
      subtitle: 'Ver registros y datos',
      bgColor: 'bg-orange-50',
      iconBg: 'bg-[#E67E22]',
      iconColor: 'text-white'
    }
  ];

  return (
    <div className="flex-1 overflow-auto pb-20">
      <div className="p-6">
        {/* Alerta Crítica Widget - Botón largo parpadeante con animación urgente */}
        <div 
          onClick={() => onNavigate('alertas-criticas')}
          className="mb-6 flex items-center bg-red-50 border-2 border-red-200 rounded-2xl p-4 cursor-pointer animate-urgent shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
        >
          <div className="bg-red-500 p-2 rounded-xl mr-3 shadow-lg">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-extrabold text-red-900 text-sm mb-0.5 leading-tight">ALERGIA A LA PENICILINA</h4>
            <p className="text-[11px] text-red-700 font-medium">Antecedente de choque anafiláctico</p>
          </div>
          <div className="bg-red-100 text-red-700 text-[10px] font-black px-2 py-1 rounded-md">
            ALERTA
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`${item.bgColor} rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`${item.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mb-3`}>
                    <Icon className={`w-8 h-8 ${item.iconColor}`} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500">{item.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
