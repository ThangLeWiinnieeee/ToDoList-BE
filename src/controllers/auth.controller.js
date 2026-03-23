const authService = require('../services/auth.service');
const logger = require('../utils/logger');

class AuthController {
  // Register
  async register(req, res) {
    try {
      const { email, password, name } = req.body;

      const result = await authService.register(email, password, name);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      logger.error(`AuthController.register error: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      logger.error(`AuthController.login error: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get current user
  async getCurrentUser(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not found',
        });
      }

      const user = await authService.getCurrentUser(userId);

      res.status(200).json({
        success: true,
        message: 'User profile retrieved successfully',
        data: user,
      });
    } catch (error) {
      logger.error(`AuthController.getCurrentUser error: ${error.message}`);
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update profile
  async updateProfile(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not found',
        });
      }

      const result = await authService.updateProfile(userId, req.body);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: result,
      });
    } catch (error) {
      logger.error(`AuthController.updateProfile error: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Change password
  async changePassword(req, res) {
    try {
      const userId = req.user?.id;
      const { oldPassword, newPassword } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not found',
        });
      }

      const result = await authService.changePassword(
        userId,
        oldPassword,
        newPassword
      );

      res.status(200).json({
        success: true,
        message: 'Password changed successfully',
        data: result,
      });
    } catch (error) {
      logger.error(`AuthController.changePassword error: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Logout (placeholder - dùng client-side)
  async logout(req, res) {
    try {
      res.status(200).json({
        success: true,
        message: 'Logout successful (remove token on client-side)',
      });
    } catch (error) {
      logger.error(`AuthController.logout error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new AuthController();
