# Analytics Configuration System

Comprehensive configuration management for the Nexora analytics system with environment-specific settings, validation, and documentation.

## 📁 File Structure

```
config/
├── analytics.js          # Main configuration module
├── validation.js         # Configuration validation utility
├── example-usage.js      # Usage examples and demonstrations
└── README.md            # This documentation file
```

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env` file in the project root with your configuration:

```bash
# Copy the example environment file
cp .env.example .env

# Edit the configuration
nano .env
```

### 2. Basic Usage

```javascript
const { getConfig, validateConfig } = require('./config/analytics');

// Get complete configuration
const config = getConfig();

// Validate configuration
try {
  validateConfig();
  console.log('✅ Configuration is valid');
} catch (error) {
  console.error('❌ Configuration error:', error.message);
}
```

### 3. Run Examples

```bash
# Run all configuration examples
node config/example-usage.js

# Run specific examples
node -e "require('./config/example-usage').databaseConfigurationExample()"
```

## 🔧 Configuration Sections

### Database Configuration

```javascript
const config = getConfig();

console.log('Database Settings:', {
  host: config.database.host,
  port: config.database.port,
  database: config.database.database,
  schema: config.database.schema,
  pool: config.database.pool
});
```

**Environment Variables:**
- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 5432)
- `DB_NAME` - Database name (default: nexora_analytics)
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_SSL` - Enable SSL connection (default: true)
- `DB_POOL_MIN` - Minimum connections (default: 2)
- `DB_POOL_MAX` - Maximum connections (default: 20)

### Cache Configuration

```javascript
const config = getConfig();

console.log('Cache Settings:', {
  enabled: config.cache.enabled,
  redis: config.cache.redis,
  ttl: config.cache.ttl
});
```

**Environment Variables:**
- `CACHE_ENABLED` - Enable caching (default: false)
- `REDIS_HOST` - Redis host (default: localhost)
- `REDIS_PORT` - Redis port (default: 6379)
- `REDIS_PASSWORD` - Redis password
- `CACHE_TTL_DASHBOARD` - Dashboard cache TTL (default: 300s)
- `CACHE_TTL_KPIS` - KPIs cache TTL (default: 600s)

### Analytics Performance

```javascript
const config = getConfig();

console.log('Analytics Settings:', {
  retention: config.analytics.retention,
  thresholds: config.analytics.thresholds,
  realtime: config.analytics.realtime
});
```

**Environment Variables:**
- `ANALYTICS_RETENTION_DAILY` - Daily data retention (default: 90 days)
- `ANALYTICS_RETENTION_MONTHLY` - Monthly data retention (default: 365 days)
- `ANALYTICS_MAX_QUERY_TIME` - Max query execution time (default: 5000ms)
- `ANALYTICS_REALTIME_ENABLED` - Enable real-time updates (default: true)
- `ANALYTICS_REALTIME_INTERVAL` - Real-time update interval (default: 30000ms)

### Cost Calculation

```javascript
const config = getConfig();

console.log('SWIFT Costs:', config.costCalculation.swift);
console.log('Nexora Costs:', config.costCalculation.nexora);
```

**Environment Variables:**
- `SWIFT_WIRE_FEE` - SWIFT wire transfer fee (default: $25.00)
- `SWIFT_CORRESPONDENT_FEE` - SWIFT correspondent fee (default: $15.00)
- `SWIFT_FX_MARGIN_PERCENTAGE` - SWIFT FX margin (default: 2.5%)
- `NEXORA_NETWORK_FEE_POLYGON` - Polygon network fee (default: $0.50)
- `NEXORA_PLATFORM_FEE_PERCENTAGE` - Platform fee percentage (default: 0.1%)

### Rate Limiting

```javascript
const config = getConfig();

console.log('Rate Limits:', config.rateLimiting.limits);
console.log('Burst Limits:', config.rateLimiting.burst);
```

**Environment Variables:**
- `RATE_LIMIT_FREE` - Free plan limit (default: 100/hour)
- `RATE_LIMIT_STANDARD` - Standard plan limit (default: 1000/hour)
- `RATE_LIMIT_PROFESSIONAL` - Professional plan limit (default: 10000/hour)
- `RATE_LIMIT_ENTERPRISE` - Enterprise plan limit (default: 100000/hour)

