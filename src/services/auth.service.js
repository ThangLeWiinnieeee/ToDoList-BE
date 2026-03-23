const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');
const logger = require('../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_here';
const JWT_EXPIRE = '7d';

class AuthService {
  // Register new user
  async register(email, password, name) {
    try {
      // Validate input
      if (!email || !password || !name) {
        throw new Error('Email, password, and name are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Check if user already exists
      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) {
        throw new Error('Email already registered');
      }

      // Hash password
      const salt = await bcryptjs.genSalt(10);
      const passwordHash = await bcryptjs.hash(password, salt);

      // Create user
      const user = await userRepository.create({
        email: email.toLowerCase().trim(),
        passwordHash,
        name: name.trim(),
      });

      logger.info(`User registered: ${user.email}`);

      // Generate token
      const token = this.generateToken(user._id);

      return {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
        token,
      };
    } catch (error) {
      logger.error(`AuthService.register error: ${error.message}`);
      throw error;
    }
  }

  // Login user
  async login(email, password) {
    try {
      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Find user by email
      const user = await userRepository.findByEmail(email);
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Compare password
      const isPasswordValid = await bcryptjs.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      logger.info(`User logged in: ${user.email}`);

      // Generate token
      const token = this.generateToken(user._id);

      return {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
        token,
      };
    } catch (error) {
      logger.error(`AuthService.login error: ${error.message}`);
      throw error;
    }
  }

  // Get current user
  async getCurrentUser(userId) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      return {
        id: user._id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      logger.error(`AuthService.getCurrentUser error: ${error.message}`);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(userId, updateData) {
    try {
      // Không cho phép update email và password từ endpoint này
      const { email, passwordHash, ...safeData } = updateData;

      const user = await userRepository.update(userId, safeData);
      if (!user) {
        throw new Error('User not found');
      }

      logger.info(`User profile updated: ${userId}`);

      return {
        id: user._id,
        email: user.email,
        name: user.name,
      };
    } catch (error) {
      logger.error(`AuthService.updateProfile error: ${error.message}`);
      throw error;
    }
  }

  // Change password
  async changePassword(userId, oldPassword, newPassword) {
    try {
      if (!oldPassword || !newPassword) {
        throw new Error('Old password and new password are required');
      }

      if (newPassword.length < 8) {
        throw new Error('New password must be at least 8 characters');
      }

      const user = await userRepository.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Get user with passwordHash
      const userWithPassword = await userRepository.findByEmail(user.email);

      // Verify old password
      const isPasswordValid = await bcryptjs.compare(
        oldPassword,
        userWithPassword.passwordHash
      );
      if (!isPasswordValid) {
        throw new Error('Old password is incorrect');
      }

      // Hash new password
      const salt = await bcryptjs.genSalt(10);
      const passwordHash = await bcryptjs.hash(newPassword, salt);

      // Update password
      const updatedUser = await userRepository.update(userId, { passwordHash });

      logger.info(`User password changed: ${userId}`);

      return {
        id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
      };
    } catch (error) {
      logger.error(`AuthService.changePassword error: ${error.message}`);
      throw error;
    }
  }

  // Generate JWT token
  generateToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      logger.error(`AuthService.verifyToken error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new AuthService();
