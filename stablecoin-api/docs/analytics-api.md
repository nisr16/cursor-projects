# Nexora Analytics API Documentation

## 📊 Overview

The Nexora Analytics API provides comprehensive banking analytics and performance metrics for USDC transfer operations. This system enables real-time monitoring of transfer volumes, cost savings, network performance, and compliance metrics across multiple blockchain networks.

### 🎯 Business Value

- **Cost Optimization**: Track savings vs traditional SWIFT transfers
- **Performance Monitoring**: Real-time settlement time and success rate tracking
- **Network Analysis**: Compare performance across different blockchain networks
- **Compliance Reporting**: Automated regulatory reporting and audit trails
- **Risk Management**: Fraud detection and suspicious activity monitoring
- **Operational Efficiency**: Reduce idle capital and optimize liquidity

### 🔧 Key Features

- **Real-time Analytics**: Live data updates with configurable refresh intervals
- **Multi-period Analysis**: 7d, 30d, 90d, 1y time period support
- **Network Comparison**: Performance metrics across Polygon, Ethereum, Arbitrum, Base
- **Cost Savings Tracking**: Automated SWIFT vs Nexora cost comparison
- **Export Capabilities**: PDF reports and data export functionality
- **Compliance Ready**: Built-in regulatory reporting and audit trails

## 🔐 Authentication

### API Base URL
```
https://api.nexora.com/v1
```

### Authentication Method
All API requests require Bearer token authentication:

```http
Authorization: Bearer YOUR_API_TOKEN
```

### Rate Limiting
- **Standard Plan**: 1,000 requests/hour
- **Professional Plan**: 10,000 requests/hour
- **Enterprise Plan**: 100,000 requests/hour

Rate limit headers included in responses:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## 📋 API Endpoints

### 1. Get Dashboard Analytics

Retrieve comprehensive dashboard data including KPIs, trends, and performance metrics.

#### Request
```http
GET /analytics/dashboard/{bankId}
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `bankId` | string | Yes | Bank UUID identifier |
| `period` | string | No | Time period (7d, 30d, 90d, 1y). Default: 30d |
| `format` | string | No | Response format (json, pdf). Default: json |

#### Query Parameters
```javascript
{
  "period": "30d",
  "format": "json"
}
```

#### Response Schema
```json
{
  "success": true,
  "data": {
    "period": "30d",
    "kpis": {
      "total_transfers": 150,
      "total_volume": 2500000.00,
      "total_fees": 2500.00,
      "avg_settlement_time": 30.5,
      "success_rate": 98.5,
      "cost_savings": 10000.00,
      "estimated_swift_fees": 12500.00,
      "savings_percentage": "80.00"
    },
    "volume_trends": [
      {
        "date": "2024-01-01",
        "transfers": 25,
        "volume": 500000.00,
        "fees": 500.00,
        "avg_settlement_time": 30.2,
        "success_rate": 98.5
      }
    ],
    "transfer_distribution": [
      {
        "transfer_type": "interbank",
        "count": 100,
        "total_volume": 1500000.00,
        "total_fees": 1500.00,
        "avg_settlement_time": 30.5,
        "percentage": "66.67"
      }
    ],
    "network_performance": [
      {
        "network": "polygon",
        "total_transfers": 80,
        "total_volume": 1200000.00,
        "total_fees": 1200.00,
        "avg_settlement_time": 25.5,
        "success_rate": 99.2,
        "cost_savings": 8000.00
      }
    ]
  },
  "generated_at": "2024-01-15T10:30:00Z"
}
```

#### Example Request
```bash
curl -X GET "https://api.nexora.com/v1/analytics/dashboard/550e8400-e29b-41d4-a716-446655440000?period=30d" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json"
```

#### JavaScript Example
```javascript
const response = await fetch(
  `https://api.nexora.com/v1/analytics/dashboard/${bankId}?period=${period}`,
  {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json'
    }
  }
);

const data = await response.json();
```

### 2. Get Key Performance Indicators

Retrieve specific KPI metrics for a bank.

#### Request
```http
GET /analytics/kpis/{bankId}
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `bankId` | string | Yes | Bank UUID identifier |
| `period` | string | No | Time period (7d, 30d, 90d, 1y). Default: 30d |

