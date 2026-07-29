import { useState } from 'react';
import { User, Calendar, ShieldCheck, Phone, Mail, MapPin, BadgeInfo, Building2, X } from 'lucide-react';
import { Pet } from '../data/petData';

interface PerfilMascotaProps {
  pet: Pet;
  onUpdatePetProfile: (petData: any) => void;
  onUpdatePetOwner: (ownerData: any) => void;
}

export default function PerfilMascota({ pet, onUpdatePetProfile, onUpdatePetOwner }: PerfilMascotaProps) {
  const [activeTab, setActiveTab] = useState<'mascota' | 'propietario'>('mascota');

  // Edit pet drawer states
  const [showEditPet, setShowEditPet] = useState(false);
  const [editNombre, setEditNombre] = useState('');
  const [editEspecie, setEditEspecie] = useState('');
  const [editRaza, setEditRaza] = useState('');
  const [editEdad, setEditEdad] = useState('');
  const [editSexo, setEditSexo] = useState('');
  const [editFechaNacimiento, setEditFechaNacimiento] = useState('');
  const [editMicrochip, setEditMicrochip] = useState('');
  const [editFoto, setEditFoto] = useState('');
  const [editSeguro, setEditSeguro] = useState('');
  const [editClinicaFrecuente, setEditClinicaFrecuente] = useState('');

  // Edit owner drawer states
  const [showEditOwner, setShowEditOwner] = useState(false);
  const [editOwnerNombre, setEditOwnerNombre] = useState('');
  const [editOwnerRut, setEditOwnerRut] = useState('');
  const [editOwnerTelefono, setEditOwnerTelefono] = useState('');
  const [editOwnerEmail, setEditOwnerEmail] = useState('');
  const [editOwnerDireccion, setEditOwnerDireccion] = useState('');

  const handleStartEditPet = () => {
    setEditNombre(pet.nombre);
    setEditEspecie(pet.especie);
    setEditRaza(pet.raza || '');
    setEditEdad(pet.edad || '');
    setEditSexo(pet.sexo || '');
    setEditFechaNacimiento(pet.fechaNacimiento || '');
    setEditMicrochip(pet.microchip || '');
    setEditFoto(pet.foto || '');
    setEditSeguro(pet.seguro || '');
    setEditClinicaFrecuente(pet.clinicaFrecuente || '');
    setShowEditPet(true);
  };

  const handleStartEditOwner = () => {
    setEditOwnerNombre(pet.propietario.nombre);
    setEditOwnerRut(pet.propietario.rut || '');
    setEditOwnerTelefono(pet.propietario.telefono || '');
    setEditOwnerEmail(pet.propietario.email || '');
    setEditOwnerDireccion(pet.propietario.direccion || '');
    setShowEditOwner(true);
  };

  const handlePetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editNombre || !editEspecie) return;

    onUpdatePetProfile({
      nombre: editNombre,
      especie: editEspecie,
      raza: editRaza,
      edad: editEdad,
      sexo: editSexo,
      fechaNacimiento: editFechaNacimiento,
      microchip: editMicrochip,
      foto: editFoto,
      seguro: editSeguro,
      clinicaFrecuente: editClinicaFrecuente
    });
    setShowEditPet(false);
  };

  const handleOwnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editOwnerNombre) return;

    onUpdatePetOwner({
      nombre: editOwnerNombre,
      rut: editOwnerRut,
      telefono: editOwnerTelefono,
      email: editOwnerEmail,
      direccion: editOwnerDireccion
    });
    setShowEditOwner(false);
  };

  return (
    <div className="flex-1 overflow-auto pb-24 bg-gray-50/50">
      {/* Cover Profile Header */}
      <div className="bg-gradient-to-r from-[#00AEEF] to-[#1A5AD7] pt-3 pb-8 px-5 text-white shadow-md relative rounded-b-[40px]">
        <h1 className="text-xl font-black text-center tracking-wide">Perfil de Mascota</h1>
      </div>

      {/* Profile Card Floating Over Header */}
      <div className="px-5 -mt-6 space-y-6">
        <div className="bg-white rounded-3xl p-5 shadow-md border border-gray-100 flex flex-col items-center text-center">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-50 mb-2">
            <img 
              src={pet.foto} 
              alt={pet.nombre} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTgiIGZpbGw9IiNFM0YyRkQiLz48dGV4dCB4PSI1MCUiIHk9IjU1JSIgZm9udC1zaXplPSIxNiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzE1NjVDNCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UEVUPC90ZXh0Pjwvc3ZnPg==';
              }}
            />
          </div>

          <h2 className="text-xl font-black text-gray-900 mt-3">{pet.nombre}</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">{pet.raza} • {pet.especie}</p>

          {/* Tab Switcher */}
          <div className="flex bg-gray-50 p-1 rounded-2xl w-full mt-5 border border-gray-100/50">
            <button
              onClick={() => setActiveTab('mascota')}
              className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
                activeTab === 'mascota' 
                  ? 'bg-white text-[#00AEEF] shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Ficha Mascota
            </button>
            <button
              onClick={() => setActiveTab('propietario')}
              className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
                activeTab === 'propietario' 
                  ? 'bg-white text-[#00AEEF] shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Propietario
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        {activeTab === 'mascota' ? (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-extrabold text-gray-900 text-sm pb-2 border-b border-gray-50 flex items-center gap-2">
                <BadgeInfo className="w-4 h-4 text-[#00AEEF]" />
                Datos Biométricos
              </h3>

              <div className="grid grid-cols-2 gap-y-3.5 text-xs font-semibold text-gray-700">
                <div>
                  <span className="text-[9px] text-gray-400 uppercase font-black tracking-wider block mb-0.5">Fecha de Nacimiento</span>
                  <span className="text-gray-900 font-extrabold flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#00AEEF]" />
                    {pet.fechaNacimiento}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 uppercase font-black tracking-wider block mb-0.5">Sexo</span>
                  <span className="text-gray-900 font-extrabold flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#00AEEF]" />
                    {pet.sexo}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 uppercase font-black tracking-wider block mb-0.5">Código de Microchip</span>
                  <span className="text-gray-900 font-extrabold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    {pet.microchip}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 uppercase font-black tracking-wider block mb-0.5">Clínica Principal</span>
                  <span className="text-gray-900 font-extrabold flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#00AEEF]" />
                    <span className="truncate pr-1">{pet.clinicaFrecuente}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-2">
              <h3 className="font-extrabold text-gray-900 text-sm pb-2 border-b border-gray-50">Cobertura / Seguro</h3>
              <p className="text-xs text-gray-800 font-bold leading-relaxed">
                Esta mascota se encuentra resguardada bajo el convenio <span className="text-[#00AEEF] font-black">{pet.seguro}</span>. Presenta tu chip en recepción para cobro automático.
              </p>
            </div>

            <button 
              onClick={handleStartEditPet}
              className="w-full bg-[#00AEEF] hover:bg-[#0099D6] text-white py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-wider shadow-md hover:scale-[1.01] active:scale-[0.99]"
            >
              Editar Ficha de Mascota
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-4.5">
              <h3 className="font-extrabold text-gray-900 text-sm pb-2 border-b border-gray-50 flex items-center gap-2">
                <User className="w-4 h-4 text-[#00AEEF]" />
                Datos de Contacto
              </h3>

              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-[#00AEEF]">
                    <User className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[8px] text-gray-400 uppercase font-black tracking-wider block">Nombre Completo</span>
                    <span className="text-xs text-gray-900 font-extrabold">{pet.propietario.nombre}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-[#00AEEF]">
                    <Phone className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[8px] text-gray-400 uppercase font-black tracking-wider block">Teléfono de Emergencia</span>
                    <span className="text-xs text-gray-900 font-extrabold">{pet.propietario.telefono}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-[#00AEEF]">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[8px] text-gray-400 uppercase font-black tracking-wider block">Correo Electrónico</span>
                    <span className="text-xs text-gray-900 font-extrabold">{pet.propietario.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-[#00AEEF]">
                    <MapPin className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[8px] text-gray-400 uppercase font-black tracking-wider block">Domicilio Registrado</span>
                    <span className="text-xs text-gray-900 font-extrabold">{pet.propietario.direccion}</span>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleStartEditOwner}
              className="w-full bg-[#00AEEF] hover:bg-[#0099D6] text-white py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-wider shadow-md hover:scale-[1.01] active:scale-[0.99]"
            >
              Editar Datos de Propietario
            </button>
          </div>
        )}
      </div>

      {/* Edit Pet Modal Drawer */}
      {showEditPet && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center animate-in fade-in duration-200"
          onClick={() => setShowEditPet(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          
          {/* Modal content */}
          <div 
            className="relative bg-white rounded-t-[32px] w-full max-w-md p-6 pb-9 border-t border-gray-100 shadow-2xl z-50 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-250"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 -mt-2" />
            <button 
              onClick={() => setShowEditPet(false)} 
              className="absolute right-4 top-4 p-1.5 bg-gray-50 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <form onSubmit={handlePetSubmit} className="space-y-4">
              <h3 className="font-extrabold text-gray-900 text-base">Modificar Ficha de Mascota</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Nombre</label>
                  <input 
                    type="text" 
                    required
                    value={editNombre}
                    onChange={e => setEditNombre(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Especie</label>
                  <input 
                    type="text" 
                    required
                    value={editEspecie}
                    onChange={e => setEditEspecie(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Raza</label>
                  <input 
                    type="text" 
                    value={editRaza}
                    onChange={e => setEditRaza(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Edad</label>
                  <input 
                    type="text" 
                    value={editEdad}
                    onChange={e => setEditEdad(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Sexo</label>
                  <input 
                    type="text" 
                    value={editSexo}
                    onChange={e => setEditSexo(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fecha Nacimiento</label>
                  <input 
                    type="text" 
                    value={editFechaNacimiento}
                    onChange={e => setEditFechaNacimiento(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Microchip</label>
                <input 
                  type="text" 
                  value={editMicrochip}
                  onChange={e => setEditMicrochip(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">URL de Foto</label>
                <input 
                  type="text" 
                  value={editFoto}
                  onChange={e => setEditFoto(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#00AEEF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Seguro Médico</label>
                  <input 
                    type="text" 
                    value={editSeguro}
                    onChange={e => setEditSeguro(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Clínica Frecuente</label>
                  <input 
                    type="text" 
                    value={editClinicaFrecuente}
                    onChange={e => setEditClinicaFrecuente(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-[#00AEEF] text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md hover:bg-[#0099D6] transition-colors">
                Guardar Ficha
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Owner Modal Drawer */}
      {showEditOwner && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center animate-in fade-in duration-200"
          onClick={() => setShowEditOwner(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          
          {/* Modal content */}
          <div 
            className="relative bg-white rounded-t-[32px] w-full max-w-md p-6 pb-9 border-t border-gray-100 shadow-2xl z-50 animate-in slide-in-from-bottom duration-250"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 -mt-2" />
            <button 
              onClick={() => setShowEditOwner(false)} 
              className="absolute right-4 top-4 p-1.5 bg-gray-50 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <form onSubmit={handleOwnerSubmit} className="space-y-4">
              <h3 className="font-extrabold text-gray-900 text-base">Modificar Datos de Propietario</h3>
              
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Nombre Completo</label>
                <input 
                  type="text" 
                  required
                  value={editOwnerNombre}
                  onChange={e => setEditOwnerNombre(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">RUT</label>
                  <input 
                    type="text" 
                    value={editOwnerRut}
                    onChange={e => setEditOwnerRut(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Teléfono</label>
                  <input 
                    type="text" 
                    value={editOwnerTelefono}
                    onChange={e => setEditOwnerTelefono(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Correo Electrónico</label>
                <input 
                  type="email" 
                  value={editOwnerEmail}
                  onChange={e => setEditOwnerEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Domicilio Registrado</label>
                <input 
                  type="text" 
                  value={editOwnerDireccion}
                  onChange={e => setEditOwnerDireccion(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00AEEF]"
                />
              </div>

              <button type="submit" className="w-full bg-[#00AEEF] text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md hover:bg-[#0099D6] transition-colors">
                Guardar Datos de Propietario
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
