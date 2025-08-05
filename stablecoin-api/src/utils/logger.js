/**
 * Logging System
 * 
 * Centralized logging using Winston for structured logging.
 * Provides different log levels, formats, and outputs based on environment.
 * 
 * Features:
 * - Structured JSON logging
 * - Different log levels (error, warn, info, debug)
 * - Environment-specific configurations
 * - Request/response logging
 * - Performance monitoring
 */

const winston = require('winston');
const { config } = require('../config');

// Custom log format for development
const developmentFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    if (stack) {
      log += `\n${stack}`;
    }
    return log;
  })
);

// JSON format for production
const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create logger instance
const logger = winston.createLogger({
  level: config.logging.level,
  format: config.env === 'production' ? productionFormat : developmentFormat,
  defaultMeta: { 
    service: 'stablecoin-api',
    environment: config.env 
  },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: config.env === 'production' ? productionFormat : developmentFormat
    })
  ]
});

// Add file transport if specified
if (config.logging.file) {
  logger.add(new winston.transports.File({
    filename: config.logging.file,
    format: productionFormat
  }));
}

// Request logging middleware
function requestLogger(req, res, next) {
  const start = Date.now();
  
  // Log request
  logger.info('Incoming request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    bankId: req.bank?.id,
    userId: req.user?.id,
    requestId: req.headers['x-request-id'] || generateRequestId()
  });

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const duration = Date.now() - start;
    
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('Content-Length'),
      bankId: req.bank?.id,
      userId: req.user?.id
    });
    
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
}

// Generate unique request ID
function generateRequestId() {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Performance monitoring
function performanceLogger(operation, startTime) {
  const duration = Date.now() - startTime;
  
  logger.info('Performance metric', {
    operation,
    duration: `${duration}ms`,
    timestamp: new Date().toISOString()
  });
  
  return duration;
}

// Database query logger
function queryLogger(sql, params, duration) {
  logger.debug('Database query', {
    sql: sql.length > 200 ? sql.substring(0, 200) + '...' : sql,
    params: params ? params.slice(0, 3) : null, // Log first 3 params for privacy
    duration: `${duration}ms`,
    timestamp: new Date().toISOString()
  });
}

// Security event logger
function securityLogger(event, details) {
  logger.warn('Security event', {
    event,
    details,
    timestamp: new Date().toISOString()
  });
}

// Transfer event logger
function transferLogger(event, transferId, amount, currency, bankId) {
  logger.info('Transfer event', {
    event,
    transferId,
    amount,
    currency,
    bankId,
    timestamp: new Date().toISOString()
  });
}

// Error logger (enhanced)
function errorLogger(error, context = {}) {
  logger.error('Application error', {
    message: error.message,
    stack: error.stack,
    type: error.type || 'UNKNOWN',
    code: error.statusCode || 500,
    context,
    timestamp: new Date().toISOString()
  });
}

// API usage logger
function apiUsageLogger(endpoint, method, bankId, userId, success) {
  logger.info('API usage', {
    endpoint,
    method,
    bankId,
    userId,
    success,
    timestamp: new Date().toISOString()
  });
}

// Notification logger
function notificationLogger(type, recipient, success, error = null) {
  logger.info('Notification sent', {
    type,
    recipient: recipient ? recipient.substring(0, 10) + '...' : null,
    success,
    error: error?.message,
    timestamp: new Date().toISOString()
  });
}

// Health check logger
function healthLogger(status, details = {}) {
  logger.info('Health check', {
    status,
    details,
    timestamp: new Date().toISOString()
  });
}

module.exports = {
  logger,
  requestLogger,
  performanceLogger,
  queryLogger,
  securityLogger,
  transferLogger,
  errorLogger,
  apiUsageLogger,
  notificationLogger,
  healthLogger
}; 