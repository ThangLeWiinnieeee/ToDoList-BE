# Test Migration Guide - camelCase Updates

## Overview
All field names have been standardized to **camelCase**. This guide helps update unit tests to match the new naming convention.

---

## Quick Reference Table

| Old (snake_case) | New (camelCase) | Used In |
|------------------|-----------------|----------|
| `password_hash` | `passwordHash` | User model |
| `user_id` | `userId` | Todo, Tag models |
| `is_done` | `isDone` | Todo model |
| `due_date` | `dueDate` | Todo model |
| `tag_ids` | `tagIds` | Todo model |
| `deleted_at` | `deletedAt` | Todo model (soft delete) |
| `created_at` | `createdAt` | All models |
| `updated_at` | `updatedAt` | All models |

---

## Auth Service Tests

📁 **File**: `src/__tests__/services/auth.service.test.js`

### Changes Needed:

#### 1. Password Hash Field
```javascript
// BEFORE:
const mockUser = { _id: id, email: 'test@example.com', password_hash: 'hashed' };

// AFTER:
const mockUser = { _id: id, email: 'test@example.com', passwordHash: 'hashed' };
```

#### 2. Response Fields
```javascript
// BEFORE (in expect statements):
expect(result.user.created_at).toBeDefined();
expect(result.user.updated_at).toBeDefined();

// AFTER:
expect(result.user.createdAt).toBeDefined();
expect(result.user.updatedAt).toBeDefined();
```

#### 3. Mock Repository Calls
```javascript
// BEFORE:
jest.spyOn(userRepository, 'create').mockResolvedValue({
  _id: id,
  email: 'test@example.com',
  password_hash: 'hashed',
  name: 'Test User'
});

// AFTER:
jest.spyOn(userRepository, 'create').mockResolvedValue({
  _id: id,
  email: 'test@example.com',
  passwordHash: 'hashed',
  name: 'Test User'
});
```

---

## Todo Service Tests

📁 **File**: `src/__tests__/services/todo.service.test.js`

### Changes Needed:

#### 1. Create Todo Test Data
```javascript
// BEFORE:
const todoData = {
  title: 'Test Todo',
  user_id: userId,
  is_done: false,
  due_date: new Date(),
  tag_ids: []
};

// AFTER:
const todoData = {
  title: 'Test Todo',
  userId: userId,
  isDone: false,
  dueDate: new Date(),
  tagIds: []
};
```

#### 2. Mock Response Objects
```javascript
// BEFORE:
const mockTodo = {
  _id: todoId,
  user_id: userId,
  title: 'Test',
  is_done: false,
  created_at: new Date(),
  deleted_at: null
};

// AFTER:
const mockTodo = {
  _id: todoId,
  userId: userId,
  title: 'Test',
  isDone: false,
  createdAt: new Date(),
  deletedAt: null
};
```

#### 3. Update Toggle Status Tests
```javascript
// BEFORE:
const todo = { ...mockTodo, is_done: true };
updateData = { is_done: false };

// AFTER:
const todo = { ...mockTodo, isDone: true };
updateData = { isDone: false };
```

#### 4. FindByStatus Mock Calls
```javascript
// BEFORE:
jest.spyOn(todoRepository, 'findByStatus')
  .mockResolvedValue([{ ...mockTodo, is_done: true }]);

// AFTER:
jest.spyOn(todoRepository, 'findByStatus')
  .mockResolvedValue([{ ...mockTodo, isDone: true }]);
```

---

## Tag Service Tests

📁 **File**: `src/__tests__/services/tag.service.test.js`

### Changes Needed:

#### 1. Create Tag Test Data
```javascript
// BEFORE:
const tagData = {
  user_id: userId,
  name: 'Important',
  color: '#FF5733'
};

// AFTER:
const tagData = {
  userId: userId,
  name: 'Important',
  color: '#FF5733'
};
```

#### 2. Mock Tag Objects
```javascript
// BEFORE:
const mockTag = {
  _id: tagId,
  user_id: userId,
  name: 'Important',
  color: '#FF5733'
};

// AFTER:
const mockTag = {
  _id: tagId,
  userId: userId,
  name: 'Important',
  color: '#FF5733'
};
```

---

## Auth Controller Tests

📁 **File**: `src/__tests__/controllers/auth.controller.test.js`

### Changes Needed:

#### 1. Request Body Data
```javascript
// BEFORE:
const requestBody = {
  email: 'user@example.com',
  password: 'testpass123',
  name: 'Test User'
};

// AFTER (same - this layer doesn't change):
const requestBody = {
  email: 'user@example.com',
  password: 'testpass1234', // min 8 chars now
  name: 'Test User'
};
```

#### 2. Service Mock Returns
```javascript
// BEFORE:
jest.spyOn(authService, 'register').mockResolvedValue({
  user: { id: userId, email: 'user@example.com', created_at: new Date() },
  token: 'jwt-token'
});

// AFTER:
jest.spyOn(authService, 'register').mockResolvedValue({
  user: { id: userId, email: 'user@example.com', createdAt: new Date() },
  token: 'jwt-token'
});
```

