import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface ActivityData {
  date: string;
  steps: number;
  activeMinutes: number;
  calories: number;
}

interface ActivityCardProps {
  data?: ActivityData[];
  compact?: boolean;
}

export function ActivityCard({ data, compact = false }: ActivityCardProps) {
  const [chartData, setChartData] = useState<ActivityData[]>([]);
  const { t, i18n } = useTranslation();
  
  useEffect(() => {
    // If no data is provided, use sample data
    if (!data) {
      const today = new Date();
      const sampleData: ActivityData[] = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(today.getDate() - i);
        
        return { 
          date: date.toISOString().split('T')[0], 
          steps: Math.floor(Math.random() * 8000) + 4000, 
          activeMinutes: Math.floor(Math.random() * 40) + 20, 
          calories: Math.floor(Math.random() * 300) + 200 
        };
      }).reverse();
      
      setChartData(sampleData);
    } else {
      setChartData(data);
    }
  }, [data]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const currentLang = i18n.language;
    
    // Usar o idioma atual para formatação de data
    const options: Intl.DateTimeFormatOptions = { weekday: 'short' };
    return date.toLocaleDateString(currentLang === 'pt' ? 'pt-BR' : 'en-US', options);
  };
  
  return (
    <Card variant={compact ? "small" : "default"}>
      <CardHeader className={compact ? "pb-1" : "pb-2"}>
        <CardTitle className="responsive-title-sm flex items-center">
          <Activity className="responsive-icon-sm mr-2 text-emerald-500 dark:text-emerald-400" />
          {t('dashboard.weeklyActivity')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`${compact ? 'responsive-chart-sm' : 'responsive-chart'} relative`}>
          <div className="h-full flex items-end responsive-gap-xs">
            {chartData.map((day, i) => (
              <div key={i} className="flex flex-col items-center responsive-gap-xs flex-1">
                <div 
                  className="w-full bg-emerald-400 dark:bg-emerald-500 rounded-t-sm hover:bg-emerald-500 dark:hover:bg-emerald-400 responsive-transition" 
                  style={{ 
                    height: `${Math.min((day.steps / 14000) * 100, 95)}%`,
                    minHeight: '4px'
                  }}
                />
                <span className="responsive-text-xs text-slate-500 dark:text-slate-400 hidden xs:block">{formatDate(day.date)}</span>
                <span className="responsive-text-xs text-slate-500 dark:text-slate-400 xs:hidden">{i % 2 === 0 ? formatDate(day.date) : ''}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
