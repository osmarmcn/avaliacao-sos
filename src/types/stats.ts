
import { Rating } from './rating'; 

// Tipo para as métricas individuais
export interface MetricStats {
  avg: number | null;
  min: number | null;
  max: number | null;
}

// Tipo para o objeto completo de estatísticas
export interface CalculatedStats {
  count: number;
  satisfaction: MetricStats;
  recommendation: MetricStats;
  speed: MetricStats;
  nps: number | null;
}
