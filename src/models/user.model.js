const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // không trả về khi query mặc định
      minlength: 6,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 50,
    },
  },
  {
    timestamps: true, // tự động tạo createdAt, updatedAt
  }
);

module.exports = mongoose.model('User', userSchema);
