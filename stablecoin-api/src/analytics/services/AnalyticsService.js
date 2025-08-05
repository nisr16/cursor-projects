/**
 * AnalyticsService - Handles all analytics calculations for USDC banking system
 * Provides KPI tracking, cost analysis, and performance metrics
 */

class AnalyticsService {
    constructor(db) {
        this.db = db;
        this.SWIFT_WIRE_FEE = 25.00;
        this.SWIFT_CORRESPONDENT_FEE = 15.00;
        this.SWIFT_FX_MARGIN = 0.025; // 2.5%
    }

    /**
     * Converts period strings to JavaScript Date objects
     * @param {string} period - Period string ('7d', '30d', '90d', '1y')
     * @returns {Object} Object with startDate and endDate
     */
    getPeriodFilter(period) {
        const endDate = new Date();
        let startDate;

        switch (period) {
            case '7d':
                startDate = new Date(endDate.getTime() - (7 * 24 * 60 * 60 * 1000));
                break;
            case '30d':
                startDate = new Date(endDate.getTime() - (30 * 24 * 60 * 60 * 1000));
                break;
            case '90d':
                startDate = new Date(endDate.getTime() - (90 * 24 * 60 * 60 * 1000));
                break;
            case '1y':
                startDate = new Date(endDate.getTime() - (365 * 24 * 60 * 60 * 1000));
                break;
            default:
                throw new Error(`Invalid period: ${period}. Must be one of: 7d, 30d, 90d, 1y`);
        }

        return { startDate, endDate };
    }

    /**
     * Calculates SWIFT equivalent cost for a transfer amount
     * @param {number} amount - Transfer amount in USD
     * @returns {number} SWIFT equivalent cost
     */
    calculateSwiftEquivalentCost(amount) {
        const wireFee = this.SWIFT_WIRE_FEE;
        const correspondentFee = this.SWIFT_CORRESPONDENT_FEE;
        const fxMargin = amount * this.SWIFT_FX_MARGIN;
        
        return wireFee + correspondentFee + fxMargin;
    }

    /**
     * Captures analytics when a transfer is created
     * @param {Object} transfer - Transfer object with required fields
     * @returns {Promise<Object>} Analytics capture result
     */
    async captureTransferAnalytics(transfer) {
        try {
            const {
                transaction_id,
                bank_id,
                amount,
                network_used = 'nexora',
                settlement_time_seconds = 30,
                transfer_type = 'interbank',
                status = 'pending'
            } = transfer;

            // Calculate SWIFT equivalent cost
            const swiftEquivalentFee = this.calculateSwiftEquivalentCost(amount);
            const nexoraFee = amount * 0.001; // 0.1% fee
            const feeSavings = swiftEquivalentFee - nexoraFee;

            // Insert into cost_comparisons table
            const costComparisonQuery = `
                INSERT INTO cost_comparisons (
                    transaction_id, bank_id, transfer_amount, 
                    nexora_fee, swift_fee, fee_savings,
                    settlement_time_nexora, settlement_time_swift,
                    transfer_date
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT (transaction_id) DO UPDATE SET
                    nexora_fee = EXCLUDED.nexora_fee,
                    swift_fee = EXCLUDED.swift_fee,
                    fee_savings = EXCLUDED.fee_savings,
                    transfer_date = CURRENT_TIMESTAMP
            `;

            await this.db.run(costComparisonQuery, [
                transaction_id,
                bank_id,
                amount,
                nexoraFee,
                swiftEquivalentFee,
                feeSavings,
                settlement_time_seconds,
                172800, // 48 hours in seconds
                new Date()
            ]);

            // Update transaction_records with analytics data
            const updateTransactionQuery = `
                UPDATE transaction_records 
                SET network_used = ?, settlement_time_seconds = ?, 
                    transfer_type = ?, swift_equivalent_fee = ?
                WHERE transaction_id = ?
            `;

            await this.db.run(updateTransactionQuery, [
                network_used,
                settlement_time_seconds,
                transfer_type,
                swiftEquivalentFee,
                transaction_id
            ]);

            return {
                success: true,
                analytics_captured: {
                    transaction_id,
                    swift_equivalent_fee: swiftEquivalentFee,
                    nexora_fee: nexoraFee,
                    fee_savings: feeSavings,
                    time_savings_hours: 47.99 // 48 hours - 30 seconds
                }
            };

        } catch (error) {
            console.error('Error capturing transfer analytics:', error);
            throw new Error(`Failed to capture transfer analytics: ${error.message}`);
        }
    }

