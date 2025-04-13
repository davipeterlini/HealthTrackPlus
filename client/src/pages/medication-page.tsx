import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Pill, Clock, Calendar, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReactElement } from "react";

export default function MedicationPage(): ReactElement {
  const { t } = useTranslation();
  
  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('medication.title')}
        </h1>
        <Button className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white">
          {t('medication.addMedication')}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="bg-white dark:bg-[#1a2127] border dark:border-0 shadow-md rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white flex items-center">
              <Pill className="mr-2 h-5 w-5 text-emerald-500" />
              {t('medication.currentMedications')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-slate-800 dark:text-white">Vitamin D</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">1000 UI - 1 {t('medication.capsule')}</p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30">
                    {t('medication.active')}
                  </Badge>
                </div>
                <div className="flex mt-2 text-sm">
                  <div className="flex items-center mr-3 text-slate-600 dark:text-slate-400">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {t('medication.daily')}
                  </div>
                  <div className="flex items-center text-slate-600 dark:text-slate-400">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    {t('medication.morning')}
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-slate-800 dark:text-white">Omega 3</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">1000mg - 1 {t('medication.capsule')}</p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30">
                    {t('medication.active')}
                  </Badge>
                </div>
                <div className="flex mt-2 text-sm">
                  <div className="flex items-center mr-3 text-slate-600 dark:text-slate-400">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {t('medication.daily')}
                  </div>
                  <div className="flex items-center text-slate-600 dark:text-slate-400">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    {t('medication.lunch')}
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-slate-800 dark:text-white">Melatonin</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">5mg - 1 {t('medication.tablet')}</p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30">
                    {t('medication.active')}
                  </Badge>
                </div>
                <div className="flex mt-2 text-sm">
                  <div className="flex items-center mr-3 text-slate-600 dark:text-slate-400">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {t('medication.daily')}
                  </div>
                  <div className="flex items-center text-slate-600 dark:text-slate-400">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    {t('medication.bedtime')}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-[#1a2127] border dark:border-0 shadow-md rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white flex items-center">
              <Bell className="mr-2 h-5 w-5 text-amber-500" />
              {t('medication.todaysReminders')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg">
                <div className="h-10 w-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mr-3 shadow-sm">
                  <Pill className="h-5 w-5 text-emerald-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-slate-800 dark:text-white">Vitamin D</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t('medication.morning')} - 8:00 AM</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30">
                  {t('medication.taken')}
                </Badge>
              </div>
              
              <div className="flex items-center p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg">
                <div className="h-10 w-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mr-3 shadow-sm">
                  <Pill className="h-5 w-5 text-amber-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-slate-800 dark:text-white">Omega 3</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t('medication.lunch')} - 12:30 PM</p>
                </div>
                <Button variant="outline" size="sm" className="border-amber-500 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20">
                  {t('medication.markAsTaken')}
                </Button>
              </div>
              
              <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="h-10 w-10 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center mr-3 shadow-sm">
                  <Pill className="h-5 w-5 text-indigo-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-slate-800 dark:text-white">Melatonin</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t('medication.bedtime')} - 10:00 PM</p>
                </div>
                <Button variant="outline" size="sm" className="text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-600">
                  {t('medication.upcoming')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-[#1a2127] border dark:border-0 shadow-md rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-purple-500" />
              {t('medication.schedule')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <h3 className="font-medium text-slate-800 dark:text-white">{t('medication.morning')}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">8:00 AM</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30">
                    Vitamin D
                  </Badge>
                </div>
              </div>
              
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <h3 className="font-medium text-slate-800 dark:text-white">{t('medication.lunch')}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">12:30 PM</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30">
                    Omega 3
                  </Badge>
                </div>
              </div>
              
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <h3 className="font-medium text-slate-800 dark:text-white">{t('medication.bedtime')}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">10:00 PM</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30">
                    Melatonin
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}