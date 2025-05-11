// src/router/index.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from '../pages/home/HomePage';
import LoginPage from '../pages/login/LoginPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import NotFoundPage from '../pages/notFound/NotFoundPage';
import ProtectedRoute from './ProtectedRoute'; // Importa o ProtectedRoute

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Rota do Dashboard AGORA PROTEGIDA */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute> {/* Envolve com o protetor */}
            <DashboardPage /> {/* Página a ser protegida */}
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;