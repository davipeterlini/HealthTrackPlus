// Repository Interface - Medical Exam (Frontend)
import { MedicalExam } from '../entities/MedicalExam';

export interface IMedicalExamRepository {
  getExams(): Promise<MedicalExam[]>;
  getExam(id: number): Promise<MedicalExam | null>;
  createExam(examData: {
    name: string;
    date: Date;
    type: string;
    fileUrl?: string;
  }): Promise<MedicalExam>;
  updateExam(id: number, examData: Partial<MedicalExam>): Promise<MedicalExam>;
  deleteExam(id: number): Promise<boolean>;
  analyzeExam(id: number): Promise<{
    exam: MedicalExam;
    insights: any[];
  }>;
  uploadExamFile(file: File): Promise<string>; // Returns file URL
}