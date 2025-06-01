// Repository Interface - Health Insight
import { HealthInsight } from '../entities/HealthInsight';

export interface IHealthInsightRepository {
  findById(id: number): Promise<HealthInsight | null>;
  findByUserId(userId: number): Promise<HealthInsight[]>;
  findActiveByUserId(userId: number): Promise<HealthInsight[]>;
  findByCategory(userId: number, category: string): Promise<HealthInsight[]>;
  create(insightData: Omit<HealthInsight, 'id'>): Promise<HealthInsight>;
  update(id: number, insightData: Partial<HealthInsight>): Promise<HealthInsight | null>;
  dismiss(id: number): Promise<HealthInsight | null>;
  resolve(id: number): Promise<HealthInsight | null>;
  delete(id: number): Promise<boolean>;
}