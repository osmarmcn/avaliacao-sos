
import React from 'react';
import styles from './StatsCard.module.css';

interface StatsCardProps {
  label: string;
  value: string | number | null | undefined;
  unit?: string; // Unidade opcional (ex: '%' para NPS)
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, unit }) => {
  const displayValue = value !== null && value !== undefined ? value : '-';

  return (
    <div className={styles.statsCard}>
      <span className={styles.statsLabel}>{label}</span>
      <span className={styles.statsValue}>
        {displayValue}
        {unit && displayValue !== '-' ? unit : ''}
      </span>
    </div>
  );
};

export default StatsCard;