# Database Migrations

This directory contains database migration files for the Nexora analytics system.

## Migration Files

### 001_create_analytics_tables.sql

**Description**: Creates comprehensive analytics tables for the Nexora system including daily performance tracking, cost comparisons, and enhanced transaction records.

**Features**:
- Daily analytics tracking per bank
- Cost comparison between Nexora and SWIFT
- Enhanced transaction records with analytics columns
- Performance-optimized indexes
- Automated triggers for real-time updates
- Analytics views for easy reporting

## Tables Created

### 1. daily_analytics
Tracks daily performance metrics for each bank:
- `bank_id` (UUID FK) - Reference to banks table
- `date` (DATE) - Analytics date
- `total_transfers` (INTEGER) - Number of transfers for the day
- `total_volume` (DECIMAL) - Total transfer volume
- `total_fees` (DECIMAL) - Total fees collected
- `avg_settlement_time` (DECIMAL) - Average settlement time in seconds
- `success_rate` (DECIMAL) - Percentage of successful transfers
- `estimated_swift_fees` (DECIMAL) - What SWIFT would have charged
- `actual_fees` (DECIMAL) - Actual Nexora fees
- `cost_savings` (DECIMAL) - Money saved vs SWIFT

### 2. cost_comparisons
Detailed cost analysis for each transfer:
- Links to transaction_records table
- Compares Nexora vs SWIFT fees
- Tracks time savings (48 hours vs 30 seconds)
- Calculates fee savings per transfer

### 3. Enhanced transaction_records
Added analytics columns to existing table:
- `network_used` (VARCHAR) - Network used for transfer
- `settlement_time_seconds` (INTEGER) - Actual settlement time
- `transfer_type` (VARCHAR) - Type of transfer
- `swift_equivalent_fee` (DECIMAL) - SWIFT fee equivalent

## Views Created

### daily_performance_summary
Provides a comprehensive view of daily performance including:
- Bank information
- Transfer metrics
- Cost savings analysis
- Success rates

### cost_savings_analysis
Detailed cost comparison view showing:
- Fee savings per transfer
- Time savings
- Percentage savings vs SWIFT

## Indexes

Performance-optimized indexes on:
- `bank_id` and `date` columns for fast lookups
- Date ranges for recent analytics
- Fee savings for cost analysis
- Settlement times for performance tracking

## Triggers

### update_daily_analytics
Automatically updates daily analytics when new transactions are added:
- Calculates daily totals
- Updates success rates
- Computes cost savings
- Maintains real-time analytics

## Usage Examples

### Get Daily Performance for a Bank
```sql
SELECT * FROM daily_performance_summary 
WHERE bank_id = 'your-bank-id' 
AND date >= CURRENT_DATE - INTERVAL '30 days';
```

### Get Cost Savings Analysis
```sql
SELECT * FROM cost_savings_analysis 
WHERE bank_id = 'your-bank-id' 
ORDER BY transfer_date DESC;
```

### Get Recent Analytics
```sql
SELECT * FROM daily_analytics 
WHERE date >= CURRENT_DATE - INTERVAL '7 days' 
ORDER BY date DESC, bank_id;
```

## Running the Migration

### PostgreSQL
```bash
psql -d your_database -f 001_create_analytics_tables.sql
```

### SQLite (Development)
```bash
sqlite3 your_database.db < 001_create_analytics_tables.sql
```

## Notes

- Uses PostgreSQL syntax with proper data types
- Includes UUID foreign keys for scalability
- Implements proper constraints and indexes
- Provides sample data for testing
- Includes comprehensive documentation
- Supports both development and production environments

## Security Considerations

- Foreign key constraints ensure data integrity
- Unique constraints prevent duplicate records
- Proper indexing for performance
- Role-based access control ready
- Audit trail with created_at/updated_at timestamps 