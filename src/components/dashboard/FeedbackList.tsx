
import React from 'react';
import { Rating } from '../../types/rating'; // Ajuste o caminho
import { format } from 'date-fns'; // Para formatar datas
import { ptBR } from 'date-fns/locale';
import styles from './FeedbackList.module.css';

interface FeedbackListProps {
  ratings: Rating[];
  isLoading: boolean; // Para mostrar loading específico da lista
}

const FeedbackList: React.FC<FeedbackListProps> = ({ ratings, isLoading }) => {
   const feedbacks = ratings.filter(r => r.feedback); // Pega só os que têm feedback

  if (isLoading) {
     return <div className={styles.feedbackLoading}>Carregando feedbacks...</div>;
  }

  if (feedbacks.length === 0) {
    return <p className={styles.noFeedback}>Nenhum feedback em texto encontrado para o período selecionado.</p>;
  }

  return (
    <ul className={styles.feedbackList}>
      {feedbacks.map((rating) => (
        <li key={rating.id} className={styles.feedbackItem}>
          <span className={styles.feedbackDate}>
            {rating.created_at_date ? format(rating.created_at_date, 'dd/MM/yyyy HH:mm', { locale: ptBR }) : 'Data inválida'} -
            S: {rating.satisfaction} / R: {rating.recommendation} / V: {rating.speed}
          </span>
          {rating.feedback}
        </li>
      ))}
    </ul>
  );
};

export default FeedbackList;