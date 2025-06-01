// Infrastructure Repository - Medical Exam (Frontend)
import { MedicalExam } from '../../domain/entities/MedicalExam';
import { IMedicalExamRepository } from '../../domain/interfaces/IMedicalExamRepository';
import { apiRequest } from '../../lib/queryClient';

export class MedicalExamRepository implements IMedicalExamRepository {
  async getExams(): Promise<MedicalExam[]> {
    try {
      const response = await apiRequest('GET', '/api/exams');
      if (!response.ok) {
        throw new Error('Failed to get exams');
      }
      const data = await response.json();
      return data.map((exam: any) => MedicalExam.fromApiResponse(exam));
    } catch (error) {
      console.error('Error getting exams:', error);
      throw error;
    }
  }

  async getExam(id: number): Promise<MedicalExam | null> {
    try {
      const response = await apiRequest('GET', `/api/exams/${id}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to get exam');
      }
      const data = await response.json();
      return MedicalExam.fromApiResponse(data);
    } catch (error) {
      console.error('Error getting exam:', error);
      throw error;
    }
  }

  async createExam(examData: {
    name: string;
    date: Date;
    type: string;
    fileUrl?: string;
  }): Promise<MedicalExam> {
    try {
      const payload = {
        name: examData.name,
        date: examData.date.toISOString(),
        type: examData.type,
        fileUrl: examData.fileUrl
      };

      const response = await apiRequest('POST', '/api/exams', payload);
      if (!response.ok) {
        throw new Error('Failed to create exam');
      }
      const data = await response.json();
      return MedicalExam.fromApiResponse(data);
    } catch (error) {
      console.error('Error creating exam:', error);
      throw error;
    }
  }

  async updateExam(id: number, examData: Partial<MedicalExam>): Promise<MedicalExam> {
    try {
      const payload: any = {};
      if (examData.name) payload.name = examData.name;
      if (examData.date) payload.date = examData.date.toISOString();
      if (examData.type) payload.type = examData.type;
      if (examData.fileUrl) payload.fileUrl = examData.fileUrl;
      if (examData.status) payload.status = examData.status;

      const response = await apiRequest('PATCH', `/api/exams/${id}`, payload);
      if (!response.ok) {
        throw new Error('Failed to update exam');
      }
      const data = await response.json();
      return MedicalExam.fromApiResponse(data);
    } catch (error) {
      console.error('Error updating exam:', error);
      throw error;
    }
  }

  async deleteExam(id: number): Promise<boolean> {
    try {
      const response = await apiRequest('DELETE', `/api/exams/${id}`);
      return response.ok;
    } catch (error) {
      console.error('Error deleting exam:', error);
      throw error;
    }
  }

  async analyzeExam(id: number): Promise<{
    exam: MedicalExam;
    insights: any[];
  }> {
    try {
      const response = await apiRequest('POST', `/api/exams/${id}/analyze`);
      if (!response.ok) {
        throw new Error('Failed to analyze exam');
      }
      const data = await response.json();
      return {
        exam: MedicalExam.fromApiResponse(data.exam),
        insights: data.insights || []
      };
    } catch (error) {
      console.error('Error analyzing exam:', error);
      throw error;
    }
  }

  async uploadExamFile(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      return data.fileUrl || data.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
}