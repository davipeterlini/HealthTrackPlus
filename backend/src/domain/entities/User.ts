// Domain Entity - User
export class User {
  constructor(
    public readonly id: number,
    public readonly username: string,
    public readonly email: string,
    public readonly name?: string,
    public readonly avatar?: string,
    public readonly stripeCustomerId?: string,
    public readonly stripeSubscriptionId?: string,
    public readonly subscriptionStatus: 'active' | 'inactive' | 'past_due' | 'canceled' | 'trialing' = 'inactive',
    public readonly subscriptionEndDate?: Date,
    public readonly createdAt: Date = new Date()
  ) {}

  // Business logic methods
  public hasActiveSubscription(): boolean {
    return this.subscriptionStatus === 'active' || this.subscriptionStatus === 'trialing';
  }

  public isSubscriptionExpired(): boolean {
    if (!this.subscriptionEndDate) return false;
    return new Date() > this.subscriptionEndDate;
  }

  public canAccessPremiumFeatures(): boolean {
    return this.hasActiveSubscription() && !this.isSubscriptionExpired();
  }

  public getDisplayName(): string {
    return this.name || this.username;
  }

  // Factory method for creating new user
  public static create(
    username: string,
    email: string,
    name?: string,
    avatar?: string
  ): Omit<User, 'id' | 'createdAt'> {
    return {
      username,
      email,
      name,
      avatar,
      stripeCustomerId: undefined,
      stripeSubscriptionId: undefined,
      subscriptionStatus: 'inactive',
      subscriptionEndDate: undefined,
      hasActiveSubscription: () => false,
      isSubscriptionExpired: () => false,
      canAccessPremiumFeatures: () => false,
      getDisplayName: () => name || username
    };
  }
}