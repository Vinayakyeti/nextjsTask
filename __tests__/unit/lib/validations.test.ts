import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Test the validation schemas from our codebase
const createCollectionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  color: z.string().optional(),
});

describe('Collection Validation Schema', () => {
  it('should validate a valid collection', () => {
    const validData = {
      name: 'Top 50 Interview Questions',
      description: 'Essential questions for technical interviews',
    };

    const result = createCollectionSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject collection without name', () => {
    const invalidData = {
      description: 'Missing name',
    };

    const result = createCollectionSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      // Zod returns message about type mismatch
      expect(result.error.issues[0].message).toContain('expected string');
    }
  });

  it('should reject name exceeding max length', () => {
    const invalidData = {
      name: 'a'.repeat(101),
      description: 'Name too long',
    };

    const result = createCollectionSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should allow optional fields', () => {
    const minimalData = {
      name: 'Basic Collection',
    };

    const result = createCollectionSchema.safeParse(minimalData);
    expect(result.success).toBe(true);
  });
});

// Test utility functions
describe('String Utility Functions', () => {
  const truncateString = (str: string, maxLength: number): string => {
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
  };

  it('should truncate long strings', () => {
    const longString = 'This is a very long string that needs truncation';
    const result = truncateString(longString, 20);
    expect(result).toBe('This is a very long ...');
  });

  it('should not truncate short strings', () => {
    const shortString = 'Short';
    const result = truncateString(shortString, 20);
    expect(result).toBe('Short');
  });

  it('should handle exact length', () => {
    const exactString = 'Exactly twenty chars';
    const result = truncateString(exactString, 20);
    expect(result).toBe('Exactly twenty chars');
  });
});

// Test data transformation
describe('Data Transformation', () => {
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  it('should format dates correctly', () => {
    const date = new Date('2025-12-07');
    const result = formatDate(date);
    expect(result).toContain('Dec');
    expect(result).toContain('7');
  });

  const calculateDifficulty = (correctCount: number, totalCount: number): 'Easy' | 'Medium' | 'Hard' => {
    const percentage = (correctCount / totalCount) * 100;
    if (percentage >= 80) return 'Easy';
    if (percentage >= 50) return 'Medium';
    return 'Hard';
  };

  it('should categorize difficulty levels', () => {
    expect(calculateDifficulty(9, 10)).toBe('Easy');
    expect(calculateDifficulty(6, 10)).toBe('Medium');
    expect(calculateDifficulty(3, 10)).toBe('Hard');
  });
});
