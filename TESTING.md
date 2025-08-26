# Testing Guide

This project includes comprehensive unit and end-to-end (E2E) tests for both the backend and frontend components.

## Test Structure

```
├── test/                          # Backend tests
│   ├── setup.js                   # Test environment setup
│   ├── models/                    # Model tests
│   │   ├── User.test.js
│   │   └── Blog.test.js
│   ├── routes/                    # Route tests
│   │   ├── authRoutes.test.js
│   │   └── blogRoutes.test.js
│   ├── middlewares/               # Middleware tests
│   │   └── requireLogin.test.js
│   ├── e2e/                       # End-to-end tests
│   │   └── app.e2e.test.js
│   └── utils/                     # Test utilities
│       └── testHelpers.js
├── client/src/components/__tests__/ # Frontend tests
│   ├── App.test.js
│   ├── Header.test.js
│   └── BlogForm.test.js
├── jest.config.js                 # Jest configuration
└── .github/workflows/ci.yml       # CI/CD pipeline
```

## Prerequisites

Before running tests, install the required dependencies:

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

## Running Tests

### Backend Tests

#### Unit Tests
```bash
# Run all backend unit tests
npm run test:unit

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

#### E2E Tests
```bash
# Run all E2E tests
npm run test:e2e

# Run all tests (unit + E2E)
npm test
```

### Frontend Tests

```bash
# Run React component tests
cd client
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Test Types

### 1. Unit Tests

#### Backend Models
- **User Model**: Tests user creation, validation, and schema requirements
- **Blog Model**: Tests blog creation, timestamps, and user relationships

#### Backend Routes
- **Auth Routes**: Tests OAuth endpoints, authentication flow, and redirects
- **Blog Routes**: Tests CRUD operations, authentication middleware, and error handling

#### Backend Middleware
- **requireLogin**: Tests authentication requirements and error responses

#### Frontend Components
- **App**: Tests routing, component mounting, and Redux integration
- **Header**: Tests navigation, authentication display, and user menu
- **BlogForm**: Tests form validation, submission, and user interactions

### 2. End-to-End Tests

E2E tests use Puppeteer to test the complete user journey:

- **Landing Page**: Tests initial page load and login button
- **Authentication Flow**: Tests OAuth redirects and user sessions
- **Blog Dashboard**: Tests authenticated user experience
- **Blog Creation**: Tests form navigation and validation
- **Navigation**: Tests routing between different pages
- **Responsive Design**: Tests mobile and desktop layouts

### 3. Integration Tests

The route tests serve as integration tests, testing the complete request-response cycle with mocked dependencies.

## Test Configuration

### Jest Configuration (`jest.config.js`)
- Node.js test environment
- MongoDB in-memory server for database tests
- Coverage reporting
- Test timeout settings

### Test Setup (`test/setup.js`)
- MongoDB connection setup using `mongodb-memory-server`
- Database cleanup between tests
- Redis service mocking
- Global test configuration

### Test Utilities (`test/utils/testHelpers.js`)
- Mock data generators
- Request/response mocks
- Common testing helpers

## Mocking Strategy

### Backend Mocks
- **MongoDB**: In-memory database for isolated testing
- **Redis**: Mocked cache service
- **Passport**: Mocked authentication middleware
- **External APIs**: Mocked OAuth endpoints

### Frontend Mocks
- **Redux Store**: Mock store with test data
- **React Router**: Browser router for navigation testing
- **API Calls**: Mocked HTTP requests

## CI/CD Integration

The GitHub Actions workflow (`ci.yml`) automatically runs tests on:

- **Push to main branch**
- **Pull requests to main branch**

CI pipeline includes:
- Node.js 18.x and 20.x testing
- MongoDB and Redis services
- Backend and frontend dependency installation
- Unit and E2E test execution
- Build verification

## Writing New Tests

### Backend Test Template
```javascript
const mongoose = require('mongoose');
const { createMockUser, createMockRequest, createMockResponse } = require('../utils/testHelpers');

describe('Component Name', () => {
  let testUser;
  let mockReq;
  let mockRes;

  beforeEach(async () => {
    testUser = createMockUser();
    mockReq = createMockRequest({ user: testUser });
    mockRes = createMockResponse();
  });

  it('should perform expected behavior', async () => {
    // Test implementation
    expect(result).toBe(expectedValue);
  });
});
```

### Frontend Test Template
```javascript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);

describe('Component Name', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      // Mock Redux state
    });
  });

  it('should render correctly', () => {
    render(
      <Provider store={store}>
        <Component />
      </Provider>
    );
    
    expect(screen.getByText(/expected text/i)).toBeInTheDocument();
  });
});
```

## Best Practices

1. **Test Isolation**: Each test should be independent and not rely on other tests
2. **Mock External Dependencies**: Use mocks for databases, APIs, and external services
3. **Meaningful Assertions**: Test behavior, not implementation details
4. **Descriptive Test Names**: Use clear, descriptive test names that explain the expected behavior
5. **Coverage**: Aim for high test coverage, especially for critical business logic
6. **Performance**: Keep tests fast by using in-memory databases and efficient mocks

## Troubleshooting

### Common Issues

1. **MongoDB Connection Errors**: Ensure `mongodb-memory-server` is properly installed
2. **Test Timeouts**: Increase timeout in `jest.config.js` for slow tests
3. **Mock Issues**: Verify mock implementations match the actual service interfaces
4. **Environment Variables**: Ensure test environment variables are properly set

### Debug Mode

Run tests with verbose output:
```bash
npm test -- --verbose
```

### Coverage Reports

Generate detailed coverage reports:
```bash
npm run test:coverage
```

Coverage reports will be available in the `coverage/` directory.

## Performance Considerations

- **Parallel Execution**: Jest runs tests in parallel by default
- **Database Cleanup**: Tests clean up after themselves to prevent data pollution
- **Mock Efficiency**: Use lightweight mocks for external dependencies
- **Test Isolation**: Each test uses fresh instances to prevent interference
