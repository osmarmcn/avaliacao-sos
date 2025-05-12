// src/pages/dashboard/DashboardPage.tsx (REFATORADO com Componentes)


import { groupRatingsByPeriod } from '../../utils/statistics';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Supabase e Autenticação
import { supabase } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { prepareComparativeChart } from '../../utils/statistics';


import { Rating } from '../../types/rating';
import { CalculatedStats } from '../../types/stats';

import { BarChartData } from '../../components/dashboard/RatingChart'; 


import { calculateStatistics, prepareDistributionData, GroupedPeriodStats } from '../../utils/statistics'; 
import Button from '../../components/ui/Button/Button';
import PeriodSelector from '../../components/dashboard/PeriodSelector'; 
import StatsCard from '../../components/dashboard/StatsCard';      
import RatingChart from '../../components/dashboard/RatingChart';     
import FeedbackList from '../../components/dashboard/FeedbackList';   
import styles from './DashboardPage.module.css';


import {
  parseISO, isWithinInterval, startOfDay, endOfDay, startOfWeek, endOfWeek,
  startOfMonth, endOfMonth, startOfYear, endOfYear, Interval
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
// import ComparativeChart from '../../components/ComparativeChart/ComparativeChart';

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

  const [weeklyComparison, setWeeklyComparison] = useState<GroupedPeriodStats[]>([]);
  const [monthlyComparison, setMonthlyComparison] = useState<GroupedPeriodStats[]>([]);
  const [yearlyComparison, setYearlyComparison] = useState<GroupedPeriodStats[]>([]);



  
  useEffect(() => {
    const fetchAllRatings = async () => {
     
        setIsLoading(true); setError(null);
        const { data, error: dbError } = await supabase.from('ratings').select('*').order('created_at', { ascending: false })
        console.log("Supabase fetch response:", { data, dbError })
        if (dbError) { setError(`Erro: ${dbError.message}`); setAllRatings([]); }
        else if (data) {
            const ratingsWithDateObjects = data.map(r => ({ ...r, created_at_date: r.created_at ? parseISO(r.created_at) : null }))
            setAllRatings(ratingsWithDateObjects as Rating[])
        } else { setAllRatings([]); }
        setIsLoading(false)
    };
    fetchAllRatings()
  }, [])


  useEffect(() => {
    if (isLoading || !allRatings) { setFilteredRatings([]); setStats(null); return; }
    setIsProcessing(true)

    
    const now = new Date(); let interval: Interval
    switch (selectedPeriod) {
        case 'week': interval = { start: startOfWeek(now, { locale: ptBR }), end: endOfWeek(now, { locale: ptBR }) }; break
        case 'month': interval = { start: startOfMonth(now), end: endOfMonth(now) }; break
        case 'year': interval = { start: startOfYear(now), end: endOfYear(now) }; break
        case 'day': default: interval = { start: startOfDay(now), end: endOfDay(now) }; break
    }

  
    const filtered = allRatings.filter(rating =>
        rating.created_at_date && isWithinInterval(rating.created_at_date, interval)
    );
    setFilteredRatings(filtered)

    
    setStats(calculateStatistics(filtered))

    
    setSatisfactionChartData(prepareDistributionData(filtered, 'satisfaction'))
    setRecommendationChartData(prepareDistributionData(filtered, 'recommendation'))
    setSpeedChartData(prepareDistributionData(filtered, 'speed'))

    const weekly = prepareComparativeChart(allRatings, 'week')
    setWeeklyComparison(weekly.data)

    const monthly = prepareComparativeChart(allRatings, 'month')
    setMonthlyComparison(monthly.data)

    const yearly = prepareComparativeChart(allRatings, 'year')
    setYearlyComparison(yearly.data)

    setWeeklyComparison(groupRatingsByPeriod(allRatings, 'week'))
    setMonthlyComparison(groupRatingsByPeriod(allRatings, 'month'))
    setYearlyComparison(groupRatingsByPeriod(allRatings, 'year'))

    setIsProcessing(false)
  }, [allRatings, selectedPeriod, isLoading])

  useEffect(() => {
  if (allRatings.length === 0) return;

  const weekly = prepareComparativeChart(allRatings, 'week');
  const monthly = prepareComparativeChart(allRatings, 'month');
  const yearly = prepareComparativeChart(allRatings, 'year');

  setWeeklyComparison(weekly);
  setMonthlyComparison(monthly);
  setYearlyComparison(yearly);
}, [allRatings]);

  
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

  console.log('--- RENDER DASHBOARD ---')
    console.log('isLoading:', isLoading)
    console.log('isProcessing:', isProcessing)
    console.log('selectedPeriod:', selectedPeriod)
    console.log('allRatings count:', allRatings.length)
    console.log('filteredRatings count:', filteredRatings.length);
    console.log('filteredRatings data:', filteredRatings)
    console.log('stats:', stats)
    console.log('satisfactionChartData:', satisfactionChartData)

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
      {/* <div className={styles.chartsArea}>
         
          {!isProcessing && filteredRatings.length > 0 ? (
            <>
              <RatingChart chartData={satisfactionChartData} title="Distribuição de Satisfação" />
              <RatingChart chartData={recommendationChartData} title="Distribuição de Recomendação (NPS)" />
              <RatingChart chartData={speedChartData} title="Distribuição de Velocidade" />
            </>
          ) : !isProcessing ? (
            <p className={styles.noChartData}>Sem dados para exibir gráficos neste período.</p>
          ) : null}

         
          {!isProcessing && allRatings.length > 0 && (
            <div className={styles.comparativeSection}>
              <h2>Comparativos</h2>
              <ComparativeChart data={weeklyComparison} title="Comparativo Semanal" />
              <ComparativeChart data={monthlyComparison} title="Comparativo Mensal" />
              <ComparativeChart data={yearlyComparison} title="Comparativo Anual" />
            </div>
          )}
      </div> */}

      {/* Lista de Feedbacks (Componente) */}
      <div className={styles.feedbackSection}>
        <h2>Feedbacks ({filteredRatings.length})</h2>
        <FeedbackList ratings={filteredRatings} isLoading={isProcessing} />
      </div>

    </div>
  );
};

export default DashboardPage;