const User = require('../models/user.model');
const logger = require('../utils/logger');

class UserRepository {
  // Create new user
  async create(userData) {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      logger.error(`UserRepository.create error: ${error.message}`);
      throw error;
    }
  }

  // Find user by email
  async findByEmail(email) {
    try {
      return await User.findOne({ email: email.toLowerCase() }).select(
        '+passwordHash'
      );
    } catch (error) {
      logger.error(`UserRepository.findByEmail error: ${error.message}`);
      throw error;
    }
  }

  // Find user by id
  async findById(id) {
    try {
      return await User.findById(id);
    } catch (error) {
      logger.error(`UserRepository.findById error: ${error.message}`);
      throw error;
    }
  }

  // Update user
  async update(id, updateData) {
    try {
      return await User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      logger.error(`UserRepository.update error: ${error.message}`);
      throw error;
    }
  }

  // Delete user
  async delete(id) {
    try {
      return await User.findByIdAndDelete(id);
    } catch (error) {
      logger.error(`UserRepository.delete error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new UserRepository();
