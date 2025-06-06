import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Heart, TrendingUp, Clock, CalendarDays, PlusCircle } from "lucide-react";
import { ReactElement } from "react";

export default function WomensHealthPage(): ReactElement {
  const { t } = useTranslation();
  
  return (
    <MainLayout>
      <div className="flex flex-row items-center justify-between responsive-mb">
        <h1 className="responsive-title-lg text-slate-800 dark:text-white">
          {t('womensHealth.title')}
        </h1>
        <Button className="bg-green-600 hover:bg-green-700 dark:text-white responsive-button">
          <PlusCircle className="mr-2 responsive-icon-sm" /> {t('womensHealth.logCycle')}
        </Button>
      </div>
      
      <div className="responsive-grid-3 responsive-gap-y responsive-mb">
        <Card className="bg-white dark:bg-[#1a2127] border-pink-100 dark:border-[#2b353e] responsive-card">
          <CardHeader className="responsive-card-header pb-2">
            <CardTitle className="responsive-title-sm text-slate-800 dark:text-white flex items-center">
              <Calendar className="mr-2 responsive-icon-sm text-pink-500 dark:text-pink-400" />
              {t('womensHealth.cycleTracker')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                  {t('womensHealth.day')} 16
                </h3>
                <p className="text-sm text-slate-500 dark:text-gray-400">
                  {t('womensHealth.ofCycle')} (28 {t('common.days')})
                </p>
              </div>
              
              <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-center">
                  <p className="text-xs text-slate-500 dark:text-gray-400">{t('womensHealth.period')}</p>
                  <p className="text-sm font-medium text-slate-800 dark:text-white">1-5</p>
                </div>
                <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 text-center">
                  <p className="text-xs text-slate-500 dark:text-gray-400">{t('womensHealth.follicular')}</p>
                  <p className="text-sm font-medium text-slate-800 dark:text-white">6-10</p>
                </div>
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20 text-center">
                  <p className="text-xs text-slate-500 dark:text-gray-400">{t('womensHealth.ovulation')}</p>
                  <p className="text-sm font-medium text-slate-800 dark:text-white">11-15</p>
                </div>
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20 text-center border-2 border-purple-500 dark:border-purple-400">
                  <p className="text-xs text-slate-500 dark:text-gray-400">{t('womensHealth.luteal')}</p>
                  <p className="text-sm font-medium text-slate-800 dark:text-white">16-28</p>
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-slate-800 dark:text-white">{t('womensHealth.nextPeriod')}</h3>
                  <Badge className="bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400">
                    13 {t('common.days')}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-gray-400">
                  {t('womensHealth.predicted')}: Apr 26, 2025
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-[#1a2127] border-pink-100 dark:border-[#2b353e] responsive-card">
          <CardHeader className="responsive-card-header pb-2">
            <CardTitle className="responsive-title-sm text-slate-800 dark:text-white flex items-center">
              <Heart className="mr-2 responsive-icon-sm text-pink-500 dark:text-pink-400" />
              {t('womensHealth.symptoms')}
            </CardTitle>
          </CardHeader>
          <CardContent className="responsive-card-content">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-8 bg-pink-500 dark:bg-pink-600 rounded-full mr-3"></div>
                  <span className="text-sm text-slate-800 dark:text-white">{t('womensHealth.mood')}</span>
                </div>
                <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                  {t('womensHealth.medium')}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-8 bg-amber-500 dark:bg-amber-600 rounded-full mr-3"></div>
                  <span className="text-sm text-slate-800 dark:text-white">{t('womensHealth.energy')}</span>
                </div>
                <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                  {t('womensHealth.high')}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-8 bg-blue-500 dark:bg-blue-600 rounded-full mr-3"></div>
                  <span className="text-sm text-slate-800 dark:text-white">{t('womensHealth.headache')}</span>
                </div>
                <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                  {t('womensHealth.none')}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-8 bg-red-500 dark:bg-red-600 rounded-full mr-3"></div>
                  <span className="text-sm text-slate-800 dark:text-white">{t('womensHealth.cramps')}</span>
                </div>
                <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                  {t('womensHealth.none')}
                </Badge>
              </div>
              
              <Button variant="outline" className="w-full mt-2 border-pink-200 text-pink-600 hover:bg-pink-50 dark:border-pink-900/50 dark:text-pink-400 dark:hover:bg-pink-900/20">
                {t('womensHealth.logSymptoms')}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-[#1a2127] border-pink-100 dark:border-[#2b353e] responsive-card">
          <CardHeader className="responsive-card-header pb-2">
            <CardTitle className="responsive-title-sm text-slate-800 dark:text-white flex items-center">
              <TrendingUp className="mr-2 responsive-icon-sm text-pink-500 dark:text-pink-400" />
              {t('womensHealth.insights')}
            </CardTitle>
          </CardHeader>
          <CardContent className="responsive-card-content">
            <div className="space-y-3">
              <div className="p-3 bg-pink-50 dark:bg-pink-900/10 rounded-lg">
                <div className="flex items-start mb-1">
                  <CalendarDays className="h-4 w-4 text-pink-500 dark:text-pink-400 mt-0.5 mr-2" />
                  <h3 className="font-medium text-sm text-slate-800 dark:text-white">{t('womensHealth.cycleRegularity')}</h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-gray-400 pl-6">
                  {t('womensHealth.regularCycles')}
                </p>
              </div>
              
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="flex items-start mb-1">
                  <Clock className="h-4 w-4 text-amber-500 dark:text-amber-400 mt-0.5 mr-2" />
                  <h3 className="font-medium text-sm text-slate-800 dark:text-white">{t('womensHealth.cycleDuration')}</h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-gray-400 pl-6">
                  {t('womensHealth.averageCycle')}
                </p>
              </div>
              
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="flex items-start mb-1">
                  <Heart className="h-4 w-4 text-purple-500 dark:text-purple-400 mt-0.5 mr-2" />
                  <h3 className="font-medium text-sm text-slate-800 dark:text-white">{t('womensHealth.commonSymptoms')}</h3>
                </div>
                <div className="flex flex-wrap gap-1 pl-6 mt-1">
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                    {t('womensHealth.fatigue')}
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                    {t('womensHealth.bloating')}
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                    {t('womensHealth.moodSwings')}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-white dark:bg-[#1a2127] border-pink-100 dark:border-[#2b353e] responsive-card responsive-mb">
        <CardHeader className="responsive-card-header">
          <CardTitle className="responsive-title-sm text-slate-800 dark:text-white">
            {t('womensHealth.recommendations')}
          </CardTitle>
        </CardHeader>
        <CardContent className="responsive-card-content">
          <div className="responsive-grid-2 responsive-gap-sm">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <h3 className="font-medium text-slate-800 dark:text-white text-sm mb-2">
                {t('womensHealth.dietTips')}
              </h3>
              <ul className="text-sm text-slate-600 dark:text-gray-400 list-disc ml-5 space-y-1">
                <li>{t('womensHealth.dietTip1')}</li>
                <li>{t('womensHealth.dietTip2')}</li>
                <li>{t('womensHealth.dietTip3')}</li>
              </ul>
            </div>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <h3 className="font-medium text-slate-800 dark:text-white text-sm mb-2">
                {t('womensHealth.exerciseTips')}
              </h3>
              <ul className="text-sm text-slate-600 dark:text-gray-400 list-disc ml-5 space-y-1">
                <li>{t('womensHealth.exerciseTip1')}</li>
                <li>{t('womensHealth.exerciseTip2')}</li>
                <li>{t('womensHealth.exerciseTip3')}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
}