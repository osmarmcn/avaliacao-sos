
// src/hooks/useAuth.ts
import { useContext } from 'react';
// Importa o Contexto e o Tipo definidos e EXPORTADOS do AuthContext.tsx
import { AuthContext, AuthContextType } from '../context/AuthContext'; // Verifique o caminho

// O hook customizado para consumir o contexto facilmente
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    // O erro agora aponta que o problema está no AuthProvider não estar "em volta"
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};