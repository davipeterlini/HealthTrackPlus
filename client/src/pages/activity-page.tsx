import { MainLayout } from "@/components/layout/main-layout";
import { ActivitySummary } from "@/components/activity/activity-summary";
import { ActivityChart } from "@/components/activity/activity-chart";
import { ActivityBreakdown } from "@/components/activity/activity-breakdown";
import { ActivityWeeklyChart } from "@/components/activity/activity-weekly-chart";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Activity } from "@shared/schema";
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
  
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });
  
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
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
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
        return <Footprints className="h-5 w-5 text-primary-600 dark:text-primary-400" />;
      case "running":
        return <Footprints className="h-5 w-5 text-green-500 dark:text-green-400" />;
      case "cycling":
        return <Dumbbell className="h-5 w-5 text-purple-500 dark:text-purple-400" />;
      default:
        return <Dumbbell className="h-5 w-5 text-blue-500 dark:text-blue-400" />;
    }
  };
  
  return (
    <MainLayout title={t('activity.title')} hideTitle={true}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{t('activity.title')}</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <PlusCircle className="mr-2 h-4 w-4" /> {t('activity.addActivity')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('activity.recordActivity')}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="activityType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('activity.activityType')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('activity.selectActivityType')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="walking">{t('activity.walking')}</SelectItem>
                          <SelectItem value="running">{t('activity.running')}</SelectItem>
                          <SelectItem value="cycling">{t('activity.cycling')}</SelectItem>
                          <SelectItem value="swimming">{t('activity.swimming')}</SelectItem>
                          <SelectItem value="yoga">{t('activity.yoga')}</SelectItem>
                          <SelectItem value="gym">{t('activity.gym')}</SelectItem>
                          <SelectItem value="hiking">{t('activity.hiking')}</SelectItem>
                          <SelectItem value="other">{t('activity.other')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="steps"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('activity.steps')}</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
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
                        <FormLabel>{t('activity.calories')}</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
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
                        <FormLabel>{t('activity.duration')} ({t('activity.minutes')})</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
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
                        <FormLabel>{t('activity.distance')} (km)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} />
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
                      <FormLabel>{t('activity.notes')}</FormLabel>
                      <FormControl>
                        <Textarea placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="submit" 
                    disabled={addActivityMutation.isPending} 
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {addActivityMutation.isPending ? t('activity.savingActivity') : t('activity.saveActivity')}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {isLoading ? (
          <>
            <div className="lg:col-span-2">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <Skeleton className="h-80 w-full dark:bg-gray-700" />
              </Card>
            </div>
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <Skeleton className="h-80 w-full dark:bg-gray-700" />
            </Card>
          </>
        ) : (
          <>
            <div className="lg:col-span-2 space-y-6">
              <Card className="dark:bg-[#1a2127] dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">{t('activity.summary')}</CardTitle>
                </CardHeader>
                <ActivitySummary 
                  activities={activities || []} 
                  selectedDate={selectedDate}
                />
              </Card>
              
              {/* Weekly Activities Chart - igual ao da página inicial */}
              <Card className="dark:bg-[#1a2127] dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">{t('health.weeklyActivities')}</CardTitle>
                </CardHeader>
                <ActivityWeeklyChart 
                  activities={activities || []} 
                  onSelectDate={setSelectedDate}
                />
              </Card>
              
              {/* Gráfico de atividades por dia */}
              <Card className="dark:bg-[#1a2127] dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">{t('activity.dailyActivities')}</CardTitle>
                </CardHeader>
                <ActivityChart 
                  activities={activities || []} 
                  onSelectDate={setSelectedDate}
                />
              </Card>
              
              {/* Recent Activities Section */}
              <Card className="dark:bg-[#1a2127] dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">{t('activity.recentActivities')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentActivities.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivities.map((activity, index) => (
                        <div key={index} className="flex space-x-4 items-start border-b dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                          <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-[#1a2127] dark:border dark:border-gray-700 flex items-center justify-center">
                            {getActivityIcon(activity.activityType)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 capitalize">{activity.activityType}</h4>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(activity.date)}</span>
                            </div>
                            
                            <div className="mt-1 flex flex-wrap gap-3">
                              <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                                <Footprints className="h-3.5 w-3.5 mr-1" />
                                {activity.steps} {t('activity.steps')}
                              </div>
                              
                              <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                {activity.minutes} {t('activity.minutes')}
                              </div>
                              
                              {activity.distance && (
                                <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                                  <Dumbbell className="h-3.5 w-3.5 mr-1" />
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
                      <Dumbbell className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">{t('activity.noActivities')}</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
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