import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Clock, 
  Play, 
  Pause, 
  Square, 
  Target, 
  Calendar,
  TrendingUp,
  Award,
  Timer,
  Coffee,
  Utensils,
  Moon,
  Sun,
  BarChart3,
  History,
  Settings2
} from "lucide-react";
import { formatDistanceToNow, format, differenceInHours, differenceInMinutes } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";

interface FastingSession {
  id: string;
  type: string;
  startTime: Date;
  endTime?: Date;
  targetDuration: number; // em horas
  status: 'active' | 'completed' | 'stopped';
  notes?: string;
}

interface FastingStats {
  totalSessions: number;
  longestFast: number;
  averageDuration: number;
  currentStreak: number;
  weeklyGoal: number;
  weeklyCompleted: number;
}

const FASTING_TYPES = [
  { value: "16:8", label: "16:8 (Jejum de 16h)", duration: 16, description: "16 horas de jejum, 8 horas de alimentação" },
  { value: "18:6", label: "18:6 (Jejum de 18h)", duration: 18, description: "18 horas de jejum, 6 horas de alimentação" },
  { value: "20:4", label: "20:4 (Jejum de 20h)", duration: 20, description: "20 horas de jejum, 4 horas de alimentação" },
  { value: "24h", label: "24h (OMAD)", duration: 24, description: "Uma refeição por dia" },
  { value: "36h", label: "36h (Jejum Estendido)", duration: 36, description: "Jejum de 36 horas" },
  { value: "48h", label: "48h (Jejum de 2 dias)", duration: 48, description: "Jejum de 48 horas" },
  { value: "custom", label: "Personalizado", duration: 0, description: "Defina sua própria duração" }
];

