
import React from 'react';
import Button from '../ui/Button/Button'; // Ajuste o caminho se necessário
import styles from './PeriodSelector.module.css';

type TimePeriod = 'day' | 'week' | 'month' | 'year';

interface PeriodSelectorProps {
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
  disabled?: boolean; // Para desabilitar durante o carregamento/processamento
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  selectedPeriod,
  onPeriodChange,
  disabled = false,
}) => {
  const periods: TimePeriod[] = ['day', 'week', 'month', 'year'];
  const periodLabels: Record<TimePeriod, string> = {
    day: 'Hoje',
    week: 'Esta Semana',
    month: 'Este Mês',
    year: 'Este Ano',
  };

  return (
    <div className={styles.periodSelectorContainer}>
      <h3>Selecionar Período:</h3>
      <div className={styles.periodButtons}>
        {periods.map((period) => (
          <Button
            key={period}
            onClick={() => onPeriodChange(period)}
            disabled={disabled}
            // Adiciona classe 'active' e usa a classe base do botão
            className={`${styles.periodButton} ${selectedPeriod === period ? styles.activePeriod : ''}`}
          >
            {periodLabels[period]}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default PeriodSelector;