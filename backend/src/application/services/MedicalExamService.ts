// Application Service - Medical Exam Management
import { MedicalExam } from '../../domain/entities/MedicalExam';
import { IMedicalExamRepository } from '../../domain/interfaces/IMedicalExamRepository';
import { IHealthInsightRepository } from '../../domain/interfaces/IHealthInsightRepository';
import { HealthInsight } from '../../domain/entities/HealthInsight';

export class MedicalExamService {
  constructor(
    private readonly medicalExamRepository: IMedicalExamRepository,
    private readonly healthInsightRepository: IHealthInsightRepository
  ) {}

  async getExamById(id: number): Promise<MedicalExam | null> {
    return await this.medicalExamRepository.findById(id);
  }

  async getUserExams(userId: number): Promise<MedicalExam[]> {
    return await this.medicalExamRepository.findByUserId(userId);
  }

  async createExam(examData: {
    userId: number;
    name: string;
    date: Date;
    type: string;
    fileUrl?: string;
  }): Promise<MedicalExam> {
    const newExam = MedicalExam.create(
      examData.userId,
      examData.name,
      examData.date,
      examData.type,
      examData.fileUrl
    );

    return await this.medicalExamRepository.create(newExam);
  }

  async updateExam(id: number, examData: Partial<MedicalExam>): Promise<MedicalExam | null> {
    return await this.medicalExamRepository.update(id, examData);
  }

  async analyzeExam(examId: number, aiAnalysis: any): Promise<{
    exam: MedicalExam | null;
    insights: HealthInsight[];
  }> {
    const exam = await this.medicalExamRepository.findById(examId);
    if (!exam) {
      throw new Error('Exam not found');
    }

    if (!exam.canBeAnalyzed()) {
      throw new Error('Exam cannot be analyzed - missing file or already processed');
    }

    // Determine risk level and anomalies from AI analysis
    const riskLevel = this.determineRiskLevel(aiAnalysis);
    const hasAnomalies = this.detectAnomalies(aiAnalysis);

    // Update exam with AI analysis
    const updatedExam = await this.medicalExamRepository.updateWithAIAnalysis(
      examId,
      aiAnalysis,
      hasAnomalies,
      riskLevel
    );

    // Generate health insights based on analysis
    const insights = await this.generateHealthInsights(exam.userId, examId, aiAnalysis, riskLevel);

    return {
      exam: updatedExam,
      insights
    };
  }

  async deleteExam(id: number): Promise<boolean> {
    return await this.medicalExamRepository.delete(id);
  }

  private determineRiskLevel(aiAnalysis: any): string {
    // Business logic to determine risk level based on AI analysis
    if (!aiAnalysis || !aiAnalysis.details) return 'normal';

    const details = aiAnalysis.details;
    let riskFactors = 0;

    // Check various health markers
    if (details.bloodPressure) {
      if (details.bloodPressure.systolic?.status === 'attention' || 
          details.bloodPressure.diastolic?.status === 'attention') {
        riskFactors++;
      }
    }

    if (details.cholesterol) {
      if (details.cholesterol.total?.status === 'attention' ||
          details.cholesterol.ldl?.status === 'attention') {
        riskFactors++;
      }
    }

    if (details.bloodGlucose?.status === 'attention') {
      riskFactors++;
    }

    // Determine risk level based on number of risk factors
    if (riskFactors >= 3) return 'high';
    if (riskFactors >= 1) return 'attention';
    return 'normal';
  }

  private detectAnomalies(aiAnalysis: any): boolean {
    // Business logic to detect anomalies
    if (!aiAnalysis || !aiAnalysis.details) return false;

    const details = aiAnalysis.details;
    
    // Check for any markers that indicate anomalies
    return (
      details.bloodPressure?.systolic?.status === 'attention' ||
      details.bloodPressure?.diastolic?.status === 'attention' ||
      details.cholesterol?.total?.status === 'attention' ||
      details.cholesterol?.ldl?.status === 'attention' ||
      details.bloodGlucose?.status === 'attention' ||
      details.ecg?.status === 'attention'
    );
  }

  private async generateHealthInsights(
    userId: number, 
    examId: number, 
    aiAnalysis: any, 
    riskLevel: string
  ): Promise<HealthInsight[]> {
    const insights: HealthInsight[] = [];
    const categories = ["Cardiovascular", "Nutrition", "Metabolism"];

    for (const category of categories) {
      const insightData = this.generateInsightForCategory(category, aiAnalysis, riskLevel);
      
      if (insightData) {
        const insight = HealthInsight.create(
          userId,
          category,
          insightData.title,
          insightData.description,
          insightData.recommendation,
          insightData.severity,
          examId,
          true, // AI generated
          JSON.stringify(insightData.data)
        );

        const createdInsight = await this.healthInsightRepository.create(insight);
        insights.push(createdInsight);
      }
    }

    return insights;
  }

  private generateInsightForCategory(category: string, aiAnalysis: any, riskLevel: string): any {
    const details = aiAnalysis?.details;
    if (!details) return null;

    switch (category) {
      case "Cardiovascular":
        if (details.bloodPressure || details.heartRate || details.cholesterol) {
          return {
            title: riskLevel === 'attention' ? "Atenção Cardiovascular" : "Saúde Cardiovascular",
            description: riskLevel === 'attention' 
              ? "Alguns indicadores cardiovasculares merecem atenção."
              : "Seus indicadores cardiovasculares estão adequados.",
            recommendation: riskLevel === 'attention'
              ? "Considere reduzir o consumo de sódio e praticar exercícios regulares."
              : "Mantenha a prática regular de exercícios.",
            severity: riskLevel === 'high' ? 'high' : (riskLevel === 'attention' ? 'attention' : 'normal'),
            data: {
              bloodPressure: details.bloodPressure,
              heartRate: details.heartRate,
              cholesterol: details.cholesterol
            }
          };
        }
        break;
      
      case "Nutrition":
        if (details.cholesterol || details.bloodGlucose) {
          return {
            title: riskLevel === 'attention' ? "Atenção Nutricional" : "Perfil Nutricional",
            description: riskLevel === 'attention'
              ? "Alguns marcadores nutricionais necessitam ajustes."
              : "Seus marcadores nutricionais estão equilibrados.",
            recommendation: riskLevel === 'attention'
              ? "Reduza carboidratos refinados e aumente o consumo de vegetais."
              : "Mantenha uma dieta balanceada e variada.",
            severity: riskLevel === 'high' ? 'high' : (riskLevel === 'attention' ? 'attention' : 'normal'),
            data: {
              cholesterol: details.cholesterol,
              bloodGlucose: details.bloodGlucose
            }
          };
        }
        break;
        
      case "Metabolism":
        if (details.bloodGlucose) {
          return {
            title: riskLevel === 'attention' ? "Controle Metabólico" : "Metabolismo Adequado",
            description: riskLevel === 'attention'
              ? "Seus níveis de glicemia requerem monitoramento."
              : "Seu metabolismo está funcionando adequadamente.",
            recommendation: riskLevel === 'attention'
              ? "Mantenha horários regulares de alimentação e pratique atividades físicas."
              : "Continue com hábitos saudáveis para manter o equilíbrio metabólico.",
            severity: riskLevel === 'high' ? 'high' : (riskLevel === 'attention' ? 'attention' : 'normal'),
            data: {
              bloodGlucose: details.bloodGlucose
            }
          };
        }
        break;
    }

    return null;
  }
}