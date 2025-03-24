import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Heart } from "lucide-react";

interface HealthSummaryCardProps {
  score: number;
  description: string;
}

export function HealthSummaryCard({ score, description }: HealthSummaryCardProps) {
  return (
    <Card>
      <CardContent className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
            <Heart className="text-primary-600 h-5 w-5" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Health Score</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{score}/100</div>
              </dd>
            </dl>
          </div>
        </div>
        <div className="mt-4">
          <div className="relative pt-1">
            <Progress value={score} className="bg-primary-600" />
          </div>
          <p className="mt-2 text-xs text-gray-500">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
