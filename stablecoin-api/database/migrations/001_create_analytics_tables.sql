-- ========================================
-- Nexora Analytics System Migration
-- Migration: 001_create_analytics_tables.sql
-- Description: Creates analytics tables for cost comparison and performance tracking
-- ========================================

-- 1. DAILY_ANALYTICS TABLE
-- Tracks daily performance metrics per bank
CREATE TABLE IF NOT EXISTS daily_analytics (
    id SERIAL PRIMARY KEY,
    bank_id UUID NOT NULL,
    date DATE NOT NULL,
    total_transfers INTEGER DEFAULT 0,
    total_volume DECIMAL(20,2) DEFAULT 0.00,
    total_fees DECIMAL(20,2) DEFAULT 0.00,
    avg_settlement_time DECIMAL(10,2) DEFAULT 0.00, -- in seconds
    success_rate DECIMAL(5,2) DEFAULT 0.00, -- percentage
    estimated_swift_fees DECIMAL(20,2) DEFAULT 0.00,
    actual_fees DECIMAL(20,2) DEFAULT 0.00,
    cost_savings DECIMAL(20,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key to banks table (assuming banks table has UUID primary key)
    FOREIGN KEY (bank_id) REFERENCES banks(id) ON DELETE CASCADE,
    
    -- Unique constraint to prevent duplicate daily records per bank
    UNIQUE(bank_id, date)
);

-- 2. ENHANCE TRANSACTION_RECORDS TABLE WITH ANALYTICS COLUMNS
-- Add analytics columns to existing transaction_records table
ALTER TABLE transaction_records 
ADD COLUMN IF NOT EXISTS network_used VARCHAR(50) DEFAULT 'nexora',
ADD COLUMN IF NOT EXISTS settlement_time_seconds INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS transfer_type VARCHAR(50) DEFAULT 'interbank',
ADD COLUMN IF NOT EXISTS swift_equivalent_fee DECIMAL(20,2) DEFAULT 0.00;

-- 3. COST_COMPARISONS TABLE
-- Links transfers to detailed cost analysis comparing Nexora vs SWIFT
CREATE TABLE IF NOT EXISTS cost_comparisons (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER NOT NULL,
    bank_id UUID NOT NULL,
    transfer_amount DECIMAL(20,2) NOT NULL,
    nexora_fee DECIMAL(20,2) NOT NULL,
    swift_fee DECIMAL(20,2) NOT NULL,
    fee_savings DECIMAL(20,2) NOT NULL,
    time_savings_hours INTEGER DEFAULT 47, -- 48 hours SWIFT vs 30 seconds Nexora
    settlement_time_nexora INTEGER DEFAULT 30, -- seconds
    settlement_time_swift INTEGER DEFAULT 172800, -- seconds (48 hours)
    transfer_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign keys
    FOREIGN KEY (transaction_id) REFERENCES transaction_records(transaction_id) ON DELETE CASCADE,
    FOREIGN KEY (bank_id) REFERENCES banks(id) ON DELETE CASCADE,
    
    -- Unique constraint to prevent duplicate cost comparisons
    UNIQUE(transaction_id)
);

-- 4. PERFORMANCE INDEXES
-- Indexes for optimal query performance on analytics tables

-- Daily analytics indexes
CREATE INDEX IF NOT EXISTS idx_daily_analytics_bank_id ON daily_analytics(bank_id);
CREATE INDEX IF NOT EXISTS idx_daily_analytics_date ON daily_analytics(date);
CREATE INDEX IF NOT EXISTS idx_daily_analytics_bank_date ON daily_analytics(bank_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_analytics_date_range ON daily_analytics(date) WHERE date >= CURRENT_DATE - INTERVAL '30 days';

-- Cost comparisons indexes
CREATE INDEX IF NOT EXISTS idx_cost_comparisons_transaction_id ON cost_comparisons(transaction_id);
CREATE INDEX IF NOT EXISTS idx_cost_comparisons_bank_id ON cost_comparisons(bank_id);
CREATE INDEX IF NOT EXISTS idx_cost_comparisons_transfer_date ON cost_comparisons(transfer_date);
CREATE INDEX IF NOT EXISTS idx_cost_comparisons_fee_savings ON cost_comparisons(fee_savings) WHERE fee_savings > 0;

-- Transaction records analytics indexes
CREATE INDEX IF NOT EXISTS idx_transaction_records_network ON transaction_records(network_used);
CREATE INDEX IF NOT EXISTS idx_transaction_records_settlement_time ON transaction_records(settlement_time_seconds);
CREATE INDEX IF NOT EXISTS idx_transaction_records_transfer_type ON transaction_records(transfer_type);
CREATE INDEX IF NOT EXISTS idx_transaction_records_swift_fee ON transaction_records(swift_equivalent_fee);

-- 5. ANALYTICS VIEWS FOR EASY REPORTING
-- Create views for common analytics queries

-- Daily performance summary view
CREATE OR REPLACE VIEW daily_performance_summary AS
SELECT 
    da.bank_id,
    b.bank_name,
    da.date,
    da.total_transfers,
    da.total_volume,
    da.total_fees,
    da.avg_settlement_time,
    da.success_rate,
    da.cost_savings,
    ROUND((da.cost_savings / NULLIF(da.estimated_swift_fees, 0)) * 100, 2) as savings_percentage
FROM daily_analytics da
JOIN banks b ON da.bank_id = b.id
ORDER BY da.date DESC, da.bank_id;

-- Cost savings analysis view
CREATE OR REPLACE VIEW cost_savings_analysis AS
SELECT 
    cc.bank_id,
    b.bank_name,
    cc.transfer_amount,
    cc.nexora_fee,
    cc.swift_fee,
    cc.fee_savings,
    cc.time_savings_hours,
    cc.transfer_date,
    ROUND((cc.fee_savings / cc.swift_fee) * 100, 2) as fee_savings_percentage
FROM cost_comparisons cc
JOIN banks b ON cc.bank_id = b.id
ORDER BY cc.transfer_date DESC;

-- 6. TRIGGERS FOR AUTOMATIC UPDATES
-- Trigger to update daily analytics when new transactions are added

CREATE OR REPLACE FUNCTION update_daily_analytics()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert or update daily analytics record
    INSERT INTO daily_analytics (
        bank_id, 
        date, 
        total_transfers, 
        total_volume, 
        total_fees,
        avg_settlement_time,
        success_rate,
        estimated_swift_fees,
        actual_fees,
        cost_savings
    )
    SELECT 
        tr.logic_id as bank_id, -- Assuming logic_id maps to bank_id
        DATE(tr.timestamp) as date,
        COUNT(*) as total_transfers,
        SUM(tr.amount) as total_volume,
        SUM(tr.amount * 0.001) as total_fees, -- 0.1% fee
        AVG(tr.settlement_time_seconds) as avg_settlement_time,
        (COUNT(CASE WHEN tr.status = 'completed' THEN 1 END) * 100.0 / COUNT(*)) as success_rate,
        SUM(tr.swift_equivalent_fee) as estimated_swift_fees,
        SUM(tr.amount * 0.001) as actual_fees,
        SUM(tr.swift_equivalent_fee - (tr.amount * 0.001)) as cost_savings
    FROM transaction_records tr
    WHERE DATE(tr.timestamp) = DATE(NEW.timestamp)
    GROUP BY tr.logic_id, DATE(tr.timestamp)
    ON CONFLICT (bank_id, date) DO UPDATE SET
        total_transfers = EXCLUDED.total_transfers,
        total_volume = EXCLUDED.total_volume,
        total_fees = EXCLUDED.total_fees,
        avg_settlement_time = EXCLUDED.avg_settlement_time,
        success_rate = EXCLUDED.success_rate,
        estimated_swift_fees = EXCLUDED.estimated_swift_fees,
        actual_fees = EXCLUDED.actual_fees,
        cost_savings = EXCLUDED.cost_savings,
        updated_at = CURRENT_TIMESTAMP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on transaction_records table
CREATE TRIGGER trigger_update_daily_analytics
    AFTER INSERT OR UPDATE ON transaction_records
    FOR EACH ROW
    EXECUTE FUNCTION update_daily_analytics();

-- 7. SAMPLE DATA INSERTION (Optional)
-- Insert sample analytics data for testing

INSERT INTO daily_analytics (bank_id, date, total_transfers, total_volume, total_fees, avg_settlement_time, success_rate, estimated_swift_fees, actual_fees, cost_savings)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', CURRENT_DATE - INTERVAL '1 day', 150, 2500000.00, 2500.00, 30.5, 98.5, 12500.00, 2500.00, 10000.00),
    ('550e8400-e29b-41d4-a716-446655440000', CURRENT_DATE - INTERVAL '2 days', 120, 1800000.00, 1800.00, 29.8, 99.2, 9000.00, 1800.00, 7200.00),
    ('550e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '1 day', 200, 3500000.00, 3500.00, 31.2, 97.8, 17500.00, 3500.00, 14000.00)
ON CONFLICT (bank_id, date) DO NOTHING;

-- 8. COMMENTS AND DOCUMENTATION
COMMENT ON TABLE daily_analytics IS 'Daily performance metrics for each bank including transfer volume, fees, and cost savings';
COMMENT ON TABLE cost_comparisons IS 'Detailed cost analysis comparing Nexora vs SWIFT for each transfer';
COMMENT ON COLUMN daily_analytics.avg_settlement_time IS 'Average settlement time in seconds';
COMMENT ON COLUMN daily_analytics.success_rate IS 'Percentage of successful transfers (0-100)';
COMMENT ON COLUMN cost_comparisons.time_savings_hours IS 'Time saved compared to SWIFT (typically 47.99 hours)';

-- 9. GRANTS AND PERMISSIONS (if using role-based access)
-- Grant appropriate permissions to analytics users
-- GRANT SELECT ON daily_analytics TO analytics_role;
-- GRANT SELECT ON cost_comparisons TO analytics_role;
-- GRANT SELECT ON daily_performance_summary TO analytics_role;
-- GRANT SELECT ON cost_savings_analysis TO analytics_role;

-- ========================================
-- Migration completed successfully
-- ======================================== 