## 🔍 Configuration Validation

### Basic Validation

```javascript
const { validateConfiguration } = require('./config/validation');

const config = getConfig();
const validation = validateConfiguration(config);

if (validation.isValid) {
  console.log('✅ Configuration is valid');
} else {
  console.log('❌ Configuration errors:');
  validation.errors.forEach(error => console.log(`  - ${error}`));
}

if (validation.warnings.length > 0) {
  console.log('⚠️  Configuration warnings:');
  validation.warnings.forEach(warning => console.log(`  - ${warning}`));
}
```

### Validation Rules

The validation system checks:

1. **Required Fields** - Essential configuration values
2. **Data Types** - Correct types for all settings
3. **Value Ranges** - Numeric values within acceptable ranges
4. **File Paths** - Existence and accessibility of file paths
5. **Environment Settings** - Environment-specific requirements
6. **Dependencies** - Feature dependencies and requirements

### Custom Validation

```javascript
const { validationRules } = require('./config/validation');

// Add custom validation rules
validationRules.database.ranges['pool.max'] = { min: 5, max: 50 };

// Validate specific section
const { validateSection } = require('./config/validation');
const errors = validateSection(config, 'database', validationRules.database);
```

## 🌍 Environment-Specific Settings

### Development Environment

```javascript
// Development settings
NODE_ENV=development
DEBUG_ENABLED=true
CACHE_ENABLED=false
LOG_LEVEL=debug
TEST_DATA_ENABLED=true
```

### Staging Environment

```javascript
// Staging settings
NODE_ENV=staging
DEBUG_ENABLED=false
CACHE_ENABLED=true
LOG_LEVEL=info
TEST_DATA_ENABLED=false
```

### Production Environment

```javascript
// Production settings
NODE_ENV=production
DEBUG_ENABLED=false
CACHE_ENABLED=true
LOG_LEVEL=warn
TEST_DATA_ENABLED=false
MONITORING_ENABLED=true
```

## 📊 Configuration Report

Generate a comprehensive configuration report:

```javascript
const { generateConfigReport } = require('./config/validation');

const config = getConfig();
const report = generateConfigReport(config);

console.log('Configuration Report:', {
  environment: report.environment,
  timestamp: report.timestamp,
  security: report.security,
  performance: report.performance,
  features: report.features
});
```

## 🔐 Security Configuration

### JWT Settings

```javascript
const config = getConfig();

// JWT configuration
const jwtConfig = {
  secret: config.security.jwt.secret,
  expiresIn: config.security.jwt.expiresIn,
  refreshExpiresIn: config.security.jwt.refreshExpiresIn
};
```

**Required Environment Variables:**
- `JWT_SECRET` - Secure JWT secret key (32+ characters)
- `JWT_EXPIRES_IN` - Token expiration time (default: 24h)
- `JWT_REFRESH_EXPIRES_IN` - Refresh token expiration (default: 7d)

### Encryption Settings

```javascript
const config = getConfig();

// Encryption configuration
const encryptionConfig = {
  key: config.security.encryption.key,
  algorithm: config.security.encryption.algorithm
};
```

**Required Environment Variables:**
- `ENCRYPTION_KEY` - 32-character encryption key
- `ENCRYPTION_ALGORITHM` - Encryption algorithm (default: aes-256-gcm)

## 📈 Performance Configuration

### Database Connection Pooling

```javascript
const config = getConfig();

// Database pool configuration
const poolConfig = {
  min: config.database.pool.min,
  max: config.database.pool.max,
  acquire: config.database.pool.acquire,
  idle: config.database.pool.idle
};
```

### Cache Settings

```javascript
const config = getConfig();

// Cache configuration
const cacheConfig = {
  enabled: config.cache.enabled,
  redis: config.cache.redis,
  ttl: config.cache.ttl
};
```

### Query Optimization

```javascript
const config = getConfig();

// Query optimization settings
const queryConfig = {
  maxQueryTime: config.database.queryTimeout,
  maxResultsPerPage: config.database.maxResultsPerPage,
  defaultPageSize: config.database.defaultPageSize
};
```

