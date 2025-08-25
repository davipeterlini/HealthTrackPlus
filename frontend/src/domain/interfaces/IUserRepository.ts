// Repository Interface - User (Frontend)
import { User } from '../entities/User';

export interface IUserRepository {
  getCurrentUser(): Promise<User | null>;
  updateUser(userData: Partial<User>): Promise<User>;
  updateSubscription(subscriptionData: {
    stripeSubscriptionId: string;
    subscriptionStatus: string;
    subscriptionEndDate?: Date;
  }): Promise<User>;
  getSubscriptionStatus(): Promise<{
    subscriptionStatus: string;
    canAccessPremiumFeatures: boolean;
  }>;
}