const todoRepository = require('../repositories/todo.repository');
const logger = require('../utils/logger');

class TodoService {
  // Create new todo
  async createTodo(userId, todoData) {
    try {
      // Validate required fields
      if (!todoData.title || todoData.title.trim() === '') {
        throw new Error('Title is required');
      }

      const todo = await todoRepository.create({
        userId,
        title: todoData.title.trim(),
        description: todoData.description?.trim() || '',
        isDone: todoData.isDone || false,
        dueDate: todoData.dueDate || null,
        tagIds: todoData.tagIds || [],
      });

      logger.info(`Todo created: ${todo._id}`);
      return todo;
    } catch (error) {
      logger.error(`TodoService.createTodo error: ${error.message}`);
      throw error;
    }
  }

  // Get all todos for user
  async getAllTodos(userId) {
    try {
      const todos = await todoRepository.findByUserId(userId);
      return todos;
    } catch (error) {
      logger.error(`TodoService.getAllTodos error: ${error.message}`);
      throw error;
    }
  }

  // Get todo by id
  async getTodoById(id) {
    try {
      const todo = await todoRepository.findById(id);
      if (!todo) {
        throw new Error('Todo not found');
      }
      return todo;
    } catch (error) {
      logger.error(`TodoService.getTodoById error: ${error.message}`);
      throw error;
    }
  }

  // Update todo
  async updateTodo(id, updateData) {
    try {
      // Validate title if provided
      if (updateData.title && updateData.title.trim() === '') {
        throw new Error('Title cannot be empty');
      }

      const todo = await todoRepository.update(id, updateData);
      if (!todo) {
        throw new Error('Todo not found');
      }

      logger.info(`Todo updated: ${id}`);
      return todo;
    } catch (error) {
      logger.error(`TodoService.updateTodo error: ${error.message}`);
      throw error;
    }
  }

  // Delete todo (soft delete)
  async deleteTodo(id) {
    try {
      const todo = await todoRepository.softDelete(id);
      if (!todo) {
        throw new Error('Todo not found');
      }

      logger.info(`Todo soft deleted: ${id}`);
      return todo;
    } catch (error) {
      logger.error(`TodoService.deleteTodo error: ${error.message}`);
      throw error;
    }
  }

  // Get completed todos
  async getCompletedTodos(userId) {
    try {
      return await todoRepository.findByStatus(userId, true);
    } catch (error) {
      logger.error(`TodoService.getCompletedTodos error: ${error.message}`);
      throw error;
    }
  }

  // Get pending todos
  async getPendingTodos(userId) {
    try {
      return await todoRepository.findByStatus(userId, false);
    } catch (error) {
      logger.error(`TodoService.getPendingTodos error: ${error.message}`);
      throw error;
    }
  }

  // Toggle todo status
  async toggleTodoStatus(id) {
    try {
      const todo = await this.getTodoById(id);
      return await todoRepository.update(id, {
        isDone: !todo.isDone,
      });
    } catch (error) {
      logger.error(`TodoService.toggleTodoStatus error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new TodoService();
