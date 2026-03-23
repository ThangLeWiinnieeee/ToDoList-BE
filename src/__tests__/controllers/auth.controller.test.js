const authController = require('../../controllers/auth.controller');
const authService = require('../../services/auth.service');

// Mock dependencies
jest.mock('../../services/auth.service');
jest.mock('../../utils/logger', () => ({
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

describe('AuthController', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: {},
      user: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('register', () => {
    it('should successfully register a user', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const userData = {
        user: {
          id: 'user_id_123',
          email: 'test@example.com',
          name: 'Test User',
        },
        token: 'jwt_token_123',
      };

      authService.register.mockResolvedValue(userData);

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'User registered successfully',
        })
      );
    });

    it('should return 400 for invalid email', async () => {
      req.body = {
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User',
      };

      authService.register.mockRejectedValue(new Error('Invalid email'));

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
    });

    it('should return 400 if email already exists', async () => {
      req.body = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User',
      };

      authService.register.mockRejectedValue(
        new Error('Email already exists')
      );

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('login', () => {
    it('should successfully login a user', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'password123',
      };

      const loginResponse = {
        user: {
          id: 'user_id_123',
          email: 'test@example.com',
          name: 'Test User',
        },
        token: 'jwt_token_123',
      };

      authService.login.mockResolvedValue(loginResponse);

      await authController.login(req, res);

      expect(authService.login).toHaveBeenCalledWith(
        'test@example.com',
        'password123'
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Login successful',
        })
      );
    });

    it('should return 400 for invalid credentials', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      authService.login.mockRejectedValue(
        new Error('Invalid email or password')
      );

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should successfully logout', async () => {
      await authController.logout(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Logout successful (remove token on client-side)',
        })
      );
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user data', async () => {
      req.user = { id: 'user_id_123' };

      const userData = {
        _id: 'user_id_123',
        email: 'test@example.com',
        name: 'Test User',
      };

      authService.getCurrentUser.mockResolvedValue(userData);

      await authController.getCurrentUser(req, res);

      expect(authService.getCurrentUser).toHaveBeenCalledWith('user_id_123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });

    it('should return 401 if user not authenticated', async () => {
      await authController.getCurrentUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      req.user = { id: 'user_id_123' };
      req.body = { name: 'Updated Name' };

      const updatedUser = {
        _id: 'user_id_123',
        email: 'test@example.com',
        name: 'Updated Name',
      };

      authService.updateProfile.mockResolvedValue(updatedUser);

      await authController.updateProfile(req, res);

      expect(authService.updateProfile).toHaveBeenCalledWith('user_id_123', {
        name: 'Updated Name',
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('changePassword', () => {
    it('should successfully change password', async () => {
      req.user = { id: 'user_id_123' };
      req.body = {
        oldPassword: 'oldPassword123',
        newPassword: 'newPassword456',
      };

      authService.changePassword.mockResolvedValue({
        message: 'Password changed successfully',
      });

      await authController.changePassword(req, res);

      expect(authService.changePassword).toHaveBeenCalledWith(
        'user_id_123',
        'oldPassword123',
        'newPassword456'
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 400 for incorrect old password', async () => {
      req.user = { id: 'user_id_123' };
      req.body = {
        oldPassword: 'wrongPassword',
        newPassword: 'newPassword456',
      };

      authService.changePassword.mockRejectedValue(
        new Error('Old password is incorrect')
      );

      await authController.changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