    /**
     * Gets KPIs for a bank over a specified period
     * @param {string} bankId - Bank ID
     * @param {string} period - Period string ('7d', '30d', '90d', '1y')
     * @returns {Promise<Object>} KPI data
     */
    async getKPIs(bankId, period) {
        try {
            const { startDate, endDate } = this.getPeriodFilter(period);

            const kpiQuery = `
                SELECT 
                    COUNT(*) as total_transfers,
                    COALESCE(SUM(amount), 0) as total_volume,
                    COALESCE(SUM(amount * 0.001), 0) as total_fees,
                    COALESCE(AVG(settlement_time_seconds), 0) as avg_settlement_time,
                    COALESCE(
                        (COUNT(CASE WHEN status = 'completed' THEN 1 END) * 100.0 / COUNT(*)), 
                        0
                    ) as success_rate,
                    COALESCE(SUM(swift_equivalent_fee - (amount * 0.001)), 0) as cost_savings,
                    COALESCE(SUM(swift_equivalent_fee), 0) as estimated_swift_fees
                FROM transaction_records tr
                WHERE tr.logic_id = ? 
                AND tr.timestamp BETWEEN ? AND ?
            `;

            const result = await this.db.get(kpiQuery, [bankId, startDate.toISOString(), endDate.toISOString()]);

            return {
                period,
                start_date: startDate,
                end_date: endDate,
                kpis: {
                    total_transfers: result.total_transfers || 0,
                    total_volume: parseFloat(result.total_volume || 0),
                    total_fees: parseFloat(result.total_fees || 0),
                    avg_settlement_time: parseFloat(result.avg_settlement_time || 0),
                    success_rate: parseFloat(result.success_rate || 0),
                    cost_savings: parseFloat(result.cost_savings || 0),
                    estimated_swift_fees: parseFloat(result.estimated_swift_fees || 0),
                    savings_percentage: result.estimated_swift_fees > 0 
                        ? ((result.cost_savings / result.estimated_swift_fees) * 100).toFixed(2)
                        : 0
                }
            };

        } catch (error) {
            console.error('Error getting KPIs:', error);
            throw new Error(`Failed to get KPIs: ${error.message}`);
        }
    }

    /**
     * Gets volume trends for charting
     * @param {string} bankId - Bank ID
     * @param {string} period - Period string
     * @returns {Promise<Array>} Daily volume and fee trends
     */
    async getVolumeTrends(bankId, period) {
        try {
            const { startDate, endDate } = this.getPeriodFilter(period);

            const trendsQuery = `
                SELECT 
                    DATE(tr.timestamp) as date,
                    COUNT(*) as daily_transfers,
                    COALESCE(SUM(tr.amount), 0) as daily_volume,
                    COALESCE(SUM(tr.amount * 0.001), 0) as daily_fees,
                    COALESCE(AVG(tr.settlement_time_seconds), 0) as avg_settlement_time,
                    COALESCE(
                        (COUNT(CASE WHEN tr.status = 'completed' THEN 1 END) * 100.0 / COUNT(*)), 
                        0
                    ) as daily_success_rate
                FROM transaction_records tr
                WHERE tr.logic_id = ? 
                AND tr.timestamp BETWEEN ? AND ?
                GROUP BY DATE(tr.timestamp)
                ORDER BY date ASC
            `;

            const results = await this.db.all(trendsQuery, [bankId, startDate.toISOString(), endDate.toISOString()]);

            return results.map(row => ({
                date: row.date,
                transfers: row.daily_transfers,
                volume: parseFloat(row.daily_volume || 0),
                fees: parseFloat(row.daily_fees || 0),
                avg_settlement_time: parseFloat(row.avg_settlement_time || 0),
                success_rate: parseFloat(row.daily_success_rate || 0)
            }));

        } catch (error) {
            console.error('Error getting volume trends:', error);
            throw new Error(`Failed to get volume trends: ${error.message}`);
        }
    }

    /**
     * Gets transfer type distribution
     * @param {string} bankId - Bank ID
     * @param {string} period - Period string
     * @returns {Promise<Array>} Transfer type breakdown
     */
    async getTransferTypeDistribution(bankId, period) {
        try {
            const { startDate, endDate } = this.getPeriodFilter(period);

            const distributionQuery = `
                SELECT 
                    COALESCE(transfer_type, 'unknown') as transfer_type,
                    COUNT(*) as count,
                    COALESCE(SUM(amount), 0) as total_volume,
                    COALESCE(SUM(amount * 0.001), 0) as total_fees,
                    COALESCE(AVG(settlement_time_seconds), 0) as avg_settlement_time
                FROM transaction_records tr
                WHERE tr.logic_id = ? 
                AND tr.timestamp BETWEEN ? AND ?
                GROUP BY transfer_type
                ORDER BY count DESC
            `;

            const results = await this.db.all(distributionQuery, [bankId, startDate.toISOString(), endDate.toISOString()]);

            return results.map(row => ({
                transfer_type: row.transfer_type,
                count: row.count,
                total_volume: parseFloat(row.total_volume || 0),
                total_fees: parseFloat(row.total_fees || 0),
                avg_settlement_time: parseFloat(row.avg_settlement_time || 0),
                percentage: 0 // Will be calculated below
            }));

        } catch (error) {
            console.error('Error getting transfer type distribution:', error);
            throw new Error(`Failed to get transfer type distribution: ${error.message}`);
        }
    }

