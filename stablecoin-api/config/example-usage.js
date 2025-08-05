/**
 * Analytics Configuration Usage Examples
 * Demonstrates how to use the analytics configuration module
 */

const { getConfig, validateConfig } = require('./analytics');
const { validateConfiguration, generateConfigReport } = require('./validation');

/**
 * Example 1: Basic Configuration Usage
 * Get configuration and validate it
 */
function basicConfigurationExample() {
  console.log('=== Basic Configuration Example ===');
  
  try {
    // Get complete configuration
    const config = getConfig();
    
    // Validate configuration
    const validation = validateConfiguration(config);
    
    if (validation.isValid) {
      console.log('✅ Configuration is valid');
      console.log(`Environment: ${config.environment}`);
      console.log(`Database: ${config.database.host}:${config.database.port}/${config.database.database}`);
      console.log(`Cache enabled: ${config.cache.enabled}`);
      console.log(`Real-time enabled: ${config.analytics.realtime.enabled}`);
    } else {
      console.log('❌ Configuration has errors:');
      validation.errors.forEach(error => console.log(`  - ${error}`));
    }
    
    if (validation.warnings.length > 0) {
      console.log('⚠️  Configuration warnings:');
      validation.warnings.forEach(warning => console.log(`  - ${warning}`));
    }
    
  } catch (error) {
    console.error('Configuration error:', error.message);
  }
}

/**
 * Example 2: Environment-Specific Configuration
 * Show different settings for different environments
 */
function environmentConfigurationExample() {
  console.log('\n=== Environment Configuration Example ===');
  
  const environments = ['development', 'staging', 'production'];
  
  environments.forEach(env => {
    process.env.NODE_ENV = env;
    const config = getConfig();
    
    console.log(`\n${env.toUpperCase()} Environment:`);
    console.log(`  Debug: ${config.debug}`);
    console.log(`  Log Level: ${config.logLevel}`);
    console.log(`  Cache Enabled: ${config.cacheEnabled}`);
    console.log(`  Real-time Enabled: ${config.realtimeEnabled}`);
    console.log(`  Test Data Enabled: ${config.testDataEnabled}`);
  });
}

/**
 * Example 3: Database Configuration
 * Show database connection settings
 */
function databaseConfigurationExample() {
  console.log('\n=== Database Configuration Example ===');
  
  const config = getConfig();
  
  console.log('Database Settings:');
  console.log(`  Host: ${config.database.host}`);
  console.log(`  Port: ${config.database.port}`);
  console.log(`  Database: ${config.database.database}`);
  console.log(`  Schema: ${config.database.schema}`);
  console.log(`  SSL: ${config.database.ssl}`);
  
  console.log('\nConnection Pool:');
  console.log(`  Min Connections: ${config.database.pool.min}`);
  console.log(`  Max Connections: ${config.database.pool.max}`);
  console.log(`  Acquire Timeout: ${config.database.pool.acquire}ms`);
  console.log(`  Idle Timeout: ${config.database.pool.idle}ms`);
  
  console.log('\nQuery Settings:');
  console.log(`  Max Query Time: ${config.database.queryTimeout}ms`);
  console.log(`  Max Results Per Page: ${config.database.maxResultsPerPage}`);
  console.log(`  Default Page Size: ${config.database.defaultPageSize}`);
}

/**
 * Example 4: Cache Configuration
 * Show cache settings and TTL values
 */
function cacheConfigurationExample() {
  console.log('\n=== Cache Configuration Example ===');
  
  const config = getConfig();
  
  console.log('Redis Settings:');
  console.log(`  Host: ${config.cache.redis.host}`);
  console.log(`  Port: ${config.cache.redis.port}`);
  console.log(`  Database: ${config.cache.redis.db}`);
  console.log(`  Password: ${config.cache.redis.password ? '***' : 'none'}`);
  
  console.log('\nCache Settings:');
  console.log(`  Enabled: ${config.cache.enabled}`);
  console.log(`  Prefix: ${config.cache.prefix}`);
  console.log(`  Separator: ${config.cache.separator}`);
  
  console.log('\nTTL Settings (seconds):');
  console.log(`  Dashboard: ${config.cache.ttl.dashboard}`);
  console.log(`  KPIs: ${config.cache.ttl.kpis}`);
  console.log(`  Trends: ${config.cache.ttl.trends}`);
  console.log(`  Network Performance: ${config.cache.ttl.networkPerformance}`);
  console.log(`  Cost Savings: ${config.cache.ttl.costSavings}`);
}

