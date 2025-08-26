// Mock passport service for testing
module.exports = {
  // Mock Google OAuth strategy
  googleStrategy: {
    authenticate: jest.fn()
  },
  
  // Mock serialize/deserialize functions
  serializeUser: jest.fn(),
  deserializeUser: jest.fn()
};
