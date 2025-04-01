import { MainLayout } from "@/components/layout/main-layout";
import { HealthSummaryCard } from "@/components/dashboard/health-summary-card";
import { ActivityCard } from "@/components/dashboard/activity-card";
import { HealthInsights } from "@/components/dashboard/health-insights";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressCard } from "@/components/ui/progress-card";
import {
  Heart,
  Footprints,
  Moon,
  Droplets,
  Calendar,
  Thermometer, // Using Thermometer instead of Flask which isn't available
  Video
} from "lucide-react";

export default function DashboardPage() {
  return (
    <MainLayout title="Health Dashboard">
      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-4">
        <HealthSummaryCard
          score={87}
          description="Your health score is excellent"
        />
        
        <ProgressCard
          title="Today's Steps"
          value={12453}
          maxValue={10000}
          unit="steps"
          icon={<Footprints className="h-5 w-5" />}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          progressColor="bg-green-600"
        />
        
        <ProgressCard
          title="Last Night's Sleep"
          value={7.5}
          maxValue={8}
          unit="hours"
          icon={<Moon className="h-5 w-5" />}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
          progressColor="bg-purple-600"
          subtitle="94% of recommended (8 hours)"
        />
        
        <ProgressCard
          title="Water Intake"
          value={2100}
          maxValue={2500}
          unit="ml"
          icon={<Droplets className="h-5 w-5" />}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          progressColor="bg-blue-600"
        />
      </div>
      
      {/* Health Insights & Upcoming */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <HealthInsights className="lg:col-span-2" />
        
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Upcoming</h3>
            <div className="mt-5 space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 dark:bg-opacity-30">
                    <Calendar className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  </span>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Annual Physical Checkup</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Oct 25, 2023 - 10:30 AM</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 dark:bg-opacity-30">
                    <Thermometer className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </span>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Lab Tests (Fasting Required)</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Nov 05, 2023 - 08:00 AM</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 dark:bg-opacity-30">
                    <Video className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </span>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Wellness Webinar</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Oct 30, 2023 - 06:00 PM</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <a href="#" className="text-sm font-medium text-primary hover:text-primary/80 dark:text-primary-400 dark:hover:text-primary-300">
                View all upcoming events
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <div className="mt-6">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Recent Activity</h3>
            <div className="mt-5 flow-root">
              <ul role="list" className="-mb-8">
                <li>
                  <div className="relative pb-8">
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"></span>
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800 bg-green-100 dark:bg-green-900 dark:bg-opacity-30">
                          <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-900 dark:text-gray-100">Completed sleep diary for <span className="font-medium">Oct 20, 2023</span></p>
                        </div>
                        <div className="text-right text-xs whitespace-nowrap text-gray-500 dark:text-gray-400">
                          2 hours ago
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                
                <li>
                  <div className="relative pb-8">
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"></span>
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800 bg-primary-100 dark:bg-primary-900 dark:bg-opacity-30">
                          <Heart className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-900 dark:text-gray-100">Uploaded <span className="font-medium">Blood Test Results</span></p>
                        </div>
                        <div className="text-right text-xs whitespace-nowrap text-gray-500 dark:text-gray-400">
                          Yesterday
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                
                <li>
                  <div className="relative pb-8">
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"></span>
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800 bg-purple-100 dark:bg-purple-900 dark:bg-opacity-30">
                          <Video className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-900 dark:text-gray-100">Watched <span className="font-medium">Stress Reduction Techniques</span> video</p>
                        </div>
                        <div className="text-right text-xs whitespace-nowrap text-gray-500 dark:text-gray-400">
                          2 days ago
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                
                <li>
                  <div className="relative pb-0">
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800 bg-blue-100 dark:bg-blue-900 dark:bg-opacity-30">
                          <Footprints className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-900 dark:text-gray-100">Completed <span className="font-medium">30 minutes of aerobic exercise</span></p>
                        </div>
                        <div className="text-right text-xs whitespace-nowrap text-gray-500 dark:text-gray-400">
                          3 days ago
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div className="mt-6">
              <a href="#" className="text-sm font-medium text-primary hover:text-primary/80 dark:text-primary-400 dark:hover:text-primary-300">
                View all activity
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