## 🔄 Real-time Configuration

### WebSocket Settings

```javascript
const config = getConfig();

// WebSocket configuration
const wsConfig = {
  enabled: config.websocket.enabled,
  port: config.websocket.port,
  path: config.websocket.path,
  heartbeatInterval: config.websocket.heartbeatInterval
};
```

### Real-time Analytics

```javascript
const config = getConfig();

// Real-time analytics configuration
const realtimeConfig = {
  enabled: config.analytics.realtime.enabled,
  interval: config.analytics.realtime.interval,
  maxConnections: config.analytics.realtime.maxConnections
};
```

## 📄 Report Generation

### PDF Reports

```javascript
const config = getConfig();

// PDF report configuration
const pdfConfig = {
  enabled: config.reports.pdf.enabled,
  templatePath: config.reports.pdf.templatePath,
  outputPath: config.reports.pdf.outputPath,
  retentionDays: config.reports.pdf.retentionDays
};
```

### Excel Export

```javascript
const config = getConfig();

// Excel export configuration
const excelConfig = {
  enabled: config.reports.excel.enabled,
  outputPath: config.reports.excel.outputPath,
  retentionDays: config.reports.excel.retentionDays
};
```

## 📁 File Storage

### Local Storage

```javascript
const config = getConfig();

// Local storage configuration
const localStorageConfig = {
  type: config.fileStorage.type,
  path: config.fileStorage.local.path,
  maxSizeMb: config.fileStorage.local.maxSizeMb,
  retentionDays: config.fileStorage.local.retentionDays
};
```

### S3 Storage

```javascript
const config = getConfig();

// S3 storage configuration
const s3Config = {
  type: config.fileStorage.type,
  bucket: config.fileStorage.s3.bucket,
  region: config.fileStorage.s3.region,
  accessKeyId: config.fileStorage.s3.accessKeyId,
  secretAccessKey: config.fileStorage.s3.secretAccessKey
};
```

## 🔍 Monitoring and Alerting

### Performance Monitoring

```javascript
const config = getConfig();

// Monitoring configuration
const monitoringConfig = {
  enabled: config.monitoring.enabled,
  sampleRate: config.monitoring.sampleRate,
  maxTracesPerSecond: config.monitoring.maxTracesPerSecond
};
```

### Alerting Thresholds

```javascript
const config = getConfig();

// Alerting configuration
const alertingConfig = {
  slowQueryThreshold: config.monitoring.alerts.slowQueryThreshold,
  errorRateThreshold: config.monitoring.alerts.errorRateThreshold,
  memoryUsageThreshold: config.monitoring.alerts.memoryUsageThreshold,
  diskUsageThreshold: config.monitoring.alerts.diskUsageThreshold
};
```

## 🚩 Feature Flags

### Analytics Features

```javascript
const config = getConfig();

// Feature flags
const features = {
  realtime: config.features.analytics.realtime,
  costSavings: config.features.analytics.costSavings,
  networkPerformance: config.features.analytics.networkPerformance,
  complianceReporting: config.features.analytics.complianceReporting,
  export: config.features.analytics.export
};
```

### Advanced Features

```javascript
const config = getConfig();

// Advanced features
const advancedFeatures = {
  machineLearning: config.features.advanced.machineLearning,
  advancedCharting: config.features.advanced.advancedCharting,
  customDashboards: config.features.advanced.customDashboards,
  apiWebhooks: config.features.advanced.apiWebhooks
};
```

## 🛠️ Troubleshooting

### Common Issues

1. **Configuration Validation Errors**
   ```bash
   # Check environment variables
   node -e "require('./config/analytics').validateConfig()"
   ```

2. **Missing Required Fields**
   ```bash
   # Set required environment variables
   export JWT_SECRET="your-secure-jwt-secret-key"
   export ENCRYPTION_KEY="your-32-character-encryption-key"
   ```

3. **File Path Issues**
   ```bash
   # Create required directories
   mkdir -p ./reports/pdf ./reports/excel ./logs ./storage
   ```

4. **Database Connection Issues**
   ```bash
   # Test database connection
   node -e "const config = require('./config/analytics').getConfig(); console.log('Database:', config.database);"
   ```

### Debug Mode