/**
 * Example 5: Cost Calculation Configuration
 * Show SWIFT vs Nexora cost settings
 */
function costCalculationExample() {
  console.log('\n=== Cost Calculation Configuration Example ===');
  
  const config = getConfig();
  
  console.log('SWIFT Transfer Costs (USD):');
  console.log(`  Wire Fee: $${config.costCalculation.swift.wireFee}`);
  console.log(`  Correspondent Fee: $${config.costCalculation.swift.correspondentFee}`);
  console.log(`  FX Margin: ${config.costCalculation.swift.fxMarginPercentage}%`);
  console.log(`  Minimum Fee: $${config.costCalculation.swift.minimumFee}`);
  
  console.log('\nNexora Transfer Costs (USD):');
  console.log(`  Polygon Network Fee: $${config.costCalculation.nexora.networkFees.polygon}`);
  console.log(`  Ethereum Network Fee: $${config.costCalculation.nexora.networkFees.ethereum}`);
  console.log(`  Arbitrum Network Fee: $${config.costCalculation.nexora.networkFees.arbitrum}`);
  console.log(`  Base Network Fee: $${config.costCalculation.nexora.networkFees.base}`);
  console.log(`  Platform Fee: ${config.costCalculation.nexora.platformFeePercentage}%`);
  console.log(`  Minimum Fee: $${config.costCalculation.nexora.minimumFee}`);
  
  console.log('\nFX Rate Settings:');
  console.log(`  Rate Source: ${config.costCalculation.fx.rateSource}`);
  console.log(`  Cache TTL: ${config.costCalculation.fx.cacheTtl}s`);
  console.log(`  Fallback USD Rate: ${config.costCalculation.fx.fallbackUsd}`);
}

/**
 * Example 6: Rate Limiting Configuration
 * Show rate limits for different subscription plans
 */
function rateLimitingExample() {
  console.log('\n=== Rate Limiting Configuration Example ===');
  
  const config = getConfig();
  
  console.log('Rate Limits (requests per hour):');
  console.log(`  Free Plan: ${config.rateLimiting.limits.free}`);
  console.log(`  Standard Plan: ${config.rateLimiting.limits.standard}`);
  console.log(`  Professional Plan: ${config.rateLimiting.limits.professional}`);
  console.log(`  Enterprise Plan: ${config.rateLimiting.limits.enterprise}`);
  
  console.log('\nBurst Limits (requests per minute):');
  console.log(`  Free Plan: ${config.rateLimiting.burst.free}`);
  console.log(`  Standard Plan: ${config.rateLimiting.burst.standard}`);
  console.log(`  Professional Plan: ${config.rateLimiting.burst.professional}`);
  console.log(`  Enterprise Plan: ${config.rateLimiting.burst.enterprise}`);
  
  console.log(`\nRate Limit Window: ${config.rateLimiting.window}s`);
  console.log(`Rate Limiting Enabled: ${config.rateLimiting.enabled}`);
}

/**
 * Example 7: Report Generation Configuration
 * Show PDF and Excel export settings
 */
function reportGenerationExample() {
  console.log('\n=== Report Generation Configuration Example ===');
  
  const config = getConfig();
  
  console.log('PDF Report Settings:');
  console.log(`  Enabled: ${config.reports.pdf.enabled}`);
  console.log(`  Template Path: ${config.reports.pdf.templatePath}`);
  console.log(`  Output Path: ${config.reports.pdf.outputPath}`);
  console.log(`  Retention Days: ${config.reports.pdf.retentionDays}`);
  
  console.log('\nExcel Export Settings:');
  console.log(`  Enabled: ${config.reports.excel.enabled}`);
  console.log(`  Output Path: ${config.reports.excel.outputPath}`);
  console.log(`  Retention Days: ${config.reports.excel.retentionDays}`);
  
  console.log('\nGeneration Limits:');
  console.log(`  Max Size: ${config.reports.limits.maxSizeMb}MB`);
  console.log(`  Max Pages: ${config.reports.limits.maxPages}`);
  console.log(`  Generation Timeout: ${config.reports.limits.generationTimeout}ms`);
}

