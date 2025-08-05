/**
 * Centralized Error Handling
 * 
 * Provides consistent error handling across the application.
 * Includes error logging, response formatting, and error classification.
 * 
 * Features:
 * - Consistent error response format
 * - Error logging with context
 * - Error classification (client vs server errors)
 * - Stack trace handling for development
 */

const { config } = require('../config');

// Error types for classification
const ERROR_TYPES = {
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTHENTICATION_ERROR',
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  CONFLICT: 'CONFLICT_ERROR',
  RATE_LIMIT: 'RATE_LIMIT_ERROR',
  DATABASE: 'DATABASE_ERROR',
  EXTERNAL_SERVICE: 'EXTERNAL_SERVICE_ERROR',
  INTERNAL: 'INTERNAL_ERROR'
};

// HTTP status codes mapping
const STATUS_CODES = {
  [ERROR_TYPES.VALIDATION]: 400,
  [ERROR_TYPES.AUTHENTICATION]: 401,
  [ERROR_TYPES.AUTHORIZATION]: 403,
  [ERROR_TYPES.NOT_FOUND]: 404,
  [ERROR_TYPES.CONFLICT]: 409,
  [ERROR_TYPES.RATE_LIMIT]: 429,
  [ERROR_TYPES.DATABASE]: 500,
  [ERROR_TYPES.EXTERNAL_SERVICE]: 502,
  [ERROR_TYPES.INTERNAL]: 500
};

/**
 * Custom error class for application errors
 */
class AppError extends Error {
  constructor(message, type = ERROR_TYPES.INTERNAL, statusCode = null, details = null) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.statusCode = statusCode || STATUS_CODES[type] || 500;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Create a standardized error response
 */
function createErrorResponse(error, includeStack = false) {
  const response = {
    error: {
      message: error.message,
      type: error.type || ERROR_TYPES.INTERNAL,
      code: error.statusCode || 500,
      timestamp: error.timestamp || new Date().toISOString()
    }
  };

  // Add details if available
  if (error.details) {
    response.error.details = error.details;
  }

  // Add stack trace in development
  if (includeStack && config.env === 'development' && error.stack) {
    response.error.stack = error.stack;
  }

  return response;
}

/**
 * Log error with context
 */
function logError(error, context = {}) {
  const logData = {
    timestamp: new Date().toISOString(),
    error: {
      message: error.message,
      type: error.type || ERROR_TYPES.INTERNAL,
      code: error.statusCode || 500,
      stack: error.stack
    },
    context: {
      url: context.url,
      method: context.method,
      userAgent: context.userAgent,
      ip: context.ip,
      bankId: context.bankId,
      userId: context.userId,
      ...context
    }
  };

  // Log based on environment
  if (config.env === 'development') {
    console.error('🚨 Error:', JSON.stringify(logData, null, 2));
  } else {
    console.error('Error:', JSON.stringify(logData));
  }
}

/**
 * Express error handling middleware
 */
function errorHandler(err, req, res, next) {
  // Log the error
  logError(err, {
    url: req.url,
    method: req.method,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    bankId: req.bank?.id,
    userId: req.user?.id
  });

  // Handle different error types
  let error = err;

  // If it's not our custom error, convert it
  if (!(err instanceof AppError)) {
    // Handle database errors
    if (err.code === 'SQLITE_CONSTRAINT') {
      error = new AppError('Database constraint violation', ERROR_TYPES.CONFLICT, 409);
    } else if (err.code === 'SQLITE_BUSY') {
      error = new AppError('Database is busy, please try again', ERROR_TYPES.DATABASE, 503);
    } else if (err.name === 'ValidationError') {
      error = new AppError(err.message, ERROR_TYPES.VALIDATION, 400, err.details);
    } else {
      error = new AppError(
        err.message || 'Internal server error',
        ERROR_TYPES.INTERNAL,
        500
      );
    }
  }

  // Create error response
  const errorResponse = createErrorResponse(error, config.env === 'development');

  // Send response
  res.status(error.statusCode).json(errorResponse);
}

/**
 * 404 handler for undefined routes
 */
function notFoundHandler(req, res) {
  const error = new AppError(
    `Route ${req.method} ${req.url} not found`,
    ERROR_TYPES.NOT_FOUND,
    404
  );
  
  logError(error, {
    url: req.url,
    method: req.method,
    userAgent: req.get('User-Agent'),
    ip: req.ip
  });

  res.status(404).json(createErrorResponse(error));
}

/**
 * Async error wrapper for route handlers
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Validation error helper
 */
function createValidationError(message, details = null) {
  return new AppError(message, ERROR_TYPES.VALIDATION, 400, details);
}

/**
 * Authentication error helper
 */
function createAuthError(message = 'Authentication failed') {
  return new AppError(message, ERROR_TYPES.AUTHENTICATION, 401);
}

/**
 * Authorization error helper
 */
function createAuthzError(message = 'Insufficient permissions') {
  return new AppError(message, ERROR_TYPES.AUTHORIZATION, 403);
}

/**
 * Not found error helper
 */
function createNotFoundError(resource = 'Resource') {
  return new AppError(`${resource} not found`, ERROR_TYPES.NOT_FOUND, 404);
}

/**
 * Conflict error helper
 */
function createConflictError(message = 'Resource conflict') {
  return new AppError(message, ERROR_TYPES.CONFLICT, 409);
}

module.exports = {
  AppError,
  ERROR_TYPES,
  STATUS_CODES,
  createErrorResponse,
  logError,
  errorHandler,
  notFoundHandler,
  asyncHandler,
  createValidationError,
  createAuthError,
  createAuthzError,
  createNotFoundError,
  createConflictError
}; 