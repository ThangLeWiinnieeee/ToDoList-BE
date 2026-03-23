require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const routes = require('./routes');
const errorMiddleware = require('./middlewares/error.middleware');
const { generalLimiter } = require('./middlewares/rateLimit.middleware');
const logger = require('./utils/logger');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Apply general rate limiter
app.use(generalLimiter);

// Connect Database
connectDB();

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// API Routes
app.use('/api', routes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// Error Middleware — phải đặt CUỐI CÙNG
app.use(errorMiddleware);

// Start Server
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  logger.info(`Server running on ${PORT} in ${NODE_ENV} mode`);
});

module.exports = app;
