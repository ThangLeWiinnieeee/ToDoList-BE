const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
    },
    tagIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    deletedAt: {
      type: Date,
      default: null, // null = chưa xoá (soft delete)
    },
  },
  {
    timestamps: true, // tự động tạo createdAt, updatedAt
  }
);

// Index cho query thường dùng
todoSchema.index({ userId: 1, deletedAt: 1 });
todoSchema.index({ userId: 1, isDone: 1 });

module.exports = mongoose.model('Todo', todoSchema);
