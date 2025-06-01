// Domain Entity - Health Insight
export class HealthInsight {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly date: Date,
    public readonly category: string,
    public readonly title: string,
    public readonly description: string,
    public readonly recommendation: string,
    public readonly severity: 'normal' | 'attention' | 'high',
    public readonly status: 'active' | 'dismissed' | 'resolved',
    public readonly aiGenerated: boolean = false,
    public readonly examId?: number,
    public readonly data?: string
  ) {}

  // Business logic methods
  public isActive(): boolean {
    return this.status === 'active';
  }

  public requiresAttention(): boolean {
    return this.severity === 'attention' || this.severity === 'high';
  }

  public isHighPriority(): boolean {
    return this.severity === 'high';
  }

  public isAIGenerated(): boolean {
    return this.aiGenerated;
  }

  public dismiss(): HealthInsight {
    return new HealthInsight(
      this.id,
      this.userId,
      this.date,
      this.category,
      this.title,
      this.description,
      this.recommendation,
      this.severity,
      'dismissed',
      this.aiGenerated,
      this.examId,
      this.data
    );
  }

  public resolve(): HealthInsight {
    return new HealthInsight(
      this.id,
      this.userId,
      this.date,
      this.category,
      this.title,
      this.description,
      this.recommendation,
      this.severity,
      'resolved',
      this.aiGenerated,
      this.examId,
      this.data
    );
  }

  // Factory method
  public static create(
    userId: number,
    category: string,
    title: string,
    description: string,
    recommendation: string,
    severity: 'normal' | 'attention' | 'high' = 'normal',
    examId?: number,
    aiGenerated: boolean = false,
    data?: string
  ): Omit<HealthInsight, 'id'> {
    return {
      userId,
      examId,
      date: new Date(),
      category,
      title,
      description,
      recommendation,
      severity,
      status: 'active',
      aiGenerated,
      data,
      isActive: () => true,
      requiresAttention: () => severity === 'attention' || severity === 'high',
      isHighPriority: () => severity === 'high',
      isAIGenerated: () => aiGenerated,
      dismiss: function() { return this as any; },
      resolve: function() { return this as any; }
    };
  }
}