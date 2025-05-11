
import React from 'react';
import styles from './Button.module.css';

// Define tipos para as props do botão
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  // Combina a classe padrão do módulo com qualquer classe passada via props
  const buttonClasses = `${styles.button} ${className || ''}`;

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;