import { Activity } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Footprints,
  Flame,
  Clock
} from "lucide-react";

interface ActivitySummaryProps {
  activities: Activity[];
  selectedDate: Date;
}

export function ActivitySummary({ activities, selectedDate }: ActivitySummaryProps) {
  // Find activity for the selected date
  const todayActivity = activities.find(
    activity => new Date(activity.date).toDateString() === selectedDate.toDateString()
  );
  
  // Default values
  const steps = todayActivity?.steps || 0;
  const calories = todayActivity?.calories || 0;
  const activeMinutes = todayActivity?.minutes || 0;
  const distance = todayActivity?.distance || 0;
  const source = todayActivity?.source || 'manual';
  
  // Goals
  const stepsGoal = 10000;
  const caloriesGoal = 600;
  const minutesGoal = 60;
  const distanceGoal = 5; // 5km per day
  
  // Calculate percentages
  const stepsPercentage = Math.min((steps / stepsGoal) * 100, 100);
  const caloriesPercentage = Math.min((calories / caloriesGoal) * 100, 100);
  const minutesPercentage = Math.min((activeMinutes / minutesGoal) * 100, 100);
  
  // Calculate week-over-week change (using the last 14 days of data)
  const getLast7DaysTotal = (days: number[], startDaysAgo: number) => {
    let total = 0;
    for (let i = startDaysAgo; i < startDaysAgo + 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      
      const activity = activities.find(a => new Date(a.date).toDateString() === dateStr);
      if (activity) total += activity.steps;
    }
    return total;
  };
  
  const thisWeekSteps = getLast7DaysTotal(Array.from({ length: 7 }).map((_, i) => i), 0);
  const lastWeekSteps = getLast7DaysTotal(Array.from({ length: 7 }).map((_, i) => i), 7);
  
  const stepsChange = lastWeekSteps > 0 
    ? Math.round(((thisWeekSteps - lastWeekSteps) / lastWeekSteps) * 100) 
    : 0;
  
  return (
    <CardContent className="p-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-5">Activity Summary</h3>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-gray-50 dark:bg-gray-800 overflow-hidden shadow rounded-md">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 dark:bg-green-900 rounded-full p-3">
                <Footprints className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-5">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Steps</h4>
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
                {Math.round(stepsPercentage)}% of daily goal ({stepsGoal.toLocaleString()} steps)
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 overflow-hidden shadow rounded-md">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 dark:bg-primary-900 rounded-full p-3">
                <Flame className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="ml-5">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Calories</h4>
                <div className="mt-1 flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{calories}</div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-primary-200 dark:bg-primary-800">
                  <div 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-600 dark:bg-primary-500" 
                    style={{ width: `${caloriesPercentage}%` }}
                  ></div>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {Math.round(caloriesPercentage)}% of daily goal ({caloriesGoal} kcal)
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 overflow-hidden shadow rounded-md">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900 rounded-full p-3">
                <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-5">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Minutes</h4>
                <div className="mt-1 flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{activeMinutes}</div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-purple-200 dark:bg-purple-800">
                  <div 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-600 dark:bg-purple-500" 
                    style={{ width: `${minutesPercentage}%` }}
                  ></div>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {Math.round(minutesPercentage)}% of daily goal ({minutesGoal} min)
              </p>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  );
}
