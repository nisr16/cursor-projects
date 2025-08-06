# Analytics Test Data System

Comprehensive test data generation system for the Nexora analytics platform, extending the existing transaction data with analytics-specific metrics, network performance data, and cost comparison analysis.

## 📁 File Structure

```
utils/test-data/
├── AnalyticsTestDataGenerator.js     # Analytics-specific data generator
├── run-analytics-test-data.js        # Analytics test data runner
├── TransactionDataGenerator.js       # Base transaction generator
├── TestDataLoader.js                 # Base test data loader
├── test-data-validator.js            # Data validation utility
├── run-test-data.js                  # Base test data runner
├── exports/                          # Generated test data files
│   ├── complete-test-data.json       # Complete base test data
│   ├── working-test-data.json        # Working base test data
│   ├── sample-data.json              # Sample base test data
│   └── analytics-test-data.json      # Analytics test data (generated)
└── ANALYTICS_TEST_DATA_README.md     # This documentation
```

## 🚀 Quick Start

### 1. Generate Analytics Test Data

```bash
# Navigate to test data directory
cd stablecoin-api/utils/test-data

# Generate analytics test data (default: 5 banks, 200 transactions, 30d period)
node run-analytics-test-data.js

# Generate with custom parameters
node run-analytics-test-data.js --banks 10 --transactions 500 --period 90d

# Generate for specific bank
node run-analytics-test-data.js --bank-id 41 --period 7d

# Export with custom filename
node run-analytics-test-data.js --export my-analytics-data.json
```

### 2. Use Existing Test Data

```bash
# Generate base test data first
node run-test-data.js --banks 5 --transactions 200

# Then generate analytics data
node run-analytics-test-data.js --period 30d
```

## 📊 Data Types Generated

### 1. Analytics Transactions
Enhanced transaction data with analytics-specific fields:

```javascript
{
  id: 12345,
  source_wallet_id: 1001,
  destination_wallet_id: 1002,
  amount: 50000,
  currency: "USD",
  status: "completed",
  created_at: "2024-01-15T10:30:00Z",
  
  // Analytics-specific fields
  network_used: "polygon",
  transfer_type: "interbank",
  settlement_time_seconds: 45,
  
  // Cost comparison
  swift_equivalent_fee: 2540.00,
  nexora_fee: 50.00,
  fee_savings: 2490.00,
  savings_percentage: "98.03",
  
  // Performance metrics
  success_rate: 99.2,
  processing_efficiency: 85.0,
  
  // Analytics categories
  volume_category: "medium",
  frequency_category: "business_hours",
  complexity_score: 65
}
```

### 2. Daily Analytics
Daily aggregated metrics for each bank:

```javascript
{
  date: "2024-01-15",
  bank_id: 41,
  total_transfers: 25,
  total_volume: 1250000,
  total_fees: 1250,
  avg_settlement_time: 45.5,
  success_rate: 98.5,
  cost_savings: 25000,
  estimated_swift_fees: 6250,
  network_distribution: {
    polygon: 40,
    ethereum: 25,
    arbitrum: 20,
    base: 10,
    optimism: 5
  },
  transfer_type_distribution: {
    interbank: 30,
    international: 25,
    domestic: 20,
    cross_border: 15,
    remittance: 10
  }
}
```

### 3. Network Performance Data
Performance metrics by blockchain network:

```javascript
{
  network: "polygon",
  bank_id: 41,
  total_transfers: 80,
  total_volume: 1200000,
  total_fees: 1200,
  avg_settlement_time: 25.5,
  success_rate: 99.2,
  cost_savings: 8000,
  reliability_score: 95.5,
  throughput_tps: 1200,
  gas_efficiency: 92.0
}
```

### 4. Cost Savings Analysis
Detailed cost comparison between Nexora and SWIFT:

```javascript
{
  period: "30d",
  bank_id: 41,
  nexora_costs: {
    total_fees: 2500,
    avg_fee_per_transfer: 16.67,
    fee_breakdown: {
      network_fees: 1500,
      platform_fees: 1000
    }
  },
  swift_costs: {
    total_fees: 12500,
    avg_fee_per_transfer: 83.33,
    fee_breakdown: {
      wire_fees: 3750,
      correspondent_fees: 2250,
      fx_margin: 6500
    }
  },
  savings: {
    total_savings: 10000,
    savings_percentage: 80.0,
    savings_per_transfer: 66.67
  }
}
```

### 5. KPI Data
Key performance indicators for analytics dashboard:

```javascript
{
  bank_id: 41,
  period: "30d",
  total_transfers: 150,
  total_volume: 7500000,
  total_fees: 7500,
  avg_settlement_time: 35.5,
  success_rate: 98.5,
  cost_savings: 60000,
  estimated_swift_fees: 37500,
  savings_percentage: "80.00",
  idle_capital_reduction: 1125000,
  cost_reduction_vs_swift: 80.0
}
```

