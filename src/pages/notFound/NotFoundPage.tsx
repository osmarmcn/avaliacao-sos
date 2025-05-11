


// src/pages/notFound/NotFoundPage.tsx
import React from 'react';
import { Link } from 'react-router-dom'; // Para criar um link de volta

const NotFoundPage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404 - Página Não Encontrada</h1>
      <p>Desculpe, a página que você está procurando não existe.</p>
      <Link to="/">Voltar para a Página Inicial</Link>
    </div>
  );
};

export default NotFoundPage;