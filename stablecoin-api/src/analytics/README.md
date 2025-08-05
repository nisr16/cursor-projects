# Analytics Services

This directory contains analytics services for the Nexora USDC banking system, providing comprehensive KPI tracking, cost analysis, and performance metrics.

## Overview

The analytics system provides real-time insights into:
- **Transfer Performance**: Volume, fees, settlement times, success rates
- **Cost Analysis**: Nexora vs SWIFT cost comparisons
- **Network Performance**: Metrics by blockchain network (Polygon, Ethereum, Arbitrum, Base)
- **Trend Analysis**: Daily volume and fee trends for charting
- **Transfer Distribution**: Breakdown by transfer type

## Files

- `services/AnalyticsService.js` - Main analytics service class
- `services/example.js` - Usage examples and demonstrations

## AnalyticsService Class

### Constructor

```javascript
const AnalyticsService = require('./services/AnalyticsService');
const db = require('../../database/connection');

const analyticsService = new AnalyticsService(db);
```

### Methods

#### 1. `getPeriodFilter(period)`
Converts period strings to JavaScript Date objects.

**Parameters:**
- `period` (string): One of '7d', '30d', '90d', '1y'

**Returns:**
- `Object`: `{ startDate, endDate }`

**Example:**
```javascript
const filter = analyticsService.getPeriodFilter('30d');
console.log(filter); // { startDate: Date, endDate: Date }
```

#### 2. `calculateSwiftEquivalentCost(amount)`
Calculates what a transfer would cost via SWIFT.

**Parameters:**
- `amount` (number): Transfer amount in USD

**Returns:**
- `number`: SWIFT equivalent cost

**Formula:**
- Wire fee: $25.00
- Correspondent fee: $15.00
- FX margin: 2.5% of amount

**Example:**
```javascript
const swiftCost = analyticsService.calculateSwiftEquivalentCost(100000);
console.log(swiftCost); // 2540.00
```

#### 3. `captureTransferAnalytics(transfer)`
Captures analytics when a transfer is created.

**Parameters:**
- `transfer` (Object): Transfer object with required fields
  - `transaction_id` (string): Unique transaction ID
  - `bank_id` (string): Bank UUID
  - `amount` (number): Transfer amount
  - `network_used` (string, optional): Network used (default: 'nexora')
  - `settlement_time_seconds` (number, optional): Settlement time (default: 30)
  - `transfer_type` (string, optional): Transfer type (default: 'interbank')
  - `status` (string, optional): Transfer status (default: 'pending')

**Returns:**
- `Promise<Object>`: Analytics capture result

**Example:**
```javascript
const transfer = {
    transaction_id: 'transfer_12345',
    bank_id: '550e8400-e29b-41d4-a716-446655440000',
    amount: 50000.00,
    network_used: 'polygon',
    settlement_time_seconds: 25,
    transfer_type: 'interbank',
    status: 'completed'
};

const result = await analyticsService.captureTransferAnalytics(transfer);
```

#### 4. `getKPIs(bankId, period)`
Gets KPIs for a bank over a specified period.

**Parameters:**
- `bankId` (string): Bank UUID
- `period` (string): Period string ('7d', '30d', '90d', '1y')

**Returns:**
- `Promise<Object>`: KPI data including:
  - `total_transfers`: Number of transfers
  - `total_volume`: Total transfer volume
  - `total_fees`: Total fees collected
  - `avg_settlement_time`: Average settlement time in seconds
  - `success_rate`: Percentage of successful transfers
  - `cost_savings`: Money saved vs SWIFT
  - `estimated_swift_fees`: What SWIFT would have charged
  - `savings_percentage`: Percentage savings

**Example:**
```javascript
const kpis = await analyticsService.getKPIs('bank-uuid', '30d');
console.log(kpis.kpis.total_volume); // Total volume for last 30 days
```

#### 5. `getVolumeTrends(bankId, period)`
Gets volume trends for charting.

**Parameters:**
- `bankId` (string): Bank UUID
- `period` (string): Period string

**Returns:**
- `Promise<Array>`: Daily volume and fee trends