/**
 * Example 8: WebSocket Configuration
 * Show real-time update settings
 */
function websocketConfigurationExample() {
  console.log('\n=== WebSocket Configuration Example ===');
  
  const config = getConfig();
  
  console.log('WebSocket Settings:');
  console.log(`  Enabled: ${config.websocket.enabled}`);
  console.log(`  Port: ${config.websocket.port}`);
  console.log(`  Path: ${config.websocket.path}`);
  console.log(`  Heartbeat Interval: ${config.websocket.heartbeatInterval}ms`);
  console.log(`  Max Payload Size: ${config.websocket.maxPayloadSize} bytes`);
  
  console.log('\nAuthentication:');
  console.log(`  Required: ${config.websocket.auth.required}`);
  console.log(`  Timeout: ${config.websocket.auth.timeout}ms`);
}

/**
 * Example 9: File Storage Configuration
 * Show local and cloud storage settings
 */
function fileStorageExample() {
  console.log('\n=== File Storage Configuration Example ===');
  
  const config = getConfig();
  
  console.log('Storage Type:', config.fileStorage.type);
  
  if (config.fileStorage.type === 'local') {
    console.log('\nLocal Storage Settings:');
    console.log(`  Path: ${config.fileStorage.local.path}`);
    console.log(`  Max Size: ${config.fileStorage.local.maxSizeMb}MB`);
    console.log(`  Retention Days: ${config.fileStorage.local.retentionDays}`);
  } else if (config.fileStorage.type === 's3') {
    console.log('\nS3 Storage Settings:');
    console.log(`  Bucket: ${config.fileStorage.s3.bucket}`);
    console.log(`  Region: ${config.fileStorage.s3.region}`);
    console.log(`  Access Key: ${config.fileStorage.s3.accessKeyId ? '***' : 'not set'}`);
    console.log(`  Secret Key: ${config.fileStorage.s3.secretAccessKey ? '***' : 'not set'}`);
  }
}

/**
 * Example 10: Monitoring Configuration
 * Show monitoring and alerting settings
 */
function monitoringConfigurationExample() {
  console.log('\n=== Monitoring Configuration Example ===');
  
  const config = getConfig();
  
  console.log('Monitoring Settings:');
  console.log(`  Enabled: ${config.monitoring.enabled}`);
  console.log(`  Sample Rate: ${config.monitoring.sampleRate}`);
  console.log(`  Max Traces Per Second: ${config.monitoring.maxTracesPerSecond}`);
  
  console.log('\nAlerting Thresholds:');
  console.log(`  Slow Query: ${config.monitoring.alerts.slowQueryThreshold}ms`);
  console.log(`  Error Rate: ${config.monitoring.alerts.errorRateThreshold * 100}%`);
  console.log(`  Memory Usage: ${config.monitoring.alerts.memoryUsageThreshold * 100}%`);
  console.log(`  Disk Usage: ${config.monitoring.alerts.diskUsageThreshold * 100}%`);
  
  console.log('\nNotifications:');
  console.log(`  Webhook URL: ${config.monitoring.notifications.webhookUrl || 'not set'}`);
  console.log(`  Email Enabled: ${config.monitoring.notifications.email.enabled}`);
  console.log(`  Email From: ${config.monitoring.notifications.email.from}`);
  console.log(`  Email To: ${config.monitoring.notifications.email.to}`);
}

/**
 * Example 11: Security Configuration
 * Show security settings (without exposing secrets)
 */
function securityConfigurationExample() {
  console.log('\n=== Security Configuration Example ===');
  
  const config = getConfig();
  
  console.log('JWT Settings:');
  console.log(`  Secret Configured: ${config.security.jwt.secret && !config.security.jwt.secret.includes('your_') ? 'Yes' : 'No'}`);
  console.log(`  Expires In: ${config.security.jwt.expiresIn}`);
  console.log(`  Refresh Expires In: ${config.security.jwt.refreshExpiresIn}`);
  
  console.log('\nAPI Security:');
  console.log(`  Rate Limit Enabled: ${config.security.api.rateLimitEnabled}`);
  console.log(`  CORS Origin: ${config.security.api.corsOrigin}`);
  console.log(`  CORS Credentials: ${config.security.api.corsCredentials}`);
  
  console.log('\nEncryption:');
  console.log(`  Key Configured: ${config.security.encryption.key && !config.security.encryption.key.includes('your_') ? 'Yes' : 'No'}`);
  console.log(`  Algorithm: ${config.security.encryption.algorithm}`);
}

