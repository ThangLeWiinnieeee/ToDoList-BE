const tagController = require('../../controllers/tag.controller');
const tagService = require('../../services/tag.service');

// Mock dependencies
jest.mock('../../services/tag.service');
jest.mock('../../utils/logger', () => ({
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

describe('TagController', () => {
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

  describe('createTag', () => {
    it('should create a new tag', async () => {
      req.body = {
        name: 'Work',
        color: '#FF5733',
      };

      const newTag = {
        _id: 'tag_id_123',
        user_id: 'user_id_123',
        name: 'Work',
        color: '#FF5733',
      };

      tagService.createTag.mockResolvedValue(newTag);

      await tagController.createTag(req, res);

      expect(tagService.createTag).toHaveBeenCalledWith('user_id_123', req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Tag created successfully',
        })
      );
    });

    it('should return 401 if user not authenticated', async () => {
      req.user = undefined;
      req.body = { name: 'Work', color: '#FF5733' };

      await tagController.createTag(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should return 400 for invalid color', async () => {
      req.body = { name: 'Work', color: 'invalid' };

      tagService.createTag.mockRejectedValue(
        new Error('Valid color code is required')
      );

      await tagController.createTag(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('getAllTags', () => {
    it('should return all tags for user', async () => {
      const tags = [
        {
          _id: '1',
          name: 'Work',
          color: '#FF5733',
          user_id: 'user_id_123',
        },
        {
          _id: '2',
          name: 'Personal',
          color: '#33FF57',
          user_id: 'user_id_123',
        },
      ];

      tagService.getAllTags.mockResolvedValue(tags);

      await tagController.getAllTags(req, res);

      expect(tagService.getAllTags).toHaveBeenCalledWith('user_id_123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          total: 2,
        })
      );
    });

    it('should return 401 if user not authenticated', async () => {
      req.user = undefined;

      await tagController.getAllTags(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe('getTagById', () => {
    it('should return a tag by id', async () => {
      req.params = { id: 'tag_id_123' };

      const tag = {
        _id: 'tag_id_123',
        name: 'Work',
        color: '#FF5733',
        user_id: 'user_id_123',
      };

      tagService.getTagById.mockResolvedValue(tag);

      await tagController.getTagById(req, res);

      expect(tagService.getTagById).toHaveBeenCalledWith('tag_id_123');
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 if tag not found', async () => {
      req.params = { id: 'invalid_id' };

      tagService.getTagById.mockRejectedValue(new Error('Tag not found'));

      await tagController.getTagById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('updateTag', () => {
    it('should update a tag', async () => {
      req.params = { id: 'tag_id_123' };
      req.body = { name: 'Updated Work', color: '#0000FF' };

      const updatedTag = {
        _id: 'tag_id_123',
        name: 'Updated Work',
        color: '#0000FF',
        user_id: 'user_id_123',
      };

      tagService.updateTag.mockResolvedValue(updatedTag);

      await tagController.updateTag(req, res);

      expect(tagService.updateTag).toHaveBeenCalledWith(
        'tag_id_123',
        req.body
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 400 for invalid data', async () => {
      req.params = { id: 'tag_id_123' };
      req.body = { name: '', color: '#0000FF' };

      tagService.updateTag.mockRejectedValue(
        new Error('Tag name cannot be empty')
      );

      await tagController.updateTag(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('deleteTag', () => {
    it('should delete a tag', async () => {
      req.params = { id: 'tag_id_123' };

      const deletedTag = {
        _id: 'tag_id_123',
        name: 'Work',
        color: '#FF5733',
      };

      tagService.deleteTag.mockResolvedValue(deletedTag);

      await tagController.deleteTag(req, res);

      expect(tagService.deleteTag).toHaveBeenCalledWith('tag_id_123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Tag deleted successfully',
        })
      );
    });

    it('should return 404 if tag not found', async () => {
      req.params = { id: 'invalid_id' };

      tagService.deleteTag.mockRejectedValue(new Error('Tag not found'));

      await tagController.deleteTag(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
