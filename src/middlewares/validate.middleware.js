const logger = require('../utils/logger');

/**
 * Validation middleware factory
 * @param {object} schema - Joi validation schema
 * @returns {function} middleware function
 */
const validate = (schema) => (req, res, next) => {
  try {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details
        .map((detail) => detail.message)
        .join('; ');

      logger.warn(`Validation error: ${messages}`);

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
      });
    }

    // Replace request body with validated value
    req.body = value;
    next();
  } catch (err) {
    logger.error(`Validation middleware error: ${err.message}`);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = validate;
