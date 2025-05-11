// src/pages/dashboard/DashboardPage.tsx (REFATORADO com Componentes)

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Supabase e Autenticação
import { supabase } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';


import { Rating } from '../../types/rating';
import { CalculatedStats } from '../../types/stats';

import { BarChartData } from '../../components/Dashboard/RatingChart'; 


import { calculateStatistics, prepareDistributionData } from '../../utils/statistics'; 
import Button from '../../components/ui/Button/Button';
import PeriodSelector from '../../components/Dashboard/PeriodSelector'; 
import StatsCard from '../../components/Dashboard/StatsCard';      
import RatingChart from '../../components/Dashboard/RatingChart';     
import FeedbackList from '../../components/Dashboard/FeedbackList';   
import styles from './DashboardPage.module.css';


import {
  parseISO, isWithinInterval, startOfDay, endOfDay, startOfWeek, endOfWeek,
  startOfMonth, endOfMonth, startOfYear, endOfYear,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

type TimePeriod = 'day' | 'week' | 'month' | 'year';


const initialChartData: BarChartData = { labels: [], datasets: [] };

const DashboardPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  
  const [allRatings, setAllRatings] = useState<Rating[]>([]);
  const [filteredRatings, setFilteredRatings] = useState<Rating[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('day');
  const [stats, setStats] = useState<CalculatedStats | null>(null);
  // Estados para os dados dos gráficos
  const [satisfactionChartData, setSatisfactionChartData] = useState<BarChartData>(initialChartData);
  const [recommendationChartData, setRecommendationChartData] = useState<BarChartData>(initialChartData);
  const [speedChartData, setSpeedChartData] = useState<BarChartData>(initialChartData);
 
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    const fetchAllRatings = async () => {
     
        setIsLoading(true); setError(null);
        const { data, error: dbError } = await supabase.from('ratings').select('*').order('created_at', { ascending: false });
        console.log("Supabase fetch response:", { data, dbError });
        if (dbError) { setError(`Erro: ${dbError.message}`); setAllRatings([]); }
        else if (data) {
            const ratingsWithDateObjects = data.map(r => ({ ...r, created_at_date: r.created_at ? parseISO(r.created_at) : null }));
            setAllRatings(ratingsWithDateObjects as Rating[]);
        } else { setAllRatings([]); }
        setIsLoading(false);
    };
    fetchAllRatings();
  }, []);


  useEffect(() => {
    if (isLoading || !allRatings) { setFilteredRatings([]); setStats(null); return; }
    setIsProcessing(true);

    
    const now = new Date(); let interval: Interval;
    switch (selectedPeriod) { /* ... cases ... */
        case 'week': interval = { start: startOfWeek(now, { locale: ptBR }), end: endOfWeek(now, { locale: ptBR }) }; break;
        case 'month': interval = { start: startOfMonth(now), end: endOfMonth(now) }; break;
        case 'year': interval = { start: startOfYear(now), end: endOfYear(now) }; break;
        case 'day': default: interval = { start: startOfDay(now), end: endOfDay(now) }; break;
    }

  
    const filtered = allRatings.filter(rating =>
        rating.created_at_date && isWithinInterval(rating.created_at_date, interval)
    );
    setFilteredRatings(filtered);

    
    setStats(calculateStatistics(filtered));

    
    setSatisfactionChartData(prepareDistributionData(filtered, 'satisfaction'));
    setRecommendationChartData(prepareDistributionData(filtered, 'recommendation'));
    setSpeedChartData(prepareDistributionData(filtered, 'speed'));

    setIsProcessing(false);
  }, [allRatings, selectedPeriod, isLoading]); // Dependências

  
  const handlePeriodChange = (period: TimePeriod) => { setSelectedPeriod(period); };
  const handleLogout = async () => {
    console.log("Logout - Botão clicado"); 
    try {
      
      await logout();
      console.log("Logout - Função logout() do contexto executada");

      
      navigate('/login');
      console.log("Logout - Redirecionado para /login");

    } catch (err) {
       
       console.error("Logout - Erro pego no handleLogout:", err);
       
       navigate('/login');
    }
  };

  
  if (isLoading) { return <div className={styles.loading}>Carregando...</div>; }
  if (error) { return <div className={styles.error}>{error}</div>; }

  console.log('--- RENDER DASHBOARD ---');
    console.log('isLoading:', isLoading); // Estado de loading inicial
    console.log('isProcessing:', isProcessing); // Estado de processamento/filtro
    console.log('selectedPeriod:', selectedPeriod);
    console.log('allRatings count:', allRatings.length);
    console.log('filteredRatings count:', filteredRatings.length);
    console.log('filteredRatings data:', filteredRatings); // Mostra os dados filtrados
    console.log('stats:', stats); // Mostra as estatísticas calculadas
    console.log('satisfactionChartData:', satisfactionChartData); // Mostra os dados do gráfico

  return (
    <div className={styles.dashboardContainer}>
      {/* Cabeçalho */}
      <header className={styles.header}>
        <h1>Dashboard de Avaliações</h1>
        <Button onClick={handleLogout} className={styles.logoutButton}>Sair</Button>
      </header>

      {/* Seletor de Período (Componente) */}
      <PeriodSelector
        selectedPeriod={selectedPeriod}
        onPeriodChange={handlePeriodChange}
        disabled={isProcessing}
      />

      {/* Área de Estatísticas (Componente + map) */}
      {isProcessing ? (
          <div className={styles.loading}>Calculando...</div>
      ) : (
          <div className={styles.statsGrid}>
              {/* Renderiza os StatsCards dinamicamente */}
              <StatsCard label="Avaliações" value={stats?.count ?? 0} />
              <StatsCard label="NPS" value={stats?.nps ?? '-'} />
              <StatsCard label="Média Satisf." value={stats?.satisfaction?.avg ?? '-'} />
              <StatsCard label="Min Satisf." value={stats?.satisfaction?.min ?? '-'} />
              <StatsCard label="Max Satisf." value={stats?.satisfaction?.max ?? '-'} />
              <StatsCard label="Média Recom." value={stats?.recommendation?.avg ?? '-'} />
              <StatsCard label="Min Recom." value={stats?.recommendation?.min ?? '-'} />
              <StatsCard label="Max Recom." value={stats?.recommendation?.max ?? '-'} />
              <StatsCard label="Média Veloc." value={stats?.speed?.avg ?? '-'} />
              <StatsCard label="Min Veloc." value={stats?.speed?.min ?? '-'} />
              <StatsCard label="Max Veloc." value={stats?.speed?.max ?? '-'} />
          </div>
      )}

      {/* Área de Gráficos (Componente) */}
      <div className={styles.chartsArea}>
          {/* Verifica se há dados filtrados antes de tentar renderizar gráficos */}
          {!isProcessing && filteredRatings.length > 0 ? (
              <>
                 <RatingChart chartData={satisfactionChartData} title="Distribuição de Satisfação" />
                 <RatingChart chartData={recommendationChartData} title="Distribuição de Recomendação (NPS)" />
                 <RatingChart chartData={speedChartData} title="Distribuição de Velocidade" />
              </>
          ) : !isProcessing ? (
               <p className={styles.noChartData}>Sem dados para exibir gráficos neste período.</p>
          ) : null }
      </div>

      {/* Lista de Feedbacks (Componente) */}
      <div className={styles.feedbackSection}>
        <h2>Feedbacks ({filteredRatings.length})</h2>
        <FeedbackList ratings={filteredRatings} isLoading={isProcessing} />
      </div>

    </div>
  );
};

export default DashboardPage;