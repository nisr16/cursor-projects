/**
 * Configuration Validation Utility
 * Validates analytics system configuration and provides helpful error messages
 */

const fs = require('fs');
const path = require('path');

/**
 * Validation Rules
 * Define validation rules for different configuration sections
 */
const validationRules = {
  // Database validation rules
  database: {
    required: ['host', 'database', 'username'],
    types: {
      host: 'string',
      port: 'number',
      database: 'string',
      username: 'string',
      password: 'string'
    },
    ranges: {
      port: { min: 1, max: 65535 },
      'pool.min': { min: 1, max: 50 },
      'pool.max': { min: 1, max: 100 },
      'pool.acquire': { min: 1000, max: 60000 },
      'pool.idle': { min: 1000, max: 60000 }
    }
  },

  // Cache validation rules
  cache: {
    types: {
      'redis.host': 'string',
      'redis.port': 'number',
      'redis.db': 'number'
    },
    ranges: {
      'redis.port': { min: 1, max: 65535 },
      'redis.db': { min: 0, max: 15 }
    }
  },

  // Analytics validation rules
  analytics: {
    ranges: {
      'retention.daily': { min: 1, max: 365 },
      'retention.monthly': { min: 1, max: 2555 },
      'retention.yearly': { min: 1, max: 10000 },
      'thresholds.maxQueryTime': { min: 1000, max: 30000 },
      'thresholds.maxResultsPerPage': { min: 10, max: 10000 },
      'thresholds.defaultPageSize': { min: 1, max: 1000 },
      'realtime.interval': { min: 5000, max: 300000 },
      'realtime.maxConnections': { min: 1, max: 1000 }
    }
  },

  // Cost calculation validation rules
  costCalculation: {
    ranges: {
      'swift.wireFee': { min: 0, max: 1000 },
      'swift.correspondentFee': { min: 0, max: 1000 },
      'swift.fxMarginPercentage': { min: 0, max: 10 },
      'swift.minimumFee': { min: 0, max: 1000 },
      'nexora.platformFeePercentage': { min: 0, max: 5 },
      'nexora.minimumFee': { min: 0, max: 100 }
    }
  },

  // Rate limiting validation rules
  rateLimiting: {
    ranges: {
      'limits.free': { min: 1, max: 10000 },
      'limits.standard': { min: 1, max: 100000 },
      'limits.professional': { min: 1, max: 1000000 },
      'limits.enterprise': { min: 1, max: 10000000 },
      'burst.free': { min: 1, max: 1000 },
      'burst.standard': { min: 1, max: 10000 },
      'burst.professional': { min: 1, max: 100000 },
      'burst.enterprise': { min: 1, max: 1000000 },
      window: { min: 60, max: 86400 }
    }
  },

  // Security validation rules
  security: {
    required: ['jwt.secret', 'encryption.key'],
    patterns: {
      'jwt.secret': /^.{32,}$/,
      'encryption.key': /^.{32,}$/
    }
  },

  // File storage validation rules
  fileStorage: {
    ranges: {
      'local.maxSizeMb': { min: 1, max: 10000 },
      'local.retentionDays': { min: 1, max: 3650 }
    }
  },

  // Monitoring validation rules
  monitoring: {
    ranges: {
      sampleRate: { min: 0, max: 1 },
      maxTracesPerSecond: { min: 1, max: 1000 },
      'alerts.slowQueryThreshold': { min: 1000, max: 30000 },
      'alerts.errorRateThreshold': { min: 0, max: 1 },
      'alerts.memoryUsageThreshold': { min: 0.1, max: 1 },
      'alerts.diskUsageThreshold': { min: 0.1, max: 1 }
    }
  }
};

/**
 * Deep get object property by path
 * @param {Object} obj - Object to search
 * @param {string} path - Property path (e.g., 'database.host')
 * @returns {*} Property value
 */