#### Response Schema
```json
{
  "success": true,
  "data": {
    "period": "30d",
    "kpis": {
      "total_transfers": 150,
      "total_volume": 2500000.00,
      "total_fees": 2500.00,
      "avg_settlement_time": 30.5,
      "success_rate": 98.5,
      "cost_savings": 10000.00,
      "estimated_swift_fees": 12500.00,
      "savings_percentage": "80.00"
    }
  },
  "generated_at": "2024-01-15T10:30:00Z"
}
```

### 3. Get Volume Trends

Retrieve daily volume and transfer trends for charting.

#### Request
```http
GET /analytics/trends/{bankId}
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `bankId` | string | Yes | Bank UUID identifier |
| `period` | string | No | Time period (7d, 30d, 90d, 1y). Default: 30d |

#### Response Schema
```json
{
  "success": true,
  "data": [
    {
      "date": "2024-01-01",
      "transfers": 25,
      "volume": 500000.00,
      "fees": 500.00,
      "avg_settlement_time": 30.2,
      "success_rate": 98.5
    },
    {
      "date": "2024-01-02",
      "transfers": 30,
      "volume": 600000.00,
      "fees": 600.00,
      "avg_settlement_time": 29.8,
      "success_rate": 99.1
    }
  ],
  "period": "30d",
  "generated_at": "2024-01-15T10:30:00Z"
}
```

### 4. Get Transfer Type Distribution

Retrieve breakdown of transfers by type (interbank, international, etc.).

#### Request
```http
GET /analytics/transfer-types/{bankId}
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `bankId` | string | Yes | Bank UUID identifier |
| `period` | string | No | Time period (7d, 30d, 90d, 1y). Default: 30d |

#### Response Schema
```json
{
  "success": true,
  "data": [
    {
      "transfer_type": "interbank",
      "count": 100,
      "total_volume": 1500000.00,
      "total_fees": 1500.00,
      "avg_settlement_time": 30.5,
      "percentage": "66.67"
    },
    {
      "transfer_type": "international",
      "count": 50,
      "total_volume": 1000000.00,
      "total_fees": 1000.00,
      "avg_settlement_time": 35.2,
      "percentage": "33.33"
    }
  ],
  "period": "30d",
  "generated_at": "2024-01-15T10:30:00Z"
}
```

### 5. Get Network Performance

Retrieve performance metrics by blockchain network.

#### Request
```http
GET /analytics/network-performance/{bankId}
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `bankId` | string | Yes | Bank UUID identifier |
| `period` | string | No | Time period (7d, 30d, 90d, 1y). Default: 30d |

#### Response Schema
```json
{
  "success": true,
  "data": [
    {
      "network": "polygon",
      "total_transfers": 80,
      "total_volume": 1200000.00,
      "total_fees": 1200.00,
      "avg_settlement_time": 25.5,
      "success_rate": 99.2,
      "cost_savings": 8000.00
    },
    {
      "network": "ethereum",
      "total_transfers": 70,
      "total_volume": 1300000.00,
      "total_fees": 1300.00,
      "avg_settlement_time": 35.2,
      "success_rate": 97.8,
      "cost_savings": 7000.00
    }
  ],
  "period": "30d",
  "generated_at": "2024-01-15T10:30:00Z"
}
```

### 6. Get Cost Savings Analysis

Retrieve detailed cost comparison between Nexora and SWIFT.

#### Request
```http
GET /analytics/cost-savings/{bankId}
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `bankId` | string | Yes | Bank UUID identifier |
| `period` | string | No | Time period (7d, 30d, 90d, 1y). Default: 30d |

#### Response Schema
```json
{
  "success": true,
  "data": {
    "period": "30d",
    "nexora_costs": {
      "total_fees": 2500.00,
      "avg_fee_per_transfer": 16.67,
      "fee_breakdown": {
        "network_fees": 1500.00,
        "platform_fees": 1000.00
      }
    },
    "swift_costs": {
      "total_fees": 12500.00,
      "avg_fee_per_transfer": 83.33,
      "fee_breakdown": {
        "wire_fees": 3750.00,
        "correspondent_fees": 2250.00,
        "fx_margin": 6500.00
      }
    },
    "savings": {
      "total_savings": 10000.00,
      "savings_percentage": 80.00,
      "savings_per_transfer": 66.67
    }
  },
  "generated_at": "2024-01-15T10:30:00Z"
}
```

