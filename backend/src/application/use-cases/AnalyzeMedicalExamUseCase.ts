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
        summary: "Complete laboratory analysis performed successfully.",
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
          "Maintain a balanced diet",
          "Practice regular exercise",
          "Continue with periodic exams"
        ]
      };
    }

    if (exam.type.toLowerCase().includes('cardiac') || exam.type.toLowerCase().includes('cardio')) {
      return {
        summary: "Cardiac evaluation shows parameters within normal range.",
        details: {
          bloodPressure: {
            systolic: { value: 120, status: "normal", reference: "<120 mmHg" },
            diastolic: { value: 80, status: "normal", reference: "<80 mmHg" }
          },
          heartRate: { value: 72, status: "normal", reference: "60-100 bpm" },
          ecg: { finding: "Normal sinus rhythm", status: "normal" }
        },
        recommendations: [
          "Maintain regular physical activity",
          "Control sodium intake",
          "Monitor blood pressure"
        ]
      };
    }

    // Default analysis
    return {
      summary: "Exam analysis completed with satisfactory results.",
      details: {
        general: { status: "normal", findings: "No significant changes" }
      },
      recommendations: [
        "Maintain healthy habits",
        "Continue regular medical follow-up"
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
          title: riskLevel === 'attention' ? "Cardiovascular Alert" : "Cardiovascular Health",
          description: riskLevel === 'attention' 
            ? "Some cardiovascular indicators require attention."
            : "Your cardiovascular indicators are adequate.",
          recommendation: riskLevel === 'attention'
            ? "Consider reducing sodium intake and practicing regular exercise."
            : "Maintain regular exercise practice.",
          severity,
          data: aiAnalysis?.details?.bloodPressure || aiAnalysis?.details?.heartRate || {}
        };
      
      case "Nutrition":
        return {
          title: riskLevel === 'attention' ? "Nutritional Alert" : "Nutritional Profile",
          description: riskLevel === 'attention'
            ? "Some nutritional markers need adjustments."
            : "Your nutritional markers are balanced.",
          recommendation: riskLevel === 'attention'
            ? "Reduce refined carbohydrates and increase vegetable consumption."
            : "Maintain a balanced and varied diet.",
          severity,
          data: aiAnalysis?.details?.cholesterol || aiAnalysis?.details?.bloodGlucose || {}
        };
        
      case "Metabolism":
        return {
          title: riskLevel === 'attention' ? "Metabolic Control" : "Adequate Metabolism",
          description: riskLevel === 'attention'
            ? "Your metabolic levels require monitoring."
            : "Your metabolism is functioning properly.",
          recommendation: riskLevel === 'attention'
            ? "Maintain regular meal times and practice physical activities."
            : "Continue with healthy habits to maintain metabolic balance.",
          severity,
          data: aiAnalysis?.details?.bloodGlucose || {}
        };
    }

    return null;
  }
}