import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Save, 
  Check,
  Smartphone,
  RefreshCw,
  Music,
  Video,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function IntegrationsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  // Estados para os diferentes serviços
  const [appleHealthConnected, setAppleHealthConnected] = useState(false);
  const [googleFitConnected, setGoogleFitConnected] = useState(false);
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [youtubeConnected, setYoutubeConnected] = useState(false);
  
  // Estados para os dados a sincronizar
  const [syncActivity, setSyncActivity] = useState(true);
  const [syncSleep, setSyncSleep] = useState(true);
  const [syncHeartRate, setSyncHeartRate] = useState(true);
  const [syncWorkout, setSyncWorkout] = useState(true);
  const [syncNutrition, setSyncNutrition] = useState(true);
  
  // Estado para o modal de erro de conexão
  const [showConnectionError, setShowConnectionError] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  
  // Sincronização automática ou manual
  const [syncFrequency, setSyncFrequency] = useState('daily');
  
  // Para simular o salvamento das configurações
  const handleSaveSettings = () => {
    toast({
      title: t('settings.savedSuccessfully'),
      description: t('settings.settingsUpdated'),
      duration: 3000,
    });
  };
  
  // Simulação de conexão com os serviços
  const handleConnect = (service: string) => {
    // Em um cenário real, aqui haveria um fluxo de OAuth ou outra forma de autenticação
    
    // Para fins de demonstração, vamos alternar o estado de conexão
    // e ocasionalmente mostrar um erro de conexão para simular falhas
    const shouldFail = Math.random() > 0.7;
    
    if (shouldFail) {
      setShowConnectionError(true);
      return;
    }
    
    switch (service) {
      case 'appleHealth':
        setAppleHealthConnected(true);
        break;
      case 'googleFit':
        setGoogleFitConnected(true);
        break;
      case 'spotify':
        setSpotifyConnected(true);
        break;
      case 'youtube':
        setYoutubeConnected(true);
        break;
    }
    
    toast({
      title: t('settings.connectionSuccess'),
      description: t('settings.connectionSuccessMessage'),
      duration: 3000,
    });
  };
  
  // Simulação de desconexão dos serviços
  const handleDisconnect = (service: string) => {
    switch (service) {
      case 'appleHealth':
        setAppleHealthConnected(false);
        break;
      case 'googleFit':
        setGoogleFitConnected(false);
        break;
      case 'spotify':
        setSpotifyConnected(false);
        break;
      case 'youtube':
        setYoutubeConnected(false);
        break;
    }
    
    toast({
      title: t('common.success'),
      description: `${t('settings.disconnect')} ${service}`,
      duration: 3000,
    });
  };
  
  // Função para sincronizar dados
  const handleSyncData = () => {
    toast({
      title: t('common.success'),
      description: "Sincronizando dados...",
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
            <h1 className="text-2xl sm:text-3xl font-bold">{t('settings.integrations')}</h1>
          </div>
          <Button 
            className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 w-full sm:w-auto"
            onClick={handleSaveSettings}
          >
            <Save className="mr-2 h-4 w-4" />
            {t('common.saveChanges')}
          </Button>
        </div>
        
        <Tabs defaultValue="healthServices">
          {/* Mobile horizontal scrolling tab list */}
          <div className="block sm:hidden mb-4 overflow-x-auto pb-2">
            <TabsList className="flex h-auto bg-gray-50 dark:bg-[#1a2127] p-1 rounded-md">
              <TabsTrigger 
                value="healthServices" 
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 flex-shrink-0 py-2 px-3 h-auto"
              >
                <Smartphone className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger 
                value="mediaServices" 
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 flex-shrink-0 py-2 px-3 h-auto"
              >
                <Music className="h-4 w-4" />
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
                      value="healthServices" 
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 justify-start py-3 px-4 h-auto rounded-none text-left"
                    >
                      <Smartphone className="mr-2 h-4 w-4" />
                      {t('settings.healthServices')}
                    </TabsTrigger>
                    <TabsTrigger 
                      value="mediaServices" 
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 justify-start py-3 px-4 h-auto rounded-none text-left"
                    >
                      <Music className="mr-2 h-4 w-4" />
                      {t('settings.mediaServices')}
                    </TabsTrigger>
                  </TabsList>
                </CardContent>
              </Card>
              
              {/* Informações de ajuda */}
              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 mt-4">
                <div className="flex items-start">
                  <HelpCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-sm text-slate-800 dark:text-white">
                      Precisa de ajuda?
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      Descubra como conectar serviços e sincronizar dados com o LifeTrek.
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2 h-8 text-blue-600 dark:text-blue-400 p-0"
                      onClick={() => setShowHelpDialog(true)}
                    >
                      Ver instruções detalhadas
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <TabsContent value="healthServices" className="mt-0">
                <Card className="bg-gray-50 dark:bg-[#1a2127] shadow-sm border-0">
                  <CardHeader>
                    <CardTitle>{t('settings.healthServices')}</CardTitle>
                    <CardDescription>
                      {t('settings.integrationsDescription')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Apple Health */}
                    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-[#1a2127]">
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 flex items-center">
                            {t('settings.appleHealth')}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {t('settings.appleHealthDescription')}
                          </p>
                          
                          {appleHealthConnected && (
                            <div className="flex items-center mt-2">
                              <div className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center">
                                <Check className="h-3 w-3 mr-1" />
                                {t('settings.connected')}
                              </div>
                              <span className="mx-2 text-slate-400 dark:text-slate-600">•</span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {t('settings.lastSynced')}: Hoje, 10:15
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {appleHealthConnected ? (
                            <>
                              <Button 
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900/30 dark:hover:bg-red-900/20"
                                onClick={() => handleDisconnect('appleHealth')}
                              >
                                {t('settings.disconnect')}
                              </Button>
                              <Button 
                                variant="outline"
                                size="sm"
                                className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-900/30 dark:hover:bg-blue-900/20"
                                onClick={handleSyncData}
                              >
                                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                                {t('settings.syncData')}
                              </Button>
                            </>
                          ) : (
                            <Button 
                              variant="default"
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                              onClick={() => handleConnect('appleHealth')}
                            >
                              {t('settings.connect')}
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {appleHealthConnected && (
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                          <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-3">
                            {t('settings.dataToSync')}
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div className="flex items-center justify-between space-x-2">
                              <Label htmlFor="sync-activity" className="text-sm">
                                {t('settings.activityData')}
                              </Label>
                              <Switch 
                                id="sync-activity" 
                                checked={syncActivity}
                                onCheckedChange={setSyncActivity}
                              />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                              <Label htmlFor="sync-sleep" className="text-sm">
                                {t('settings.sleepData')}
                              </Label>
                              <Switch 
                                id="sync-sleep" 
                                checked={syncSleep}
                                onCheckedChange={setSyncSleep}
                              />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                              <Label htmlFor="sync-heart-rate" className="text-sm">
                                {t('settings.heartRateData')}
                              </Label>
                              <Switch 
                                id="sync-heart-rate" 
                                checked={syncHeartRate}
                                onCheckedChange={setSyncHeartRate}
                              />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                              <Label htmlFor="sync-workout" className="text-sm">
                                {t('settings.workoutData')}
                              </Label>
                              <Switch 
                                id="sync-workout" 
                                checked={syncWorkout}
                                onCheckedChange={setSyncWorkout}
                              />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                              <Label htmlFor="sync-nutrition" className="text-sm">
                                {t('settings.nutritionData')}
                              </Label>
                              <Switch 
                                id="sync-nutrition" 
                                checked={syncNutrition}
                                onCheckedChange={setSyncNutrition}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Google Fit */}
                    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-[#1a2127]">
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 flex items-center">
                            {t('settings.googleFit')}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {t('settings.googleFitDescription')}
                          </p>
                          
                          {googleFitConnected && (
                            <div className="flex items-center mt-2">
                              <div className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center">
                                <Check className="h-3 w-3 mr-1" />
                                {t('settings.connected')}
                              </div>
                              <span className="mx-2 text-slate-400 dark:text-slate-600">•</span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {t('settings.lastSynced')}: Hoje, 09:30
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {googleFitConnected ? (
                            <>
                              <Button 
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900/30 dark:hover:bg-red-900/20"
                                onClick={() => handleDisconnect('googleFit')}
                              >
                                {t('settings.disconnect')}
                              </Button>
                              <Button 
                                variant="outline"
                                size="sm"
                                className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-900/30 dark:hover:bg-blue-900/20"
                                onClick={handleSyncData}
                              >
                                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                                {t('settings.syncData')}
                              </Button>
                            </>
                          ) : (
                            <Button 
                              variant="default"
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                              onClick={() => handleConnect('googleFit')}
                            >
                              {t('settings.connect')}
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {googleFitConnected && (
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                          <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-3">
                            {t('settings.syncSettings')}
                          </h4>
                          <div className="space-y-3">
                            <div className="flex flex-col space-y-1">
                              <Label className="text-sm">
                                {t('settings.syncFrequency')}
                              </Label>
                              <div className="flex space-x-3 mt-1">
                                <Button 
                                  variant={syncFrequency === 'automatic' ? 'default' : 'outline'}
                                  size="sm"
                                  className={syncFrequency === 'automatic' ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800' : ''}
                                  onClick={() => setSyncFrequency('automatic')}
                                >
                                  {t('settings.automatic')}
                                </Button>
                                <Button 
                                  variant={syncFrequency === 'manual' ? 'default' : 'outline'}
                                  size="sm"
                                  className={syncFrequency === 'manual' ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800' : ''}
                                  onClick={() => setSyncFrequency('manual')}
                                >
                                  {t('settings.manual')}
                                </Button>
                                <Button 
                                  variant={syncFrequency === 'daily' ? 'default' : 'outline'}
                                  size="sm"
                                  className={syncFrequency === 'daily' ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800' : ''}
                                  onClick={() => setSyncFrequency('daily')}
                                >
                                  {t('settings.daily')}
                                </Button>
                                <Button 
                                  variant={syncFrequency === 'weekly' ? 'default' : 'outline'}
                                  size="sm"
                                  className={syncFrequency === 'weekly' ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800' : ''}
                                  onClick={() => setSyncFrequency('weekly')}
                                >
                                  {t('settings.weekly')}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="mediaServices" className="mt-0">
                <Card className="bg-gray-50 dark:bg-[#1a2127] shadow-sm border-0">
                  <CardHeader>
                    <CardTitle>{t('settings.mediaServices')}</CardTitle>
                    <CardDescription>
                      {t('settings.integrationsDescription')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Spotify */}
                    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-[#1a2127]">
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 flex items-center">
                            {t('settings.spotify')}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {t('settings.spotifyDescription')}
                          </p>
                          
                          {spotifyConnected && (
                            <div className="flex items-center mt-2">
                              <div className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center">
                                <Check className="h-3 w-3 mr-1" />
                                {t('settings.connected')}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {spotifyConnected ? (
                            <Button 
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900/30 dark:hover:bg-red-900/20"
                              onClick={() => handleDisconnect('spotify')}
                            >
                              {t('settings.disconnect')}
                            </Button>
                          ) : (
                            <Button 
                              variant="default"
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                              onClick={() => handleConnect('spotify')}
                            >
                              {t('settings.connect')}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* YouTube */}
                    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-[#1a2127]">
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 flex items-center">
                            {t('settings.youtube')}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {t('settings.youtubeDescription')}
                          </p>
                          
                          {youtubeConnected && (
                            <div className="flex items-center mt-2">
                              <div className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center">
                                <Check className="h-3 w-3 mr-1" />
                                {t('settings.connected')}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {youtubeConnected ? (
                            <Button 
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900/30 dark:hover:bg-red-900/20"
                              onClick={() => handleDisconnect('youtube')}
                            >
                              {t('settings.disconnect')}
                            </Button>
                          ) : (
                            <Button 
                              variant="default"
                              size="sm"
                              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                              onClick={() => handleConnect('youtube')}
                            >
                              {t('settings.connect')}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
      
      {/* Modal de erro de conexão */}
      <AlertDialog open={showConnectionError} onOpenChange={setShowConnectionError}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5 mr-2" />
              {t('settings.connectionError')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('settings.connectionErrorMessage')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>{t('common.ok')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Dialog de ajuda */}
      <AlertDialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <HelpCircle className="h-5 w-5 mr-2 text-blue-500" />
              Como conectar serviços
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left space-y-4">
              <p>
                Conectar seus dispositivos e serviços ao LifeTrek permite sincronizar automaticamente seus dados de saúde e fitness.
              </p>
              <div>
                <h3 className="font-medium text-sm text-slate-800 dark:text-white mb-1">Apple Health</h3>
                <p className="text-sm">
                  1. Clique no botão "Conectar" para o Apple Health.<br />
                  2. Você será direcionado ao aplicativo Apple Health.<br />
                  3. Siga as instruções para autorizar o LifeTrek a acessar seus dados.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-slate-800 dark:text-white mb-1">Google Fit</h3>
                <p className="text-sm">
                  1. Clique no botão "Conectar" para o Google Fit.<br />
                  2. Autorize o LifeTrek na tela de login do Google.<br />
                  3. Selecione quais dados você deseja compartilhar.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-slate-800 dark:text-white mb-1">Spotify e YouTube</h3>
                <p className="text-sm">
                  Conectar essas plataformas permitirá integrar playlists de treino e vídeos educativos diretamente no LifeTrek.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Fechar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}