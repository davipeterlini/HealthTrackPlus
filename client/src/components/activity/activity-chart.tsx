import { Activity } from "@shared/schema";
import { CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

interface ActivityChartProps {
  activities: Activity[];
  onSelectDate: (date: Date) => void;
}

export function ActivityChart({ activities, onSelectDate }: ActivityChartProps) {
  const [chartData, setChartData] = useState<Activity[]>([]);
  
  useEffect(() => {
    if (activities.length === 0) {
      // If no data, create sample data for the last 7 days
      const sampleData: Activity[] = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return {
          id: i + 1,
          userId: 1,
          date,
          startTime: null,
          endTime: null,
          activityType: "walking",
          steps: 0,
          distance: null,
          calories: 0,
          minutes: 0,
          heartRate: null,
          heartRateZones: null,
          elevationGain: null,
          elevationLoss: null,
          avgPace: null,
          maxPace: null,
          intensity: null,
          cadence: null,
          strideLength: null,
          routeData: null,
          gpsPoints: null,
          activityImage: null,
          feeling: null,
          weatherCondition: null,
          temperature: null,
          humidity: null,
          terrainType: null,
          equipmentUsed: null,
          notes: null,
          source: "manual",
          isRealTime: false,
          achievements: null
        };
      }).reverse();
      
      setChartData(sampleData);
    } else {
      // Sort activities by date (earliest first)
      const sortedActivities = [...activities].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      // Get the latest 7 days of data
      const latestActivities = sortedActivities.slice(-7);
      
      setChartData(latestActivities);
    }
  }, [activities]);
  
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
  };
  
  const handleBarClick = (date: Date) => {
    onSelectDate(date);
  };
  
  return (
    <CardContent className="px-6 pb-6">
      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Weekly Activity</h4>
      <div className="h-64 bg-gray-50 dark:bg-gray-900 rounded-md p-4">
        <div className="h-full flex items-end space-x-2">
          {chartData.map((activity, index) => {
            // Calculate height based on steps (max 14000 steps)
            const heightPercentage = Math.min((activity.steps / 14000) * 100, 100);
            const isHighestActivity = activity.steps === Math.max(...chartData.map(a => a.steps));
            const date = new Date(activity.date);
            
            return (
              <div 
                key={index} 
                className="flex flex-col items-center space-y-1 flex-1 cursor-pointer"
                onClick={() => handleBarClick(date)}
              >
                <div 
                  className={`w-full rounded-t-sm transition-all duration-200 ${
                    isHighestActivity 
                      ? 'bg-blue-600 dark:bg-primary-500' 
                      : 'bg-blue-400 hover:bg-blue-500 dark:bg-primary-700 dark:hover:bg-primary-600'
                  }`}
                  style={{ height: `${heightPercentage}%` }}
                  title={`${activity.steps.toLocaleString()} steps`}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(activity.date)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </CardContent>
  );
}
