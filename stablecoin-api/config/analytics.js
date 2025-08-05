/**
 * Analytics System Configuration
 * Comprehensive configuration module for Nexora analytics system
 */

const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

/**
 * Environment Configuration
 * Different settings for development, staging, production
 */
const environments = {
  development: {
    debug: true,
    logLevel: 'debug',
    cacheEnabled: false,
    realtimeEnabled: true,
    testDataEnabled: true
  },
  staging: {
    debug: false,
    logLevel: 'info',
    cacheEnabled: true,
    realtimeEnabled: true,
    testDataEnabled: false
  },
  production: {
    debug: false,
    logLevel: 'warn',
    cacheEnabled: true,
    realtimeEnabled: true,
    testDataEnabled: false
  }
};

/**
 * Database Configuration
 * Connection settings and pooling for analytics queries
 */
const database = {
  // Primary connection settings
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'nexora_analytics',
  username: process.env.DB_USER || 'nexora_user',
  password: process.env.DB_PASSWORD || 'your_secure_password',
  ssl: process.env.DB_SSL === 'true',
  
  // Connection pooling
  pool: {
    min: parseInt(process.env.DB_POOL_MIN) || 2,
    max: parseInt(process.env.DB_POOL_MAX) || 20,
    acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
    idle: parseInt(process.env.DB_POOL_IDLE) || 10000
  },
  
  // Analytics schema
  schema: process.env.DB_SCHEMA || 'analytics',
  migrationsPath: process.env.DB_MIGRATIONS_PATH || './database/migrations',
  
  // Query optimization
  queryTimeout: parseInt(process.env.ANALYTICS_MAX_QUERY_TIME) || 5000,
  maxResultsPerPage: parseInt(process.env.ANALYTICS_MAX_RESULTS_PER_PAGE) || 1000,
  defaultPageSize: parseInt(process.env.ANALYTICS_DEFAULT_PAGE_SIZE) || 100
};

/**
 * Cache Configuration
 * Redis settings and cache TTL for analytics data
 */
const cache = {
  // Redis connection
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || null,
    db: parseInt(process.env.REDIS_DB) || 0,
    retryDelayOnFailover: 100,
    enableReadyCheck: false,
    maxRetriesPerRequest: null
  },
  
  // Cache settings
  enabled: process.env.CACHE_ENABLED === 'true' || false,
  prefix: process.env.CACHE_PREFIX || 'nexora:analytics',
  separator: process.env.CACHE_SEPARATOR || ':',
  
  // TTL settings (in seconds)
  ttl: {
    dashboard: parseInt(process.env.CACHE_TTL_DASHBOARD) || 300,
    kpis: parseInt(process.env.CACHE_TTL_KPIS) || 600,
    trends: parseInt(process.env.CACHE_TTL_TRENDS) || 900,
    networkPerformance: parseInt(process.env.CACHE_TTL_NETWORK_PERFORMANCE) || 1200,
    costSavings: parseInt(process.env.CACHE_TTL_COST_SAVINGS) || 1800
  }
};

/**
 * Analytics Performance Settings
 * Data retention, thresholds, and real-time settings
 */
const analytics = {
  // Data retention policies (in days)
  retention: {
    daily: parseInt(process.env.ANALYTICS_RETENTION_DAILY) || 90,
    monthly: parseInt(process.env.ANALYTICS_RETENTION_MONTHLY) || 365,
    yearly: parseInt(process.env.ANALYTICS_RETENTION_YEARLY) || 2555
  },
  
  // Performance thresholds
  thresholds: {
    maxQueryTime: parseInt(process.env.ANALYTICS_MAX_QUERY_TIME) || 5000,
    maxResultsPerPage: parseInt(process.env.ANALYTICS_MAX_RESULTS_PER_PAGE) || 1000,
    defaultPageSize: parseInt(process.env.ANALYTICS_DEFAULT_PAGE_SIZE) || 100
  },
  
  // Real-time settings
  realtime: {
    enabled: process.env.ANALYTICS_REALTIME_ENABLED === 'true' || false,
    interval: parseInt(process.env.ANALYTICS_REALTIME_INTERVAL) || 30000,
    maxConnections: parseInt(process.env.ANALYTICS_REALTIME_MAX_CONNECTIONS) || 100
  },
  
  // Default time periods
  periods: ['7d', '30d', '90d', '1y'],
  defaultPeriod: '30d'
};

