/**
 * Security Middleware
 * 
 * Comprehensive security middleware for the Stablecoin Banking API.
 * Includes rate limiting, CORS, input validation, and security headers.
 * 
 * Features:
 * - Rate limiting by API key and IP
 * - CORS configuration
 * - Security headers
 * - Input sanitization
 * - Request size limits
 * - SQL injection prevention
 */

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const { config } = require('../config');
const { logger, securityLogger } = require('../utils/logger');
const { createAuthError, createValidationError } = require('../utils/errorHandler');

/**
 * Rate limiting middleware
 */
const createRateLimit = (options = {}) => {
  return rateLimit({
    windowMs: options.windowMs || config.security.rateLimitWindow,
    max: options.max || config.security.rateLimitMax,
    message: {
      error: 'Too many requests from this IP, please try again later.',
      type: 'RATE_LIMIT_ERROR',
      code: 429
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      // Use API key if available, otherwise use IP
      return req.headers[config.security.apiKeyHeader.toLowerCase()] || req.ip;
    },
    handler: (req, res) => {
      securityLogger('rate_limit_exceeded', {
        ip: req.ip,
        apiKey: req.headers[config.security.apiKeyHeader.toLowerCase()] ? 'present' : 'missing',
        userAgent: req.get('User-Agent')
      });
      
      res.status(429).json({
        error: 'Too many requests, please try again later.',
        type: 'RATE_LIMIT_ERROR',
        code: 429,
        retryAfter: Math.ceil(config.security.rateLimitWindow / 1000)
      });
    }
  });
};

/**
 * CORS configuration
 */
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (config.security.corsOrigins.includes(origin)) {
      callback(null, true);
    } else {
      securityLogger('cors_violation', { origin, allowedOrigins: config.security.corsOrigins });
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    config.security.apiKeyHeader,
    'X-Request-ID'
  ],
  exposedHeaders: ['X-Request-ID', 'X-Rate-Limit-Remaining']
};

/**
 * Security headers middleware
 */
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
});

/**
 * Input sanitization middleware
 */
const sanitizeInput = (req, res, next) => {
  try {
    // Sanitize body
    if (req.body) {
      sanitizeObject(req.body);
    }
    
    // Sanitize query parameters
    if (req.query) {
      sanitizeObject(req.query);
    }
    
    // Sanitize URL parameters
    if (req.params) {
      sanitizeObject(req.params);
    }
    
    next();
  } catch (error) {
    securityLogger('input_sanitization_failed', { error: error.message });
    next(createValidationError('Invalid input detected'));
  }
};

/**
 * Recursively sanitize object properties
 */
function sanitizeObject(obj) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'string') {
        obj[key] = sanitizeString(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    }
  }
}

/**
 * Sanitize string input
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  
  // Remove null bytes
  str = str.replace(/\0/g, '');
  
  // Remove control characters except newlines and tabs
  str = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // Trim whitespace
  str = str.trim();
  
  return str;
}

/**
 * Request size limit middleware
 */
const requestSizeLimit = (req, res, next) => {
  const contentLength = parseInt(req.get('Content-Length') || '0');
  const maxSize = parseSizeLimit(config.security.requestSizeLimit);
  
  if (contentLength > maxSize) {
    securityLogger('request_size_limit_exceeded', {
      contentLength,
      maxSize,
      ip: req.ip
    });
    
    return res.status(413).json({
      error: 'Request entity too large',
      type: 'VALIDATION_ERROR',
      code: 413
    });
  }
  
  next();
};

/**
 * Parse size limit string (e.g., "10mb" -> 10485760)
 */
function parseSizeLimit(sizeStr) {
  const units = {
    'b': 1,
    'kb': 1024,
    'mb': 1024 * 1024,
    'gb': 1024 * 1024 * 1024
  };
  
  const match = sizeStr.toLowerCase().match(/^(\d+)([kmg]?b?)$/);
  if (!match) return 10 * 1024 * 1024; // Default 10MB
  
  const [, size, unit] = match;
  return parseInt(size) * (units[unit] || units['b']);
}

/**
 * SQL injection prevention middleware
 */
const preventSqlInjection = (req, res, next) => {
  const sqlPatterns = [
    /(\b(union|select|insert|update|delete|drop|create|alter)\b)/i,
    /(\b(and|or)\s+\d+\s*=\s*\d+)/i,
    /(\b(and|or)\s+['"]\w+['"]\s*=\s*['"]\w+['"])/i,
    /(--|\/\*|\*\/)/,
    /(\bxp_cmdshell\b)/i,
    /(\bexec\b)/i
  ];
  
  const checkValue = (value) => {
    if (typeof value === 'string') {
      for (const pattern of sqlPatterns) {
        if (pattern.test(value)) {
          return true;
        }
      }
    }
    return false;
  };
  
  const checkObject = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (checkValue(obj[key])) {
          return true;
        }
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          if (checkObject(obj[key])) {
            return true;
          }
        }
      }
    }
    return false;
  };
  
  // Check body, query, and params
  if (checkObject(req.body) || checkObject(req.query) || checkObject(req.params)) {
    securityLogger('sql_injection_attempt', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.url
    });
    
    return res.status(400).json({
      error: 'Invalid input detected',
      type: 'VALIDATION_ERROR',
      code: 400
    });
  }
  
  next();
};

/**
 * API key validation middleware
 */
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers[config.security.apiKeyHeader.toLowerCase()];
  
  if (!apiKey) {
    securityLogger('missing_api_key', {
      ip: req.ip,
      url: req.url,
      userAgent: req.get('User-Agent')
    });
    
    return next(createAuthError('API key is required'));
  }
  
  // Basic API key format validation
  if (typeof apiKey !== 'string' || apiKey.length < 10) {
    securityLogger('invalid_api_key_format', {
      ip: req.ip,
      apiKeyLength: apiKey?.length || 0
    });
    
    return next(createAuthError('Invalid API key format'));
  }
  
  next();
};

/**
 * Request ID middleware
 */
const addRequestId = (req, res, next) => {
  req.requestId = req.headers['x-request-id'] || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  res.setHeader('X-Request-ID', req.requestId);
  next();
};

/**
 * Combine all security middleware
 */
const securityMiddleware = [
  addRequestId,
  securityHeaders,
  cors(corsOptions),
  requestSizeLimit,
  sanitizeInput,
  preventSqlInjection
];

module.exports = {
  createRateLimit,
  corsOptions,
  securityHeaders,
  sanitizeInput,
  requestSizeLimit,
  preventSqlInjection,
  validateApiKey,
  addRequestId,
  securityMiddleware
}; 