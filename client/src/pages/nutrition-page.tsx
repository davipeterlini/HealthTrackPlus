import { MainLayout } from "@/components/layout/main-layout";
import { WaterTracker } from "@/components/nutrition/water-tracker";
import { SleepTracker } from "@/components/nutrition/sleep-tracker";
import { MealTracker } from "@/components/nutrition/meal-tracker";
import { useQuery } from "@tanstack/react-query";
import { WaterIntakeRecord, SleepRecord, Meal } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function NutritionPage() {
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
    <MainLayout title="Nutrition & Sleep">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          {waterLoading ? (
            <Skeleton className="h-64 w-full dark:bg-gray-700" />
          ) : (
            <WaterTracker waterRecords={waterRecords || []} />
          )}
          
          {sleepLoading ? (
            <Skeleton className="h-96 w-full dark:bg-gray-700" />
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
