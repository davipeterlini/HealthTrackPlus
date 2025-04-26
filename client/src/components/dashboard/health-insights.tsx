import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { InfoIcon, AlertTriangle, CheckCircle, LightbulbIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface InsightItem {
  type: 'info' | 'warning' | 'success';
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface HealthInsightsProps {
  className?: string;
  insights?: InsightItem[];
  compact?: boolean;
}

export function HealthInsights({ className, insights, compact = false }: HealthInsightsProps) {
  const { t } = useTranslation();
  
  // Sample insights if none provided
  const defaultInsights: InsightItem[] = [
    {
      type: 'info',
      title: t('insights.cholesterolImproved'),
      description: t('insights.cholesterolDescription'),
      icon: <InfoIcon className="responsive-icon-sm text-blue-500 dark:text-blue-400" />
    },
    {
      type: 'warning',
      title: t('insights.vitaminD'),
      description: t('insights.vitaminDDescription'),
      icon: <AlertTriangle className="responsive-icon-sm text-amber-500 dark:text-amber-400" />
    },
    {
      type: 'success',
      title: t('insights.activityGoal'),
      description: t('insights.activityGoalDescription'),
      icon: <CheckCircle className="responsive-icon-sm text-emerald-500 dark:text-emerald-400" />
    }
  ];
  
  const displayInsights = insights || defaultInsights;
  
  // Função para obter as cores baseadas no tipo de insight
  const getInsightStyles = (type: string) => {
    switch (type) {
      case 'info':
        return {
          bg: "bg-blue-50 dark:bg-blue-900/20",
          title: "text-blue-800 dark:text-blue-200",
          text: "text-blue-700 dark:text-blue-300"
        };
      case 'warning':
        return {
          bg: "bg-amber-50 dark:bg-amber-900/20",
          title: "text-amber-800 dark:text-amber-200",
          text: "text-amber-700 dark:text-amber-300"
        };
      case 'success':
        return {
          bg: "bg-emerald-50 dark:bg-emerald-900/20",
          title: "text-emerald-800 dark:text-emerald-200",
          text: "text-emerald-700 dark:text-emerald-300"
        };
      default:
        return {
          bg: "bg-slate-50 dark:bg-slate-900/20",
          title: "text-slate-800 dark:text-slate-200",
          text: "text-slate-700 dark:text-slate-300"
        };
    }
  };
  
  return (
    <Card className={className} variant={compact ? "small" : "default"}>
      <CardHeader>
        <CardTitle className="text-slate-800 dark:text-slate-100 flex items-center">
          <LightbulbIcon className="responsive-icon-sm mr-2 text-amber-500 dark:text-amber-400" />
          {t('dashboard.healthInsights')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="responsive-gap-y flex flex-col">
          {displayInsights.map((insight, index) => {
            const styles = getInsightStyles(insight.type);
            
            return (
              <div key={index} className={`rounded-md ${styles.bg} responsive-p-xs`}>
                <div className="flex responsive-gap">
                  <div className="flex-shrink-0">
                    {insight.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`responsive-text-sm font-medium ${styles.title}`}>
                      {insight.title}
                    </h3>
                    <div className={`responsive-mt-xs ${styles.text}`}>
                      <p className="responsive-text-sm">{insight.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
