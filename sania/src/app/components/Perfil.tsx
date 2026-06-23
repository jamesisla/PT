import { User, Calendar, Droplet, Phone, Mail, MessageCircle, MapPin } from 'lucide-react';

export default function Perfil() {
  return (
    <div className="flex-1 overflow-auto pb-20">
      <div className="bg-gradient-to-r from-[#00AEEF] to-[#1A5AD7] p-4">
        <h1 className="text-white font-semibold">Información Personal</h1>
      </div>

      <div className="p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg">
            <img 
              src="/felipe_avatar.png" 
              alt="Usuario Demo" 
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Usuario Demo</h2>
          <p className="text-sm text-gray-500 mb-4">RUT: 12.345.678-9</p>

          <div className="w-full bg-white rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-[#00AEEF]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Edad y Género</p>
                <p className="font-semibold text-gray-900">45 años - Masculino</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#00AEEF]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha de Nacimiento</p>
                <p className="font-semibold text-gray-900">16/07/1980</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                <Droplet className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Grupo Sanguíneo</p>
                <p className="font-semibold text-gray-900">O+</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Datos de Contacto</h3>

          <div className="space-y-3">
            <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-[#00AEEF]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Teléfono</p>
                <p className="font-semibold text-gray-900">+56 9 0000 0000</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#00AEEF]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold text-gray-900">usuario.demo@example.com</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">WhatsApp</p>
                <p className="font-semibold text-gray-900">+56 9 0000 0000</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#00AEEF]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Dirección</p>
                <p className="font-semibold text-gray-900">Calle Falsa 123, Ciudad</p>
              </div>
            </div>
          </div>
        </div>

        <button className="w-full bg-[#00AEEF] text-white py-4 rounded-xl hover:bg-[#0099D6] transition-colors font-semibold">
          Editar Información
        </button>
      </div>
    </div>
  );
}
