import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { queryClient } from "@/lib/queryClient";
import { MainLayout } from "@/components/layout/main-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Moon, Clock, Bed, TrendingUp, Activity } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell
} from "recharts";

// Esquema de validação para o formulário de sono
const sleepFormSchema = z.object({
  hours: z
    .string()
    .min(1, "Horas de sono são obrigatórias")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0 && parseFloat(val) <= 24, {
      message: "Horas devem ser um número entre 0 e 24",
    }),
  quality: z.string().min(1, "Qualidade do sono é obrigatória"),
  deepSleep: z
    .string()
    .min(1, "Sono profundo é obrigatório")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0 && parseFloat(val) <= 24, {
      message: "Sono profundo deve ser um número entre 0 e 24",
    }),
  lightSleep: z
    .string()
    .min(1, "Sono leve é obrigatório")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0 && parseFloat(val) <= 24, {
      message: "Sono leve deve ser um número entre 0 e 24",
    }),
  rem: z
    .string()
    .min(1, "Sono REM é obrigatório")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0 && parseFloat(val) <= 24, {
      message: "Sono REM deve ser um número entre 0 e 24",
    }),
});

type SleepFormValues = z.infer<typeof sleepFormSchema>;

export default function SleepPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("history");

  // Definir a interface para os dados de sono
  interface SleepRecord {
    id: number;
    userId: number;
    date: string;
    hours: number;
    quality: 'poor' | 'fair' | 'good' | 'excellent';
    deepSleep: number;
    lightSleep: number;
    rem: number;
    bedTime?: Date;
    wakeTime?: Date;
    awakeTime?: number;
    stressLevel?: number;
    source?: string | null;
  }

  // Buscar dados de sono
  const { data: sleepData = [] as SleepRecord[], isLoading: isLoadingSleep } = useQuery<SleepRecord[]>({
    queryKey: ['/api/sleep'],
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Preparar o formulário
  const form = useForm<SleepFormValues>({
    resolver: zodResolver(sleepFormSchema),
    defaultValues: {
      hours: "",
      quality: "",
      deepSleep: "",
      lightSleep: "",
      rem: "",
    },
  });

  // Mutation para registrar sono
  const recordSleepMutation = useMutation({
    mutationFn: async (values: SleepFormValues) => {
      const response = await apiRequest('/api/sleep', 'POST', {
        hours: parseFloat(values.hours),
        quality: values.quality,
        deepSleep: parseFloat(values.deepSleep),
        lightSleep: parseFloat(values.lightSleep),
        rem: parseFloat(values.rem),
      });
      return response;
    },
    onSuccess: () => {
      toast({
        title: t('sleep.sleepRecorded'),
        description: t('sleep.sleepRecordedSuccess'),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sleep'] });
      form.reset();
      setActiveTab("history");
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('sleep.failedToRecord'),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: SleepFormValues) => {
    recordSleepMutation.mutate(values);
  };

  // Cores para os gráficos
  const COLORS = ['#10b981', '#60a5fa', '#f59e0b'];
  const QUALITY_COLORS = {
    poor: "#ef4444",
    fair: "#f97316",
    good: "#22c55e",
    excellent: "#3b82f6"
  };

  // Calcular totais para o resumo
  const latestSleep = sleepData[0] || null;
  const avgQuality = sleepData.length > 0
    ? sleepData.reduce((sum: number, record: SleepRecord) => {
        const qualityValues = { poor: 1, fair: 2, good: 3, excellent: 4 };
        return sum + (qualityValues[record.quality] || 0);
      }, 0) / sleepData.length
    : 0;
  
  const qualityText = avgQuality <= 1.5 
    ? "poor" 
    : avgQuality <= 2.5 
      ? "fair" 
      : avgQuality <= 3.5 
        ? "good" 
        : "excellent";

  // Dados para o gráfico de ciclos de sono
  const sleepCompositionData = [
    { name: t('sleep.deepSleep'), value: latestSleep?.deepSleep || 0 },
    { name: t('sleep.lightSleep'), value: latestSleep?.lightSleep || 0 },
    { name: t('sleep.rem'), value: latestSleep?.rem || 0 },
  ];

  // Dados para o gráfico de histórico de sono
  const sleepHistoryData = sleepData
    .slice(0, 7)
    .map((record: SleepRecord) => ({
      date: format(new Date(record.date), 'dd/MM'),
      hours: record.hours,
      quality: record.quality,
    }))
    .reverse();

  return (
    <MainLayout>
      <div className="container px-4 py-6 mx-auto dark-bg-base">
        <h1 className="text-2xl font-bold mb-6 dark-text-title">{t('sleep.sleepTracker')}</h1>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Resumo do Sono */}
          <Card className="md:col-span-3 dark:bg-[#1a2127] dark:border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle>{t('sleep.sleepSummary')}</CardTitle>
              <CardDescription>
                {t('sleep.sleepSummaryDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-gray-50 dark:bg-[#1a2127] p-4 rounded-lg flex items-center">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
                    <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('sleep.totalSleepHours')}</p>
                    <p className="text-2xl font-bold">
                      {latestSleep
                        ? `${latestSleep.hours} ${t('sleep.hours')}`
                        : t('common.notAvailable')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {latestSleep
                        ? format(new Date(latestSleep.date), 'dd/MM/yyyy')
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-[#1a2127] p-4 rounded-lg flex items-center">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mr-4">
                    <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('sleep.sleepQuality')}</p>
                    <p className="text-2xl font-bold">
                      {sleepData.length > 0
                        ? t(`sleep.${qualityText}`)
                        : t('common.notAvailable')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('sleep.averageQuality')}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-[#1a2127] p-4 rounded-lg flex items-center">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4">
                    <Bed className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('sleep.deepSleepPercentage')}</p>
                    <p className="text-2xl font-bold">
                      {latestSleep && latestSleep.hours > 0
                        ? `${Math.round((latestSleep.deepSleep / latestSleep.hours) * 100)}%`
                        : t('common.notAvailable')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('sleep.ofTotalSleep')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="history" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400">{t('sleep.sleepHistory')}</TabsTrigger>
                <TabsTrigger value="record" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400">{t('sleep.recordSleep')}</TabsTrigger>
              </TabsList>

              <TabsContent value="history" className="space-y-6">
                {/* Gráfico de Histórico de Sono */}
                <Card className="dark:bg-[#1a2127] dark:border-gray-700">
                  <CardHeader>
                    <CardTitle>{t('sleep.sleepHistory')}</CardTitle>
                    <CardDescription>{t('sleep.sleepHistoryDescription')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      {sleepHistoryData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={sleepHistoryData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Area
                              type="monotone"
                              dataKey="hours"
                              stroke="#10b981"
                              fill="#10b981"
                              name={t('sleep.hours')}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-gray-500 dark:text-gray-400">
                            {t('sleep.noSleepData')}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Composição do Sono */}
                {latestSleep && (
                  <Card className="dark:bg-[#1a2127] dark:border-gray-700">
                    <CardHeader>
                      <CardTitle>{t('sleep.sleepComposition')}</CardTitle>
                      <CardDescription>{t('sleep.lastSleepCycles')}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={sleepCompositionData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {sleepCompositionData.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={COLORS[index % COLORS.length]} 
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex gap-4 mt-4 justify-center">
                        {sleepCompositionData.map((entry, index) => (
                          <div key={index} className="flex items-center">
                            <div 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              className="w-3 h-3 mr-1 rounded-full"
                            />
                            <span className="text-sm">{entry.name}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="record">
                <Card className="dark:bg-[#1a2127] dark:border-gray-700">
                  <CardHeader>
                    <CardTitle>{t('sleep.recordSleep')}</CardTitle>
                    <CardDescription>{t('sleep.recordSleepDescription')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="hours"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('sleep.totalSleepHours')}</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.1"
                                    placeholder="8.0"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="quality"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('sleep.sleepQuality')}</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder={t('sleep.selectQuality')} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="poor">{t('sleep.poor')}</SelectItem>
                                    <SelectItem value="fair">{t('sleep.fair')}</SelectItem>
                                    <SelectItem value="good">{t('sleep.good')}</SelectItem>
                                    <SelectItem value="excellent">{t('sleep.excellent')}</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="space-y-4">
                          <div className="text-sm font-medium mb-2">
                            {t('sleep.sleepCycles')}
                          </div>
                          <div className="grid gap-4 md:grid-cols-3">
                            <FormField
                              control={form.control}
                              name="deepSleep"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('sleep.deepSleep')} (h)</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      step="0.1"
                                      placeholder="2.5"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="lightSleep"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('sleep.lightSleep')} (h)</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      step="0.1"
                                      placeholder="4.0"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="rem"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('sleep.rem')} (h)</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      step="0.1"
                                      placeholder="1.5"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-emerald-600 hover:bg-emerald-700"
                          disabled={recordSleepMutation.isPending}
                        >
                          {recordSleepMutation.isPending
                            ? t('sleep.savingRecord')
                            : t('sleep.saveRecord')}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Dicas de Sono */}
          <div>
            <Card className="h-full dark:bg-[#1a2127] dark:border-gray-700">
              <CardHeader>
                <CardTitle>{t('sleep.sleepTips')}</CardTitle>
                <CardDescription>{t('sleep.improveSleepQuality')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-full mr-2">
                      <Moon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm">{t('sleep.tip1')}</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-full mr-2">
                      <Moon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm">{t('sleep.tip2')}</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-full mr-2">
                      <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm">{t('sleep.tip3')}</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-full mr-2">
                      <Moon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm">{t('sleep.tip4')}</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-full mr-2">
                      <Moon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm">{t('sleep.tip5')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}