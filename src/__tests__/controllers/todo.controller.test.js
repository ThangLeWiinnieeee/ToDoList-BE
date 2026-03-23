const todoController = require('../../controllers/todo.controller');
const todoService = require('../../services/todo.service');

// Mock dependencies
jest.mock('../../services/todo.service');
jest.mock('../../utils/logger', () => ({
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

describe('TodoController', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: {},
      params: {},
      user: { id: 'user_id_123' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('createTodo', () => {
    it('should create a new todo', async () => {
      req.body = {
        title: 'Test Todo',
        description: 'This is a test',
      };

      const newTodo = {
        _id: 'todo_id_123',
        user_id: 'user_id_123',
        title: 'Test Todo',
        description: 'This is a test',
        is_done: false,
      };

      todoService.createTodo.mockResolvedValue(newTodo);

      await todoController.createTodo(req, res);

      expect(todoService.createTodo).toHaveBeenCalledWith(
        'user_id_123',
        req.body
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Todo created successfully',
        })
      );
    });

    it('should return 401 if user not authenticated', async () => {
      req.user = undefined;
      req.body = { title: 'Test Todo' };

      await todoController.createTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should return 400 for invalid data', async () => {
      req.body = { title: 'Test Todo' };

      todoService.createTodo.mockRejectedValue(
        new Error('Todo title is required')
      );

      await todoController.createTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('getAllTodos', () => {
    it('should return all todos for user', async () => {
      const todos = [
        {
          _id: '1',
          title: 'Todo 1',
          user_id: 'user_id_123',
          is_done: false,
        },
        {
          _id: '2',
          title: 'Todo 2',
          user_id: 'user_id_123',
          is_done: false,
        },
      ];

      todoService.getAllTodos.mockResolvedValue(todos);

      await todoController.getAllTodos(req, res);

      expect(todoService.getAllTodos).toHaveBeenCalledWith('user_id_123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          total: 2,
        })
      );
    });
  });

  describe('getCompletedTodos', () => {
    it('should return only completed todos', async () => {
      const completedTodos = [
        {
          _id: '1',
          title: 'Completed Todo',
          is_done: true,
          user_id: 'user_id_123',
        },
      ];

      todoService.getCompletedTodos.mockResolvedValue(completedTodos);

      await todoController.getCompletedTodos(req, res);

      expect(todoService.getCompletedTodos).toHaveBeenCalledWith('user_id_123');
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          total: 1,
        })
      );
    });
  });

  describe('getPendingTodos', () => {
    it('should return only pending todos', async () => {
      const pendingTodos = [
        {
          _id: '1',
          title: 'Pending Todo',
          is_done: false,
          user_id: 'user_id_123',
        },
      ];

      todoService.getPendingTodos.mockResolvedValue(pendingTodos);

      await todoController.getPendingTodos(req, res);

      expect(todoService.getPendingTodos).toHaveBeenCalledWith('user_id_123');
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          total: 1,
        })
      );
    });
  });

  describe('getTodoById', () => {
    it('should return a todo by id', async () => {
      req.params = { id: 'todo_id_123' };

      const todo = {
        _id: 'todo_id_123',
        title: 'Test Todo',
        user_id: 'user_id_123',
      };

      todoService.getTodoById.mockResolvedValue(todo);

      await todoController.getTodoById(req, res);

      expect(todoService.getTodoById).toHaveBeenCalledWith('todo_id_123');
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 if todo not found', async () => {
      req.params = { id: 'invalid_id' };

      todoService.getTodoById.mockRejectedValue(new Error('Todo not found'));

      await todoController.getTodoById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('updateTodo', () => {
    it('should update a todo', async () => {
      req.params = { id: 'todo_id_123' };
      req.body = { title: 'Updated Title' };

      const updatedTodo = {
        _id: 'todo_id_123',
        title: 'Updated Title',
        user_id: 'user_id_123',
      };

      todoService.updateTodo.mockResolvedValue(updatedTodo);

      await todoController.updateTodo(req, res);

      expect(todoService.updateTodo).toHaveBeenCalledWith(
        'todo_id_123',
        req.body
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo', async () => {
      req.params = { id: 'todo_id_123' };

      const deletedTodo = {
        _id: 'todo_id_123',
        title: 'Deleted Todo',
        deleted_at: new Date(),
      };

      todoService.deleteTodo.mockResolvedValue(deletedTodo);

      await todoController.deleteTodo(req, res);

      expect(todoService.deleteTodo).toHaveBeenCalledWith('todo_id_123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Todo deleted successfully',
        })
      );
    });

    it('should return 404 if todo not found', async () => {
      req.params = { id: 'invalid_id' };

      todoService.deleteTodo.mockRejectedValue(new Error('Todo not found'));

      await todoController.deleteTodo(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('toggleTodoStatus', () => {
    it('should toggle todo status', async () => {
      req.params = { id: 'todo_id_123' };

      const toggledTodo = {
        _id: 'todo_id_123',
        title: 'Test Todo',
        is_done: true,
      };

      todoService.toggleTodoStatus.mockResolvedValue(toggledTodo);

      await todoController.toggleTodoStatus(req, res);

      expect(todoService.toggleTodoStatus).toHaveBeenCalledWith('todo_id_123');
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
