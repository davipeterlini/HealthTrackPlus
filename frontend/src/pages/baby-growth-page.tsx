import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-100 rounded-lg">
            <Baby className="h-6 w-6 text-pink-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t('baby.title')}</h1>
            <p className="text-gray-600">{t('baby.subtitle')}</p>
          </div>
        </div>
        <Button onClick={() => setShowAddBaby(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {t('baby.add_baby')}
        </Button>
      </div>

      {/* Baby Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
              <Baby className="h-8 w-8 text-pink-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{babyData.name}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{t('baby.born')}: {new Date(babyData.birthDate).toLocaleDateString()}</span>
                <Badge variant="outline">{babyData.gender === 'female' ? '👧' : '👦'}</Badge>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              {t('common.edit')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {stat.icon}
                  <span className="text-sm font-medium">{stat.label}</span>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.change}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            {t('baby.recent_milestones')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentMilestones.map((milestone, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${milestone.achieved ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className={milestone.achieved ? 'text-green-700' : 'text-gray-600'}>
                    {milestone.name}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
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
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">{t('baby.overview')}</span>
          </TabsTrigger>
          <TabsTrigger value="measurements" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">{t('baby.measurements')}</span>
          </TabsTrigger>
          <TabsTrigger value="milestones" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span className="hidden sm:inline">{t('baby.milestones')}</span>
          </TabsTrigger>
          <TabsTrigger value="feeding" className="flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            <span className="hidden sm:inline">{t('baby.feeding')}</span>
          </TabsTrigger>
          <TabsTrigger value="sleep" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">{t('baby.sleep')}</span>
          </TabsTrigger>
          <TabsTrigger value="vaccinations" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            <span className="hidden sm:inline">{t('baby.vaccinations')}</span>
          </TabsTrigger>
          <TabsTrigger value="vitamins" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            <span className="hidden sm:inline">{t('baby.vitamins')}</span>
          </TabsTrigger>
          <TabsTrigger value="milk" className="flex items-center gap-2">
            <Milk className="h-4 w-4" />
            <span className="hidden sm:inline">{t('baby.milk_consumption')}</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">{t('baby.notes')}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <BabyGrowthOverview baby={babyData} />
        </TabsContent>

        <TabsContent value="measurements" className="space-y-4">
          <BabyMeasurements babyId={babyData.id} />
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <BabyMilestones babyId={babyData.id} />
        </TabsContent>

        <TabsContent value="feeding" className="space-y-4">
          <BabyFeeding babyId={babyData.id} />
        </TabsContent>

        <TabsContent value="sleep" className="space-y-4">
          <BabySleep babyId={babyData.id} />
        </TabsContent>

        <TabsContent value="vaccinations" className="space-y-4">
          <BabyVaccinations babyId={babyData.id} />
        </TabsContent>

        <TabsContent value="vitamins" className="space-y-4">
          <BabyVitamins babyId={babyData.id} />
        </TabsContent>

        <TabsContent value="milk" className="space-y-4">
          <BabyMilkConsumption babyId={babyData.id} />
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <BabyNotes babyId={babyData.id} />
        </TabsContent>
      </Tabs>

      {/* Add Baby Dialog */}
      <AddBabyDialog 
        open={showAddBaby} 
        onOpenChange={setShowAddBaby}
      />
    </div>
  );
}