const Joi = require('joi');

const tagValidationSchemas = {
  // Create tag validation
  createTag: Joi.object({
    name: Joi.string()
      .trim()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.min': 'Tag name cannot be empty',
        'string.max': 'Tag name must not exceed 50 characters',
        'any.required': 'Tag name is required',
      }),
    color: Joi.string()
      .pattern(/^#[0-9A-Fa-f]{6}$/)
      .required()
      .messages({
        'string.pattern.base': 'Color must be a valid hex code (e.g., #FF5733)',
        'any.required': 'Color is required',
      }),
  }).unknown(false),

  // Update tag validation
  updateTag: Joi.object({
    name: Joi.string()
      .trim()
      .min(1)
      .max(50)
      .optional()
      .messages({
        'string.min': 'Tag name cannot be empty',
        'string.max': 'Tag name must not exceed 50 characters',
      }),
    color: Joi.string()
      .pattern(/^#[0-9A-Fa-f]{6}$/)
      .optional()
      .messages({
        'string.pattern.base': 'Color must be a valid hex code (e.g., #FF5733)',
      }),
  }).unknown(false),
};

module.exports = tagValidationSchemas;
