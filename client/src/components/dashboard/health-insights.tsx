import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { InfoIcon, AlertTriangle, CheckCircle } from "lucide-react";

interface HealthInsightsProps {
  className?: string;
}

export function HealthInsights({ className }: HealthInsightsProps) {
  return (
    <Card className={`${className} dark:bg-gray-800 dark:border-gray-700`}>
      <CardHeader>
        <CardTitle className="dark:text-gray-100">Health Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-md bg-primary-50 dark:bg-primary-900/20 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <InfoIcon className="h-5 w-5 text-primary-400 dark:text-primary-300" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-primary-800 dark:text-primary-200">Cholesterol Level Improved</h3>
                <div className="mt-2 text-sm text-primary-700 dark:text-primary-300">
                  <p>Your total cholesterol has decreased by 12% since your last test. Keep up the good work with your current diet and exercise routine.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="rounded-md bg-yellow-50 dark:bg-yellow-900/20 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400 dark:text-yellow-300" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Vitamin D Supplement Recommended</h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <p>Your Vitamin D level is slightly below the recommended range. Consider taking a daily supplement of 1000-2000 IU.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-400 dark:text-green-300" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Physical Activity Goal Met</h3>
                <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                  <p>You've consistently met your activity goals for the past 2 weeks. This is great for your cardiovascular health and stress management.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
