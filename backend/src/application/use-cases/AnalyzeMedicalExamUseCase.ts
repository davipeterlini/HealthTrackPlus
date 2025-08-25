// Use Case - Analyze Medical Exam (following Single Responsibility Principle)
import { MedicalExam } from '../../domain/entities/MedicalExam';
import { HealthInsight } from '../../domain/entities/HealthInsight';
import { IMedicalExamRepository } from '../../domain/interfaces/IMedicalExamRepository';
import { IHealthInsightRepository } from '../../domain/interfaces/IHealthInsightRepository';

export interface AnalyzeMedicalExamRequest {
  examId: number;
  userId: number;
}

export interface AnalyzeMedicalExamResponse {
  exam: MedicalExam | null;
  insights: HealthInsight[];
  success: boolean;
  message: string;
}

export class AnalyzeMedicalExamUseCase {
  constructor(
    private readonly medicalExamRepository: IMedicalExamRepository,
    private readonly healthInsightRepository: IHealthInsightRepository
  ) {}

  async execute(request: AnalyzeMedicalExamRequest): Promise<AnalyzeMedicalExamResponse> {
    try {
      // Get the exam
      const exam = await this.medicalExamRepository.findById(request.examId);
      if (!exam) {
        return {
          exam: null,
          insights: [],
          success: false,
          message: 'Exam not found'
        };
      }

      // Verify ownership
      if (exam.userId !== request.userId) {
        return {
          exam: null,
          insights: [],
          success: false,
          message: 'Unauthorized access to exam'
        };
      }

      // Check if exam can be analyzed
      if (!exam.canBeAnalyzed()) {
        return {
          exam: null,
          insights: [],
          success: false,
          message: 'Exam cannot be analyzed - missing file or already processed'
        };
      }

      // Perform AI analysis simulation
      const aiAnalysis = this.generateMockAIAnalysis(exam);
      const riskLevel = this.determineRiskLevel(aiAnalysis);
      const hasAnomalies = this.detectAnomalies(aiAnalysis);

      // Update exam with analysis results
      const updatedExam = await this.medicalExamRepository.updateWithAIAnalysis(
        request.examId,
        aiAnalysis,
        hasAnomalies,
        riskLevel
      );

      // Generate health insights
      const insights = await this.generateHealthInsights(
        request.userId,
        request.examId,
        aiAnalysis,
        riskLevel
      );

      return {
        exam: updatedExam,
        insights,
        success: true,
        message: 'Exam analyzed successfully'
      };
    } catch (error) {
      return {
        exam: null,
        insights: [],
        success: false,
        message: `Failed to analyze exam: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private generateMockAIAnalysis(exam: MedicalExam): any {
    // Business logic for generating mock AI analysis based on exam type
    if (exam.type.toLowerCase().includes('blood') || exam.type.toLowerCase().includes('lab')) {
      return {
        summary: "Análise laboratorial completa realizada com sucesso.",
        details: {
          bloodGlucose: {
            value: 95,
            status: "normal",
            reference: "70-99 mg/dL"
          },
          cholesterol: {
            total: { value: 180, status: "normal", reference: "<200 mg/dL" },
            hdl: { value: 55, status: "normal", reference: ">40 mg/dL" },
            ldl: { value: 110, status: "normal", reference: "<130 mg/dL" }
          }
        },
        recommendations: [
          "Manter alimentação balanceada",
          "Praticar exercícios regularmente",
          "Continuar com exames periódicos"
        ]
      };
    }

    if (exam.type.toLowerCase().includes('cardiac') || exam.type.toLowerCase().includes('cardio')) {
      return {
        summary: "Avaliação cardíaca apresenta parâmetros dentro da normalidade.",
        details: {
          bloodPressure: {
            systolic: { value: 120, status: "normal", reference: "<120 mmHg" },
            diastolic: { value: 80, status: "normal", reference: "<80 mmHg" }
          },
          heartRate: { value: 72, status: "normal", reference: "60-100 bpm" },
          ecg: { finding: "Ritmo sinusal normal", status: "normal" }
        },
        recommendations: [
          "Manter atividade física regular",
          "Controlar ingestão de sódio",
          "Monitorar pressão arterial"
        ]
      };
    }

    // Default analysis
    return {
      summary: "Análise do exame concluída com resultados satisfatórios.",
      details: {
        general: { status: "normal", findings: "Sem alterações significativas" }
      },
      recommendations: [
        "Manter hábitos saudáveis",
        "Continuar acompanhamento médico regular"
      ]
    };
  }

  private determineRiskLevel(aiAnalysis: any): string {
    if (!aiAnalysis?.details) return 'normal';

    let riskFactors = 0;
    const details = aiAnalysis.details;

    // Check for attention markers
    Object.values(details).forEach((marker: any) => {
      if (marker?.status === 'attention') riskFactors++;
      if (marker?.systolic?.status === 'attention') riskFactors++;
      if (marker?.diastolic?.status === 'attention') riskFactors++;
    });

    if (riskFactors >= 3) return 'high';
    if (riskFactors >= 1) return 'attention';
    return 'normal';
  }

  private detectAnomalies(aiAnalysis: any): boolean {
    if (!aiAnalysis?.details) return false;

    return Object.values(aiAnalysis.details).some((marker: any) => 
      marker?.status === 'attention' || 
      marker?.systolic?.status === 'attention' ||
      marker?.diastolic?.status === 'attention'
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
          true,
          JSON.stringify(insightData.data)
        );

        const createdInsight = await this.healthInsightRepository.create(insight);
        insights.push(createdInsight);
      }
    }

    return insights;
  }

  private generateInsightForCategory(category: string, aiAnalysis: any, riskLevel: string): any {
    const severity = riskLevel === 'high' ? 'high' : (riskLevel === 'attention' ? 'attention' : 'normal');
    
    switch (category) {
      case "Cardiovascular":
        return {
          title: riskLevel === 'attention' ? "Atenção Cardiovascular" : "Saúde Cardiovascular",
          description: riskLevel === 'attention' 
            ? "Alguns indicadores cardiovasculares merecem atenção."
            : "Seus indicadores cardiovasculares estão adequados.",
          recommendation: riskLevel === 'attention'
            ? "Considere reduzir o consumo de sódio e praticar exercícios regulares."
            : "Mantenha a prática regular de exercícios.",
          severity,
          data: aiAnalysis?.details?.bloodPressure || aiAnalysis?.details?.heartRate || {}
        };
      
      case "Nutrition":
        return {
          title: riskLevel === 'attention' ? "Atenção Nutricional" : "Perfil Nutricional",
          description: riskLevel === 'attention'
            ? "Alguns marcadores nutricionais necessitam ajustes."
            : "Seus marcadores nutricionais estão equilibrados.",
          recommendation: riskLevel === 'attention'
            ? "Reduza carboidratos refinados e aumente o consumo de vegetais."
            : "Mantenha uma dieta balanceada e variada.",
          severity,
          data: aiAnalysis?.details?.cholesterol || aiAnalysis?.details?.bloodGlucose || {}
        };
        
      case "Metabolism":
        return {
          title: riskLevel === 'attention' ? "Controle Metabólico" : "Metabolismo Adequado",
          description: riskLevel === 'attention'
            ? "Seus níveis metabólicos requerem monitoramento."
            : "Seu metabolismo está funcionando adequadamente.",
          recommendation: riskLevel === 'attention'
            ? "Mantenha horários regulares de alimentação e pratique atividades físicas."
            : "Continue com hábitos saudáveis para manter o equilíbrio metabólico.",
          severity,
          data: aiAnalysis?.details?.bloodGlucose || {}
        };
    }

    return null;
  }
}