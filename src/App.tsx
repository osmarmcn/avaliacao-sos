// src/App.tsx (CORRETO)
import React from 'react';
// NÃO importe BrowserRouter aqui
import AppRouter from './router';
// import './App.css'; // Se não estiver usando

function App() {
  return (
   
      <main>
        <AppRouter />
      </main>
   
  );
}

export default App;