const tagService = require('../../services/tag.service');
const tagRepository = require('../../repositories/tag.repository');

// Mock dependencies
jest.mock('../../repositories/tag.repository');
jest.mock('../../utils/logger', () => ({
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

describe('TagService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTag', () => {
    it('should create a new tag', async () => {
      const userId = 'user_id_123';
      const tagData = {
        name: 'Work',
        color: '#FF5733',
      };

      const newTag = {
        _id: 'tag_id_123',
        userId: userId,
        ...tagData,
      };

      tagRepository.create.mockResolvedValue(newTag);

      const result = await tagService.createTag(userId, tagData);

      expect(tagRepository.create).toHaveBeenCalled();
      expect(result.name).toBe('Work');
      expect(result.color).toBe('#FF5733');
    });

    it('should throw error if tag name is empty', async () => {
      const userId = 'user_id_123';
      const tagData = { name: '', color: '#FF5733' };

      await expect(tagService.createTag(userId, tagData)).rejects.toThrow(
        'Tag name is required'
      );
    });

    it('should throw error for invalid color code', async () => {
      const userId = 'user_id_123';
      const tagData = { name: 'Work', color: 'FF5733' }; // Missing #

      await expect(tagService.createTag(userId, tagData)).rejects.toThrow(
        'Valid color code is required'
      );
    });

    it('should throw error for wrong color format', async () => {
      const userId = 'user_id_123';
      const tagData = { name: 'Work', color: '#GGGGGG' }; // Invalid hex

      await expect(tagService.createTag(userId, tagData)).rejects.toThrow(
        'Valid color code is required'
      );
    });
  });

  describe('getAllTags', () => {
    it('should return all tags for a user', async () => {
      const userId = 'user_id_123';
      const tags = [
        { _id: '1', name: 'Work', color: '#FF5733', userId: userId },
        { _id: '2', name: 'Personal', color: '#33FF57', userId: userId },
      ];

      tagRepository.findByUserId.mockResolvedValue(tags);

      const result = await tagService.getAllTags(userId);

      expect(tagRepository.findByUserId).toHaveBeenCalledWith(userId);
      expect(result).toHaveLength(2);
    });
  });

  describe('getTagById', () => {
    it('should return tag by id', async () => {
      const tagId = 'tag_id_123';
      const tag = {
        _id: tagId,
        name: 'Work',
        color: '#FF5733',
        userId: 'user_id_123',
      };

      tagRepository.findById.mockResolvedValue(tag);

      const result = await tagService.getTagById(tagId);

      expect(tagRepository.findById).toHaveBeenCalledWith(tagId);
      expect(result.name).toBe('Work');
    });

    it('should throw error if tag not found', async () => {
      tagRepository.findById.mockResolvedValue(null);

      await expect(tagService.getTagById('invalid_id')).rejects.toThrow(
        'Tag not found'
      );
    });
  });

  describe('updateTag', () => {
    it('should update a tag', async () => {
      const tagId = 'tag_id_123';
      const updateData = { name: 'Updated Work', color: '#0000FF' };
      const updatedTag = {
        _id: tagId,
        ...updateData,
        userId: 'user_id_123',
      };

      tagRepository.update.mockResolvedValue(updatedTag);

      const result = await tagService.updateTag(tagId, updateData);

      expect(tagRepository.update).toHaveBeenCalledWith(tagId, updateData);
      expect(result.name).toBe('Updated Work');
      expect(result.color).toBe('#0000FF');
    });

    it('should throw error if tag name is empty during update', async () => {
      const tagId = 'tag_id_123';
      const updateData = { name: ' ', color: '#0000FF' };

      await expect(
        tagService.updateTag(tagId, updateData)
      ).rejects.toThrow('Tag name cannot be empty');
    });

    it('should throw error if tag not found during update', async () => {
      tagRepository.update.mockResolvedValue(null);

      await expect(
        tagService.updateTag('invalid_id', { name: 'New Name' })
      ).rejects.toThrow('Tag not found');
    });
  });

  describe('deleteTag', () => {
    it('should delete a tag', async () => {
      const tagId = 'tag_id_123';
      const deletedTag = {
        _id: tagId,
        name: 'Work',
        color: '#FF5733',
      };

      tagRepository.delete.mockResolvedValue(deletedTag);

      const result = await tagService.deleteTag(tagId);

      expect(tagRepository.delete).toHaveBeenCalledWith(tagId);
      expect(result._id).toBe(tagId);
    });

    it('should throw error if tag not found during delete', async () => {
      tagRepository.delete.mockResolvedValue(null);

      await expect(tagService.deleteTag('invalid_id')).rejects.toThrow(
        'Tag not found'
      );
    });
  });
});
