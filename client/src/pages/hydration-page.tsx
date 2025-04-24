import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { WaterTracker } from "@/components/nutrition/water-tracker";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { WaterIntakeRecord } from "@shared/schema";
import { Droplet, DropletIcon, History, PlusCircle, TrendingUp } from "lucide-react";
import { FC } from "react";

export default function HydrationPage() {
  const { t } = useTranslation();
  
  // Obter registros de consumo de água
  const { data: waterRecords = [], isPending: isLoadingWaterRecords } = useQuery<WaterIntakeRecord[]>({
    queryKey: ["/api/water"],
    refetchOnWindowFocus: false,
  });

  // Calcular estatísticas de hidratação
  const calculateHydrationStats = () => {
    if (waterRecords.length === 0) {
      return {
        todayTotal: 0,
        weeklyAverage: 0,
        streakDays: 0,
        percentOfGoal: 0
      };
    }

    const today = new Date().toDateString();
    const dailyGoal = 2500; // ml
    
    // Separar por dias
    const recordsByDay: Record<string, number> = {};
    
    waterRecords.forEach((record: WaterIntakeRecord) => {
      const date = new Date(record.date).toDateString();
      if (!recordsByDay[date]) {
        recordsByDay[date] = 0;
      }
      recordsByDay[date] += record.amount;
    });
    
    // Calcular total de hoje
    const todayTotal = recordsByDay[today] || 0;
    
    // Calcular média semanal
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toDateString();
    });
    
    const weeklyTotal = last7Days.reduce((sum, day) => sum + (recordsByDay[day] || 0), 0);
    const weeklyAverage = Math.round(weeklyTotal / 7);
    
    // Calcular streak (dias consecutivos atingindo pelo menos 70% da meta)
    let streakDays = 0;
    const threshold = dailyGoal * 0.7;
    
    for (let i = 0; i < 30; i++) { // Checar até 30 dias para trás
      const checkDate = new Date();
      checkDate.setDate(checkDate.getDate() - i);
      const checkDateStr = checkDate.toDateString();
      
      if ((recordsByDay[checkDateStr] || 0) >= threshold) {
        streakDays++;
      } else {
        break;
      }
    }
    
    // Porcentagem da meta diária
    const percentOfGoal = Math.min(Math.round((todayTotal / dailyGoal) * 100), 100);
    
    return {
      todayTotal,
      weeklyAverage,
      streakDays,
      percentOfGoal
    };
  };

  const hydrationStats = calculateHydrationStats();

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          {t('water.waterIntake')}
        </h1>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <PlusCircle className="mr-2 h-4 w-4" /> {t('water.addMeal')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="bg-white dark:bg-[#1a2127] border dark:border-0 shadow-md rounded-xl">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm sm:text-base text-slate-600 dark:text-gray-400">
              {t('water.today')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingWaterRecords ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <div className="flex items-center">
                <Droplet className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 mr-3" />
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
                    {hydrationStats.todayTotal} ml
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500 dark:text-gray-400">
                    {hydrationStats.percentOfGoal}% {t('water.ofGoal')} 2500 ml
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-[#1a2127] border dark:border-0 shadow-md rounded-xl">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm sm:text-base text-slate-600 dark:text-gray-400">
              {t('common.weeklyAverage')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingWaterRecords ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 mr-3" />
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
                    {hydrationStats.weeklyAverage} ml
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500 dark:text-gray-400">
                    {t('water.dailyAverage')}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-[#1a2127] border dark:border-0 shadow-md rounded-xl">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm sm:text-base text-slate-600 dark:text-gray-400">
              {t('water.streak')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingWaterRecords ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <div className="flex items-center">
                <History className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500 mr-3" />
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
                    {hydrationStats.streakDays} {t('common.days')}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500 dark:text-gray-400">
                    {t('water.goalReached')}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 sm:mb-8">
        {isLoadingWaterRecords ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <WaterTracker waterRecords={waterRecords || []} />
        )}
      </div>

      <div className="mt-6 bg-white dark:bg-[#1a2127] border dark:border-0 shadow-md rounded-xl p-5 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white mb-4">
          {t('water.hydrationTips')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex">
            <div className="p-2 mr-3 bg-blue-100 dark:bg-blue-900/30 rounded-full h-min">
              <DropletIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium text-slate-800 dark:text-white text-sm sm:text-base">
                {t('water.tip1Title')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mt-1">
                {t('water.tip1')}
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="p-2 mr-3 bg-blue-100 dark:bg-blue-900/30 rounded-full h-min">
              <DropletIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium text-slate-800 dark:text-white text-sm sm:text-base">
                {t('water.tip2Title')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mt-1">
                {t('water.tip2')}
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="p-2 mr-3 bg-blue-100 dark:bg-blue-900/30 rounded-full h-min">
              <DropletIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium text-slate-800 dark:text-white text-sm sm:text-base">
                {t('water.tip3Title')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mt-1">
                {t('water.tip3')}
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="p-2 mr-3 bg-blue-100 dark:bg-blue-900/30 rounded-full h-min">
              <DropletIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium text-slate-800 dark:text-white text-sm sm:text-base">
                {t('water.tip4Title')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mt-1">
                {t('water.tip4')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}