// src/context/AuthContext.tsx (Modificado - Apenas Definições)

import { createContext } from 'react'; // Só precisa de createContext aqui

// Exporta o tipo para as credenciais
export interface LoginCredentials {
  email?: string;
  password?: string;
}

// Exporta o tipo para o valor do contexto
export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  // user: User | null;
}

// Exporta o Contexto criado
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// O componente AuthProvider NÃO está mais aqui
// O hook useAuth NÃO está mais aqui