// Infrastructure Repository - User (implements domain interface)
import { eq } from 'drizzle-orm';
import { db } from '../../../db';
import { users, type User as DrizzleUser } from '../../../../shared/schema';
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';

export class UserRepository implements IUserRepository {
  async findById(id: number): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user ? this.mapToEntity(user) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user ? this.mapToEntity(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user ? this.mapToEntity(user) : null;
  }

  async create(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        username: userData.username,
        email: userData.email,
        password: 'temp_password', // This should be handled by auth layer
        name: userData.name,
        avatar: userData.avatar,
        stripeCustomerId: userData.stripeCustomerId,
        stripeSubscriptionId: userData.stripeSubscriptionId,
        subscriptionStatus: userData.subscriptionStatus,
        subscriptionEndDate: userData.subscriptionEndDate
      })
      .returning();
    
    return this.mapToEntity(user);
  }

  async update(id: number, userData: Partial<User>): Promise<User | null> {
    const [user] = await db
      .update(users)
      .set({
        username: userData.username,
        email: userData.email,
        name: userData.name,
        avatar: userData.avatar,
        stripeCustomerId: userData.stripeCustomerId,
        stripeSubscriptionId: userData.stripeSubscriptionId,
        subscriptionStatus: userData.subscriptionStatus,
        subscriptionEndDate: userData.subscriptionEndDate
      })
      .where(eq(users.id, id))
      .returning();
    
    return user ? this.mapToEntity(user) : null;
  }

  async updateStripeCustomerId(id: number, stripeCustomerId: string): Promise<User | null> {
    const [user] = await db
      .update(users)
      .set({ stripeCustomerId })
      .where(eq(users.id, id))
      .returning();
    
    return user ? this.mapToEntity(user) : null;
  }

  async updateSubscriptionInfo(id: number, subscriptionData: {
    stripeSubscriptionId: string;
    subscriptionStatus: string;
    subscriptionEndDate?: Date;
  }): Promise<User | null> {
    const [user] = await db
      .update(users)
      .set({
        stripeSubscriptionId: subscriptionData.stripeSubscriptionId,
        subscriptionStatus: subscriptionData.subscriptionStatus,
        subscriptionEndDate: subscriptionData.subscriptionEndDate
      })
      .where(eq(users.id, id))
      .returning();
    
    return user ? this.mapToEntity(user) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return (result.rowCount || 0) > 0;
  }

  private mapToEntity(drizzleUser: DrizzleUser): User {
    return new User(
      drizzleUser.id,
      drizzleUser.username,
      drizzleUser.email,
      drizzleUser.name || undefined,
      drizzleUser.avatar || undefined,
      drizzleUser.stripeCustomerId || undefined,
      drizzleUser.stripeSubscriptionId || undefined,
      drizzleUser.subscriptionStatus as any || 'inactive',
      drizzleUser.subscriptionEndDate || undefined,
      drizzleUser.createdAt
    );
  }
}