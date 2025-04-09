import { MainLayout } from "@/components/layout/main-layout";
import { ActivitySummary } from "@/components/activity/activity-summary";
import { ActivityChart } from "@/components/activity/activity-chart";
import { ActivityBreakdown } from "@/components/activity/activity-breakdown";
import { useQuery } from "@tanstack/react-query";
import { Activity } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ActivityPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { t } = useTranslation();
  
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });
  
  return (
    <MainLayout title={t('activity.title')}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {isLoading ? (
          <>
            <div className="lg:col-span-2">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <Skeleton className="h-80 w-full dark:bg-gray-700" />
              </Card>
            </div>
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <Skeleton className="h-80 w-full dark:bg-gray-700" />
            </Card>
          </>
        ) : (
          <>
            <div className="lg:col-span-2">
              <Card className="dark:bg-[#1a2127] dark:border-gray-700">
                <ActivitySummary 
                  activities={activities || []} 
                  selectedDate={selectedDate}
                />
                <ActivityChart 
                  activities={activities || []} 
                  onSelectDate={setSelectedDate}
                />
              </Card>
            </div>
            
            <ActivityBreakdown 
              activity={activities?.find(a => 
                new Date(a.date).toDateString() === selectedDate.toDateString()
              )}
            />
          </>
        )}
      </div>
    </MainLayout>
  );
}
