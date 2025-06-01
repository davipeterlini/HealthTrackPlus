// Domain Entity - Medical Exam (Frontend)
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

  // Business logic methods for UI display
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

  public getStatusDisplay(): string {
    switch (this.status.toLowerCase()) {
      case 'normal': return 'Normal';
      case 'attention': return 'Requer Atenção';
      case 'pending': return 'Pendente';
      case 'incomplete': return 'Incompleto';
      default: return this.status;
    }
  }

  public getStatusColor(): string {
    switch (this.status.toLowerCase()) {
      case 'normal': return 'bg-green-100 text-green-800';
      case 'attention': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'incomplete': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  public getRiskLevelDisplay(): string {
    switch (this.riskLevel) {
      case 'high': return 'Alto Risco';
      case 'attention': return 'Atenção';
      case 'normal': return 'Normal';
      default: return 'Normal';
    }
  }

  public getRiskLevelColor(): string {
    switch (this.riskLevel) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'attention': return 'text-yellow-600 bg-yellow-50';
      case 'normal': return 'text-green-600 bg-green-50';
      default: return 'text-green-600 bg-green-50';
    }
  }

  public getTypeIcon(): string {
    const lowerType = this.type.toLowerCase();
    if (lowerType.includes('blood') || lowerType.includes('lab')) return '🩸';
    if (lowerType.includes('cardiac') || lowerType.includes('heart')) return '❤️';
    if (lowerType.includes('x-ray') || lowerType.includes('xray')) return '🩻';
    if (lowerType.includes('mri') || lowerType.includes('scan')) return '🧠';
    if (lowerType.includes('ultrasound')) return '🔊';
    return '📋';
  }

  public getFormattedDate(): string {
    return this.date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  public getRelativeDate(): string {
    const now = new Date();
    const diffTime = now.getTime() - this.date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`;
    return this.getFormattedDate();
  }

  public getActionLabel(): string {
    if (this.canBeAnalyzed()) return 'Analisar';
    if (this.isProcessed()) return 'Ver Resultados';
    if (!this.hasFile()) return 'Anexar Arquivo';
    return 'Visualizar';
  }

  public getActionColor(): string {
    if (this.canBeAnalyzed()) return 'bg-blue-600 hover:bg-blue-700';
    if (this.needsAttention()) return 'bg-yellow-600 hover:bg-yellow-700';
    return 'bg-gray-600 hover:bg-gray-700';
  }

  public hasResults(): boolean {
    return !!this.results || !!this.aiAnalysis;
  }

  public getResultsSummary(): string {
    if (this.aiAnalysis?.summary) return this.aiAnalysis.summary;
    if (this.results?.summary) return this.results.summary;
    return 'Resultados disponíveis para visualização';
  }

  // Factory method for creating from API response
  public static fromApiResponse(data: any): MedicalExam {
    return new MedicalExam(
      data.id,
      data.userId,
      data.name,
      new Date(data.date),
      data.type,
      data.status,
      data.fileUrl,
      data.results,
      data.aiAnalysis,
      data.anomalies || false,
      data.riskLevel || "normal",
      data.aiProcessed || false
    );
  }
}