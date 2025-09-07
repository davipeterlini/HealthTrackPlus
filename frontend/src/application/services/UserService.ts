// Application Service - User Management (Frontend)
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';

export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async getCurrentUser(): Promise<User | null> {
    return await this.userRepository.getCurrentUser();
  }

  async updateUserProfile(userData: {
    name?: string;
    avatar?: string;
  }): Promise<User> {
    return await this.userRepository.updateUser(userData);
  }

  async updateSubscription(subscriptionData: {
    stripeSubscriptionId: string;
    subscriptionStatus: string;
    subscriptionEndDate?: Date;
  }): Promise<User> {
    return await this.userRepository.updateSubscription(subscriptionData);
  }

  async getSubscriptionStatus(): Promise<{
    subscriptionStatus: string;
    canAccessPremiumFeatures: boolean;
  }> {
    return await this.userRepository.getSubscriptionStatus();
  }

  // Business logic methods
  async checkPremiumAccess(): Promise<boolean> {
    const status = await this.getSubscriptionStatus();
    return status.canAccessPremiumFeatures;
  }

  async getUserDisplayInfo(): Promise<{
    displayName: string;
    initials: string;
    avatarUrl: string | null;
    subscriptionBadge: {
      text: string;
      color: string;
    };
  } | null> {
    const user = await this.getCurrentUser();
    if (!user) return null;

    return {
      displayName: user.getDisplayName(),
      initials: user.getInitials(),
      avatarUrl: user.getAvatarUrl(),
      subscriptionBadge: {
        text: user.getSubscriptionStatusDisplay(),
        color: user.getSubscriptionBadgeColor()
      }
    };
  }
}