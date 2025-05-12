// ComparativeChart.tsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartOptions, // Import ChartOptions for better typing
  ChartData    // Import ChartData for better typing
} from 'chart.js';
import { GroupedPeriodStats } from '../../utils/statistics'; // Certifique-se que este caminho está correto

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Interface para a estrutura do objeto que está sendo REALMENTE recebido pela prop 'data'
interface ReceivedDataWrapper {
  data: GroupedPeriodStats[]; // O array de dados que o gráfico realmente precisa
  best: string;
  worst: string;
}

interface Props {
  // A prop 'data' agora espera o objeto 'ReceivedDataWrapper'
  data: ReceivedDataWrapper | undefined;
  title: string;
}

const ComparativeChart: React.FC<Props> = ({ data: receivedDataObject, title }) => {
  // 'receivedDataObject' é o objeto { data: [...], best: '...', worst: '...' }
  console.log('Dados (objeto wrapper) recebidos para o gráfico:', receivedDataObject);

  // Extraímos o array de dados real de dentro do objeto recebido
  const actualChartArray = receivedDataObject?.data;

  // Verificamos se 'actualChartArray' é de fato um array
  if (!Array.isArray(actualChartArray)) {
    console.error(
      'ComparativeChart: A propriedade `data` dentro do objeto recebido deve ser um array válido, mas recebeu:',
      actualChartArray
    );
    return <p style={{ color: 'red' }}>Erro ao carregar gráfico: formato de dados interno inválido.</p>;
  }

  // Preparamos os dados para o Chart.js
  const chartJsData: ChartData<'bar'> = { // Tipagem explícita para ChartData
    labels: actualChartArray.map(d => d.label),
    datasets: [
      {
        label: 'Satisfação',
        data: actualChartArray.map(d => d.stats.satisfaction?.avg ?? 0),
        backgroundColor: '#4caf50',
      },
      {
        label: 'Recomendação',
        data: actualChartArray.map(d => d.stats.recommendation?.avg ?? 0),
        backgroundColor: '#2196f3',
      },
      {
        label: 'Velocidade',
        data: actualChartArray.map(d => d.stats.speed?.avg ?? 0),
        backgroundColor: '#ff9800',
      },
    ],
  };

  // Opções do gráfico
  const chartOptions: ChartOptions<'bar'> = { // Tipagem explícita para ChartOptions
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const, // 'as const' ajuda com a tipagem estrita de Chart.js
      },
      tooltip: {
        mode: 'index' as const,
      },
    },
    scales: { // Adicionado para garantir que o eixo Y comece em 0, se desejado
      y: {
        beginAtZero: true,
        // Você pode adicionar max se os valores forem sempre entre 0 e 10 ou 0 e 100, por exemplo
        // max: 10, // ou 100, dependendo da sua escala de satisfação/recomendação/velocidade
      },
    },
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>{title}</h3>
      {actualChartArray.length > 0 ? (
        <Bar data={chartJsData} options={chartOptions} />
      ) : (
        <p>Não há dados para exibir no gráfico.</p> // Mensagem para dados vazios
      )}
    </div>
  );
};

export default ComparativeChart;