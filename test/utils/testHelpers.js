const mongoose = require('mongoose');

// Helper function to create mock user data
const createMockUser = (overrides = {}) => ({
  _id: new mongoose.Types.ObjectId(),
  googleId: '123456789',
  displayName: 'Test User',
  ...overrides
});

// Helper function to create mock blog data
const createMockBlog = (userId, overrides = {}) => ({
  _id: new mongoose.Types.ObjectId(),
  title: 'Test Blog',
  content: 'This is a test blog content that is long enough to pass validation',
  _user: userId,
  createdAt: new Date(),
  ...overrides
});

// Helper function to create mock request object
const createMockRequest = (overrides = {}) => ({
  body: {},
  params: {},
  query: {},
  user: null,
  ...overrides
});

// Helper function to create mock response object
const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn().mockReturnValue(res);
  return res;
};

// Helper function to create mock next function
const createMockNext = () => jest.fn();

// Helper function to clear all mocks
const clearAllMocks = () => {
  jest.clearAllMocks();
};

// Helper function to wait for async operations
const waitFor = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
  createMockUser,
  createMockBlog,
  createMockRequest,
  createMockResponse,
  createMockNext,
  clearAllMocks,
  waitFor
};
