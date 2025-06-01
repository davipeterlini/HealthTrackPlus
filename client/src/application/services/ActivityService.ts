// Application Service - Activity Management (Frontend)
import { Activity } from '../../domain/entities/Activity';
import { IActivityRepository } from '../../domain/interfaces/IActivityRepository';

export class ActivityService {
  constructor(private readonly activityRepository: IActivityRepository) {}

  async getActivities(): Promise<Activity[]> {
    const activities = await this.activityRepository.getActivities();
    // Sort by date descending (most recent first)
    return activities.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async getActivity(id: number): Promise<Activity | null> {
    return await this.activityRepository.getActivity(id);
  }

  async createActivity(activityData: {
    type: string;
    name: string;
    duration: number;
    calories: number;
    date: Date;
    distance?: number;
    steps?: number;
    heartRate?: number;
    notes?: string;
  }): Promise<Activity> {
    // Business validation
    if (activityData.duration <= 0) {
      throw new Error('Duration must be greater than 0');
    }
    if (activityData.calories < 0) {
      throw new Error('Calories cannot be negative');
    }

    // Create a proper activity object for the repository
    const activityForRepo = {
      type: activityData.type,
      name: activityData.name,
      duration: activityData.duration,
      calories: activityData.calories,
      date: activityData.date,
      distance: activityData.distance,
      steps: activityData.steps,
      heartRate: activityData.heartRate,
      notes: activityData.notes
    } as Omit<Activity, 'id' | 'userId'>;

    return await this.activityRepository.createActivity(activityForRepo);
  }

  async updateActivity(id: number, activityData: Partial<Activity>): Promise<Activity> {
    // Business validation
    if (activityData.duration !== undefined && activityData.duration <= 0) {
      throw new Error('Duration must be greater than 0');
    }
    if (activityData.calories !== undefined && activityData.calories < 0) {
      throw new Error('Calories cannot be negative');
    }

    return await this.activityRepository.updateActivity(id, activityData);
  }

  async deleteActivity(id: number): Promise<boolean> {
    return await this.activityRepository.deleteActivity(id);
  }

  async getActivityStats(dateRange?: { start: Date; end: Date }): Promise<{
    totalCalories: number;
    totalDuration: number;
    totalDistance: number;
    totalSteps: number;
    averageHeartRate: number;
  }> {
    return await this.activityRepository.getActivityStats(dateRange);
  }

  // Business logic methods for UI
  async getWeeklyStats(): Promise<{
    totalCalories: number;
    totalDuration: number;
    totalDistance: number;
    averageIntensity: string;
    activeDays: number;
  }> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);

    const activities = await this.getActivities();
    const weekActivities = activities.filter(
      activity => activity.date >= startDate && activity.date <= endDate
    );

    const totalCalories = weekActivities.reduce((sum, activity) => sum + activity.calories, 0);
    const totalDuration = weekActivities.reduce((sum, activity) => sum + activity.duration, 0);
    const totalDistance = weekActivities.reduce((sum, activity) => sum + (activity.distance || 0), 0);
    
    const activeDays = new Set(
      weekActivities.map(activity => activity.date.toDateString())
    ).size;

    // Calculate average intensity
    const intensities = weekActivities.map(activity => activity.getIntensityLevel());
    const highCount = intensities.filter(i => i === 'high').length;
    const moderateCount = intensities.filter(i => i === 'moderate').length;
    
    let averageIntensity = 'low';
    if (highCount > weekActivities.length / 2) averageIntensity = 'high';
    else if (moderateCount + highCount > weekActivities.length / 2) averageIntensity = 'moderate';

    return {
      totalCalories,
      totalDuration,
      totalDistance,
      averageIntensity,
      activeDays
    };
  }

  async getActivityTypeDistribution(): Promise<{ type: string; count: number; percentage: number }[]> {
    const activities = await this.getActivities();
    const typeCount = new Map<string, number>();

    activities.forEach(activity => {
      const count = typeCount.get(activity.type) || 0;
      typeCount.set(activity.type, count + 1);
    });

    const total = activities.length;
    return Array.from(typeCount.entries()).map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / total) * 100)
    }));
  }

  async getRecentAchievements(): Promise<{
    type: string;
    description: string;
    date: Date;
  }[]> {
    const activities = await this.getActivities();
    const achievements: { type: string; description: string; date: Date }[] = [];

    // Check for achievements in recent activities
    activities.slice(0, 10).forEach(activity => {
      if (activity.isLongDuration()) {
        achievements.push({
          type: 'endurance',
          description: `Atividade de longa duração: ${activity.getDurationDisplay()}`,
          date: activity.date
        });
      }
      
      if (activity.isHighIntensity()) {
        achievements.push({
          type: 'intensity',
          description: `Alta intensidade alcançada em ${activity.name}`,
          date: activity.date
        });
      }

      if (activity.distance && activity.distance > 10) {
        achievements.push({
          type: 'distance',
          description: `Longa distância: ${activity.getDistanceDisplay()}`,
          date: activity.date
        });
      }
    });

    return achievements.slice(0, 5); // Return top 5 recent achievements
  }
}