### 7. Capture Transfer Analytics

Automatically capture analytics when a transfer is created.

#### Request
```http
POST /analytics/capture-transfer
```

#### Request Body
```json
{
  "transaction_id": "transfer_12345",
  "bank_id": "550e8400-e29b-41d4-a716-446655440000",
  "amount": 50000,
  "network_used": "polygon",
  "settlement_time_seconds": 25,
  "transfer_type": "interbank",
  "status": "completed"
}
```

#### Response Schema
```json
{
  "success": true,
  "data": {
    "analytics_captured": {
      "transaction_id": "transfer_12345",
      "swift_equivalent_fee": 2540.00,
      "nexora_fee": 50.00,
      "fee_savings": 2490.00,
      "settlement_time_savings": 86400
    }
  },
  "generated_at": "2024-01-15T10:30:00Z"
}
```

### 8. Health Check

Check API health and status.

#### Request
```http
GET /analytics/health
```

#### Response Schema
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "version": "1.0.0",
    "timestamp": "2024-01-15T10:30:00Z",
    "uptime": 86400,
    "database": "connected",
    "cache": "operational"
  }
}
```

## 📊 Data Models

### Bank Analytics Schema
```json
{
  "bank_id": "550e8400-e29b-41d4-a716-446655440000",
  "period": "30d",
  "kpis": {
    "total_transfers": "number",
    "total_volume": "number",
    "total_fees": "number",
    "avg_settlement_time": "number",
    "success_rate": "number",
    "cost_savings": "number",
    "estimated_swift_fees": "number",
    "savings_percentage": "string"
  },
  "volume_trends": [
    {
      "date": "string (YYYY-MM-DD)",
      "transfers": "number",
      "volume": "number",
      "fees": "number",
      "avg_settlement_time": "number",
      "success_rate": "number"
    }
  ],
  "transfer_distribution": [
    {
      "transfer_type": "string",
      "count": "number",
      "total_volume": "number",
      "total_fees": "number",
      "avg_settlement_time": "number",
      "percentage": "string"
    }
  ],
  "network_performance": [
    {
      "network": "string",
      "total_transfers": "number",
      "total_volume": "number",
      "total_fees": "number",
      "avg_settlement_time": "number",
      "success_rate": "number",
      "cost_savings": "number"
    }
  ]
}
```

### Transfer Analytics Schema
```json
{
  "transaction_id": "string",
  "bank_id": "string (UUID)",
  "amount": "number",
  "network_used": "string",
  "settlement_time_seconds": "number",
  "transfer_type": "string",
  "status": "string",
  "created_at": "string (ISO 8601)",
  "swift_equivalent_fee": "number",
  "nexora_fee": "number",
  "fee_savings": "number"
}
```

## 🔧 Integration Guide

### 1. JavaScript/Node.js Integration

#### Setup
```javascript
const NEXORA_API_BASE = 'https://api.nexora.com/v1';
const API_TOKEN = 'your_api_token';

class NexoraAnalytics {
  constructor(apiToken) {
    this.apiToken = apiToken;
    this.baseUrl = NEXORA_API_BASE;
  }

