// Infrastructure Repository - Activity (Frontend)
import { Activity } from '../../domain/entities/Activity';
import { IActivityRepository } from '../../domain/interfaces/IActivityRepository';
import { apiRequest } from '../../lib/queryClient';

export class ActivityRepository implements IActivityRepository {
  async getActivities(): Promise<Activity[]> {
    try {
      const response = await apiRequest('GET', '/api/activities');
      if (!response.ok) {
        throw new Error('Failed to get activities');
      }
      const data = await response.json();
      return data.map((activity: any) => Activity.fromApiResponse(activity));
    } catch (error) {
      console.error('Error getting activities:', error);
      throw error;
    }
  }

  async getActivity(id: number): Promise<Activity | null> {
    try {
      const response = await apiRequest('GET', `/api/activities/${id}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to get activity');
      }
      const data = await response.json();
      return Activity.fromApiResponse(data);
    } catch (error) {
      console.error('Error getting activity:', error);
      throw error;
    }
  }

  async createActivity(activityData: Omit<Activity, 'id' | 'userId'>): Promise<Activity> {
    try {
      const payload = {
        activityType: activityData.type,
        name: activityData.name,
        minutes: activityData.duration,
        calories: activityData.calories,
        date: activityData.date.toISOString(),
        distance: activityData.distance ? Math.round(activityData.distance * 1000) : undefined, // Convert to meters
        steps: activityData.steps,
        heartRate: activityData.heartRate,
        notes: activityData.notes
      };

      const response = await apiRequest('POST', '/api/activities', payload);
      if (!response.ok) {
        throw new Error('Failed to create activity');
      }
      const data = await response.json();
      return Activity.fromApiResponse(data);
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  }

  async updateActivity(id: number, activityData: Partial<Activity>): Promise<Activity> {
    try {
      const payload: any = {};
      if (activityData.type) payload.activityType = activityData.type;
      if (activityData.name) payload.name = activityData.name;
      if (activityData.duration) payload.minutes = activityData.duration;
      if (activityData.calories) payload.calories = activityData.calories;
      if (activityData.date) payload.date = activityData.date.toISOString();
      if (activityData.distance) payload.distance = Math.round(activityData.distance * 1000);
      if (activityData.steps) payload.steps = activityData.steps;
      if (activityData.heartRate) payload.heartRate = activityData.heartRate;
      if (activityData.notes) payload.notes = activityData.notes;

      const response = await apiRequest('PATCH', `/api/activities/${id}`, payload);
      if (!response.ok) {
        throw new Error('Failed to update activity');
      }
      const data = await response.json();
      return Activity.fromApiResponse(data);
    } catch (error) {
      console.error('Error updating activity:', error);
      throw error;
    }
  }

  async deleteActivity(id: number): Promise<boolean> {
    try {
      const response = await apiRequest('DELETE', `/api/activities/${id}`);
      return response.ok;
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw error;
    }
  }

  async getActivityStats(dateRange?: { start: Date; end: Date }): Promise<{
    totalCalories: number;
    totalDuration: number;
    totalDistance: number;
    totalSteps: number;
    averageHeartRate: number;
  }> {
    try {
      let url = '/api/activities/stats';
      if (dateRange) {
        const params = new URLSearchParams({
          start: dateRange.start.toISOString(),
          end: dateRange.end.toISOString()
        });
        url += `?${params.toString()}`;
      }

      const response = await apiRequest('GET', url);
      if (!response.ok) {
        throw new Error('Failed to get activity stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting activity stats:', error);
      throw error;
    }
  }
}