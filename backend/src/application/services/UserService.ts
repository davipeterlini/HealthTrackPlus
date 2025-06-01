// Application Service - User Management (following Single Responsibility Principle)
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';

export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async getUserById(id: number): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findByUsername(username);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async createUser(userData: {
    username: string;
    email: string;
    name?: string;
    avatar?: string;
  }): Promise<User> {
    // Business rule: Validate uniqueness
    const existingUser = await this.userRepository.findByUsername(userData.username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const existingEmail = await this.userRepository.findByEmail(userData.email);
    if (existingEmail) {
      throw new Error('Email already exists');
    }

    const newUser = User.create(
      userData.username,
      userData.email,
      userData.name,
      userData.avatar
    );

    return await this.userRepository.create(newUser);
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
    return await this.userRepository.update(id, userData);
  }

  async updateStripeCustomerId(id: number, stripeCustomerId: string): Promise<User | null> {
    return await this.userRepository.updateStripeCustomerId(id, stripeCustomerId);
  }

  async updateSubscriptionInfo(id: number, subscriptionData: {
    stripeSubscriptionId: string;
    subscriptionStatus: string;
    subscriptionEndDate?: Date;
  }): Promise<User | null> {
    return await this.userRepository.updateSubscriptionInfo(id, subscriptionData);
  }

  async deleteUser(id: number): Promise<boolean> {
    return await this.userRepository.delete(id);
  }

  // Business logic methods
  async canUserAccessPremiumFeatures(userId: number): Promise<boolean> {
    const user = await this.getUserById(userId);
    return user ? user.canAccessPremiumFeatures() : false;
  }

  async getUserSubscriptionStatus(userId: number): Promise<string> {
    const user = await this.getUserById(userId);
    return user ? user.subscriptionStatus : 'inactive';
  }
}