#### 3. Response Expectations
```javascript
// BEFORE:
expect(res.json).toHaveBeenCalledWith(
  expect.objectContaining({
    data: expect.objectContaining({
      user: expect.objectContaining({
        created_at: expect.any(Date)
      })
    })
  })
);

// AFTER:
expect(res.json).toHaveBeenCalledWith(
  expect.objectContaining({
    data: expect.objectContaining({
      user: expect.objectContaining({
        createdAt: expect.any(Date)
      })
    })
  })
);
```

---

## Todo Controller Tests

📁 **File**: `src/__tests__/controllers/todo.controller.test.js`

### Changes Needed:

#### 1. Request Body
```javascript
// BEFORE:
req.body = {
  title: 'Buy milk',
  is_done: false,
  due_date: '2024-03-25',
  tag_ids: []
};

// AFTER:
req.body = {
  title: 'Buy milk',
  isDone: false,
  dueDate: '2024-03-25',
  tagIds: []
};
```

#### 2. Service Mock Returns
```javascript
// BEFORE:
jest.spyOn(todoService, 'createTodo').mockResolvedValue({
  _id: todoId,
  user_id: userId,
  title: 'Buy milk',
  is_done: false,
  tag_ids: []
});

// AFTER:
jest.spyOn(todoService, 'createTodo').mockResolvedValue({
  _id: todoId,
  userId: userId,
  title: 'Buy milk',
  isDone: false,
  tagIds: []
});
```

---

## Tag Controller Tests

📁 **File**: `src/__tests__/controllers/tag.controller.test.js`

### Changes Needed:

#### 1. Request Body (stays same - validation middleware handles)

#### 2. Service Mock Returns
```javascript
// BEFORE:
jest.spyOn(tagService, 'createTag').mockResolvedValue({
  _id: tagId,
  user_id: userId,
  name: 'Important',
  color: '#FF5733'
});

// AFTER:
jest.spyOn(tagService, 'createTag').mockResolvedValue({
  _id: tagId,
  userId: userId,
  name: 'Important',
  color: '#FF5733'
});
```

---

## Auth Middleware Tests

📁 **File**: `src/__tests__/middlewares/auth.middleware.test.js`

**Status**: ✅ **No changes needed** - This middleware doesn't use field names directly.

---

## Additional Password Requirements

### Password Length Updated
- **Old minimum**: 6 characters
- **New minimum**: 8 characters

### Update Test Cases:
```javascript
// Update password validation tests:

// test('should reject password with 6 characters', () => {
//   const result = schema.validate({ password: 'abc123' });
//   expect(result.error).toBeDefined();
// });

test('should reject password with 7 characters', () => {
  const result = schema.validate({ password: 'abc1234' });
  expect(result.error).toBeDefined();
});

test('should accept password with 8 characters', () => {
  const result = schema.validate({ password: 'abc12345' });
  expect(result.error).toBeUndefined();
});
```

---

## Validation Middleware Tests

These are **NEW** tests to consider adding:

### Example Validation Middleware Tests:
```javascript
describe('Validation Middleware', () => {
  it('should reject requests with invalid email', async () => {
    const req = { body: { email: 'invalid', password: 'pass1234', name: 'Test' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    
    validate(registerSchema)(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false })
    );
  });

  it('should pass valid request to next middleware', async () => {
    const req = { body: { email: 'test@example.com', password: 'pass1234', name: 'Test' } };
    const res = {};
    const next = jest.fn();
    
    validate(registerSchema)(req, res, next);
    
    expect(next).toHaveBeenCalled();
  });

  it('should strip unknown fields', async () => {
    const req = { body: { email: 'test@example.com', password: 'pass1234', name: 'Test', unknown: 'field' } };
    const res = {};
    const next = jest.fn();
    
    validate(registerSchema)(req, res, next);
    
    expect(req.body.unknown).toBeUndefined();
  });
});
```

---

## Quick Start: Update All Tests at Once

Use this regex pattern to replace field names:

### Find & Replace in Test Files:

```
Find:    user_id
Replace: userId

Find:    is_done
Replace: isDone

Find:    due_date
Replace: dueDate

Find:    tag_ids
Replace: tagIds

Find:    deleted_at
Replace: deletedAt

Find:    password_hash
Replace: passwordHash

Find:    created_at
Replace: createdAt

Find:    updated_at
Replace: updatedAt
```

---

## Testing the Changes

```bash
# Update all test files first
# Then run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- auth.service.test.js
```

---

## Common Issues & Solutions

### Issue: "TypeError: Cannot read property 'userId' of undefined"
**Solution**: Check mock object has camelCase field names

### Issue: "Expected: 'Test', Received: 'testpass123'"
**Solution**: Password minimum length is now 8 characters (was 6)

### Issue: Tests still failing
**Solution**: 
1. Check all mock objects use camelCase
2. Verify validation schemas in routes are correct
3. Ensure all field mappings in services are updated

---

## Verification Checklist

After updating tests, verify:

- [ ] All snake_case fields renamed to camelCase
- [ ] Mock objects updated throughout
- [ ] Password tests updated (min 8 chars)
- [ ] Response expectations match new field names
- [ ] All test files run without errors
- [ ] No console errors during test execution

---

Good luck with the test migration! 🚀
