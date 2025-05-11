
// src/context/AuthProvider.tsx (NOVO ARQUIVO)

import React, {
    useState,
    useEffect,
    useCallback,
    ReactNode
  } from 'react';
  // Importa o contexto e o tipo definidos no arquivo AuthContext.tsx
  import { AuthContext, AuthContextType, LoginCredentials } from './AuthContext';
  // Importa o cliente supabase
  import { supabase } from '../services/api'; // Verifique o caminho
  
  interface AuthProviderProps {
    children: ReactNode;
  }
  
  // O componente Provedor agora vive neste arquivo separado
  export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
  
    useEffect(() => {
      console.log('AuthProvider State Changed:', { isLoading, isAuthenticated });
    }, [isLoading, isAuthenticated]);
  
    const checkAuthStatusAndListen = useCallback(async () => {
       // ... (lógica exata do checkAuthStatusAndListen com getSession/onAuthStateChange) ...
      setIsLoading(true);
      console.log("AuthProvider: Verificando sessão inicial...");
       try {
           const { data: { session }, error } = await supabase.auth.getSession();
           if (error) throw error;
           const initialState = !!session;
           setIsAuthenticated(initialState);
           console.log("AuthProvider: Sessão inicial carregada, isAuthenticated:", initialState);
       } catch (error) {
           console.error("AuthProvider: Erro ao buscar sessão inicial Supabase:", error);
           setIsAuthenticated(false);
       }
  
       console.log("AuthProvider: Configurando listener onAuthStateChange...");
       const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
           const currentAuthState = !!session;
           console.log("AuthProvider: onAuthStateChange disparado! isAuthenticated:", currentAuthState);
           setIsAuthenticated(currentAuthState);
           setIsLoading(false); // Para de carregar aqui
       });
  
       // Garante isLoading=false se getSession foi rápido e não achou nada
       if (!isAuthenticated) {
          setIsLoading(false);
       }
  
       return () => {
           console.log("AuthProvider: Removendo listener onAuthStateChange.");
           authListener?.subscription.unsubscribe();
       };
    }, [isAuthenticated]); // Adicionado isAuthenticated como dependência aqui pode ser útil
  
    useEffect(() => {
      const cleanupPromise = checkAuthStatusAndListen();
      return () => {
        cleanupPromise.then(cleanup => cleanup && cleanup());
      };
    }, [checkAuthStatusAndListen]);
  
  
    const login = useCallback(async (credentials: LoginCredentials) => {
      // ... (lógica exata do login com signInWithPassword) ...
      setIsLoading(true);
      try {
          if (!credentials.email || !credentials.password) {
              throw new Error("Email e senha são obrigatórios.");
          }
          console.log("AuthProvider: Tentando login com Supabase...");
          const { data, error } = await supabase.auth.signInWithPassword({
              email: credentials.email,
              password: credentials.password,
          });
          if (error) throw error;
          console.log("AuthProvider: Chamada signInWithPassword bem-sucedida:", data);
      } catch (error) {
          console.error("AuthProvider: Erro no login Supabase:", error);
          throw new Error(`Falha no login: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      } finally {
          // setIsLoading(false); // Deixa o listener tratar isLoading
      }
    }, []);
  
  
    const logout = useCallback(async () => {
      // ... (lógica exata do logout com signOut) ...
      setIsLoading(true);
       try {
           console.log("AuthProvider: Tentando logout com Supabase...");
           const { error } = await supabase.auth.signOut();
           if (error) throw error;
           console.log("AuthProvider: Chamada signOut bem-sucedida");
       } catch (error) {
           console.error("AuthProvider: Erro no logout Supabase:", error);
           setIsAuthenticated(false);
       } finally {
           // setIsLoading(false); // Deixa o listener tratar isLoading
       }
    }, []);
  
    const value: AuthContextType = { isAuthenticated, isLoading, login, logout };
  
    // Usa o AuthContext importado para fornecer o valor
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  };
  
  // Não exporte AuthContext ou AuthContextType daqui