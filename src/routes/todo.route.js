const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todo.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const todoValidationSchemas = require('../validations/todo.validation');

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /api/todos - Get all todos
router.get('/', todoController.getAllTodos.bind(todoController));

// GET /api/todos/completed - Get completed todos
router.get('/completed', todoController.getCompletedTodos.bind(todoController));

// GET /api/todos/pending - Get pending todos
router.get('/pending', todoController.getPendingTodos.bind(todoController));

// POST /api/todos - Create new todo
router.post(
  '/',
  validate(todoValidationSchemas.createTodo),
  todoController.createTodo.bind(todoController)
);

// GET /api/todos/:id - Get todo by id
router.get('/:id', todoController.getTodoById.bind(todoController));

// PUT /api/todos/:id - Update todo
router.put(
  '/:id',
  validate(todoValidationSchemas.updateTodo),
  todoController.updateTodo.bind(todoController)
);

// DELETE /api/todos/:id - Delete todo
router.delete('/:id', todoController.deleteTodo.bind(todoController));

// PATCH /api/todos/:id/toggle - Toggle todo status
router.patch('/:id/toggle', todoController.toggleTodoStatus.bind(todoController));

module.exports = router;
