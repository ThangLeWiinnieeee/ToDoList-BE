const rateLimit = require('express-rate-limit');

// General rate limiter: 100 requests per 15 minutes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later',
    });
  },
});

// Auth limiter: 5 requests per 15 minutes (stricter for auth endpoints)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later',
  skipSuccessfulRequests: true, // Don't count successful requests against limit
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many login/register attempts, please try again in 15 minutes',
    });
  },
});

// Password change limiter: 3 requests per hour
const passwordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 requests per windowMs
  message: 'Too many password change attempts, please try again later',
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many password change attempts, please try again in 1 hour',
    });
  },
});

module.exports = {
  generalLimiter,
  authLimiter,
  passwordLimiter,
};
