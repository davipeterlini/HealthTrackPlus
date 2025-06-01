// Custom Hook - Dashboard (following Clean Architecture)
import { useQuery } from '@tanstack/react-query';
import { GetUserDashboardDataUseCase } from '../../application/use-cases/GetUserDashboardDataUseCase';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { ActivityRepository } from '../../infrastructure/repositories/ActivityRepository';
import { MedicalExamRepository } from '../../infrastructure/repositories/MedicalExamRepository';

// Singleton pattern for use case instance
let dashboardUseCaseInstance: GetUserDashboardDataUseCase | null = null;

const getDashboardUseCase = (): GetUserDashboardDataUseCase => {
  if (!dashboardUseCaseInstance) {
    const userRepository = new UserRepository();
    const activityRepository = new ActivityRepository();
    const medicalExamRepository = new MedicalExamRepository();
    
    dashboardUseCaseInstance = new GetUserDashboardDataUseCase(
      userRepository,
      activityRepository,
      medicalExamRepository
    );
  }
  return dashboardUseCaseInstance;
};

export const useDashboard = () => {
  const dashboardUseCase = getDashboardUseCase();

  const dashboardQuery = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardUseCase.execute(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 2
  });

  // Derived computed properties for UI
  const hasRecentActivity = (dashboardQuery.data?.recentActivities.length || 0) > 0;
  const hasExamsNeedingAttention = (dashboardQuery.data?.examsNeedingAttention.length || 0) > 0;
  const hasAchievements = (dashboardQuery.data?.achievements.length || 0) > 0;
  
  const weeklyGoalProgress = dashboardQuery.data?.activityStats 
    ? Math.min((dashboardQuery.data.activityStats.activeDays / 5) * 100, 100)
    : 0;

  const calorieGoalProgress = dashboardQuery.data?.activityStats
    ? Math.min((dashboardQuery.data.activityStats.totalCalories / 2000) * 100, 100)
    : 0;

  return {
    // Data
    data: dashboardQuery.data,
    user: dashboardQuery.data?.user,
    recentActivities: dashboardQuery.data?.recentActivities || [],
    activityStats: dashboardQuery.data?.activityStats,
    recentExams: dashboardQuery.data?.recentExams || [],
    examsNeedingAttention: dashboardQuery.data?.examsNeedingAttention || [],
    achievements: dashboardQuery.data?.achievements || [],
    
    // Loading and error states
    isLoading: dashboardQuery.isLoading,
    error: dashboardQuery.error,
    isError: dashboardQuery.isError,
    
    // Computed properties for UI
    hasRecentActivity,
    hasExamsNeedingAttention,
    hasAchievements,
    weeklyGoalProgress,
    calorieGoalProgress,
    
    // Actions
    refetch: dashboardQuery.refetch,
    
    // Quick access to common UI data
    getUserGreeting: () => {
      const user = dashboardQuery.data?.user;
      if (!user) return 'Olá!';
      
      const hour = new Date().getHours();
      let greeting = 'Olá';
      
      if (hour < 12) greeting = 'Bom dia';
      else if (hour < 18) greeting = 'Boa tarde';
      else greeting = 'Boa noite';
      
      return `${greeting}, ${user.getDisplayName()}!`;
    },
    
    getActivitySummary: () => {
      const stats = dashboardQuery.data?.activityStats;
      if (!stats) return 'Nenhuma atividade esta semana';
      
      if (stats.activeDays === 0) return 'Comece sua primeira atividade hoje!';
      if (stats.activeDays === 1) return '1 dia ativo esta semana';
      return `${stats.activeDays} dias ativos esta semana`;
    },
    
    getHealthStatus: () => {
      const examsNeedingAttention = dashboardQuery.data?.examsNeedingAttention || [];
      
      if (examsNeedingAttention.length === 0) {
        return {
          status: 'good',
          message: 'Saúde em dia',
          color: 'text-green-600'
        };
      }
      
      return {
        status: 'attention',
        message: `${examsNeedingAttention.length} exame(s) precisam de atenção`,
        color: 'text-yellow-600'
      };
    }
  };
};