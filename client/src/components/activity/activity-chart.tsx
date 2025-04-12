import { Activity } from "@shared/schema";
import { CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface ActivityChartProps {
  activities: Activity[];
  onSelectDate: (date: Date) => void;
}

export function ActivityChart({ activities, onSelectDate }: ActivityChartProps) {
  const [chartData, setChartData] = useState<Activity[]>([]);
  const { t, i18n } = useTranslation();
  
  useEffect(() => {
    if (activities.length === 0) {
      // If no data, create sample data for the last 7 days with random values
      const sampleData: Activity[] = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Generate a random number of steps between 5000 and 12000
        const randomSteps = Math.floor(Math.random() * 7000) + 5000;
        // Calculate calories based on steps (roughly 0.04 calories per step)
        const randomCalories = Math.floor(randomSteps * 0.04);
        // Calculate minutes based on steps (roughly 1 minute per 100 steps)
        const randomMinutes = Math.floor(randomSteps / 100);
        
        return {
          id: i + 1,
          userId: 1,
          date,
          startTime: null,
          endTime: null,
          activityType: "walking",
          steps: randomSteps,
          distance: Math.round(randomSteps * 0.0008 * 10) / 10, // Approximate distance in km
          calories: randomCalories,
          minutes: randomMinutes,
          heartRate: Math.floor(Math.random() * 40) + 70, // Random heart rate between 70-110
          heartRateZones: null,
          elevationGain: Math.floor(Math.random() * 100),
          elevationLoss: Math.floor(Math.random() * 100),
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
      }).reverse(); // Reverse so the most recent day is last (rightmost in the chart)
      
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
    const locale = i18n.language === 'pt' ? 'pt-BR' : 'en-US';
    return date.toLocaleDateString(locale, { weekday: 'short', day: 'numeric' });
  };
  
  const handleBarClick = (date: Date) => {
    onSelectDate(date);
  };
  
  return (
    <CardContent className="px-6 pb-6">
      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">{t('activity.weeklyActivity')}</h4>
      <div className="h-64 bg-gray-50 dark:bg-[#1a2127] rounded-md p-4">
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
                  title={`${activity.steps.toLocaleString()} ${t('activity.steps')}`}
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
