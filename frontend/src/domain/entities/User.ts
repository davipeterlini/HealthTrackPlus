// Domain Entity - User (Frontend)
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

  // Business logic methods for UI
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

  public getInitials(): string {
    const displayName = this.getDisplayName();
    return displayName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }

  public getAvatarUrl(): string | null {
    return this.avatar || null;
  }

  public getSubscriptionStatusDisplay(): string {
    switch (this.subscriptionStatus) {
      case 'active': return 'Ativo';
      case 'trialing': return 'Período de Teste';
      case 'past_due': return 'Pagamento Pendente';
      case 'canceled': return 'Cancelado';
      default: return 'Inativo';
    }
  }

  public getSubscriptionBadgeColor(): string {
    switch (this.subscriptionStatus) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'trialing': return 'bg-blue-100 text-blue-800';
      case 'past_due': return 'bg-yellow-100 text-yellow-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  // Factory method for creating from API response
  public static fromApiResponse(data: any): User {
    return new User(
      data.id,
      data.username,
      data.email,
      data.name,
      data.avatar,
      data.stripeCustomerId,
      data.stripeSubscriptionId,
      data.subscriptionStatus,
      data.subscriptionEndDate ? new Date(data.subscriptionEndDate) : undefined,
      data.createdAt ? new Date(data.createdAt) : new Date()
    );
  }
}