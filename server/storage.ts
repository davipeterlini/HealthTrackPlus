import { 
  users, activities, medicalExams, sleepRecords, 
  waterIntake, meals, videos, videoProgress, courseTracks, trackVideos,
  foodItems, recipes, stressLevels, medications, medicationLogs,
  meditationSessions, menstrualCycles, menstrualCycleSymptoms,
  fertilityTracking, pregnancyTracking,
  type User, type InsertUser, type MedicalExam, type Activity,
  type SleepRecord, type WaterIntakeRecord, type Meal, type Video,
  type VideoProgress, type CourseTrack, type TrackVideo,
  type FoodItem, type Recipe, type StressLevel, type Medication,
  type MedicationLog, type MeditationSession, type MenstrualCycle,
  type MenstrualCycleSymptom, type FertilityTracking, type PregnancyTracking
} from "@shared/schema";
import { DashboardStats } from "@shared/dashboard";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // Dashboard methods
  getDashboardStats(userId: number): Promise<DashboardStats>;
  
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Medical exam methods
  getMedicalExams(userId: number): Promise<MedicalExam[]>;
  getMedicalExam(id: number): Promise<MedicalExam | undefined>;
  createMedicalExam(exam: Omit<MedicalExam, 'id'>): Promise<MedicalExam>;
  updateMedicalExamWithAIAnalysis(id: number, aiAnalysis: any, anomalies: boolean, riskLevel: string): Promise<MedicalExam>;
  
  // Health insights methods
  getHealthInsights(userId: number): Promise<HealthInsight[]>;
  getHealthInsightsByCategory(userId: number, category: string): Promise<HealthInsight[]>;
  getHealthInsightsByExam(examId: number): Promise<HealthInsight[]>;
  createHealthInsight(insight: Omit<HealthInsight, 'id'>): Promise<HealthInsight>;
  
  // Activity methods
  getActivities(userId: number): Promise<Activity[]>;
  createActivity(activity: Omit<Activity, 'id'>): Promise<Activity>;
  getActivityById(id: number): Promise<Activity | undefined>;
  getActivityByDate(userId: number, date: Date): Promise<Activity[]>;
  getActivityStats(userId: number, startDate: Date, endDate: Date): Promise<any>;
  
  // Sleep methods
  getSleepRecords(userId: number): Promise<SleepRecord[]>;
  createSleepRecord(sleepRecord: Omit<SleepRecord, 'id'>): Promise<SleepRecord>;
  getSleepRecordById(id: number): Promise<SleepRecord | undefined>;
  getSleepRecordsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<SleepRecord[]>;
  getSleepStats(userId: number, startDate: Date, endDate: Date): Promise<any>;
  
  // Water intake methods
  getWaterIntake(userId: number): Promise<WaterIntakeRecord[]>;
  createWaterIntake(waterIntake: Omit<WaterIntakeRecord, 'id'>): Promise<WaterIntakeRecord>;
  getWaterIntakeByDate(userId: number, date: Date): Promise<WaterIntakeRecord[]>;
  getWaterIntakeStats(userId: number, startDate: Date, endDate: Date): Promise<any>;
  
  // Nutrition methods
  getMeals(userId: number): Promise<Meal[]>;
  createMeal(meal: Omit<Meal, 'id'>): Promise<Meal>;
  getMealById(id: number): Promise<Meal | undefined>;
  getMealsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<Meal[]>;
  getNutritionStats(userId: number, startDate: Date, endDate: Date): Promise<any>;
  
  // Food item methods
  getFoodItems(): Promise<FoodItem[]>;
  getFoodItemsByCategory(category: string): Promise<FoodItem[]>;
  getFoodItem(id: number): Promise<FoodItem | undefined>;
  createFoodItem(foodItem: Omit<FoodItem, 'id'>): Promise<FoodItem>;
  
  // Recipe methods
  getRecipes(userId: number): Promise<Recipe[]>;
  getRecipesByCategory(category: string): Promise<Recipe[]>;
  getRecipe(id: number): Promise<Recipe | undefined>;
  createRecipe(recipe: Omit<Recipe, 'id'>): Promise<Recipe>;
  
  // Stress level methods
  getStressLevels(userId: number): Promise<StressLevel[]>;
  getStressLevelById(id: number): Promise<StressLevel | undefined>;
  getStressLevelsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<StressLevel[]>;
  createStressLevel(stressLevel: Omit<StressLevel, 'id'>): Promise<StressLevel>;
  
  // Medication methods
  getMedications(userId: number): Promise<Medication[]>;
  getMedication(id: number): Promise<Medication | undefined>;
  createMedication(medication: Omit<Medication, 'id'>): Promise<Medication>;
  updateMedication(id: number, medication: Partial<Omit<Medication, 'id'>>): Promise<Medication>;
  
  // Medication log methods
  getMedicationLogs(userId: number, medicationId?: number): Promise<MedicationLog[]>;
  getMedicationLogsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<MedicationLog[]>;
  createMedicationLog(medicationLog: Omit<MedicationLog, 'id'>): Promise<MedicationLog>;
  
  // Meditation methods
  getMeditationSessions(userId: number): Promise<MeditationSession[]>;
  getMeditationSessionById(id: number): Promise<MeditationSession | undefined>;
  createMeditationSession(session: Omit<MeditationSession, 'id'>): Promise<MeditationSession>;
  
  // Women's health methods
  getMenstrualCycles(userId: number): Promise<MenstrualCycle[]>;
  getMenstrualCycleById(id: number): Promise<MenstrualCycle | undefined>;
  createMenstrualCycle(cycle: Omit<MenstrualCycle, 'id'>): Promise<MenstrualCycle>;
  
  getMenstrualCycleSymptoms(userId: number): Promise<MenstrualCycleSymptom[]>;
  getMenstrualCycleSymptomsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<MenstrualCycleSymptom[]>;
  createMenstrualCycleSymptom(symptom: Omit<MenstrualCycleSymptom, 'id'>): Promise<MenstrualCycleSymptom>;
  
  // Fertility tracking methods
  getFertilityTracking(userId: number): Promise<FertilityTracking[]>;
  getFertilityTrackingByDateRange(userId: number, startDate: Date, endDate: Date): Promise<FertilityTracking[]>;
  createFertilityTracking(tracking: Omit<FertilityTracking, 'id'>): Promise<FertilityTracking>;
  
  // Pregnancy tracking methods
  getPregnancyTracking(userId: number): Promise<PregnancyTracking | undefined>;
  createPregnancyTracking(tracking: Omit<PregnancyTracking, 'id'>): Promise<PregnancyTracking>;
  updatePregnancyTracking(id: number, tracking: Partial<Omit<PregnancyTracking, 'id'>>): Promise<PregnancyTracking>;
  
  // Video methods
  getVideos(): Promise<Video[]>;
  getVideo(id: number): Promise<Video | undefined>;
  
  // Video progress methods
  getVideoProgress(userId: number, videoId: number): Promise<VideoProgress | undefined>;
  createOrUpdateVideoProgress(progress: Omit<VideoProgress, 'id'>): Promise<VideoProgress>;
  
  // Course track methods
  getCourseTracks(): Promise<CourseTrack[]>;
  getCourseTrack(id: number): Promise<CourseTrack | undefined>;
  
  // Track video methods
  getTrackVideos(trackId: number): Promise<TrackVideo[]>;
  
  // Session store
  sessionStore: any;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private medicalExams: Map<number, MedicalExam>;
  private activities: Map<number, Activity>;
  private sleepRecords: Map<number, SleepRecord>;
  private waterIntakeRecords: Map<number, WaterIntakeRecord>;
  private mealRecords: Map<number, Meal>;
  private foodItems: Map<number, FoodItem>;
  private recipes: Map<number, Recipe>;
  private stressLevels: Map<number, StressLevel>;
  private medications: Map<number, Medication>;
  private medicationLogs: Map<number, MedicationLog>;
  private meditationSessions: Map<number, MeditationSession>;
  private menstrualCycles: Map<number, MenstrualCycle>;
  private menstrualCycleSymptoms: Map<number, MenstrualCycleSymptom>;
  private fertilityTrackings: Map<number, FertilityTracking>;
  private pregnancyTrackings: Map<number, PregnancyTracking>;
  private videos: Map<number, Video>;
  private videoProgressRecords: Map<number, VideoProgress>;
  private courseTracks: Map<number, CourseTrack>;
  private trackVideos: Map<number, TrackVideo>;
  
  currentUserId: number;
  currentMedicalExamId: number;
  currentActivityId: number;
  currentSleepRecordId: number;
  currentWaterIntakeId: number;
  currentMealId: number;
  currentFoodItemId: number;
  currentRecipeId: number;
  currentStressLevelId: number;
  currentMedicationId: number;
  currentMedicationLogId: number;
  currentMeditationSessionId: number;
  currentMenstrualCycleId: number;
  currentMenstrualCycleSymptomId: number;
  currentFertilityTrackingId: number;
  currentPregnancyTrackingId: number;
  currentVideoId: number;
  currentVideoProgressId: number;
  currentCourseTrackId: number;
  currentTrackVideoId: number;
  sessionStore: any; // Fix para error do LSP

  constructor() {
    this.users = new Map();
    this.medicalExams = new Map();
    this.activities = new Map();
    this.sleepRecords = new Map();
    this.waterIntakeRecords = new Map();
    this.mealRecords = new Map();
    this.foodItems = new Map();
    this.recipes = new Map();
    this.stressLevels = new Map();
    this.medications = new Map();
    this.medicationLogs = new Map();
    this.meditationSessions = new Map();
    this.menstrualCycles = new Map();
    this.menstrualCycleSymptoms = new Map();
    this.fertilityTrackings = new Map();
    this.pregnancyTrackings = new Map();
    this.videos = new Map();
    this.videoProgressRecords = new Map();
    this.courseTracks = new Map();
    this.trackVideos = new Map();
    
    this.currentUserId = 1;
    this.currentMedicalExamId = 1;
    this.currentActivityId = 1;
    this.currentSleepRecordId = 1;
    this.currentWaterIntakeId = 1;
    this.currentMealId = 1;
    this.currentFoodItemId = 1;
    this.currentRecipeId = 1;
    this.currentStressLevelId = 1;
    this.currentMedicationId = 1;
    this.currentMedicationLogId = 1;
    this.currentMeditationSessionId = 1;
    this.currentMenstrualCycleId = 1;
    this.currentMenstrualCycleSymptomId = 1;
    this.currentFertilityTrackingId = 1;
    this.currentPregnancyTrackingId = 1;
    this.currentVideoId = 1;
    this.currentVideoProgressId = 1;
    this.currentCourseTrackId = 1;
    this.currentTrackVideoId = 1;
    
    // Initialize sample videos and data
    this.initSampleVideos();
    this.initSampleCourseTracks();
    this.initSampleActivities();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  // Initialize some sample videos for the application
  private async initSampleVideos() {
    const videoId = '0F9szTYowN0';
    const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    const data = await response.json();
    
    const sampleVideos: Omit<Video, 'id'>[] = [
      {
        title: data.title,
        duration: '18:32',
        category: 'Mental Health',
        description: 'Uma meditação guiada para reduzir ansiedade e estresse, com foco em respiração e relaxamento profundo',
        thumbnailUrl: `https://img.youtube.com/vi/0F9szTYowN0/maxresdefault.jpg`,
        videoUrl: 'https://www.youtube.com/embed/0F9szTYowN0'
      },
      {
        title: 'Nutrition Basics for Wellness',
        duration: '24:15',
        category: 'Nutrition',
        description: 'Fundamental nutrition principles for overall wellness',
        thumbnailUrl: ''
      },
      {
        title: 'Gentle Morning Yoga',
        duration: '15:45',
        category: 'Exercise',
        description: 'Start your day with gentle yoga practices',
        thumbnailUrl: ''
      },
      {
        title: 'Understanding Inflammation',
        duration: '22:10', 
        category: 'Medical',
        description: 'Learn about inflammation and its impact on health',
        thumbnailUrl: ''
      },
      {
        title: 'Sleep Optimization',
        duration: '19:30',
        category: 'Sleep',
        description: 'Improve your sleep quality with these evidence-based tips',
        thumbnailUrl: ''
      }
    ];
    
    sampleVideos.forEach(video => {
      const id = this.currentVideoId++;
      this.videos.set(id, { ...video, id });
    });
  }
  
  // Initialize sample course tracks
  private initSampleCourseTracks() {
    const sampleTracks: Omit<CourseTrack, 'id'>[] = [
      {
        title: 'Foundations of Holistic Health',
        description: 'Comprehensive introduction to integrative medicine principles',
        videoCount: 5
      },
      {
        title: 'Nutrition Masterclass',
        description: 'Deep dive into nutrition for optimal health',
        videoCount: 8
      }
    ];
    
    sampleTracks.forEach(track => {
      const id = this.currentCourseTrackId++;
      this.courseTracks.set(id, { ...track, id });
    });
    
    // Create track videos relationships
    const trackVideos: Omit<TrackVideo, 'id'>[] = [
      { trackId: 1, videoId: 1, order: 1 },
      { trackId: 1, videoId: 2, order: 2 },
      { trackId: 1, videoId: 3, order: 3 },
      { trackId: 1, videoId: 4, order: 4 },
      { trackId: 1, videoId: 5, order: 5 }
    ];
    
    trackVideos.forEach(trackVideo => {
      const id = this.currentTrackVideoId++;
      this.trackVideos.set(id, { ...trackVideo, id });
    });
  }
  
  // Inicializa atividades de exemplo para demonstração
  private initSampleActivities() {
    // Mock de usuário se não existir
    if (!this.users.has(1)) {
      this.users.set(1, {
        id: 1,
        username: "usuario_teste",
        email: "teste@exemplo.com",
        password: "senha_criptografada",
        name: "Usuário Teste",
        avatar: null,
        createdAt: new Date()
      });
    }
    
    // Tipos de atividades para variedade
    const activityTypes = ["walking", "running", "cycling", "swimming", "yoga", "gym", "hiking"];
    
    // Criar atividades para os últimos 30 dias
    const today = new Date();
    
    for (let i = 0; i < 25; i++) {
      const activityDate = new Date();
      activityDate.setDate(today.getDate() - i);
      
      // Gerar um tipo de atividade aleatório
      const randomType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      
      // Valores aleatórios para cada atividade
      const stepsCount = Math.floor(Math.random() * 10000) + 2000; // Entre 2000 e 12000 passos
      const durationMinutes = Math.floor(Math.random() * 60) + 30; // Entre 30 e 90 minutos
      const caloriesBurned = Math.floor(Math.random() * 500) + 150; // Entre 150 e 650 calorias
      const distanceValue = Math.floor(Math.random() * 10) + 2; // Entre 2 e 12 km
      
      // Criar novas atividades
      const newActivity: Activity = {
        id: this.currentActivityId++,
        userId: 1,
        date: activityDate,
        startTime: null,
        endTime: null,
        activityType: randomType,
        steps: stepsCount,
        distance: distanceValue,
        calories: caloriesBurned,
        minutes: durationMinutes,
        heartRate: Math.floor(Math.random() * 40) + 120, // Entre 120 e 160 bpm
        heartRateZones: null,
        elevationGain: randomType === "hiking" ? Math.floor(Math.random() * 500) + 100 : null,
        elevationLoss: randomType === "hiking" ? Math.floor(Math.random() * 500) + 100 : null,
        avgPace: null,
        maxPace: null,
        intensity: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
        cadence: null,
        strideLength: null,
        routeData: null,
        gpsPoints: null,
        activityImage: null,
        feeling: ["great", "good", "ok", "bad"][Math.floor(Math.random() * 4)],
        weatherCondition: ["sunny", "cloudy", "rainy"][Math.floor(Math.random() * 3)],
        temperature: Math.floor(Math.random() * 20) + 15, // Entre 15 e 35 graus
        humidity: Math.floor(Math.random() * 50) + 30, // Entre 30 e 80%
        terrainType: randomType === "hiking" || randomType === "running" ? 
          ["flat", "hilly", "mixed", "trail"][Math.floor(Math.random() * 4)] : null,
        equipmentUsed: null,
        notes: `${randomType.charAt(0).toUpperCase() + randomType.slice(1)} session on ${activityDate.toDateString()}`,
        source: "manual",
        isRealTime: false,
        achievements: null
      };
      
      this.activities.set(newActivity.id, newActivity);
    }
  }

  // Dashboard methods
  async getDashboardStats(userId: number): Promise<DashboardStats> {
    // Dados para o dashboard
    const today = new Date();
    
    // Obter atividades recentes para análise
    const userActivities = Array.from(this.activities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    // Definir dias da semana conforme idioma do sistema (simulando)
    const getDayNames = () => {
      const isEnglish = true; // Poderia ser baseado na preferência do usuário
      return {
        full: isEnglish ? 
          ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] : 
          ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
        short: isEnglish ? 
          ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] : 
          ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        mini: isEnglish ? 
          ['S', 'M', 'T', 'W', 'T', 'F', 'S'] : 
          ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
      };
    };
    
    // Gerar dados semanais para o gráfico de atividades
    const weeklyActivityData = [];
    const dayNames = getDayNames();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      // Encontrar atividades para este dia
      const dayActivities = userActivities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate.toDateString() === date.toDateString();
      });
      
      // Calcular totais para o dia
      const daySteps = dayActivities.reduce((sum, act) => sum + act.steps, 0);
      const dayCals = dayActivities.reduce((sum, act) => sum + act.calories, 0);
      const dayActive = dayActivities.reduce((sum, act) => sum + act.minutes, 0);
      
      const dayIndex = date.getDay();
      weeklyActivityData.push({
        day: dayNames.short[dayIndex],
        shortDay: dayNames.mini[dayIndex],
        steps: daySteps,
        cals: dayCals,
        active: dayActive
      });
    }
    
    // Calcular estatísticas de atividade
    const todayActivities = userActivities.filter(act => {
      const actDate = new Date(act.date);
      return actDate.toDateString() === today.toDateString();
    });
    
    const yesterdayActivities = userActivities.filter(act => {
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      const actDate = new Date(act.date);
      return actDate.toDateString() === yesterday.toDateString();
    });
    
    // Calcular minutos ativos total e comparar com ontem
    const todayActiveMinutes = todayActivities.reduce((sum, act) => sum + act.minutes, 0);
    const yesterdayActiveMinutes = yesterdayActivities.reduce((sum, act) => sum + act.minutes, 0);
    
    const activeMinutesChange = yesterdayActiveMinutes === 0 ? 0 :
      Math.round(((todayActiveMinutes - yesterdayActiveMinutes) / yesterdayActiveMinutes) * 100);
    
    // Calorias hoje
    const todayCalories = todayActivities.reduce((sum, act) => sum + act.calories, 0);
    const caloriesGoal = 1750; // Meta diária de calorias
    const remainingCalories = Math.max(0, caloriesGoal - todayCalories);
    
    // Dados de sono (mock)
    const sleepHours = 7.5;
    const sleepChangeMinutes = 30;
    
    // Dados de ritmo cardíaco (mock)
    const avgHeartRate = 72;
    const heartRateStatus = 'normal';
    
    // Dados de hidratação (mock)
    const waterCurrent = 1300;
    const waterGoal = 2500;
    
    // Montar o objeto de resposta
    return {
      activeMinutes: {
        value: todayActiveMinutes,
        change: Math.abs(activeMinutesChange),
        trend: activeMinutesChange >= 0 ? 'up' : 'down'
      },
      calories: {
        value: todayCalories,
        remaining: remainingCalories,
        trend: 'down' // Considerando que queremos consumir as calorias
      },
      sleep: {
        value: sleepHours,
        change: sleepChangeMinutes,
        trend: 'up'
      },
      heartRate: {
        value: avgHeartRate,
        status: heartRateStatus,
        trend: 'down'
      },
      weeklyActivity: {
        days: weeklyActivityData
      },
      hydration: {
        current: waterCurrent,
        goal: waterGoal
      }
    };
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    // Criando explicitamente um objeto que corresponde à interface User
    const user: User = { 
      id,
      username: insertUser.username,
      email: insertUser.email,
      password: insertUser.password,
      name: insertUser.name || null,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(insertUser.username)}&background=random` || null, 
      createdAt: now 
    };
    this.users.set(id, user);
    return user;
  }
  
  // Medical exam methods
  async getMedicalExams(userId: number): Promise<MedicalExam[]> {
    return Array.from(this.medicalExams.values()).filter(
      (exam) => exam.userId === userId,
    );
  }
  
  async getMedicalExam(id: number): Promise<MedicalExam | undefined> {
    return this.medicalExams.get(id);
  }
  
  async createMedicalExam(exam: Omit<MedicalExam, 'id'>): Promise<MedicalExam> {
    const id = this.currentMedicalExamId++;
    const medicalExam: MedicalExam = { ...exam, id };
    this.medicalExams.set(id, medicalExam);
    return medicalExam;
  }
  
  // Activity methods
  async getActivities(userId: number): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter((activity) => activity.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async createActivity(activity: Omit<Activity, 'id'>): Promise<Activity> {
    const id = this.currentActivityId++;
    const newActivity: Activity = { ...activity, id };
    this.activities.set(id, newActivity);
    return newActivity;
  }
  
  async getActivityById(id: number): Promise<Activity | undefined> {
    return this.activities.get(id);
  }
  
  async getActivityByDate(userId: number, date: Date): Promise<Activity[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return Array.from(this.activities.values())
      .filter((activity) => {
        const activityDate = new Date(activity.date);
        return activity.userId === userId &&
               activityDate >= startOfDay &&
               activityDate <= endOfDay;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
  
  async getActivityStats(userId: number, startDate: Date, endDate: Date): Promise<any> {
    const activities = Array.from(this.activities.values())
      .filter((activity) => {
        const activityDate = new Date(activity.date);
        return activity.userId === userId &&
               activityDate >= startDate &&
               activityDate <= endDate;
      });
    
    // Calcular estatísticas
    let totalSteps = 0;
    let totalCalories = 0;
    let totalDistance = 0;
    let totalDuration = 0;
    const activityTypes: Record<string, number> = {};
    
    activities.forEach(activity => {
      totalSteps += activity.steps || 0;
      totalCalories += activity.calories || 0;
      totalDistance += activity.distance || 0;
      totalDuration += activity.minutes || 0;
      
      const type = activity.activityType || 'unknown';
      activityTypes[type] = (activityTypes[type] || 0) + 1;
    });
    
    // Estatísticas diárias
    const dailyStats: Record<string, any> = {};
    activities.forEach(activity => {
      const dateStr = new Date(activity.date).toISOString().split('T')[0];
      if (!dailyStats[dateStr]) {
        dailyStats[dateStr] = {
          steps: 0,
          calories: 0,
          distance: 0,
          duration: 0
        };
      }
      
      dailyStats[dateStr].steps += activity.steps || 0;
      dailyStats[dateStr].calories += activity.calories || 0;
      dailyStats[dateStr].distance += activity.distance || 0;
      dailyStats[dateStr].duration += activity.minutes || 0;
    });
    
    return {
      summary: {
        totalActivities: activities.length,
        totalSteps,
        totalCalories,
        totalDistance,
        totalDuration,
        activityTypes
      },
      dailyStats
    };
  }
  
  // Sleep methods
  async getSleepRecords(userId: number): Promise<SleepRecord[]> {
    return Array.from(this.sleepRecords.values())
      .filter((record) => record.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async createSleepRecord(sleepRecord: Omit<SleepRecord, 'id'>): Promise<SleepRecord> {
    const id = this.currentSleepRecordId++;
    const newSleepRecord: SleepRecord = { ...sleepRecord, id };
    this.sleepRecords.set(id, newSleepRecord);
    return newSleepRecord;
  }
  
  async getSleepRecordById(id: number): Promise<SleepRecord | undefined> {
    return this.sleepRecords.get(id);
  }
  
  async getSleepRecordsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<SleepRecord[]> {
    return Array.from(this.sleepRecords.values())
      .filter((record) => {
        const recordDate = new Date(record.date);
        return record.userId === userId &&
               recordDate >= startDate &&
               recordDate <= endDate;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
  
  async getSleepStats(userId: number, startDate: Date, endDate: Date): Promise<any> {
    const sleepRecords = await this.getSleepRecordsByDateRange(userId, startDate, endDate);
    
    if (sleepRecords.length === 0) {
      return {
        totalRecords: 0,
        averageHours: 0,
        averageQuality: null,
        sleepStageAverage: {
          deep: 0,
          light: 0,
          rem: 0,
          awake: 0
        },
        dailyStats: {}
      };
    }
    
    let totalHours = 0;
    let totalDeepSleep = 0;
    let totalLightSleep = 0;
    let totalRem = 0;
    let totalAwake = 0;
    
    const qualityCount: Record<string, number> = {};
    const dailyStats: Record<string, any> = {};
    
    sleepRecords.forEach(record => {
      totalHours += record.hours || 0;
      totalDeepSleep += record.deepSleep || 0;
      totalLightSleep += record.lightSleep || 0;
      totalRem += record.rem || 0;
      totalAwake += record.awakeTime || 0;
      
      const quality = record.quality || 'unknown';
      qualityCount[quality] = (qualityCount[quality] || 0) + 1;
      
      const dateStr = new Date(record.date).toISOString().split('T')[0];
      dailyStats[dateStr] = {
        hours: record.hours,
        quality: record.quality,
        deepSleep: record.deepSleep,
        lightSleep: record.lightSleep,
        rem: record.rem,
        awakeTime: record.awakeTime,
        bedTime: record.bedTime,
        wakeTime: record.wakeTime
      };
    });
    
    // Calcular qualidade média
    let mostCommonQuality = 'unknown';
    let maxCount = 0;
    Object.entries(qualityCount).forEach(([quality, count]) => {
      if (count > maxCount) {
        mostCommonQuality = quality;
        maxCount = count;
      }
    });
    
    return {
      totalRecords: sleepRecords.length,
      averageHours: totalHours / sleepRecords.length,
      averageQuality: mostCommonQuality,
      sleepStageAverage: {
        deep: totalDeepSleep / sleepRecords.length,
        light: totalLightSleep / sleepRecords.length,
        rem: totalRem / sleepRecords.length,
        awake: totalAwake / sleepRecords.length
      },
      dailyStats
    };
  }
  
  // Water intake methods
  async getWaterIntake(userId: number): Promise<WaterIntakeRecord[]> {
    return Array.from(this.waterIntakeRecords.values())
      .filter((record) => record.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async createWaterIntake(waterIntakeRecord: Omit<WaterIntakeRecord, 'id'>): Promise<WaterIntakeRecord> {
    const id = this.currentWaterIntakeId++;
    const newWaterIntakeRecord: WaterIntakeRecord = { ...waterIntakeRecord, id };
    this.waterIntakeRecords.set(id, newWaterIntakeRecord);
    return newWaterIntakeRecord;
  }
  
  async getWaterIntakeByDate(userId: number, date: Date): Promise<WaterIntakeRecord[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return Array.from(this.waterIntakeRecords.values())
      .filter((record) => {
        const recordDate = new Date(record.date);
        return record.userId === userId &&
               recordDate >= startOfDay &&
               recordDate <= endOfDay;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
  
  async getWaterIntakeStats(userId: number, startDate: Date, endDate: Date): Promise<any> {
    const waterRecords = Array.from(this.waterIntakeRecords.values())
      .filter((record) => {
        const recordDate = new Date(record.date);
        return record.userId === userId &&
               recordDate >= startDate &&
               recordDate <= endDate;
      });
    
    if (waterRecords.length === 0) {
      return {
        totalRecords: 0,
        totalIntake: 0,
        averageIntake: 0,
        unitDistribution: {},
        dailyStats: {}
      };
    }
    
    let totalIntake = 0;
    const unitDistribution: Record<string, number> = {};
    const dailyStats: Record<string, any> = {};
    
    waterRecords.forEach(record => {
      totalIntake += record.amount || 0;
      
      const unit = record.unit || 'ml';
      unitDistribution[unit] = (unitDistribution[unit] || 0) + (record.amount || 0);
      
      const dateStr = new Date(record.date).toISOString().split('T')[0];
      if (!dailyStats[dateStr]) {
        dailyStats[dateStr] = {
          totalAmount: 0,
          count: 0,
          details: []
        };
      }
      
      dailyStats[dateStr].totalAmount += record.amount || 0;
      dailyStats[dateStr].count += 1;
      dailyStats[dateStr].details.push({
        id: record.id,
        time: record.time,
        amount: record.amount,
        unit: record.unit,
        containerType: record.containerType
      });
    });
    
    // Calcular médias diárias
    Object.keys(dailyStats).forEach(dateStr => {
      dailyStats[dateStr].averageAmount = dailyStats[dateStr].totalAmount / dailyStats[dateStr].count;
    });
    
    const daysCount = Object.keys(dailyStats).length;
    
    return {
      totalRecords: waterRecords.length,
      totalIntake,
      averageIntake: daysCount > 0 ? totalIntake / daysCount : 0,
      unitDistribution,
      dailyStats
    };
  }
  
  // Meal methods
  async getMeals(userId: number): Promise<Meal[]> {
    return Array.from(this.mealRecords.values())
      .filter((record) => record.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async createMeal(meal: Omit<Meal, 'id'>): Promise<Meal> {
    const id = this.currentMealId++;
    const newMeal: Meal = { ...meal, id };
    this.mealRecords.set(id, newMeal);
    return newMeal;
  }
  
  async getMealById(id: number): Promise<Meal | undefined> {
    return this.mealRecords.get(id);
  }
  
  async getMealsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<Meal[]> {
    return Array.from(this.mealRecords.values())
      .filter((record) => {
        const recordDate = new Date(record.date);
        return record.userId === userId &&
               recordDate >= startDate &&
               recordDate <= endDate;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
  
  async getNutritionStats(userId: number, startDate: Date, endDate: Date): Promise<any> {
    const meals = await this.getMealsByDateRange(userId, startDate, endDate);
    
    if (meals.length === 0) {
      return {
        totalMeals: 0,
        nutritionSummary: {
          calories: 0,
          carbs: 0,
          protein: 0,
          fat: 0,
          fiber: 0,
          sugar: 0
        },
        mealTypeCounts: {},
        dailyStats: {}
      };
    }
    
    let totalCalories = 0;
    let totalCarbs = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalFiber = 0;
    let totalSugar = 0;
    
    const mealTypeCounts: Record<string, number> = {};
    const dailyStats: Record<string, any> = {};
    const moodAfterEating: Record<string, number> = {};
    
    meals.forEach(meal => {
      totalCalories += meal.calories || 0;
      totalCarbs += meal.carbs || 0;
      totalProtein += meal.protein || 0;
      totalFat += meal.fat || 0;
      totalFiber += meal.fiber || 0;
      totalSugar += meal.sugar || 0;
      
      const mealType = meal.mealType || 'unknown';
      mealTypeCounts[mealType] = (mealTypeCounts[mealType] || 0) + 1;
      
      if (meal.moodAfterEating) {
        moodAfterEating[meal.moodAfterEating] = (moodAfterEating[meal.moodAfterEating] || 0) + 1;
      }
      
      const dateStr = new Date(meal.date).toISOString().split('T')[0];
      if (!dailyStats[dateStr]) {
        dailyStats[dateStr] = {
          totalCalories: 0,
          meals: []
        };
      }
      
      dailyStats[dateStr].totalCalories += meal.calories || 0;
      dailyStats[dateStr].meals.push({
        id: meal.id,
        mealType: meal.mealType,
        description: meal.description,
        calories: meal.calories,
        carbs: meal.carbs,
        protein: meal.protein,
        fat: meal.fat,
        time: meal.time
      });
    });
    
    // Calcular macronutrientes em porcentagens
    const totalMacros = totalCarbs + totalProtein + totalFat;
    const carbsPercentage = totalMacros > 0 ? (totalCarbs / totalMacros) * 100 : 0;
    const proteinPercentage = totalMacros > 0 ? (totalProtein / totalMacros) * 100 : 0;
    const fatPercentage = totalMacros > 0 ? (totalFat / totalMacros) * 100 : 0;
    
    // Determinar o humor mais comum após comer
    let mostCommonMood = null;
    let maxMoodCount = 0;
    Object.entries(moodAfterEating).forEach(([mood, count]) => {
      if (count > maxMoodCount) {
        mostCommonMood = mood;
        maxMoodCount = count;
      }
    });
    
    return {
      totalMeals: meals.length,
      nutritionSummary: {
        calories: totalCalories,
        carbs: totalCarbs,
        protein: totalProtein,
        fat: totalFat,
        fiber: totalFiber,
        sugar: totalSugar
      },
      macroPercentages: {
        carbs: carbsPercentage,
        protein: proteinPercentage,
        fat: fatPercentage
      },
      mealTypeCounts,
      commonMood: mostCommonMood,
      dailyStats
    };
  }
  
  // Food item methods
  async getFoodItems(): Promise<FoodItem[]> {
    return Array.from(this.foodItems.values());
  }
  
  async getFoodItemsByCategory(category: string): Promise<FoodItem[]> {
    return Array.from(this.foodItems.values())
      .filter(item => item.category === category);
  }
  
  async getFoodItem(id: number): Promise<FoodItem | undefined> {
    return this.foodItems.get(id);
  }
  
  async createFoodItem(foodItem: Omit<FoodItem, 'id'>): Promise<FoodItem> {
    const id = this.currentFoodItemId++;
    const newFoodItem: FoodItem = { ...foodItem, id };
    this.foodItems.set(id, newFoodItem);
    return newFoodItem;
  }
  
  // Recipe methods
  async getRecipes(userId: number): Promise<Recipe[]> {
    return Array.from(this.recipes.values())
      .filter(recipe => recipe.userId === userId || recipe.userId === undefined);
  }
  
  async getRecipesByCategory(category: string): Promise<Recipe[]> {
    return Array.from(this.recipes.values())
      .filter(recipe => recipe.category === category);
  }
  
  async getRecipe(id: number): Promise<Recipe | undefined> {
    return this.recipes.get(id);
  }
  
  async createRecipe(recipe: Omit<Recipe, 'id'>): Promise<Recipe> {
    const id = this.currentRecipeId++;
    const newRecipe: Recipe = { ...recipe, id };
    this.recipes.set(id, newRecipe);
    return newRecipe;
  }
  
  // Stress level methods
  async getStressLevels(userId: number): Promise<StressLevel[]> {
    return Array.from(this.stressLevels.values())
      .filter(level => level.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async getStressLevelById(id: number): Promise<StressLevel | undefined> {
    return this.stressLevels.get(id);
  }
  
  async getStressLevelsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<StressLevel[]> {
    return Array.from(this.stressLevels.values())
      .filter(level => {
        const levelDate = new Date(level.date);
        return level.userId === userId &&
               levelDate >= startDate &&
               levelDate <= endDate;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
  
  async createStressLevel(stressLevel: Omit<StressLevel, 'id'>): Promise<StressLevel> {
    const id = this.currentStressLevelId++;
    const newStressLevel: StressLevel = { ...stressLevel, id };
    this.stressLevels.set(id, newStressLevel);
    return newStressLevel;
  }
  
  // Medication methods
  async getMedications(userId: number): Promise<Medication[]> {
    return Array.from(this.medications.values())
      .filter(medication => medication.userId === userId)
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }
  
  async getMedication(id: number): Promise<Medication | undefined> {
    return this.medications.get(id);
  }
  
  async createMedication(medication: Omit<Medication, 'id'>): Promise<Medication> {
    const id = this.currentMedicationId++;
    const newMedication: Medication = { ...medication, id };
    this.medications.set(id, newMedication);
    return newMedication;
  }
  
  async updateMedication(id: number, medication: Partial<Omit<Medication, 'id'>>): Promise<Medication> {
    const existingMedication = this.medications.get(id);
    
    if (!existingMedication) {
      throw new Error(`Medication with id ${id} not found`);
    }
    
    const updatedMedication: Medication = { ...existingMedication, ...medication };
    this.medications.set(id, updatedMedication);
    return updatedMedication;
  }
  
  // Medication log methods
  async getMedicationLogs(userId: number, medicationId?: number): Promise<MedicationLog[]> {
    return Array.from(this.medicationLogs.values())
      .filter(log => {
        if (medicationId) {
          return log.userId === userId && log.medicationId === medicationId;
        }
        return log.userId === userId;
      })
      .sort((a, b) => new Date(b.timeTaken).getTime() - new Date(a.timeTaken).getTime());
  }
  
  async getMedicationLogsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<MedicationLog[]> {
    return Array.from(this.medicationLogs.values())
      .filter(log => {
        const logDate = new Date(log.timeTaken);
        return log.userId === userId &&
               logDate >= startDate &&
               logDate <= endDate;
      })
      .sort((a, b) => new Date(a.timeTaken).getTime() - new Date(b.timeTaken).getTime());
  }
  
  async createMedicationLog(medicationLog: Omit<MedicationLog, 'id'>): Promise<MedicationLog> {
    const id = this.currentMedicationLogId++;
    const newMedicationLog: MedicationLog = { ...medicationLog, id };
    this.medicationLogs.set(id, newMedicationLog);
    return newMedicationLog;
  }
  
  // Meditation methods
  async getMeditationSessions(userId: number): Promise<MeditationSession[]> {
    return Array.from(this.meditationSessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async getMeditationSessionById(id: number): Promise<MeditationSession | undefined> {
    return this.meditationSessions.get(id);
  }
  
  async createMeditationSession(session: Omit<MeditationSession, 'id'>): Promise<MeditationSession> {
    const id = this.currentMeditationSessionId++;
    const newSession: MeditationSession = { ...session, id };
    this.meditationSessions.set(id, newSession);
    return newSession;
  }
  
  // Women's health methods - Menstrual Cycles
  async getMenstrualCycles(userId: number): Promise<MenstrualCycle[]> {
    return Array.from(this.menstrualCycles.values())
      .filter(cycle => cycle.userId === userId)
      .sort((a, b) => new Date(b.cycleStartDate).getTime() - new Date(a.cycleStartDate).getTime());
  }
  
  async getMenstrualCycleById(id: number): Promise<MenstrualCycle | undefined> {
    return this.menstrualCycles.get(id);
  }
  
  async createMenstrualCycle(cycle: Omit<MenstrualCycle, 'id'>): Promise<MenstrualCycle> {
    const id = this.currentMenstrualCycleId++;
    const newCycle: MenstrualCycle = { ...cycle, id };
    this.menstrualCycles.set(id, newCycle);
    return newCycle;
  }
  
  // Menstrual Cycle Symptoms
  async getMenstrualCycleSymptoms(userId: number): Promise<MenstrualCycleSymptom[]> {
    return Array.from(this.menstrualCycleSymptoms.values())
      .filter(symptom => symptom.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async getMenstrualCycleSymptomsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<MenstrualCycleSymptom[]> {
    return Array.from(this.menstrualCycleSymptoms.values())
      .filter(symptom => {
        const symptomDate = new Date(symptom.date);
        return symptom.userId === userId &&
               symptomDate >= startDate &&
               symptomDate <= endDate;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
  
  async createMenstrualCycleSymptom(symptom: Omit<MenstrualCycleSymptom, 'id'>): Promise<MenstrualCycleSymptom> {
    const id = this.currentMenstrualCycleSymptomId++;
    const newSymptom: MenstrualCycleSymptom = { ...symptom, id };
    this.menstrualCycleSymptoms.set(id, newSymptom);
    return newSymptom;
  }
  
  // Fertility tracking methods
  async getFertilityTracking(userId: number): Promise<FertilityTracking[]> {
    return Array.from(this.fertilityTrackings.values())
      .filter(tracking => tracking.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async getFertilityTrackingByDateRange(userId: number, startDate: Date, endDate: Date): Promise<FertilityTracking[]> {
    return Array.from(this.fertilityTrackings.values())
      .filter(tracking => {
        const trackingDate = new Date(tracking.date);
        return tracking.userId === userId &&
               trackingDate >= startDate &&
               trackingDate <= endDate;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
  
  async createFertilityTracking(tracking: Omit<FertilityTracking, 'id'>): Promise<FertilityTracking> {
    const id = this.currentFertilityTrackingId++;
    const newTracking: FertilityTracking = { ...tracking, id };
    this.fertilityTrackings.set(id, newTracking);
    return newTracking;
  }
  
  // Pregnancy tracking methods
  async getPregnancyTracking(userId: number): Promise<PregnancyTracking | undefined> {
    return Array.from(this.pregnancyTrackings.values())
      .find(tracking => tracking.userId === userId);
  }
  
  async createPregnancyTracking(tracking: Omit<PregnancyTracking, 'id'>): Promise<PregnancyTracking> {
    const id = this.currentPregnancyTrackingId++;
    const newTracking: PregnancyTracking = { ...tracking, id };
    this.pregnancyTrackings.set(id, newTracking);
    return newTracking;
  }
  
  async updatePregnancyTracking(id: number, tracking: Partial<Omit<PregnancyTracking, 'id'>>): Promise<PregnancyTracking> {
    const existingTracking = this.pregnancyTrackings.get(id);
    
    if (!existingTracking) {
      throw new Error(`Pregnancy tracking with id ${id} not found`);
    }
    
    const updatedTracking: PregnancyTracking = { ...existingTracking, ...tracking };
    this.pregnancyTrackings.set(id, updatedTracking);
    return updatedTracking;
  }
  
  // Video methods
  async getVideos(): Promise<Video[]> {
    return Array.from(this.videos.values());
  }
  
  async getVideo(id: number): Promise<Video | undefined> {
    return this.videos.get(id);
  }
  
  // Video progress methods
  async getVideoProgress(userId: number, videoId: number): Promise<VideoProgress | undefined> {
    return Array.from(this.videoProgressRecords.values()).find(
      (progress) => progress.userId === userId && progress.videoId === videoId,
    );
  }
  
  async createOrUpdateVideoProgress(progress: Omit<VideoProgress, 'id'>): Promise<VideoProgress> {
    const existingProgress = await this.getVideoProgress(progress.userId, progress.videoId);
    
    if (existingProgress) {
      const updatedProgress: VideoProgress = { ...existingProgress, ...progress };
      this.videoProgressRecords.set(existingProgress.id, updatedProgress);
      return updatedProgress;
    }
    
    const id = this.currentVideoProgressId++;
    const newProgress: VideoProgress = { ...progress, id };
    this.videoProgressRecords.set(id, newProgress);
    return newProgress;
  }
  
  // Course track methods
  async getCourseTracks(): Promise<CourseTrack[]> {
    return Array.from(this.courseTracks.values());
  }
  
  async getCourseTrack(id: number): Promise<CourseTrack | undefined> {
    return this.courseTracks.get(id);
  }
  
  // Track video methods
  async getTrackVideos(trackId: number): Promise<TrackVideo[]> {
    return Array.from(this.trackVideos.values())
      .filter((trackVideo) => trackVideo.trackId === trackId)
      .sort((a, b) => a.order - b.order);
  }
}

export const storage = new MemStorage();
