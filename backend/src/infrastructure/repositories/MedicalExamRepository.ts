// Infrastructure Repository - Medical Exam (implements domain interface)
import { eq } from 'drizzle-orm';
import { db } from '../../../db';
import { medicalExams, examDetails, type MedicalExam as DrizzleMedicalExam } from '../../../../shared/schema';
import { MedicalExam } from '../../domain/entities/MedicalExam';
import { IMedicalExamRepository } from '../../domain/interfaces/IMedicalExamRepository';

export class MedicalExamRepository implements IMedicalExamRepository {
  async findById(id: number): Promise<MedicalExam | null> {
    const [exam] = await db.select().from(medicalExams).where(eq(medicalExams.id, id));
    return exam ? this.mapToEntity(exam) : null;
  }

  async findByUserId(userId: number): Promise<MedicalExam[]> {
    const exams = await db.select().from(medicalExams).where(eq(medicalExams.userId, userId));
    return exams.map(exam => this.mapToEntity(exam));
  }

  async findPendingAnalysis(): Promise<MedicalExam[]> {
    const exams = await db.select().from(medicalExams).where(eq(medicalExams.aiProcessed, false));
    return exams.map(exam => this.mapToEntity(exam));
  }

  async create(examData: Omit<MedicalExam, 'id'>): Promise<MedicalExam> {
    const [exam] = await db
      .insert(medicalExams)
      .values({
        userId: examData.userId,
        name: examData.name,
        date: examData.date,
        type: examData.type,
        status: examData.status,
        fileUrl: examData.fileUrl,
        results: examData.results,
        aiAnalysis: examData.aiAnalysis,
        anomalies: examData.anomalies,
        riskLevel: examData.riskLevel,
        aiProcessed: examData.aiProcessed
      })
      .returning();
    
    return this.mapToEntity(exam);
  }

  async update(id: number, examData: Partial<MedicalExam>): Promise<MedicalExam | null> {
    const [exam] = await db
      .update(medicalExams)
      .set({
        name: examData.name,
        date: examData.date,
        type: examData.type,
        status: examData.status,
        fileUrl: examData.fileUrl,
        results: examData.results,
        aiAnalysis: examData.aiAnalysis,
        anomalies: examData.anomalies,
        riskLevel: examData.riskLevel,
        aiProcessed: examData.aiProcessed
      })
      .where(eq(medicalExams.id, id))
      .returning();
    
    return exam ? this.mapToEntity(exam) : null;
  }

  async updateWithAIAnalysis(id: number, aiAnalysis: any, anomalies: boolean, riskLevel: string): Promise<MedicalExam | null> {
    const [exam] = await db
      .update(medicalExams)
      .set({
        aiAnalysis,
        anomalies,
        riskLevel,
        aiProcessed: true,
        status: anomalies ? 'Attention' : 'Normal'
      })
      .where(eq(medicalExams.id, id))
      .returning();
    
    return exam ? this.mapToEntity(exam) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await db.delete(medicalExams).where(eq(medicalExams.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getExamDetails(examId: number): Promise<any[]> {
    return await db.select().from(examDetails).where(eq(examDetails.examId, examId));
  }

  async createExamDetail(detailData: any): Promise<any> {
    const [detail] = await db
      .insert(examDetails)
      .values(detailData)
      .returning();
    
    return detail;
  }

  private mapToEntity(drizzleExam: DrizzleMedicalExam): MedicalExam {
    return new MedicalExam(
      drizzleExam.id,
      drizzleExam.userId,
      drizzleExam.name,
      drizzleExam.date,
      drizzleExam.type,
      drizzleExam.status,
      drizzleExam.fileUrl || undefined,
      drizzleExam.results,
      drizzleExam.aiAnalysis,
      drizzleExam.anomalies || false,
      drizzleExam.riskLevel || "normal",
      drizzleExam.aiProcessed || false
    );
  }
}