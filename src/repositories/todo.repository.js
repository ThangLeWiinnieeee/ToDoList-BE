const Todo = require('../models/todo.model');
const Tag = require('../models/tag.model'); // Import to register schema
const logger = require('../utils/logger');

class TodoRepository {
  // Create new todo
  async create(todoData) {
    try {
      const todo = new Todo(todoData);
      return await todo.save();
    } catch (error) {
      logger.error(`TodoRepository.create error: ${error.message}`);
      throw error;
    }
  }

  // Get all todos by userId (exclude deleted)
  async findByUserId(userId) {
    try {
      return await Todo.find({
        userId,
        deletedAt: null,
      })
        .populate('tagIds')
        .lean();
    } catch (error) {
      logger.error(`TodoRepository.findByUserId error: ${error.message}`);
      throw error;
    }
  }

  // Get todo by id
  async findById(id) {
    try {
      return await Todo.findById(id)
        .populate('tag_ids')
        .lean();
    } catch (error) {
      logger.error(`TodoRepository.findById error: ${error.message}`);
      throw error;
    }
  }

  // Update todo
  async update(id, updateData) {
    try {
      return await Todo.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      logger.error(`TodoRepository.update error: ${error.message}`);
      throw error;
    }
  }

  // Soft delete todo
  async softDelete(id) {
    try {
      return await Todo.findByIdAndUpdate(
        id,
        { deletedAt: new Date() },
        { new: true }
      );
    } catch (error) {
      logger.error(`TodoRepository.softDelete error: ${error.message}`);
      throw error;
    }
  }

  // Hard delete todo
  async hardDelete(id) {
    try {
      return await Todo.findByIdAndDelete(id);
    } catch (error) {
      logger.error(`TodoRepository.hardDelete error: ${error.message}`);
      throw error;
    }
  }

  // Get todos by status
  async findByStatus(userId, isDone) {
    try {
      return await Todo.find({
        userId,
        isDone,
        deletedAt: null,
      }).lean();
    } catch (error) {
      logger.error(`TodoRepository.findByStatus error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new TodoRepository();
