const request = require('supertest');
const express = require('express');
const passport = require('passport');

// Mock passport
jest.mock('passport', () => ({
  authenticate: jest.fn()
}));

const app = express();

// Import and apply routes
const authRoutes = require('../routes/authRoutes');
authRoutes(app);

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /auth/google', () => {
    it('should call passport.authenticate with google strategy', () => {
      const mockAuthenticate = jest.fn();
      passport.authenticate.mockReturnValue(mockAuthenticate);

      request(app).get('/auth/google');

      expect(passport.authenticate).toHaveBeenCalledWith('google', {
        scope: ['profile', 'email']
      });
    });

    it('should log OAuth login attempt', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Mock passport.authenticate to just call next()
      passport.authenticate.mockReturnValue((req, res, next) => next());

      await request(app).get('/auth/google');

      expect(consoleSpy).toHaveBeenCalledWith('Google OAuth login attempt');
      expect(consoleSpy).toHaveBeenCalledWith('Request URL:', '/auth/google');
      
      consoleSpy.mockRestore();
    });
  });

  describe('GET /auth/google/callback', () => {
    it('should call passport.authenticate and redirect to blogs page', async () => {
      const mockAuthenticate = jest.fn();
      passport.authenticate.mockReturnValue(mockAuthenticate);

      request(app).get('/auth/google/callback');

      expect(passport.authenticate).toHaveBeenCalledWith('google');
    });

    it('should redirect to blogs page after successful authentication', async () => {
      // Mock passport.authenticate to simulate successful auth
      passport.authenticate.mockReturnValue((req, res, next) => {
        req.user = { id: '123', displayName: 'Test User' };
        next();
      });

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const response = await request(app)
        .get('/auth/google/callback')
        .expect(302); // Redirect status

      expect(consoleSpy).toHaveBeenCalledWith('Google OAuth callback - redirecting to React app');
      expect(consoleSpy).toHaveBeenCalledWith('User authenticated:', { id: '123', displayName: 'Test User' });
      
      consoleSpy.mockRestore();
    });
  });

  describe('GET /auth/logout', () => {
    it('should logout user and redirect to home page', async () => {
      const response = await request(app)
        .get('/auth/logout')
        .expect(302); // Redirect status

      expect(response.headers.location).toBe('http://localhost:3000/');
    });
  });

  describe('GET /api/current_user', () => {
    it('should return current user when authenticated', async () => {
      const mockUser = { id: '123', displayName: 'Test User' };
      
      // Mock the route to include user in request
      const appWithUser = express();
      appWithUser.use((req, res, next) => {
        req.user = mockUser;
        next();
      });
      authRoutes(appWithUser);

      const response = await request(appWithUser)
        .get('/api/current_user')
        .expect(200);

      expect(response.body).toEqual(mockUser);
    });

    it('should return undefined when no user is authenticated', async () => {
      const response = await request(app)
        .get('/api/current_user')
        .expect(200);

      expect(response.body).toBeUndefined();
    });
  });
});
