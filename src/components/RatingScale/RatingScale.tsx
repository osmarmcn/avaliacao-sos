
import React from 'react';
import styles from './RatingScale.module.css'; // Importa CSS Module

interface RatingScaleProps {
  questionId: string; // Usado para o 'name' dos radio buttons
  selectedValue: number | null; // Valor atualmente selecionado (controlado pelo pai)
  onChange: (value: number) => void; // Função para notificar o pai da mudança
}

const RatingScale: React.FC<RatingScaleProps> = ({
  questionId,
  selectedValue,
  onChange,
}) => {
    const numbers = Array.from({ length: 11 }, (_, i) => i);

  return (
    <div className={styles.ratingScaleContainer}>
      {numbers.map((num) => {
        // ***** CORREÇÃO APLICADA AQUI *****
        const inputId = `${questionId}-${num}`; // Remove as tags span!
        // ***** FIM DA CORREÇÃO *****

        return (
          <React.Fragment key={num}>
            <input
              type="radio"
              id={inputId} // Agora usa o ID correto
              name={questionId}
              value={num}
              checked={selectedValue === num}
              onChange={() => onChange(num)}
              className={styles.radioInput}
              required
            />
            <label htmlFor={inputId} className={styles.ratingLabel}> {/* htmlFor agora funciona */}
              {num}
            </label>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default RatingScale;