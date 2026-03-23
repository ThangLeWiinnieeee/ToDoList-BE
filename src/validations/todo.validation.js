const Joi = require('joi');

const todoValidationSchemas = {
  // Create todo validation
  createTodo: Joi.object({
    title: Joi.string()
      .trim()
      .min(1)
      .max(100)
      .required()
      .messages({
        'string.min': 'Title cannot be empty',
        'string.max': 'Title must not exceed 100 characters',
        'any.required': 'Title is required',
      }),
    description: Joi.string()
      .trim()
      .max(1000)
      .optional()
      .allow('')
      .messages({
        'string.max': 'Description must not exceed 1000 characters',
      }),
    isDone: Joi.boolean()
      .optional()
      .default(false)
      .messages({
        'boolean.base': 'isDone must be a boolean',
      }),
    dueDate: Joi.date()
      .optional()
      .allow(null)
      .messages({
        'date.base': 'Due date must be a valid date',
      }),
    tagIds: Joi.array()
      .items(Joi.string().required())
      .optional()
      .default([])
      .messages({
        'array.base': 'Tag IDs must be an array',
      }),
  }).unknown(false),

  // Update todo validation
  updateTodo: Joi.object({
    title: Joi.string()
      .trim()
      .min(1)
      .max(100)
      .optional()
      .messages({
        'string.min': 'Title cannot be empty',
        'string.max': 'Title must not exceed 100 characters',
      }),
    description: Joi.string()
      .trim()
      .max(1000)
      .optional()
      .allow('')
      .messages({
        'string.max': 'Description must not exceed 1000 characters',
      }),
    isDone: Joi.boolean()
      .optional()
      .messages({
        'boolean.base': 'isDone must be a boolean',
      }),
    dueDate: Joi.date()
      .optional()
      .allow(null)
      .messages({
        'date.base': 'Due date must be a valid date',
      }),
    tagIds: Joi.array()
      .items(Joi.string().required())
      .optional()
      .messages({
        'array.base': 'Tag IDs must be an array',
      }),
  }).unknown(false),
};

module.exports = todoValidationSchemas;
