
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { ChartOptions, ChartData } from 'chart.js'; // Importa tipos
import styles from './RatingChart.module.css';

// Define o tipo BarChartData aqui ou importe de types/stats.ts
type BarChartData = ChartData<'bar', number[], string>;

interface RatingChartProps {
  chartData: BarChartData;
  title: string;
}

// Opções padrão para os gráficos de barra (podem ser customizadas via props depois)
const defaultOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false, // Permite controlar altura pelo container CSS
    plugins: {
      legend: {
        display: false, // Geralmente desnecessário se o título for claro
      },
      title: {
        display: true,
        // O 'text' será passado via props
        font: {
            size: 14, // Tamanho do título
        }
      },
      tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          titleColor: '#fff',
          bodyColor: '#fff',
      }
    },
    scales: {
      y: {
        beginAtZero: true, // Garante que o eixo Y comece em 0
        ticks: {
            // Garante que ticks sejam apenas inteiros se apropriado
             precision: 0
        }
      },
      x: {
         // Estilos para eixo X se necessário
      }
    },
  };


const RatingChart: React.FC<RatingChartProps> = ({ chartData, title }) => {
  // Mescla opções padrão com título específico
  const options: ChartOptions<'bar'> = {
    ...defaultOptions,
    plugins: {
      ...defaultOptions.plugins,
      title: {
        ...defaultOptions.plugins?.title,
        display: true,
        text: title, // Define o título passado via prop
      },
    },
  };

  // Evita renderizar o gráfico se não houver datasets (evita erro Chart.js)
  if (!chartData || !chartData.datasets || chartData.datasets.length === 0 || chartData.datasets.every(ds => !ds.data || ds.data.length === 0) ) {
     return <div className={styles.chartContainer}><p>Sem dados para exibir.</p></div>;
  }


  return (
    <div className={styles.chartContainer}>
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default RatingChart;