  async makeRequest(endpoint, options = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getDashboard(bankId, period = '30d') {
    return this.makeRequest(`/analytics/dashboard/${bankId}?period=${period}`);
  }

  async getKPIs(bankId, period = '30d') {
    return this.makeRequest(`/analytics/kpis/${bankId}?period=${period}`);
  }

  async getVolumeTrends(bankId, period = '30d') {
    return this.makeRequest(`/analytics/trends/${bankId}?period=${period}`);
  }

  async captureTransfer(transferData) {
    return this.makeRequest('/analytics/capture-transfer', {
      method: 'POST',
      body: JSON.stringify(transferData)
    });
  }
}
```

#### Usage Example
```javascript
const analytics = new NexoraAnalytics('your_api_token');

// Get dashboard data
const dashboard = await analytics.getDashboard('550e8400-e29b-41d4-a716-446655440000', '30d');
console.log('Total transfers:', dashboard.data.kpis.total_transfers);

// Capture transfer analytics
const transferData = {
  transaction_id: 'transfer_12345',
  bank_id: '550e8400-e29b-41d4-a716-446655440000',
  amount: 50000,
  network_used: 'polygon',
  settlement_time_seconds: 25,
  transfer_type: 'interbank',
  status: 'completed'
};

const captureResult = await analytics.captureTransfer(transferData);
console.log('Fee savings:', captureResult.data.analytics_captured.fee_savings);
```

### 2. Python Integration

#### Setup
```python
import requests
import json
from typing import Dict, Any

class NexoraAnalytics:
    def __init__(self, api_token: str):
        self.api_token = api_token
        self.base_url = "https://api.nexora.com/v1"
        self.headers = {
            "Authorization": f"Bearer {api_token}",
            "Content-Type": "application/json"
        }

    def make_request(self, endpoint: str, method: str = "GET", data: Dict = None) -> Dict[str, Any]:
        url = f"{self.base_url}{endpoint}"
        
        response = requests.request(
            method=method,
            url=url,
            headers=self.headers,
            json=data
        )
        
        response.raise_for_status()
        return response.json()

    def get_dashboard(self, bank_id: str, period: str = "30d") -> Dict[str, Any]:
        return self.make_request(f"/analytics/dashboard/{bank_id}?period={period}")

    def get_kpis(self, bank_id: str, period: str = "30d") -> Dict[str, Any]:
        return self.make_request(f"/analytics/kpis/{bank_id}?period={period}")

