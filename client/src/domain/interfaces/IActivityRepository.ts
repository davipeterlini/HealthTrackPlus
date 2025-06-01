// Repository Interface - Activity (Frontend)
import { Activity } from '../entities/Activity';

export interface IActivityRepository {
  getActivities(): Promise<Activity[]>;
  getActivity(id: number): Promise<Activity | null>;
  createActivity(activityData: Omit<Activity, 'id' | 'userId'>): Promise<Activity>;
  updateActivity(id: number, activityData: Partial<Activity>): Promise<Activity>;
  deleteActivity(id: number): Promise<boolean>;
  getActivityStats(dateRange?: { start: Date; end: Date }): Promise<{
    totalCalories: number;
    totalDuration: number;
    totalDistance: number;
    totalSteps: number;
    averageHeartRate: number;
  }>;
}