/**
 * Example 12: Feature Flags Configuration
 * Show enabled/disabled features
 */
function featureFlagsExample() {
  console.log('\n=== Feature Flags Configuration Example ===');
  
  const config = getConfig();
  
  console.log('Analytics Features:');
  console.log(`  Real-time Analytics: ${config.features.analytics.realtime ? '✅' : '❌'}`);
  console.log(`  Cost Savings Calculation: ${config.features.analytics.costSavings ? '✅' : '❌'}`);
  console.log(`  Network Performance Comparison: ${config.features.analytics.networkPerformance ? '✅' : '❌'}`);
  console.log(`  Compliance Reporting: ${config.features.analytics.complianceReporting ? '✅' : '❌'}`);
  console.log(`  Export Functionality: ${config.features.analytics.export ? '✅' : '❌'}`);
  
  console.log('\nAdvanced Features:');
  console.log(`  Machine Learning Predictions: ${config.features.advanced.machineLearning ? '✅' : '❌'}`);
  console.log(`  Advanced Charting: ${config.features.advanced.advancedCharting ? '✅' : '❌'}`);
  console.log(`  Custom Dashboards: ${config.features.advanced.customDashboards ? '✅' : '❌'}`);
  console.log(`  API Webhooks: ${config.features.advanced.apiWebhooks ? '✅' : '❌'}`);
}

/**
 * Example 13: Configuration Report
 * Generate and display a comprehensive configuration report
 */
function configurationReportExample() {
  console.log('\n=== Configuration Report Example ===');
  
  const config = getConfig();
  const report = generateConfigReport(config);
  
  console.log('Configuration Report:');
  console.log(`  Environment: ${report.environment}`);
  console.log(`  Timestamp: ${report.timestamp}`);
  
  console.log('\nSecurity Status:');
  console.log(`  JWT Configured: ${report.security.jwtConfigured ? '✅' : '❌'}`);
  console.log(`  Encryption Configured: ${report.security.encryptionConfigured ? '✅' : '❌'}`);
  console.log(`  Rate Limiting Enabled: ${report.security.rateLimitingEnabled ? '✅' : '❌'}`);
  
  console.log('\nPerformance Status:');
  console.log(`  Cache Enabled: ${report.performance.cacheEnabled ? '✅' : '❌'}`);
  console.log(`  Real-time Enabled: ${report.performance.realtimeEnabled ? '✅' : '❌'}`);
  console.log(`  Monitoring Enabled: ${report.performance.monitoringEnabled ? '✅' : '❌'}`);
  
  console.log('\nFeature Status:');
  console.log(`  PDF Reports: ${report.features.pdfReports ? '✅' : '❌'}`);
  console.log(`  Excel Export: ${report.features.excelExport ? '✅' : '❌'}`);
  console.log(`  WebSocket: ${report.features.websocket ? '✅' : '❌'}`);
  
  console.log('\nSection Configuration:');
  Object.entries(report.sections).forEach(([section, status]) => {
    console.log(`  ${section}: ${status.configured ? '✅' : '❌'} (${status.keyCount} keys)`);
  });
}

/**
 * Run all examples
 */
function runAllExamples() {
  console.log('🚀 Analytics Configuration Examples\n');
  
  basicConfigurationExample();
  environmentConfigurationExample();
  databaseConfigurationExample();
  cacheConfigurationExample();
  costCalculationExample();
  rateLimitingExample();
  reportGenerationExample();
  websocketConfigurationExample();
  fileStorageExample();
  monitoringConfigurationExample();
  securityConfigurationExample();
  featureFlagsExample();
  configurationReportExample();
  
  console.log('\n✅ All configuration examples completed!');
}

// Export examples for use in other modules
module.exports = {
  basicConfigurationExample,
  environmentConfigurationExample,
  databaseConfigurationExample,
  cacheConfigurationExample,
  costCalculationExample,
  rateLimitingExample,
  reportGenerationExample,
  websocketConfigurationExample,
  fileStorageExample,
  monitoringConfigurationExample,
  securityConfigurationExample,
  featureFlagsExample,
  configurationReportExample,
  runAllExamples
};

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples();
} 