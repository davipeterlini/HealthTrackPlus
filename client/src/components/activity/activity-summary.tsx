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
        <div className="bg-gray-50 dark:bg-gray-800 overflow-hidden shadow rounded-md">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 dark:bg-green-900 rounded-full p-3">
                <Footprints className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-5">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('activity.steps')}</h4>
                <div className="mt-1 flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{steps.toLocaleString()}</div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-green-200 dark:bg-green-800">
                  <div 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-600 dark:bg-green-500" 
                    style={{ width: `${stepsPercentage}%` }}
                  ></div>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {Math.round(stepsPercentage)}% {t('activity.dailyGoal')} ({stepsGoal.toLocaleString()} {t('activity.steps')})
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 overflow-hidden shadow rounded-md">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 dark:bg-primary-900 rounded-full p-3">
                <Flame className="h-5 w-5 text-blue-600 dark:text-primary-400" />
              </div>
              <div className="ml-5">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('activity.calories')}</h4>
                <div className="mt-1 flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{calories}</div>
                  {caloriesRemaining > 0 && (
                    <div className="ml-2 text-sm font-medium text-amber-600 dark:text-amber-400">
                      {caloriesRemaining} {t('health.remaining')}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200 dark:bg-primary-800">
                  <div 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 dark:bg-primary-500" 
                    style={{ width: `${caloriesPercentage}%` }}
                  ></div>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {Math.round(caloriesPercentage)}% {t('activity.dailyGoal')} ({caloriesGoal} kcal)
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 overflow-hidden shadow rounded-md">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 dark:bg-purple-900 rounded-full p-3">
                <Clock className="h-5 w-5 text-blue-600 dark:text-purple-400" />
              </div>
              <div className="ml-5">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('activity.activeMinutes')}</h4>
                <div className="mt-1 flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{activeMinutes}</div>
                  {activeMinutesChange !== 0 && (
                    <div className={`ml-2 text-sm font-medium ${activeMinutesChange > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {activeMinutesChange > 0 ? '+' : ''}{activeMinutesChange}%
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200 dark:bg-purple-800">
                  <div 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 dark:bg-purple-500" 
                    style={{ width: `${minutesPercentage}%` }}
                  ></div>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {Math.round(minutesPercentage)}% {t('activity.dailyGoal')} ({minutesGoal} min)
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 overflow-hidden shadow rounded-md">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 dark:bg-red-900 rounded-full p-3">
                <Heart className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-5">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('health.avgBPM')}</h4>
                <div className="mt-1 flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{avgHeartRate}</div>
                  <div className={`ml-2 text-sm font-medium 
                    ${heartRateStatus === 'normal' ? 'text-emerald-500 dark:text-emerald-400' : 
                      heartRateStatus === 'high' ? 'text-amber-500 dark:text-amber-400' : 
                      'text-red-500 dark:text-red-400'}`}
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
                <div className="overflow-hidden h-2 text-xs flex rounded bg-red-200 dark:bg-red-800">
                  <div 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-600 dark:bg-red-500" 
                    style={{ width: `${bpmPercentage}%` }}
                  ></div>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {Math.round(bpmPercentage)}% {t('activity.dailyGoal')} ({bpmGoal} BPM)
              </p>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  );
}
