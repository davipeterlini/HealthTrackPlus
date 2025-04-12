import { useTranslation } from "react-i18next";
import { Activity } from "@shared/schema";
import { CardContent } from "@/components/ui/card";

interface ActivityWeeklyChartProps {
  activities: Activity[];
  onSelectDate?: (date: Date) => void;
}

export function ActivityWeeklyChart({ activities, onSelectDate }: ActivityWeeklyChartProps) {
  const { t, i18n } = useTranslation();
  
  // Processar os dados das atividades para criar dados de gráfico similares ao dashboard
  const weekData = (() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const diasPt = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const shortDaysEn = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const shortDaysPt = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
    
    // Criar um mapa para armazenar os dados agregados por dia da semana
    const dayMap: Record<number, {
      date: Date,
      day: string, 
      steps: number,
      cals: number,
      active: number,
      shortDay: string
    }> = {};
    
    // Inicializar o mapa com os últimos 7 dias
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dayOfWeek = date.getDay(); // 0 = domingo, 6 = sábado
      
      dayMap[6-i] = {
        date: new Date(date),
        day: i18n.language.startsWith('en') ? days[dayOfWeek] : diasPt[dayOfWeek],
        steps: 0,
        cals: 0,
        active: 0,
        shortDay: i18n.language.startsWith('en') ? shortDaysEn[dayOfWeek] : shortDaysPt[dayOfWeek]
      };
    }
    
    // Agregar os dados das atividades por dia da semana
    if (activities && activities.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Obter a data de 6 dias atrás (para uma semana completa)
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - 6);
      
      // Filtrar atividades da última semana
      const weekActivities = activities.filter(activity => {
        const activityDate = new Date(activity.date);
        activityDate.setHours(0, 0, 0, 0);
        return activityDate >= weekStart && activityDate <= today;
      });
      
      // Agregar dados por dia
      weekActivities.forEach(activity => {
        const activityDate = new Date(activity.date);
        activityDate.setHours(0, 0, 0, 0);
        
        // Calcular o índice do dia (0 = hoje-6, 6 = hoje)
        const daysDiff = Math.floor((today.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
        const dayIndex = 6 - daysDiff;
        
        if (dayIndex >= 0 && dayIndex <= 6) {
          // Acumular os dados
          dayMap[dayIndex].steps += activity.steps;
          dayMap[dayIndex].cals += activity.calories;
        }
      });
      
      // Calcular o percentual ativo com base no número de passos (máximo considerado: 12000)
      const maxSteps = 12000;
      Object.keys(dayMap).forEach(key => {
        const index = Number(key);
        dayMap[index].active = Math.min(Math.round((dayMap[index].steps / maxSteps) * 100), 100);
      });
    }
    
    return Object.values(dayMap);
  })();
  
  const handleBarClick = (date: Date) => {
    if (onSelectDate) {
      onSelectDate(date);
    }
  };
  
  return (
    <CardContent className="px-6 pb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('activity.weeklyActivity')}</h4>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-emerald-500 mr-1.5"></div>
            <span className="text-xs text-slate-600 dark:text-gray-400">{t('activity.steps')}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-1.5"></div>
            <span className="text-xs text-slate-600 dark:text-gray-400">{t('activity.calories')}</span>
          </div>
        </div>
      </div>
      
      <div className="relative h-40 sm:h-52 mt-6 sm:mt-2 ml-4 sm:ml-6 mr-1">
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
          {weekData.map((item, i) => (
            <div 
              key={i} 
              className="flex flex-col items-center h-full justify-end cursor-pointer"
              onClick={() => handleBarClick(item.date)}
            >
              <div className="w-full relative flex items-end justify-center h-[85%]">
                {/* Barra de passos */}
                <div 
                  className="w-full bg-emerald-500/80 dark:bg-emerald-500/70 rounded-t-md z-20 relative group"
                  style={{ height: `${Math.max(item.active, 2)}%` }} // Mínimo de 2% para barras visíveis mesmo com 0
                >
                  {/* Tooltip ao passar o mouse ou tocar */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30">
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
                
                {/* Linha de calorias */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 z-10"
                  style={{ bottom: `${Math.min((item.cals / 2500) * 100, 100)}%` }}
                >
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500 absolute right-0 top-1/2 transform -translate-y-1/2"></div>
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
    </CardContent>
  );
}