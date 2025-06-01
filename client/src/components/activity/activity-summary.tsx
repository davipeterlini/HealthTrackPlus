import { Activity } from "@shared/schema";
import { DashboardStats } from "@shared/dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Footprints,
  Flame,
  Clock,
  Heart
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface ActivitySummaryProps {
  activities: Activity[];
  dashboardStats?: DashboardStats;
  selectedDate: Date;
}

export function ActivitySummary({ activities, dashboardStats, selectedDate }: ActivitySummaryProps) {
  const { t } = useTranslation();
  
  // Obter atividade para a data selecionada
  const todayActivity = activities.find(
    activity => new Date(activity.date).toDateString() === selectedDate.toDateString()
  );
  
  // Valores das estatísticas - priorizar dados do dashboard quando disponíveis
  const steps = todayActivity?.steps || 0;
  const calories = dashboardStats?.calories?.value || todayActivity?.calories || 0;
  const activeMinutes = dashboardStats?.activeMinutes?.value || todayActivity?.minutes || 0;
  const distance = todayActivity?.distance || 0;
  const avgHeartRate = dashboardStats?.heartRate?.value || todayActivity?.heartRate || 72;
  
  // Metas fixas - usadas para calcular porcentagens
  const stepsGoal = 10000;
  const caloriesGoal = 600;
  const minutesGoal = 60;
  const distanceGoal = 5;
  const bpmGoal = 80;
  
  // Tendências do dashboard para mostrar no UI
  const activeMinutesTrend = dashboardStats?.activeMinutes?.trend || 'up';
  const activeMinutesChange = dashboardStats?.activeMinutes?.change || 0;
  const caloriesRemaining = dashboardStats?.calories?.remaining || 0;
  const heartRateStatus = dashboardStats?.heartRate?.status || 'normal';
  
  // Calculate percentages
  const stepsPercentage = Math.min((steps / stepsGoal) * 100, 100);
  const caloriesPercentage = Math.min((calories / caloriesGoal) * 100, 100);
  const minutesPercentage = Math.min((activeMinutes / minutesGoal) * 100, 100);
  const bpmPercentage = Math.min((avgHeartRate / bpmGoal) * 100, 100);
  
  return (
    <CardContent className="p-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
        <div className="dark-inner-card overflow-hidden shadow rounded-md">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 dark-stat-icon-bg dark-stat-icon-green rounded-full p-3">
                <Footprints className="h-5 w-5 text-green-600 dark-text-accent-green" />
              </div>
              <div className="ml-5">
                <h4 className="text-sm font-medium text-gray-500 dark-text-muted">{t('activity.steps')}</h4>
                <div className="mt-1 flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark-text-title">{steps.toLocaleString()}</div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded dark-progress-bg">
                  <div 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center dark-progress-green" 
                    style={{ width: `${stepsPercentage}%` }}
                  ></div>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark-text-muted">
                {Math.round(stepsPercentage)}% {t('activity.dailyGoal')} ({stepsGoal.toLocaleString()} {t('activity.steps')})
              </p>
            </div>
          </div>
        </div>
        
        <div className="dark-inner-card overflow-hidden shadow rounded-md">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 dark-stat-icon-bg dark-stat-icon-blue rounded-full p-3">
                <Flame className="h-5 w-5 text-blue-600 dark-text-accent-blue" />
              </div>
              <div className="ml-5">
                <h4 className="text-sm font-medium text-gray-500 dark-text-muted">{t('activity.calories')}</h4>
                <div className="mt-1 flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark-text-title">{calories}</div>
                  {caloriesRemaining > 0 && (
                    <div className="ml-2 text-sm font-medium text-amber-600 dark-text-amber">
                      {caloriesRemaining} {t('health.remaining')}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded dark-progress-bg">
                  <div 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center dark-progress-blue" 
                    style={{ width: `${caloriesPercentage}%` }}
                  ></div>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark-text-muted">
                {Math.round(caloriesPercentage)}% {t('activity.dailyGoal')} ({caloriesGoal} kcal)
              </p>
            </div>
          </div>
        </div>
        
        <div className="dark-inner-card overflow-hidden shadow rounded-md">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 dark-stat-icon-bg dark-stat-icon-purple rounded-full p-3">
                <Clock className="h-5 w-5 text-blue-600 dark-text-accent-purple" />
              </div>
              <div className="ml-5">
                <h4 className="text-sm font-medium text-gray-500 dark-text-muted">{t('activity.activeMinutes')}</h4>
                <div className="mt-1 flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark-text-title">{activeMinutes}</div>
                  {activeMinutesChange !== 0 && (
                    <div className={`ml-2 text-sm font-medium ${activeMinutesChange > 0 ? 'text-green-600 dark-text-green' : 'text-red-600 dark-text-red'}`}>
                      {activeMinutesChange > 0 ? '+' : ''}{activeMinutesChange}%
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded dark-progress-bg">
                  <div 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center dark-progress-purple" 
                    style={{ width: `${minutesPercentage}%` }}
                  ></div>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark-text-muted">
                {Math.round(minutesPercentage)}% {t('activity.dailyGoal')} ({minutesGoal} min)
              </p>
            </div>
          </div>
        </div>
        
        <div className="dark-inner-card overflow-hidden shadow rounded-md">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 dark-stat-icon-bg dark-stat-icon-red rounded-full p-3">
                <Heart className="h-5 w-5 text-red-600 dark-text-accent-red" />
              </div>
              <div className="ml-5">
                <h4 className="text-sm font-medium text-gray-500 dark-text-muted">{t('health.avgBPM')}</h4>
                <div className="mt-1 flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark-text-title">{avgHeartRate}</div>
                  <div className={`ml-2 text-sm font-medium 
                    ${heartRateStatus === 'normal' ? 'text-emerald-500 dark-text-green' : 
                      heartRateStatus === 'high' ? 'text-amber-500 dark-text-amber' : 
                      'text-red-500 dark-text-red'}`}
                  >
                    {heartRateStatus === 'normal' ? t('health.healthy') : 
                     heartRateStatus === 'high' ? t('health.elevated') : 
                     t('health.low')}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded dark-progress-bg">
                  <div 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center dark-progress-red" 
                    style={{ width: `${bpmPercentage}%` }}
                  ></div>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark-text-muted">
                {Math.round(bpmPercentage)}% {t('activity.dailyGoal')} ({bpmGoal} BPM)
              </p>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  );
}
