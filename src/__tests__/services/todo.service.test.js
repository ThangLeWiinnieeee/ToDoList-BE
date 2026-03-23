const todoService = require('../../services/todo.service');
const todoRepository = require('../../repositories/todo.repository');

// Mock dependencies
jest.mock('../../repositories/todo.repository');
jest.mock('../../utils/logger', () => ({
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

describe('TodoService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTodo', () => {
    it('should create a new todo', async () => {
      const userId = 'user_id_123';
      const todoData = {
        title: 'Test Todo',
        description: 'This is a test todo',
        dueDate: new Date(),
      };

      const newTodo = {
        _id: 'todo_id_123',
        userId: userId,
        ...todoData,
        isDone: false,
      };

      todoRepository.create.mockResolvedValue(newTodo);

      const result = await todoService.createTodo(userId, todoData);

      expect(todoRepository.create).toHaveBeenCalled();
      expect(result._id).toBe('todo_id_123');
      expect(result.title).toBe(todoData.title);
    });

    it('should throw error if title is empty', async () => {
      const userId = 'user_id_123';
      const todoData = { title: '', description: 'Test' };

      await expect(todoService.createTodo(userId, todoData)).rejects.toThrow(
        'Title is required'
      );
    });

    it('should throw error if title exceeds max length', async () => {
      const userId = 'user_id_123';
      const todoData = {
        title: 'a'.repeat(101), // Exceeds 100 character limit
        description: 'Test',
      };

      const result = await todoService.createTodo(userId, todoData);
      expect(result).toBeDefined();
    });
  });

  describe('getAllTodos', () => {
    it('should return all todos for a user', async () => {
      const userId = 'user_id_123';
      const todos = [
        { _id: '1', title: 'Todo 1', userId: userId },
        { _id: '2', title: 'Todo 2', userId: userId },
      ];

      todoRepository.findByUserId.mockResolvedValue(todos);

      const result = await todoService.getAllTodos(userId);

      expect(todoRepository.findByUserId).toHaveBeenCalledWith(userId);
      expect(result).toHaveLength(2);
    });
  });

  describe('getTodoById', () => {
    it('should return todo by id', async () => {
      const todoId = 'todo_id_123';
      const todo = {
        _id: todoId,
        title: 'Test Todo',
        userId: 'user_id_123',
      };

      todoRepository.findById.mockResolvedValue(todo);

      const result = await todoService.getTodoById(todoId);

      expect(todoRepository.findById).toHaveBeenCalledWith(todoId);
      expect(result.title).toBe('Test Todo');
    });

    it('should throw error if todo not found', async () => {
      todoRepository.findById.mockResolvedValue(null);

      await expect(todoService.getTodoById('invalid_id')).rejects.toThrow(
        'Todo not found'
      );
    });
  });

  describe('updateTodo', () => {
    it('should update a todo', async () => {
      const todoId = 'todo_id_123';
      const updateData = { title: 'Updated Title' };
      const updatedTodo = {
        _id: todoId,
        title: 'Updated Title',
        user_id: 'user_id_123',
      };

      todoRepository.update.mockResolvedValue(updatedTodo);

      const result = await todoService.updateTodo(todoId, updateData);

      expect(todoRepository.update).toHaveBeenCalledWith(todoId, updateData);
      expect(result.title).toBe('Updated Title');
    });

    it('should throw error if todo not found during update', async () => {
      todoRepository.update.mockResolvedValue(null);

      await expect(
        todoService.updateTodo('invalid_id', { title: 'New' })
      ).rejects.toThrow('Todo not found');
    });
  });

  describe('deleteTodo', () => {
    it('should soft delete a todo', async () => {
      const todoId = 'todo_id_123';

      todoRepository.softDelete.mockResolvedValue({
        _id: todoId,
        deleted_at: new Date(),
      });

      const result = await todoService.deleteTodo(todoId);

      expect(todoRepository.softDelete).toHaveBeenCalledWith(todoId);
      expect(result.deleted_at).toBeDefined();
    });
  });

  describe('getCompletedTodos', () => {
    it('should return completed todos', async () => {
      const userId = 'user_id_123';
      const completedTodos = [
        { _id: '1', title: 'Completed 1', is_done: true, user_id: userId },
      ];

      todoRepository.findByStatus.mockResolvedValue(completedTodos);

      const result = await todoService.getCompletedTodos(userId);

      expect(todoRepository.findByStatus).toHaveBeenCalledWith(userId, true);
      expect(result).toHaveLength(1);
      expect(result[0].is_done).toBe(true);
    });
  });

  describe('getPendingTodos', () => {
    it('should return pending todos', async () => {
      const userId = 'user_id_123';
      const pendingTodos = [
        { _id: '1', title: 'Pending 1', is_done: false, user_id: userId },
      ];

      todoRepository.findByStatus.mockResolvedValue(pendingTodos);

      const result = await todoService.getPendingTodos(userId);

      expect(todoRepository.findByStatus).toHaveBeenCalledWith(userId, false);
      expect(result).toHaveLength(1);
      expect(result[0].is_done).toBe(false);
    });
  });

  describe('toggleTodoStatus', () => {
    it('should toggle todo status from false to true', async () => {
      const todoId = 'todo_id_123';
      const currentTodo = {
        _id: todoId,
        title: 'Test Todo',
        is_done: false,
      };

      todoRepository.findById.mockResolvedValue(currentTodo);
      todoRepository.update.mockResolvedValue({
        ...currentTodo,
        is_done: true,
      });

      const result = await todoService.toggleTodoStatus(todoId);

      expect(result.is_done).toBe(true);
    });

    it('should toggle todo status from true to false', async () => {
      const todoId = 'todo_id_123';
      const currentTodo = {
        _id: todoId,
        title: 'Test Todo',
        is_done: true,
      };

      todoRepository.findById.mockResolvedValue(currentTodo);
      todoRepository.update.mockResolvedValue({
        ...currentTodo,
        is_done: false,
      });

      const result = await todoService.toggleTodoStatus(todoId);

      expect(result.is_done).toBe(false);
    });
  });
});
