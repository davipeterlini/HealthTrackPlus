import { Activity } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Watch, 
  Smartphone,
  ChevronRight,
  Heart
} from "lucide-react";

interface ActivityBreakdownProps {
  activity?: Activity;
}

export function ActivityBreakdown({ activity }: ActivityBreakdownProps) {
  const calculateActivityDistribution = (activity?: Activity) => {
    if (!activity) return [];
    
    const types = {
      walking: { type: "Walking", percentage: 0, color: "bg-primary-600 dark:bg-primary-500" },
      running: { type: "Running", percentage: 0, color: "bg-green-500 dark:bg-green-400" },
      cycling: { type: "Cycling", percentage: 0, color: "bg-purple-500 dark:bg-purple-400" },
      other: { type: "Other", percentage: 0, color: "bg-blue-500 dark:bg-blue-400" }
    };
    
    const total = activity.minutes || 0;
    if (total > 0) {
      types[activity.activityType].percentage = 100;
    }
    
    return Object.values(types).filter(t => t.percentage > 0);
  };

  const activityTypes = calculateActivityDistribution(activity);
  
  // Heart rate zones (for demo purposes)
  const heartRateZones = [
    { name: "High", minutes: 12, color: "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
    { name: "Cardio", minutes: 25, color: "bg-orange-50 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
    { name: "Fat Burn", minutes: 38, color: "bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" },
    { name: "Warm Up", minutes: 15, color: "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300" }
  ];
  
  // Connected devices (for demo purposes)
  const connectedDevices = [
    { 
      name: "Fitbit Sense", 
      type: "watch", 
      lastSynced: "1 hour ago",
      connected: true
    },
    { 
      name: "iPhone Health", 
      type: "phone", 
      lastSynced: "30 mins ago",
      connected: true
    }
  ];
  
  return (
    <Card className="dark:bg-gray-900 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100">Activity Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-300">Activity Types</h4>
          <div className="mt-2 space-y-4">
            {activityTypes.map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{item.type}</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                  <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-300">Heart Rate Zones</h4>
          
          <div className="mt-2 grid grid-cols-2 gap-4">
            {heartRateZones.map((zone, i) => (
              <div key={i} className={`${zone.color} dark:bg-gray-900 dark:border dark:border-gray-700 rounded-md p-3`}>
                <span className="text-xs font-medium">{zone.name}</span>
                <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{zone.minutes} min</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-300">Connected Devices</h4>
          
          <div className="mt-3 space-y-3">
            {connectedDevices.map((device, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    {device.type === 'watch' ? (
                      <Watch className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    ) : (
                      <Smartphone className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{device.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-300">Last synced: {device.lastSynced}</p>
                  </div>
                </div>
                <div>
                  {device.connected ? (
                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-0">
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-0">
                      Disconnected
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {activity && activity.steps > 0 && (
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-300">Activity Details</h4>
            
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="flex items-center">
                  <Heart className="h-5 w-5 text-red-500 dark:text-red-400 mr-3" />
                  <span className="text-sm text-gray-700 dark:text-gray-200">Average Heart Rate</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium dark:text-gray-100">76 bpm</span>
                  <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500 ml-2" />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  <span className="text-sm text-gray-700 dark:text-gray-200">Elevation Gain</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium dark:text-gray-100">48 m</span>
                  <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500 ml-2" />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 dark:text-green-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-sm text-gray-700 dark:text-gray-200">Pace</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium dark:text-gray-100">9:24 /km</span>
                  <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500 ml-2" />
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
