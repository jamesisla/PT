import React, { createContext, useContext, useState, useEffect } from 'react';
import { BASE_URL } from '../services/api';

export interface User {
  id: string;
  email: string;
  nombre: string;
  telefono?: string;
  rut?: string;
  rol: 'superadmin' | 'admin' | 'veterinario' | 'proveedor' | 'propietario';
  estado: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { email: string; password: string; nombre: string; telefono?: string; rut?: string; rol?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('saniapet_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('saniapet_jwt'));
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    if (user) {
      localStorage.setItem('saniapet_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('saniapet_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('saniapet_jwt', token);
    } else {
      localStorage.removeItem('saniapet_jwt');
    }
  }, [token]);

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const rawText = await res.text();
        console.error('Non-JSON response from /api/auth/login:', res.status, rawText);
        if (res.status === 502 || res.status === 503 || res.status === 504) {
          return { 
            success: false, 
            error: `Error ${res.status}: El proceso Go (saniapet) está detenido. Ejecuta 'sudo rc-service saniapet restart' en Alpine.` 
          };
        }
        return { 
          success: false, 
          error: `Error HTTP ${res.status}: El servidor respondió HTML en lugar de la API. Verifica Nginx y reinicia saniapet.` 
        };
      }
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Credenciales inválidas' };
      }
      setUser(data.user);
      setToken(data.token);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error de conexión con el servidor' };
    }
  };

  const register = async (inputData: { email: string; password: string; nombre: string; telefono?: string; rut?: string; rol?: string }) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputData)
      });
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const rawText = await res.text();
        console.error('Non-JSON response from /api/auth/register:', res.status, rawText);
        if (res.status === 502 || res.status === 503 || res.status === 504) {
          return { 
            success: false, 
            error: `Error ${res.status}: El proceso Go (saniapet) está detenido. Ejecuta 'sudo rc-service saniapet restart' en Alpine.` 
          };
        }
        return { 
          success: false, 
          error: `Error HTTP ${res.status}: El servidor respondió HTML en lugar de la API. Verifica Nginx y reinicia saniapet.` 
        };
      }
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Error al registrarse' };
      }
      setUser(data.user);
      setToken(data.token);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error de conexión con el servidor' };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${BASE_URL}/auth/logout`, { method: 'POST' });
    } catch (err) {
      // Ignore network failure on logout
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('saniapet_user');
    localStorage.removeItem('saniapet_jwt');
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const isAdmin = user?.rol === 'superadmin' || user?.rol === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin,
        login,
        register,
        logout,
        openAuthModal,
        closeAuthModal,
        isAuthModalOpen,
        authModalMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
