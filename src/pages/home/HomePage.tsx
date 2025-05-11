// src/pages/home/HomePage.tsx (Com else explícito)

import React, { useState, FormEvent} from 'react';

import styles from './HomePage.module.css';
import { supabase } from '../../services/api';
import RatingScale from '../../components/RatingScale/RatingScale';
import Button from '../../components/ui/Button/Button';

const HomePage: React.FC = () => {
  
  const [satisfaction, setSatisfaction] = useState<number | null>(null);
  const [recommendation, setRecommendation] = useState<number | null>(null);
  const [speed, setSpeed] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);


  
  const handleSatisfactionChange = (value: number) => {
      console.log('HomePage -> setSatisfaction:', value);
      setSatisfaction(value);
  };
  const handleRecommendationChange = (value: number) => {
      console.log('HomePage -> setRecommendation:', value);
      setRecommendation(value);
  };
  const handleSpeedChange = (value: number) => {
      console.log('HomePage -> setSpeed:', value);
      setSpeed(value);
  };

  // ... (definição da função handleFormSubmit - sem alterações) ...
   const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
     event.preventDefault();
     if (satisfaction === null || recommendation === null || speed === null) {
       alert('Por favor, responda todas as perguntas de escala.');
       return;
     }

    
     const ratingData = {
      satisfaction,
      recommendation,
      speed,
      feedback,
     
    };
     setIsLoading(true);
     try {
      const { error } = await supabase
        .from('ratings')
        .insert([ratingData], { returning: 'minimal' });

      if (error) {
        console.error('Erro ao salvar avaliação:', error);
      } else {
        console.log('Avaliação salva no Supabase!');
      }
    
      console.log('Avaliação salva no Supabase!');
      setIsSubmitted(true);
    
    } catch (error) {
       console.error("Erro ao salvar avaliação no Supabase:", error);
       alert(`Erro ao salvar sua avaliação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
       setIsSubmitted(false);
     } finally {
       setIsLoading(false);
     }
   };


  
  if (isSubmitted) {
    
    return (
      <div className={styles.thankYouContainer}>
        <h2>Obrigado pela sua avaliação!</h2>
        <p>Sua opinião nos ajuda a melhorar sempre.</p>
      </div>
    );
  } else {
    
    return (
      <div className={styles.ratingContainer}>
        <h1>Muito obrigado pela preferência!</h1>
        <p>Ficamos feliz em termos lhe atendido hoje.</p>
        <p>Antes de finalizarmos o atendimento, poderia responder algumas perguntas?</p>

        <form onSubmit={handleFormSubmit} className={styles.ratingForm}>
         
          <div className={styles.question}>
            <label>1. De 0 a 10, o quanto você ficou satisfeito com o nosso serviço?</label>
            <RatingScale
              questionId="satisfaction"
              selectedValue={satisfaction}
              onChange={handleSatisfactionChange}
            />
          </div>

          
          <div className={styles.question}>
            <label>2. De 0 a 10, o quanto você indicaria a um conhecido(a)?</label>
            <RatingScale
              questionId="recommendation"
              selectedValue={recommendation}
              onChange={handleRecommendationChange}
            />
          </div>

         
          <div className={styles.question}>
            <label>3. De 0 a 10, quanto você gostou da velocidade do atendimento?</label>
            <RatingScale
              questionId="speed"
              selectedValue={speed}
              onChange={handleSpeedChange}
            />
          </div>

          
          <div className={styles.question}>
            <label htmlFor="feedback-text">7. O que você gostou? O que podemos melhorar?</label>
            <textarea
              id="feedback-text"
              name="feedback"
              rows={4}
              placeholder="Seu feedback é muito importante..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className={styles.feedbackTextarea}
              disabled={isLoading}
            />
          </div>

          {/* Botão de Envio */}
          <div className={styles.buttonContainer}>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Enviar Avaliação'}
            </Button>
          </div>
        </form>
      </div>
    );
  }
};

export default HomePage;