    /**
     * Gets network performance metrics
     * @param {string} bankId - Bank ID
     * @param {string} period - Period string
     * @returns {Promise<Array>} Network performance data
     */
    async getNetworkPerformance(bankId, period) {
        try {
            const { startDate, endDate } = this.getPeriodFilter(period);

            const networkQuery = `
                SELECT 
                    COALESCE(network_used, 'unknown') as network,
                    COUNT(*) as total_transfers,
                    COALESCE(SUM(amount), 0) as total_volume,
                    COALESCE(SUM(amount * 0.001), 0) as total_fees,
                    COALESCE(AVG(settlement_time_seconds), 0) as avg_settlement_time,
                    COALESCE(
                        (COUNT(CASE WHEN status = 'completed' THEN 1 END) * 100.0 / COUNT(*)), 
                        0
                    ) as success_rate,
                    COALESCE(SUM(swift_equivalent_fee - (amount * 0.001)), 0) as cost_savings
                FROM transaction_records tr
                WHERE tr.logic_id = ? 
                AND tr.timestamp BETWEEN ? AND ?
                GROUP BY network_used
                ORDER BY total_volume DESC
            `;

            const results = await this.db.all(networkQuery, [bankId, startDate.toISOString(), endDate.toISOString()]);

            return results.map(row => ({
                network: row.network,
                total_transfers: row.total_transfers,
                total_volume: parseFloat(row.total_volume || 0),
                total_fees: parseFloat(row.total_fees || 0),
                avg_settlement_time: parseFloat(row.avg_settlement_time || 0),
                success_rate: parseFloat(row.success_rate || 0),
                cost_savings: parseFloat(row.cost_savings || 0)
            }));

        } catch (error) {
            console.error('Error getting network performance:', error);
            throw new Error(`Failed to get network performance: ${error.message}`);
        }
    }

    /**
     * Gets comprehensive analytics dashboard data
     * @param {string} bankId - Bank ID
     * @param {string} period - Period string
     * @returns {Promise<Object>} Complete analytics dashboard data
     */
    async getAnalyticsDashboard(bankId, period) {
        try {
            const [kpis, volumeTrends, transferDistribution, networkPerformance] = await Promise.all([
                this.getKPIs(bankId, period),
                this.getVolumeTrends(bankId, period),
                this.getTransferTypeDistribution(bankId, period),
                this.getNetworkPerformance(bankId, period)
            ]);

            // Calculate percentages for transfer distribution
            const totalTransfers = transferDistribution.reduce((sum, item) => sum + item.count, 0);
            transferDistribution.forEach(item => {
                item.percentage = totalTransfers > 0 ? ((item.count / totalTransfers) * 100).toFixed(2) : 0;
            });

            return {
                period,
                kpis: kpis.kpis,
                volume_trends: volumeTrends,
                transfer_distribution: transferDistribution,
                network_performance: networkPerformance,
                generated_at: new Date().toISOString()
            };

        } catch (error) {
            console.error('Error getting analytics dashboard:', error);
            throw new Error(`Failed to get analytics dashboard: ${error.message}`);
        }
    }

    /**
     * Gets cost savings analysis
     * @param {string} bankId - Bank ID
     * @param {string} period - Period string
     * @returns {Promise<Object>} Cost savings analysis
     */
    async getCostSavingsAnalysis(bankId, period) {
        try {
            const { startDate, endDate } = this.getPeriodFilter(period);

            const savingsQuery = `
                SELECT 
                    COUNT(*) as total_transfers,
                    COALESCE(SUM(transfer_amount), 0) as total_volume,
                    COALESCE(SUM(nexora_fee), 0) as total_nexora_fees,
                    COALESCE(SUM(swift_fee), 0) as total_swift_fees,
                    COALESCE(SUM(fee_savings), 0) as total_savings,
                    COALESCE(AVG(time_savings_hours), 0) as avg_time_savings,
                    COALESCE(SUM(settlement_time_nexora), 0) as total_nexora_time,
                    COALESCE(SUM(settlement_time_swift), 0) as total_swift_time
                FROM cost_comparisons cc
                WHERE cc.bank_id = ? 
                AND cc.transfer_date BETWEEN ? AND ?
            `;

            const result = await this.db.get(savingsQuery, [bankId, startDate.toISOString(), endDate.toISOString()]);

            const totalNexoraTime = result.total_nexora_time || 0;
            const totalSwiftTime = result.total_swift_time || 0;
            const timeSavingsHours = (totalSwiftTime - totalNexoraTime) / 3600; // Convert seconds to hours

            return {
                period,
                analysis: {
                    total_transfers: result.total_transfers || 0,
                    total_volume: parseFloat(result.total_volume || 0),
                    total_nexora_fees: parseFloat(result.total_nexora_fees || 0),
                    total_swift_fees: parseFloat(result.total_swift_fees || 0),
                    total_savings: parseFloat(result.total_savings || 0),
                    avg_time_savings: parseFloat(result.avg_time_savings || 0),
                    total_time_savings_hours: timeSavingsHours,
                    savings_percentage: result.total_swift_fees > 0 
                        ? ((result.total_savings / result.total_swift_fees) * 100).toFixed(2)
                        : 0
                }
            };

        } catch (error) {
            console.error('Error getting cost savings analysis:', error);
            throw new Error(`Failed to get cost savings analysis: ${error.message}`);
        }
    }
}

module.exports = AnalyticsService; 