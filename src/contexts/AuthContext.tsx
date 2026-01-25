import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export type UserRole = 'admin' | 'escola' | 'aluno' | 'responsavel';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  getRoleRedirectPath: (role: UserRole) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: Record<string, User & { password: string }> = {
  'admin@iescolas.com': {
    id: '1',
    name: 'Super Admin',
    email: 'admin@iescolas.com',
    role: 'admin',
    password: 'admin123',
  },
  'diretor@escola.com': {
    id: '2',
    name: 'Diretor Roberto',
    email: 'diretor@escola.com',
    role: 'escola',
    password: 'escola123',
  },
  'aluno@escola.com': {
    id: '3',
    name: 'Ana Beatriz',
    email: 'aluno@escola.com',
    role: 'aluno',
    password: 'aluno123',
  },
  'responsavel@email.com': {
    id: '4',
    name: 'Maria Silva',
    email: 'responsavel@email.com',
    role: 'responsavel',
    password: 'resp123',
  },
};

const roleRedirectPaths: Record<UserRole, string> = {
  admin: '/admin/dashboard',
  escola: '/escola/dashboard',
  aluno: '/aluno/dashboard',
  responsavel: '/responsavel/dashboard',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem('iescolas_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('iescolas_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = mockUsers[email.toLowerCase()];
    
    if (mockUser && mockUser.password === password) {
      const { password: _, ...userWithoutPassword } = mockUser;
      setUser(userWithoutPassword);
      localStorage.setItem('iescolas_user', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('iescolas_user');
  };

  const getRoleRedirectPath = (role: UserRole): string => {
    return roleRedirectPaths[role];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        getRoleRedirectPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
