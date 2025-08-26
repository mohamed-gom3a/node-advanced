const puppeteer = require('puppeteer');

describe('Blog Application E2E Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    // Set viewport for consistent testing
    await page.setViewport({ width: 1280, height: 720 });
  });

  afterEach(async () => {
    await page.close();
  });

  describe('Landing Page', () => {
    it('should display landing page with login button', async () => {
      await page.goto('http://localhost:3000');
      
      // Wait for page to load
      await page.waitForSelector('.container');
      
      // Check if login button exists
      const loginButton = await page.$('a[href="/auth/google"]');
      expect(loginButton).toBeTruthy();
      
      // Check page title or content
      const pageContent = await page.content();
      expect(pageContent).toContain('Blogster');
    });

    it('should navigate to Google OAuth when login button is clicked', async () => {
      await page.goto('http://localhost:3000');
      
      // Click login button
      await page.click('a[href="/auth/google"]');
      
      // Wait for navigation (this will redirect to Google OAuth)
      await page.waitForTimeout(1000);
      
      // Check if we're redirected to Google OAuth
      const currentUrl = page.url();
      expect(currentUrl).toContain('accounts.google.com');
    });
  });

  describe('Authentication Flow', () => {
    it('should redirect to blogs page after successful authentication', async () => {
      // This test would require mocking Google OAuth or using test credentials
      // For now, we'll test the redirect behavior
      await page.goto('http://localhost:3000/auth/google/callback');
      
      // Wait for redirect
      await page.waitForTimeout(2000);
      
      // Should redirect to blogs page
      const currentUrl = page.url();
      expect(currentUrl).toContain('/blogs');
    });
  });

  describe('Blog Dashboard', () => {
    it('should display blogs dashboard when authenticated', async () => {
      // Mock authentication by setting localStorage or cookies
      await page.goto('http://localhost:3000');
      
      // Set mock user data in localStorage
      await page.evaluate(() => {
        localStorage.setItem('user', JSON.stringify({
          id: '123',
          displayName: 'Test User'
        }));
      });
      
      // Navigate to blogs page
      await page.goto('http://localhost:3000/blogs');
      
      // Wait for dashboard to load
      await page.waitForSelector('.container');
      
      // Check if dashboard elements exist
      const dashboardContent = await page.content();
      expect(dashboardContent).toContain('Blogs');
    });

    it('should show create blog button when authenticated', async () => {
      await page.goto('http://localhost:3000');
      
      // Set mock user data
      await page.evaluate(() => {
        localStorage.setItem('user', JSON.stringify({
          id: '123',
          displayName: 'Test User'
        }));
      });
      
      await page.goto('http://localhost:3000/blogs');
      
      // Look for create blog button
      const createButton = await page.$('a[href="/blogs/new"]');
      expect(createButton).toBeTruthy();
    });
  });

  describe('Blog Creation', () => {
    it('should navigate to blog creation form', async () => {
      await page.goto('http://localhost:3000');
      
      // Set mock user data
      await page.evaluate(() => {
        localStorage.setItem('user', JSON.stringify({
          id: '123',
          displayName: 'Test User'
        }));
      });
      
      await page.goto('http://localhost:3000/blogs/new');
      
      // Check if form elements exist
      const titleInput = await page.$('input[name="title"]');
      const contentInput = await page.$('textarea[name="content"]');
      
      expect(titleInput).toBeTruthy();
      expect(contentInput).toBeTruthy();
    });

    it('should display form validation errors for empty fields', async () => {
      await page.goto('http://localhost:3000');
      
      // Set mock user data
      await page.evaluate(() => {
        localStorage.setItem('user', JSON.stringify({
          id: '123',
          displayName: 'Test User'
        }));
      });
      
      await page.goto('http://localhost:3000/blogs/new');
      
      // Try to submit empty form
      const submitButton = await page.$('button[type="submit"]');
      await submitButton.click();
      
      // Wait for validation errors
      await page.waitForTimeout(500);
      
      // Check for validation messages
      const pageContent = await page.content();
      expect(pageContent).toContain('You must provide a title');
      expect(pageContent).toContain('You must provide some content');
    });
  });

  describe('Navigation', () => {
    it('should navigate between different pages', async () => {
      await page.goto('http://localhost:3000');
      
      // Check landing page
      let currentUrl = page.url();
      expect(currentUrl).toContain('localhost:3000');
      
      // Navigate to blogs
      await page.goto('http://localhost:3000/blogs');
      currentUrl = page.url();
      expect(currentUrl).toContain('/blogs');
      
      // Navigate back to home
      await page.goto('http://localhost:3000');
      currentUrl = page.url();
      expect(currentUrl).toContain('localhost:3000');
    });
  });

  describe('Responsive Design', () => {
    it('should be responsive on mobile devices', async () => {
      // Set mobile viewport
      await page.setViewport({ width: 375, height: 667 });
      
      await page.goto('http://localhost:3000');
      
      // Check if page loads properly on mobile
      const pageContent = await page.content();
      expect(pageContent).toContain('Blogster');
      
      // Check if elements are properly sized for mobile
      const container = await page.$('.container');
      const boxModel = await container.boundingBox();
      
      expect(boxModel.width).toBeLessThanOrEqual(375);
    });
  });
});
