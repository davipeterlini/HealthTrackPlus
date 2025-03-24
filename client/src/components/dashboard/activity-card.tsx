import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Activity } from "lucide-react";
import { useEffect, useState } from "react";

interface ActivityData {
  date: string;
  steps: number;
  activeMinutes: number;
  calories: number;
}

interface ActivityCardProps {
  data?: ActivityData[];
}

export function ActivityCard({ data }: ActivityCardProps) {
  const [chartData, setChartData] = useState<ActivityData[]>([]);
  
  useEffect(() => {
    // If no data is provided, use sample data
    if (!data) {
      const sampleData: ActivityData[] = [
        { date: '2023-10-20', steps: 12453, activeMinutes: 65, calories: 567 },
        { date: '2023-10-19', steps: 8234, activeMinutes: 42, calories: 423 },
        { date: '2023-10-18', steps: 10876, activeMinutes: 58, calories: 512 },
        { date: '2023-10-17', steps: 9543, activeMinutes: 51, calories: 478 },
        { date: '2023-10-16', steps: 7865, activeMinutes: 38, calories: 389 },
        { date: '2023-10-15', steps: 11234, activeMinutes: 62, calories: 534 },
        { date: '2023-10-14', steps: 6543, activeMinutes: 32, calories: 345 }
      ];
      setChartData(sampleData);
    } else {
      setChartData(data);
    }
  }, [data]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center">
          <Activity className="h-4 w-4 mr-2 text-primary" />
          Weekly Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 relative">
          <div className="h-full flex items-end space-x-2">
            {chartData.map((day, i) => (
              <div key={i} className="flex flex-col items-center space-y-1 flex-1">
                <div 
                  className="w-full bg-primary-400 rounded-t-sm hover:bg-primary-500 transition-all duration-200" 
                  style={{ height: `${(day.steps / 14000) * 100}%` }}
                />
                <span className="text-xs text-gray-500">{formatDate(day.date)}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
