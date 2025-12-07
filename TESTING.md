# Testing Guide

This guide provides setup instructions and best practices for testing the Interview Prep Hub application.

## 📋 Test Stack Overview

We use a comprehensive testing approach:

### Unit Tests (Vitest)
- **Purpose**: Test individual functions, utilities, and validation logic
- **Framework**: Vitest (fast, ESM-native, TypeScript-ready)
- **Location**: `__tests__/unit/`
- **Examples**: Validation schemas, utility functions, data transformations

### Integration Tests (Vitest)
- **Purpose**: Test API routes, server actions, and their interactions
- **Framework**: Vitest with mocking capabilities
- **Location**: `__tests__/integration/`
- **Examples**: Collection creation logic, authorization checks, error handling

### E2E Tests (Playwright)
- **Purpose**: Test complete user workflows in real browser
- **Framework**: Playwright (cross-browser support)
- **Location**: `e2e/`
- **Examples**: Login flow, creating collections, managing questions

## 🚀 Quick Start

### 1. Installation

All dependencies are already installed. To verify:

```bash
# Check if test commands work
npm run test:unit --version
npm run test:integration --version
npm run test:e2e --version
```

### 2. Running Tests

```bash
# Run all unit tests
npm run test:unit

# Run all integration tests
npm run test:integration

# Run all E2E tests (requires dev server)
npm run test:e2e

# Run all tests with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch

# Run specific test file
npm run test:unit -- validations.test.ts
```

## 📁 Folder Structure

```
project-root/
├── __tests__/
│   ├── unit/
│   │   ├── lib/
│   │   │   └── validations.test.ts       # Validation and utility tests
│   │   └── components/
│   │       └── (component tests here)
│   └── integration/
│       ├── api/
│       │   └── collections.test.ts       # API integration tests
│       └── server-actions/
│           └── (server action tests here)
├── e2e/
│   └── main-flows.spec.ts                # E2E user flow tests
├── jest.config.ts                        # Jest configuration
├── jest.setup.ts                         # Jest setup
├── vitest.config.ts                      # Vitest configuration
├── vitest.setup.ts                       # Vitest setup
└── playwright.config.ts                  # Playwright configuration
```

## 🧪 Test Examples

### Unit Test Example

File: `__tests__/unit/lib/validations.test.ts`

```typescript
describe('Collection Validation Schema', () => {
  it('should validate a valid collection', () => {
    const validData = {
      name: 'Top 50 Interview Questions',
      description: 'Essential questions',
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
  });
});
```

**What it tests:**
- Zod validation schemas work correctly
- Required fields are enforced
- Optional fields are handled properly
- Error messages are appropriate

### Integration Test Example

File: `__tests__/integration/api/collections.test.ts`

```typescript
describe('Collection Server Actions', () => {
  describe('Collection validation logic', () => {
    it('should validate correct collection data', () => {
      const result = validateCollection({
        name: 'Valid Collection',
        description: 'Test',
      });

      expect(result.success).toBe(true);
    });

    it('should handle authorization checks', () => {
      const authorizeUser = (userId: string, resourceOwnerId: string) => {
        return userId === resourceOwnerId;
      };

      expect(authorizeUser('user-1', 'user-1')).toBe(true);
      expect(authorizeUser('user-1', 'user-2')).toBe(false);
    });
  });
});
```

**What it tests:**
- Server action logic without network calls
- Authorization and permissions
- Data transformation for responses
- Error handling scenarios

### E2E Test Example

File: `e2e/main-flows.spec.ts`

```typescript
test.describe('Collection Creation Flow', () => {
  test('should display collection creation form', async ({ page }) => {
    await page.goto('/collections/new');
    
    await expect(page.locator('text=Collection Name')).toBeVisible();
    await expect(page.locator('input[placeholder*="Collection"]')).toBeVisible();
  });

  test('should validate required fields before submission', async ({ page }) => {
    await page.goto('/collections/new');
    
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    expect(page.url()).toContain('new');
  });
});
```

