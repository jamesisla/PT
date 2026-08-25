import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, FileText, CheckCircle2, AlertCircle, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalMode, login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(authModalMode);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [rut, setRut] = useState('');
  const [rol, setRol] = useState('propietario');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === 'login') {
      const res = await login(email, password);
      setLoading(false);
      if (!res.success) {
        setError(res.error || 'Error al iniciar sesión');
      } else {
        setSuccess(true);
        setTimeout(() => closeAuthModal(), 600);
      }
    } else {
      const res = await register({ email, password, nombre, telefono, rut, rol });
      setLoading(false);
      if (!res.success) {
        setError(res.error || 'Error al registrarse');
      } else {
        setSuccess(true);
        setTimeout(() => closeAuthModal(), 600);
      }
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    setError(null);
    const res = await login(demoEmail, demoPass);
    setLoading(false);
    if (!res.success) {
      setError(res.error || 'Error en login demo');
    } else {
      setSuccess(true);
      setTimeout(() => closeAuthModal(), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00AEEF] to-[#1A5AD7] p-6 text-white relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-6 h-6 text-white/90" />
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
              Sania Pet Auth
            </span>
          </div>
          <h2 className="text-xl font-black">
            {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          <p className="text-xs text-white/80 mt-0.5">
            {mode === 'login' 
              ? 'Accede al historial clínico y alertas de tus mascotas' 
              : 'Regístrate para gestionar mascotas y servicios'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-gray-100 bg-gray-50/50 p-1">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-2.5 text-xs font-black rounded-2xl transition-all ${
              mode === 'login' ? 'bg-white shadow-sm text-[#00AEEF]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Ingresar
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-2.5 text-xs font-black rounded-2xl transition-all ${
              mode === 'register' ? 'bg-white shadow-sm text-[#00AEEF]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-2xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-2xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>¡Sesión iniciada con éxito!</span>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-black text-gray-500 uppercase mb-1">Nombre Completo</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Jota Robles"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-800 focus:bg-white focus:border-[#00AEEF] outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-black text-gray-500 uppercase mb-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.cl"
                className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-800 focus:bg-white focus:border-[#00AEEF] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black text-gray-500 uppercase mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-800 focus:bg-white focus:border-[#00AEEF] outline-none"
              />
            </div>
          </div>

          {mode === 'register' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Teléfono</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="+56 9..."
                      className="w-full pl-8 pr-2 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">RUT</label>
                  <div className="relative">
                    <FileText className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={rut}
                      onChange={(e) => setRut(e.target.value)}
                      placeholder="12.345.678-9"
                      className="w-full pl-8 pr-2 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Tipo de Cuenta</label>
                <select
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-700"
                >
                  <option value="propietario">Tutor / Dueño de Mascota</option>
                  <option value="veterinario">Médico Veterinario / Clínica</option>
                  <option value="proveedor">Proveedor de Servicios / Tienda</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#00AEEF] hover:bg-[#0099D6] active:scale-[0.98] transition-all text-white font-black rounded-2xl shadow-md text-xs disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
          >
            {loading ? 'Procesando...' : mode === 'login' ? 'Entrar a Sania Pet' : 'Crear mi Cuenta'}
          </button>
        </form>

        {/* Demo Fast Access */}
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase text-center mb-2">Accesos Demo Instantáneos</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin@saniapet.cl', 'Admin2026!')}
              className="px-2 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl text-[10px] font-black border border-purple-200 transition-colors"
            >
              👑 SuperAdmin
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('jota@saniapet.cl', 'Jota2026!')}
              className="px-2 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-[10px] font-black border border-blue-200 transition-colors"
            >
              🐾 Dueño (Jota)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('vet.sandra@saniapet.cl', 'Vet2026!')}
              className="px-2 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-[10px] font-black border border-emerald-200 transition-colors"
            >
              🩺 Veterinaria
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
