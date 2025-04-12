import { Activity } from "@shared/schema";
import { CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface ActivityChartProps {
  activities: Activity[];
  onSelectDate: (date: Date) => void;
}

export function ActivityChart({ activities, onSelectDate }: ActivityChartProps) {
  const [chartData, setChartData] = useState<Activity[]>([]);
  const { t, i18n } = useTranslation();
  
  useEffect(() => {
    if (activities && activities.length > 0) {
      // Agrupar atividades por dia (para caso de múltiplas atividades no mesmo dia)
      const activityMap = new Map<string, Activity>();
      
      // Para cada atividade, soma os steps, calories, etc. do mesmo dia
      activities.forEach(activity => {
        const dateKey = new Date(activity.date).toDateString();
        
        if (activityMap.has(dateKey)) {
          const existingActivity = activityMap.get(dateKey)!;
          existingActivity.steps += activity.steps;
          existingActivity.calories += activity.calories;
          existingActivity.minutes += activity.minutes;
          if (activity.distance && existingActivity.distance) {
            existingActivity.distance += activity.distance;
          }
        } else {
          activityMap.set(dateKey, { ...activity });
        }
      });
      
      // Converte o mapa para array e ordena por data
      const aggregatedActivities = Array.from(activityMap.values());
      const sortedActivities = [...aggregatedActivities].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      // Pegar os últimos 7 dias de atividades
      const latestActivities = sortedActivities.slice(-7);
      
      // Garantir que temos exatamente 7 dias (preencher com dias vazios se necessário)
      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 6);
      
      const completeWeekData: Activity[] = [];
      
      // Criar array com os últimos 7 dias
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(sevenDaysAgo);
        currentDate.setDate(sevenDaysAgo.getDate() + i);
        const dateString = currentDate.toDateString();
        
        // Verificar se temos atividade para este dia
        const activityForDay = latestActivities.find(
          a => new Date(a.date).toDateString() === dateString
        );
        
        if (activityForDay) {
          completeWeekData.push(activityForDay);
        } else {
          // Se não tiver atividade para este dia, criar um dia vazio
          completeWeekData.push({
            id: -1 * i, // ID negativo para indicar que é um placeholder
            userId: 1,
            date: currentDate,
            startTime: null,
            endTime: null,
            activityType: "walking",
            steps: 0,
            distance: 0,
            calories: 0,
            minutes: 0,
            heartRate: null,
            heartRateZones: null,
            elevationGain: null,
            elevationLoss: null,
            avgPace: null,
            maxPace: null,
            intensity: null,
            cadence: null,
            strideLength: null,
            routeData: null,
            gpsPoints: null,
            activityImage: null,
            feeling: null,
            weatherCondition: null,
            temperature: null,
            humidity: null,
            terrainType: null,
            equipmentUsed: null,
            notes: null,
            source: "manual",
            isRealTime: false,
            achievements: null
          });
        }
      }
      
      setChartData(completeWeekData);
    } else {
      // Se não tivermos atividades, exibir uma semana vazia
      const emptyWeekData: Activity[] = [];
      const today = new Date();
      
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(today.getDate() - 6 + i);
        
        emptyWeekData.push({
          id: -1 * i,
          userId: 1,
          date,
          startTime: null,
          endTime: null,
          activityType: "walking",
          steps: 0,
          distance: 0,
          calories: 0,
          minutes: 0,
          heartRate: null,
          heartRateZones: null,
          elevationGain: null,
          elevationLoss: null,
          avgPace: null,
          maxPace: null,
          intensity: null,
          cadence: null,
          strideLength: null,
          routeData: null,
          gpsPoints: null,
          activityImage: null,
          feeling: null,
          weatherCondition: null,
          temperature: null,
          humidity: null,
          terrainType: null,
          equipmentUsed: null,
          notes: null,
          source: "manual",
          isRealTime: false,
          achievements: null
        });
      }
      
      setChartData(emptyWeekData);
    }
  }, [activities]);
  
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    const locale = i18n.language === 'pt' ? 'pt-BR' : 'en-US';
    return date.toLocaleDateString(locale, { weekday: 'short', day: 'numeric' });
  };
  
  const handleBarClick = (date: Date) => {
    onSelectDate(date);
  };
  
  return (
    <CardContent className="px-6 pb-6">
      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">{t('activity.weeklyActivity')}</h4>
      <div className="h-64 bg-gray-50 dark:bg-[#1a2127] rounded-md p-4">
        <div className="h-full flex items-end space-x-2">
          {chartData.map((activity, index) => {
            // Calculate height based on steps (max 14000 steps)
            const heightPercentage = Math.min((activity.steps / 14000) * 100, 100);
            const isHighestActivity = activity.steps === Math.max(...chartData.map(a => a.steps));
            const date = new Date(activity.date);
            
            return (
              <div 
                key={index} 
                className="flex flex-col items-center space-y-1 flex-1 cursor-pointer"
                onClick={() => handleBarClick(date)}
              >
                <div 
                  className={`w-full rounded-t-sm transition-all duration-200 ${
                    isHighestActivity 
                      ? 'bg-blue-600 dark:bg-primary-500' 
                      : 'bg-blue-400 hover:bg-blue-500 dark:bg-primary-700 dark:hover:bg-primary-600'
                  }`}
                  style={{ height: `${heightPercentage}%` }}
                  title={`${activity.steps.toLocaleString()} ${t('activity.steps')}`}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(activity.date)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </CardContent>
  );
}