/**
 * Cost Calculation Parameters
 * SWIFT vs Nexora cost comparison settings
 */
const costCalculation = {
  // SWIFT transfer costs (USD)
  swift: {
    wireFee: parseFloat(process.env.SWIFT_WIRE_FEE) || 25.00,
    correspondentFee: parseFloat(process.env.SWIFT_CORRESPONDENT_FEE) || 15.00,
    fxMarginPercentage: parseFloat(process.env.SWIFT_FX_MARGIN_PERCENTAGE) || 2.5,
    minimumFee: parseFloat(process.env.SWIFT_MINIMUM_FEE) || 40.00
  },
  
  // Nexora transfer costs (USD)
  nexora: {
    networkFees: {
      polygon: parseFloat(process.env.NEXORA_NETWORK_FEE_POLYGON) || 0.50,
      ethereum: parseFloat(process.env.NEXORA_NETWORK_FEE_ETHEREUM) || 5.00,
      arbitrum: parseFloat(process.env.NEXORA_NETWORK_FEE_ARBITRUM) || 2.00,
      base: parseFloat(process.env.NEXORA_NETWORK_FEE_BASE) || 1.00
    },
    platformFeePercentage: parseFloat(process.env.NEXORA_PLATFORM_FEE_PERCENTAGE) || 0.1,
    minimumFee: parseFloat(process.env.NEXORA_MINIMUM_FEE) || 1.00
  },
  
  // FX rate settings
  fx: {
    rateSource: process.env.FX_RATE_SOURCE || 'api',
    cacheTtl: parseInt(process.env.FX_RATE_CACHE_TTL) || 3600,
    fallbackUsd: parseFloat(process.env.FX_RATE_FALLBACK_USD) || 1.00
  }
};

/**
 * Rate Limiting Configuration
 * Different limits for different subscription plans
 */
const rateLimiting = {
  // Rate limits by plan (requests per hour)
  limits: {
    free: parseInt(process.env.RATE_LIMIT_FREE) || 100,
    standard: parseInt(process.env.RATE_LIMIT_STANDARD) || 1000,
    professional: parseInt(process.env.RATE_LIMIT_PROFESSIONAL) || 10000,
    enterprise: parseInt(process.env.RATE_LIMIT_ENTERPRISE) || 100000
  },
  
  // Burst limits (requests per minute)
  burst: {
    free: parseInt(process.env.RATE_LIMIT_BURST_FREE) || 10,
    standard: parseInt(process.env.RATE_LIMIT_BURST_STANDARD) || 100,
    professional: parseInt(process.env.RATE_LIMIT_BURST_PROFESSIONAL) || 1000,
    enterprise: parseInt(process.env.RATE_LIMIT_BURST_ENTERPRISE) || 10000
  },
  
  // Rate limit window (in seconds)
  window: parseInt(process.env.RATE_LIMIT_WINDOW) || 3600,
  enabled: process.env.API_RATE_LIMIT_ENABLED === 'true' || true
};

/**
 * Report Generation Settings
 * PDF and Excel export configuration
 */
const reports = {
  // PDF report settings
  pdf: {
    enabled: process.env.PDF_REPORT_ENABLED === 'true' || true,
    templatePath: process.env.PDF_REPORT_TEMPLATE_PATH || './templates/reports',
    outputPath: process.env.PDF_REPORT_OUTPUT_PATH || './reports/pdf',
    retentionDays: parseInt(process.env.PDF_REPORT_RETENTION_DAYS) || 30
  },
  
  // Excel export settings
  excel: {
    enabled: process.env.EXCEL_EXPORT_ENABLED === 'true' || true,
    outputPath: process.env.EXCEL_EXPORT_OUTPUT_PATH || './reports/excel',
    retentionDays: parseInt(process.env.EXCEL_EXPORT_RETENTION_DAYS) || 30
  },
  
  // Generation limits
  limits: {
    maxSizeMb: parseInt(process.env.REPORT_MAX_SIZE_MB) || 50,
    maxPages: parseInt(process.env.REPORT_MAX_PAGES) || 100,
    generationTimeout: parseInt(process.env.REPORT_GENERATION_TIMEOUT) || 300000
  }
};

