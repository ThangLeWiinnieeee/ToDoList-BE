const Joi = require('joi');

const authValidationSchemas = {
  // Register validation
  register: Joi.object({
    email: Joi.string()
      .email()
      .lowercase()
      .trim()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
      }),
    password: Joi.string()
      .min(8)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters',
        'any.required': 'Password is required',
      }),
    name: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.min': 'Name must be at least 2 characters',
        'string.max': 'Name must not exceed 50 characters',
        'any.required': 'Name is required',
      }),
  }).unknown(false),

  // Login validation
  login: Joi.object({
    email: Joi.string()
      .email()
      .lowercase()
      .trim()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
      }),
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required',
      }),
  }).unknown(false),

  // Update profile validation
  updateProfile: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .optional()
      .messages({
        'string.min': 'Name must be at least 2 characters',
        'string.max': 'Name must not exceed 50 characters',
      }),
  }).unknown(false),

  // Change password validation
  changePassword: Joi.object({
    oldPassword: Joi.string()
      .required()
      .messages({
        'any.required': 'Old password is required',
      }),
    newPassword: Joi.string()
      .min(8)
      .required()
      .messages({
        'string.min': 'New password must be at least 8 characters',
        'any.required': 'New password is required',
      }),
    confirmPassword: Joi.string()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({
        'any.only': 'Confirm password must match new password',
        'any.required': 'Confirm password is required',
      }),
  }).unknown(false),
};

module.exports = authValidationSchemas;
