// Custom Hook - Activity Service (following Clean Architecture)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Activity } from '../../domain/entities/Activity';
import { ActivityService } from '../../application/services/ActivityService';
import { ActivityRepository } from '../../infrastructure/repositories/ActivityRepository';

// Singleton pattern for service instance
let activityServiceInstance: ActivityService | null = null;

const getActivityService = (): ActivityService => {
  if (!activityServiceInstance) {
    const activityRepository = new ActivityRepository();
    activityServiceInstance = new ActivityService(activityRepository);
  }
  return activityServiceInstance;
};

export const useActivityService = () => {
  const queryClient = useQueryClient();
  const activityService = getActivityService();

  // Get all activities query
  const activitiesQuery = useQuery({
    queryKey: ['activities'],
    queryFn: () => activityService.getActivities(),
    staleTime: 2 * 60 * 1000 // 2 minutes
  });

  // Get activity stats query
  const statsQuery = useQuery({
    queryKey: ['activities', 'stats'],
    queryFn: () => activityService.getActivityStats(),
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // Get weekly stats query
  const weeklyStatsQuery = useQuery({
    queryKey: ['activities', 'weekly-stats'],
    queryFn: () => activityService.getWeeklyStats(),
    staleTime: 5 * 60 * 1000
  });

  // Get activity type distribution
  const typeDistributionQuery = useQuery({
    queryKey: ['activities', 'type-distribution'],
    queryFn: () => activityService.getActivityTypeDistribution(),
    enabled: !!activitiesQuery.data && activitiesQuery.data.length > 0,
    staleTime: 10 * 60 * 1000 // 10 minutes
  });

  // Get recent achievements
  const achievementsQuery = useQuery({
    queryKey: ['activities', 'achievements'],
    queryFn: () => activityService.getRecentAchievements(),
    enabled: !!activitiesQuery.data && activitiesQuery.data.length > 0,
    staleTime: 5 * 60 * 1000
  });

  // Create activity mutation
  const createActivityMutation = useMutation({
    mutationFn: (activityData: {
      type: string;
      name: string;
      duration: number;
      calories: number;
      date: Date;
      distance?: number;
      steps?: number;
      heartRate?: number;
      notes?: string;
    }) => activityService.createActivity(activityData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    }
  });

  // Update activity mutation
  const updateActivityMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Activity> }) =>
      activityService.updateActivity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    }
  });

  // Delete activity mutation
  const deleteActivityMutation = useMutation({
    mutationFn: (id: number) => activityService.deleteActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    }
  });

  // Get specific activity
  const getActivity = (id: number) => {
    return useQuery({
      queryKey: ['activities', id],
      queryFn: () => activityService.getActivity(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000
    });
  };

  return {
    // Data
    activities: activitiesQuery.data || [],
    stats: statsQuery.data,
    weeklyStats: weeklyStatsQuery.data,
    typeDistribution: typeDistributionQuery.data || [],
    achievements: achievementsQuery.data || [],
    
    // Loading states
    isLoading: activitiesQuery.isLoading,
    isStatsLoading: statsQuery.isLoading,
    isWeeklyStatsLoading: weeklyStatsQuery.isLoading,
    
    // Error states
    error: activitiesQuery.error,
    statsError: statsQuery.error,
    
    // Actions
    createActivity: createActivityMutation.mutate,
    updateActivity: updateActivityMutation.mutate,
    deleteActivity: deleteActivityMutation.mutate,
    
    // Mutation states
    isCreating: createActivityMutation.isPending,
    isUpdating: updateActivityMutation.isPending,
    isDeleting: deleteActivityMutation.isPending,
    
    // Helper functions
    getActivity,
    refetchActivities: activitiesQuery.refetch,
    refetchStats: statsQuery.refetch
  };
};