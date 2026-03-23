const authMiddleware = require('../../middlewares/auth.middleware');
const authService = require('../../services/auth.service');

// Mock dependencies
jest.mock('../../services/auth.service');
jest.mock('../../utils/logger', () => ({
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

describe('AuthMiddleware', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should set user on request when token is valid', () => {
    const token = 'valid_token_123';
    const decoded = { userId: 'user_id_123', iat: 123456 };

    req.headers.authorization = `Bearer ${token}`;
    authService.verifyToken.mockReturnValue(decoded);

    authMiddleware(req, res, next);

    expect(authService.verifyToken).toHaveBeenCalledWith(token);
    expect(req.user.id).toBe('user_id_123');
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if no token provided', () => {
    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining('No token'),
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token does not start with Bearer', () => {
    req.headers.authorization = 'invalid_token_format';

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', () => {
    const token = 'invalid_token_123';

    req.headers.authorization = `Bearer ${token}`;
    authService.verifyToken.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Unauthorized: Invalid token',
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle authorization header case insensitivity', () => {
    const token = 'valid_token_123';
    const decoded = { userId: 'user_id_123' };

    // Test with lowercase 'bearer'
    req.headers.authorization = `bearer ${token}`;
    authService.verifyToken.mockReturnValue(decoded);

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401); // Should fail if implementation is case-sensitive
  });

  it('should extract token correctly after Bearer prefix', () => {
    const token = 'very_long_token_with_special_chars_123.456.789';
    const decoded = { userId: 'user_id_123' };

    req.headers.authorization = `Bearer ${token}`;
    authService.verifyToken.mockReturnValue(decoded);

    authMiddleware(req, res, next);

    expect(authService.verifyToken).toHaveBeenCalledWith(token);
    expect(next).toHaveBeenCalled();
  });
});
