const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const { authLimiter, passwordLimiter } = require('../middlewares/rateLimit.middleware');
const authValidationSchemas = require('../validations/auth.validation');
const authMiddleware = require('../middlewares/auth.middleware');

// POST /api/auth/register - Register user
router.post(
  '/register',
  authLimiter,
  validate(authValidationSchemas.register),
  authController.register.bind(authController)
);

// POST /api/auth/login - Login user
router.post(
  '/login',
  authLimiter,
  validate(authValidationSchemas.login),
  authController.login.bind(authController)
);

// POST /api/auth/logout - Logout user
router.post(
  '/logout',
  authMiddleware,
  authController.logout.bind(authController)
);

// GET /api/auth/me - Get current user
router.get(
  '/me',
  authMiddleware,
  authController.getCurrentUser.bind(authController)
);

// PUT /api/auth/profile - Update user profile
router.put(
  '/profile',
  authMiddleware,
  validate(authValidationSchemas.updateProfile),
  authController.updateProfile.bind(authController)
);

// POST /api/auth/change-password - Change password
router.post(
  '/change-password',
  authMiddleware,
  passwordLimiter,
  validate(authValidationSchemas.changePassword),
  authController.changePassword.bind(authController)
);

module.exports = router;
