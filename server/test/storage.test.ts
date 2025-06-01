import { describe, it, expect, beforeEach } from 'vitest';
import { MemStorage } from '../storage';
import type { InsertUser } from '@shared/schema';

describe('Storage Layer', () => {
  let storage: MemStorage;

  beforeEach(() => {
    storage = new MemStorage();
  });

  describe('User Management', () => {
    it('should create a new user', async () => {
      const userData: InsertUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User'
      };

      const user = await storage.createUser(userData);

      expect(user).toBeDefined();
      expect(user.id).toBe(1);
      expect(user.username).toBe('testuser');
      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('Test User');
    });

    it('should retrieve user by id', async () => {
      const userData: InsertUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User'
      };

      const createdUser = await storage.createUser(userData);
      const retrievedUser = await storage.getUser(createdUser.id);

      expect(retrievedUser).toBeDefined();
      expect(retrievedUser?.id).toBe(createdUser.id);
      expect(retrievedUser?.username).toBe('testuser');
    });

    it('should retrieve user by username', async () => {
      const userData: InsertUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User'
      };

      await storage.createUser(userData);
      const user = await storage.getUserByUsername('testuser');

      expect(user).toBeDefined();
      expect(user?.username).toBe('testuser');
    });

    it('should retrieve user by email', async () => {
      const userData: InsertUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User'
      };

      await storage.createUser(userData);
      const user = await storage.getUserByEmail('test@example.com');

      expect(user).toBeDefined();
      expect(user?.email).toBe('test@example.com');
    });

    it('should update user information', async () => {
      const userData: InsertUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User'
      };

      const user = await storage.createUser(userData);
      const updatedUser = await storage.updateUser(user.id, { name: 'Updated Name' });

      expect(updatedUser.name).toBe('Updated Name');
      expect(updatedUser.username).toBe('testuser'); // unchanged
    });
  });

  describe('Medical Exams', () => {
    let userId: number;

    beforeEach(async () => {
      const userData: InsertUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User'
      };
      const user = await storage.createUser(userData);
      userId = user.id;
    });

    it('should create a medical exam', async () => {
      const examData = {
        userId,
        name: 'Blood Test',
        date: new Date(),
        fileUrl: '/uploads/test.pdf',
        type: 'blood',
        status: 'Analyzing',
        results: null,
        aiAnalysis: null,
        anomalies: false,
        riskLevel: 'normal',
        aiProcessed: false
      };

      const exam = await storage.createMedicalExam(examData);

      expect(exam).toBeDefined();
      expect(exam.id).toBe(1);
      expect(exam.name).toBe('Blood Test');
      expect(exam.userId).toBe(userId);
    });

    it('should retrieve medical exams for user', async () => {
      const examData = {
        userId,
        name: 'Blood Test',
        date: new Date(),
        fileUrl: '/uploads/test.pdf',
        type: 'blood',
        status: 'Analyzing',
        results: null,
        aiAnalysis: null,
        anomalies: false,
        riskLevel: 'normal',
        aiProcessed: false
      };

      await storage.createMedicalExam(examData);
      const exams = await storage.getMedicalExams(userId);

      expect(exams).toBeDefined();
      expect(exams.length).toBe(1);
      expect(exams[0].name).toBe('Blood Test');
    });
  });

  describe('Dashboard Stats', () => {
    let userId: number;

    beforeEach(async () => {
      const userData: InsertUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User'
      };
      const user = await storage.createUser(userData);
      userId = user.id;
    });

    it('should return dashboard statistics', async () => {
      const stats = await storage.getDashboardStats(userId);

      expect(stats).toBeDefined();
      expect(typeof stats.totalSteps).toBe('number');
      expect(typeof stats.totalCalories).toBe('number');
      expect(typeof stats.avgSleep).toBe('number');
      expect(typeof stats.waterIntake).toBe('number');
      expect(Array.isArray(stats.weeklyProgress.steps)).toBe(true);
      expect(Array.isArray(stats.weeklyProgress.calories)).toBe(true);
    });
  });
});