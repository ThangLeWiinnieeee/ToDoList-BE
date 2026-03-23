const authService = require('../services/auth.service');
const logger = require('../utils/logger');

const authMiddleware = (req, res, next) => {
  try {
    // Lấy token từ header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No token provided',
      });
    }

    // Extract token
    const token = authHeader.slice(7); // Bỏ "Bearer "

    // Verify token
    const decoded = authService.verifyToken(token);

    // Set user to request
    req.user = {
      id: decoded.userId,
    };

    next();
  } catch (error) {
    logger.error(`AuthMiddleware error: ${error.message}`);
    res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid token',
    });
  }
};

module.exports = authMiddleware;
