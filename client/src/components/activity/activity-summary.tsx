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
  
  // Find activity for the selected date
  const todayActivity = activities.find(
    activity => new Date(activity.date).toDateString() === selectedDate.toDateString()
  );
  
  // Usar dados do dashboard se disponíveis, ou dados da atividade específica se não
  // Default values from dashboard or activity
  const steps = todayActivity?.steps || 0;
  const calories = dashboardStats?.calories?.value || todayActivity?.calories || 0;
  const activeMinutes = dashboardStats?.activeMinutes?.value || todayActivity?.minutes || 0;
  const distance = todayActivity?.distance || 0;
  const source = todayActivity?.source || 'manual';
  const avgHeartRate = dashboardStats?.heartRate?.value || todayActivity?.heartRate || 72;
  
  // Goals - use dashboard goals if available
  const stepsGoal = 10000; // valor padrão fixo como na interface
  const caloriesGoal = 600; // valor padrão fixo
  const minutesGoal = 60; // valor padrão fixo
  const distanceGoal = 5; // 5km per day
  const bpmGoal = 80; // valor padrão fixo
  
  // Trends from dashboard
  const stepsChange = 0; // não temos essa informação no dashboard atual
  const caloriesRemaining = dashboardStats?.calories?.remaining || 0;
  const minutesChange = dashboardStats?.activeMinutes?.change || 0;
  
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
                  {stepsChange !== 0 && (
                    <div className={`ml-2 text-sm font-medium ${stepsChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stepsChange > 0 ? '+' : ''}{stepsChange}%
                    </div>
                  )}
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
                  <div className="ml-2 text-sm font-medium text-emerald-500 dark:text-emerald-400">
                    {t('health.healthy')}
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
