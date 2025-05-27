import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Target, 
  Clock, 
  Utensils, 
  Droplets, 
  Dumbbell, 
  Brain, 
  Heart, 
  Pill,
  Bell,
  CheckCircle,
  ArrowLeft,
  ArrowRight 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Schema de validação para o formulário
const healthProfileSchema = z.object({
  // Informações básicas
  age: z.number().min(13).max(120),
  gender: z.enum(["male", "female", "other"]),
  height: z.number().min(100).max(250),
  weight: z.number().min(30).max(300),
  activityLevel: z.enum(["sedentary", "lightly_active", "moderately_active", "very_active", "extremely_active"]),
  
  // Objetivos
  primaryGoal: z.enum(["weight_loss", "weight_gain", "maintain_weight", "muscle_gain", "improve_fitness", "improve_health"]),
  secondaryGoals: z.array(z.string()).optional(),
  targetWeight: z.number().optional(),
  timeframe: z.enum(["1_month", "3_months", "6_months", "1_year", "long_term"]),
  
  // Horários
  wakeUpTime: z.string(),
  bedTime: z.string(),
  workSchedule: z.enum(["morning", "afternoon", "evening", "night", "flexible", "rotating"]),
  
  // Alimentação
  dietaryRestrictions: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  mealsPerDay: z.number().min(2).max(6),
  breakfastTime: z.string(),
  lunchTime: z.string(),
  dinnerTime: z.string(),
  snackTimes: z.array(z.string()).optional(),
  preferredCuisines: z.array(z.string()).optional(),
  cookingSkill: z.enum(["beginner", "intermediate", "advanced"]),
  cookingTime: z.enum(["quick", "moderate", "elaborate"]),
  
  // Hidratação
  waterGoalLiters: z.number().min(1).max(5),
  reminderInterval: z.number().min(15).max(240),
  
  // Exercícios
  exercisePreferences: z.array(z.string()).optional(),
  workoutDuration: z.number().min(10).max(180),
  workoutFrequency: z.number().min(1).max(7),
  fitnessLevel: z.enum(["beginner", "intermediate", "advanced"]),
  exerciseLocation: z.enum(["home", "gym", "outdoor", "mixed"]),
  availableEquipment: z.array(z.string()).optional(),
  injuriesLimitations: z.array(z.string()).optional(),
  
  // Saúde mental
  stressLevel: z.number().min(1).max(5),
  sleepQualityGoal: z.enum(["improve", "maintain"]),
  meditationPreference: z.boolean(),
  relaxationActivities: z.array(z.string()).optional(),
  
  // Condições de saúde
  medicalConditions: z.array(z.string()).optional(),
  currentMedications: z.array(z.string()).optional(),
  vitaminsSupplements: z.array(z.string()).optional(),
  
  // Monitoramento
  trackingPreferences: z.array(z.string()).optional(),
  notificationPreferences: z.object({
    meals: z.boolean(),
    water: z.boolean(),
    exercise: z.boolean(),
    sleep: z.boolean(),
    medications: z.boolean(),
    vitamins: z.boolean(),
  }),
});

type HealthProfileForm = z.infer<typeof healthProfileSchema>;

const STEPS = [
  { id: 'basic', title: 'Informações Básicas', icon: User },
  { id: 'goals', title: 'Objetivos', icon: Target },
  { id: 'schedule', title: 'Horários', icon: Clock },
  { id: 'nutrition', title: 'Alimentação', icon: Utensils },
  { id: 'hydration', title: 'Hidratação', icon: Droplets },
  { id: 'exercise', title: 'Exercícios', icon: Dumbbell },
  { id: 'mental', title: 'Saúde Mental', icon: Brain },
  { id: 'health', title: 'Condições de Saúde', icon: Heart },
  { id: 'supplements', title: 'Vitaminas & Suplementos', icon: Pill },
  { id: 'notifications', title: 'Notificações', icon: Bell },
];