Enable debug mode for detailed configuration information:

```bash
# Set debug environment variable
export DEBUG_ENABLED=true
export LOG_LEVEL=debug

# Run with debug output
node config/example-usage.js
```

### Configuration Testing

Test your configuration with the validation utility:

```bash
# Run configuration tests
node -e "
const { getConfig } = require('./config/analytics');
const { validateConfiguration } = require('./config/validation');

const config = getConfig();
const validation = validateConfiguration(config);

console.log('Validation Result:', {
  isValid: validation.isValid,
  errorCount: validation.errors.length,
  warningCount: validation.warnings.length
});
"
```

## 📚 Examples

### Complete Configuration Example

```javascript
const { getConfig, validateConfig } = require('./config/analytics');
const { validateConfiguration, generateConfigReport } = require('./config/validation');

// Get and validate configuration
const config = getConfig();
const validation = validateConfiguration(config);

if (validation.isValid) {
  console.log('✅ Configuration is valid');
  
  // Generate configuration report
  const report = generateConfigReport(config);
  console.log('Configuration Report:', report);
  
  // Use configuration
  console.log('Database:', config.database.host);
  console.log('Cache Enabled:', config.cache.enabled);
  console.log('Real-time Enabled:', config.analytics.realtime.enabled);
} else {
  console.error('❌ Configuration errors:', validation.errors);
}
```

### Environment-Specific Configuration

```javascript
const { getConfig } = require('./config/analytics');

// Set environment
process.env.NODE_ENV = 'production';

// Get production configuration
const config = getConfig();

console.log('Production Settings:', {
  debug: config.debug,
  cacheEnabled: config.cacheEnabled,
  logLevel: config.logLevel,
  monitoringEnabled: config.monitoring.enabled
});
```

### Feature Flag Usage

```javascript
const { getConfig } = require('./config/analytics');

const config = getConfig();

// Check if features are enabled
if (config.features.analytics.realtime) {
  console.log('Real-time analytics enabled');
}

if (config.features.analytics.costSavings) {
  console.log('Cost savings calculation enabled');
}

if (config.features.advanced.machineLearning) {
  console.log('Machine learning predictions enabled');
}
```

## 🔄 Migration Guide

### From Legacy Configuration

If migrating from a legacy configuration system:

1. **Export Current Settings**
   ```bash
   # Export current environment variables
   env | grep -E "(DB_|REDIS_|JWT_|ENCRYPTION_)" > .env.backup
   ```

2. **Update Configuration**
   ```bash
   # Update environment variables to new format
   sed 's/OLD_PREFIX/NEW_PREFIX/g' .env.backup > .env
   ```

3. **Validate Configuration**
   ```bash
   # Validate new configuration
   node -e "require('./config/analytics').validateConfig()"
   ```

### Configuration Updates

When updating configuration:

1. **Backup Current Config**
   ```bash
   cp .env .env.backup
   ```

2. **Update Settings**
   ```bash
   # Edit configuration
   nano .env
   ```

3. **Test Configuration**
   ```bash
   # Run validation
   node config/example-usage.js
   ```

## 📖 API Reference

### Configuration Functions

- `getConfig()` - Get complete configuration object
- `validateConfig()` - Validate configuration and throw errors
- `getEnvironmentConfig()` - Get environment-specific settings

### Validation Functions

- `validateConfiguration(config)` - Comprehensive configuration validation
- `generateConfigReport(config)` - Generate configuration report
- `validateSection(config, section, rules)` - Validate specific section

### Configuration Objects

- `database` - Database connection and pooling settings
- `cache` - Redis cache configuration
- `analytics` - Analytics performance settings
- `costCalculation` - SWIFT vs Nexora cost parameters
- `rateLimiting` - API rate limiting configuration
- `reports` - PDF and Excel export settings
- `websocket` - Real-time WebSocket configuration
- `fileStorage` - Local and cloud storage settings
- `monitoring` - Performance monitoring and alerting
- `security` - JWT and encryption settings
- `logging` - Log levels and output configuration
- `features` - Feature flags for analytics

---

**Last Updated**: January 15, 2024  
**Version**: 1.0.0  
**Compatibility**: Node.js 16+, Analytics API v1.0.0 