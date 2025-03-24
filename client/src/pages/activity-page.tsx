import { MainLayout } from "@/components/layout/main-layout";
import { ActivitySummary } from "@/components/activity/activity-summary";
import { ActivityChart } from "@/components/activity/activity-chart";
import { ActivityBreakdown } from "@/components/activity/activity-breakdown";
import { useQuery } from "@tanstack/react-query";
import { Activity } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export default function ActivityPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });
  
  return (
    <MainLayout title="Physical Activity">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {isLoading ? (
          <>
            <div className="lg:col-span-2">
              <Card>
                <Skeleton className="h-80 w-full" />
              </Card>
            </div>
            <Card>
              <Skeleton className="h-80 w-full" />
            </Card>
          </>
        ) : (
          <>
            <div className="lg:col-span-2">
              <Card>
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
