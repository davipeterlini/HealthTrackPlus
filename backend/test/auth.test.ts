import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createTestApp, createMockUser } from './utils';
import type { Express } from 'express';
import { MemStorage } from '../storage';

describe('Authentication Routes', () => {
  let app: Express;
  let storage: MemStorage;

  beforeEach(async () => {
    const testApp = await createTestApp();
    app = testApp.app;
    storage = testApp.storage;
  });

  describe('POST /api/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User'
      };

      const response = await request(app)
        .post('/api/register')
        .send(userData)
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.username).toBe('newuser');
      expect(response.body.email).toBe('newuser@example.com');
      expect(response.body.password).toBeUndefined(); // password should not be returned
    });

    it('should return error for missing required fields', async () => {
      const userData = {
        username: 'newuser'
        // missing email and password
      };

      const response = await request(app)
        .post('/api/register')
        .send(userData)
        .expect(400);

      expect(response.body.message).toContain('required');
    });

    it('should return error for duplicate username', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      // Register first user
      await request(app)
        .post('/api/register')
        .send(userData)
        .expect(201);

      // Try to register with same username
      const duplicateData = {
        ...userData,
        email: 'different@example.com'
      };

      const response = await request(app)
        .post('/api/register')
        .send(duplicateData)
        .expect(400);

      expect(response.body.message).toContain('Username already exists');
    });
  });

  describe('POST /api/login', () => {
    beforeEach(async () => {
      // Create a test user for login tests
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      await request(app)
        .post('/api/register')
        .send(userData);
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        username: 'testuser',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.username).toBe('testuser');
      expect(response.body.password).toBeUndefined();
    });

    it('should login with email instead of username', async () => {
      const loginData = {
        username: 'test@example.com', // using email as username
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.email).toBe('test@example.com');
    });

    it('should return error for invalid credentials', async () => {
      const loginData = {
        username: 'testuser',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/login')
        .send(loginData)
        .expect(401);

      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should return error for non-existent user', async () => {
      const loginData = {
        username: 'nonexistent',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/login')
        .send(loginData)
        .expect(401);

      expect(response.body.message).toContain('Invalid credentials');
    });
  });

  describe('GET /api/user', () => {
    it('should return 401 for unauthenticated request', async () => {
      await request(app)
        .get('/api/user')
        .expect(401);
    });

    it('should return user data for authenticated request', async () => {
      // First register and login
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      const agent = request.agent(app);
      
      await agent
        .post('/api/register')
        .send(userData);

      const response = await agent
        .get('/api/user')
        .expect(200);

      expect(response.body.username).toBe('testuser');
      expect(response.body.password).toBeUndefined();
    });
  });

  describe('POST /api/logout', () => {
    it('should logout successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      const agent = request.agent(app);
      
      await agent
        .post('/api/register')
        .send(userData);

      await agent
        .post('/api/logout')
        .expect(200);

      // Verify user is logged out
      await agent
        .get('/api/user')
        .expect(401);
    });
  });
});