const todoService = require('../services/todo.service');
const logger = require('../utils/logger');

class TodoController {
  // Create new todo
  async createTodo(req, res) {
    try {
      const { title, description, dueDate, tagIds } = req.body;
      const userId = req.user?.id; // Giả sử middleware auth set req.user

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not found',
        });
      }

      const todo = await todoService.createTodo(userId, {
        title,
        description,
        dueDate,
        tagIds,
      });

      res.status(201).json({
        success: true,
        message: 'Todo created successfully',
        data: todo,
      });
    } catch (error) {
      logger.error(`TodoController.createTodo error: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get all todos
  async getAllTodos(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not found',
        });
      }

      const todos = await todoService.getAllTodos(userId);

      res.status(200).json({
        success: true,
        message: 'Todos retrieved successfully',
        data: todos,
        total: todos.length,
      });
    } catch (error) {
      logger.error(`TodoController.getAllTodos error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get todo by id
  async getTodoById(req, res) {
    try {
      const { id } = req.params;

      const todo = await todoService.getTodoById(id);

      res.status(200).json({
        success: true,
        message: 'Todo retrieved successfully',
        data: todo,
      });
    } catch (error) {
      logger.error(`TodoController.getTodoById error: ${error.message}`);
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update todo
  async updateTodo(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const todo = await todoService.updateTodo(id, updateData);

      res.status(200).json({
        success: true,
        message: 'Todo updated successfully',
        data: todo,
      });
    } catch (error) {
      logger.error(`TodoController.updateTodo error: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Delete todo
  async deleteTodo(req, res) {
    try {
      const { id } = req.params;

      const todo = await todoService.deleteTodo(id);

      res.status(200).json({
        success: true,
        message: 'Todo deleted successfully',
        data: todo,
      });
    } catch (error) {
      logger.error(`TodoController.deleteTodo error: ${error.message}`);
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get completed todos
  async getCompletedTodos(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not found',
        });
      }

      const todos = await todoService.getCompletedTodos(userId);

      res.status(200).json({
        success: true,
        message: 'Completed todos retrieved successfully',
        data: todos,
        total: todos.length,
      });
    } catch (error) {
      logger.error(`TodoController.getCompletedTodos error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get pending todos
  async getPendingTodos(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not found',
        });
      }

      const todos = await todoService.getPendingTodos(userId);

      res.status(200).json({
        success: true,
        message: 'Pending todos retrieved successfully',
        data: todos,
        total: todos.length,
      });
    } catch (error) {
      logger.error(`TodoController.getPendingTodos error: ${error.message}`);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Toggle todo status
  async toggleTodoStatus(req, res) {
    try {
      const { id } = req.params;

      const todo = await todoService.toggleTodoStatus(id);

      res.status(200).json({
        success: true,
        message: 'Todo status toggled successfully',
        data: todo,
      });
    } catch (error) {
      logger.error(`TodoController.toggleTodoStatus error: ${error.message}`);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new TodoController();