### 6. Volume Trends
Daily volume and transfer trends:

```javascript
{
  date: "2024-01-15",
  transfers: 25,
  volume: 125000,
  fees: 125,
  avg_settlement_time: 45.5,
  success_rate: 98.5
}
```

### 7. Transfer Type Distribution
Breakdown of transfers by type:

```javascript
{
  transfer_type: "interbank",
  count: 50,
  total_volume: 2500000,
  total_fees: 2500,
  avg_settlement_time: 35.5,
  percentage: "33.33"
}
```

### 8. Dashboard Data
Comprehensive dashboard data combining all metrics:

```javascript
{
  period: "30d",
  bank_id: 41,
  kpis: { /* KPI data */ },
  volume_trends: [ /* Volume trends array */ ],
  transfer_distribution: [ /* Transfer distribution array */ ],
  network_performance: [ /* Network performance array */ ],
  cost_savings: { /* Cost savings data */ },
  generated_at: "2024-01-15T10:30:00Z"
}
```

## 🔧 Configuration Options

### Command Line Arguments

```bash
# Basic usage
node run-analytics-test-data.js

# Custom parameters
node run-analytics-test-data.js \
  --banks 10 \
  --transactions 500 \
  --period 90d \
  --bank-id 41 \
  --export my-data.json
```

### Available Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--banks` | `-b` | Number of banks to generate | 5 |
| `--transactions` | `-t` | Number of transactions to generate | 200 |
| `--period` | `-p` | Time period (7d, 30d, 90d, 1y) | 30d |
| `--bank-id` | `-i` | Specific bank ID to generate data for | null |
| `--export` | `-e` | Export filename | analytics-test-data.json |
| `--help` | `-h` | Show help message | false |

### Network Distribution

Default network distribution for transactions:

```javascript
{
  polygon: 0.4,    // 40% - Most popular
  ethereum: 0.3,    // 30% - High value
  arbitrum: 0.2,    // 20% - Fast and cheap
  base: 0.1         // 10% - Emerging
}
```

### Transfer Type Distribution

Default transfer type distribution:

```javascript
{
  interbank: 0.3,       // 30% - Bank to bank
  international: 0.25,   // 25% - Cross-border
  domestic: 0.2,         // 20% - Same country
  cross_border: 0.15,    // 15% - Regional
  remittance: 0.1        // 10% - Personal transfers
}
```

## 📈 Data Generation Features

### 1. Realistic Time Distribution
- **Business Hours**: Higher activity during 9 AM - 5 PM
- **Weekend Reduction**: 30% volume reduction on weekends
- **Holiday Impact**: 50% volume reduction on holidays
- **Period-Based**: Proper date filtering for 7d, 30d, 90d, 1y

### 2. Network Performance Simulation
- **Polygon**: Fastest settlement (0.5x multiplier)
- **Ethereum**: Standard settlement (1.0x multiplier)
- **Arbitrum**: Fast settlement (0.8x multiplier)
- **Base**: Fast settlement (0.7x multiplier)
- **Optimism**: Fast settlement (0.9x multiplier)

### 3. Cost Calculation
- **SWIFT Fees**: Base fee + correspondent fee + FX margin
- **Nexora Fees**: Network fee + platform fee (0.1%)
- **Savings Calculation**: Realistic 80-98% savings vs SWIFT

### 4. Success Rate Simulation
- **Base Rate**: 98% success rate
- **Network Adjustments**: +0.5% to +1.5% based on network
- **Transfer Type Adjustments**: -0.5% to +0.8% based on complexity

### 5. Volume Categorization
- **Low**: < $10,000
- **Medium**: $10,000 - $100,000
- **High**: $100,000 - $1,000,000
- **Very High**: > $1,000,000

## 🧪 Testing with Analytics Data

### 1. Test Analytics Service

```javascript
const AnalyticsService = require('../src/analytics/services/AnalyticsService');

// Initialize with test data
const db = require('./test-database-connection');
const analyticsService = new AnalyticsService(db);

// Test KPI retrieval
const kpis = await analyticsService.getKPIs(41, '30d');
console.log('KPIs:', kpis);

// Test volume trends
const trends = await analyticsService.getVolumeTrends(41, '30d');
console.log('Trends:', trends);
```

### 2. Test Analytics Controller

```javascript
const AnalyticsController = require('../src/analytics/controllers/AnalyticsController');

// Mock request and response
const req = {
  params: { bankId: '41' },
  query: { period: '30d' }
};

const res = {
  json: (data) => console.log('Response:', data),
  status: (code) => ({ json: (data) => console.log(`Status ${code}:`, data) })
};

// Test controller methods
const controller = new AnalyticsController(db);
await controller.getKPIs(req, res);
await controller.getVolumeTrends(req, res);
```