export function HealthPlanSetup() {
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<HealthProfileForm>({
    resolver: zodResolver(healthProfileSchema),
    defaultValues: {
      age: 25,
      gender: "male",
      height: 170,
      weight: 70,
      activityLevel: "moderately_active",
      primaryGoal: "improve_fitness",
      timeframe: "6_months",
      wakeUpTime: "07:00",
      bedTime: "23:00",
      workSchedule: "morning",
      mealsPerDay: 3,
      breakfastTime: "08:00",
      lunchTime: "12:00",
      dinnerTime: "19:00",
      cookingSkill: "intermediate",
      cookingTime: "moderate",
      waterGoalLiters: 2,
      reminderInterval: 60,
      workoutDuration: 30,
      workoutFrequency: 3,
      fitnessLevel: "beginner",
      exerciseLocation: "home",
      stressLevel: 3,
      sleepQualityGoal: "improve",
      meditationPreference: false,
      notificationPreferences: {
        meals: true,
        water: true,
        exercise: true,
        sleep: true,
        medications: true,
        vitamins: true,
      },
    },
  });

  const onSubmit = async (data: HealthProfileForm) => {
    setIsSubmitting(true);
    try {
      // Calcular BMR, TDEE e BMI
      const bmr = calculateBMR(data.weight, data.height, data.age, data.gender);
      const tdee = calculateTDEE(bmr, data.activityLevel);
      const bmi = calculateBMI(data.weight, data.height);

      const profileData = {
        ...data,
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        bmi: Math.round(bmi * 10), // Multiplicar por 10 para armazenar com 1 casa decimal
      };

      // Aqui você faria a chamada para a API
      console.log('Profile Data:', profileData);
      
      toast({
        title: "Plano de saúde criado!",
        description: "Seu plano personalizado foi gerado com sucesso.",
      });

      setLocation("/dashboard");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar seu plano de saúde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const currentStepData = STEPS[currentStep];
  const StepIcon = currentStepData.icon;

  return (
    <MainLayout hideTitle>
      <div className="responsive-content-container responsive-py">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center responsive-mb">
            <h1 className="responsive-title-lg text-slate-800 dark:text-gray-100">
              Crie Seu Plano de Saúde Personalizado
            </h1>
            <p className="responsive-text-md text-slate-600 dark:text-gray-400 responsive-mt-xs">
              Responda algumas perguntas para criarmos um plano completo para você
            </p>
          </div>

          {/* Progress */}
          <Card className="responsive-card responsive-mb">
            <CardContent className="responsive-p-content-sm">
              <div className="flex items-center gap-3 responsive-mb-xs">
                <StepIcon className="responsive-icon text-blue-600 dark:text-emerald-400" />
                <div className="flex-1">
                  <h3 className="responsive-text-md font-semibold">
                    {currentStepData.title}
                  </h3>
                  <p className="responsive-text-sm text-slate-500 dark:text-gray-400">
                    Etapa {currentStep + 1} de {STEPS.length}
                  </p>
                </div>
                <Badge variant="outline" className="responsive-text-xs">
                  {Math.round(progress)}%
                </Badge>
              </div>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Card className="responsive-card">
                <CardContent className="responsive-p-content">
                  {currentStep === 0 && <BasicInfoStep form={form} />}
                  {currentStep === 1 && <GoalsStep form={form} />}
                  {currentStep === 2 && <ScheduleStep form={form} />}
                  {currentStep === 3 && <NutritionStep form={form} />}
                  {currentStep === 4 && <HydrationStep form={form} />}
                  {currentStep === 5 && <ExerciseStep form={form} />}
                  {currentStep === 6 && <MentalHealthStep form={form} />}
                  {currentStep === 7 && <HealthConditionsStep form={form} />}
                  {currentStep === 8 && <SupplementsStep form={form} />}
                  {currentStep === 9 && <NotificationsStep form={form} />}
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between responsive-mt">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="responsive-button"
                >
                  <ArrowLeft className="responsive-icon-sm mr-2" />
                  Anterior
                </Button>

                {currentStep === STEPS.length - 1 ? (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="responsive-button bg-emerald-600 hover:bg-emerald-700"
                  >
                    {isSubmitting ? (
                      "Criando plano..."
                    ) : (
                      <>
                        <CheckCircle className="responsive-icon-sm mr-2" />
                        Finalizar
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="responsive-button"
                  >
                    Próximo
                    <ArrowRight className="responsive-icon-sm ml-2" />
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </MainLayout>
  );
}

// Funções auxiliares para cálculos
function calculateBMR(weight: number, height: number, age: number, gender: string): number {
  if (gender === "male") {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
}

function calculateTDEE(bmr: number, activityLevel: string): number {
  const multipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extremely_active: 1.9,
  };
  return bmr * (multipliers[activityLevel as keyof typeof multipliers] || 1.55);
}

function calculateBMI(weight: number, height: number): number {
  return weight / ((height / 100) ** 2);
}

// Componentes dos steps
function BasicInfoStep({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="responsive-title-sm responsive-mb-xs">Informações Básicas</h3>
        <p className="responsive-text-sm text-slate-600 dark:text-gray-400">
          Vamos começar com algumas informações básicas sobre você.
        </p>
      </div>

      <div className="responsive-grid-2">
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="responsive-label">Idade</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="25"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  className="responsive-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="responsive-label">Gênero</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="responsive-select">
                    <SelectValue placeholder="Selecione seu gênero" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Masculino</SelectItem>
                  <SelectItem value="female">Feminino</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="responsive-label">Altura (cm)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="170"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  className="responsive-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="responsive-label">Peso (kg)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="70"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  className="responsive-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="activityLevel"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="responsive-label">Nível de Atividade Atual</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-1 gap-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sedentary" id="sedentary" />
                  <label htmlFor="sedentary" className="responsive-text-sm flex-1">
                    <strong>Sedentário</strong> - Pouco ou nenhum exercício
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lightly_active" id="lightly_active" />
                  <label htmlFor="lightly_active" className="responsive-text-sm flex-1">
                    <strong>Levemente ativo</strong> - Exercício leve 1-3 dias/semana
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderately_active" id="moderately_active" />
                  <label htmlFor="moderately_active" className="responsive-text-sm flex-1">
                    <strong>Moderadamente ativo</strong> - Exercício moderado 3-5 dias/semana
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="very_active" id="very_active" />
                  <label htmlFor="very_active" className="responsive-text-sm flex-1">
                    <strong>Muito ativo</strong> - Exercício intenso 6-7 dias/semana
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="extremely_active" id="extremely_active" />
                  <label htmlFor="extremely_active" className="responsive-text-sm flex-1">
                    <strong>Extremamente ativo</strong> - Exercício muito intenso, trabalho físico
                  </label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

// Continuarei com os outros componentes dos steps...
function GoalsStep({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="responsive-title-sm responsive-mb-xs">Seus Objetivos</h3>
        <p className="responsive-text-sm text-slate-600 dark:text-gray-400">
          Defina seus objetivos principais para criarmos um plano adequado.
        </p>
      </div>

      <FormField
        control={form.control}
        name="primaryGoal"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="responsive-label">Objetivo Principal</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="responsive-select">
                  <SelectValue placeholder="Selecione seu objetivo principal" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="weight_loss">Perder peso</SelectItem>
                <SelectItem value="weight_gain">Ganhar peso</SelectItem>
                <SelectItem value="maintain_weight">Manter peso</SelectItem>
                <SelectItem value="muscle_gain">Ganhar massa muscular</SelectItem>
                <SelectItem value="improve_fitness">Melhorar condicionamento</SelectItem>
                <SelectItem value="improve_health">Melhorar saúde geral</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="responsive-grid-2">
        <FormField
          control={form.control}
          name="targetWeight"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="responsive-label">Peso Alvo (kg) - Opcional</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="65"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="responsive-input"
                />
              </FormControl>
              <FormDescription className="responsive-text-xs">
                Deixe em branco se não tiver um peso específico em mente
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timeframe"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="responsive-label">Prazo para atingir o objetivo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="responsive-select">
                    <SelectValue placeholder="Selecione o prazo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1_month">1 mês</SelectItem>
                  <SelectItem value="3_months">3 meses</SelectItem>
                  <SelectItem value="6_months">6 meses</SelectItem>
                  <SelectItem value="1_year">1 ano</SelectItem>
                  <SelectItem value="long_term">Longo prazo</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

function ScheduleStep({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="responsive-title-sm responsive-mb-xs">Horários e Rotina</h3>
        <p className="responsive-text-sm text-slate-600 dark:text-gray-400">
          Defina seus horários para criarmos uma rotina personalizada.
        </p>
      </div>

      <div className="responsive-grid-2">
        <FormField
          control={form.control}
          name="wakeUpTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="responsive-label">Horário de acordar</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  {...field}
                  className="responsive-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bedTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="responsive-label">Horário de dormir</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  {...field}
                  className="responsive-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="workSchedule"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="responsive-label">Horário de trabalho</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="responsive-select">
                  <SelectValue placeholder="Selecione seu horário de trabalho" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="morning">Manhã (6h-14h)</SelectItem>
                <SelectItem value="afternoon">Tarde (14h-22h)</SelectItem>
                <SelectItem value="evening">Noite (22h-6h)</SelectItem>
                <SelectItem value="flexible">Flexível</SelectItem>
                <SelectItem value="rotating">Turnos rotativos</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function NutritionStep({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="responsive-title-sm responsive-mb-xs">Alimentação</h3>
        <p className="responsive-text-sm text-slate-600 dark:text-gray-400">
          Conte-nos sobre seus hábitos alimentares e preferências.
        </p>
      </div>

      <div className="responsive-grid-2">
        <FormField
          control={form.control}
          name="mealsPerDay"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="responsive-label">Refeições por dia</FormLabel>
              <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                <FormControl>
                  <SelectTrigger className="responsive-select">
                    <SelectValue placeholder="Quantas refeições?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="2">2 refeições</SelectItem>
                  <SelectItem value="3">3 refeições</SelectItem>
                  <SelectItem value="4">4 refeições</SelectItem>
                  <SelectItem value="5">5 refeições</SelectItem>
                  <SelectItem value="6">6 refeições</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cookingSkill"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="responsive-label">Habilidade culinária</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="responsive-select">
                    <SelectValue placeholder="Seu nível na cozinha" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="beginner">Iniciante</SelectItem>
                  <SelectItem value="intermediate">Intermediário</SelectItem>
                  <SelectItem value="advanced">Avançado</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="breakfastTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="responsive-label">Café da manhã</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  {...field}
                  className="responsive-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lunchTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="responsive-label">Almoço</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  {...field}
                  className="responsive-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dinnerTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="responsive-label">Jantar</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  {...field}
                  className="responsive-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="cookingTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="responsive-label">Tempo disponível para cozinhar</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-1 gap-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="quick" id="quick" />
                  <label htmlFor="quick" className="responsive-text-sm flex-1">
                    <strong>Rápido</strong> - 15-30 minutos
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="moderate" />
                  <label htmlFor="moderate" className="responsive-text-sm flex-1">
                    <strong>Moderado</strong> - 30-60 minutos
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="elaborate" id="elaborate" />
                  <label htmlFor="elaborate" className="responsive-text-sm flex-1">
                    <strong>Elaborado</strong> - Mais de 60 minutos
                  </label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function HydrationStep({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="responsive-title-sm responsive-mb-xs">Hidratação</h3>
        <p className="responsive-text-sm text-slate-600 dark:text-gray-400">
          Configure suas metas de hidratação e lembretes.
        </p>
      </div>

      <div className="responsive-grid-2">
        <FormField
          control={form.control}
          name="waterGoalLiters"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="responsive-label">Meta diária de água (litros)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  placeholder="2.0"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  className="responsive-input"
                />
              </FormControl>
              <FormDescription className="responsive-text-xs">
                Recomendado: 2-3 litros por dia
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reminderInterval"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="responsive-label">Intervalo de lembretes (minutos)</FormLabel>
              <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                <FormControl>
                  <SelectTrigger className="responsive-select">
                    <SelectValue placeholder="A cada quantos minutos?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="15">15 minutos</SelectItem>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                  <SelectItem value="120">2 horas</SelectItem>
                  <SelectItem value="180">3 horas</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

function ExerciseStep({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="responsive-title-sm responsive-mb-xs">Exercícios</h3>
        <p className="responsive-text-sm text-slate-600 dark:text-gray-400">
          Conte-nos sobre suas preferências de exercício.
        </p>
      </div>

      <div className="responsive-grid-2">
        <FormField
          control={form.control}
          name="fitnessLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="responsive-label">Nível de condicionamento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="responsive-select">
                    <SelectValue placeholder="Seu nível atual" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="beginner">Iniciante</SelectItem>
                  <SelectItem value="intermediate">Intermediário</SelectItem>
                  <SelectItem value="advanced">Avançado</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="exerciseLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="responsive-label">Local preferido</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="responsive-select">
                    <SelectValue placeholder="Onde prefere treinar?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="home">Casa</SelectItem>
                  <SelectItem value="gym">Academia</SelectItem>
                  <SelectItem value="outdoor">Ar livre</SelectItem>
                  <SelectItem value="mixed">Variado</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="workoutDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="responsive-label">Duração do treino (minutos)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="10"
                  max="180"
                  placeholder="30"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  className="responsive-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="workoutFrequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="responsive-label">Frequência (vezes por semana)</FormLabel>
              <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                <FormControl>
                  <SelectTrigger className="responsive-select">
                    <SelectValue placeholder="Quantas vezes?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">1 vez</SelectItem>
                  <SelectItem value="2">2 vezes</SelectItem>
                  <SelectItem value="3">3 vezes</SelectItem>
                  <SelectItem value="4">4 vezes</SelectItem>
                  <SelectItem value="5">5 vezes</SelectItem>
                  <SelectItem value="6">6 vezes</SelectItem>
                  <SelectItem value="7">Todos os dias</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

function MentalHealthStep({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="responsive-title-sm responsive-mb-xs">Saúde Mental</h3>
        <p className="responsive-text-sm text-slate-600 dark:text-gray-400">
          Vamos cuidar também do seu bem-estar mental.
        </p>
      </div>

      <div className="responsive-grid-2">
        <FormField
          control={form.control}
          name="stressLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="responsive-label">Nível de estresse atual (1-5)</FormLabel>
              <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                <FormControl>
                  <SelectTrigger className="responsive-select">
                    <SelectValue placeholder="Como você se sente?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">1 - Muito baixo</SelectItem>
                  <SelectItem value="2">2 - Baixo</SelectItem>
                  <SelectItem value="3">3 - Moderado</SelectItem>
                  <SelectItem value="4">4 - Alto</SelectItem>
                  <SelectItem value="5">5 - Muito alto</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sleepQualityGoal"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="responsive-label">Objetivo do sono</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="responsive-select">
                    <SelectValue placeholder="Seu objetivo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="improve">Melhorar qualidade</SelectItem>
                  <SelectItem value="maintain">Manter qualidade atual</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="meditationPreference"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="responsive-label">
                Tenho interesse em praticar meditação
              </FormLabel>
              <FormDescription className="responsive-text-xs">
                Incluiremos exercícios de mindfulness no seu plano
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}

function HealthConditionsStep({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="responsive-title-sm responsive-mb-xs">Condições de Saúde</h3>
        <p className="responsive-text-sm text-slate-600 dark:text-gray-400">
          Informe sobre condições médicas para um plano mais seguro.
        </p>
      </div>

      <FormField
        control={form.control}
        name="medicalConditions"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="responsive-label">Condições médicas (opcional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Diabetes, hipertensão, problemas cardíacos, etc. (separar por vírgula)"
                {...field}
                value={field.value?.join(', ') || ''}
                onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                className="responsive-input min-h-[80px]"
              />
            </FormControl>
            <FormDescription className="responsive-text-xs">
              Essas informações nos ajudam a criar um plano mais seguro para você
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="currentMedications"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="responsive-label">Medicamentos atuais (opcional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Liste os medicamentos que você toma regularmente (separar por vírgula)"
                {...field}
                value={field.value?.join(', ') || ''}
                onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                className="responsive-input min-h-[80px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="allergies"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="responsive-label">Alergias alimentares (opcional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Amendoim, frutos do mar, lactose, glúten, etc. (separar por vírgula)"
                {...field}
                value={field.value?.join(', ') || ''}
                onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                className="responsive-input min-h-[60px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function SupplementsStep({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="responsive-title-sm responsive-mb-xs">Vitaminas e Suplementos</h3>
        <p className="responsive-text-sm text-slate-600 dark:text-gray-400">
          Conte-nos sobre vitaminas e suplementos que você toma.
        </p>
      </div>

      <FormField
        control={form.control}
        name="vitaminsSupplements"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="responsive-label">Vitaminas e suplementos atuais (opcional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Vitamina D, Ômega 3, Whey Protein, Creatina, etc. (separar por vírgula)"
                {...field}
                value={field.value?.join(', ') || ''}
                onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                className="responsive-input min-h-[100px]"
              />
            </FormControl>
            <FormDescription className="responsive-text-xs">
              Incluiremos lembretes para os suplementos que você já toma e sugeriremos outros baseados no seu perfil
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function NotificationsStep({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="responsive-title-sm responsive-mb-xs">Notificações</h3>
        <p className="responsive-text-sm text-slate-600 dark:text-gray-400">
          Configure quais lembretes você gostaria de receber.
        </p>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="notificationPreferences.meals"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="responsive-text-md">Refeições</FormLabel>
                <FormDescription className="responsive-text-sm">
                  Lembretes para café da manhã, almoço e jantar
                </FormDescription>
              </div>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notificationPreferences.water"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="responsive-text-md">Hidratação</FormLabel>
                <FormDescription className="responsive-text-sm">
                  Lembretes para beber água regularmente
                </FormDescription>
              </div>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notificationPreferences.exercise"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="responsive-text-md">Exercícios</FormLabel>
                <FormDescription className="responsive-text-sm">
                  Lembretes para seus treinos programados
                </FormDescription>
              </div>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notificationPreferences.sleep"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="responsive-text-md">Sono</FormLabel>
                <FormDescription className="responsive-text-sm">
                  Lembretes para ir dormir e acordar
                </FormDescription>
              </div>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notificationPreferences.medications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="responsive-text-md">Medicamentos</FormLabel>
                <FormDescription className="responsive-text-sm">
                  Lembretes para tomar medicamentos
                </FormDescription>
              </div>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notificationPreferences.vitamins"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="responsive-text-md">Vitaminas</FormLabel>
                <FormDescription className="responsive-text-sm">
                  Lembretes para tomar vitaminas e suplementos
                </FormDescription>
              </div>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}