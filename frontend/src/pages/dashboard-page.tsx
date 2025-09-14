import React, { useState, useEffect, useMemo, useCallback } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card } from "@/components/ui/card";
import { 
  Activity, Heart, Moon, Apple, Droplet, AlertCircle, 
  FileText, Brain, Pill, Calculator, Clock, BellIcon, Timer, Star, Baby
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { MedicalExam } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { DashboardStats } from "@shared/dashboard";
import { useDashboardSettings } from "@/hooks/use-dashboard-settings";
import { ContextualTipsOverlay } from "@/components/ai-health-tips/contextual-tips-overlay";
import { StatCard, ModuleCard, HydrationTracker, ExamAlert } from "@/components/dashboard/memoized-widgets";
import { WeeklyActivityChart } from "@/components/dashboard/weekly-activity-chart";

export default React.memo(function DashboardPage() {
  const { t } = useTranslation();
  const { settings } = useDashboardSettings();
  
  const { data: exams = [] } = useQuery<MedicalExam[]>({
    queryKey: ["/api/exams"],
  });
  
  const { data: dashboardStats, isLoading: isLoadingStats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard"],
  });
  
  // Estado para controle de hidratação
  const [waterAmount, setWaterAmount] = useState(1300);
  
  // Valores seguros para hidratação
  const waterGoal = dashboardStats?.hydration?.goal || 2500;
  const waterPercentage = Math.min((waterAmount / waterGoal) * 100, 100);
  
  // Funções para controlar água
  const addWater = (amount: number) => {
    setWaterAmount(prev => Math.min(prev + amount, waterGoal));
  };
  
  const removeWater = (amount: number) => {
    setWaterAmount(prev => Math.max(prev - amount, 0));
  };
  
  // Atualizar waterAmount quando os dados da API chegarem
  useEffect(() => {
    if (!isLoadingStats && dashboardStats && dashboardStats.hydration) {
      setWaterAmount(dashboardStats.hydration.current || 1300);
    }
  }, [isLoadingStats, dashboardStats]);
  
  // Filtrar exames que precisam de atenção (status não é "Normal")
  const alertExams = exams
    .filter(exam => exam.status === "Attention" || exam.status === "Critical" || exam.status === "High" || exam.status === "Low")
    .slice(0, 3); // Limitar a 3 exames
    
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Normal":
        return "bg-emerald-50 text-emerald-500 border-emerald-200";
      case "Attention":
      case "High":
        return "bg-amber-50 text-amber-500 border-amber-200";
      case "Critical":
      case "Low":
        return "bg-red-50 text-red-500 border-red-200";
      default:
        return "bg-gray-50 text-gray-500 border-gray-200";
    }
  };
  
  return (
    <MainLayout title={t('health.greeting')}>
      <p className="text-gray-600 dark:text-gray-400 mb-2 xxs:mb-3 xs:mb-4 sm:mb-5 text-sm sm:text-base">{t('health.todayOverview')}</p>

      {/* Big Numbers */}
      <div className="responsive-grid-4 mb-2 xxs:mb-3 xs:mb-4 w-full max-w-full overflow-hidden box-border">
        <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 p-1.5 xxs:p-2 xs:p-3 md:p-4 rounded-lg shadow-md w-full max-w-full overflow-hidden box-border box-border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-600 dark:text-gray-400 mb-1 xxs:mb-1.5 responsive-text-sm">{t('activity.activeMinutes')}</p>
              <h2 className="responsive-title-xl font-bold mb-1 xxs:mb-1.5">
                {isLoadingStats ? '...' : dashboardStats?.activeMinutes?.value || 45}
              </h2>
              <p className={`flex items-center responsive-text-sm ${dashboardStats?.activeMinutes?.trend === 'up' ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                <span className="mr-1">{dashboardStats?.activeMinutes?.trend === 'up' ? '↑' : '↓'}</span>
                {isLoadingStats ? '...' : dashboardStats?.activeMinutes?.change || 15}% {t('health.stepsUp')}
              </p>
            </div>
            <div className="bg-purple-100 dark:bg-[#2a3137] p-1.5 xxs:p-2 xs:p-2.5 rounded-full shadow-sm">
              <Clock className="w-3.5 h-3.5 xxs:w-4 xxs:h-4 xs:w-5 xs:h-5 text-purple-500 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 p-2 xxs:p-3 xs:p-4 md:p-5 rounded-lg shadow-md w-full max-w-full overflow-hidden box-border">
          <div className="flex justify-between items-start w-full max-w-full overflow-hidden box-border">
            <div>
              <p className="text-slate-600 dark:text-gray-400 mb-1 xxs:mb-1.5 responsive-text-sm">{t('health.calories')}</p>
              <h2 className="responsive-title-xl font-bold mb-1 xxs:mb-1.5">
                {isLoadingStats ? '...' : dashboardStats?.calories?.value?.toLocaleString() || '1,450'}
              </h2>
              <p className="text-red-500 dark:text-red-400 responsive-text-sm">
                <span className="mr-1">↓</span>
                {isLoadingStats ? '...' : dashboardStats?.calories?.remaining || 320} {t('health.remaining')}
              </p>
            </div>
            <div className="bg-emerald-100 dark:bg-[#2a3137] p-1.5 xxs:p-2 xs:p-2.5 rounded-full shadow-sm">
              <Apple className="w-3.5 h-3.5 xxs:w-4 xxs:h-4 xs:w-5 xs:h-5 text-emerald-500 dark:text-emerald-400" />
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 p-2 xxs:p-3 xs:p-4 md:p-5 rounded-lg shadow-md w-full max-w-full overflow-hidden box-border">
          <div className="flex justify-between items-start w-full max-w-full overflow-hidden box-border">
            <div>
              <p className="text-slate-600 dark:text-gray-400 mb-1 xxs:mb-1.5 responsive-text-sm">{t('health.sleep')}</p>
              <h2 className="responsive-title-xl font-bold mb-1 xxs:mb-1.5">
                {isLoadingStats ? '...' : `${dashboardStats?.sleep?.value || 7.5}h`}
              </h2>
              <p className={`flex items-center responsive-text-sm ${dashboardStats?.sleep?.trend === 'up' ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                <span className="mr-1">{dashboardStats?.sleep?.trend === 'up' ? '↑' : '↓'}</span>
                {isLoadingStats ? '...' : dashboardStats?.sleep?.change || 30}min {t('health.moreMinutes')}
              </p>
            </div>
            <div className="bg-emerald-100 dark:bg-[#2a3137] p-1.5 xxs:p-2 xs:p-2.5 rounded-full shadow-sm">
              <Moon className="w-3.5 h-3.5 xxs:w-4 xxs:h-4 xs:w-5 xs:h-5 text-emerald-500 dark:text-emerald-400" />
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 p-2 xxs:p-3 xs:p-4 md:p-5 rounded-lg shadow-md w-full max-w-full overflow-hidden box-border">
          <div className="flex justify-between items-start w-full max-w-full overflow-hidden box-border">
            <div>
              <p className="text-slate-600 dark:text-gray-400 mb-1 xxs:mb-1.5 responsive-text-sm">{t('health.avgBPM')}</p>
              <h2 className="responsive-title-xl font-bold mb-1 xxs:mb-1.5">
                {isLoadingStats ? '...' : dashboardStats?.heartRate?.value || 72}
              </h2>
              <p className={`flex items-center responsive-text-sm ${dashboardStats?.heartRate?.status === 'normal' ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                <span className="mr-1">{dashboardStats?.heartRate?.trend === 'down' ? '↓' : '↑'}</span>
                {t('health.healthy')}
              </p>
            </div>
            <div className="bg-emerald-100 dark:bg-[#2a3137] p-1.5 xxs:p-2 xs:p-2.5 rounded-full shadow-sm">
              <Heart className="w-3.5 h-3.5 xxs:w-4 xxs:h-4 xs:w-5 xs:h-5 text-emerald-500 dark:text-emerald-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Activity Chart */}
      {settings.showActivityTracker && (
        <WeeklyActivityChart 
          activityData={dashboardStats?.weeklyActivity?.days || null}
          isLoading={isLoadingStats}
        />
      )}

      {/* Hydration & Sleep Trackers */}
      <div className="responsive-grid-2 mb-2 xxs:mb-3 xs:mb-4 w-full max-w-full overflow-hidden box-border">
        {/* Hydration Tracker */}
        {settings.showWaterTracker && (
          <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 p-2 xxs:p-3 xs:p-4 sm:p-5 shadow-md rounded-lg w-full max-w-full overflow-hidden box-border">
            <div className="flex justify-between items-center mb-2 xxs:mb-3 xs:mb-4">
              <Link to="/hydration" className="group">
                <h3 className="text-sm xxs:text-base xs:text-lg sm:text-xl font-semibold text-slate-800 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">{t('health.hydration')}</h3>
              </Link>
              <div className="relative w-5 xxs:w-6 xs:w-8 h-4 xxs:h-5">
                <Droplet className="absolute h-4 w-4 xxs:h-5 xxs:w-5 text-blue-500 dark:text-blue-400 right-0" />
                <Droplet className="absolute h-3 w-3 xxs:h-4 xxs:w-4 text-teal-400 dark:text-teal-300 left-0 top-0.5" />
              </div>
            </div>
            
            <div className="space-y-2 xxs:space-y-3 xs:space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-800 dark:text-white text-sm xxs:text-base xs:text-lg font-medium">{waterAmount} ml</span>
                <span className="text-slate-500 dark:text-gray-400 text-[10px] xxs:text-xs">{t('health.goal')}: {waterGoal} ml</span>
              </div>
              
              <div className="h-1.5 xxs:h-2 xs:h-2.5 w-full bg-slate-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-teal-400 dark:bg-teal-500 rounded-full transition-all duration-300" 
                  style={{ width: `${waterPercentage}%` }}
                ></div>
              </div>
              
              <div className="flex justify-center gap-2 xxs:gap-2.5 xs:gap-3 mt-2 xxs:mt-3 xs:mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => removeWater(150)}
                  className="border-teal-400 dark:border-teal-500 border bg-transparent hover:bg-teal-50 dark:hover:bg-teal-900/20 text-teal-500 dark:text-blue-400 rounded-full h-6 xxs:h-7 xs:h-8 px-1.5 xxs:px-2 xs:px-2.5"
                >
                  <span className="text-teal-500 dark:text-blue-400 mr-0.5">−</span>
                  <span className="text-teal-500 dark:text-blue-400 text-[10px] xxs:text-xs">150ml</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => addWater(250)}
                  className="border-blue-400 dark:border-blue-500 border bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 dark:text-blue-400 rounded-full h-6 xxs:h-7 xs:h-8 px-1.5 xxs:px-2 xs:px-2.5"
                >
                  <span className="text-blue-500 dark:text-blue-400 mr-0.5">+</span>
                  <span className="text-blue-500 dark:text-blue-400 text-[10px] xxs:text-xs">250ml</span>
                </Button>
              </div>
            </div>
          </Card>
        )}
        
        {/* Sleep Tracker */}
        {settings.showSleepTracker && (
          <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 p-2 xxs:p-3 xs:p-4 shadow-md rounded-lg w-full max-w-full overflow-hidden box-border">
            <div className="flex justify-between items-center mb-1 xxs:mb-2">
              <h3 className="text-xs xxs:text-sm sm:text-base font-semibold text-slate-800 dark:text-white">{t('health.sleepQuality')}</h3>
              <Moon className="h-3.5 w-3.5 xxs:h-4 xxs:w-4 text-indigo-500 dark:text-indigo-300" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] xxs:text-[10px] xs:text-xs">
                <div className="flex items-center">
                  <Moon className="h-2.5 w-2.5 xxs:h-3 xxs:w-3 text-slate-500 dark:text-gray-400 mr-0.5 xxs:mr-1" />
                  <span className="text-slate-500 dark:text-gray-400">{localStorage.getItem('i18nextLng')?.startsWith('en') ? '11:30 PM' : '23:30'}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-slate-500 dark:text-gray-400">{localStorage.getItem('i18nextLng')?.startsWith('en') ? '7:00 AM' : '07:00'}</span>
                  <span className="h-2.5 w-2.5 xxs:h-3 xxs:w-3 text-yellow-500 dark:text-yellow-400 ml-0.5 xxs:ml-1">☀</span>
                </div>
              </div>
              <div className="mt-1.5 xxs:mt-2 xs:mt-3">
                <div className="flex items-center">
                  <h2 className="text-xl xxs:text-2xl xs:text-3xl font-bold text-slate-800 dark:text-white">
                    {isLoadingStats ? '...' : `${dashboardStats?.sleep?.value || 7.5}h`}
                  </h2>
                  <span className="ml-auto text-green-500 dark:text-green-400 text-xs xxs:text-sm xs:text-base">{t('health.goodQuality')}</span>
                </div>
                <p className="text-[10px] xxs:text-xs text-slate-500 dark:text-gray-400 mt-0.5">{t('health.totalTime')}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
      
      {/* Medication & Exam Alerts */}
      <div className="responsive-grid-2 mb-2 xxs:mb-3 xs:mb-4 w-full max-w-full overflow-hidden box-border">
        {/* Medication Reminders */}
        {settings.showMedicationTracker && (
          <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 p-2 xxs:p-3 xs:p-4 shadow-md w-full max-w-full overflow-hidden box-border">
            <div className="flex justify-between items-center mb-1.5 xxs:mb-2 sm:mb-3">
              <h3 className="text-xs xxs:text-sm xs:text-base font-semibold">{t('health.upcomingReminders')}</h3>
              <Button variant="ghost" className="text-emerald-500 dark:text-emerald-400 p-0.5 h-auto text-[10px] xxs:text-xs">
                {t("health.viewAll")}
              </Button>
            </div>
            <div className="space-y-1 xxs:space-y-1.5 sm:space-y-2">
              <div className="flex justify-between items-center p-1.5 xxs:p-2 bg-emerald-50 dark:bg-[#2a3137] rounded-lg border border-emerald-100 dark:border-0 shadow-sm">
                <div className="flex items-center gap-1 xxs:gap-1.5">
                  <div className="p-1 xxs:p-1.5 rounded-full bg-white dark:bg-[#1a2127] shadow-sm hidden xxs:block">
                    <Pill className="h-2.5 w-2.5 xxs:h-3 xxs:w-3 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-white text-[10px] xxs:text-xs xs:text-sm">
                      {localStorage.getItem('i18nextLng')?.startsWith('en') ? 'Take Vitamin D' : 'Tomar Vitamina D'}
                    </p>
                    <p className="text-[9px] xxs:text-[10px] xs:text-xs text-slate-600 dark:text-gray-400">
                      {localStorage.getItem('i18nextLng')?.startsWith('en') ? '1 capsule with breakfast' : '1 cápsula com café da manhã'}
                    </p>
                  </div>
                </div>
                <span className="text-emerald-500 dark:text-emerald-400 text-[10px] xxs:text-xs ml-1">
                  {localStorage.getItem('i18nextLng')?.startsWith('en') ? '8:00 AM' : '08:00'}
                </span>
              </div>
              <div className="flex justify-between items-center p-1.5 xxs:p-2 bg-emerald-50 dark:bg-[#2a3137] rounded-lg border border-emerald-100 dark:border-0 shadow-sm">
                <div className="flex items-center gap-1 xxs:gap-1.5">
                  <div className="p-1 xxs:p-1.5 rounded-full bg-white dark:bg-[#1a2127] shadow-sm hidden xxs:block">
                    <Activity className="h-2.5 w-2.5 xxs:h-3 xxs:w-3 text-rose-500" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-white text-[10px] xxs:text-xs xs:text-sm">
                      {localStorage.getItem('i18nextLng')?.startsWith('en') ? 'Exercise' : 'Exercícios'}
                    </p>
                    <p className="text-[9px] xxs:text-[10px] xs:text-xs text-slate-600 dark:text-gray-400">
                      {localStorage.getItem('i18nextLng')?.startsWith('en') ? '30 minutes of walking' : '30 minutos de caminhada'}
                    </p>
                  </div>
                </div>
                <span className="text-emerald-500 dark:text-emerald-400 text-[10px] xxs:text-xs ml-1">
                  {localStorage.getItem('i18nextLng')?.startsWith('en') ? '6:30 PM' : '18:30'}
                </span>
              </div>
              <div className="flex justify-between items-center p-1.5 xxs:p-2 bg-emerald-50 dark:bg-[#2a3137] rounded-lg border border-emerald-100 dark:border-0 shadow-sm">
                <div className="flex items-center gap-1 xxs:gap-1.5">
                  <div className="p-1 xxs:p-1.5 rounded-full bg-white dark:bg-[#1a2127] shadow-sm hidden xxs:block">
                    <Brain className="h-2.5 w-2.5 xxs:h-3 xxs:w-3 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-white text-[10px] xxs:text-xs xs:text-sm">
                      {localStorage.getItem('i18nextLng')?.startsWith('en') ? 'Evening Meditation' : 'Meditação Noturna'}
                    </p>
                    <p className="text-[9px] xxs:text-[10px] xs:text-xs text-slate-600 dark:text-gray-400">
                      {localStorage.getItem('i18nextLng')?.startsWith('en') ? 'Relaxation routine' : 'Rotina de relaxamento'}
                    </p>
                  </div>
                </div>
                <span className="text-emerald-500 dark:text-emerald-400 text-[10px] xxs:text-xs ml-1">
                  {localStorage.getItem('i18nextLng')?.startsWith('en') ? '10:00 PM' : '22:00'}
                </span>
              </div>
            </div>
          </Card>
        )}
        
        {/* Exam Alerts */}
        <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 p-2 xxs:p-3 xs:p-4 shadow-md w-full max-w-full overflow-hidden box-border">
          <div className="flex justify-between items-center mb-1.5 xxs:mb-2 sm:mb-3">
            <h3 className="text-xs xxs:text-sm xs:text-base font-semibold">{t('health.examAlerts')}</h3>
            <Button variant="ghost" className="text-emerald-500 dark:text-emerald-400 p-0.5 h-auto text-[10px] xxs:text-xs">
              {t("health.viewAll")}
            </Button>
          </div>
          
          {alertExams.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              {alertExams.map((exam) => (
                <div key={exam.id} className={`flex justify-between items-center p-2 sm:p-3 rounded-lg border shadow-sm dark:border-0 ${getStatusColor(exam.status)} dark:bg-[#2a3137]`}>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className={`p-1.5 sm:p-2 rounded-full bg-white dark:bg-[#1a2127] shadow-sm`}>
                      <FileText className={`h-3 w-3 sm:h-4 sm:w-4 ${exam.status === "Critical" || exam.status === "Low" ? "text-red-500" : exam.status === "High" || exam.status === "Attention" ? "text-amber-500" : "text-emerald-500"}`} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 dark:text-white text-[10px] xxs:text-xs xs:text-sm">{exam.name}</p>
                      <p className="text-[9px] xxs:text-[10px] xs:text-xs text-slate-600 dark:text-gray-400">{formatDate(exam.date)}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-xs ${exam.status === "Critical" || exam.status === "Low" ? "border-red-200 text-red-500" : exam.status === "High" || exam.status === "Attention" ? "border-amber-200 text-amber-500" : "border-emerald-200 text-emerald-500"}`}>
                    {exam.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2 xxs:py-3 sm:py-4 text-center">
              <div className="bg-emerald-50 dark:bg-[#2a3137] p-1.5 xxs:p-2 rounded-full mb-1.5 xxs:mb-2">
                <AlertCircle className="h-4 w-4 xxs:h-5 xxs:w-5 text-emerald-500 dark:text-emerald-400" />
              </div>
              <p className="text-xs xxs:text-sm text-slate-700 dark:text-gray-300 mb-0.5">{t('health.noExamAlerts')}</p>
              <p className="text-[10px] xxs:text-xs text-slate-500 dark:text-gray-400">{t('health.allExamsNormal')}</p>
            </div>
          )}
          
          {/* Dados mockados para demonstração - se não houver alertExams */}
          {alertExams.length === 0 && (
            <div className="mt-2 xxs:mt-3 space-y-1 xxs:space-y-1.5 sm:space-y-2">
              <div className="flex justify-between items-center p-2 sm:p-3 bg-amber-50 dark:bg-[#2a3137] rounded-lg border border-amber-200 dark:border-0 shadow-sm">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-[#1a2127] shadow-sm">
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-white text-[10px] xxs:text-xs xs:text-sm">
                      {localStorage.getItem('i18nextLng')?.startsWith('en') ? 'Complete Blood Count' : 'Hemograma'}
                    </p>
                    <p className="text-[9px] xxs:text-[10px] xs:text-xs text-slate-600 dark:text-gray-400">
                      {localStorage.getItem('i18nextLng')?.startsWith('en') ? 'March 15, 2023' : '15 de março, 2023'}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs border-amber-200 text-amber-500">
                  {t('health.attention')}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center p-2 sm:p-3 bg-red-50 dark:bg-[#2a3137] rounded-lg border border-red-200 dark:border-0 shadow-sm">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-[#1a2127] shadow-sm">
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-white text-[10px] xxs:text-xs xs:text-sm">
                      {localStorage.getItem('i18nextLng')?.startsWith('en') ? 'Blood Glucose' : 'Glicemia'}
                    </p>
                    <p className="text-[9px] xxs:text-[10px] xs:text-xs text-slate-600 dark:text-gray-400">
                      {localStorage.getItem('i18nextLng')?.startsWith('en') ? 'April 2, 2023' : '02 de abril, 2023'}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs border-red-200 text-red-500">
                  {t('health.critical')}
                </Badge>
              </div>
            </div>
          )}
        </Card>
      </div>
      
      {/* Quick Access Modules */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-lg sm:text-xl font-semibold">{t('health.quickAccess')}</h3>
        <Button variant="ghost" className="text-emerald-500 dark:text-emerald-400 p-1 h-auto text-xs sm:text-sm">
          {t("health.viewAll")}
        </Button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 responsive-mb w-full max-w-full overflow-hidden box-border">
        <Link to="/activity">
          <Card className="p-3 sm:p-4 md:p-5 bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/30 dark:to-rose-800/20 border-0 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="p-2 sm:p-3 mb-2 rounded-full bg-rose-500/10 dark:bg-rose-500/20">
                <Activity className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-rose-500 dark:text-rose-400" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-slate-800 dark:text-white">{t('navigation.activity')}</h3>
              <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5 hidden md:block">{t('health.trackActivities')}</p>
            </div>
          </Card>
        </Link>
        
        <Link to="/nutrition">
          <Card className="p-3 sm:p-4 md:p-5 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/20 border-0 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="p-2 sm:p-3 mb-2 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20">
                <Apple className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-emerald-500 dark:text-emerald-400" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-slate-800 dark:text-white">{t('navigation.nutrition')}</h3>
              <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5 hidden md:block">{t('health.trackMeals')}</p>
            </div>
          </Card>
        </Link>
        
        <Link to="/sleep">
          <Card className="p-3 sm:p-4 md:p-5 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/20 border-0 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="p-2 sm:p-3 mb-2 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20">
                <Moon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-indigo-500 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-slate-800 dark:text-white">{t('navigation.sleep')}</h3>
              <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5 hidden md:block">{t('health.analyzeSleep')}</p>
            </div>
          </Card>
        </Link>
        
        <Link to="/mental">
          <Card className="p-3 sm:p-4 md:p-5 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 border-0 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="p-2 sm:p-3 mb-2 rounded-full bg-purple-500/10 dark:bg-purple-500/20">
                <Brain className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-purple-500 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-slate-800 dark:text-white">{t('navigation.mental')}</h3>
              <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5 hidden md:block">{t('health.meditationWellness')}</p>
            </div>
          </Card>
        </Link>
        
        <Link to="/hydration">
          <Card className="p-3 sm:p-4 md:p-5 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 border-0 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="p-2 sm:p-3 mb-2 rounded-full bg-blue-500/10 dark:bg-blue-500/20">
                <Droplet className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-blue-500 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-slate-800 dark:text-white">{t('navigation.hydration')}</h3>
              <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5 hidden md:block">{t('health.waterTracking')}</p>
            </div>
          </Card>
        </Link>
        
        <Link to="/notifications">
          <Card className="p-3 sm:p-4 md:p-5 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/20 border-0 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="p-2 sm:p-3 mb-2 rounded-full bg-orange-500/10 dark:bg-orange-500/20">
                <BellIcon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-orange-500 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-slate-800 dark:text-white">{t('navigation.notifications', 'Notificações')}</h3>
              <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5 hidden md:block">{t('health.notificationsCenter', 'Centro de Notificações')}</p>
            </div>
          </Card>
        </Link>

        <Link to="/baby-growth">
          <Card className="p-3 sm:p-4 md:p-5 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/20 border-0 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="p-2 sm:p-3 mb-2 rounded-full bg-yellow-500/10 dark:bg-yellow-500/20">
                <Baby className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-yellow-500 dark:text-yellow-400" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-slate-800 dark:text-white">{t('navigation.baby')}</h3>
              <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5 hidden md:block">{t('baby.subtitle')}</p>
            </div>
          </Card>
        </Link>

        <Link to="/womens-health">
          <Card className="p-3 sm:p-4 md:p-5 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/30 dark:to-pink-800/20 border-0 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="p-2 sm:p-3 mb-2 rounded-full bg-pink-500/10 dark:bg-pink-500/20">
                <div className="text-pink-500 dark:text-pink-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8"><circle cx="12" cy="8" r="5"/><path d="M12 13v8"/><path d="M9 16h6"/></svg>
                </div>
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-slate-800 dark:text-white">{t('navigation.womens')}</h3>
              <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5 hidden md:block">{t('health.womensHealth')}</p>
            </div>
          </Card>
        </Link>
        
        <Link to="/videos">
          <Card className="p-3 sm:p-4 md:p-5 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20 border-0 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="p-2 sm:p-3 mb-2 rounded-full bg-amber-500/10 dark:bg-amber-500/20">
                <div className="text-amber-500 dark:text-amber-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8"><path d="M14.04 14.04v-4.08"/><path d="M10 10v4"/><path d="M6 14.08V9.92a1 1 0 0 1 .5-.87l8-4.61a1 1 0 0 1 1 0l8 4.61a1 1 0 0 1 .5.87v4.16a1 1 0 0 1-.5.87l-8 4.61a1 1 0 0 1-1 0l-8-4.61a1 1 0 0 1-.5-.87Z"/></svg>
                </div>
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-slate-800 dark:text-white">{t('navigation.videos')}</h3>
              <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5 hidden md:block">{t('health.videoSubscription')}</p>
            </div>
          </Card>
        </Link>
        
        <Link to="/medication">
          <Card className="p-3 sm:p-4 md:p-5 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/20 border-0 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="p-2 sm:p-3 mb-2 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20">
                <Pill className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-emerald-500 dark:text-emerald-400" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-slate-800 dark:text-white">{t('navigation.medication')}</h3>
              <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5 hidden md:block">{t('health.medicationManagement')}</p>
            </div>
          </Card>
        </Link>
        
        <Link to="/fasting">
          <Card className="p-3 sm:p-4 md:p-5 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/20 border-0 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="p-2 sm:p-3 mb-2 rounded-full bg-yellow-500/10 dark:bg-yellow-500/20">
                <Timer className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-yellow-500 dark:text-yellow-400" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-slate-800 dark:text-white">{t('navigation.fasting', 'Jejum')}</h3>
              <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5 hidden md:block">{t('health.fastingManagement', 'Controle de Jejum')}</p>
            </div>
          </Card>
        </Link>

        <Link to="/subscription">
          <Card className="p-3 sm:p-4 md:p-5 bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/30 dark:to-violet-800/20 border-0 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="p-2 sm:p-3 mb-2 rounded-full bg-violet-500/10 dark:bg-violet-500/20">
                <Star className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-violet-500 dark:text-violet-400" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-slate-800 dark:text-white">{t('navigation.subscription', 'Premium')}</h3>
              <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5 hidden md:block">{t('health.subscriptionClub', 'Clube de Assinatura')}</p>
            </div>
          </Card>
        </Link>

        <Link to="/pregnancy">
          <Card className="p-3 sm:p-4 md:p-5 bg-gradient-to-br from-pink-50 to-purple-100 dark:from-pink-900/30 dark:to-purple-800/20 border-0 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="p-2 sm:p-3 mb-2 rounded-full bg-pink-500/10 dark:bg-pink-500/20">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-pink-500 dark:text-pink-400" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-slate-800 dark:text-white">{t('navigation.pregnancy')}</h3>
              <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5 hidden md:block">{t('pregnancy.subtitle')}</p>
            </div>
          </Card>
        </Link>

        <Link to="/exams">
          <Card className="p-3 sm:p-4 md:p-5 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/30 dark:to-cyan-800/20 border-0 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="p-2 sm:p-3 mb-2 rounded-full bg-cyan-500/10 dark:bg-cyan-500/20">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-cyan-500 dark:text-cyan-400" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-slate-800 dark:text-white">{t('navigation.exams')}</h3>
              <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5 hidden md:block">{t('health.exams')}</p>
            </div>
          </Card>
        </Link>
      </div>
      
      {/* Contextual AI Health Tips Overlay */}
      <ContextualTipsOverlay 
        currentPage="dashboard"
        userActivity={dashboardStats}
      />
    </MainLayout>
  );
})