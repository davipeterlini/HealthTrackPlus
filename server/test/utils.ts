import express from 'express';
import request from 'supertest';
import { MemStorage } from '../storage';
import { setupAuth } from '../auth';
import { registerRoutes } from '../routes';

export async function createTestApp(storage?: MemStorage) {
  const app = express();
  
  // Use provided storage or create new one
  const testStorage = storage || new MemStorage();
  
  // Mock the storage module
  const originalStorage = require('../storage').storage;
  require('../storage').storage = testStorage;
  
  // Setup middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Setup auth and routes
  setupAuth(app);
  await registerRoutes(app);
  
  // Restore original storage after setup
  require('../storage').storage = originalStorage;
  
  return { app, storage: testStorage };
}

export async function createAuthenticatedUser(app: express.Application, storage: MemStorage) {
  // Create a test user
  const userData = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'testpassword123',
    name: 'Test User'
  };
  
  // Register user
  const registerResponse = await request(app)
    .post('/api/register')
    .send(userData);
    
  return {
    user: registerResponse.body,
    userData,
    agent: request.agent(app)
  };
}

export function createMockUser() {
  return {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedpassword',
    name: 'Test User',
    avatar: null,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    subscriptionStatus: 'inactive' as const,
    subscriptionEndDate: null,
    createdAt: new Date()
  };
}