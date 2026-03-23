const tagRepository = require('../repositories/tag.repository');
const logger = require('../utils/logger');

class TagService {
  // Create new tag
  async createTag(userId, tagData) {
    try {
      if (!tagData.name || tagData.name.trim() === '') {
        throw new Error('Tag name is required');
      }

      if (!tagData.color || !/^#[0-9A-Fa-f]{6}$/.test(tagData.color)) {
        throw new Error('Valid color code is required (e.g., #FF5733)');
      }

      const tag = await tagRepository.create({
        userId,
        name: tagData.name.trim(),
        color: tagData.color,
      });

      logger.info(`Tag created: ${tag._id}`);
      return tag;
    } catch (error) {
      logger.error(`TagService.createTag error: ${error.message}`);
      throw error;
    }
  }

  // Get all tags for user
  async getAllTags(userId) {
    try {
      const tags = await tagRepository.findByUserId(userId);
      return tags;
    } catch (error) {
      logger.error(`TagService.getAllTags error: ${error.message}`);
      throw error;
    }
  }

  // Get tag by id
  async getTagById(id) {
    try {
      const tag = await tagRepository.findById(id);
      if (!tag) {
        throw new Error('Tag not found');
      }
      return tag;
    } catch (error) {
      logger.error(`TagService.getTagById error: ${error.message}`);
      throw error;
    }
  }

  // Update tag
  async updateTag(id, updateData) {
    try {
      if (updateData.name && updateData.name.trim() === '') {
        throw new Error('Tag name cannot be empty');
      }

      if (
        updateData.color &&
        !/^#[0-9A-Fa-f]{6}$/.test(updateData.color)
      ) {
        throw new Error('Valid color code is required (e.g., #FF5733)');
      }

      const tag = await tagRepository.update(id, updateData);
      if (!tag) {
        throw new Error('Tag not found');
      }

      logger.info(`Tag updated: ${id}`);
      return tag;
    } catch (error) {
      logger.error(`TagService.updateTag error: ${error.message}`);
      throw error;
    }
  }

  // Delete tag
  async deleteTag(id) {
    try {
      const tag = await tagRepository.delete(id);
      if (!tag) {
        throw new Error('Tag not found');
      }

      logger.info(`Tag deleted: ${id}`);
      return tag;
    } catch (error) {
      logger.error(`TagService.deleteTag error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new TagService();
