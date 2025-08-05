/**
 * Configuration Management
 * 
 * Centralized configuration for the Stablecoin Banking API.
 * Handles environment variables, database settings, and API configuration.
 * 
 * Features:
 * - Environment-based configuration
 * - Secure credential management
 * - Validation of required settings
 * - Default values for development
 */

const path = require('path');

// Environment configuration
const env = process.env.NODE_ENV || 'development';

// Base configuration
const baseConfig = {
  // Server settings
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
  
  // Database settings
  database: {
    path: process.env.DATABASE_PATH || path.join(__dirname, '../../database/stablecoin.db'),
    timeout: parseInt(process.env.DATABASE_TIMEOUT) || 5000,
    verbose: process.env.DATABASE_VERBOSE === 'true' || false
  },
  
  // Security settings
  security: {
    apiKeyHeader: 'X-API-Key',
    rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100, // requests per window
    corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000'],
    requestSizeLimit: process.env.REQUEST_SIZE_LIMIT || '10mb'
  },
  
  // Transfer settings
  transfers: {
    maxAmount: parseFloat(process.env.MAX_TRANSFER_AMOUNT) || 1000000,
    minAmount: parseFloat(process.env.MIN_TRANSFER_AMOUNT) || 1,
    feePercentage: parseFloat(process.env.TRANSFER_FEE_PERCENTAGE) || 0.001, // 0.1%
    autoApproveLimit: parseFloat(process.env.AUTO_APPROVE_LIMIT) || 9999
  },
  
  // Notification settings
  notifications: {
    emailEnabled: process.env.EMAIL_ENABLED === 'true' || false,
    smsEnabled: process.env.SMS_ENABLED === 'true' || false,
    webhookEnabled: process.env.WEBHOOK_ENABLED === 'true' || true,
    defaultPriority: process.env.DEFAULT_NOTIFICATION_PRIORITY || 'normal'
  },
  
  // Logging settings
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
    file: process.env.LOG_FILE || null
  },
  
  // External services
  external: {
    circleApiKey: process.env.CIRCLE_API_KEY || null,
    fireblocksApiKey: process.env.FIREBLOCKS_API_KEY || null,
    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || null,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || null,
    emailService: process.env.EMAIL_SERVICE || 'gmail',
    emailUser: process.env.EMAIL_USER || null,
    emailPassword: process.env.EMAIL_PASSWORD || null
  }
};

// Environment-specific configurations
const environmentConfigs = {
  development: {
    logging: {
      level: 'debug',
      format: 'simple'
    },
    security: {
      rateLimitMax: 1000 // Higher limits for development
    }
  },
  
  production: {
    logging: {
      level: 'warn',
      format: 'json'
    },
    security: {
      rateLimitMax: 100 // Stricter limits for production
    }
  },
  
  test: {
    port: 3001,
    database: {
      path: ':memory:', // In-memory database for testing
      verbose: false
    },
    logging: {
      level: 'error',
      format: 'simple'
    }
  }
};

// Merge configurations
const config = {
  ...baseConfig,
  ...environmentConfigs[env],
  env
};

// Validation function
function validateConfig() {
  const requiredFields = [
    'port',
    'database.path',
    'security.apiKeyHeader'
  ];
  
  const missingFields = requiredFields.filter(field => {
    const value = field.split('.').reduce((obj, key) => obj?.[key], config);
    return value === undefined || value === null;
  });
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required configuration fields: ${missingFields.join(', ')}`);
  }
  
  // Validate transfer settings
  if (config.transfers.minAmount >= config.transfers.maxAmount) {
    throw new Error('MIN_TRANSFER_AMOUNT must be less than MAX_TRANSFER_AMOUNT');
  }
  
  if (config.transfers.feePercentage < 0 || config.transfers.feePercentage > 1) {
    throw new Error('TRANSFER_FEE_PERCENTAGE must be between 0 and 1');
  }
  
  return true;
}

// Export configuration
module.exports = {
  config,
  validateConfig,
  env
}; 