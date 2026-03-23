const express = require('express');
const router = express.Router();

// Welcome endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Todo List API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      todos: '/api/todos',
      tags: '/api/tags',
      health: '/health',
    },
  });
});

// Status endpoint
router.get('/status', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date(),
  });
});

// Routes
router.use('/auth', require('./auth.route'));
router.use('/todos', require('./todo.route'));
router.use('/tags', require('./tag.route'));

module.exports = router;
