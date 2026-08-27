import React, { useState, useEffect } from 'react';
import {
  Shield, Users, Activity, Database, Dog, ArrowLeft,
  Power, Download, Trash2, Search, CheckCircle2,
  AlertTriangle, RefreshCw, BarChart2, Eye, EyeOff, Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getAdminStats, getAdminUsers, updateUserRole, updateUserStatus,
  getAnalyticsConfig, toggleAnalyticsTracking, getAnalyticsMetrics, purgeAnalytics,
  getBackupsList, createHotBackup, deleteBackupFile, getAdminPets
} from '../services/api';

interface AdminPortalProps {
  onBackToApp: () => void;
}

export default function AdminPortal({ onBackToApp }: AdminPortalProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'kpis' | 'users' | 'analytics' | 'backups' | 'pets'>('kpis');

  // Stats state
  const [stats, setStats] = useState<any>(() => ({
    totalUsers: 3,
    totalPets: 2,
    activeAlerts: 1,
    totalServices: 6,
    activeLostPets: 2,
    totalEvents: 10,
    dbSize: "0.1 MB"
  }));
  const [loading, setLoading] = useState(false);

  // Users state
  const [usersList, setUsersList] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('todos');

  // Analytics state
  const [analyticsConfig, setAnalyticsConfig] = useState<{ enabled: boolean; totalEvents: number }>({ enabled: true, totalEvents: 0 });
  const [analyticsMetrics, setAnalyticsMetrics] = useState<any>(null);
  const [togglingAnalytics, setTogglingAnalytics] = useState(false);

  // Backups state
  const [backupsList, setBackupsList] = useState<any[]>([]);
  const [creatingBackup, setCreatingBackup] = useState(false);

  // Pets state
  const [globalPets, setGlobalPets] = useState<any[]>([]);

  // Feedback notifications
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'kpis') {
        const s = await getAdminStats();
        setStats(s);
      } else if (activeTab === 'users') {
        const u = await getAdminUsers(userSearch, userRoleFilter);
        setUsersList(u);
      } else if (activeTab === 'analytics') {
        const [cfg, met] = await Promise.all([
          getAnalyticsConfig(),
          getAnalyticsMetrics()
        ]);
        setAnalyticsConfig(cfg);
        setAnalyticsMetrics(met);
      } else if (activeTab === 'backups') {
        const b = await getBackupsList();
        setBackupsList(b);
      } else if (activeTab === 'pets') {
        const p = await getAdminPets();
        setGlobalPets(p);
      }
    } catch (err: any) {
      console.error('Error loading admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, userRoleFilter]);

  // Analytics Toggle handler
  const handleToggleTracking = async () => {
    setTogglingAnalytics(true);
    try {
      const newState = !analyticsConfig.enabled;
      await toggleAnalyticsTracking(newState);
      setAnalyticsConfig(prev => ({ ...prev, enabled: newState }));
      showFeedback(`Captura de visitas ${newState ? 'ACTIVADA' : 'DESACTIVADA'}`);
      const met = await getAnalyticsMetrics();
      setAnalyticsMetrics(met);
    } catch (err) {
      showFeedback('Error al actualizar captura de visitas');
    } finally {
      setTogglingAnalytics(false);
    }
  };

  // Create Hot Backup
  const handleCreateBackup = async () => {
    setCreatingBackup(true);
    try {
      const newBackup = await createHotBackup();
      setBackupsList(prev => [newBackup, ...prev]);
      showFeedback('¡Copia de seguridad en caliente (Hot Backup) creada con éxito!');
    } catch (err) {
      showFeedback('Error al crear respaldo');
    } finally {
      setCreatingBackup(false);
    }
  };

  // Delete Backup
  const handleDeleteBackup = async (filename: string) => {
    if (!window.confirm(`¿Seguro que deseas eliminar el respaldo ${filename}?`)) return;
    try {
      await deleteBackupFile(filename);
      setBackupsList(prev => prev.filter(b => b.filename !== filename));
      showFeedback('Respaldo eliminado');
    } catch (err) {
      showFeedback('Error al eliminar respaldo');
    }
  };

  // Update Role
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUserRole(userId, newRole);
      setUsersList(prev => prev.map(u => u.id === userId ? { ...u, rol: newRole } : u));
      showFeedback('Rol de usuario actualizado');
    } catch (err) {
      showFeedback('Error al actualizar rol');
    }
  };

  // Update Status
  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      await updateUserStatus(userId, newStatus);
      setUsersList(prev => prev.map(u => u.id === userId ? { ...u, estado: newStatus } : u));
      showFeedback(`Usuario ${newStatus}`);
    } catch (err) {
      showFeedback('Error al actualizar estado');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-100 min-h-screen text-gray-800 pb-20">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-4 shadow-lg sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToApp}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-white transition-colors"
              title="Volver a la App"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#00AEEF]" />
                <h1 className="font-black text-base tracking-tight">SuperAdmin Portal</h1>
                <span className="text-[9px] font-black uppercase bg-[#00AEEF] text-white px-2 py-0.5 rounded-full">
                  v2.0 Go
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold">
                Control Central Sania Pet • {user?.nombre || 'Administrador'}
              </p>
            </div>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 hover:text-white transition-all active:rotate-180"
            title="Recargar datos"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="max-w-4xl mx-auto flex gap-1 mt-4 overflow-x-auto no-scrollbar">
          {[
            { id: 'kpis', label: 'Dashboard', icon: BarChart2 },
            { id: 'users', label: 'Usuarios & Roles', icon: Users },
            { id: 'analytics', label: 'Analítica & Tracking', icon: Activity },
            { id: 'backups', label: 'Respaldos SQLite', icon: Database },
            { id: 'pets', label: 'Mascotas Global', icon: Dog },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all shrink-0 ${
                  active
                    ? 'bg-[#00AEEF] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Action Message */}
      {actionMessage && (
        <div className="fixed top-24 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Content Container */}
      <div className="max-w-4xl w-full mx-auto p-4 space-y-4">
        {/* TAB 1: KPIS & STATS */}
        {activeTab === 'kpis' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-white p-4 rounded-3xl shadow-xs border border-gray-200/80">
                <div className="flex items-center justify-between text-gray-400 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider">Usuarios</span>
                  <Users className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl font-black text-gray-900">{stats?.totalUsers ?? '...'}</div>
                <p className="text-[10px] text-gray-400 mt-1">Registrados en la plataforma</p>
              </div>

              <div className="bg-white p-4 rounded-3xl shadow-xs border border-gray-200/80">
                <div className="flex items-center justify-between text-gray-400 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider">Mascotas</span>
                  <Dog className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-black text-gray-900">{stats?.totalPets ?? '...'}</div>
                <p className="text-[10px] text-gray-400 mt-1">Fichas clínicas activas</p>
              </div>

              <div className="bg-white p-4 rounded-3xl shadow-xs border border-gray-200/80">
                <div className="flex items-center justify-between text-gray-400 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider">Servicios Mapa</span>
                  <Activity className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-2xl font-black text-gray-900">{stats?.totalServices ?? '...'}</div>
                <p className="text-[10px] text-gray-400 mt-1">Veterinarias, tiendas, paseos</p>
              </div>

              <div className="bg-white p-4 rounded-3xl shadow-xs border border-gray-200/80">
                <div className="flex items-center justify-between text-gray-400 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider">Alertas SOS</span>
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
                <div className="text-2xl font-black text-red-600">{stats?.activeLostPets ?? '...'}</div>
                <p className="text-[10px] text-gray-400 mt-1">Mascotas en búsqueda activa</p>
              </div>

              <div className="bg-white p-4 rounded-3xl shadow-xs border border-gray-200/80">
                <div className="flex items-center justify-between text-gray-400 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider">Base de Datos</span>
                  <Database className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-black text-gray-900">{stats?.dbSize ?? '...'}</div>
                <p className="text-[10px] text-gray-400 mt-1">SQLite en modo WAL</p>
              </div>

              <div className="bg-white p-4 rounded-3xl shadow-xs border border-gray-200/80">
                <div className="flex items-center justify-between text-gray-400 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider">Peticiones HTTP</span>
                  <Activity className="w-4 h-4 text-cyan-500" />
                </div>
                <div className="text-2xl font-black text-gray-900">{stats?.totalEvents ?? '...'}</div>
                <p className="text-[10px] text-gray-400 mt-1">Capturadas por telemetría</p>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-gradient-to-r from-[#1A5AD7] to-[#00AEEF] rounded-3xl p-5 text-white shadow-md">
              <h3 className="font-black text-base mb-1">Módulos Administrativos Listos</h3>
              <p className="text-xs text-white/80 leading-relaxed mb-4">
                El sistema corre con arquitectura de microsegundos en Go puro. Puedes gestionar roles, activar el Kill-Switch de analítica o generar copias de seguridad en caliente.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTab('users')}
                  className="px-3.5 py-2 bg-white text-[#1A5AD7] hover:bg-white/90 rounded-2xl text-xs font-black shadow-xs transition-colors"
                >
                  Gestionar Usuarios
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="px-3.5 py-2 bg-white/20 hover:bg-white/30 text-white rounded-2xl text-xs font-black backdrop-blur-sm transition-colors"
                >
                  Configurar Analítica
                </button>
                <button
                  onClick={() => setActiveTab('backups')}
                  className="px-3.5 py-2 bg-white/20 hover:bg-white/30 text-white rounded-2xl text-xs font-black backdrop-blur-sm transition-colors"
                >
                  Generar Respaldo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USERS & RBAC */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* Search & Filter Bar */}
            <div className="bg-white p-4 rounded-3xl shadow-xs border border-gray-200/80 flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadData()}
                  placeholder="Buscar por nombre, email o RUT..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-800 outline-none focus:bg-white focus:border-[#00AEEF]"
                />
              </div>
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-700 outline-none"
              >
                <option value="todos">Todos los Roles</option>
                <option value="superadmin">SuperAdmin</option>
                <option value="admin">Admin</option>
                <option value="veterinario">Veterinario</option>
                <option value="proveedor">Proveedor</option>
                <option value="propietario">Propietario</option>
              </select>
              <button
                onClick={loadData}
                className="px-4 py-2 bg-[#00AEEF] hover:bg-[#0099D6] text-white rounded-2xl text-xs font-black shadow-xs transition-colors"
              >
                Buscar
              </button>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-3xl shadow-xs border border-gray-200/80 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-black text-sm text-gray-900">Usuarios Registrados ({usersList.length})</h3>
                <span className="text-[10px] text-gray-400 font-bold">Control de Permisos RBAC</span>
              </div>

              <div className="divide-y divide-gray-100">
                {usersList.map((u) => (
                  <div key={u.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/60 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-gray-900 text-sm">{u.nombre}</span>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                          u.rol === 'superadmin' ? 'bg-purple-100 text-purple-700' :
                          u.rol === 'veterinario' ? 'bg-emerald-100 text-emerald-700' :
                          u.rol === 'proveedor' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {u.rol}
                        </span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          u.estado === 'activo' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {u.estado}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 font-semibold mt-0.5 flex flex-wrap gap-x-3 gap-y-1">
                        <span>📧 {u.email}</span>
                        {u.telefono && <span>📞 {u.telefono}</span>}
                        {u.rut && <span>🆔 {u.rut}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Role switcher */}
                      <select
                        value={u.rol}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="text-[11px] font-bold bg-gray-100 border border-gray-200 rounded-xl px-2 py-1 outline-none cursor-pointer"
                      >
                        <option value="propietario">Propietario</option>
                        <option value="veterinario">Veterinario</option>
                        <option value="proveedor">Proveedor</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">SuperAdmin</option>
                      </select>

                      {/* Suspend / Activate */}
                      {u.estado === 'activo' ? (
                        <button
                          onClick={() => handleStatusChange(u.id, 'suspendido')}
                          className="px-2.5 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-[10px] font-black border border-red-200"
                        >
                          Suspender
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(u.id, 'activo')}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl text-[10px] font-black border border-emerald-200"
                        >
                          Activar
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {usersList.length === 0 && (
                  <div className="p-8 text-center text-gray-400 text-xs">
                    No se encontraron usuarios coincidentes.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ANALYTICS & KILL-SWITCH */}
        {activeTab === 'analytics' && (
          <div className="space-y-4">
            {/* Kill-Switch Control Banner */}
            <div className={`p-5 rounded-3xl border shadow-sm flex items-center justify-between transition-all ${
              analyticsConfig.enabled
                ? 'bg-emerald-50/80 border-emerald-200'
                : 'bg-rose-50/80 border-rose-200'
            }`}>
              <div className="flex items-center gap-3.5">
                <div className={`p-3 rounded-2xl text-white ${
                  analyticsConfig.enabled ? 'bg-emerald-600' : 'bg-rose-600'
                }`}>
                  {analyticsConfig.enabled ? <Eye className="w-6 h-6" /> : <EyeOff className="w-6 h-6" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base text-gray-900">
                      Captura de Visitas & Telemetría
                    </h3>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase text-white ${
                      analyticsConfig.enabled ? 'bg-emerald-600' : 'bg-rose-600'
                    }`}>
                      {analyticsConfig.enabled ? 'ACTIVADA' : 'DESACTIVADA'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                    {analyticsConfig.enabled
                      ? 'Registrando rutas, latencia y dispositivos en memoria asíncrona sin impacto de rendimiento.'
                      : 'La captura está completamente apagada. Cero logs y máxima privacidad para los usuarios.'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleToggleTracking}
                disabled={togglingAnalytics}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black text-white shadow-md transition-all active:scale-95 flex items-center gap-2 shrink-0 ${
                  analyticsConfig.enabled
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                <Power className="w-4 h-4" />
                <span>{analyticsConfig.enabled ? 'Apagar Captura' : 'Encender Captura'}</span>
              </button>
            </div>

            {/* Top Visited Paths & Latency */}
            <div className="bg-white rounded-3xl p-5 shadow-xs border border-gray-200/80">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-black text-sm text-gray-900">Rutas y Módulos más Visitados</h4>
                <button
                  onClick={async () => {
                    if (window.confirm('¿Seguro que deseas purgar el historial de analítica?')) {
                      await purgeAnalytics();
                      loadData();
                      showFeedback('Historial de visitas purgado');
                    }
                  }}
                  className="text-[10px] font-bold text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Purgar Historial</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {analyticsMetrics?.topPaths?.map((p: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-2xl text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-[10px] font-black shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-gray-800 font-mono">{p.path}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-500 font-semibold">
                      <span>Latencia: <strong className="text-gray-900">{p.avgDurationMs.toFixed(1)} ms</strong></span>
                      <span className="bg-blue-50 text-blue-700 font-black px-2.5 py-0.5 rounded-full">
                        {p.visits} visitas
                      </span>
                    </div>
                  </div>
                ))}

                {(!analyticsMetrics?.topPaths || analyticsMetrics.topPaths.length === 0) && (
                  <div className="p-6 text-center text-gray-400 text-xs font-semibold">
                    No hay eventos de visitas registrados aún.
                  </div>
                )}
              </div>
            </div>

            {/* Daily Views & Status distribution */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-3xl p-5 shadow-xs border border-gray-200/80">
                <h4 className="font-black text-sm text-gray-900 mb-3">Visitas Últimos 7 Días</h4>
                <div className="space-y-2">
                  {analyticsMetrics?.dailyViews?.map((d: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-gray-500">{d.day}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#00AEEF] h-full rounded-full"
                            style={{ width: `${Math.min(100, d.total * 5)}%` }}
                          />
                        </div>
                        <span className="font-black text-gray-800 w-8 text-right">{d.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 shadow-xs border border-gray-200/80">
                <h4 className="font-black text-sm text-gray-900 mb-3">Salud del Servidor (HTTP Status)</h4>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 text-emerald-800 rounded-2xl font-bold">
                    <span>Exitosas (2xx/3xx)</span>
                    <span className="font-black text-emerald-700">{analyticsMetrics?.statusCodes?.ok ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-amber-50 text-amber-800 rounded-2xl font-bold">
                    <span>Errores Cliente (4xx)</span>
                    <span className="font-black text-amber-700">{analyticsMetrics?.statusCodes?.client ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-red-50 text-red-800 rounded-2xl font-bold">
                    <span>Errores Servidor (5xx)</span>
                    <span className="font-black text-red-700">{analyticsMetrics?.statusCodes?.server ?? 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SQLITE LIVE HOT BACKUPS */}
        {activeTab === 'backups' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 shadow-xs border border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-base text-gray-900">Copias de Seguridad (Hot Backups)</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Genera una copia consistente en caliente de SQLite con <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800">VACUUM INTO</code> sin pausar el servicio.
                </p>
              </div>

              <button
                onClick={handleCreateBackup}
                disabled={creatingBackup}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black rounded-2xl text-xs shadow-md transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>{creatingBackup ? 'Generando...' : 'Crear Respaldo Ahora'}</span>
              </button>
            </div>

            {/* Backups List */}
            <div className="bg-white rounded-3xl shadow-xs border border-gray-200/80 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h4 className="font-black text-sm text-gray-900">Archivos de Respaldo Disponibles ({backupsList.length})</h4>
              </div>

              <div className="divide-y divide-gray-100">
                {backupsList.map((b) => (
                  <div key={b.filename} className="p-4 flex items-center justify-between hover:bg-gray-50/60 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-amber-50 text-amber-600 rounded-2xl">
                        <Database className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-xs font-mono">{b.filename}</div>
                        <div className="text-[10px] text-gray-400 font-semibold mt-0.5">
                          Creado: {b.createdAt} • Tamaño: <strong className="text-gray-600">{b.sizeMb}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`/api/admin/backups/download/${encodeURIComponent(b.filename)}`}
                        download
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-black border border-blue-200 transition-colors flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Descargar .db</span>
                      </a>
                      <button
                        onClick={() => handleDeleteBackup(b.filename)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="Eliminar archivo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {backupsList.length === 0 && (
                  <div className="p-8 text-center text-gray-400 text-xs font-semibold">
                    No hay copias de seguridad creadas aún. Pulsa el botón superior para crear una.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: GLOBAL PETS DIRECTORY */}
        {activeTab === 'pets' && (
          <div className="bg-white rounded-3xl shadow-xs border border-gray-200/80 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-black text-sm text-gray-900">Directorio Global de Mascotas ({globalPets.length})</h3>
              <span className="text-[10px] text-gray-400 font-bold">Fichas Clínicas Centralizadas</span>
            </div>

            <div className="divide-y divide-gray-100">
              {globalPets.map((p) => (
                <div key={p.id} className="p-4 flex items-center justify-between hover:bg-gray-50/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.foto}
                      alt={p.nombre}
                      className="w-11 h-11 rounded-2xl object-cover border border-gray-200 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTgiIGZpbGw9IiNFM0YyRkQiLz48dGV4dCB4PSI1MCUiIHk9IjU1JSIgZm9udC1zaXplPSIxNiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzE1NjVDNCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UEVUPC90ZXh0Pjwvc3ZnPg==';
                      }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-gray-900 text-sm">{p.nombre}</h4>
                        <span className="text-[9px] font-black px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">
                          {p.especie} • {p.raza}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 font-semibold mt-0.5">
                        Tutor: <strong className="text-gray-800">{p.dueno}</strong> • Edad: {p.edad} • Peso: {p.pesoActual}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
