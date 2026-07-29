import { useState } from 'react';
import { X, Dog, Cat, Plus, Sparkles, User, Shield, Camera } from 'lucide-react';

interface AddPetModalProps {
  onClose: () => void;
  onAddPet: (petData: any) => void;
}

export default function AddPetModal({ onClose, onAddPet }: AddPetModalProps) {
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState<'Perro' | 'Gato' | 'Ave' | 'Exótico'>('Perro');
  const [raza, setRaza] = useState('');
  const [edad, setEdad] = useState('');
  const [sexo, setSexo] = useState('Macho (Esterilizado)');
  const [pesoActual, setPesoActual] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [microchip, setMicrochip] = useState('');
  const [seguro, setSeguro] = useState('');
  const [clinicaFrecuente, setClinicaFrecuente] = useState('');
  const [foto, setFoto] = useState('');

  // Propietario
  const [propietarioNombre, setPropietarioNombre] = useState('');
  const [propietarioTelefono, setPropietarioTelefono] = useState('');
  const [propietarioEmail, setPropietarioEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre) return;

    onAddPet({
      nombre,
      especie,
      raza: raza || (especie === 'Perro' ? 'Mestizo' : 'Doméstico'),
      edad: edad || '1 año',
      sexo,
      pesoActual,
      fechaNacimiento,
      microchip,
      seguro,
      clinicaFrecuente,
      foto,
      propietarioNombre,
      propietarioTelefono,
      propietarioEmail
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-in fade-in duration-200 p-0 sm:p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal content */}
      <div 
        className="relative bg-white rounded-t-[32px] sm:rounded-3xl w-full max-w-lg p-6 border-t sm:border border-gray-100 shadow-2xl z-50 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-250"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden -mt-1" />
        
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 p-2 bg-gray-50 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="bg-[#E6F7FF] p-3 rounded-2xl text-[#00AEEF]">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 leading-tight">Agregar Nueva Mascota</h2>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">Crea una nueva ficha médica en Sania Pet</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Especie Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Especie</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'Perro', icon: Dog, label: 'Perro' },
                { id: 'Gato', icon: Cat, label: 'Gato' },
                { id: 'Ave', icon: Plus, label: 'Ave' },
                { id: 'Exótico', icon: Plus, label: 'Exótico' }
              ].map(esp => {
                const Icon = esp.icon;
                const isSel = especie === esp.id;
                return (
                  <button
                    key={esp.id}
                    type="button"
                    onClick={() => setEspecie(esp.id as any)}
                    className={`py-2.5 px-2 rounded-2xl border flex flex-col items-center gap-1 transition-all ${
                      isSel 
                        ? 'bg-[#00AEEF] text-white border-[#00AEEF] shadow-sm font-black' 
                        : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100 font-bold'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px]">{esp.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nombre y Raza */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Nombre *</label>
              <input 
                type="text" 
                required
                placeholder="Ej. Rocky, Mia" 
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Raza</label>
              <input 
                type="text" 
                placeholder="Ej. Poodle, Mestizo" 
                value={raza}
                onChange={e => setRaza(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
              />
            </div>
          </div>

          {/* Edad, Sexo, Peso */}
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Edad</label>
              <input 
                type="text" 
                placeholder="Ej. 2 años" 
                value={edad}
                onChange={e => setEdad(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
              />
            </div>
            <div className="space-y-1 col-span-2">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Sexo</label>
              <select
                value={sexo}
                onChange={e => setSexo(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
              >
                <option value="Macho (Esterilizado)">Macho (Esterilizado)</option>
                <option value="Macho (Fértil)">Macho (Fértil)</option>
                <option value="Hembra (Esterilizada)">Hembra (Esterilizada)</option>
                <option value="Hembra (Fértil)">Hembra (Fértil)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Peso Inicial (kg)</label>
              <input 
                type="number" 
                step="0.1"
                placeholder="Ej. 8.5" 
                value={pesoActual}
                onChange={e => setPesoActual(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Nacimiento (DD/MM/AAAA)</label>
              <input 
                type="text" 
                placeholder="Ej. 15/04/2024" 
                value={fechaNacimiento}
                onChange={e => setFechaNacimiento(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
              />
            </div>
          </div>

          {/* Identification & Insurance */}
          <div className="p-3.5 bg-gray-50/70 border border-gray-100 rounded-2xl space-y-3">
            <div className="flex items-center gap-1.5 text-gray-700">
              <Shield className="w-3.5 h-3.5 text-[#00AEEF]" />
              <span className="text-[11px] font-black uppercase tracking-wider">Identificación y Clínica</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="text" 
                placeholder="N° Microchip (opcional)" 
                value={microchip}
                onChange={e => setMicrochip(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold"
              />
              <input 
                type="text" 
                placeholder="Seguro Médico (opcional)" 
                value={seguro}
                onChange={e => setSeguro(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold"
              />
            </div>
            <input 
              type="text" 
              placeholder="Clínica Veterinaria Frecuente (opcional)" 
              value={clinicaFrecuente}
              onChange={e => setClinicaFrecuente(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold"
            />
          </div>

          {/* Owner details */}
          <div className="p-3.5 bg-blue-50/50 border border-blue-100/50 rounded-2xl space-y-3">
            <div className="flex items-center gap-1.5 text-blue-900">
              <User className="w-3.5 h-3.5 text-[#00AEEF]" />
              <span className="text-[11px] font-black uppercase tracking-wider">Datos del Tutor / Propietario</span>
            </div>
            <input 
              type="text" 
              placeholder="Nombre del Tutor" 
              value={propietarioNombre}
              onChange={e => setPropietarioNombre(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold"
            />
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="text" 
                placeholder="Teléfono" 
                value={propietarioTelefono}
                onChange={e => setPropietarioTelefono(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold"
              />
              <input 
                type="email" 
                placeholder="Email" 
                value={propietarioEmail}
                onChange={e => setPropietarioEmail(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold"
              />
            </div>
          </div>

          {/* Optional photo URL */}
          <div className="space-y-1">
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Camera className="w-3 h-3 text-[#00AEEF]" />
              URL de Foto (opcional)
            </label>
            <input 
              type="url" 
              placeholder="https://... (deja en blanco para usar avatar automático)" 
              value={foto}
              onChange={e => setFoto(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#00AEEF] text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md hover:bg-[#0099D6] transition-colors mt-2"
          >
            Crear Ficha de Mascota
          </button>
        </form>
      </div>
    </div>
  );
}
