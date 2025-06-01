// Presentation Controller - Medical Exam (following Clean Architecture)
import { Request, Response } from 'express';
import { AnalyzeMedicalExamUseCase, AnalyzeMedicalExamRequest } from '../../application/use-cases/AnalyzeMedicalExamUseCase';
import { MedicalExamService } from '../../application/services/MedicalExamService';
import { MedicalExamRepository } from '../../infrastructure/repositories/MedicalExamRepository';
import { HealthInsightRepository } from '../../infrastructure/repositories/HealthInsightRepository';

export class MedicalExamController {
  private medicalExamService: MedicalExamService;
  private analyzeMedicalExamUseCase: AnalyzeMedicalExamUseCase;

  constructor() {
    const medicalExamRepository = new MedicalExamRepository();
    const healthInsightRepository = new HealthInsightRepository();
    
    this.medicalExamService = new MedicalExamService(
      medicalExamRepository, 
      healthInsightRepository
    );
    
    this.analyzeMedicalExamUseCase = new AnalyzeMedicalExamUseCase(
      medicalExamRepository,
      healthInsightRepository
    );
  }

  // Get user's medical exams
  async getUserExams(req: Request, res: Response): Promise<void> {
    try {
      if (!req.isAuthenticated()) {
        res.sendStatus(401);
        return;
      }

      const userId = (req.user as any).id;
      const exams = await this.medicalExamService.getUserExams(userId);

      // Map domain entities to API response format
      const examResponse = exams.map(exam => ({
        id: exam.id,
        userId: exam.userId,
        name: exam.name,
        date: exam.date,
        type: exam.type,
        status: exam.status,
        fileUrl: exam.fileUrl,
        results: exam.results,
        aiAnalysis: exam.aiAnalysis,
        anomalies: exam.anomalies,
        riskLevel: exam.riskLevel,
        aiProcessed: exam.aiProcessed,
        // Business logic methods as computed properties
        isProcessed: exam.isProcessed(),
        hasAnomalies: exam.hasAnomalies(),
        isHighRisk: exam.isHighRisk(),
        needsAttention: exam.needsAttention(),
        hasFile: exam.hasFile(),
        canBeAnalyzed: exam.canBeAnalyzed()
      }));

      res.json(examResponse);
    } catch (error) {
      console.error('Error getting user exams:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Get specific exam
  async getExam(req: Request, res: Response): Promise<void> {
    try {
      if (!req.isAuthenticated()) {
        res.sendStatus(401);
        return;
      }

      const examId = parseInt(req.params.id);
      if (isNaN(examId)) {
        res.status(400).json({ message: 'Invalid exam ID' });
        return;
      }

      const exam = await this.medicalExamService.getExamById(examId);
      if (!exam) {
        res.status(404).json({ message: 'Exam not found' });
        return;
      }

      // Verify ownership
      const userId = (req.user as any).id;
      if (exam.userId !== userId) {
        res.sendStatus(403);
        return;
      }

      // Map domain entity to API response
      res.json({
        id: exam.id,
        userId: exam.userId,
        name: exam.name,
        date: exam.date,
        type: exam.type,
        status: exam.status,
        fileUrl: exam.fileUrl,
        results: exam.results,
        aiAnalysis: exam.aiAnalysis,
        anomalies: exam.anomalies,
        riskLevel: exam.riskLevel,
        aiProcessed: exam.aiProcessed,
        isProcessed: exam.isProcessed(),
        hasAnomalies: exam.hasAnomalies(),
        isHighRisk: exam.isHighRisk(),
        needsAttention: exam.needsAttention(),
        hasFile: exam.hasFile(),
        canBeAnalyzed: exam.canBeAnalyzed()
      });
    } catch (error) {
      console.error('Error getting exam:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Create new exam
  async createExam(req: Request, res: Response): Promise<void> {
    try {
      if (!req.isAuthenticated()) {
        res.sendStatus(401);
        return;
      }

      const userId = (req.user as any).id;
      const { name, date, type, fileUrl } = req.body;

      if (!name || !date || !type) {
        res.status(400).json({ message: 'Missing required fields: name, date, type' });
        return;
      }

      const exam = await this.medicalExamService.createExam({
        userId,
        name,
        date: new Date(date),
        type,
        fileUrl
      });

      res.status(201).json({
        id: exam.id,
        userId: exam.userId,
        name: exam.name,
        date: exam.date,
        type: exam.type,
        status: exam.status,
        fileUrl: exam.fileUrl,
        canBeAnalyzed: exam.canBeAnalyzed()
      });
    } catch (error) {
      console.error('Error creating exam:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Analyze exam with AI
  async analyzeExam(req: Request, res: Response): Promise<void> {
    try {
      if (!req.isAuthenticated()) {
        res.sendStatus(401);
        return;
      }

      const examId = parseInt(req.params.id);
      if (isNaN(examId)) {
        res.status(400).json({ message: 'Invalid exam ID' });
        return;
      }

      const userId = (req.user as any).id;
      const analyzeRequest: AnalyzeMedicalExamRequest = {
        examId,
        userId
      };

      const result = await this.analyzeMedicalExamUseCase.execute(analyzeRequest);

      if (!result.success) {
        res.status(400).json({ message: result.message });
        return;
      }

      // Map domain entities to API response
      const examResponse = result.exam ? {
        id: result.exam.id,
        userId: result.exam.userId,
        name: result.exam.name,
        date: result.exam.date,
        type: result.exam.type,
        status: result.exam.status,
        aiAnalysis: result.exam.aiAnalysis,
        anomalies: result.exam.anomalies,
        riskLevel: result.exam.riskLevel,
        aiProcessed: result.exam.aiProcessed,
        isProcessed: result.exam.isProcessed(),
        hasAnomalies: result.exam.hasAnomalies(),
        isHighRisk: result.exam.isHighRisk(),
        needsAttention: result.exam.needsAttention()
      } : null;

      const insightsResponse = result.insights.map(insight => ({
        id: insight.id,
        userId: insight.userId,
        examId: insight.examId,
        date: insight.date,
        category: insight.category,
        title: insight.title,
        description: insight.description,
        recommendation: insight.recommendation,
        severity: insight.severity,
        status: insight.status,
        aiGenerated: insight.aiGenerated,
        isActive: insight.isActive(),
        requiresAttention: insight.requiresAttention(),
        isHighPriority: insight.isHighPriority()
      }));

      res.json({
        exam: examResponse,
        insights: insightsResponse,
        message: result.message
      });
    } catch (error) {
      console.error('Error analyzing exam:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Update exam
  async updateExam(req: Request, res: Response): Promise<void> {
    try {
      if (!req.isAuthenticated()) {
        res.sendStatus(401);
        return;
      }

      const examId = parseInt(req.params.id);
      if (isNaN(examId)) {
        res.status(400).json({ message: 'Invalid exam ID' });
        return;
      }

      // Verify ownership first
      const exam = await this.medicalExamService.getExamById(examId);
      if (!exam) {
        res.status(404).json({ message: 'Exam not found' });
        return;
      }

      const userId = (req.user as any).id;
      if (exam.userId !== userId) {
        res.sendStatus(403);
        return;
      }

      const updatedExam = await this.medicalExamService.updateExam(examId, req.body);
      if (!updatedExam) {
        res.status(404).json({ message: 'Failed to update exam' });
        return;
      }

      res.json({
        id: updatedExam.id,
        name: updatedExam.name,
        date: updatedExam.date,
        type: updatedExam.type,
        status: updatedExam.status,
        fileUrl: updatedExam.fileUrl,
        isProcessed: updatedExam.isProcessed(),
        canBeAnalyzed: updatedExam.canBeAnalyzed()
      });
    } catch (error) {
      console.error('Error updating exam:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}