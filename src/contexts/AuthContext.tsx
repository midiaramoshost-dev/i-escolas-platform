import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'admin' | 'escola' | 'aluno' | 'responsavel';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt?: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
}

interface PasswordResetToken {
  email: string;
  token: string;
  expiresAt: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (data: RegisterData) => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (email: string, token: string, newPassword: string) => Promise<boolean>;
  getRoleRedirectPath: (role: UserRole) => string;
  getAllUsers: () => (User & { password: string })[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'iescolas_user',
  USERS_DB: 'iescolas_users_db',
  RESET_TOKENS: 'iescolas_reset_tokens',
};

// Default demo users
const defaultUsers: Record<string, User & { password: string }> = {
  'admin@iescolas.com': {
    id: '1',
    name: 'Super Admin',
    email: 'admin@iescolas.com',
    role: 'admin',
    password: 'admin123',
    createdAt: new Date().toISOString(),
  },
  'diretor@escola.com': {
    id: '2',
    name: 'Diretor Roberto',
    email: 'diretor@escola.com',
    role: 'escola',
    password: 'escola123',
    createdAt: new Date().toISOString(),
  },
  'aluno@escola.com': {
    id: '3',
    name: 'Ana Beatriz',
    email: 'aluno@escola.com',
    role: 'aluno',
    password: 'aluno123',
    createdAt: new Date().toISOString(),
  },
  'responsavel@email.com': {
    id: '4',
    name: 'Maria Silva',
    email: 'responsavel@email.com',
    role: 'responsavel',
    password: 'resp123',
    createdAt: new Date().toISOString(),
  },
};

const roleRedirectPaths: Record<UserRole, string> = {
  admin: '/admin/dashboard',
  escola: '/escola/dashboard',
  aluno: '/aluno/dashboard',
  responsavel: '/responsavel/dashboard',
};

// Helper to get users from localStorage or use defaults
function getUsersDB(): Record<string, User & { password: string }> {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS_DB);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    console.error('Error reading users DB');
  }
  // Initialize with default users
  localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(defaultUsers));
  return { ...defaultUsers };
}

function saveUsersDB(users: Record<string, User & { password: string }>) {
  localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));
}

function getResetTokens(): PasswordResetToken[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RESET_TOKENS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    console.error('Error reading reset tokens');
  }
  return [];
}

function saveResetTokens(tokens: PasswordResetToken[]) {
  localStorage.setItem(STORAGE_KEYS.RESET_TOKENS, JSON.stringify(tokens));
}

function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function generateId(): string {
  return 'user_' + Math.random().toString(36).substring(2, 11);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    }
    // Initialize users DB if needed
    getUsersDB();
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = getUsersDB();
    const foundUser = users[email.toLowerCase()];
    
    if (foundUser && foundUser.password === password) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = getUsersDB();
    const emailLower = data.email.toLowerCase();
    
    // Check if user already exists
    if (users[emailLower]) {
      return false;
    }
    
    // Create new user
    const newUser: User & { password: string } = {
      id: generateId(),
      name: data.name,
      email: emailLower,
      role: data.role,
      password: data.password,
      phone: data.phone,
      createdAt: new Date().toISOString(),
    };
    
    users[emailLower] = newUser;
    saveUsersDB(users);
    
    return true;
  };

  const requestPasswordReset = async (email: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = getUsersDB();
    const emailLower = email.toLowerCase();
    
    if (!users[emailLower]) {
      return false;
    }
    
    // Generate reset token
    const token = generateToken();
    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
    
    const tokens = getResetTokens();
    // Remove old tokens for this email
    const filteredTokens = tokens.filter(t => t.email !== emailLower);
    filteredTokens.push({ email: emailLower, token, expiresAt });
    saveResetTokens(filteredTokens);
    
    // In a real app, this would send an email
    // For demo, we'll log the reset link to console
    console.log(`[DEMO] Reset link: /redefinir-senha?token=${token}&email=${encodeURIComponent(emailLower)}`);
    
    return true;
  };

  const resetPassword = async (email: string, token: string, newPassword: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const tokens = getResetTokens();
    const emailLower = email.toLowerCase();
    
    const validToken = tokens.find(
      t => t.email === emailLower && t.token === token && t.expiresAt > Date.now()
    );
    
    if (!validToken) {
      return false;
    }
    
    // Update password
    const users = getUsersDB();
    if (users[emailLower]) {
      users[emailLower].password = newPassword;
      saveUsersDB(users);
      
      // Remove used token
      const filteredTokens = tokens.filter(t => t.token !== token);
      saveResetTokens(filteredTokens);
      
      return true;
    }
    
    return false;
  };

  const getRoleRedirectPath = (role: UserRole): string => {
    return roleRedirectPaths[role];
  };

  const getAllUsers = (): (User & { password: string })[] => {
    const users = getUsersDB();
    return Object.values(users);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
        requestPasswordReset,
        resetPassword,
        getRoleRedirectPath,
        getAllUsers,
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