### 3. Test Analytics Routes

```javascript
const request = require('supertest');
const app = require('../src/app');

// Test analytics endpoints
describe('Analytics API', () => {
  test('GET /analytics/kpis/:bankId', async () => {
    const response = await request(app)
      .get('/analytics/kpis/41?period=30d')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('kpis');
  });
  
  test('GET /analytics/trends/:bankId', async () => {
    const response = await request(app)
      .get('/analytics/trends/41?period=30d')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeInstanceOf(Array);
  });
});
```

## 📊 Data Validation

### 1. Validate Analytics Data Structure

```javascript
const { validateAnalyticsData } = require('./test-data-validator');

// Validate generated analytics data
const isValid = validateAnalyticsData(analyticsData);
console.log('Analytics data valid:', isValid);
```

### 2. Check Data Consistency

```javascript
// Verify network distribution adds up to 100%
const networkTotal = Object.values(networkDistribution).reduce((sum, val) => sum + val, 0);
console.log('Network distribution total:', networkTotal); // Should be 1.0

// Verify transfer type distribution adds up to 100%
const transferTypeTotal = Object.values(transferTypeDistribution).reduce((sum, val) => sum + val, 0);
console.log('Transfer type distribution total:', transferTypeTotal); // Should be 1.0
```

### 3. Validate Cost Calculations

```javascript
// Verify cost savings are realistic
analyticsTransactions.forEach(tx => {
  const savingsPercentage = (tx.fee_savings / tx.swift_equivalent_fee) * 100;
  console.assert(savingsPercentage >= 80 && savingsPercentage <= 98, 
    `Unrealistic savings percentage: ${savingsPercentage}%`);
});
```

## 🔄 Integration with Existing Test Data

### 1. Use Existing Base Data

```javascript
const TestDataLoader = require('./TestDataLoader');
const AnalyticsTestDataGenerator = require('./AnalyticsTestDataGenerator');

// Load existing test data
const loader = new TestDataLoader();
const baseData = await loader.loadAllTestData();

// Generate analytics data from existing base data
const analyticsGenerator = new AnalyticsTestDataGenerator();
const analyticsData = await analyticsGenerator.generateAnalyticsTransactions(
  baseData.banks,
  baseData.wallets,
  baseData.users
);
```

### 2. Extend Existing Transactions

```javascript
// Transform existing transactions to analytics format
const existingTransactions = baseData.transactions;
const analyticsTransactions = existingTransactions.map(tx => 
  analyticsGenerator.transformTransactionForAnalytics(tx)
);
```

### 3. Combine Data Sources

```javascript
// Combine base and analytics data
const combinedData = {
  ...baseData,
  analytics_transactions: analyticsData.analytics_transactions,
  daily_analytics: analyticsData.daily_analytics,
  network_performance: analyticsData.network_performance,
  cost_savings: analyticsData.cost_savings
};
```

## 📈 Performance Considerations

### 1. Data Generation Performance

```javascript
// Generate large datasets efficiently
const startTime = Date.now();

// Generate 1000 transactions
const transactions = await generator.generateAnalyticsTransactions(
  banks, wallets, users, { transactionCount: 1000 }
);

const endTime = Date.now();
console.log(`Generated ${transactions.length} transactions in ${endTime - startTime}ms`);
```

### 2. Memory Usage

```javascript
// Monitor memory usage for large datasets
const used = process.memoryUsage();
console.log('Memory usage:', {
  rss: `${Math.round(used.rss / 1024 / 1024 * 100) / 100} MB`,
  heapTotal: `${Math.round(used.heapTotal / 1024 / 1024 * 100) / 100} MB`,
  heapUsed: `${Math.round(used.heapUsed / 1024 / 1024 * 100) / 100} MB`
});
```

### 3. Database Performance

```javascript
// Batch insert for better performance
const batchSize = 1000;
for (let i = 0; i < analyticsTransactions.length; i += batchSize) {
  const batch = analyticsTransactions.slice(i, i + batchSize);
  await db.batchInsert('analytics_transactions', batch);
}
```

## 🛠️ Customization

### 1. Custom Network Distribution

```javascript
// Custom network distribution
const customNetworkDistribution = {
  polygon: 0.5,    // 50% Polygon
  ethereum: 0.3,    // 30% Ethereum
  arbitrum: 0.2     // 20% Arbitrum
};

const analyticsTransactions = await generator.generateAnalyticsTransactions(
  banks, wallets, users, { networkDistribution: customNetworkDistribution }
);
```

### 2. Custom Transfer Type Distribution

