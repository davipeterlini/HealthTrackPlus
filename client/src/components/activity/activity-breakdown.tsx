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
import { useTranslation } from "react-i18next";

interface ActivityBreakdownProps {
  activity?: Activity;
}

export function ActivityBreakdown({ activity }: ActivityBreakdownProps) {
  const { t } = useTranslation();
  
  const calculateActivityDistribution = (activity?: Activity) => {
    const types = {
      walking: { type: t('activity.walking'), percentage: 0, color: "bg-primary-600 dark:bg-primary-500" },
      running: { type: t('activity.running'), percentage: 0, color: "bg-green-500 dark:bg-green-400" },
      cycling: { type: t('activity.cycling'), percentage: 0, color: "bg-purple-500 dark:bg-purple-400" },
      other: { type: t('activity.other'), percentage: 0, color: "bg-blue-500 dark:bg-blue-400" }
    } as Record<string, { type: string; percentage: number; color: string }>;
    
    if (!activity) {
      // If no activity, use reasonable defaults for demo
      types.walking.percentage = 65;
      types.running.percentage = 20;
      types.cycling.percentage = 10;
      types.other.percentage = 5;
    } else {
      const total = activity.minutes || 0;
      if (total > 0) {
        // If we have real activity, use its type
        const activityType = activity.activityType || 'walking';
        // Verificar se o tipo existe em nosso objeto, caso contrário, usar "other"
        if (types[activityType]) {
          types[activityType].percentage = 100;
        } else {
          types.other.percentage = 100;
        }
      } else {
        // Fallback for activity with no minutes
        types.walking.percentage = 65;
        types.running.percentage = 20;
        types.cycling.percentage = 10;
        types.other.percentage = 5;
      }
    }
    
    return Object.values(types).filter(t => t.percentage > 0);
  };

  const activityTypes = calculateActivityDistribution(activity);
  
  // Heart rate zones (for demo purposes)
  const heartRateZones = [
    { name: t('activity.high'), minutes: 12, color: "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
    { name: t('activity.cardio'), minutes: 25, color: "bg-orange-50 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
    { name: t('activity.fatBurn'), minutes: 38, color: "bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" },
    { name: t('activity.warmUp'), minutes: 15, color: "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300" }
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
    <Card className="bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card">
      <CardHeader className="responsive-card-header">
        <CardTitle className="responsive-title-sm text-slate-800 dark:text-white">{t('activity.breakdown')}</CardTitle>
      </CardHeader>
      <CardContent className="responsive-card-content space-y-6">
        <div>
          <h4 className="responsive-text-sm font-medium text-slate-600 dark:text-gray-300">{t('activity.types')}</h4>
          <div className="mt-2 space-y-4">
            {activityTypes.map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="responsive-text-xs font-medium text-slate-700 dark:text-gray-200">{item.type}</span>
                  <span className="responsive-text-xs font-medium text-slate-700 dark:text-gray-200">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-6 border-t border-slate-200 dark:border-gray-700">
          <h4 className="responsive-text-sm font-medium text-slate-600 dark:text-gray-300">{t('activity.heartRateZones')}</h4>
          
          <div className="mt-2 grid grid-cols-2 gap-4">
            {heartRateZones.map((zone, i) => (
              <div key={i} className={`${zone.color} dark:bg-gray-800 dark:border dark:border-gray-700 rounded-md p-3`}>
                <span className="responsive-text-xs font-medium">{zone.name}</span>
                <p className="mt-1 responsive-text-md font-semibold text-slate-800 dark:text-white">{zone.minutes} min</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-6 border-t border-slate-200 dark:border-gray-700">
          <h4 className="responsive-text-sm font-medium text-slate-600 dark:text-gray-300">{t('activity.connectedDevices')}</h4>
          
          <div className="mt-3 space-y-3">
            {connectedDevices.map((device, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="responsive-icon-container rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center">
                    {device.type === 'watch' ? (
                      <Watch className="responsive-icon-sm text-slate-600 dark:text-gray-300" />
                    ) : (
                      <Smartphone className="responsive-icon-sm text-slate-600 dark:text-gray-300" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="responsive-text-sm font-medium text-slate-800 dark:text-white">{device.name}</p>
                    <p className="responsive-text-xs text-slate-500 dark:text-gray-400">{t('activity.lastSynced')}: {device.lastSynced}</p>
                  </div>
                </div>
                <div>
                  {device.connected ? (
                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-0">
                      {t('activity.connected')}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-0">
                      {t('activity.disconnected')}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-6 border-t border-slate-200 dark:border-gray-700">
          <h4 className="responsive-text-sm font-medium text-slate-600 dark:text-gray-300">{t('activity.details')}</h4>
          
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between p-2 rounded hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center">
                <Heart className="responsive-icon text-red-500 dark:text-red-400 mr-3" />
                <span className="responsive-text-sm text-slate-700 dark:text-gray-200">{t('activity.avgHeartRate')}</span>
              </div>
              <div className="flex items-center">
                <span className="responsive-text-sm font-medium text-slate-800 dark:text-white">
                  {activity?.heartRate || 76} bpm
                </span>
                <ChevronRight className="responsive-icon-xs text-slate-400 dark:text-gray-500 ml-2" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2 rounded hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="responsive-icon text-emerald-600 dark:text-emerald-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span className="responsive-text-sm text-slate-700 dark:text-gray-200">{t('activity.elevationGain')}</span>
              </div>
              <div className="flex items-center">
                <span className="responsive-text-sm font-medium text-slate-800 dark:text-white">
                  {activity?.elevationGain || 48} m
                </span>
                <ChevronRight className="responsive-icon-xs text-slate-400 dark:text-gray-500 ml-2" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-2 rounded hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="responsive-icon text-green-500 dark:text-green-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="responsive-text-sm text-slate-700 dark:text-gray-200">{t('activity.pace')}</span>
              </div>
              <div className="flex items-center">
                <span className="responsive-text-sm font-medium text-slate-800 dark:text-white">
                  {activity?.avgPace || '9:24'} /km
                </span>
                <ChevronRight className="responsive-icon-xs text-slate-400 dark:text-gray-500 ml-2" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
