const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tag.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const tagValidationSchemas = require('../validations/tag.validation');

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /api/tags - Get all tags
router.get('/', tagController.getAllTags.bind(tagController));

// POST /api/tags - Create new tag
router.post(
  '/',
  validate(tagValidationSchemas.createTag),
  tagController.createTag.bind(tagController)
);

// GET /api/tags/:id - Get tag by id
router.get('/:id', tagController.getTagById.bind(tagController));

// PUT /api/tags/:id - Update tag
router.put(
  '/:id',
  validate(tagValidationSchemas.updateTag),
  tagController.updateTag.bind(tagController)
);

// DELETE /api/tags/:id - Delete tag
router.delete('/:id', tagController.deleteTag.bind(tagController));

module.exports = router;
