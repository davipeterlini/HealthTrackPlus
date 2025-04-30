import { MainLayout } from "@/components/layout/main-layout";
import { ActivitySummary } from "@/components/activity/activity-summary";
import { ActivityChart } from "@/components/activity/activity-chart";
import { ActivityBreakdown } from "@/components/activity/activity-breakdown";
import { ActivityWeeklyChart } from "@/components/activity/activity-weekly-chart";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Activity } from "@shared/schema";
import { DashboardStats } from "@shared/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Clock, Footprints, Dumbbell } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Schema para formulário de atividade
const activityFormSchema = z.object({
  activityType: z.string().min(1, { message: "Please select an activity type" }),
  steps: z.coerce.number().min(0, { message: "Steps must be 0 or higher" }),
  minutes: z.coerce.number().min(0, { message: "Duration must be 0 or higher" }),
  calories: z.coerce.number().min(0, { message: "Calories must be 0 or higher" }),
  distance: z.coerce.number().optional(),
  notes: z.string().optional(),
});

type ActivityFormValues = z.infer<typeof activityFormSchema>;

export default function ActivityPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      activityType: "walking",
      steps: 0,
      minutes: 0,
      calories: 0,
      distance: undefined,
      notes: ""
    }
  });
  
  const { data: activities, isLoading: isLoadingActivities } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });
  
  const { data: dashboardStats, isLoading: isLoadingStats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard"],
  });
  
  const isLoading = isLoadingActivities || isLoadingStats;
  
  // Mutação para adicionar nova atividade
  const addActivityMutation = useMutation({
    mutationFn: async (values: ActivityFormValues) => {
      // Criar objeto de atividade completo
      const newActivity = {
        ...values,
        date: new Date(),
        userId: 1
      };
      return await apiRequest("POST", "/api/activities", newActivity);
    },
    onSuccess: () => {
      toast({
        title: t('activity.activityAdded'),
        description: t('activity.activityAddedMessage')
      });
      setDialogOpen(false);
      form.reset();
      // Invalidate both activities and dashboard queries to refresh all data
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
    onError: (error: Error) => {
      toast({
        title: t('activity.failedToAdd'),
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const onSubmit = (values: ActivityFormValues) => {
    addActivityMutation.mutate(values);
  };
  
  // Formatar data de acordo com o idioma
  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const locale = i18n.language === 'pt' ? 'pt-BR' : 'en-US';
    return date.toLocaleDateString(locale, {
      weekday: "long",
      month: "long",
      day: "numeric"
    });
  };
  
  // Pegar as atividades mais recentes
  // Obter atividades recentes - as 5 mais recentes
  const recentActivities = activities ? [...activities]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5) : [];
  
  // Função para obter ícone de acordo com o tipo de atividade
  const getActivityIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "walking":
        return <Footprints className="h-5 w-5 text-primary-600 dark-text-accent-primary" />;
      case "running":
        return <Footprints className="h-5 w-5 text-green-500 dark-text-accent-green" />;
      case "cycling":
        return <Dumbbell className="h-5 w-5 text-purple-500 dark-text-accent-purple" />;
      default:
        return <Dumbbell className="h-5 w-5 text-blue-500 dark-text-accent-blue" />;
    }
  };
  
  return (
    <MainLayout title={t('activity.title')} hideTitle={true}>
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center responsive-mb gap-3 xs:gap-0">
        <h1 className="responsive-title-lg text-slate-800 dark:text-white">{t('activity.title')}</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" className="bg-green-600 hover:bg-green-700 dark:text-white dark:bg-green-700 dark:hover:bg-green-600 responsive-button w-full xs:w-auto">
              <PlusCircle className="mr-2 responsive-icon-sm" /> {t('activity.addActivity')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md md:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white">{t('activity.recordActivity')}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                <FormField
                  control={form.control}
                  name="activityType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-gray-300">{t('activity.activityType')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                            <SelectValue placeholder={t('activity.selectActivityType')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                          <SelectItem value="walking" className="dark:text-white dark:focus:bg-gray-700">{t('activity.walking')}</SelectItem>
                          <SelectItem value="running" className="dark:text-white dark:focus:bg-gray-700">{t('activity.running')}</SelectItem>
                          <SelectItem value="cycling" className="dark:text-white dark:focus:bg-gray-700">{t('activity.cycling')}</SelectItem>
                          <SelectItem value="swimming" className="dark:text-white dark:focus:bg-gray-700">{t('activity.swimming')}</SelectItem>
                          <SelectItem value="yoga" className="dark:text-white dark:focus:bg-gray-700">{t('activity.yoga')}</SelectItem>
                          <SelectItem value="gym" className="dark:text-white dark:focus:bg-gray-700">{t('activity.gym')}</SelectItem>
                          <SelectItem value="hiking" className="dark:text-white dark:focus:bg-gray-700">{t('activity.hiking')}</SelectItem>
                          <SelectItem value="other" className="dark:text-white dark:focus:bg-gray-700">{t('activity.other')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="steps"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 dark:text-gray-300">{t('activity.steps')}</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="calories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 dark:text-gray-300">{t('activity.calories')}</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="minutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 dark:text-gray-300">{t('activity.duration')} ({t('activity.minutes')})</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="distance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 dark:text-gray-300">{t('activity.distance')} (km)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-gray-300">{t('activity.notes')}</FormLabel>
                      <FormControl>
                        <Textarea placeholder="" {...field} className="dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none min-h-[80px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="submit" 
                    disabled={addActivityMutation.isPending} 
                    className="bg-green-600 hover:bg-green-700 dark-btn-success"
                  >
                    {addActivityMutation.isPending ? t('activity.savingActivity') : t('activity.saveActivity')}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 responsive-gap-y">
        {isLoading ? (
          <>
            <div className="lg:col-span-2">
              <Card className="bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card">
                <Skeleton className="h-80 w-full dark:bg-gray-700" />
              </Card>
            </div>
            <Card className="bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card">
              <Skeleton className="h-80 w-full dark:bg-gray-700" />
            </Card>
          </>
        ) : (
          <>
            <div className="lg:col-span-2 space-y-6 responsive-gap-y">
              <Card className="bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card">
                <CardHeader className="responsive-card-header">
                  <CardTitle className="responsive-title-sm text-slate-800 dark:text-white">{t('activity.summary')}</CardTitle>
                </CardHeader>
                <ActivitySummary 
                  activities={activities || []}
                  dashboardStats={dashboardStats}
                  selectedDate={selectedDate}
                />
              </Card>
              
              {/* Weekly Activities Chart - igual ao da página inicial */}
              <Card className="bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card">
                <CardHeader className="responsive-card-header">
                  <CardTitle className="responsive-title-sm text-slate-800 dark:text-white">{t('health.weeklyActivities')}</CardTitle>
                </CardHeader>
                <ActivityWeeklyChart 
                  activities={activities || []} 
                  onSelectDate={setSelectedDate}
                />
              </Card>
              
              {/* Recent Activities Section */}
              <Card className="bg-white dark:bg-[#1a2127] border-emerald-100 dark:border-[#2b353e] responsive-card">
                <CardHeader className="responsive-card-header">
                  <CardTitle className="responsive-title-sm text-slate-800 dark:text-white">{t('activity.recentActivities')}</CardTitle>
                </CardHeader>
                <CardContent className="responsive-card-content">
                  {recentActivities.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivities.map((activity, index) => (
                        <div key={index} className="flex space-x-4 items-start border-b dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                          <div className="responsive-icon-container rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                            {getActivityIcon(activity.activityType)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium responsive-text capitalize text-slate-800 dark:text-white">{activity.activityType}</h4>
                              <span className="responsive-text-sm text-slate-500 dark:text-slate-400">{formatDate(activity.date)}</span>
                            </div>
                            
                            <div className="mt-1 flex flex-wrap gap-3">
                              <div className="flex items-center responsive-text-sm text-slate-600 dark:text-slate-400">
                                <Footprints className="responsive-icon-sm mr-1 text-green-500" />
                                {activity.steps} {t('activity.steps')}
                              </div>
                              
                              <div className="flex items-center responsive-text-sm text-slate-600 dark:text-slate-400">
                                <Clock className="responsive-icon-sm mr-1 text-blue-500" />
                                {activity.minutes} {t('activity.minutes')}
                              </div>
                              
                              {activity.distance && (
                                <div className="flex items-center responsive-text-sm text-slate-600 dark:text-slate-400">
                                  <Dumbbell className="responsive-icon-sm mr-1 text-purple-500" />
                                  {activity.distance} km
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="responsive-icon-container mx-auto rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 mb-2">
                        <Dumbbell className="responsive-icon text-gray-400 dark:text-gray-500" />
                      </div>
                      <h3 className="mt-2 responsive-text font-medium text-slate-800 dark:text-white">{t('activity.noActivities')}</h3>
                      <p className="mt-1 responsive-text-sm text-slate-500 dark:text-slate-400">
                        {t('activity.startTracking')}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <ActivityBreakdown 
              activity={activities?.find(a => 
                new Date(a.date).toDateString() === selectedDate.toDateString()
              )}
            />
          </>
        )}
      </div>
    </MainLayout>
  );
}