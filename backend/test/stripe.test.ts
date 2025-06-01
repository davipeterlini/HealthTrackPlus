import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { createTestApp, createAuthenticatedUser } from './utils';
import type { Express } from 'express';
import { MemStorage } from '../storage';

// Mock Stripe
vi.mock('stripe', () => {
  const mockStripe = {
    customers: {
      create: vi.fn().mockResolvedValue({
        id: 'cus_test123',
        email: 'test@example.com'
      }),
      retrieve: vi.fn().mockResolvedValue({
        id: 'cus_test123',
        email: 'test@example.com'
      })
    },
    subscriptions: {
      create: vi.fn().mockResolvedValue({
        id: 'sub_test123',
        status: 'active',
        current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
        latest_invoice: {
          payment_intent: {
            client_secret: 'pi_test_client_secret'
          }
        }
      }),
      retrieve: vi.fn().mockResolvedValue({
        id: 'sub_test123',
        status: 'active',
        current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60
      }),
      update: vi.fn().mockResolvedValue({
        id: 'sub_test123',
        status: 'canceled',
        cancel_at_period_end: true,
        current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60
      })
    }
  };

  return {
    default: vi.fn(() => mockStripe)
  };
});

describe('Stripe Integration', () => {
  let app: Express;
  let storage: MemStorage;

  beforeEach(async () => {
    const testApp = await createTestApp();
    app = testApp.app;
    storage = testApp.storage;
    vi.clearAllMocks();
  });

  describe('Subscription Creation', () => {
    it('should create subscription for authenticated user', async () => {
      const { agent } = await createAuthenticatedUser(app, storage);

      const response = await agent
        .post('/api/create-subscription')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.subscriptionId).toBe('sub_test123');
      expect(response.body.clientSecret).toBe('pi_test_client_secret');
    });

    it('should handle user without email', async () => {
      const { agent, user } = await createAuthenticatedUser(app, storage);
      
      // Update user to remove email
      await storage.updateUser(user.id, { email: null });

      const response = await agent
        .post('/api/create-subscription')
        .expect(400);

      expect(response.body.message).toContain('email is required');
    });

    it('should prevent duplicate active subscriptions', async () => {
      const { agent, user } = await createAuthenticatedUser(app, storage);
      
      // Update user to have active subscription
      await storage.updateUser(user.id, { subscriptionStatus: 'active' });

      const response = await agent
        .post('/api/create-subscription')
        .expect(400);

      expect(response.body.message).toContain('already has an active subscription');
    });
  });

  describe('Subscription Status', () => {
    it('should return subscription status for user', async () => {
      const { agent } = await createAuthenticatedUser(app, storage);

      const response = await agent
        .get('/api/subscription-status')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(typeof response.body.isActive).toBe('boolean');
      expect(response.body.status).toBeDefined();
    });

    it('should return inactive status for new user', async () => {
      const { agent } = await createAuthenticatedUser(app, storage);

      const response = await agent
        .get('/api/subscription-status')
        .expect(200);

      expect(response.body.isActive).toBe(false);
      expect(response.body.status).toBe('inactive');
    });
  });

  describe('Subscription Cancellation', () => {
    it('should cancel active subscription', async () => {
      const { agent, user } = await createAuthenticatedUser(app, storage);
      
      // Update user to have active subscription
      await storage.updateUser(user.id, { 
        stripeSubscriptionId: 'sub_test123',
        stripeCustomerId: 'cus_test123',
        subscriptionStatus: 'active'
      });

      const response = await agent
        .post('/api/cancel-subscription')
        .expect(200);

      expect(response.body.message).toContain('canceled successfully');
    });

    it('should handle user without active subscription', async () => {
      const { agent } = await createAuthenticatedUser(app, storage);

      const response = await agent
        .post('/api/cancel-subscription')
        .expect(400);

      expect(response.body.message).toContain('No active subscription found');
    });
  });
});