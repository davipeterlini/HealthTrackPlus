import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressCardProps {
  title: string;
  value: number;
  maxValue: number;
  unit: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  progressColor: string;
  subtitle?: string;
}

export function ProgressCard({
  title,
  value,
  maxValue,
  unit,
  icon,
  iconBgColor,
  iconColor,
  progressColor,
  subtitle,
}: ProgressCardProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${iconBgColor} dark:bg-opacity-20`}>
            <div className={`${iconColor} dark:text-opacity-90`}>{icon}</div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {value.toLocaleString()} {unit}
                </div>
              </dd>
            </dl>
          </div>
        </div>
        <div className="mt-4">
          <div className="relative pt-1">
            <Progress value={percentage} className={`${progressColor} dark:bg-opacity-80`} />
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {subtitle || `${percentage.toFixed(0)}% of daily goal (${maxValue.toLocaleString()} ${unit})`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
