import { Stethoscope, ShieldCheck, Bug, Pill, FlaskConical, Image, AlertTriangle, ChevronRight, Activity, MapPin } from 'lucide-react';
import { Pet } from '../data/petData';
import PesoGrafico from './PesoGrafico';

interface DashboardProps {
  activePet: Pet;
  onNavigate: (screen: string) => void;
  onAlertClick: (alert: any) => void;
}

export default function Dashboard({ activePet, onNavigate, onAlertClick }: DashboardProps) {
  // Filter alerts to show only the active ones in "Inicio" (where status is "activa" or undefined/null)
  const activeAlerts = (activePet.alertas || []).filter(
    (alert) => !alert.estado || alert.estado === 'activa'
  );

  const menuItems = [
    {
      id: 'consultas',
      icon: Stethoscope,
      title: 'Consultas',
      subtitle: 'Historial clínico',
      bgColor: 'bg-blue-50/70 hover:bg-blue-100/50',
      iconBg: 'bg-[#4A90E2]',
      iconColor: 'text-white'
    },
    {
      id: 'vacunas',
      icon: ShieldCheck,
      title: 'Vacunas',
      subtitle: 'Próximas y aplicadas',
      bgColor: 'bg-emerald-50/70 hover:bg-emerald-100/50',
      iconBg: 'bg-[#50C878]',
      iconColor: 'text-white'
    },
    {
      id: 'desparasitaciones',
      icon: Bug,
      title: 'Desparasitaciones',
      subtitle: 'Control antiparasitario',
      bgColor: 'bg-amber-50/70 hover:bg-amber-100/50',
      iconBg: 'bg-amber-500',
      iconColor: 'text-white'
    },
    {
      id: 'medicamentos',
      icon: Pill,
      title: 'Tratamientos',
      subtitle: 'Recetas y medicación',
      bgColor: 'bg-indigo-50/70 hover:bg-indigo-100/50',
      iconBg: 'bg-[#5B6FDB]',
      iconColor: 'text-white'
    },
    {
      id: 'laboratorios',
      icon: FlaskConical,
      title: 'Laboratorio',
      subtitle: 'Exámenes de sangre/orina',
      bgColor: 'bg-green-50/70 hover:bg-green-100/50',
      iconBg: 'bg-[#27AE60]',
      iconColor: 'text-white'
    },
    {
      id: 'imagenes',
      icon: Image,
      title: 'Imágenes',
      subtitle: 'Rx, ecografías y más',
      bgColor: 'bg-purple-50/70 hover:bg-purple-100/50',
      iconBg: 'bg-[#9B59B6]',
      iconColor: 'text-white'
    }
  ];

  return (
    <div className="flex-1 overflow-auto pb-24">
      <div className="p-5 space-y-6">
        
        {/* Animated Urgent Alerts Widget */}
        {activeAlerts && activeAlerts.length > 0 && (
          <div className="space-y-3">
            {activeAlerts.map((alert) => (
              <div 
                key={alert.id}
                onClick={() => onAlertClick(alert)}
                className={`flex items-center rounded-2xl p-4 cursor-pointer shadow-sm border transition-all active:scale-[0.98] ${
                  alert.tipo === 'critica' 
                    ? 'bg-red-50/80 border-red-200 animate-urgent' 
                    : 'bg-amber-50/80 border-amber-200 hover:shadow-md'
                }`}
              >
                <div className={`p-2.5 rounded-xl mr-3 shadow-sm ${
                  alert.tipo === 'critica' ? 'bg-red-500' : 'bg-amber-500'
                }`}>
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className={`font-extrabold text-xs mb-0.5 leading-tight ${
                    alert.tipo === 'critica' ? 'text-red-900' : 'text-amber-900'
                  }`}>
                    {alert.titulo}
                  </h4>
                  <p className={`text-[10px] font-medium leading-normal ${
                    alert.tipo === 'critica' ? 'text-red-700' : 'text-amber-700'
                  }`}>
                    {alert.descripcion}
                  </p>
                </div>
                <div className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase shrink-0 ${
                  alert.tipo === 'critica' 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  ALERTA
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pet Summary Card */}
        <div 
          onClick={() => onNavigate('perfil-detalle')}
          className="bg-gradient-to-br from-[#00AEEF] to-[#1A5AD7] rounded-3xl p-5 text-white shadow-md relative overflow-hidden cursor-pointer group hover:shadow-lg transition-all"
        >
          {/* Decorative background shape */}
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mb-8 pointer-events-none group-hover:scale-110 transition-transform duration-300" />
          
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="bg-white/20 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Ficha Médica
              </span>
              <h2 className="text-2xl font-black mt-1 leading-none">{activePet.nombre}</h2>
              <p className="text-white/85 text-xs font-semibold mt-1">{activePet.raza} • {activePet.edad}</p>
            </div>
            <div className="bg-white/15 p-2 rounded-2xl group-hover:bg-white/25 transition-colors">
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-3 pt-3 border-t border-white/10 text-xs">
            <div>
              <span className="text-white/60 text-[9px] font-bold uppercase tracking-wider block">Microchip</span>
              <span className="font-extrabold">{activePet.microchip}</span>
            </div>
            <div>
              <span className="text-white/60 text-[9px] font-bold uppercase tracking-wider block">Seguro Médico</span>
              <span className="font-extrabold line-clamp-1">{activePet.seguro}</span>
            </div>
            <div>
              <span className="text-white/60 text-[9px] font-bold uppercase tracking-wider block">Sexo</span>
              <span className="font-extrabold">{activePet.sexo}</span>
            </div>
            <div>
              <span className="text-white/60 text-[9px] font-bold uppercase tracking-wider block">Clínica Frecuente</span>
              <span className="font-extrabold line-clamp-1">{activePet.clinicaFrecuente}</span>
            </div>
          </div>
        </div>

        {/* Shortcuts Section Title */}
        <div>
          <h3 className="text-gray-900 font-extrabold text-base mb-3.5 px-1 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#00AEEF]" />
            Historial Médico
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`${item.bgColor} rounded-2xl p-4 shadow-sm border border-gray-100/50 transition-all duration-200 cursor-pointer active:scale-[0.97]`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`${item.iconBg} w-13 h-13 rounded-2xl flex items-center justify-center mb-2.5 shadow-sm`}>
                      <Icon className={`w-6 h-6 ${item.iconColor}`} />
                    </div>
                    <h3 className="font-extrabold text-gray-900 text-sm mb-0.5 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-semibold">{item.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mapet Services & SOS Card */}
        <div 
          onClick={() => onNavigate('mapet-servicios')}
          className="bg-gradient-to-br from-indigo-600 via-[#1A5AD7] to-[#00AEEF] rounded-3xl p-5 text-white shadow-md relative overflow-hidden cursor-pointer group hover:shadow-lg transition-all active:scale-[0.99]"
        >
          {/* Decorative background circle */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex justify-between items-center relative z-10">
            <div className="space-y-1.5 flex-1 pr-2">
              <div className="flex items-center gap-2">
                <span className="bg-white/20 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  OpenStreetMap Interactivo
                </span>
                <span className="bg-red-500/90 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                  SOS Perdidos
                </span>
              </div>
              <h4 className="font-extrabold text-white text-base leading-tight">Mapet Servicios & Radar SOS</h4>
              <p className="text-[10px] text-white/85 font-medium leading-normal">
                Encuentra veterinarias, paseadores, tiendas BARF y reporta o ayuda a encontrar mascotas perdidas en tu zona.
              </p>
            </div>
            
            <div className="bg-white/20 p-3.5 rounded-2xl group-hover:bg-white/30 transition-colors shrink-0 flex items-center justify-center shadow-inner">
              <MapPin className="w-6 h-6 text-white stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* Weight Tracker Embed */}
        <PesoGrafico 
          data={activePet.pesoHistorial} 
          pesoActual={activePet.pesoActual} 
        />

      </div>
    </div>
  );
}