function getNestedProperty(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

/**
 * Deep set object property by path
 * @param {Object} obj - Object to modify
 * @param {string} path - Property path (e.g., 'database.host')
 * @param {*} value - Value to set
 */
function setNestedProperty(obj, path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
}

/**
 * Validate configuration section
 * @param {Object} config - Configuration object
 * @param {string} section - Section name
 * @param {Object} rules - Validation rules
 * @returns {Array} Array of validation errors
 */
function validateSection(config, section, rules) {
  const errors = [];
  const sectionConfig = config[section];

  if (!sectionConfig) {
    errors.push(`${section} configuration is missing`);
    return errors;
  }

  // Validate required fields
  if (rules.required) {
    for (const field of rules.required) {
      const value = getNestedProperty(sectionConfig, field);
      if (value === undefined || value === null || value === '') {
        errors.push(`${section}.${field} is required`);
      }
    }
  }

  // Validate field types
  if (rules.types) {
    for (const [field, expectedType] of Object.entries(rules.types)) {
      const value = getNestedProperty(sectionConfig, field);
      if (value !== undefined && typeof value !== expectedType) {
        errors.push(`${section}.${field} must be a ${expectedType}, got ${typeof value}`);
      }
    }
  }

  // Validate numeric ranges
  if (rules.ranges) {
    for (const [field, range] of Object.entries(rules.ranges)) {
      const value = getNestedProperty(sectionConfig, field);
      if (value !== undefined && typeof value === 'number') {
        if (value < range.min || value > range.max) {
          errors.push(`${section}.${field} must be between ${range.min} and ${range.max}, got ${value}`);
        }
      }
    }
  }

  // Validate patterns
  if (rules.patterns) {
    for (const [field, pattern] of Object.entries(rules.patterns)) {
      const value = getNestedProperty(sectionConfig, field);
      if (value !== undefined && typeof value === 'string') {
        if (!pattern.test(value)) {
          errors.push(`${section}.${field} does not match required pattern`);
        }
      }
    }
  }

  return errors;
}

/**
 * Validate file paths exist
 * @param {Object} config - Configuration object
 * @returns {Array} Array of validation errors
 */
function validateFilePaths(config) {
  const errors = [];

  // Validate database migrations path
  if (config.database.migrationsPath) {
    const migrationsPath = path.resolve(config.database.migrationsPath);
    if (!fs.existsSync(migrationsPath)) {
      errors.push(`Database migrations path does not exist: ${migrationsPath}`);
    }
  }

  // Validate report template path
  if (config.reports.pdf.templatePath) {
    const templatePath = path.resolve(config.reports.pdf.templatePath);
    if (!fs.existsSync(templatePath)) {
      errors.push(`PDF report template path does not exist: ${templatePath}`);
    }
  }

  // Validate report output paths
  if (config.reports.pdf.outputPath) {
    const pdfOutputPath = path.resolve(config.reports.pdf.outputPath);
    try {
      if (!fs.existsSync(pdfOutputPath)) {
        fs.mkdirSync(pdfOutputPath, { recursive: true });
      }
    } catch (error) {
      errors.push(`Cannot create PDF output directory: ${pdfOutputPath}`);
    }
  }

  if (config.reports.excel.outputPath) {
    const excelOutputPath = path.resolve(config.reports.excel.outputPath);
    try {
      if (!fs.existsSync(excelOutputPath)) {
        fs.mkdirSync(excelOutputPath, { recursive: true });
      }
    } catch (error) {
      errors.push(`Cannot create Excel output directory: ${excelOutputPath}`);
    }
  }

  // Validate log file path
  if (config.logging.file.path) {
    const logPath = path.resolve(config.logging.file.path);
    try {
      if (!fs.existsSync(logPath)) {
        fs.mkdirSync(logPath, { recursive: true });
      }
    } catch (error) {
      errors.push(`Cannot create log directory: ${logPath}`);
    }
  }

  return errors;
}

/**
 * Validate environment-specific settings
 * @param {Object} config - Configuration object
 * @returns {Array} Array of validation errors
 */
function validateEnvironmentSettings(config) {
  const errors = [];
  const env = config.environment;

  // Development environment validations
  if (env === 'development') {
    if (config.cache.enabled) {
      errors.push('Cache should be disabled in development environment');
    }
    if (config.logging.level !== 'debug') {
      errors.push('Log level should be debug in development environment');
    }
  }

  // Production environment validations
  if (env === 'production') {
    if (!config.cache.enabled) {
      errors.push('Cache should be enabled in production environment');
    }
    if (config.logging.level === 'debug') {
      errors.push('Log level should not be debug in production environment');
    }
    if (!config.security.jwt.secret || config.security.jwt.secret.includes('your_')) {
      errors.push('JWT_SECRET must be set to a secure value in production');
    }
    if (!config.security.encryption.key || config.security.encryption.key.includes('your_')) {
      errors.push('ENCRYPTION_KEY must be set to a secure value in production');
    }
  }

  return errors;
}

/**
 * Validate configuration dependencies
 * @param {Object} config - Configuration object
 * @returns {Array} Array of validation errors
 */
function validateDependencies(config) {
  const errors = [];

  // Validate WebSocket dependencies
  if (config.websocket.enabled) {
    if (!config.analytics.realtime.enabled) {
      errors.push('WebSocket requires real-time analytics to be enabled');
    }
  }

  // Validate cache dependencies
  if (config.cache.enabled) {
    if (!config.cache.redis.host) {
      errors.push('Cache requires Redis host to be configured');
    }
  }

  // Validate monitoring dependencies
  if (config.monitoring.enabled) {
    if (config.monitoring.notifications.webhookUrl && !config.monitoring.notifications.webhookUrl.startsWith('http')) {
      errors.push('Monitoring webhook URL must be a valid HTTP URL');
    }
  }

  // Validate file storage dependencies
  if (config.fileStorage.type === 's3') {
    if (!config.fileStorage.s3.bucket || !config.fileStorage.s3.accessKeyId || !config.fileStorage.s3.secretAccessKey) {
      errors.push('S3 storage requires bucket, access key, and secret key to be configured');
    }
  }

  return errors;
}

/**
 * Comprehensive configuration validation
 * @param {Object} config - Configuration object
 * @returns {Object} Validation result with errors and warnings
 */
function validateConfiguration(config) {
  const errors = [];
  const warnings = [];

  // Validate each section
  for (const [section, rules] of Object.entries(validationRules)) {
    const sectionErrors = validateSection(config, section, rules);
    errors.push(...sectionErrors);
  }

  // Validate file paths
  const pathErrors = validateFilePaths(config);
  errors.push(...pathErrors);

  // Validate environment-specific settings
  const envErrors = validateEnvironmentSettings(config);
  errors.push(...envErrors);

  // Validate dependencies
  const depErrors = validateDependencies(config);
  errors.push(...depErrors);

  // Generate warnings for potential issues
  if (config.environment === 'production') {
    if (config.cache.ttl.dashboard < 300) {
      warnings.push('Dashboard cache TTL is very short for production');
    }
    if (config.analytics.thresholds.maxQueryTime > 10000) {
      warnings.push('Maximum query time is very high for production');
    }
    if (!config.monitoring.enabled) {
      warnings.push('Monitoring is disabled in production');
    }
  }

  if (config.rateLimiting.limits.free > 1000) {
    warnings.push('Free tier rate limit is very high');
  }

  if (config.costCalculation.nexora.platformFeePercentage > 1) {
    warnings.push('Platform fee percentage is very high');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    summary: {
      totalErrors: errors.length,
      totalWarnings: warnings.length,
      sections: Object.keys(validationRules)
    }
  };
}

/**
 * Generate configuration report
 * @param {Object} config - Configuration object
 * @returns {Object} Configuration report
 */
function generateConfigReport(config) {
  const report = {
    environment: config.environment,
    timestamp: new Date().toISOString(),
    sections: {},
    security: {
      jwtConfigured: !!config.security.jwt.secret && !config.security.jwt.secret.includes('your_'),
      encryptionConfigured: !!config.security.encryption.key && !config.security.encryption.key.includes('your_'),
      rateLimitingEnabled: config.rateLimiting.enabled
    },
    performance: {
      cacheEnabled: config.cache.enabled,
      realtimeEnabled: config.analytics.realtime.enabled,
      monitoringEnabled: config.monitoring.enabled
    },
    features: {
      pdfReports: config.reports.pdf.enabled,
      excelExport: config.reports.excel.enabled,
      websocket: config.websocket.enabled
    }
  };

  // Add section summaries
  for (const section of Object.keys(validationRules)) {
    const sectionConfig = config[section];
    if (sectionConfig) {
      report.sections[section] = {
        configured: true,
        keyCount: Object.keys(sectionConfig).length
      };
    } else {
      report.sections[section] = {
        configured: false,
        keyCount: 0
      };
    }
  }

  return report;
}

module.exports = {
  validateConfiguration,
  generateConfigReport,
  validationRules
}; 