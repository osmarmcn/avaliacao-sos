
import { Rating } from './rating'; 


export interface MetricStats {
  avg: number | null;
  min: number | null;
  max: number | null;
}


export interface CalculatedStats {
  count: number;
  satisfaction: MetricStats;
  recommendation: MetricStats;
  speed: MetricStats;
  nps: number | null;
}
