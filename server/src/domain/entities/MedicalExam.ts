// Domain Entity - Medical Exam
export class MedicalExam {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly name: string,
    public readonly date: Date,
    public readonly type: string,
    public readonly status: string,
    public readonly fileUrl?: string,
    public readonly results?: any,
    public readonly aiAnalysis?: any,
    public readonly anomalies: boolean = false,
    public readonly riskLevel: string = "normal",
    public readonly aiProcessed: boolean = false
  ) {}

  // Business logic methods
  public isProcessed(): boolean {
    return this.aiProcessed;
  }

  public hasAnomalies(): boolean {
    return this.anomalies;
  }

  public isHighRisk(): boolean {
    return this.riskLevel === "high";
  }

  public needsAttention(): boolean {
    return this.riskLevel === "attention" || this.hasAnomalies();
  }

  public hasFile(): boolean {
    return !!this.fileUrl;
  }

  public canBeAnalyzed(): boolean {
    return this.hasFile() && !this.isProcessed();
  }

  // Factory method
  public static create(
    userId: number,
    name: string,
    date: Date,
    type: string,
    fileUrl?: string
  ): Omit<MedicalExam, 'id'> {
    return {
      userId,
      name,
      date,
      type,
      status: "pending",
      fileUrl,
      results: null,
      aiAnalysis: null,
      anomalies: false,
      riskLevel: "normal",
      aiProcessed: false,
      isProcessed: () => false,
      hasAnomalies: () => false,
      isHighRisk: () => false,
      needsAttention: () => false,
      hasFile: () => !!fileUrl,
      canBeAnalyzed: () => !!fileUrl
    };
  }
}