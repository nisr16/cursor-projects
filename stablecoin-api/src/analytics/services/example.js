/**
 * AnalyticsService Usage Example
 * Demonstrates how to use the AnalyticsService class for USDC banking analytics
 */

const AnalyticsService = require('./AnalyticsService');
const db = require('../../database/connection');

// Initialize the analytics service
const analyticsService = new AnalyticsService(db);

/**
 * Example: Capture analytics when a transfer is created
 */
async function captureTransferExample() {
    try {
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
        console.log('Analytics captured:', result);
        
        return result;
    } catch (error) {
        console.error('Error capturing transfer analytics:', error);
        throw error;
    }
}

/**
 * Example: Get KPIs for a bank
 */
async function getKPIsExample() {
    try {
        const bankId = '550e8400-e29b-41d4-a716-446655440000';
        const period = '30d';
        
        const kpis = await analyticsService.getKPIs(bankId, period);
        console.log('KPIs for last 30 days:', kpis);
        
        return kpis;
    } catch (error) {
        console.error('Error getting KPIs:', error);
        throw error;
    }
}

/**
 * Example: Get volume trends for charting
 */
async function getVolumeTrendsExample() {
    try {
        const bankId = '550e8400-e29b-41d4-a716-446655440000';
        const period = '7d';
        
        const trends = await analyticsService.getVolumeTrends(bankId, period);
        console.log('Volume trends for last 7 days:', trends);
        
        return trends;
    } catch (error) {
        console.error('Error getting volume trends:', error);
        throw error;
    }
}

/**
 * Example: Get transfer type distribution
 */
async function getTransferDistributionExample() {
    try {
        const bankId = '550e8400-e29b-41d4-a716-446655440000';
        const period = '90d';
        
        const distribution = await analyticsService.getTransferTypeDistribution(bankId, period);
        console.log('Transfer type distribution:', distribution);
        
        return distribution;
    } catch (error) {
        console.error('Error getting transfer distribution:', error);
        throw error;
    }
}

/**
 * Example: Get network performance metrics
 */
async function getNetworkPerformanceExample() {
    try {
        const bankId = '550e8400-e29b-41d4-a716-446655440000';
        const period = '30d';
        
        const performance = await analyticsService.getNetworkPerformance(bankId, period);
        console.log('Network performance:', performance);
        
        return performance;
    } catch (error) {
        console.error('Error getting network performance:', error);
        throw error;
    }
}

/**
 * Example: Get comprehensive analytics dashboard
 */
async function getAnalyticsDashboardExample() {
    try {
        const bankId = '550e8400-e29b-41d4-a716-446655440000';
        const period = '30d';
        
        const dashboard = await analyticsService.getAnalyticsDashboard(bankId, period);
        console.log('Analytics dashboard:', dashboard);
        
        return dashboard;
    } catch (error) {
        console.error('Error getting analytics dashboard:', error);
        throw error;
    }
}

/**
 * Example: Get cost savings analysis
 */
async function getCostSavingsExample() {
    try {
        const bankId = '550e8400-e29b-41d4-a716-446655440000';
        const period = '1y';
        
        const savings = await analyticsService.getCostSavingsAnalysis(bankId, period);
        console.log('Cost savings analysis:', savings);
        
        return savings;
    } catch (error) {
        console.error('Error getting cost savings analysis:', error);
        throw error;
    }
}

/**
 * Example: Calculate SWIFT equivalent cost
 */
function calculateSwiftCostExample() {
    const amount = 100000.00;
    const swiftCost = analyticsService.calculateSwiftEquivalentCost(amount);
    
    console.log(`SWIFT equivalent cost for $${amount}: $${swiftCost.toFixed(2)}`);
    return swiftCost;
}

/**
 * Example: Get period filter
 */
function getPeriodFilterExample() {
    const periods = ['7d', '30d', '90d', '1y'];
    
    periods.forEach(period => {
        const filter = analyticsService.getPeriodFilter(period);
        console.log(`${period} period:`, filter);
    });
}

/**
 * Run all examples
 */
async function runAllExamples() {
    console.log('=== AnalyticsService Examples ===\n');
    
    try {
        // Basic utility functions
        console.log('1. Period Filter Examples:');
        getPeriodFilterExample();
        console.log();
        
        console.log('2. SWIFT Cost Calculation:');
        calculateSwiftCostExample();
        console.log();
        
        // Analytics functions (commented out to avoid database errors in example)
        /*
        console.log('3. Capturing Transfer Analytics:');
        await captureTransferExample();
        console.log();
        
        console.log('4. Getting KPIs:');
        await getKPIsExample();
        console.log();
        
        console.log('5. Getting Volume Trends:');
        await getVolumeTrendsExample();
        console.log();
        
        console.log('6. Getting Transfer Distribution:');
        await getTransferDistributionExample();
        console.log();
        
        console.log('7. Getting Network Performance:');
        await getNetworkPerformanceExample();
        console.log();
        
        console.log('8. Getting Analytics Dashboard:');
        await getAnalyticsDashboardExample();
        console.log();
        
        console.log('9. Getting Cost Savings Analysis:');
        await getCostSavingsExample();
        console.log();
        */
        
        console.log('All examples completed successfully!');
        
    } catch (error) {
        console.error('Error running examples:', error);
    }
}

// Export functions for use in other modules
module.exports = {
    captureTransferExample,
    getKPIsExample,
    getVolumeTrendsExample,
    getTransferDistributionExample,
    getNetworkPerformanceExample,
    getAnalyticsDashboardExample,
    getCostSavingsExample,
    calculateSwiftCostExample,
    getPeriodFilterExample,
    runAllExamples
};

// Run examples if this file is executed directly
if (require.main === module) {
    runAllExamples();
} 