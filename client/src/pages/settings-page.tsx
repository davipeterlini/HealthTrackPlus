import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { useDevMode } from '@/hooks/use-dev-mode';
import { 
  ArrowLeft, 
  Bell, 
  Check, 
  Clock, 
  Download, 
  Eye, 
  Globe, 
  Lock, 
  Moon, 
  Palette, 
  Save, 
  Shield, 
  User, 
  Users,
  Upload,
  Database,
  FileText, 
  LayoutDashboard, 
  Settings,
  RefreshCw
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { skipAuth, toggleSkipAuth } = useDevMode();
  const { toast } = useToast();
  
  // Estados para os diferentes tipos de configurações
  const [notifyExamResults, setNotifyExamResults] = useState(true);
  const [notifyMedicalAppointments, setNotifyMedicalAppointments] = useState(true);
  const [notifyHealthTips, setNotifyHealthTips] = useState(true);
  const [notifyActivityReminders, setNotifyActivityReminders] = useState(true);
  const [notifyMedicationReminders, setNotifyMedicationReminders] = useState(true);
  
  const [showWaterTracker, setShowWaterTracker] = useState(true);
  const [showSleepTracker, setShowSleepTracker] = useState(true);
  const [showActivityTracker, setShowActivityTracker] = useState(true);
  const [showNutritionTracker, setShowNutritionTracker] = useState(true);
  
  const [measurementUnit, setMeasurementUnit] = useState('metric');
  const [timeFormat, setTimeFormat] = useState('24h');
  const [dateFormat, setDateFormat] = useState('dd/mm/yyyy');
  const [weekStartsOn, setWeekStartsOn] = useState('monday');
  
  const [exportFormat, setExportFormat] = useState('json');
  
  // Para simular o salvamento das configurações
  const handleSaveSettings = () => {
    toast({
      title: t('settings.savedSuccessfully'),
      description: t('settings.settingsUpdated'),
      duration: 3000,
    });
  };
  
  return (
    <MainLayout>
      <div className="container py-6 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="sm"
              className="mr-2 sm:mr-4"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-1 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">{t('common.back')}</span>
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold">{t('navigation.settings')}</h1>
          </div>
          <Button 
            className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 w-full sm:w-auto"
            onClick={handleSaveSettings}
          >
            <Save className="mr-2 h-4 w-4" />
            {t('common.saveChanges')}
          </Button>
        </div>
        
        <Tabs defaultValue="appearance">
          {/* Mobile horizontal scrolling tab list */}
          <div className="block sm:hidden mb-4 overflow-x-auto pb-2">
            <TabsList className="flex h-auto bg-gray-50 dark:bg-[#1a2127] p-1 rounded-md">
              <TabsTrigger 
                value="appearance" 
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 flex-shrink-0 py-2 px-3 h-auto"
              >
                <Palette className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger 
                value="language" 
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 flex-shrink-0 py-2 px-3 h-auto"
              >
                <Globe className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 flex-shrink-0 py-2 px-3 h-auto"
              >
                <Bell className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger 
                value="dashboard" 
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 flex-shrink-0 py-2 px-3 h-auto"
              >
                <LayoutDashboard className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger 
                value="preferences" 
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 flex-shrink-0 py-2 px-3 h-auto"
              >
                <Settings className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger 
                value="privacy" 
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 flex-shrink-0 py-2 px-3 h-auto"
              >
                <Lock className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger 
                value="data" 
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 flex-shrink-0 py-2 px-3 h-auto"
              >
                <Database className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger 
                value="developer" 
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 flex-shrink-0 py-2 px-3 h-auto"
              >
                <Shield className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            {/* Desktop vertical tab list - hidden on mobile */}
            <div className="hidden sm:block sm:w-64 space-y-2 mb-6 sm:mb-0">
              <Card className="bg-gray-50 dark:bg-[#1a2127] border-0 shadow-sm">
                <CardContent className="p-0">
                  <TabsList className="grid w-full grid-cols-1 h-auto p-0 bg-transparent">
                    <TabsTrigger 
                      value="appearance" 
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 justify-start py-3 px-4 h-auto rounded-none text-left"
                    >
                      <Palette className="mr-2 h-4 w-4" />
                      {t('settings.appearance')}
                    </TabsTrigger>
                    <TabsTrigger 
                      value="language" 
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 justify-start py-3 px-4 h-auto rounded-none text-left"
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      {t('settings.language')}
                    </TabsTrigger>
                    <TabsTrigger 
                      value="notifications" 
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 justify-start py-3 px-4 h-auto rounded-none text-left"
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      {t('settings.notifications')}
                    </TabsTrigger>
                    <TabsTrigger 
                      value="dashboard" 
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 justify-start py-3 px-4 h-auto rounded-none text-left"
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      {t('settings.dashboard')}
                    </TabsTrigger>
                    <TabsTrigger 
                      value="preferences" 
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 justify-start py-3 px-4 h-auto rounded-none text-left"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      {t('settings.preferences')}
                    </TabsTrigger>
                    <TabsTrigger 
                      value="privacy" 
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 justify-start py-3 px-4 h-auto rounded-none text-left"
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      {t('settings.privacy')}
                    </TabsTrigger>
                    <TabsTrigger 
                      value="data" 
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 justify-start py-3 px-4 h-auto rounded-none text-left"
                    >
                      <Database className="mr-2 h-4 w-4" />
                      {t('settings.data')}
                    </TabsTrigger>
                    <TabsTrigger 
                      value="developer" 
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 justify-start py-3 px-4 h-auto rounded-none text-left"
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      {t('settings.devMode')}
                    </TabsTrigger>
                  </TabsList>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex-1">
              <TabsContent value="appearance" className="mt-0">
                <Card className="bg-gray-50 dark:bg-[#1a2127] shadow-sm border-0">
                  <CardHeader>
                    <CardTitle>{t('settings.appearance')}</CardTitle>
                    <CardDescription>
                      {t('settings.appearanceDescription')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">{t('settings.theme')}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Moon className="mr-2 h-4 w-4" />
                          <span>{t('settings.darkMode')}</span>
                        </div>
                        <ThemeToggle />
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <h3 className="text-lg font-semibold">{t('settings.colors')}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-12 h-12 rounded-full bg-blue-500 cursor-pointer" title="Blue"></div>
                          <span className="text-xs">Blue</span>
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-12 h-12 rounded-full bg-green-500 cursor-pointer" title="Green"></div>
                          <span className="text-xs">Green</span>
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-12 h-12 rounded-full bg-purple-500 cursor-pointer" title="Purple"></div>
                          <span className="text-xs">Purple</span>
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-12 h-12 rounded-full bg-red-500 cursor-pointer" title="Red"></div>
                          <span className="text-xs">Red</span>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <h3 className="text-lg font-semibold">{t('settings.accessibility')}</h3>
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{t('settings.reducedMotion')}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {t('settings.reducedMotionDescription')}
                            </span>
                          </div>
                          <Switch className="mt-1 sm:mt-0" />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{t('settings.highContrast')}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {t('settings.highContrastDescription')}
                            </span>
                          </div>
                          <Switch className="mt-1 sm:mt-0" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="language" className="mt-0">
                <Card className="bg-gray-50 dark:bg-[#1a2127] shadow-sm border-0">
                  <CardHeader>
                    <CardTitle>{t('settings.language')}</CardTitle>
                    <CardDescription>
                      {t('settings.languageDescription')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">{t('settings.appLanguage')}</h3>
                      <div className="w-full sm:w-64">
                        <LanguageSwitcher />
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <h3 className="text-lg font-semibold">{t('settings.translationPreferences')}</h3>
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{t('settings.translateExamResults')}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {t('settings.translateExamResultsDescription')}
                            </span>
                          </div>
                          <Switch className="mt-1 sm:mt-0" defaultChecked />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{t('settings.translateMedicalTerms')}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {t('settings.translateMedicalTermsDescription')}
                            </span>
                          </div>
                          <Switch className="mt-1 sm:mt-0" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="mt-0">
                <Card className="bg-gray-50 dark:bg-[#1a2127] shadow-sm border-0">
                  <CardHeader>
                    <CardTitle>{t('settings.notifications')}</CardTitle>
                    <CardDescription>
                      {t('settings.notificationsDescription')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">{t('settings.healthAlerts')}</h3>
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{t('settings.examResults')}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {t('settings.examResultsDescription')}
                            </span>
                          </div>
                          <Switch 
                            className="mt-1 sm:mt-0"
                            checked={notifyExamResults}
                            onCheckedChange={setNotifyExamResults}
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{t('settings.medicationReminders')}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {t('settings.medicationRemindersDescription')}
                            </span>
                          </div>
                          <Switch 
                            className="mt-1 sm:mt-0"
                            checked={notifyMedicationReminders}
                            onCheckedChange={setNotifyMedicationReminders}
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{t('settings.appointmentReminders')}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {t('settings.appointmentRemindersDescription')}
                            </span>
                          </div>
                          <Switch 
                            className="mt-1 sm:mt-0"
                            checked={notifyMedicalAppointments}
                            onCheckedChange={setNotifyMedicalAppointments}
                          />
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <h3 className="text-lg font-semibold">{t('settings.activityReminders')}</h3>
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{t('settings.dailyActivityReminders')}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {t('settings.dailyActivityRemindersDescription')}
                            </span>
                          </div>
                          <Switch 
                            className="mt-1 sm:mt-0"
                            checked={notifyActivityReminders}
                            onCheckedChange={setNotifyActivityReminders}
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{t('settings.inactivityAlerts')}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {t('settings.inactivityAlertsDescription')}
                            </span>
                          </div>
                          <Switch className="mt-1 sm:mt-0" defaultChecked />
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <h3 className="text-lg font-semibold">{t('settings.communication')}</h3>
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{t('settings.healthTips')}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {t('settings.healthTipsDescription')}
                            </span>
                          </div>
                          <Switch 
                            className="mt-1 sm:mt-0"
                            checked={notifyHealthTips}
                            onCheckedChange={setNotifyHealthTips}
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{t('settings.newsletterAndUpdates')}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {t('settings.newsletterAndUpdatesDescription')}
                            </span>
                          </div>
                          <Switch className="mt-1 sm:mt-0" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="dashboard" className="mt-0">
                <Card className="bg-gray-50 dark:bg-[#1a2127] shadow-sm border-0">
                  <CardHeader>
                    <CardTitle>{t('settings.dashboard')}</CardTitle>
                    <CardDescription>
                      {t('settings.dashboardDescription')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">{t('settings.visibleWidgets')}</h3>
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{t('settings.waterTracker')}</span>
                          </div>
                          <Switch 
                            className="mt-1 sm:mt-0"
                            checked={showWaterTracker}
                            onCheckedChange={setShowWaterTracker}
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{t('settings.sleepTracker')}</span>
                          </div>
                          <Switch 
                            className="mt-1 sm:mt-0"
                            checked={showSleepTracker}
                            onCheckedChange={setShowSleepTracker}
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{t('settings.activityTracker')}</span>
                          </div>
                          <Switch 
                            className="mt-1 sm:mt-0"
                            checked={showActivityTracker}
                            onCheckedChange={setShowActivityTracker}
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{t('settings.nutritionTracker')}</span>
                          </div>
                          <Switch 
                            className="mt-1 sm:mt-0"
                            checked={showNutritionTracker}
                            onCheckedChange={setShowNutritionTracker}
                          />
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <h3 className="text-lg font-semibold">{t('settings.dashboardLayout')}</h3>
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{t('settings.compactView')}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {t('settings.compactViewDescription')}
                            </span>
                          </div>
                          <Switch className="mt-1 sm:mt-0" defaultChecked />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{t('settings.enableDragAndDrop')}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {t('settings.enableDragAndDropDescription')}
                            </span>
                          </div>
                          <Switch className="mt-1 sm:mt-0" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="preferences" className="mt-0">
                <Card className="bg-gray-50 dark:bg-[#1a2127] shadow-sm border-0">
                  <CardHeader>
                    <CardTitle>{t('settings.preferences')}</CardTitle>
                    <CardDescription>
                      {t('settings.preferencesDescription')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">{t('settings.unitsAndFormats')}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="measurement-unit">{t('settings.measurementUnit')}</Label>
                          <Select 
                            value={measurementUnit}
                            onValueChange={setMeasurementUnit}
                          >
                            <SelectTrigger id="measurement-unit">
                              <SelectValue placeholder={t('settings.selectMeasurementUnit')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="metric">{t('settings.metric')} (kg, cm)</SelectItem>
                              <SelectItem value="imperial">{t('settings.imperial')} (lb, in)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="time-format">{t('settings.timeFormat')}</Label>
                          <Select 
                            value={timeFormat}
                            onValueChange={setTimeFormat}
                          >
                            <SelectTrigger id="time-format">
                              <SelectValue placeholder={t('settings.selectTimeFormat')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="12h">12h (AM/PM)</SelectItem>
                              <SelectItem value="24h">24h</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="date-format">{t('settings.dateFormat')}</Label>
                          <Select 
                            value={dateFormat}
                            onValueChange={setDateFormat}
                          >
                            <SelectTrigger id="date-format">
                              <SelectValue placeholder={t('settings.selectDateFormat')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                              <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                              <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="week-starts">{t('settings.weekStartsOn')}</Label>
                          <Select 
                            value={weekStartsOn}
                            onValueChange={setWeekStartsOn}
                          >
                            <SelectTrigger id="week-starts">
                              <SelectValue placeholder={t('settings.selectFirstDayOfWeek')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="monday">{t('settings.monday')}</SelectItem>
                              <SelectItem value="sunday">{t('settings.sunday')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <h3 className="text-lg font-semibold">{t('settings.behavior')}</h3>
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{t('settings.confirmBeforeDataDeletion')}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {t('settings.confirmBeforeDataDeletionDescription')}
                            </span>
                          </div>
                          <Switch className="mt-1 sm:mt-0" defaultChecked />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{t('settings.autoSaveEntries')}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {t('settings.autoSaveEntriesDescription')}
                            </span>
                          </div>
                          <Switch className="mt-1 sm:mt-0" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="privacy" className="mt-0">
                <Card className="bg-gray-50 dark:bg-[#1a2127] shadow-sm border-0">
                  <CardHeader>
                    <CardTitle>{t('settings.privacy')}</CardTitle>
                    <CardDescription>
                      {t('settings.privacyDescription')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">{t('settings.dataSharing')}</h3>
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{t('settings.shareAnalyticsData')}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {t('settings.shareAnalyticsDataDescription')}
                            </span>
                          </div>
                          <Switch className="mt-1 sm:mt-0" defaultChecked={false} />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{t('settings.enhancementsAndRecommendations')}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {t('settings.enhancementsAndRecommendationsDescription')}
                            </span>
                          </div>
                          <Switch className="mt-1 sm:mt-0" defaultChecked />
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <h3 className="text-lg font-semibold">{t('settings.accessControl')}</h3>
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{t('settings.requirePasswordForSensitiveData')}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {t('settings.requirePasswordForSensitiveDataDescription')}
                            </span>
                          </div>
                          <Switch className="mt-1 sm:mt-0" defaultChecked />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{t('settings.enableBiometricAuthentication')}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {t('settings.enableBiometricAuthenticationDescription')}
                            </span>
                          </div>
                          <Switch className="mt-1 sm:mt-0" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="data" className="mt-0">
                <Card className="bg-gray-50 dark:bg-[#1a2127] shadow-sm border-0">
                  <CardHeader>
                    <CardTitle>{t('settings.data')}</CardTitle>
                    <CardDescription>
                      {t('settings.dataDescription')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">{t('settings.dataExport')}</h3>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="export-format">{t('settings.exportFormat')}</Label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Select 
                              value={exportFormat}
                              onValueChange={setExportFormat}
                            >
                              <SelectTrigger id="export-format" className="w-full sm:w-40">
                                <SelectValue placeholder={t('settings.selectFormat')} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="json">JSON</SelectItem>
                                <SelectItem value="csv">CSV</SelectItem>
                                <SelectItem value="pdf">PDF</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button variant="outline" className="flex gap-2 w-full sm:w-auto justify-center">
                              <Download className="h-4 w-4" />
                              {t('settings.exportData')}
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <h3 className="text-lg font-semibold">{t('settings.dataImport')}</h3>
                      <div className="space-y-3">
                        <div className="flex flex-col space-y-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {t('settings.dataImportDescription')}
                          </span>
                          <Button variant="outline" className="flex gap-2 w-full sm:w-40 justify-center">
                            <Upload className="h-4 w-4" />
                            {t('settings.importData')}
                          </Button>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <h3 className="text-lg font-semibold">{t('settings.dataDeletion')}</h3>
                      <div className="space-y-3">
                        <div className="flex flex-col space-y-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {t('settings.dataDeletionWarning')}
                          </span>
                          <div className="space-y-2">
                            <Button variant="outline" className="flex gap-2 text-amber-600 border-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:border-amber-400 dark:hover:bg-amber-900/20">
                              <RefreshCw className="h-4 w-4" />
                              {t('settings.clearAllData')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="developer" className="mt-0">
                <Card className="bg-gray-50 dark:bg-[#1a2127] shadow-sm border-0">
                  <CardHeader>
                    <CardTitle>{t('settings.devMode')}</CardTitle>
                    <CardDescription>
                      {t('settings.devModeDescription')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">{t('settings.developmentSettings')}</h3>
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{t('settings.skipAuth')}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {t('settings.skipAuthDescription')}
                            </span>
                          </div>
                          <Switch 
                            className="mt-1 sm:mt-0"
                            checked={skipAuth}
                            onCheckedChange={toggleSkipAuth}
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{t('settings.showComponentBorders')}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {t('settings.showComponentBordersDescription')}
                            </span>
                          </div>
                          <Switch className="mt-1 sm:mt-0" />
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <h3 className="text-lg font-semibold">{t('settings.testingTools')}</h3>
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{t('settings.enableMockData')}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {t('settings.enableMockDataDescription')}
                            </span>
                          </div>
                          <Switch className="mt-1 sm:mt-0" defaultChecked />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{t('settings.simulateSlowNetwork')}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {t('settings.simulateSlowNetworkDescription')}
                            </span>
                          </div>
                          <Switch className="mt-1 sm:mt-0" />
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <h3 className="text-lg font-semibold">{t('settings.advancedOptions')}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Button variant="outline" className="flex gap-2 w-full sm:w-auto justify-center">
                          <FileText className="h-4 w-4" />
                          {t('settings.viewLogs')}
                        </Button>
                        <Button variant="outline" className="flex gap-2 w-full sm:w-auto justify-center">
                          <RefreshCw className="h-4 w-4" />
                          {t('settings.resetDevSettings')}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </MainLayout>
  );
}