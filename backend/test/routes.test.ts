import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createTestApp, createAuthenticatedUser } from './utils';
import type { Express } from 'express';
import { MemStorage } from '../storage';

describe('API Routes', () => {
  let app: Express;
  let storage: MemStorage;

  beforeEach(async () => {
    const testApp = await createTestApp();
    app = testApp.app;
    storage = testApp.storage;
  });

  describe('Dashboard Routes', () => {
    it('should return dashboard stats for authenticated user', async () => {
      const { agent } = await createAuthenticatedUser(app, storage);

      const response = await agent
        .get('/api/dashboard')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(typeof response.body.totalSteps).toBe('number');
      expect(typeof response.body.totalCalories).toBe('number');
      expect(typeof response.body.avgSleep).toBe('number');
      expect(Array.isArray(response.body.weeklyProgress.steps)).toBe(true);
    });

    it('should allow unauthenticated access in development', async () => {
      const response = await request(app)
        .get('/api/dashboard')
        .expect(200);

      expect(response.body).toBeDefined();
    });
  });

  describe('Medical Exam Routes', () => {
    it('should return 401 for unauthenticated exam requests', async () => {
      await request(app)
        .get('/api/exams')
        .expect(401);
    });

    it('should return exams for authenticated user', async () => {
      const { agent } = await createAuthenticatedUser(app, storage);

      const response = await agent
        .get('/api/exams')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should create new medical exam', async () => {
      const { agent } = await createAuthenticatedUser(app, storage);

      const examData = {
        name: 'Blood Test',
        type: 'blood',
        date: new Date().toISOString()
      };

      const response = await agent
        .post('/api/exams')
        .send(examData)
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.name).toBe('Blood Test');
      expect(response.body.type).toBe('blood');
    });

    it('should return 400 for missing required fields', async () => {
      const { agent } = await createAuthenticatedUser(app, storage);

      const examData = {
        name: 'Blood Test'
        // missing type
      };

      const response = await agent
        .post('/api/exams')
        .send(examData)
        .expect(400);

      expect(response.body.message).toContain('required');
    });
  });

  describe('Subscription Routes', () => {
    it('should return 401 for unauthenticated subscription requests', async () => {
      await request(app)
        .post('/api/create-subscription')
        .expect(401);
    });

    it('should check subscription status for authenticated user', async () => {
      const { agent } = await createAuthenticatedUser(app, storage);

      const response = await agent
        .get('/api/subscription-status')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(typeof response.body.isActive).toBe('boolean');
      expect(response.body.status).toBeDefined();
    });

    it('should require email for subscription creation', async () => {
      const { agent, user } = await createAuthenticatedUser(app, storage);

      // Remove email from user to test error handling
      await storage.updateUser(user.id, { email: null });

      const response = await agent
        .post('/api/create-subscription')
        .expect(400);

      expect(response.body.message).toContain('email is required');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent routes', async () => {
      await request(app)
        .get('/api/non-existent')
        .expect(404);
    });

    it('should handle invalid JSON in request body', async () => {
      const response = await request(app)
        .post('/api/register')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);
    });
  });
});