export default function FastingPage() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const locale = i18n.language.startsWith('pt') ? ptBR : enUS;

  // Estados principais
  const [currentSession, setCurrentSession] = useState<FastingSession | null>(null);
  const [fastingHistory, setFastingHistory] = useState<FastingSession[]>([]);
  const [stats, setStats] = useState<FastingStats>({
    totalSessions: 0,
    longestFast: 0,
    averageDuration: 0,
    currentStreak: 0,
    weeklyGoal: 3,
    weeklyCompleted: 0
  });

  // Estados do timer
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedFastingType, setSelectedFastingType] = useState("16:8");
  const [customDuration, setCustomDuration] = useState(16);

  // Atualizar o tempo atual a cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calcular duração atual do jejum
  const getCurrentFastDuration = () => {
    if (!currentSession) return 0;
    return differenceInMinutes(currentTime, currentSession.startTime);
  };

  const getCurrentFastHours = () => {
    return Math.floor(getCurrentFastDuration() / 60);
  };

  const getCurrentFastMinutes = () => {
    return getCurrentFastDuration() % 60;
  };

  // Calcular progresso do jejum
  const getFastingProgress = () => {
    if (!currentSession) return 0;
    const currentDurationHours = getCurrentFastDuration() / 60;
    return Math.min((currentDurationHours / currentSession.targetDuration) * 100, 100);
  };

  // Iniciar jejum
  const startFasting = () => {
    const type = FASTING_TYPES.find(t => t.value === selectedFastingType);
    const duration = type?.value === "custom" ? customDuration : type?.duration || 16;

    const newSession: FastingSession = {
      id: Date.now().toString(),
      type: selectedFastingType,
      startTime: new Date(),
      targetDuration: duration,
      status: 'active'
    };

    setCurrentSession(newSession);
    
    toast({
      title: "Jejum iniciado! 🚀",
      description: `Jejum de ${duration}h começou. Você consegue!`,
    });
  };

  // Pausar jejum (na verdade, parar)
  const stopFasting = () => {
    if (!currentSession) return;

    const completedSession = {
      ...currentSession,
      endTime: new Date(),
      status: 'stopped' as const
    };

    setFastingHistory(prev => [completedSession, ...prev]);
    setCurrentSession(null);

    toast({
      title: "Jejum interrompido",
      description: `Jejum de ${getCurrentFastHours()}h${getCurrentFastMinutes()}min foi registrado.`,
    });
  };

  // Completar jejum
  const completeFasting = () => {
    if (!currentSession) return;

    const completedSession = {
      ...currentSession,
      endTime: new Date(),
      status: 'completed' as const
    };

    setFastingHistory(prev => [completedSession, ...prev]);
    setCurrentSession(null);

    // Atualizar estatísticas
    setStats(prev => ({
      ...prev,
      totalSessions: prev.totalSessions + 1,
      weeklyCompleted: prev.weeklyCompleted + 1,
      longestFast: Math.max(prev.longestFast, getCurrentFastHours()),
    }));

    toast({
      title: "Parabéns! 🎉",
      description: `Você completou seu jejum de ${getCurrentFastHours()}h${getCurrentFastMinutes()}min!`,
    });
  };

  // Verificar se o jejum foi completado
  const isFastingCompleted = () => {
    if (!currentSession) return false;
    return getCurrentFastDuration() >= (currentSession.targetDuration * 60);
  };

  // Formatação de tempo
  const formatTime = (hours: number, minutes: number) => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <MainLayout>
      <div className="flex flex-row items-center justify-between responsive-mb">
        <h1 className="responsive-title-lg text-slate-800 dark:text-white">
          {t('navigation.fasting', 'Jejum Intermitente')}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 responsive-gap-y">
        <div className="lg:col-span-2">
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 responsive-mb bg-slate-100 dark:bg-[#2a3137] p-1 rounded-lg">
              <TabsTrigger 
                value="current" 
                className="flex items-center gap-1 sm:gap-2 responsive-text-xs sm:responsive-text-sm data-[state=active]:bg-white data-[state=active]:dark:bg-[#1a2127] data-[state=active]:text-slate-900 data-[state=active]:dark:text-white text-slate-600 dark:text-gray-400"
              >
                <Timer className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{t('fasting.current', 'Atual')}</span>
                <span className="sm:hidden">Atual</span>
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="flex items-center gap-1 sm:gap-2 responsive-text-xs sm:responsive-text-sm data-[state=active]:bg-white data-[state=active]:dark:bg-[#1a2127] data-[state=active]:text-slate-900 data-[state=active]:dark:text-white text-slate-600 dark:text-gray-400"
              >
                <History className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{t('fasting.history', 'Histórico')}</span>
                <span className="sm:hidden">Histórico</span>
              </TabsTrigger>
              <TabsTrigger 
                value="stats" 
                className="flex items-center gap-1 sm:gap-2 responsive-text-xs sm:responsive-text-sm data-[state=active]:bg-white data-[state=active]:dark:bg-[#1a2127] data-[state=active]:text-slate-900 data-[state=active]:dark:text-white text-slate-600 dark:text-gray-400"
              >
                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{t('fasting.stats', 'Estatísticas')}</span>
                <span className="sm:hidden">Stats</span>
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="flex items-center gap-1 sm:gap-2 responsive-text-xs sm:responsive-text-sm data-[state=active]:bg-white data-[state=active]:dark:bg-[#1a2127] data-[state=active]:text-slate-900 data-[state=active]:dark:text-white text-slate-600 dark:text-gray-400"
              >
                <Settings2 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{t('fasting.settings', 'Configurações')}</span>
                <span className="sm:hidden">Config</span>
              </TabsTrigger>
          </TabsList>

          {/* Aba Current - Jejum Atual */}
          <TabsContent value="current" className="responsive-space-y">
            {/* Status do Jejum Atual */}
            <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-gray-700 responsive-card shadow-md">
              <CardHeader className="responsive-p-content">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="responsive-title-lg text-slate-800 dark:text-white">
                      {currentSession ? t('fasting.inProgress', 'Jejum em Andamento') : t('fasting.notStarted', 'Pronto para Jejuar')}
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-gray-400 responsive-text-sm">
                      {currentSession 
                        ? `${t('fasting.type', 'Tipo')}: ${currentSession.type} • ${t('fasting.started', 'Iniciado')}: ${format(currentSession.startTime, 'HH:mm', { locale })}`
                        : t('fasting.selectType', 'Selecione o tipo de jejum para começar')
                      }
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentSession && (
                      <Badge 
                        variant={isFastingCompleted() ? "default" : "secondary"}
                        className={`${isFastingCompleted() ? 'bg-emerald-500 text-white' : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'} responsive-text-xs`}
                      >
                        {isFastingCompleted() ? t('fasting.completed', 'Completo') : t('fasting.active', 'Ativo')}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="responsive-p-content">
                {currentSession ? (
                  <div className="responsive-space-y">
                    {/* Timer Principal */}
                    <div className="text-center py-4 sm:py-6">
                      <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-4">
                        {formatTime(getCurrentFastHours(), getCurrentFastMinutes())}
                      </div>
                      <p className="text-slate-600 dark:text-gray-400 text-sm sm:text-base">
                        {t('fasting.target', 'Meta')}: {currentSession.targetDuration}h
                      </p>
                    </div>

                    {/* Barra de Progresso */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-slate-600 dark:text-gray-400">
                        <span>{t('fasting.progress', 'Progresso')}</span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">{Math.round(getFastingProgress())}%</span>
                      </div>
                      <Progress 
                        value={getFastingProgress()} 
                        className="h-3 bg-slate-200 dark:bg-gray-700"
                      />
                    </div>

                    {/* Fases do Jejum */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-[#2a3137] border border-slate-200 dark:border-gray-700">
                        <Moon className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-800 dark:text-white">
                            {t('fasting.fatBurning', 'Queima de Gordura')}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-gray-400">
                            {getCurrentFastHours() >= 12 ? (
                              <span className="text-emerald-600 dark:text-emerald-400 font-medium">{t('fasting.active', 'Ativo')}</span>
                            ) : (
                              `${12 - getCurrentFastHours()}h restantes`
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-[#2a3137] border border-slate-200 dark:border-gray-700">
                        <Award className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-800 dark:text-white">
                            {t('fasting.autophagy', 'Autofagia')}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-gray-400">
                            {getCurrentFastHours() >= 16 ? (
                              <span className="text-emerald-600 dark:text-emerald-400 font-medium">{t('fasting.active', 'Ativo')}</span>
                            ) : (
                              `${16 - getCurrentFastHours()}h restantes`
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Botões de Controle */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                      {isFastingCompleted() && (
                        <Button 
                          onClick={completeFasting}
                          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-4 px-6 rounded-xl transition-colors duration-200"
                        >
                          <Award className="w-5 h-5 mr-3" />
                          <span className="text-lg">{t('fasting.complete', 'Completar Jejum')}</span>
                        </Button>
                      )}
                      <Button 
                        variant="outline"
                        onClick={stopFasting}
                        className="flex-1 border-2 border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium py-4 px-6 rounded-xl transition-colors duration-200"
                      >
                        <Square className="w-5 h-5 mr-3" />
                        <span className="text-lg">{t('fasting.stop', 'Parar Jejum')}</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="responsive-space-y">
                    {/* Seleção do Tipo de Jejum */}
                    <div>
                      <Label className="responsive-text-sm font-medium text-slate-700 dark:text-gray-300 responsive-mb-sm block">
                        {t('fasting.selectType', 'Tipo de Jejum')}
                      </Label>
                      <Select value={selectedFastingType} onValueChange={setSelectedFastingType}>
                        <SelectTrigger className="bg-white dark:bg-[#1a2127] border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-[#1a2127] border-slate-200 dark:border-gray-700">
                          {FASTING_TYPES.map((type) => (
                            <SelectItem 
                              key={type.value} 
                              value={type.value}
                              className="text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-gray-800"
                            >
                              <div>
                                <div className="font-medium">{type.label}</div>
                                <div className="responsive-text-xs text-slate-500 dark:text-gray-400">{type.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Duração Personalizada */}
                    {selectedFastingType === "custom" && (
                      <div>
                        <Label className="responsive-text-sm font-medium text-slate-700 dark:text-gray-300 responsive-mb-sm block">
                          {t('fasting.customDuration', 'Duração Personalizada (horas)')}
                        </Label>
                        <Input
                          type="number"
                          value={customDuration}
                          onChange={(e) => setCustomDuration(parseInt(e.target.value) || 16)}
                          min="1"
                          max="72"
                          className="bg-white dark:bg-[#1a2127] border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white"
                          placeholder="16"
                        />
                      </div>
                    )}

                    {/* Botão Iniciar */}
                    <Button 
                      onClick={startFasting}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-4 px-6 rounded-xl transition-colors duration-200 mt-6"
                    >
                      <Play className="w-5 h-5 mr-3" />
                      <span className="text-lg">{t('fasting.start', 'Iniciar Jejum')}</span>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dicas de Jejum */}
            <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-gray-700 responsive-card shadow-md">
              <CardHeader className="responsive-p-content">
                <CardTitle className="responsive-title-lg text-slate-800 dark:text-white">
                  {t('fasting.tips', 'Dicas para o Jejum')}
                </CardTitle>
              </CardHeader>
              <CardContent className="responsive-p-content">
                <div className="responsive-grid-2 responsive-gap">
                  <div className="flex items-start gap-3">
                    <Coffee className="responsive-icon text-amber-500 dark:text-amber-400 mt-1" />
                    <div>
                      <h4 className="responsive-text-sm font-medium text-slate-800 dark:text-white">
                        {t('fasting.stayHydrated', 'Mantenha-se Hidratado')}
                      </h4>
                      <p className="responsive-text-xs text-slate-600 dark:text-gray-400">
                        {t('fasting.drinkWater', 'Beba bastante água, chá e café sem açúcar')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Utensils className="responsive-icon text-emerald-500 dark:text-emerald-400 mt-1" />
                    <div>
                      <h4 className="responsive-text-sm font-medium text-slate-800 dark:text-white">
                        {t('fasting.breakFastHealthy', 'Quebre o Jejum com Saúde')}
                      </h4>
                      <p className="responsive-text-xs text-slate-600 dark:text-gray-400">
                        {t('fasting.nutritionalFoods', 'Escolha alimentos nutritivos e balanceados')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba History - Histórico */}
          <TabsContent value="history" className="responsive-space-y">
            <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-gray-700 responsive-card shadow-md">
              <CardHeader className="responsive-p-content">
                <CardTitle className="responsive-title-lg text-slate-800 dark:text-white">
                  {t('fasting.recentSessions', 'Sessões Recentes')}
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-gray-400">
                  {t('fasting.historyDescription', 'Acompanhe seu histórico de jejuns')}
                </CardDescription>
              </CardHeader>
              <CardContent className="responsive-p-content">
                {fastingHistory.length > 0 ? (
                  <div className="responsive-space-y-sm">
                    {fastingHistory.slice(0, 10).map((session) => {
                      const duration = session.endTime 
                        ? differenceInHours(session.endTime, session.startTime)
                        : 0;
                      
                      return (
                        <div 
                          key={session.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-[#2a3137]"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              session.status === 'completed' 
                                ? 'bg-emerald-500' 
                                : 'bg-orange-500'
                            }`} />
                            <div>
                              <p className="responsive-text-sm font-medium text-slate-800 dark:text-white">
                                {session.type} • {duration}h
                              </p>
                              <p className="responsive-text-xs text-slate-600 dark:text-gray-400">
                                {format(session.startTime, 'dd/MM/yyyy HH:mm', { locale })}
                              </p>
                            </div>
                          </div>
                          <Badge 
                            variant={session.status === 'completed' ? "default" : "secondary"}
                            className={`${
                              session.status === 'completed' 
                                ? 'bg-emerald-500 text-white' 
                                : 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300'
                            } responsive-text-xs`}
                          >
                            {session.status === 'completed' ? t('fasting.completed', 'Completo') : t('fasting.stopped', 'Interrompido')}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center responsive-py">
                    <Clock className="mx-auto responsive-icon-lg text-slate-400 dark:text-gray-500 responsive-mb-sm" />
                    <p className="text-slate-600 dark:text-gray-400 responsive-text-base">
                      {t('fasting.noHistory', 'Nenhum jejum registrado ainda')}
                    </p>
                    <p className="responsive-text-sm text-slate-500 dark:text-gray-500">
                      {t('fasting.startFirst', 'Inicie seu primeiro jejum para ver o histórico')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Stats - Estatísticas */}
          <TabsContent value="stats" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-gray-700 shadow-md">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 sm:p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex-shrink-0">
                      <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                        {stats.totalSessions}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400">
                        {t('fasting.totalSessions', 'Total de Jejuns')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-gray-700 shadow-md">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 sm:p-3 rounded-full bg-blue-100 dark:bg-blue-900/20 flex-shrink-0">
                      <Award className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                        {stats.longestFast}h
                      </p>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400">
                        {t('fasting.longestFast', 'Maior Jejum')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-gray-700 shadow-md">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 sm:p-3 rounded-full bg-purple-100 dark:bg-purple-900/20 flex-shrink-0">
                      <Target className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                        {stats.currentStreak}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400">
                        {t('fasting.currentStreak', 'Sequência Atual')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-gray-700 shadow-md">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 sm:p-3 rounded-full bg-orange-100 dark:bg-orange-900/20 flex-shrink-0">
                      <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                        {stats.weeklyCompleted}/{stats.weeklyGoal}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400">
                        {t('fasting.weeklyGoal', 'Meta Semanal')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progresso Semanal */}
            <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-gray-700 responsive-card shadow-md">
              <CardHeader className="responsive-p-content">
                <CardTitle className="responsive-title-lg text-slate-800 dark:text-white">
                  {t('fasting.weeklyProgress', 'Progresso Semanal')}
                </CardTitle>
              </CardHeader>
              <CardContent className="responsive-p-content">
                <div className="responsive-space-y-sm">
                  <div className="flex justify-between responsive-text-sm text-slate-600 dark:text-gray-400">
                    <span>{t('fasting.completed', 'Completados')}: {stats.weeklyCompleted}</span>
                    <span>{t('fasting.goal', 'Meta')}: {stats.weeklyGoal}</span>
                  </div>
                  <Progress 
                    value={(stats.weeklyCompleted / stats.weeklyGoal) * 100} 
                    className="h-3 bg-slate-200 dark:bg-gray-700"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Settings - Configurações */}
          <TabsContent value="settings" className="responsive-space-y">
            <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-gray-700 responsive-card shadow-md">
              <CardHeader className="responsive-p-content">
                <CardTitle className="responsive-title-lg text-slate-800 dark:text-white">
                  {t('fasting.preferences', 'Preferências')}
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-gray-400">
                  {t('fasting.settingsDescription', 'Configure suas metas e notificações')}
                </CardDescription>
              </CardHeader>
              <CardContent className="responsive-p-content">
                <div className="responsive-space-y">
                  <div>
                    <Label className="responsive-text-sm font-medium text-slate-700 dark:text-gray-300 responsive-mb-sm block">
                      {t('fasting.weeklyGoal', 'Meta Semanal de Jejuns')}
                    </Label>
                    <Select 
                      value={stats.weeklyGoal.toString()} 
                      onValueChange={(value) => setStats(prev => ({ ...prev, weeklyGoal: parseInt(value) }))}
                    >
                      <SelectTrigger className="bg-white dark:bg-[#1a2127] border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-[#1a2127] border-slate-200 dark:border-gray-700">
                        {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                          <SelectItem 
                            key={num} 
                            value={num.toString()}
                            className="text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-gray-800"
                          >
                            {num} {num === 1 ? 'jejum' : 'jejuns'} por semana
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#2a3137]">
                    <h4 className="responsive-text-sm font-medium text-slate-800 dark:text-white responsive-mb-sm">
                      {t('fasting.notifications', 'Notificações')}
                    </h4>
                    <div className="responsive-space-y-sm">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="rounded border-slate-300 dark:border-gray-600" defaultChecked />
                        <span className="responsive-text-sm text-slate-700 dark:text-gray-300">
                          {t('fasting.fastingComplete', 'Quando o jejum for completado')}
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="rounded border-slate-300 dark:border-gray-600" defaultChecked />
                        <span className="responsive-text-sm text-slate-700 dark:text-gray-300">
                          {t('fasting.milestones', 'Marcos importantes (12h, 16h, 24h)')}
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="rounded border-slate-300 dark:border-gray-600" />
                        <span className="responsive-text-sm text-slate-700 dark:text-gray-300">
                          {t('fasting.weeklyReminder', 'Lembrete semanal para jejuar')}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          </Tabs>
        </div>
        
        <div className="lg:col-span-1 space-y-6 responsive-gap-y">
          {/* Quick Stats Card */}
          <Card className="bg-white dark:bg-[#1a2127] border border-emerald-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-slate-800 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                {t('fasting.quickStats', 'Estatísticas Rápidas')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-[#2a3137]">
                  <span className="text-sm text-slate-600 dark:text-gray-400">
                    {t('fasting.longestFast', 'Maior jejum')}
                  </span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {stats.longestFast}h
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-[#2a3137]">
                  <span className="text-sm text-slate-600 dark:text-gray-400">
                    {t('fasting.currentStreak', 'Sequência atual')}
                  </span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {stats.currentStreak} dias
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-[#2a3137]">
                  <span className="text-sm text-slate-600 dark:text-gray-400">
                    {t('fasting.totalSessions', 'Total de jejuns')}
                  </span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {stats.totalSessions}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Status Card */}
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border border-emerald-200 dark:border-emerald-700/50 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-slate-800 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                {t('fasting.todayStatus', 'Status de Hoje')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-center p-6 rounded-xl bg-white/50 dark:bg-[#1a2127]/50">
                {currentSession ? (
                  <div>
                    <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                      {formatTime(getCurrentFastHours(), getCurrentFastMinutes())}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-gray-400 font-medium">
                      {t('fasting.inProgress', 'Em andamento')}
                    </p>
                    <div className="mt-3 p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                      <p className="text-xs text-emerald-700 dark:text-emerald-300">
                        Meta: {currentSession.targetDuration}h
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-4xl font-bold text-slate-400 dark:text-gray-500 mb-2">
                      00:00
                    </div>
                    <p className="text-sm text-slate-600 dark:text-gray-400 font-medium">
                      {t('fasting.notStarted', 'Não iniciado')}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>


    </MainLayout>
  );
}