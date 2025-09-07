import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
  CheckCircle
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{t('pregnancy.title')}</h1>
          <p className="text-pink-100 mb-4">{t('pregnancy.subtitle')}</p>
          
          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{t('pregnancy.current_week')}</span>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {pregnancyData.currentWeek}w {pregnancyData.currentDay}d
                  </Badge>
                </div>
                <Progress value={calculateProgress()} className="h-2" />
                <p className="text-xs text-pink-100 mt-1">
                  {getDaysUntilDue()} dias para o nascimento
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Baby className="h-5 w-5" />
                  <span className="text-sm font-medium">{t('pregnancy.baby_size')}</span>
                </div>
                <p className="text-lg font-semibold">{pregnancyData.babySize}</p>
                <p className="text-sm text-pink-100">{pregnancyData.babyWeight}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm font-medium">Data Provável</span>
                </div>
                <p className="text-lg font-semibold">
                  {pregnancyData.dueDate.toLocaleDateString('pt-BR')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Bell className="h-4 w-4" />
                <span className="text-sm">{t('pregnancy.alerts')}</span>
              </div>
              <p className="text-2xl font-bold">{pregnancyData.alertsCount}</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <FileText className="h-4 w-4" />
                <span className="text-sm">{t('pregnancy.exams')}</span>
              </div>
              <p className="text-2xl font-bold">{pregnancyData.upcomingExams}</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Pill className="h-4 w-4" />
                <span className="text-sm">{t('pregnancy.vitamins')}</span>
              </div>
              <p className="text-2xl font-bold">
                {pregnancyData.vitaminsTaken}/{pregnancyData.vitaminsToday}
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Heart className="h-4 w-4" />
                <span className="text-sm">Semana</span>
              </div>
              <p className="text-2xl font-bold">{pregnancyData.currentWeek}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  className={`flex items-center gap-2 whitespace-nowrap ${
                    activeTab === tab.id ? 'border-b-2 border-primary' : ''
                  }`}
                  onClick={() => setActiveTab(tab.id as any)}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'evolution' && (
          <PregnancyEvolution 
            currentWeek={pregnancyData.currentWeek} 
            currentDay={pregnancyData.currentDay} 
          />
        )}
        
        {activeTab === 'tips' && (
          <PregnancyTips currentWeek={pregnancyData.currentWeek} />
        )}
        
        {activeTab === 'vitamins' && (
          <PregnancyVitamins />
        )}
        
        {activeTab === 'exams' && (
          <PregnancyExams />
        )}
        
        {activeTab === 'alerts' && (
          <PregnancyAlerts />
        )}
      </div>
    </div>
  );
}