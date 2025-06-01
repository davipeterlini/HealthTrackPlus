import { expect, beforeEach, afterEach } from 'vitest';
import { MemStorage } from '../storage';

// Global test storage instance
export let testStorage: MemStorage;

// Setup test environment
beforeEach(async () => {
  // Create fresh storage for each test
  testStorage = new MemStorage();
});

afterEach(async () => {
  // Clean up after each test
  testStorage = null as any;
});

// Mock environment variables for tests
process.env.SESSION_SECRET = 'test-secret-key';
process.env.NODE_ENV = 'test';