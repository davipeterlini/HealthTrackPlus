import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Baby, 
  Calendar, 
  Camera, 
  TrendingUp, 
  Heart, 
  Clock, 
  Utensils, 
  Stethoscope,
  BookOpen,
  Plus,
  Edit,
  CheckCircle,
  Milk,
  Pill
} from 'lucide-react';
import { BabyGrowthOverview } from '@/components/baby/baby-growth-overview';
import { BabyMeasurements } from '@/components/baby/baby-measurements';
import { BabyMilestones } from '@/components/baby/baby-milestones';
import { BabyFeeding } from '@/components/baby/baby-feeding';
import { BabySleep } from '@/components/baby/baby-sleep';
import { BabyVaccinations } from '@/components/baby/baby-vaccinations';
import { BabyVitamins } from '@/components/baby/baby-vitamins';
import { BabyMilkConsumption } from '@/components/baby/baby-milk-consumption';
import { BabyNotes } from '@/components/baby/baby-notes';
import { AddBabyDialog } from '@/components/baby/add-baby-dialog';

export default function BabyGrowthPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddBaby, setShowAddBaby] = useState(false);

  // Mock data - será substituído por dados reais da API
  const babyData = {
    id: 1,
    name: "Sofia",
    birthDate: "2024-01-15",
    gender: "female",
    ageInDays: 180,
    currentWeight: 6500, // gramas
    currentHeight: 65, // cm
    currentHeadCircumference: 42, // cm
    birthWeight: 3200,
    birthHeight: 50,
    birthHeadCircumference: 35,
    photoUrl: null
  };

  const quickStats = [
    {
      icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
      label: t('baby.weight'),
      value: `${(babyData.currentWeight / 1000).toFixed(1)} kg`,
      change: '+450g',
      trend: 'up'
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-green-500" />,
      label: t('baby.height'),
      value: `${babyData.currentHeight} cm`,
      change: '+5cm',
      trend: 'up'
    },
    {
      icon: <Calendar className="h-5 w-5 text-purple-500" />,
      label: t('baby.age'),
      value: `${Math.floor(babyData.ageInDays / 30)} ${t('baby.months')}`,
      change: `${babyData.ageInDays} ${t('baby.days')}`,
      trend: 'neutral'
    },
    {
      icon: <Heart className="h-5 w-5 text-red-500" />,
      label: t('baby.milestones'),
      value: '8/12',
      change: '+2',
      trend: 'up'
    }
  ];

  const recentMilestones = [
    {
      name: t('baby.milestones.first_smile'),
      achieved: true,
      date: '2024-03-01',
      ageInDays: 45
    },
    {
      name: t('baby.milestones.holds_head_up'),
      achieved: true,
      date: '2024-04-15',
      ageInDays: 90
    },
    {
      name: t('baby.milestones.rolls_over'),
      achieved: false,
      expectedAge: 120
    }
  ];

  return (
    <MainLayout title={t('baby.title')} hideTitle={true}>
      <div className="flex justify-between items-center responsive-mb">
        <h1 className="responsive-title-lg text-slate-800 dark:text-white">{t('baby.title')}</h1>
        <Button onClick={() => setShowAddBaby(true)} className="bg-pink-600 hover:bg-pink-700 dark:text-white dark:bg-pink-700 dark:hover:bg-pink-600 responsive-button">
          <Plus className="mr-2 responsive-icon-sm" />
          {t('baby.add_baby')}
        </Button>
      </div>

      {/* Baby Info Card */}
      <Card className="bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
              <Baby className="h-8 w-8 text-pink-600 dark:text-pink-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white">{babyData.name}</h2>
              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <span>{t('baby.born')}: {new Date(babyData.birthDate).toLocaleDateString()}</span>
                <Badge variant="outline" className="dark:border-gray-700">{babyData.gender === 'female' ? '👧' : '👦'}</Badge>
              </div>
            </div>
            <Button variant="outline" size="sm" className="dark:border-gray-700 dark:text-white">
              <Edit className="h-4 w-4 mr-2" />
              {t('common.edit')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 responsive-gap-y">
        {quickStats.map((stat, index) => (
          <Card key={index} className="bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card">
            <CardContent className="p-4 responsive-card-content">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {stat.icon}
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{stat.label}</span>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{stat.change}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Milestones */}
      <Card className="bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card">
        <CardHeader className="responsive-card-header">
          <CardTitle className="responsive-title-sm text-slate-800 dark:text-white flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            {t('baby.recent_milestones')}
          </CardTitle>
        </CardHeader>
        <CardContent className="responsive-card-content">
          <div className="space-y-3">
            {recentMilestones.map((milestone, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${milestone.achieved ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                  <span className={milestone.achieved ? 'text-green-700 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'}>
                    {milestone.name}
                  </span>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {milestone.achieved ? (
                    <span>{new Date(milestone.date).toLocaleDateString()}</span>
                  ) : (
                    <span>{t('baby.expected')}: {milestone.expectedAge} {t('baby.days')}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="responsive-gap-y">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-md">
          <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a2127] data-[state=active]:text-blue-600 dark:data-[state=active]:text-emerald-400">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">{t('baby.overview')}</span>
          </TabsTrigger>
          <TabsTrigger value="measurements" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a2127] data-[state=active]:text-blue-600 dark:data-[state=active]:text-emerald-400">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">{t('baby.measurements')}</span>
          </TabsTrigger>
          <TabsTrigger value="milestones" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a2127] data-[state=active]:text-blue-600 dark:data-[state=active]:text-emerald-400">
            <CheckCircle className="h-4 w-4" />
            <span className="hidden sm:inline">{t('baby.milestones')}</span>
          </TabsTrigger>
          <TabsTrigger value="feeding" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a2127] data-[state=active]:text-blue-600 dark:data-[state=active]:text-emerald-400">
            <Utensils className="h-4 w-4" />
            <span className="hidden sm:inline">{t('baby.feeding')}</span>
          </TabsTrigger>
          <TabsTrigger value="sleep" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a2127] data-[state=active]:text-blue-600 dark:data-[state=active]:text-emerald-400">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">{t('baby.sleep')}</span>
          </TabsTrigger>
          <TabsTrigger value="vaccinations" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a2127] data-[state=active]:text-blue-600 dark:data-[state=active]:text-emerald-400">
            <Stethoscope className="h-4 w-4" />
            <span className="hidden sm:inline">{t('baby.vaccinations')}</span>
          </TabsTrigger>
          <TabsTrigger value="vitamins" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a2127] data-[state=active]:text-blue-600 dark:data-[state=active]:text-emerald-400">
            <Pill className="h-4 w-4" />
            <span className="hidden sm:inline">{t('baby.vitamins')}</span>
          </TabsTrigger>
          <TabsTrigger value="milk" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a2127] data-[state=active]:text-blue-600 dark:data-[state=active]:text-emerald-400">
            <Milk className="h-4 w-4" />
            <span className="hidden sm:inline">{t('baby.milk_consumption')}</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a2127] data-[state=active]:text-blue-600 dark:data-[state=active]:text-emerald-400">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">{t('baby.notes')}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-6">
          <Card className="bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card">
            <CardContent className="p-6 responsive-card-content">
              <BabyGrowthOverview baby={babyData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="measurements" className="space-y-4 mt-6">
          <Card className="bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card">
            <CardContent className="p-6 responsive-card-content">
              <BabyMeasurements babyId={babyData.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4 mt-6">
          <Card className="bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card">
            <CardContent className="p-6 responsive-card-content">
              <BabyMilestones babyId={babyData.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feeding" className="space-y-4 mt-6">
          <Card className="bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card">
            <CardContent className="p-6 responsive-card-content">
              <BabyFeeding babyId={babyData.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sleep" className="space-y-4 mt-6">
          <Card className="bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card">
            <CardContent className="p-6 responsive-card-content">
              <BabySleep babyId={babyData.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vaccinations" className="space-y-4 mt-6">
          <Card className="bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card">
            <CardContent className="p-6 responsive-card-content">
              <BabyVaccinations babyId={babyData.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vitamins" className="space-y-4 mt-6">
          <Card className="bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card">
            <CardContent className="p-6 responsive-card-content">
              <BabyVitamins babyId={babyData.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milk" className="space-y-4 mt-6">
          <Card className="bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card">
            <CardContent className="p-6 responsive-card-content">
              <BabyMilkConsumption babyId={babyData.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4 mt-6">
          <Card className="bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card">
            <CardContent className="p-6 responsive-card-content">
              <BabyNotes babyId={babyData.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Baby Dialog */}
      <AddBabyDialog 
        open={showAddBaby} 
        onOpenChange={setShowAddBaby}
      />
    </MainLayout>
  );
}