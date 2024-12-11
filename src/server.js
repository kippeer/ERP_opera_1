require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { stream } = require('./utils/logger');
const constants = require('./config/constants');

// Import routes
const customerRoutes = require('./routes/customerRoutes');
const salesRoutes = require('./routes/salesRoutes');
const marketingRoutes = require('./routes/marketingRoutes');
const commissionRoutes = require('./routes/commissionRoutes');
const supportRoutes = require('./routes/supportRoutes');
const documentRoutes = require('./routes/documentRoutes');
const quotationRoutes = require('./routes/quotationRoutes');
const loyaltyRoutes = require('./routes/loyaltyRoutes');

// Import database configuration
const sequelize = require('./config/database');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: constants.RATE_LIMIT_WINDOW,
  max: constants.RATE_LIMIT_MAX
});
app.use(limiter);

// Request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined', { stream }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/customers', customerRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/commission', commissionRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/loyalty', loyaltyRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

// Database sync and server start
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.sync();
    logger.info('Database synchronized successfully');
    
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;