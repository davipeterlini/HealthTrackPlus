import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { WaterIntakeRecord } from "@shared/schema";
import { Droplets, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface WaterTrackerProps {
  waterRecords: WaterIntakeRecord[];
}

export function WaterTracker({ waterRecords }: WaterTrackerProps) {
  const [amount, setAmount] = useState(250); // Default amount: 250ml
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  
  const dailyGoal = 2500; // ml
  
  // Calculate today's water intake
  const today = new Date().toDateString();
  const todayRecords = waterRecords.filter(record => 
    new Date(record.date).toDateString() === today
  );
  
  const todayWaterIntake = todayRecords.reduce((total, record) => total + record.amount, 0);
  const waterPercentage = Math.min((todayWaterIntake / dailyGoal) * 100, 100);
  
  // Recent history (last 7 days)
  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toDateString();
  });
  
  const waterHistory = last7Days.map(day => {
    const dayRecords = waterRecords.filter(record => 
      new Date(record.date).toDateString() === day
    );
    const total = dayRecords.reduce((sum, record) => sum + record.amount, 0);
    return {
      date: day,
      amount: total
    };
  }).reverse();
  
  // Add water mutation
  const addWaterMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/water", { amount });
    },
    onSuccess: () => {
      toast({
        title: t('water.recorded'),
        description: `${t('water.added')} ${amount}ml`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/water"] });
    },
    onError: (error: Error) => {
      toast({
        title: t('water.failedToRecord'),
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleAddWater = () => {
    addWaterMutation.mutate();
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'pt' ? 'pt-BR' : 'en-US', { weekday: 'short', day: 'numeric' });
  };
  
  return (
    <Card className="dark-card shadow-md rounded-xl">
      <CardHeader>
        <CardTitle className="text-slate-800 dark-text-title">{t('water.waterIntake')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <div className="relative w-24 h-24 rounded-full bg-blue-100 dark-stat-icon-bg flex items-center justify-center mr-4">
            <div 
              className="absolute bottom-0 left-0 right-0 bg-blue-500 dark-chart-fill-blue rounded-b-full" 
              style={{
                height: `${waterPercentage}%`, 
                borderRadius: waterPercentage === 100 ? '9999px' : '0 0 9999px 9999px'
              }}
            ></div>
            <div className="relative text-sm font-semibold dark-text-title">{Math.round(waterPercentage)}%</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 dark-text-title">{todayWaterIntake} ml</div>
            <div className="text-sm text-gray-500 dark-text-muted">{t('water.ofGoal')} {dailyGoal} ml</div>
            <div className="mt-2 flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setAmount(250)}
                className={amount === 250 ? "dark-btn-outline-active-blue" : "dark-btn-outline"}
              >
                250ml
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setAmount(500)}
                className={amount === 500 ? "dark-btn-outline-active-blue" : "dark-btn-outline"}
              >
                500ml
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setAmount(1000)}
                className={amount === 1000 ? "dark-btn-outline-active-blue" : "dark-btn-outline"}
              >
                1000ml
              </Button>
            </div>
            <Button 
              size="sm" 
              className="mt-2 dark-btn-outline-blue rounded-full" 
              onClick={handleAddWater}
              disabled={addWaterMutation.isPending}
            >
              <Droplets className="mr-1 h-4 w-4" /> {t('water.addWater')}
            </Button>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-500 dark-text-muted mb-3">{t('water.history')}</h4>
          <div className="grid grid-cols-7 gap-2">
            {waterHistory.map((day, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="relative w-full h-16 bg-gray-100 dark-chart-box rounded-t-sm overflow-hidden">
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-blue-500 dark-chart-fill-blue" 
                    style={{height: `${(day.amount / dailyGoal) * 100}%`}}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 dark-text-muted mt-1">{formatDate(day.date).split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