**What it tests:**
- Complete user workflows in actual browser
- UI is displayed correctly
- Form validation works
- Navigation flows properly
- Footer contains correct information

## 🔧 Configuration Details

### Jest Config (`jest.config.ts`)
- Test environment: jsdom (for React components)
- Module mapping for TypeScript `@/` aliases
- Coverage thresholds: 50% (minimum)
- Setup files for testing utilities

### Vitest Config (`vitest.config.ts`)
- Global test utilities (describe, it, expect)
- JSdom environment for DOM testing
- Coverage reporting (text, JSON, HTML)
- Alias resolution matching production

### Playwright Config (`playwright.config.ts`)
- Tests cross-browser: Chromium, Firefox, WebKit
- Auto-starts dev server (`npm run dev`)
- Screenshots on test failure
- Trace recording for debugging

## 📊 Coverage Goals

Target coverage thresholds (configurable in `jest.config.ts`):

```typescript
coverageThreshold: {
  global: {
    branches: 50,      // Control flow coverage
    functions: 50,     // Function coverage
    lines: 50,         // Line coverage
    statements: 50,    // Statement coverage
  },
}
```

To see coverage report:

```bash
npm run test:coverage
# Open coverage/index.html in browser
```

## 🏃 Continuous Integration

These tests are designed to run in CI/CD pipelines:

```bash
# In GitHub Actions or similar
npm run test:unit
npm run test:integration
npm run test:e2e    # Requires running dev server
```

## 📝 Writing New Tests

### For a new utility function:

```typescript
// lib/utils/myHelper.ts
export const myHelper = (input: string) => {
  return input.toUpperCase();
};

// __tests__/unit/lib/myHelper.test.ts
import { describe, it, expect } from 'vitest';
import { myHelper } from '@/lib/utils/myHelper';

describe('myHelper', () => {
  it('should convert to uppercase', () => {
    expect(myHelper('hello')).toBe('HELLO');
  });
});
```

### For a new page/component:

```typescript
// e2e/my-new-page.spec.ts
import { test, expect } from '@playwright/test';

test.describe('My New Page', () => {
  test('should display content', async ({ page }) => {
    await page.goto('/my-page');
    await expect(page.locator('h1')).toBeVisible();
  });
});
```

### For a server action:

```typescript
// __tests__/integration/server-actions/myAction.test.ts
import { describe, it, expect } from 'vitest';

describe('myServerAction', () => {
  it('should perform expected operation', () => {
    // Test logic here
    expect(result).toBe(expected);
  });
});
```

## 🐛 Debugging Tests

### Debug Vitest tests:

```bash
# Run with Node debugger
node --inspect-brk ./node_modules/vitest/vitest.mjs run
```

### Debug Playwright tests:

```bash
# Run with Playwright Inspector
PWDEBUG=1 npm run test:e2e
```

### View HTML coverage report:

```bash
npm run test:coverage
# Then open coverage/index.html
```

## ✅ Best Practices

1. **Unit Tests**: Test pure functions and validation logic
2. **Integration Tests**: Test business logic and API interactions
3. **E2E Tests**: Test critical user workflows only
4. **Keep tests isolated**: Each test should be independent
5. **Use descriptive names**: Test name should explain what it does
6. **Mock external dependencies**: Use mocks for APIs, databases
7. **Test edge cases**: Empty inputs, null values, errors
8. **Don't test implementation**: Test behavior instead

## 📚 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Jest Documentation](https://jestjs.io/)
- [Testing Library Best Practices](https://testing-library.com/)

## 🤝 Contributing Tests

When adding new features:

1. Write unit tests for utilities/validations
2. Write integration tests for server actions
3. Write E2E tests for critical user flows
4. Ensure coverage stays above thresholds
5. Run all tests before committing

```bash
# Before pushing:
npm run test:unit
npm run test:integration
npm run test:e2e
```
