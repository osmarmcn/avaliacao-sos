
// src/router/ProtectedRoute.tsx
import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Importa o hook de autenticação

interface ProtectedRouteProps {
  children: ReactNode; // O componente da página protegida
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth(); // Pega o estado do contexto
  const location = useLocation(); // Guarda a localização atual

  // 1. Se ainda estiver verificando o status inicial, mostra um loading
  //    Isso evita redirecionar para /login antes de saber se já há uma sessão
  if (isLoading) {
    // Pode ser um spinner, ou apenas null/vazio para não mostrar nada temporariamente
    return <div>Verificando autenticação...</div>;
  }

  // 2. Se terminou de carregar e NÃO está autenticado, redireciona para /login
  if (!isAuthenticated) {
    // Redireciona para /login, guardando a página que o usuário tentou acessar (location.pathname)
    // para que possamos redirecioná-lo de volta após o login (lógica a ser feita no LoginPage)
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Se terminou de carregar e ESTÁ autenticado, renderiza a página solicitada
  return <>{children}</>; // Renderiza o componente filho (ex: DashboardPage)
};

export default ProtectedRoute;