/**
 * WebSocket Configuration
 * Real-time updates and connection settings
 */
const websocket = {
  enabled: process.env.WS_ENABLED === 'true' || true,
  port: parseInt(process.env.WS_PORT) || 3001,
  path: process.env.WS_PATH || '/analytics/ws',
  heartbeatInterval: parseInt(process.env.WS_HEARTBEAT_INTERVAL) || 30000,
  maxPayloadSize: parseInt(process.env.WS_MAX_PAYLOAD_SIZE) || 1048576,
  
  // Authentication
  auth: {
    required: process.env.WS_AUTH_REQUIRED === 'true' || true,
    timeout: parseInt(process.env.WS_AUTH_TIMEOUT) || 5000
  }
};

/**
 * File Storage Configuration
 * Local and cloud storage settings
 */
const fileStorage = {
  // Storage type (local, s3, etc.)
  type: process.env.FILE_STORAGE_TYPE || 'local',
  
  // Local storage
  local: {
    path: process.env.FILE_STORAGE_PATH || './storage',
    maxSizeMb: parseInt(process.env.FILE_STORAGE_MAX_SIZE_MB) || 1000,
    retentionDays: parseInt(process.env.FILE_STORAGE_RETENTION_DAYS) || 90
  },
  
  // AWS S3 storage
  s3: {
    bucket: process.env.AWS_S3_BUCKET || 'nexora-analytics-reports',
    region: process.env.AWS_S3_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
};

/**
 * Monitoring and Alerting Configuration
 * Performance monitoring and notification settings
 */
const monitoring = {
  enabled: process.env.MONITORING_ENABLED === 'true' || true,
  sampleRate: parseFloat(process.env.MONITORING_SAMPLE_RATE) || 0.1,
  maxTracesPerSecond: parseInt(process.env.MONITORING_MAX_TRACES_PER_SECOND) || 10,
  
  // Alerting thresholds
  alerts: {
    slowQueryThreshold: parseInt(process.env.ALERT_SLOW_QUERY_THRESHOLD) || 5000,
    errorRateThreshold: parseFloat(process.env.ALERT_ERROR_RATE_THRESHOLD) || 0.05,
    memoryUsageThreshold: parseFloat(process.env.ALERT_MEMORY_USAGE_THRESHOLD) || 0.8,
    diskUsageThreshold: parseFloat(process.env.ALERT_DISK_USAGE_THRESHOLD) || 0.9
  },
  
  // Notification settings
  notifications: {
    webhookUrl: process.env.NOTIFICATION_WEBHOOK_URL,
    email: {
      enabled: process.env.NOTIFICATION_EMAIL_ENABLED === 'true' || false,
      from: process.env.NOTIFICATION_EMAIL_FROM || 'alerts@nexora.com',
      to: process.env.NOTIFICATION_EMAIL_TO || 'admin@nexora.com'
    }
  }
};

/**
 * Security Configuration
 * JWT, CORS, and encryption settings
 */
const security = {
  // JWT settings
  jwt: {
    secret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_here',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },
  
  // API security
  api: {
    rateLimitEnabled: process.env.API_RATE_LIMIT_ENABLED === 'true' || true,
    corsOrigin: process.env.API_CORS_ORIGIN || '*',
    corsCredentials: process.env.API_CORS_CREDENTIALS === 'true' || true
  },
  
  // Encryption
  encryption: {
    key: process.env.ENCRYPTION_KEY || 'your_32_character_encryption_key',
    algorithm: process.env.ENCRYPTION_ALGORITHM || 'aes-256-gcm'
  }
};

/**
 * Logging Configuration
 * Log levels and output settings
 */
const logging = {
  level: process.env.LOG_LEVEL || 'info',
  analytics: process.env.LOG_LEVEL_ANALYTICS || 'debug',
  database: process.env.LOG_LEVEL_DATABASE || 'warn',
  cache: process.env.LOG_LEVEL_CACHE || 'info',
  
  output: process.env.LOG_OUTPUT || 'console',
  file: {
    path: process.env.LOG_FILE_PATH || './logs',
    maxSize: process.env.LOG_FILE_MAX_SIZE || '10m',
    maxFiles: parseInt(process.env.LOG_FILE_MAX_FILES) || 5
  }
};

/**
 * Feature Flags
 * Enable/disable specific analytics features
 */
const features = {
  analytics: {
    realtime: process.env.FEATURE_REALTIME_ANALYTICS === 'true' || true,
    costSavings: process.env.FEATURE_COST_SAVINGS_CALCULATION === 'true' || true,
    networkPerformance: process.env.FEATURE_NETWORK_PERFORMANCE_COMPARISON === 'true' || true,
    complianceReporting: process.env.FEATURE_COMPLIANCE_REPORTING === 'true' || true,
    export: process.env.FEATURE_EXPORT_FUNCTIONALITY === 'true' || true
  },
  
  advanced: {
    machineLearning: process.env.FEATURE_MACHINE_LEARNING_PREDICTIONS === 'true' || false,
    advancedCharting: process.env.FEATURE_ADVANCED_CHARTING === 'true' || true,
    customDashboards: process.env.FEATURE_CUSTOM_DASHBOARDS === 'true' || true,
    apiWebhooks: process.env.FEATURE_API_WEBHOOKS === 'true' || false
  }
};

/**
 * Configuration Validation
 * Validate required configuration values
 */
function validateConfig() {
  const errors = [];
  
  // Required database settings
  if (!database.host || !database.database || !database.username) {
    errors.push('Database connection settings are required');
  }
  
  // Required JWT secret
  if (!security.jwt.secret || security.jwt.secret === 'your_super_secret_jwt_key_here') {
    errors.push('JWT_SECRET must be set to a secure value');
  }
  
  // Required encryption key
  if (!security.encryption.key || security.encryption.key === 'your_32_character_encryption_key') {
    errors.push('ENCRYPTION_KEY must be set to a 32-character key');
  }
  
  // Validate cost calculation parameters
  if (costCalculation.swift.wireFee <= 0) {
    errors.push('SWIFT_WIRE_FEE must be greater than 0');
  }
  
  if (costCalculation.nexora.platformFeePercentage < 0) {
    errors.push('NEXORA_PLATFORM_FEE_PERCENTAGE must be non-negative');
  }
  
  // Validate rate limiting
  if (rateLimiting.limits.free <= 0) {
    errors.push('RATE_LIMIT_FREE must be greater than 0');
  }
  
  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }
}

/**
 * Get environment-specific configuration
 */
function getEnvironmentConfig() {
  const env = process.env.NODE_ENV || 'development';
  return environments[env] || environments.development;
}

/**
 * Get complete configuration object
 */
function getConfig() {
  const envConfig = getEnvironmentConfig();
  
  return {
    environment: process.env.NODE_ENV || 'development',
    app: {
      name: process.env.APP_NAME || 'Nexora Analytics API',
      version: process.env.APP_VERSION || '1.0.0',
      port: parseInt(process.env.PORT) || 3000,
      apiVersion: process.env.API_VERSION || 'v1'
    },
    database,
    cache,
    analytics,
    costCalculation,
    rateLimiting,
    reports,
    websocket,
    fileStorage,
    monitoring,
    security,
    logging,
    features,
    ...envConfig
  };
}

/**
 * Export configuration
 */
module.exports = {
  getConfig,
  validateConfig,
  getEnvironmentConfig,
  database,
  cache,
  analytics,
  costCalculation,
  rateLimiting,
  reports,
  websocket,
  fileStorage,
  monitoring,
  security,
  logging,
  features
}; 