// Infrastructure Repository - Health Insight
import { eq } from 'drizzle-orm';
import { db } from '../../../db';
import { healthInsights, type HealthInsight as DrizzleHealthInsight } from '../../../../shared/schema';
import { HealthInsight } from '../../domain/entities/HealthInsight';
import { IHealthInsightRepository } from '../../domain/interfaces/IHealthInsightRepository';

export class HealthInsightRepository implements IHealthInsightRepository {
  async findById(id: number): Promise<HealthInsight | null> {
    const [insight] = await db.select().from(healthInsights).where(eq(healthInsights.id, id));
    return insight ? this.mapToEntity(insight) : null;
  }

  async findByUserId(userId: number): Promise<HealthInsight[]> {
    const insights = await db.select().from(healthInsights).where(eq(healthInsights.userId, userId));
    return insights.map(insight => this.mapToEntity(insight));
  }

  async findActiveByUserId(userId: number): Promise<HealthInsight[]> {
    const insights = await db.select().from(healthInsights)
      .where(eq(healthInsights.userId, userId))
      .where(eq(healthInsights.status, 'active'));
    return insights.map(insight => this.mapToEntity(insight));
  }

  async findByCategory(userId: number, category: string): Promise<HealthInsight[]> {
    const insights = await db.select().from(healthInsights)
      .where(eq(healthInsights.userId, userId))
      .where(eq(healthInsights.category, category));
    return insights.map(insight => this.mapToEntity(insight));
  }

  async create(insightData: Omit<HealthInsight, 'id'>): Promise<HealthInsight> {
    const [insight] = await db
      .insert(healthInsights)
      .values({
        userId: insightData.userId,
        examId: insightData.examId,
        date: insightData.date,
        category: insightData.category,
        title: insightData.title,
        description: insightData.description,
        recommendation: insightData.recommendation,
        severity: insightData.severity,
        status: insightData.status,
        aiGenerated: insightData.aiGenerated,
        data: insightData.data
      })
      .returning();
    
    return this.mapToEntity(insight);
  }

  async update(id: number, insightData: Partial<HealthInsight>): Promise<HealthInsight | null> {
    const [insight] = await db
      .update(healthInsights)
      .set({
        category: insightData.category,
        title: insightData.title,
        description: insightData.description,
        recommendation: insightData.recommendation,
        severity: insightData.severity,
        status: insightData.status,
        data: insightData.data
      })
      .where(eq(healthInsights.id, id))
      .returning();
    
    return insight ? this.mapToEntity(insight) : null;
  }

  async dismiss(id: number): Promise<HealthInsight | null> {
    const [insight] = await db
      .update(healthInsights)
      .set({ status: 'dismissed' })
      .where(eq(healthInsights.id, id))
      .returning();
    
    return insight ? this.mapToEntity(insight) : null;
  }

  async resolve(id: number): Promise<HealthInsight | null> {
    const [insight] = await db
      .update(healthInsights)
      .set({ status: 'resolved' })
      .where(eq(healthInsights.id, id))
      .returning();
    
    return insight ? this.mapToEntity(insight) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await db.delete(healthInsights).where(eq(healthInsights.id, id));
    return (result.rowCount || 0) > 0;
  }

  private mapToEntity(drizzleInsight: DrizzleHealthInsight): HealthInsight {
    return new HealthInsight(
      drizzleInsight.id,
      drizzleInsight.userId,
      drizzleInsight.date,
      drizzleInsight.category,
      drizzleInsight.title,
      drizzleInsight.description,
      drizzleInsight.recommendation,
      drizzleInsight.severity as any,
      drizzleInsight.status as any,
      drizzleInsight.aiGenerated || false,
      drizzleInsight.examId || undefined,
      drizzleInsight.data || undefined
    );
  }
}