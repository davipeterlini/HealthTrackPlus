import { MainLayout } from "@/components/layout/main-layout";
import { WaterTracker } from "@/components/nutrition/water-tracker";
import { SleepTracker } from "@/components/nutrition/sleep-tracker";
import { MealTracker } from "@/components/nutrition/meal-tracker";
import { useQuery } from "@tanstack/react-query";
import { WaterIntakeRecord, SleepRecord, Meal } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function NutritionPage() {
  const { t } = useTranslation();
  const { data: waterRecords, isLoading: waterLoading } = useQuery<WaterIntakeRecord[]>({
    queryKey: ["/api/water"],
  });
  
  const { data: sleepRecords, isLoading: sleepLoading } = useQuery<SleepRecord[]>({
    queryKey: ["/api/sleep"],
  });
  
  const { data: meals, isLoading: mealsLoading } = useQuery<Meal[]>({
    queryKey: ["/api/meals"],
  });
  
  return (
    <MainLayout>
      <div className="flex flex-row items-center justify-between responsive-mb">
        <h1 className="responsive-title-lg text-slate-800 dark:text-white">
          {t('navigation.nutrition')}
        </h1>
        <Button className="bg-green-600 hover:bg-green-700 dark:text-white responsive-button">
          <PlusCircle className="mr-2 responsive-icon-sm" /> {t('meal.addMeal')}
        </Button>
      </div>
    
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 responsive-gap-y">
        <div className="lg:col-span-1 space-y-6 responsive-gap-y">
          {waterLoading ? (
            <Skeleton className="responsive-chart w-full dark:bg-gray-700" />
          ) : (
            <WaterTracker waterRecords={waterRecords || []} />
          )}
          
          {sleepLoading ? (
            <Skeleton className="responsive-chart w-full dark:bg-gray-700" />
          ) : (
            <SleepTracker sleepRecords={sleepRecords || []} />
          )}
        </div>
        
        <div className="lg:col-span-2">
          {mealsLoading ? (
            <Skeleton className="h-[600px] w-full dark:bg-gray-700" />
          ) : (
            <MealTracker meals={meals || []} />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
