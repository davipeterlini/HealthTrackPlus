import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Baby, 
  Calendar, 
  Heart, 
  Bell, 
  Pill, 
  FileText, 
  ChevronRight,
  Clock,
  AlertTriangle,
  CheckCircle,
  Plus
} from 'lucide-react';
import { PregnancyEvolution } from '@/components/pregnancy/pregnancy-evolution';
import { PregnancyTips } from '@/components/pregnancy/pregnancy-tips';
import { PregnancyVitamins } from '@/components/pregnancy/pregnancy-vitamins';
import { PregnancyExams } from '@/components/pregnancy/pregnancy-exams';
import { PregnancyAlerts } from '@/components/pregnancy/pregnancy-alerts';

export default function PregnancyPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'evolution' | 'tips' | 'vitamins' | 'exams' | 'alerts'>('evolution');

  // Mock data - será substituído por dados reais da API
  const pregnancyData = {
    currentWeek: 24,
    currentDay: 3,
    dueDate: new Date('2025-05-15'),
    lastPeriod: new Date('2024-08-15'),
    babySize: 'Tamanho de uma espiga de milho',
    babyWeight: '600g',
    alertsCount: 2,
    upcomingExams: 1,
    vitaminsToday: 3,
    vitaminsTaken: 1
  };

  const calculateProgress = () => {
    const totalWeeks = 40;
    const progress = ((pregnancyData.currentWeek - 1) + (pregnancyData.currentDay / 7)) / totalWeeks * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const getDaysUntilDue = () => {
    const today = new Date();
    const due = pregnancyData.dueDate;
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const tabs = [
    { id: 'evolution', label: t('pregnancy.baby_evolution'), icon: Baby },
    { id: 'tips', label: t('pregnancy.tips'), icon: Heart },
    { id: 'vitamins', label: t('pregnancy.vitamins'), icon: Pill },
    { id: 'exams', label: t('pregnancy.exams'), icon: FileText },
    { id: 'alerts', label: t('pregnancy.alerts'), icon: Bell }
  ];

  return (
    <MainLayout title={t('pregnancy.title')} hideTitle={true}>
      <div className="flex justify-between items-center responsive-mb">
        <h1 className="responsive-title-lg text-slate-800 dark:text-white">{t('pregnancy.title')}</h1>
        <Button className="bg-pink-600 hover:bg-pink-700 dark:text-white dark:bg-pink-700 dark:hover:bg-pink-600 responsive-button">
          <Plus className="mr-2 responsive-icon-sm" />
          {t('pregnancy.add_pregnancy')}
        </Button>
      </div>

      {/* Progress Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 responsive-gap-y">
        <Card className="bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card">
          <CardContent className="p-4 responsive-card-content">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('pregnancy.current_week')}</span>
              <Badge variant="outline" className="bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400 border-pink-200 dark:border-pink-800">
                {pregnancyData.currentWeek}w {pregnancyData.currentDay}d
              </Badge>
            </div>
            <Progress value={calculateProgress()} className="h-2 bg-pink-100 dark:bg-gray-700">
              <div className="h-full bg-gradient-to-r from-pink-400 to-purple-500 dark:from-pink-600 dark:to-purple-700" />
            </Progress>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {getDaysUntilDue()} {t('pregnancy.days_remaining')}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card">
          <CardContent className="p-4 responsive-card-content">
            <div className="flex items-center gap-2 mb-2">
              <Baby className="h-5 w-5 text-pink-500 dark:text-pink-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('pregnancy.baby_size')}</span>
            </div>
            <p className="text-lg font-semibold text-slate-800 dark:text-white">{pregnancyData.babySize}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">{pregnancyData.babyWeight}</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card">
          <CardContent className="p-4 responsive-card-content">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-purple-500 dark:text-purple-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('pregnancy.due_date')}</span>
            </div>
            <p className="text-lg font-semibold text-slate-800 dark:text-white">
              {pregnancyData.dueDate.toLocaleDateString('pt-BR')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 responsive-gap-y">
        <Card className="bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card">
          <CardContent className="p-4 text-center responsive-card-content">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Bell className="h-4 w-4 text-orange-500 dark:text-orange-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300">{t('pregnancy.alerts')}</span>
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{pregnancyData.alertsCount}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card">
          <CardContent className="p-4 text-center responsive-card-content">
            <div className="flex items-center justify-center gap-1 mb-1">
              <FileText className="h-4 w-4 text-blue-500 dark:text-blue-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300">{t('pregnancy.exams')}</span>
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{pregnancyData.upcomingExams}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card">
          <CardContent className="p-4 text-center responsive-card-content">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Pill className="h-4 w-4 text-green-500 dark:text-green-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300">{t('pregnancy.vitamins')}</span>
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">
              {pregnancyData.vitaminsTaken}/{pregnancyData.vitaminsToday}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card">
          <CardContent className="p-4 text-center responsive-card-content">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Heart className="h-4 w-4 text-pink-500 dark:text-pink-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300">{t('pregnancy.week')}</span>
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{pregnancyData.currentWeek}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab as any} className="responsive-gap-y">
        <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 rounded-md">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger 
                key={tab.id}
                value={tab.id}
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a2127] data-[state=active]:text-blue-600 dark:data-[state=active]:text-emerald-400"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="evolution" className="mt-6">
          <Card className="bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card">
            <CardContent className="p-6 responsive-card-content">
              <PregnancyEvolution 
                currentWeek={pregnancyData.currentWeek} 
                currentDay={pregnancyData.currentDay} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tips" className="mt-6">
          <Card className="bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card">
            <CardContent className="p-6 responsive-card-content">
              <PregnancyTips currentWeek={pregnancyData.currentWeek} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="vitamins" className="mt-6">
          <Card className="bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card">
            <CardContent className="p-6 responsive-card-content">
              <PregnancyVitamins />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="exams" className="mt-6">
          <Card className="bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card">
            <CardContent className="p-6 responsive-card-content">
              <PregnancyExams />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts" className="mt-6">
          <Card className="bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card">
            <CardContent className="p-6 responsive-card-content">
              <PregnancyAlerts />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}