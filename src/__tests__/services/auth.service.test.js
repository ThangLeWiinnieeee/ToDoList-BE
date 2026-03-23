const authService = require('../../services/auth.service');
const userRepository = require('../../repositories/user.repository');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../../repositories/user.repository');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../utils/logger', () => ({
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const email = 'test@example.com';
      const password = 'password1234';
      const name = 'Test User';

      const hashedPassword = 'hashed_password_123';
      bcryptjs.genSalt.mockResolvedValue(10);
      bcryptjs.hash.mockResolvedValue(hashedPassword);
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.create.mockResolvedValue({
        _id: 'user_id_123',
        email,
        name,
        passwordHash: hashedPassword,
      });
      jwt.sign.mockReturnValue('jwt_token_123');

      const result = await authService.register(email, password, name);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(bcryptjs.genSalt).toHaveBeenCalledWith(10);
      expect(bcryptjs.hash).toHaveBeenCalledWith(password, 10);
      expect(userRepository.create).toHaveBeenCalled();
      expect(result.user.email).toBe(email);
      expect(result.token).toBeDefined();
    });

    it('should throw error if email already exists', async () => {
      const email = 'existing@example.com';
      const password = 'password1234';
      const name = 'Test User';

      userRepository.findByEmail.mockResolvedValue({ _id: 'user_id_456' });

      await expect(authService.register(email, password, name)).rejects.toThrow(
        'Email already registered'
      );
    });

    it('should throw error if name is missing', async () => {
      const email = 'test@example.com';
      const password = 'password1234';

      await expect(authService.register(email, password, null)).rejects.toThrow(
        'Email, password, and name are required'
      );
    });
  });

  describe('login', () => {
    it('should successfully login with correct credentials', async () => {
      const email = 'test@example.com';
      const password = 'password1234';
      const hashedPassword = 'hashed_password_123';

      userRepository.findByEmail.mockResolvedValue({
        _id: 'user_id_123',
        email,
        passwordHash: hashedPassword,
        name: 'Test User',
      });

      bcryptjs.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('jwt_token_123');

      const result = await authService.login(email, password);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(bcryptjs.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(result.user.email).toBe(email);
      expect(result.token).toBe('jwt_token_123');
    });

    it('should throw error for wrong password', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';
      const hashedPassword = 'hashed_password_123';

      userRepository.findByEmail.mockResolvedValue({
        _id: 'user_id_123',
        email,
        passwordHash: hashedPassword,
        name: 'Test User',
      });

      bcryptjs.compare.mockResolvedValue(false);

      await expect(authService.login(email, password)).rejects.toThrow(
        'Invalid email or password'
      );
    });

    it('should throw error for non-existent user', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.login('nonexistent@example.com', 'password')).rejects.toThrow();
    });
  });

  describe('getCurrentUser', () => {
    it('should return user data', async () => {
      const userId = 'user_id_123';
      const mockUser = {
        _id: userId,
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      userRepository.findById.mockResolvedValue(mockUser);

      const result = await authService.getCurrentUser(userId);

      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(result.id).toBe(userId);
      expect(result.email).toBe(mockUser.email);
      expect(result.name).toBe(mockUser.name);
    });

    it('should throw error if user not found', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(authService.getCurrentUser('invalid_id')).rejects.toThrow(
        'User not found'
      );
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const userId = 'user_id_123';
      const updateData = { name: 'Updated Name' };
      const updatedUser = {
        _id: userId,
        email: 'test@example.com',
        name: 'Updated Name',
      };

      userRepository.update.mockResolvedValue(updatedUser);

      const result = await authService.updateProfile(userId, updateData);

      expect(userRepository.update).toHaveBeenCalledWith(userId, updateData);
      expect(result.name).toBe('Updated Name');
    });
  });

  describe('changePassword', () => {
    it('should successfully change password', async () => {
      const userId = 'user_id_123';
      const oldPassword = 'oldPassword1234';
      const newPassword = 'newPassword4567';
      const hashedPassword = 'hashed_old_password';
      const newHashedPassword = 'hashed_new_password';

      userRepository.findById.mockResolvedValue({
        _id: userId,
        email: 'test@example.com',
        passwordHash: hashedPassword,
      });
      userRepository.findByEmail.mockResolvedValue({
        _id: userId,
        email: 'test@example.com',
        passwordHash: hashedPassword,
      });

      bcryptjs.compare.mockResolvedValue(true);
      bcryptjs.genSalt.mockResolvedValue(10);
      bcryptjs.hash.mockResolvedValue(newHashedPassword);
      userRepository.update.mockResolvedValue({
        _id: userId,
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: newHashedPassword,
      });

      const result = await authService.changePassword(userId, oldPassword, newPassword);

      expect(bcryptjs.compare).toHaveBeenCalledWith(oldPassword, hashedPassword);
      expect(bcryptjs.genSalt).toHaveBeenCalledWith(10);
      expect(bcryptjs.hash).toHaveBeenCalledWith(newPassword, 10);
      expect(userRepository.update).toHaveBeenCalled();
    });

    it('should throw error for wrong old password', async () => {
      const userId = 'user_id_123';
      const oldPassword = 'wrongOldPassword';
      const newPassword = 'newPassword4567';

      userRepository.findById.mockResolvedValue({
        _id: userId,
        email: 'test@example.com',
        passwordHash: 'hashed_password',
      });
      userRepository.findByEmail.mockResolvedValue({
        _id: userId,
        email: 'test@example.com',
        passwordHash: 'hashed_password',
      });

      bcryptjs.compare.mockResolvedValue(false);

      await expect(
        authService.changePassword(userId, oldPassword, newPassword)
      ).rejects.toThrow('Old password is incorrect');
    });
  });

  describe('generateToken', () => {
    it('should generate valid JWT token', () => {
      const userId = 'user_id_123';
      const mockToken = 'mock_jwt_token';

      jwt.sign.mockReturnValue(mockToken);

      const token = authService.generateToken(userId);

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId },
        expect.any(String),
        expect.objectContaining({ expiresIn: '7d' })
      );
      expect(token).toBe(mockToken);
    });
  });

  describe('verifyToken', () => {
    it('should verify and return decoded token', () => {
      const token = 'valid_token';
      const decoded = { userId: 'user_id_123', iat: 123456 };

      jwt.verify.mockReturnValue(decoded);

      const result = authService.verifyToken(token);

      expect(jwt.verify).toHaveBeenCalledWith(token, expect.any(String));
      expect(result).toEqual(decoded);
    });

    it('should throw error for invalid token', () => {
      const token = 'invalid_token';

      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => authService.verifyToken(token)).toThrow('Invalid token');
    });
  });
});