```javascript
// Custom transfer type distribution
const customTransferTypeDistribution = {
  interbank: 0.4,      // 40% Interbank
  international: 0.3,   // 30% International
  domestic: 0.2,        // 20% Domestic
  remittance: 0.1       // 10% Remittance
};

const analyticsTransactions = await generator.generateAnalyticsTransactions(
  banks, wallets, users, { transferTypeDistribution: customTransferTypeDistribution }
);
```

### 3. Custom Cost Calculation

```javascript
// Override cost calculation methods
class CustomAnalyticsGenerator extends AnalyticsTestDataGenerator {
  calculateSwiftFee(amount, transactionType) {
    // Custom SWIFT fee calculation
    return amount * 0.003 + 50; // 0.3% + $50 base fee
  }
  
  calculateNexoraFee(amount, network, transferType) {
    // Custom Nexora fee calculation
    return amount * 0.0005 + 2; // 0.05% + $2 base fee
  }
}
```

## 📚 Examples

### 1. Generate Test Data for Development

```bash
# Quick development setup
node run-analytics-test-data.js --banks 3 --transactions 100 --period 7d
```

### 2. Generate Test Data for Testing

```bash
# Comprehensive test data
node run-analytics-test-data.js --banks 10 --transactions 1000 --period 90d
```

### 3. Generate Test Data for Demo

```bash
# Demo data with specific bank
node run-analytics-test-data.js --bank-id 41 --period 30d --export demo-data.json
```

### 4. Generate Test Data for Performance Testing

```bash
# Large dataset for performance testing
node run-analytics-test-data.js --banks 20 --transactions 5000 --period 1y
```

## 🔍 Troubleshooting

### 1. Common Issues

**Memory Issues with Large Datasets**
```bash
# Increase Node.js memory limit
node --max-old-space-size=4096 run-analytics-test-data.js --banks 20 --transactions 5000
```

**Database Connection Issues**
```bash
# Check database connection before generating data
node -e "const db = require('./database-connection'); db.raw('SELECT 1').then(() => console.log('DB connected')).catch(console.error)"
```

**Export File Permission Issues**
```bash
# Check directory permissions
ls -la exports/
chmod 755 exports/
```

### 2. Data Validation Issues

**Invalid Network Distribution**
```javascript
// Ensure network distribution adds up to 1.0
const total = Object.values(networkDistribution).reduce((sum, val) => sum + val, 0);
if (Math.abs(total - 1.0) > 0.001) {
  throw new Error(`Network distribution total is ${total}, should be 1.0`);
}
```

**Invalid Transfer Type Distribution**
```javascript
// Ensure transfer type distribution adds up to 1.0
const total = Object.values(transferTypeDistribution).reduce((sum, val) => sum + val, 0);
if (Math.abs(total - 1.0) > 0.001) {
  throw new Error(`Transfer type distribution total is ${total}, should be 1.0`);
}
```

### 3. Performance Issues

**Slow Data Generation**
```javascript
// Use batch processing for large datasets
const batchSize = 1000;
for (let i = 0; i < totalTransactions; i += batchSize) {
  const batch = generateTransactionBatch(batchSize);
  await processBatch(batch);
}
```

**High Memory Usage**
```javascript
// Stream data instead of loading all into memory
const stream = require('stream');
const generator = new AnalyticsTestDataGenerator();

generator.generateAnalyticsTransactionsStream(banks, wallets, users)
  .pipe(fs.createWriteStream('analytics-data.json'));
```

## 📖 API Reference

### AnalyticsTestDataGenerator Methods

- `generateAnalyticsTransactions(banks, wallets, users, options)` - Generate analytics transactions
- `generateDailyAnalytics(bankId, period)` - Generate daily analytics data
- `generateNetworkPerformanceData(bankId, period)` - Generate network performance data
- `generateCostSavingsData(bankId, period)` - Generate cost savings analysis
- `generateKPIData(bankId, period)` - Generate KPI data
- `generateVolumeTrendsData(bankId, period)` - Generate volume trends
- `generateTransferTypeDistributionData(bankId, period)` - Generate transfer distributions
- `generateAnalyticsDashboardData(bankId, period)` - Generate comprehensive dashboard data

### Helper Methods

- `getStartDateForPeriod(period)` - Get start date for time period
- `selectNetwork(distribution)` - Select network based on distribution
- `selectTransferType(distribution)` - Select transfer type based on distribution
- `calculateSwiftFee(amount, transactionType)` - Calculate SWIFT equivalent fee
- `calculateNexoraFee(amount, network, transferType)` - Calculate Nexora fee
- `calculateSettlementTime(processingTimeMinutes, network)` - Calculate settlement time
- `calculateSuccessRate(network, transferType)` - Calculate success rate

---

**Last Updated**: January 15, 2024  
**Version**: 1.0.0  
**Compatibility**: Node.js 16+, Analytics API v1.0.0 