// Repository Interface - User (following Interface Segregation Principle)
import { User } from '../entities/User';

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(userData: Omit<User, 'id' | 'createdAt'>): Promise<User>;
  update(id: number, userData: Partial<User>): Promise<User | null>;
  updateStripeCustomerId(id: number, stripeCustomerId: string): Promise<User | null>;
  updateSubscriptionInfo(id: number, subscriptionData: {
    stripeSubscriptionId: string;
    subscriptionStatus: string;
    subscriptionEndDate?: Date;
  }): Promise<User | null>;
  delete(id: number): Promise<boolean>;
}