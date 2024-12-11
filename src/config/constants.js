module.exports = {
  // Database
  DB_POOL_MAX: 5,
  DB_POOL_MIN: 0,
  DB_POOL_ACQUIRE: 30000,
  DB_POOL_IDLE: 10000,
  
  // Authentication
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: '24h',
  
  // API Limits
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX: 100, // requests per window
  
  // File Upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
  
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100
};