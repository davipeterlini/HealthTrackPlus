// Repository Interface - Medical Exam
import { MedicalExam } from '../entities/MedicalExam';

export interface IMedicalExamRepository {
  findById(id: number): Promise<MedicalExam | null>;
  findByUserId(userId: number): Promise<MedicalExam[]>;
  findPendingAnalysis(): Promise<MedicalExam[]>;
  create(examData: Omit<MedicalExam, 'id'>): Promise<MedicalExam>;
  update(id: number, examData: Partial<MedicalExam>): Promise<MedicalExam | null>;
  updateWithAIAnalysis(id: number, aiAnalysis: any, anomalies: boolean, riskLevel: string): Promise<MedicalExam | null>;
  delete(id: number): Promise<boolean>;
  getExamDetails(examId: number): Promise<any[]>;
  createExamDetail(detailData: any): Promise<any>;
}