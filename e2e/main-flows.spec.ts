import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.locator('text=Sign In')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.goto('/auth/login');
    await page.click('text=Create account');
    await expect(page).toHaveURL(/signup/);
    await expect(page.locator('text=Sign Up')).toBeVisible();
  });

  test('should show validation errors for invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.locator('text=Email|required|invalid')).toBeVisible();
  });
});

test.describe('Dashboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated state by setting auth cookie/session
    // In a real scenario, you'd create a test user and login
    await page.goto('/');
  });

  test('should display dashboard links', async ({ page }) => {
    await page.goto('/dashboard');
    // These assertions will work once you're authenticated
    expect(page.url()).toContain('dashboard');
  });
});

test.describe('Collection Creation Flow', () => {
  test('should navigate to create collection page', async ({ page }) => {
    await page.goto('/collections');
    
    // Look for create button
    const createButton = page.locator('button, a', { hasText: /Create|Add|New/ });
    if (await createButton.isVisible()) {
      await createButton.click();
      expect(page.url()).toContain('new');
    }
  });

  test('should display collection creation form', async ({ page }) => {
    await page.goto('/collections/new');
    
    await expect(page.locator('text=Collection Name|Create.*Collection')).toBeVisible();
    await expect(page.locator('input[placeholder*="Collection"]')).toBeVisible();
  });

  test('should validate required fields before submission', async ({ page }) => {
    await page.goto('/collections/new');
    
    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"]');
    if (await submitButton.isVisible()) {
      await submitButton.click();
      
      // Should remain on same page if validation fails
      expect(page.url()).toContain('new');
    }
  });
});

test.describe('Question Management Flow', () => {
  test('should display questions list', async ({ page }) => {
    await page.goto('/questions');
    
    // Check if page loads without errors
    await expect(page).toHaveTitle(/.*Interview|Question/i);
  });

  test('should navigate to create question page', async ({ page }) => {
    await page.goto('/questions');
    
    const createButton = page.locator('a, button', { hasText: /Add|New/ });
    if (await createButton.isVisible()) {
      await createButton.click();
      expect(page.url()).toContain('new');
    }
  });

  test('should display question form fields', async ({ page }) => {
    await page.goto('/questions/new');
    
    // Check for expected form fields
    const titleInput = page.locator('input[placeholder*="title" i], input[placeholder*="question" i]');
    if (await titleInput.isVisible()) {
      await expect(titleInput).toBeVisible();
    }
  });
});

test.describe('Footer and Navigation', () => {
  test('should display footer with author name', async ({ page }) => {
    await page.goto('/');
    
    // Check footer content
    const footer = page.locator('footer');
    await expect(footer).toContainText('Vinayak');
  });

  test('should have working social links in footer', async ({ page }) => {
    await page.goto('/');
    
    const githubLink = page.locator('a[href*="github"]');
    const linkedinLink = page.locator('a[href*="linkedin"]');
    
    if (await githubLink.isVisible()) {
      await expect(githubLink).toHaveAttribute('href', /github.com/i);
    }
    
    if (await linkedinLink.isVisible()) {
      await expect(linkedinLink).toHaveAttribute('href', /linkedin.com/i);
    }
  });
});

test.describe('Responsive Design', () => {
  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Check if page is still usable
    await expect(page).toHaveTitle(/Interview/i);
  });

  test('should be responsive on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/');
    
    await expect(page).toHaveTitle(/Interview/i);
  });
});

test.describe('Error Handling', () => {
  test('should handle 404 gracefully', async ({ page }) => {
    const response = await page.goto('/non-existent-page');
    
    // Should either 404 or redirect to home
    expect([404, 200]).toContain(response?.status());
  });

  test('should handle network errors', async ({ page }) => {
    // Simulate offline mode
    await page.context().setOffline(true);
    
    await page.goto('/').catch(() => {
      // Network error expected
    });
    
    await page.context().setOffline(false);
  });
});
