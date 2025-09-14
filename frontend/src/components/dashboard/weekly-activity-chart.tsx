import React, { useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

interface ActivityDay {
  day: string;
  steps: number;
  cals: number;
  active: number;
  shortDay: string;
}

interface WeeklyActivityChartProps {
  activityData: ActivityDay[] | null;
  isLoading?: boolean;
}

export const WeeklyActivityChart = React.memo(({ activityData, isLoading = false }: WeeklyActivityChartProps) => {
  const { t } = useTranslation();

  const defaultData = useMemo(() => {
    const isEnglish = localStorage.getItem('i18nextLng')?.startsWith('en');
    return [
      { 
        day: isEnglish ? 'Sun' : 'Dom', 
        steps: 5240, 
        cals: 1250, 
        active: 25, 
        shortDay: isEnglish ? 'S' : 'D' 
      },
      { 
        day: isEnglish ? 'Mon' : 'Seg', 
        steps: 7890, 
        cals: 1540, 
        active: 48, 
        shortDay: isEnglish ? 'M' : 'S' 
      },
      { 
        day: isEnglish ? 'Tue' : 'Ter', 
        steps: 9450, 
        cals: 1780, 
        active: 62, 
        shortDay: isEnglish ? 'T' : 'T' 
      },
      { 
        day: isEnglish ? 'Wed' : 'Qua', 
        steps: 10200, 
        cals: 1820, 
        active: 75, 
        shortDay: isEnglish ? 'W' : 'Q' 
      },
      { 
        day: isEnglish ? 'Thu' : 'Qui', 
        steps: 8750, 
        cals: 1650, 
        active: 53, 
        shortDay: isEnglish ? 'T' : 'Q' 
      },
      { 
        day: isEnglish ? 'Fri' : 'Sex', 
        steps: 12100, 
        cals: 2100, 
        active: 85, 
        shortDay: isEnglish ? 'F' : 'S' 
      },
      { 
        day: isEnglish ? 'Sat' : 'Sáb', 
        steps: 6800, 
        cals: 1420, 
        active: 40, 
        shortDay: isEnglish ? 'S' : 'S' 
      }
    ];
  }, []);
  
  const chartData = useMemo(() => {
    return (isLoading || !activityData) ? defaultData : activityData;
  }, [isLoading, activityData, defaultData]);

  return (
    <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 p-1.5 xxs:p-2 xs:p-3 sm:p-4 mb-2 xxs:mb-3 xs:mb-4 shadow-md overflow-hidden w-full max-w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1 xxs:mb-2 xs:mb-3 gap-1 xxs:gap-1.5 w-full max-w-full overflow-hidden box-border">
        <h3 className="text-base xxs:text-lg sm:text-xl font-semibold">{t('health.weeklyActivities')}</h3>
        <div className="flex flex-wrap items-center gap-2 xxs:gap-3 sm:gap-4 text-[10px] xxs:text-xs">
          <div className="flex items-center">
            <div className="w-2.5 h-2.5 xxs:w-3 xxs:h-3 rounded-full bg-emerald-500 mr-1 xxs:mr-1.5"></div>
            <span className="text-[10px] xxs:text-xs text-slate-600 dark:text-gray-400">{t('activity.steps')}</span>
          </div>
          <div className="flex items-center">
            <div className="w-2.5 h-2.5 xxs:w-3 xxs:h-3 rounded-full bg-blue-500 mr-1 xxs:mr-1.5"></div>
            <span className="text-[10px] xxs:text-xs text-slate-600 dark:text-gray-400">{t('activity.calories')}</span>
          </div>
        </div>
      </div>
      
      <div className="relative h-24 xxs:h-28 xs:h-32 sm:h-40 md:h-44 mt-2 xxs:mt-3 sm:mt-2 ml-2 xxs:ml-3 xs:ml-4 sm:ml-6 mr-1">
        {/* Linhas de grade horizontais */}
        <div className="absolute left-0 right-0 top-0 bottom-0 flex flex-col justify-between pointer-events-none">
          {[0, 1, 2, 3, 4].map((_, i) => (
            <div 
              key={i} 
              className="border-t border-gray-100 dark:border-gray-800 w-full h-0"
              style={{ top: `${i * 25}%` }}
            />
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1 sm:gap-2 h-full relative z-10">
          {chartData.map((item, i) => (
            <div key={i} className="flex flex-col items-center h-full justify-end">
              <div className="w-full relative flex items-end justify-center h-[85%]">
                {/* Barra de passos com design aprimorado */}
                <div 
                  className="w-[70%] mx-auto bg-emerald-500/80 dark:bg-emerald-500/70 rounded-t-md z-20 relative group cursor-pointer transition-all duration-300 ease-in-out"
                  style={{ 
                    height: `${Math.max(item.active * 0.7, 2)}%`,
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)' 
                  }}
                >
                  {/* Brilho superior para efeito 3D suave */}
                  <div className="absolute top-0 left-0 right-0 h-[20%] bg-gradient-to-b from-white/30 to-transparent rounded-t-md"></div>
                  
                  {/* Tooltip aprimorado */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-30 shadow-xl">
                    <div className="bg-white dark:bg-slate-800 shadow-lg rounded-md p-2 text-xs min-w-[100px] sm:min-w-[120px]">
                      <div className="font-semibold text-slate-800 dark:text-white mb-1">{item.day}</div>
                      <div className="flex justify-between text-slate-600 dark:text-gray-300">
                        <span>{t('activity.stepsLabel')}:</span>
                        <span>{item.steps.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-gray-300">
                        <span>{t('activity.caloriesLabel')}:</span>
                        <span>{item.cals}</span>
                      </div>
                    </div>
                    <div className="border-t-8 border-t-white dark:border-t-slate-800 border-l-8 border-l-transparent border-r-8 border-r-transparent h-0 w-0 absolute left-1/2 transform -translate-x-1/2"></div>
                  </div>
                </div>
                
                {/* Linha de calorias com design de curva suave */}
                <div className="absolute w-[70%] mx-auto left-0 right-0 z-10"
                  style={{ 
                    bottom: `${Math.min((item.cals / 2500) * 100 * 0.7, 100)}%`,
                    height: '3px',
                    background: 'linear-gradient(to right, transparent, #3b82f6 50%, #3b82f6)'
                  }}
                >
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-blue-500 absolute right-0 top-1/2 transform -translate-y-1/2 shadow-md"></div>
                </div>
              </div>
              
              <div className="flex flex-col items-center mt-2">
                <span className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 hidden sm:block">{item.day}</span>
                <span className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 block sm:hidden">{item.shortDay}</span>
                <span className="text-[10px] sm:text-xs text-slate-500 dark:text-gray-500 mt-0.5">{Math.round(item.steps/1000)}k</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Escala vertical - visível apenas em telas maiores */}
        <div className="absolute -left-2 sm:left-0 top-0 bottom-8 flex flex-col justify-between">
          {[10000, 7500, 5000, 2500, 0].map((value, i) => (
            <div key={i} className="text-[10px] sm:text-xs text-slate-400 dark:text-gray-500 -translate-x-4 sm:-translate-x-6">
              {i === 0 ? '10k' : 
                i === 1 ? '7.5k' : 
                i === 2 ? '5k' : 
                i === 3 ? '2.5k' : '0'}
            </div>
          ))}
        </div>
      </div>
      
      {/* Informações responsivas para telas menores */}
      <div className="mt-2 text-xs text-center text-slate-500 dark:text-gray-400 sm:hidden">
        <p>{t('health.touchBars')}</p>
      </div>
    </Card>
  );
});

WeeklyActivityChart.displayName = 'WeeklyActivityChart';