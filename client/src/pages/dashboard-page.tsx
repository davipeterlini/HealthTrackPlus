import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card } from "@/components/ui/card";
import { 
  Activity, Heart, Moon, Apple, Droplet, AlertCircle, 
  FileText, Brain, Pill, Calculator, Clock
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

export default function DashboardPage() {
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
      <p className="text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">{t('health.todayOverview')}</p>

      {/* Big Numbers */}
      <div className="responsive-grid-4 responsive-mb">
        <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 responsive-card shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-600 dark:text-gray-400 mb-1.5 responsive-text-sm">{t('activity.activeMinutes')}</p>
              <h2 className="responsive-title-xl font-bold mb-1.5">
                {isLoadingStats ? '...' : dashboardStats?.activeMinutes?.value || 45}
              </h2>
              <p className={`flex items-center responsive-text-sm ${dashboardStats?.activeMinutes?.trend === 'up' ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                <span className="mr-1">{dashboardStats?.activeMinutes?.trend === 'up' ? '↑' : '↓'}</span>
                {isLoadingStats ? '...' : dashboardStats?.activeMinutes?.change || 15}% {t('health.stepsUp')}
              </p>
            </div>
            <div className="bg-purple-100 dark:bg-[#2a3137] responsive-icon-container rounded-full shadow-sm">
              <Clock className="text-purple-500 dark:text-purple-400 responsive-icon" />
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 responsive-card shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-600 dark:text-gray-400 mb-1.5 responsive-text-sm">{t('health.calories')}</p>
              <h2 className="responsive-title-xl font-bold mb-1.5">
                {isLoadingStats ? '...' : dashboardStats?.calories?.value?.toLocaleString() || '1,450'}
              </h2>
              <p className="text-red-500 dark:text-red-400 responsive-text-sm">
                <span className="mr-1">↓</span>
                {isLoadingStats ? '...' : dashboardStats?.calories?.remaining || 320} {t('health.remaining')}
              </p>
            </div>
            <div className="bg-emerald-100 dark:bg-[#2a3137] responsive-icon-container rounded-full shadow-sm">
              <Apple className="text-emerald-500 dark:text-emerald-400 responsive-icon" />
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 responsive-card shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-600 dark:text-gray-400 mb-1.5 responsive-text-sm">{t('health.sleep')}</p>
              <h2 className="responsive-title-xl font-bold mb-1.5">
                {isLoadingStats ? '...' : `${dashboardStats?.sleep?.value || 7.5}h`}
              </h2>
              <p className={`flex items-center responsive-text-sm ${dashboardStats?.sleep?.trend === 'up' ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                <span className="mr-1">{dashboardStats?.sleep?.trend === 'up' ? '↑' : '↓'}</span>
                {isLoadingStats ? '...' : dashboardStats?.sleep?.change || 30}min {t('health.moreMinutes')}
              </p>
            </div>
            <div className="bg-emerald-100 dark:bg-[#2a3137] responsive-icon-container rounded-full shadow-sm">
              <Moon className="text-emerald-500 dark:text-emerald-400 responsive-icon" />
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 responsive-card shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-600 dark:text-gray-400 mb-1.5 responsive-text-sm">{t('health.avgBPM')}</p>
              <h2 className="responsive-title-xl font-bold mb-1.5">
                {isLoadingStats ? '...' : dashboardStats?.heartRate?.value || 72}
              </h2>
              <p className={`flex items-center responsive-text-sm ${dashboardStats?.heartRate?.status === 'normal' ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                <span className="mr-1">{dashboardStats?.heartRate?.trend === 'down' ? '↓' : '↑'}</span>
                {t('health.healthy')}
              </p>
            </div>
            <div className="bg-emerald-100 dark:bg-[#2a3137] responsive-icon-container rounded-full shadow-sm">
              <Heart className="text-emerald-500 dark:text-emerald-400 responsive-icon" />
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Activity Chart */}
      {settings.showActivityTracker && (
        <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 p-4 sm:p-6 mb-8 shadow-md overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h3 className="text-lg sm:text-xl font-semibold">{t('health.weeklyActivities')}</h3>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-emerald-500 mr-1.5"></div>
                <span className="text-xs text-slate-600 dark:text-gray-400">{t('activity.steps')}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-1.5"></div>
                <span className="text-xs text-slate-600 dark:text-gray-400">{t('activity.calories')}</span>
              </div>
            </div>
          </div>
          
          <div className="relative h-40 sm:h-52 mt-6 sm:mt-2 ml-4 sm:ml-6 mr-1">
            {/* Linhas de grade horizontais */}
            <div className="absolute left-0 right-0 top-0 bottom-0 flex flex-col justify-between pointer-events-none">
              {[0, 1, 2, 3, 4].map((_, i) => (
                <div 
                  key={i} 
                  className="border-t border-gray-100 dark:border-gray-800 w-full h-0"
                  style={{ top: `${i * 25}%` }}
                />
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1 sm:gap-2 h-full relative z-10">
              {(isLoadingStats || !dashboardStats?.weeklyActivity?.days ? [
                { 
                  day: localStorage.getItem('i18nextLng')?.startsWith('en') ? 'Sun' : 'Dom', 
                  steps: 5240, 
                  cals: 1250, 
                  active: 25, 
                  shortDay: localStorage.getItem('i18nextLng')?.startsWith('en') ? 'S' : 'D' 
                },
                { 
                  day: localStorage.getItem('i18nextLng')?.startsWith('en') ? 'Mon' : 'Seg', 
                  steps: 7890, 
                  cals: 1540, 
                  active: 48, 
                  shortDay: localStorage.getItem('i18nextLng')?.startsWith('en') ? 'M' : 'S' 
                },
                { 
                  day: localStorage.getItem('i18nextLng')?.startsWith('en') ? 'Tue' : 'Ter', 
                  steps: 9450, 
                  cals: 1780, 
                  active: 62, 
                  shortDay: localStorage.getItem('i18nextLng')?.startsWith('en') ? 'T' : 'T' 
                },
                { 
                  day: localStorage.getItem('i18nextLng')?.startsWith('en') ? 'Wed' : 'Qua', 
                  steps: 10200, 
                  cals: 1820, 
                  active: 75, 
                  shortDay: localStorage.getItem('i18nextLng')?.startsWith('en') ? 'W' : 'Q' 
                },
                { 
                  day: localStorage.getItem('i18nextLng')?.startsWith('en') ? 'Thu' : 'Qui', 
                  steps: 8750, 
                  cals: 1650, 
                  active: 53, 
                  shortDay: localStorage.getItem('i18nextLng')?.startsWith('en') ? 'T' : 'Q' 
                },
                { 
                  day: localStorage.getItem('i18nextLng')?.startsWith('en') ? 'Fri' : 'Sex', 
                  steps: 12100, 
                  cals: 2100, 
                  active: 85, 
                  shortDay: localStorage.getItem('i18nextLng')?.startsWith('en') ? 'F' : 'S' 
                },
                { 
                  day: localStorage.getItem('i18nextLng')?.startsWith('en') ? 'Sat' : 'Sáb', 
                  steps: 6800, 
                  cals: 1420, 
                  active: 40, 
                  shortDay: localStorage.getItem('i18nextLng')?.startsWith('en') ? 'S' : 'S' 
                }
              ] : dashboardStats?.weeklyActivity?.days || []).map((item, i) => (
                <div key={i} className="flex flex-col items-center h-full justify-end">
                  <div className="w-full relative flex items-end justify-center h-[85%]">
                    {/* Barra de passos com design aprimorado */}
                    <div 
                      className="w-[70%] mx-auto bg-emerald-500/80 dark:bg-emerald-500/70 rounded-t-md z-20 relative group cursor-pointer transition-all duration-300 ease-in-out"
                      style={{ 
                        height: `${Math.max(item.active * 0.7, 2)}%`,
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)' 
                      }}
                    >
                      {/* Brilho superior para efeito 3D suave */}
                      <div className="absolute top-0 left-0 right-0 h-[20%] bg-gradient-to-b from-white/30 to-transparent rounded-t-md"></div>
                      
                      {/* Tooltip aprimorado */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-30 shadow-xl">
                        <div className="bg-white dark:bg-slate-800 shadow-lg rounded-md p-2 text-xs min-w-[100px] sm:min-w-[120px]">
                          <div className="font-semibold text-slate-800 dark:text-white mb-1">{item.day}</div>
                          <div className="flex justify-between text-slate-600 dark:text-gray-300">
                            <span>{t('activity.stepsLabel')}:</span>
                            <span>{item.steps.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-slate-600 dark:text-gray-300">
                            <span>{t('activity.caloriesLabel')}:</span>
                            <span>{item.cals}</span>
                          </div>
                        </div>
                        <div className="border-t-8 border-t-white dark:border-t-slate-800 border-l-8 border-l-transparent border-r-8 border-r-transparent h-0 w-0 absolute left-1/2 transform -translate-x-1/2"></div>
                      </div>
                    </div>
                    
                    {/* Linha de calorias com design de curva suave */}
                    <div className="absolute w-[70%] mx-auto left-0 right-0 z-10"
                      style={{ 
                        bottom: `${Math.min((item.cals / 2500) * 100 * 0.7, 100)}%`,
                        height: '3px',
                        background: 'linear-gradient(to right, transparent, #3b82f6 50%, #3b82f6)'
                      }}
                    >
                      <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-blue-500 absolute right-0 top-1/2 transform -translate-y-1/2 shadow-md"></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center mt-2">
                    <span className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 hidden sm:block">{item.day}</span>
                    <span className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 block sm:hidden">{item.shortDay}</span>
                    <span className="text-[10px] sm:text-xs text-slate-500 dark:text-gray-500 mt-0.5">{Math.round(item.steps/1000)}k</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Escala vertical - visível apenas em telas maiores */}
            <div className="absolute -left-2 sm:left-0 top-0 bottom-8 flex flex-col justify-between">
              {[10000, 7500, 5000, 2500, 0].map((value, i) => (
                <div key={i} className="text-[10px] sm:text-xs text-slate-400 dark:text-gray-500 -translate-x-4 sm:-translate-x-6">
                  {i === 0 ? '10k' : 
                   i === 1 ? '7.5k' : 
                   i === 2 ? '5k' : 
                   i === 3 ? '2.5k' : '0'}
                </div>
              ))}
            </div>
          </div>
          
          {/* Informações responsivas para telas menores */}
          <div className="mt-2 text-xs text-center text-slate-500 dark:text-gray-400 sm:hidden">
            <p>{t('health.touchBars')}</p>
          </div>
        </Card>
      )}

      {/* Hydration & Sleep Trackers */}
      <div className="responsive-grid-2 responsive-mb">
        {/* Hydration Tracker */}
        {settings.showWaterTracker && (
          <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 p-6 shadow-md rounded-xl">
            <div className="flex justify-between items-center mb-6">
              <Link to="/hydration" className="group">
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">{t('health.hydration')}</h3>
              </Link>
              <div className="relative w-10 h-6">
                <Droplet className="absolute h-6 w-6 text-blue-500 dark:text-blue-400 right-0" />
                <Droplet className="absolute h-5 w-5 text-teal-400 dark:text-teal-300 left-0 top-0.5" />
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-slate-800 dark:text-white text-xl font-medium">{waterAmount} ml</span>
                <span className="text-slate-500 dark:text-gray-400">{t('health.goal')}: {waterGoal} ml</span>
              </div>
              
              <div className="h-3 w-full bg-slate-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-teal-400 dark:bg-teal-500 rounded-full transition-all duration-300" 
                  style={{ width: `${waterPercentage}%` }}
                ></div>
              </div>
              
              <div className="flex justify-center gap-4 mt-6">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => removeWater(150)}
                  className="border-teal-400 dark:border-teal-500 border bg-transparent hover:bg-teal-50 dark:hover:bg-teal-900/20 text-teal-500 dark:text-blue-400 rounded-full h-9 px-3"
                >
                  <span className="text-teal-500 dark:text-blue-400 mr-1">−</span>
                  <span className="text-teal-500 dark:text-blue-400 text-sm">150ml</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => addWater(250)}
                  className="border-blue-400 dark:border-blue-500 border bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 dark:text-blue-400 rounded-full h-9 px-3"
                >
                  <span className="text-blue-500 dark:text-blue-400 mr-1">+</span>
                  <span className="text-blue-500 dark:text-blue-400 text-sm">250ml</span>
                </Button>
              </div>
            </div>
          </Card>
        )}
        
        {/* Sleep Tracker */}
        {settings.showSleepTracker && (
          <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 p-4 sm:p-5 shadow-md rounded-xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white">{t('health.sleepQuality')}</h3>
              <Moon className="text-indigo-500 dark:text-indigo-300 responsive-icon" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <div className="flex items-center">
                  <Moon className="h-4 w-4 text-slate-500 dark:text-gray-400 mr-1.5" />
                  <span className="text-slate-500 dark:text-gray-400">{localStorage.getItem('i18nextLng')?.startsWith('en') ? '11:30 PM' : '23:30'}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-slate-500 dark:text-gray-400">{localStorage.getItem('i18nextLng')?.startsWith('en') ? '7:00 AM' : '07:00'}</span>
                  <span className="h-4 w-4 text-yellow-500 dark:text-yellow-400 ml-1.5">☀</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-start">
                  <h2 className="text-4xl font-bold text-slate-800 dark:text-white">
                    {isLoadingStats ? '...' : `${dashboardStats?.sleep?.value || 7.5}h`}
                  </h2>
                  <span className="ml-auto text-green-500 dark:text-green-400 text-lg">{t('health.goodQuality')}</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">{t('health.totalTime')}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
      
      {/* Medication & Exam Alerts */}
      <div className="responsive-grid-2 responsive-mb">
        {/* Medication Reminders */}
        {settings.showMedicationTracker && (
          <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 p-4 sm:p-6 shadow-md">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold">{t('health.upcomingReminders')}</h3>
              <Button variant="ghost" className="text-emerald-500 dark:text-emerald-400 p-1 h-auto text-xs sm:text-sm">
                {t("health.viewAll")}
              </Button>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center p-2 sm:p-3 bg-emerald-50 dark:bg-[#2a3137] rounded-lg border border-emerald-100 dark:border-0 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-[#1a2127] shadow-sm hidden sm:block">
                    <Pill className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-white text-sm sm:text-base">
                      {localStorage.getItem('i18nextLng')?.startsWith('en') ? 'Take Vitamin D' : 'Tomar Vitamina D'}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400">
                      {localStorage.getItem('i18nextLng')?.startsWith('en') ? '1 capsule with breakfast' : '1 cápsula com café da manhã'}
                    </p>
                  </div>
                </div>
                <span className="text-emerald-500 dark:text-emerald-400 text-sm ml-2">
                  {localStorage.getItem('i18nextLng')?.startsWith('en') ? '8:00 AM' : '08:00'}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 sm:p-3 bg-emerald-50 dark:bg-[#2a3137] rounded-lg border border-emerald-100 dark:border-0 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-[#1a2127] shadow-sm hidden sm:block">
                    <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-rose-500" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-white text-sm sm:text-base">
                      {localStorage.getItem('i18nextLng')?.startsWith('en') ? 'Exercise' : 'Exercícios'}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400">
                      {localStorage.getItem('i18nextLng')?.startsWith('en') ? '30 minutes of walking' : '30 minutos de caminhada'}
                    </p>
                  </div>
                </div>
                <span className="text-emerald-500 dark:text-emerald-400 text-sm ml-2">
                  {localStorage.getItem('i18nextLng')?.startsWith('en') ? '6:30 PM' : '18:30'}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 sm:p-3 bg-emerald-50 dark:bg-[#2a3137] rounded-lg border border-emerald-100 dark:border-0 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-[#1a2127] shadow-sm hidden sm:block">
                    <Brain className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-white text-sm sm:text-base">
                      {localStorage.getItem('i18nextLng')?.startsWith('en') ? 'Evening Meditation' : 'Meditação Noturna'}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400">
                      {localStorage.getItem('i18nextLng')?.startsWith('en') ? 'Relaxation routine' : 'Rotina de relaxamento'}
                    </p>
                  </div>
                </div>
                <span className="text-emerald-500 dark:text-emerald-400 text-sm ml-2">
                  {localStorage.getItem('i18nextLng')?.startsWith('en') ? '10:00 PM' : '22:00'}
                </span>
              </div>
            </div>
          </Card>
        )}
        
        {/* Exam Alerts */}
        <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 p-4 sm:p-6 shadow-md">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold">{t('health.examAlerts')}</h3>
            <Button variant="ghost" className="text-emerald-500 dark:text-emerald-400 p-1 h-auto text-xs sm:text-sm">
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
                      <p className="font-medium text-slate-800 dark:text-white text-sm sm:text-base">{exam.name}</p>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400">{formatDate(exam.date)}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-xs ${exam.status === "Critical" || exam.status === "Low" ? "border-red-200 text-red-500" : exam.status === "High" || exam.status === "Attention" ? "border-amber-200 text-amber-500" : "border-emerald-200 text-emerald-500"}`}>
                    {exam.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4 sm:py-6 text-center">
              <div className="bg-emerald-50 dark:bg-[#2a3137] p-2 sm:p-3 rounded-full mb-2 sm:mb-3">
                <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500 dark:text-emerald-400" />
              </div>
              <p className="text-sm sm:text-base text-slate-700 dark:text-gray-300 mb-1">{t('health.noExamAlerts')}</p>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400">{t('health.allExamsNormal')}</p>
            </div>
          )}
          
          {/* Dados mockados para demonstração - se não houver alertExams */}
          {alertExams.length === 0 && (
            <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center p-2 sm:p-3 bg-amber-50 dark:bg-[#2a3137] rounded-lg border border-amber-200 dark:border-0 shadow-sm">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-[#1a2127] shadow-sm">
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-white text-sm sm:text-base">
                      {localStorage.getItem('i18nextLng')?.startsWith('en') ? 'Complete Blood Count' : 'Hemograma'}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400">
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
                    <p className="font-medium text-slate-800 dark:text-white text-sm sm:text-base">
                      {localStorage.getItem('i18nextLng')?.startsWith('en') ? 'Blood Glucose' : 'Glicemia'}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400">
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
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 responsive-mb">
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
}