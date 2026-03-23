const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Tag name is required'],
      trim: true,
      maxlength: 50,
    },
    color: {
      type: String,
      required: [true, 'Color is required'],
      match: [/^#[0-9A-Fa-f]{6}$/, 'Please provide a valid hex color code (e.g., #FF5733)'],
    },
  },
  {
    timestamps: true, // tự động tạo createdAt, updatedAt
  }
);

// Index cho query thường dùng
tagSchema.index({ userId: 1, name: 1 });

module.exports = mongoose.model('Tag', tagSchema);
