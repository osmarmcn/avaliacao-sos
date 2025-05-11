
import { Rating } from '../types/rating'; // Ajuste o caminho
import { CalculatedStats } from '../types/stats'; // Ajuste o caminho

// Exporta a função para ser usada em outros lugares
export const calculateStatistics = (ratings: Rating[]): CalculatedStats => {
    const count = ratings.length;

    // Valores iniciais
    const initialStats: CalculatedStats = {
        count: 0,
        satisfaction: { avg: null, min: null, max: null },
        recommendation: { avg: null, min: null, max: null },
        speed: { avg: null, min: null, max: null },
        nps: null,
    };

    if (count === 0) {
        return initialStats;
    }

    // Variáveis para cálculo
    let sumSatisfaction = 0, minSatisfaction = 11, maxSatisfaction = -1;
    let sumRecommendation = 0, minRecommendation = 11, maxRecommendation = -1, promoters = 0, detractors = 0;
    let sumSpeed = 0, minSpeed = 11, maxSpeed = -1;

    // Itera sobre as avaliações filtradas
    ratings.forEach(r => {
        // Validação mínima (caso os dados venham inconsistentes)
        if (typeof r.satisfaction === 'number') {
            sumSatisfaction += r.satisfaction;
            if (r.satisfaction < minSatisfaction) minSatisfaction = r.satisfaction;
            if (r.satisfaction > maxSatisfaction) maxSatisfaction = r.satisfaction;
        }
        if (typeof r.recommendation === 'number') {
            sumRecommendation += r.recommendation;
            if (r.recommendation < minRecommendation) minRecommendation = r.recommendation;
            if (r.recommendation > maxRecommendation) maxRecommendation = r.recommendation;
            if (r.recommendation >= 9) promoters++;
            else if (r.recommendation <= 6) detractors++;
        }
        if (typeof r.speed === 'number') {
            sumSpeed += r.speed;
            if (r.speed < minSpeed) minSpeed = r.speed;
            if (r.speed > maxSpeed) maxSpeed = r.speed;
        }
    });

    // Calcula finais
    const calculatedNps = count > 0 ? Math.round(((promoters / count) - (detractors / count)) * 100) : null;

    // Função auxiliar para evitar NaN e formatar
    const calculateAvg = (sum: number, totalCount: number): number | null => {
        return totalCount > 0 ? parseFloat((sum / totalCount).toFixed(1)) : null;
    }

    return {
        count: count,
        satisfaction: {
            avg: calculateAvg(sumSatisfaction, count),
            min: minSatisfaction <= 10 ? minSatisfaction : null, // Retorna null se nenhum valor válido foi encontrado
            max: maxSatisfaction >= 0 ? maxSatisfaction : null, // Retorna null se nenhum valor válido foi encontrado
        },
        recommendation: {
             avg: calculateAvg(sumRecommendation, count),
            min: minRecommendation <= 10 ? minRecommendation : null,
            max: maxRecommendation >= 0 ? maxRecommendation : null,
        },
        speed: {
             avg: calculateAvg(sumSpeed, count),
            min: minSpeed <= 10 ? minSpeed : null,
            max: maxSpeed >= 0 ? maxSpeed : null,
        },
        nps: calculatedNps,
    };
};

export type BarChartData = ChartData<'bar', number[], string>;

export const prepareDistributionData = (
    ratings: Rating[],
    metric: 'satisfaction' | 'recommendation' | 'speed' // Qual métrica analisar
): BarChartData => {
    // Cria um array de 11 posições (índices 0 a 10), inicializado com 0
    const counts = Array(11).fill(0);

    // Conta as ocorrências de cada nota
    ratings.forEach(r => {
        const score = r[metric];
        // Verifica se a nota é um número válido entre 0 e 10
        if (typeof score === 'number' && score >= 0 && score <= 10) {
        counts[score]++;
        }
    });

    // Define os labels (0 a 10)
    const labels = counts.map((_, index) => index.toString());

    // Retorna a estrutura de dados esperada pelo react-chartjs-2
    return {
        labels: labels,
        datasets: [
        {
            label: `Distribuição de ${metric.charAt(0).toUpperCase() + metric.slice(1)}`, // Capitaliza o nome da métrica
            data: counts,
            backgroundColor: 'rgba(243, 130, 34, 0.6)', // Usa cor laranja com transparência (CSS var --color-orange)
            borderColor: 'rgba(255, 80, 0, 1)', // Usa cor laranja brilhante (CSS var --color-orange-bright)
            borderWidth: 1,
            borderRadius: 4, // Bordas levemente arredondadas
        },
        ],
    };
};