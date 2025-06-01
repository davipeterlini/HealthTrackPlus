import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Heart, 
  Smile, 
  Frown, 
  AlertCircle, 
  Play, 
  CheckCircle, 
  Clock,
  Calendar,
  BarChart,
  Bookmark
} from 'lucide-react';

type MeditationSession = {
  id: number;
  title: string;
  duration: number;
  completed: boolean;
  categoryId: number;
};

type MoodLog = {
  date: Date;
  mood: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
  notes?: string;
};

type StressLevel = {
  date: Date;
  level: number; // 0-100
};

type MeditationCategory = {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
};

const MentalPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - replace with API calls later
  const meditationCategories: MeditationCategory[] = [
    { 
      id: 1, 
      name: t('mental.focusCategory'), 
      description: t('mental.focusCategoryDescription'), 
      icon: <Brain className="h-5 w-5 text-blue-500" /> 
    },
    { 
      id: 2, 
      name: t('mental.sleepCategory'), 
      description: t('mental.sleepCategoryDescription'), 
      icon: <Moon className="h-5 w-5 text-indigo-500" /> 
    },
    { 
      id: 3, 
      name: t('mental.anxietyCategory'), 
      description: t('mental.anxietyCategoryDescription'), 
      icon: <Heart className="h-5 w-5 text-pink-500" /> 
    },
    { 
      id: 4, 
      name: t('mental.stressCategory'), 
      description: t('mental.stressCategoryDescription'), 
      icon: <AlertCircle className="h-5 w-5 text-orange-500" /> 
    }
  ];

  const recentMeditations: MeditationSession[] = [
    { id: 1, title: t('mental.morningCalm'), duration: 10, completed: true, categoryId: 1 },
    { id: 2, title: t('mental.sleepPreparation'), duration: 15, completed: false, categoryId: 2 },
    { id: 3, title: t('mental.anxietyRelief'), duration: 8, completed: true, categoryId: 3 },
    { id: 4, title: t('mental.quickRelaxation'), duration: 5, completed: true, categoryId: 4 }
  ];

  const moodLogs: MoodLog[] = [
    { date: new Date(2025, 3, 12), mood: 'good', notes: t('mental.productiveDay') },
    { date: new Date(2025, 3, 11), mood: 'neutral', notes: t('mental.okayDay') },
    { date: new Date(2025, 3, 10), mood: 'great', notes: t('mental.excellentDay') },
    { date: new Date(2025, 3, 9), mood: 'bad', notes: t('mental.stressfulDay') },
    { date: new Date(2025, 3, 8), mood: 'good', notes: t('mental.relaxingDay') }
  ];

  const stressLevels: StressLevel[] = [
    { date: new Date(2025, 3, 12), level: 35 },
    { date: new Date(2025, 3, 11), level: 50 },
    { date: new Date(2025, 3, 10), level: 20 },
    { date: new Date(2025, 3, 9), level: 75 },
    { date: new Date(2025, 3, 8), level: 40 },
    { date: new Date(2025, 3, 7), level: 60 },
    { date: new Date(2025, 3, 6), level: 45 }
  ];

  const getMoodIcon = (mood: MoodLog['mood']) => {
    switch (mood) {
      case 'great': return <Smile className="h-6 w-6 text-emerald-500" />;
      case 'good': return <Smile className="h-6 w-6 text-green-500" />;
      case 'neutral': return <Smile className="h-6 w-6 text-amber-500" />;
      case 'bad': return <Frown className="h-6 w-6 text-orange-500" />;
      case 'terrible': return <Frown className="h-6 w-6 text-red-500" />;
    }
  };

  const getMoodText = (mood: MoodLog['mood']) => {
    switch (mood) {
      case 'great': return t('mental.great');
      case 'good': return t('mental.good');
      case 'neutral': return t('mental.neutral');
      case 'bad': return t('mental.bad');
      case 'terrible': return t('mental.terrible');
    }
  };

  // Get average stress level for the week
  const averageStressLevel = stressLevels.reduce((sum, item) => sum + item.level, 0) / stressLevels.length;
  
  // Get current streak of completed meditations
  const streak = 4; // Would normally calculate from actual data
  
  // Total minutes meditated this week
  const totalMinutesMeditated = recentMeditations
    .filter(session => session.completed)
    .reduce((sum, session) => sum + session.duration, 0);

  return (
    <MainLayout>
      <div className="container py-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{t('mental.mentalHealth')}</h1>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex overflow-x-auto pb-2 no-scrollbar">
            <TabsList className="bg-slate-100 dark:bg-gray-800 p-1">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-[#1a2127] dark:data-[state=active]:text-emerald-400">
                <BarChart className="h-4 w-4 mr-2" />
                {t('mental.overview')}
              </TabsTrigger>
              <TabsTrigger value="meditate" className="data-[state=active]:bg-white data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-[#1a2127] dark:data-[state=active]:text-emerald-400">
                <Brain className="h-4 w-4 mr-2" />
                {t('mental.meditate')}
              </TabsTrigger>
              <TabsTrigger value="mood" className="data-[state=active]:bg-white data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-[#1a2127] dark:data-[state=active]:text-emerald-400">
                <Smile className="h-4 w-4 mr-2" />
                {t('mental.moodTracking')}
              </TabsTrigger>
              <TabsTrigger value="stress" className="data-[state=active]:bg-white data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-[#1a2127] dark:data-[state=active]:text-emerald-400">
                <Heart className="h-4 w-4 mr-2" />
                {t('mental.stressManagement')}
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Mental Health Summary */}
              <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-slate-800 dark:text-white">{t('mental.mentalHealthSummary')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-600 dark:text-gray-400">{t('mental.stressLevel')}</span>
                        <span className="text-sm font-medium text-slate-800 dark:text-white">{Math.round(averageStressLevel)}%</span>
                      </div>
                      <Progress value={averageStressLevel} className="h-2 bg-slate-200 dark:bg-gray-700" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-600 dark:text-gray-400">{t('mental.weeklyMeditation')}</span>
                        <span className="text-sm font-medium text-slate-800 dark:text-white">{totalMinutesMeditated} {t('mental.minutes')}</span>
                      </div>
                      <Progress value={totalMinutesMeditated / 60 * 100} max={100} className="h-2 bg-slate-200 dark:bg-gray-700" />
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-emerald-500 dark:text-emerald-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-slate-800 dark:text-white">{t('mental.meditationStreak')}</div>
                          <div className="text-xs text-slate-600 dark:text-gray-400">{t('mental.daysInARow')}</div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{streak}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Mood Tracking */}
              <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-slate-800 dark:text-white">{t('mental.recentMoods')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {moodLogs.slice(0, 3).map((log, index) => (
                      <div key={index} className="flex items-center gap-3 py-1">
                        {getMoodIcon(log.mood)}
                        <div>
                          <div className="font-medium text-slate-800 dark:text-white">{getMoodText(log.mood)}</div>
                          <div className="text-xs text-slate-600 dark:text-gray-400">
                            {log.date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="w-full text-emerald-500 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50" onClick={() => setActiveTab('mood')}>
                    {t('mental.viewAllMoods')}
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Recent Meditations */}
              <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-slate-800 dark:text-white">{t('mental.recentMeditations')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentMeditations.slice(0, 3).map((session) => (
                      <div key={session.id} className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-3">
                          <Play className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                          <div>
                            <div className="font-medium text-slate-800 dark:text-white">{session.title}</div>
                            <div className="text-xs text-slate-600 dark:text-gray-400">
                              {session.duration} {t('mental.minutes')}
                            </div>
                          </div>
                        </div>
                        {session.completed && (
                          <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="w-full text-emerald-500 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50" onClick={() => setActiveTab('meditate')}>
                    {t('mental.exploreAllMeditations')}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="meditate" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="font-semibold text-xl mb-4">{t('mental.meditationCategories')}</h2>
                <div className="space-y-4">
                  {meditationCategories.map((category) => (
                    <Card key={category.id} className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 shadow-md">
                      <CardHeader className="pb-2">
                        <div className="flex items-center">
                          {category.icon}
                          <CardTitle className="ml-2 text-lg text-slate-800 dark:text-white">{category.name}</CardTitle>
                        </div>
                        <CardDescription className="text-slate-600 dark:text-gray-400">
                          {category.description}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button size="sm" className="w-full bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700">
                          <Play className="mr-2 h-4 w-4" />
                          {t('mental.browseSessions')}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div>
                <h2 className="font-semibold text-xl mb-4">{t('mental.recommendedForYou')}</h2>
                <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 shadow-md mb-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-slate-800 dark:text-white">{t('mental.featuredMeditation')}</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-gray-400">
                      {t('mental.featuredMeditationDescription')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-lg h-48 flex items-center justify-center">
                      <div className="text-center">
                        <Play className="mx-auto h-12 w-12 text-emerald-600 dark:text-emerald-400 mb-2" />
                        <div className="font-medium text-lg text-slate-800 dark:text-white">{t('mental.guidedMorningMeditation')}</div>
                        <div className="text-sm text-slate-600 dark:text-gray-300">15 {t('mental.minutes')}</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" className="border-emerald-200 dark:border-emerald-900/50 text-emerald-500 dark:text-emerald-400">
                      <Bookmark className="mr-2 h-4 w-4" />
                      {t('mental.save')}
                    </Button>
                    <Button className="bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700">
                      <Play className="mr-2 h-4 w-4" />
                      {t('mental.startSession')}
                    </Button>
                  </CardFooter>
                </Card>
                
                <h2 className="font-semibold text-xl mb-4">{t('mental.recentlyPlayed')}</h2>
                <div className="space-y-3">
                  {recentMeditations.map((session) => (
                    <Card key={session.id} className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 shadow-md">
                      <div className="flex items-center p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                          <Play className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="font-medium text-slate-800 dark:text-white">{session.title}</div>
                          <div className="text-xs text-slate-600 dark:text-gray-400">
                            {session.duration} {t('mental.minutes')}
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="ml-auto text-emerald-500 dark:text-emerald-400">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="mood" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-slate-800 dark:text-white">{t('mental.logYourMood')}</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-gray-400">
                    {t('mental.logYourMoodDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between pb-6">
                    <button className="flex flex-col items-center space-y-1">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50">
                        <Frown className="h-7 w-7 text-red-500" />
                      </div>
                      <span className="text-xs text-slate-800 dark:text-white">{t('mental.terrible')}</span>
                    </button>
                    <button className="flex flex-col items-center space-y-1">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/30 dark:hover:bg-orange-900/50">
                        <Frown className="h-7 w-7 text-orange-500" />
                      </div>
                      <span className="text-xs text-slate-800 dark:text-white">{t('mental.bad')}</span>
                    </button>
                    <button className="flex flex-col items-center space-y-1">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50">
                        <Smile className="h-7 w-7 text-yellow-500" />
                      </div>
                      <span className="text-xs text-slate-800 dark:text-white">{t('mental.neutral')}</span>
                    </button>
                    <button className="flex flex-col items-center space-y-1">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50">
                        <Smile className="h-7 w-7 text-green-500" />
                      </div>
                      <span className="text-xs text-slate-800 dark:text-white">{t('mental.good')}</span>
                    </button>
                    <button className="flex flex-col items-center space-y-1">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50">
                        <Smile className="h-7 w-7 text-emerald-500" />
                      </div>
                      <span className="text-xs text-slate-800 dark:text-white">{t('mental.great')}</span>
                    </button>
                  </div>
                  
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700">
                    {t('mental.logMood')}
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-slate-800 dark:text-white">{t('mental.moodHistory')}</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-gray-400">
                    {t('mental.moodHistoryDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {moodLogs.map((log, index) => (
                      <div key={index} className="flex items-start gap-3 pb-3 border-b border-slate-200 dark:border-slate-800 last:border-0">
                        {getMoodIcon(log.mood)}
                        <div>
                          <div className="font-medium text-slate-800 dark:text-white">{getMoodText(log.mood)}</div>
                          <div className="text-xs text-slate-600 dark:text-gray-400">
                            {log.date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                          </div>
                          {log.notes && (
                            <div className="mt-1 text-sm text-slate-700 dark:text-gray-300">{log.notes}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full text-emerald-500 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50">
                    <Calendar className="mr-2 h-4 w-4" />
                    {t('mental.viewFullHistory')}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="stress" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-slate-800 dark:text-white">{t('mental.stressLevelTracking')}</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-gray-400">
                    {t('mental.stressLevelTrackingDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium mb-1 text-slate-800 dark:text-white">{t('mental.weeklyStressOverview')}</div>
                      <div className="flex items-end h-40 gap-2">
                        {stressLevels.map((data, index) => (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div className="w-full bg-gradient-to-t from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/10 rounded-t-sm" style={{ height: `${data.level}%` }}>
                              <div className="w-full bg-emerald-500 dark:bg-emerald-500 h-1"></div>
                            </div>
                            <div className="text-xs mt-1 text-slate-600 dark:text-gray-400">
                              {new Date(data.date).toLocaleDateString(undefined, { weekday: 'short' })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-emerald-800 dark:text-emerald-300">
                            {t('mental.stressInsight')}
                          </div>
                          <div className="text-sm text-emerald-600 dark:text-emerald-400">
                            {t('mental.stressInsightDescription')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-slate-800 dark:text-white">{t('mental.stressManagementTools')}</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-gray-400">
                    {t('mental.stressManagementToolsDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Card className="border border-emerald-100 dark:border-emerald-900/20 bg-white dark:bg-[#1e262d]">
                      <div className="p-4">
                        <div className="flex items-center mb-2">
                          <div className="h-8 w-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mr-3">
                            <Brain className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div className="font-medium text-slate-800 dark:text-white">{t('mental.guidedBreathing')}</div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-gray-400 mb-3">
                          {t('mental.guidedBreathingDescription')}
                        </p>
                        <Button size="sm" className="w-full bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700">
                          <Play className="mr-2 h-4 w-4" />
                          {t('mental.startSession')}
                        </Button>
                      </div>
                    </Card>
                    
                    <Card className="border border-emerald-100 dark:border-emerald-900/20 bg-white dark:bg-[#1e262d]">
                      <div className="p-4">
                        <div className="flex items-center mb-2">
                          <div className="h-8 w-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mr-3">
                            <Heart className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div className="font-medium text-slate-800 dark:text-white">{t('mental.quickMeditation')}</div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-gray-400 mb-3">
                          {t('mental.quickMeditationDescription')}
                        </p>
                        <Button size="sm" className="w-full bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700">
                          <Play className="mr-2 h-4 w-4" />
                          {t('mental.startSession')}
                        </Button>
                      </div>
                    </Card>
                    
                    <Card className="border border-emerald-100 dark:border-emerald-900/20 bg-white dark:bg-[#1e262d]">
                      <div className="p-4">
                        <div className="flex items-center mb-2">
                          <div className="h-8 w-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mr-3">
                            <Smile className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div className="font-medium text-slate-800 dark:text-white">{t('mental.journal')}</div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-gray-400 mb-3">
                          {t('mental.journalDescription')}
                        </p>
                        <Button size="sm" className="w-full bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700">
                          <Calendar className="mr-2 h-4 w-4" />
                          {t('mental.openJournal')}
                        </Button>
                      </div>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

// Missing Moon icon import
const Moon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

export default MentalPage;