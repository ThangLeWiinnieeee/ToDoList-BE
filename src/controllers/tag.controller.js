const tagService = require('../services/tag.service');
const logger = require('../utils/logger');

class TagController {
  // Create new tag
  async createTag(req, res) {
    try {
      const { name, color } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not found',
        });
      }

      const tag = await tagService.createTag(userId, { name, color });

      res.status(201).json({
        success: true,
        message: 'Tag created successfully',
        data: tag,
      });
    } catch (error) {
      logger.error(`TagController.createTag error: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get all tags
  async getAllTags(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not found',
        });
      }

      const tags = await tagService.getAllTags(userId);

      res.status(200).json({
        success: true,
        message: 'Tags retrieved successfully',
        data: tags,
        total: tags.length,
      });
    } catch (error) {
      logger.error(`TagController.getAllTags error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get tag by id
  async getTagById(req, res) {
    try {
      const { id } = req.params;

      const tag = await tagService.getTagById(id);

      res.status(200).json({
        success: true,
        message: 'Tag retrieved successfully',
        data: tag,
      });
    } catch (error) {
      logger.error(`TagController.getTagById error: ${error.message}`);
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update tag
  async updateTag(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const tag = await tagService.updateTag(id, updateData);

      res.status(200).json({
        success: true,
        message: 'Tag updated successfully',
        data: tag,
      });
    } catch (error) {
      logger.error(`TagController.updateTag error: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Delete tag
  async deleteTag(req, res) {
    try {
      const { id } = req.params;

      const tag = await tagService.deleteTag(id);

      res.status(200).json({
        success: true,
        message: 'Tag deleted successfully',
        data: tag,
      });
    } catch (error) {
      logger.error(`TagController.deleteTag error: ${error.message}`);
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new TagController();
