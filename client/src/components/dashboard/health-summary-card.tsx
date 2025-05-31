import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

interface HealthSummaryCardProps {
  score: number;
  description: string;
  compact?: boolean;
}

export function HealthSummaryCard({ score, description, compact = false }: HealthSummaryCardProps) {
  const { t } = useTranslation();
  
  // Determina a cor baseada na pontuação
  const getScoreColor = () => {
    if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 60) return "text-blue-600 dark:text-blue-400";
    if (score >= 40) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };
  
  // Determina a cor do fundo do ícone baseada na pontuação
  const getScoreBgColor = () => {
    if (score >= 80) return "bg-emerald-100 dark:bg-emerald-900/30";
    if (score >= 60) return "bg-blue-100 dark:bg-blue-900/30";
    if (score >= 40) return "bg-yellow-100 dark:bg-yellow-900/30";
    return "bg-red-100 dark:bg-red-900/30";
  };
  
  // Determina a cor da barra de progresso baseada na pontuação
  const getProgressColor = () => {
    if (score >= 80) return "bg-emerald-500 dark:bg-emerald-500";
    if (score >= 60) return "bg-blue-500 dark:bg-blue-500";
    if (score >= 40) return "bg-yellow-500 dark:bg-yellow-500";
    return "bg-red-500 dark:bg-red-500";
  };
  
  return (
    <Card variant={compact ? "small" : "default"}>
      <CardContent>
        <div className="flex items-center responsive-gap">
          <div className={`responsive-icon-container ${getScoreBgColor()} rounded-md`}>
            <Heart className={`${getScoreColor()} responsive-icon`} />
          </div>
          <div className="flex-1">
            <dl>
              <dt className="responsive-text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
                {t('dashboard.healthScore')}
              </dt>
              <dd>
                <div className="responsive-text-lg font-medium text-slate-900 dark:text-slate-100">
                  {score}/100
                </div>
              </dd>
            </dl>
          </div>
        </div>
        <div className="responsive-mt-sm">
          <div className="relative pt-1">
            <Progress value={score} className={getProgressColor()} />
          </div>
          <p className="responsive-mt-xs responsive-text-xs text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
