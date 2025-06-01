// Infrastructure Repository - User (Frontend)
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { apiRequest } from '../../lib/queryClient';

export class UserRepository implements IUserRepository {
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiRequest('GET', '/api/user');
      if (!response.ok) {
        if (response.status === 401) return null;
        throw new Error('Failed to get current user');
      }
      const data = await response.json();
      return User.fromApiResponse(data);
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async updateUser(userData: Partial<User>): Promise<User> {
    try {
      const response = await apiRequest('PATCH', '/api/user', userData);
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      const data = await response.json();
      return User.fromApiResponse(data);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async updateSubscription(subscriptionData: {
    stripeSubscriptionId: string;
    subscriptionStatus: string;
    subscriptionEndDate?: Date;
  }): Promise<User> {
    try {
      const response = await apiRequest('PATCH', '/api/user/subscription', subscriptionData);
      if (!response.ok) {
        throw new Error('Failed to update subscription');
      }
      const data = await response.json();
      return User.fromApiResponse(data);
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  async getSubscriptionStatus(): Promise<{
    subscriptionStatus: string;
    canAccessPremiumFeatures: boolean;
  }> {
    try {
      const response = await apiRequest('GET', '/api/user/subscription-status');
      if (!response.ok) {
        throw new Error('Failed to get subscription status');
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting subscription status:', error);
      throw error;
    }
  }
}