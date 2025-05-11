
import React, { useState, FormEvent } from 'react';
// Importe useNavigate para redirecionar após login (faremos depois)
import { useNavigate, useLocation } from 'react-router-dom';
// Importe o AuthContext para chamar a função de login (faremos depois)
//  import { useAuth } from '../../context/AuthContext';

import Button from '../../components/ui/Button/Button'; // Usa o botão genérico
import styles from './LoginPage.module.css'; // Importa os estilos do módulo
import { useAuth } from '../../hooks/useAuth';


const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();


  // const navigate = useNavigate(); // Descomente quando for usar o router
  // const { login } = useAuth(); // Descomente quando for usar o context

  const [email, setEmail] = useState<string>(''); // Nova linha - Mude para email
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null); 
  const [isLoading, setIsLoading] = useState<boolean>(false); // Estado para feedback de carregamento

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
  
    try {
     
      await login({ email, password }); 
  
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
  
    } catch {
      console.error('Falha no login (LoginPage):', error);
      setError(error instanceof Error ? error.message : 'Ocorreu um erro.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginPageContainer}>
      <div className={styles.loginBox}>
        <h1>Acesso ao Dashboard</h1>

        {/* Mostra a mensagem de erro, se houver */}
        <div className={styles.errorMessage}>
             {error && <p>{error}</p>}
        </div>


        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}> {/* Mude o htmlFor e o texto */}
              Email:
            </label>
            <input
              type="email" // Mude o type para 'email' (melhor validação/semântica)
              id="email"   // Mude o id
              value={email} // Use o state 'email'
              onChange={(e) => setEmail(e.target.value)} // Use setEmail
              required
              className={styles.input}
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Senha:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
              disabled={isLoading} // Desabilita enquanto carrega
            />
          </div>

          {/* Usa o componente Button genérico, mas aplica classe para largura total */}
          <Button
            type="submit"
            className={styles.loginButton}
            disabled={isLoading} // Desabilita enquanto carrega
          >
            {isLoading ? 'Entrando...' : 'Entrar'} {/* Feedback no botão */}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;