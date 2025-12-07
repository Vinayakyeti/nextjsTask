import { expect, afterAll, beforeAll } from 'vitest';

// Setup Vitest environment
beforeAll(() => {
  // Initialize test environment
  process.env.NEXTAUTH_URL = 'http://localhost:3000';
});

afterAll(() => {
  // Cleanup after tests
});