**Example:**
```javascript
const trends = await analyticsService.getVolumeTrends('bank-uuid', '7d');
// Returns array of daily data for charting
```

#### 6. `getTransferTypeDistribution(bankId, period)`
Gets breakdown by transfer type.

**Parameters:**
- `bankId` (string): Bank UUID
- `period` (string): Period string

**Returns:**
- `Promise<Array>`: Transfer type breakdown with counts, volumes, and percentages

**Example:**
```javascript
const distribution = await analyticsService.getTransferTypeDistribution('bank-uuid', '90d');
// Returns breakdown of interbank, international, etc.
```

#### 7. `getNetworkPerformance(bankId, period)`
Gets performance metrics by network.

**Parameters:**
- `bankId` (string): Bank UUID
- `period` (string): Period string

**Returns:**
- `Promise<Array>`: Network performance data for Polygon, Ethereum, Arbitrum, Base

**Example:**
```javascript
const performance = await analyticsService.getNetworkPerformance('bank-uuid', '30d');
// Returns performance metrics by blockchain network
```

#### 8. `getAnalyticsDashboard(bankId, period)`
Gets comprehensive analytics dashboard data.

**Parameters:**
- `bankId` (string): Bank UUID
- `period` (string): Period string

**Returns:**
- `Promise<Object>`: Complete dashboard data including KPIs, trends, distributions, and network performance

**Example:**
```javascript
const dashboard = await analyticsService.getAnalyticsDashboard('bank-uuid', '30d');
// Returns complete analytics dashboard data
```

#### 9. `getCostSavingsAnalysis(bankId, period)`
Gets detailed cost savings analysis.

**Parameters:**
- `bankId` (string): Bank UUID
- `period` (string): Period string

**Returns:**
- `Promise<Object>`: Cost savings analysis with time and fee savings

**Example:**
```javascript
const savings = await analyticsService.getCostSavingsAnalysis('bank-uuid', '1y');
// Returns detailed cost savings vs SWIFT
```

## Database Requirements

The analytics service requires the following database tables (created by migration `001_create_analytics_tables.sql`):

- `transaction_records` (enhanced with analytics columns)
- `cost_comparisons`
- `daily_analytics`

## Error Handling

All methods include comprehensive error handling:

```javascript
try {
    const kpis = await analyticsService.getKPIs(bankId, period);
    // Handle success
} catch (error) {
    console.error('Analytics error:', error.message);
    // Handle error
}
```

## Performance Considerations

- Uses parameterized queries to prevent SQL injection
- Includes database indexes for optimal performance
- Implements connection pooling for scalability
- Uses async/await for non-blocking operations

## Security Features

- Parameterized queries prevent SQL injection
- Input validation for period strings
- Error handling prevents information leakage
- Database connection validation

## Usage Patterns

### Basic Usage
```javascript
const AnalyticsService = require('./services/AnalyticsService');
const db = require('../../database/connection');

const analytics = new AnalyticsService(db);

// Get KPIs
const kpis = await analytics.getKPIs('bank-uuid', '30d');

// Capture transfer analytics
await analytics.captureTransferAnalytics(transferData);
```

### Dashboard Integration
```javascript
// Get complete dashboard data
const dashboard = await analytics.getAnalyticsDashboard('bank-uuid', '30d');

// Use for charts and visualizations
const volumeTrends = dashboard.volume_trends;
const networkPerformance = dashboard.network_performance;
```

### Cost Analysis
```javascript
// Get cost savings analysis
const savings = await analytics.getCostSavingsAnalysis('bank-uuid', '1y');

// Calculate SWIFT equivalent
const swiftCost = analytics.calculateSwiftEquivalentCost(100000);
```

## Testing

Run the example file to test the analytics service:

```bash
node src/analytics/services/example.js
```

## Dependencies

- Database connection (SQLite/PostgreSQL)
- Node.js async/await support
- Error handling utilities

## Contributing

When adding new analytics features:
1. Follow the existing method patterns
2. Include comprehensive error handling
3. Add parameterized queries for security
4. Include JSDoc documentation
5. Add examples to the example.js file 