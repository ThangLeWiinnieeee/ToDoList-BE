const Tag = require('../models/tag.model');
const logger = require('../utils/logger');

class TagRepository {
  // Create new tag
  async create(tagData) {
    try {
      const tag = new Tag(tagData);
      return await tag.save();
    } catch (error) {
      logger.error(`TagRepository.create error: ${error.message}`);
      throw error;
    }
  }

  // Get all tags by userId
  async findByUserId(userId) {
    try {
      return await Tag.find({ userId }).lean();
    } catch (error) {
      logger.error(`TagRepository.findByUserId error: ${error.message}`);
      throw error;
    }
  }

  // Get tag by id
  async findById(id) {
    try {
      return await Tag.findById(id).lean();
    } catch (error) {
      logger.error(`TagRepository.findById error: ${error.message}`);
      throw error;
    }
  }

  // Update tag
  async update(id, updateData) {
    try {
      return await Tag.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      logger.error(`TagRepository.update error: ${error.message}`);
      throw error;
    }
  }

  // Delete tag
  async delete(id) {
    try {
      return await Tag.findByIdAndDelete(id);
    } catch (error) {
      logger.error(`TagRepository.delete error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new TagRepository();
