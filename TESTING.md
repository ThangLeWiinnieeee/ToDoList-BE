# Unit Test Suite Documentation

## Overview
This project includes comprehensive unit tests for all core services, controllers, and middlewares using **Jest** testing framework.

## Test Structure

```
src/__tests__/
├── services/
│   ├── auth.service.test.js       # Authentication service tests
│   ├── todo.service.test.js      # Todo service tests
│   └── tag.service.test.js       # Tag service tests
├── controllers/
│   ├── auth.controller.test.js    # Auth controller tests
│   ├── todo.controller.test.js   # Todo controller tests
│   └── tag.controller.test.js    # Tag controller tests
└── middlewares/
    └── auth.middleware.test.js    # Auth middleware tests
```

## Available Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test -- auth.service.test.js

# Run tests matching pattern
npm test -- --testNamePattern="register"
```

## Test Coverage

### Auth Service Tests
- ✅ User registration with validation
- ✅ User login with credentials verification
- ✅ Get current user
- ✅ Update user profile
- ✅ Change password functionality
- ✅ JWT token generation
- ✅ JWT token verification

### Auth Controller Tests
- ✅ Register endpoint
- ✅ Login endpoint
- ✅ Logout endpoint
- ✅ Get current user endpoint
- ✅ Update profile endpoint
- ✅ Change password endpoint

### Todo Service Tests
- ✅ Create todo with validation
- ✅ Get all todos
- ✅ Get todo by ID
- ✅ Update todo
- ✅ Delete todo (soft delete)
- ✅ Get completed todos
- ✅ Get pending todos
- ✅ Toggle todo status

### Todo Controller Tests
- ✅ Create todo endpoint
- ✅ Get all todos endpoint
- ✅ Get completed todos endpoint
- ✅ Get pending todos endpoint
- ✅ Get todo by ID endpoint
- ✅ Update todo endpoint
- ✅ Delete todo endpoint
- ✅ Toggle todo status endpoint

### Tag Service Tests
- ✅ Create tag with validation
- ✅ Get all tags
- ✅ Get tag by ID
- ✅ Update tag
- ✅ Delete tag

### Tag Controller Tests
- ✅ Create tag endpoint
- ✅ Get all tags endpoint
- ✅ Get tag by ID endpoint
- ✅ Update tag endpoint
- ✅ Delete tag endpoint

### Auth Middleware Tests
- ✅ Valid token verification
- ✅ Missing token handling
- ✅ Invalid token format handling
- ✅ Invalid token rejection
- ✅ Correct token extraction

## Mocking Strategy

All tests use **Jest mocks** for external dependencies:
- Database repositories are mocked with `jest.mock()`
- External services are mocked with `jest.fn()`
- Logger utility is mocked to prevent console output during tests

## Test Patterns Used

### 1. **Mock Setup**
```javascript
jest.mock('../../repositories/todo.repository');
```

### 2. **Before Each Hook**
```javascript
beforeEach(() => {
  jest.clearAllMocks();
});
```

### 3. **Testing Success Cases**
```javascript
it('should successfully create a todo', async () => {
  // Arrange
  const mockTodo = { _id: '123', title: 'Test' };
  todoRepository.create.mockResolvedValue(mockTodo);

  // Act
  const result = await todoService.createTodo(userId, data);

  // Assert
  expect(result._id).toBe('123');
});
```

### 4. **Testing Error Cases**
```javascript
it('should throw error for invalid data', async () => {
  // Arrange
  todoService.createTodo.mockRejectedValue(new Error('Invalid'));

  // Act & Assert
  await expect(todoService.createTodo(userId, {})).rejects.toThrow('Invalid');
});
```

## Running Tests

### All Tests
```bash
npm test
```

### With Coverage Report
```bash
npm run test:coverage
```

This generates a coverage report in the console:
```
File      | % Stmts | % Branch | % Funcs | % Lines |
----------|---------|----------|---------|---------|
All files |   85.5  |   78.2   |   82.1  |   85.5  |
```

### Watch Mode (Development)
```bash
npm run test:watch
```

This will:
- Watch for file changes
- Re-run relevant tests automatically
- Keep Jest running in the terminal

## Test Naming Convention

Tests follow the **AAA pattern** (Arrange, Act, Assert):
```javascript
describe('Feature Name', () => {
  describe('Method Name', () => {
    it('should [expected behavior]', async () => {
      // Arrange: Setup test data
      
      // Act: Perform action
      
      // Assert: Check results
    });
  });
});
```

## Jest Configuration

Located in `package.json`:
```json
"jest": {
  "testEnvironment": "node",
  "collectCoverageFrom": [
    "src/**/*.js",
    "!src/config/**",
    "!src/app.js"
  ]
}
```

## Key Testing Libraries

- **Jest 29.7.0** - Test framework and assertion library
- **jest-mock-extended 3.0.5** - Enhanced mocking capabilities
- **supertest 6.3.3** - HTTP assertion library (for integration tests)

## Notes

- All tests are isolated and can run in any order
- Tests use mocked dependencies, so no actual database calls occur
- Tests run in Node.js environment (not browser)
- Each test should be independent and not rely on other tests
- Mock data should use realistic values for better test validity

## Future Enhancements

- [ ] Integration tests using supertest
- [ ] E2E tests with real MongoDB
- [ ] Performance benchmarks
- [ ] Load testing for API endpoints
- [ ] Error scenario edge cases
- [ ] Concurrent request handling tests