    def capture_transfer(self, transfer_data: Dict[str, Any]) -> Dict[str, Any]:
        return self.make_request("/analytics/capture-transfer", method="POST", data=transfer_data)
```

#### Usage Example
```python
analytics = NexoraAnalytics("your_api_token")

# Get dashboard data
dashboard = analytics.get_dashboard("550e8400-e29b-41d4-a716-446655440000", "30d")
print(f"Total transfers: {dashboard['data']['kpis']['total_transfers']}")

# Capture transfer analytics
transfer_data = {
    "transaction_id": "transfer_12345",
    "bank_id": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 50000,
    "network_used": "polygon",
    "settlement_time_seconds": 25,
    "transfer_type": "interbank",
    "status": "completed"
}

capture_result = analytics.capture_transfer(transfer_data)
print(f"Fee savings: ${capture_result['data']['analytics_captured']['fee_savings']}")
```

### 3. React Integration

#### Analytics Hook
```javascript
import { useState, useEffect, useCallback } from 'react';

const useNexoraAnalytics = (bankId, period = '30d') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://api.nexora.com/v1/analytics/dashboard/${bankId}?period=${period}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_NEXORA_API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [bankId, period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
```

#### Usage in Component
```javascript
function AnalyticsDashboard({ bankId }) {
  const { data, loading, error, refetch } = useNexoraAnalytics(bankId, '30d');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Analytics Dashboard</h2>
      <p>Total Transfers: {data.kpis.total_transfers}</p>
      <p>Total Volume: ${data.kpis.total_volume.toLocaleString()}</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

## ⚡ Performance Considerations

### 1. Caching Strategy
- **API Response Caching**: Cache responses for 5 minutes
- **Database Query Optimization**: Use indexes on bank_id and date columns
- **CDN Integration**: Serve static assets via CDN

### 2. Rate Limiting
- **Per-endpoint limits**: Different limits for different endpoints
- **Burst protection**: Allow short bursts above limit
- **Retry logic**: Implement exponential backoff

### 3. Data Pagination
- **Large datasets**: Implement pagination for historical data
- **Cursor-based pagination**: Use timestamps for efficient pagination
- **Limit parameters**: Default to 100 records per page

### 4. Real-time Updates
- **WebSocket support**: For real-time dashboard updates
- **Server-Sent Events**: For live data streaming
- **Polling fallback**: Graceful degradation to polling

## 🛠️ Best Practices

### 1. Error Handling
```javascript
try {
  const response = await analytics.getDashboard(bankId);
  // Handle success
} catch (error) {
  if (error.status === 429) {
    // Rate limit exceeded - implement backoff
    await delay(1000);
    return retryRequest();
  } else if (error.status === 401) {
    // Authentication failed
    handleAuthError();
  } else {
    // Other errors
    handleGenericError(error);
  }
}
```

### 2. Data Validation
```javascript
function validateTransferData(data) {
  const required = ['transaction_id', 'bank_id', 'amount', 'network_used'];
  const missing = required.filter(field => !data[field]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
  
  if (data.amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }
  
  return true;
}
```

### 3. Retry Logic
```javascript
async function makeRequestWithRetry(endpoint, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await makeRequest(endpoint);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const delay = Math.pow(2, i) * 1000; // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Authentication Errors (401)
**Problem**: Invalid or expired API token
**Solution**: 
- Verify API token is correct
- Check token expiration
- Ensure proper Bearer token format

```bash
curl -X GET "https://api.nexora.com/v1/analytics/health" \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

#### 2. Rate Limit Exceeded (429)
**Problem**: Too many requests in short time
**Solution**:
- Implement exponential backoff
- Reduce request frequency
- Upgrade to higher rate limit plan

```javascript
// Exponential backoff implementation
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status !== 429 || i === maxRetries - 1) throw error;
      
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

#### 3. Invalid Bank ID (400)
**Problem**: Bank ID not found or invalid format
**Solution**:
- Verify bank ID format (UUID)
- Check if bank exists in system
- Ensure proper URL encoding

```javascript
// Validate bank ID format
function isValidBankId(bankId) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(bankId);
}
```

#### 4. Invalid Period Parameter (400)
**Problem**: Unsupported time period
**Solution**:
- Use supported periods: 7d, 30d, 90d, 1y
- Check parameter case sensitivity

```javascript
const validPeriods = ['7d', '30d', '90d', '1y'];
if (!validPeriods.includes(period)) {
  throw new Error(`Invalid period. Must be one of: ${validPeriods.join(', ')}`);
}
```

#### 5. Network Timeout (408)
**Problem**: Request taking too long
**Solution**:
- Implement request timeout
- Use connection pooling
- Consider data caching

```javascript
// Request with timeout
async function makeRequestWithTimeout(endpoint, timeout = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(endpoint, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}
```

### Debug Information

#### Enable Debug Logging
```javascript
const DEBUG = process.env.NODE_ENV === 'development';

function logDebug(message, data) {
  if (DEBUG) {
    console.log(`[Nexora Analytics] ${message}`, data);
  }
}
```

#### Request/Response Logging
```javascript
async function makeRequestWithLogging(endpoint, options = {}) {
  const startTime = Date.now();
  
  logDebug('Making request', { endpoint, options });
  
  try {
    const response = await makeRequest(endpoint, options);
    
    logDebug('Request successful', {
      endpoint,
      duration: Date.now() - startTime,
      status: response.status
    });
    
    return response;
  } catch (error) {
    logDebug('Request failed', {
      endpoint,
      duration: Date.now() - startTime,
      error: error.message
    });
    
    throw error;
  }
}
```

## 📞 Support

### Getting Help
- **Documentation**: [https://docs.nexora.com](https://docs.nexora.com)
- **API Status**: [https://status.nexora.com](https://status.nexora.com)
- **Support Email**: api-support@nexora.com
- **Developer Community**: [https://community.nexora.com](https://community.nexora.com)

### SDKs and Libraries
- **JavaScript/Node.js**: `npm install @nexora/analytics-sdk`
- **Python**: `pip install nexora-analytics`
- **React Hook**: `npm install @nexora/react-analytics`

### Rate Limits by Plan
| Plan | Requests/Hour | Burst Limit | Priority Support |
|------|---------------|-------------|------------------|
| Free | 100 | 10 | No |
| Standard | 1,000 | 100 | Email |
| Professional | 10,000 | 1,000 | Phone |
| Enterprise | 100,000 | 10,000 | Dedicated |

---

**Last Updated**: January 15, 2024  
**API Version**: 1.0.0  
**Documentation Version**: 1.0.0 