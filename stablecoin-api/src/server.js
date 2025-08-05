/**
 * Refactored Enterprise Stablecoin Banking API Server
 * 
 * This is the main entry point for the refactored API with improved architecture.
 * Features enhanced security, logging, error handling, and modular design.
 * 
 * Key Improvements:
 * - Centralized configuration management
 * - Comprehensive error handling
 * - Structured logging with Winston
 * - Security middleware (rate limiting, CORS, input validation)
 * - Modular architecture with separation of concerns
 * - Performance monitoring
 * - Request/response logging
 */

const express = require('express');
const compression = require('compression');

// Import configuration and utilities
const { config, validateConfig } = require('./config');
const { errorHandler, notFoundHandler } = require('./utils/errorHandler');
const { logger, requestLogger, healthLogger } = require('./utils/logger');
const { securityMiddleware, createRateLimit } = require('./middleware/security');

// Import route modules (to be refactored)
const walletRoutes = require('../wallet');
const transferRoutes = require('../transfers');
const bankRoutes = require('../banks');
const userRoutes = require('../users');
const roleRoutes = require('../roles');
const { router: notificationRoutes, notificationService } = require('../notifications');
const { specs, swaggerUi } = require('../swagger');

// Import database connection
const db = require('../database/connection');

// Create Express app
const app = express();

// Validate configuration
try {
  validateConfig();
  logger.info('Configuration validated successfully');
} catch (error) {
  logger.error('Configuration validation failed', { error: error.message });
  process.exit(1);
}

// Apply security middleware
app.use(securityMiddleware);

// Apply compression for better performance
app.use(compression());

// Parse JSON requests
app.use(express.json({ limit: config.security.requestSizeLimit }));

// Apply request logging
app.use(requestLogger);

// Set up Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

/**
 * Health Check Endpoint
 * Enhanced with logging and detailed system information
 */
app.get('/api/health', (req, res) => {
  const startTime = Date.now();
  
  try {
    // Check database connectivity
    const dbCheck = db.prepare('SELECT 1 as health').get();
    const dbHealthy = dbCheck && dbCheck.health === 1;
    
    // Check memory usage
    const memUsage = process.memoryUsage();
    const memoryHealthy = memUsage.heapUsed < 512 * 1024 * 1024; // 512MB limit
    
    // Determine overall health
    const healthy = dbHealthy && memoryHealthy;
    const status = healthy ? 'healthy' : 'unhealthy';
    
    const response = {
      message: "Stablecoin API is running",
      timestamp: new Date().toISOString(),
      status,
      version: "1.0.0",
      environment: config.env,
      uptime: process.uptime(),
      memory: {
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + 'MB',
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + 'MB',
        external: Math.round(memUsage.external / 1024 / 1024) + 'MB'
      },
      database: {
        status: dbHealthy ? 'connected' : 'disconnected'
      },
      features: [
        "Multi-bank user management",
        "Custom approval workflows", 
        "Role-based permissions",
        "Enterprise-grade security",
        "Real-time notifications",
        "Comprehensive logging"
      ]
    };
    
    const duration = Date.now() - startTime;
    healthLogger(status, { duration, dbHealthy, memoryHealthy });
    
    res.status(healthy ? 200 : 503).json(response);
  } catch (error) {
    logger.error('Health check failed', { error: error.message });
    res.status(503).json({
      message: "API is experiencing issues",
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

/**
 * API Information Endpoint
 * Enhanced with detailed API capabilities and configuration
 */
app.get('/api/info', (req, res) => {
  const response = {
    name: "Enterprise Stablecoin Banking API",
    description: "Complete banking infrastructure with user management and approval workflows",
    version: "1.0.0",
    environment: config.env,
    documentation: "Visit /api-docs for interactive API documentation",
    endpoints: [
      "POST /api/banks/register - Register your bank",
      "POST /api/users/create - Create bank users", 
      "GET /api/roles/list - View roles and permissions",
      "POST /api/wallets/create - Create treasury wallets",
      "POST /api/transfers/initiate - Initiate transfers with approvals",
      "POST /api/transfers/{id}/approve - Approve pending transfers"
    ],
    features: [
      "Multi-bank user management",
      "Custom approval workflows",
      "Role-based permissions", 
      "Instant wallet creation",
      "30-second transfer processing",
      "Complete audit trails",
      "Interactive API documentation",
      "Real-time notifications",
      "Comprehensive security",
      "Performance monitoring"
    ],
    configuration: {
      rateLimit: config.security.rateLimitMax + " requests per " + (config.security.rateLimitWindow / 1000 / 60) + " minutes",
      maxTransferAmount: config.transfers.maxAmount,
      autoApproveLimit: config.transfers.autoApproveLimit,
      feePercentage: config.transfers.feePercentage * 100 + "%"
    }
  };
  
  res.json(response);
});

// Apply rate limiting to all API routes
const apiRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: config.security.rateLimitMax
});

// API routes with rate limiting
app.use('/api/banks', apiRateLimit, bankRoutes);
app.use('/api/users', apiRateLimit, userRoutes);
app.use('/api/roles', apiRateLimit, roleRoutes);
app.use('/api/wallets', apiRateLimit, walletRoutes);
app.use('/api/transfers', apiRateLimit, transferRoutes);
app.use('/api/notifications', apiRateLimit, notificationRoutes);

// 404 handler for undefined routes
app.use('*', notFoundHandler);

// Global error handling middleware (must be last)
app.use(errorHandler);

/**
 * Graceful shutdown handler
 */
function gracefulShutdown(signal) {
  logger.info(`Received ${signal}, starting graceful shutdown`);
  
  // Close database connection
  try {
    db.close();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database connection', { error: error.message });
  }
  
  // Close server
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
  
  // Force exit after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
}

// Start server
const server = app.listen(config.port, config.host, () => {
  logger.info('🚀 Enterprise Stablecoin Banking API started', {
    port: config.port,
    host: config.host,
    environment: config.env,
    version: '1.0.0'
  });
  
  console.log(`
🏦 Enterprise Stablecoin Banking API
====================================
🌐 Server: http://${config.host}:${config.port}
📚 Documentation: http://${config.host}:${config.port}/api-docs
🏥 Health Check: http://${config.host}:${config.port}/api/health
ℹ️  API Info: http://${config.host}:${config.port}/api/info
🔐 Bank Registration: http://${config.host}:${config.port}/api/banks/register
🌐 WebSocket: ws://${config.host}:${config.port}/ws
📊 Environment: ${config.env}
⚡ Version: 1.0.0
  `);
});

// Set up WebSocket server for notifications
if (notificationService) {
  notificationService.setWebSocketServer(server);
  logger.info('WebSocket server initialized for real-time notifications');
}

// Handle graceful shutdown
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason: reason?.message || reason, promise });
  process.exit(1);
});

module.exports = { app, server }; 