/**
 * AnalyticsController Test Examples
 * Demonstrates how to test the AnalyticsController endpoints
 */

const AnalyticsController = require('./AnalyticsController');

// Mock Express request and response objects
function createMockRequest(params = {}, query = {}, body = {}) {
    return {
        params,
        query,
        body
    };
}

function createMockResponse() {
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    };
    return res;
}

// Test the AnalyticsController
describe('AnalyticsController', () => {
    let analyticsController;
    let mockDb;

    beforeEach(() => {
        // Mock database connection
        mockDb = {
            get: jest.fn(),
            all: jest.fn(),
            run: jest.fn()
        };

        // Mock the database connection module
        jest.doMock('../../database/connection', () => mockDb);
        
        analyticsController = new AnalyticsController();
    });

    describe('getKPIs', () => {
        it('should return KPIs for valid request', async () => {
            const req = createMockRequest(
                { bankId: '550e8400-e29b-41d4-a716-446655440000' },
                { period: '30d' }
            );
            const res = createMockResponse();

            // Mock the analytics service response
            const mockKPIs = {
                period: '30d',
                kpis: {
                    total_transfers: 150,
                    total_volume: 2500000.00,
                    total_fees: 2500.00,
                    avg_settlement_time: 30.5,
                    success_rate: 98.5,
                    cost_savings: 10000.00,
                    estimated_swift_fees: 12500.00,
                    savings_percentage: '80.00'
                }
            };

            // Mock the analytics service method
            analyticsController.analyticsService.getKPIs = jest.fn().mockResolvedValue(mockKPIs);

            await analyticsController.getKPIs(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockKPIs,
                period: '30d',
                generated_at: expect.any(String)
            });
        });

        it('should return 400 for missing bankId', async () => {
            const req = createMockRequest({}, { period: '30d' });
            const res = createMockResponse();

            await analyticsController.getKPIs(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: 'Bank ID is required',
                message: 'Please provide a valid bank ID in the URL parameters'
            });
        });

        it('should return 400 for invalid period', async () => {
            const req = createMockRequest(
                { bankId: '550e8400-e29b-41d4-a716-446655440000' },
                { period: 'invalid' }
            );
            const res = createMockResponse();

            await analyticsController.getKPIs(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: 'Invalid period parameter',
                message: 'Period must be one of: 7d, 30d, 90d, 1y',
                valid_periods: ['7d', '30d', '90d', '1y']
            });
        });
    });

    describe('getVolumeTrends', () => {
        it('should return volume trends for valid request', async () => {
            const req = createMockRequest(
                { bankId: '550e8400-e29b-41d4-a716-446655440000' },
                { period: '7d' }
            );
            const res = createMockResponse();

            const mockTrends = [
                {
                    date: '2024-01-01',
                    transfers: 25,
                    volume: 500000.00,
                    fees: 500.00,
                    avg_settlement_time: 30.2,
                    success_rate: 98.5
                }
            ];

            analyticsController.analyticsService.getVolumeTrends = jest.fn().mockResolvedValue(mockTrends);

            await analyticsController.getVolumeTrends(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockTrends,
                period: '7d',
                generated_at: expect.any(String)
            });
        });
    });

    describe('getTransferTypes', () => {
        it('should return transfer type distribution for valid request', async () => {
            const req = createMockRequest(
                { bankId: '550e8400-e29b-41d4-a716-446655440000' },
                { period: '90d' }
            );
            const res = createMockResponse();

            const mockDistribution = [
                {
                    transfer_type: 'interbank',
                    count: 100,
                    total_volume: 1500000.00,
                    total_fees: 1500.00,
                    avg_settlement_time: 30.5,
                    percentage: '66.67'
                },
                {
                    transfer_type: 'international',
                    count: 50,
                    total_volume: 1000000.00,
                    total_fees: 1000.00,
                    avg_settlement_time: 35.2,
                    percentage: '33.33'
                }
            ];

            analyticsController.analyticsService.getTransferTypeDistribution = jest.fn().mockResolvedValue(mockDistribution);

            await analyticsController.getTransferTypes(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockDistribution,
                period: '90d',
                generated_at: expect.any(String)
            });
        });
    });

    describe('getNetworkPerformance', () => {
        it('should return network performance metrics for valid request', async () => {
            const req = createMockRequest(
                { bankId: '550e8400-e29b-41d4-a716-446655440000' },
                { period: '30d' }
            );
            const res = createMockResponse();

            const mockPerformance = [
                {
                    network: 'polygon',
                    total_transfers: 80,
                    total_volume: 1200000.00,
                    total_fees: 1200.00,
                    avg_settlement_time: 25.5,
                    success_rate: 99.2,
                    cost_savings: 8000.00
                },
                {
                    network: 'ethereum',
                    total_transfers: 70,
                    total_volume: 1300000.00,
                    total_fees: 1300.00,
                    avg_settlement_time: 35.2,
                    success_rate: 97.8,
                    cost_savings: 7000.00
                }
            ];

            analyticsController.analyticsService.getNetworkPerformance = jest.fn().mockResolvedValue(mockPerformance);

            await analyticsController.getNetworkPerformance(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockPerformance,
                period: '30d',
                generated_at: expect.any(String)
            });
        });
    });

    describe('captureTransferAnalytics', () => {
        it('should capture transfer analytics for valid request', async () => {
            const transferData = {
                transaction_id: 'transfer_12345',
                bank_id: '550e8400-e29b-41d4-a716-446655440000',
                amount: 50000.00,
                network_used: 'polygon',
                settlement_time_seconds: 25,
                transfer_type: 'interbank',
                status: 'completed'
            };

            const req = createMockRequest({}, {}, transferData);
            const res = createMockResponse();

            const mockResult = {
                success: true,
                analytics_captured: {
                    transaction_id: 'transfer_12345',
                    swift_equivalent_fee: 2540.00,
                    nexora_fee: 50.00,
                    fee_savings: 2490.00,
                    time_savings_hours: 47.99
                }
            };

            analyticsController.analyticsService.captureTransferAnalytics = jest.fn().mockResolvedValue(mockResult);

            await analyticsController.captureTransferAnalytics(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockResult,
                message: 'Transfer analytics captured successfully',
                generated_at: expect.any(String)
            });
        });

        it('should return 400 for missing required fields', async () => {
            const req = createMockRequest({}, {}, { amount: 50000.00 });
            const res = createMockResponse();

            await analyticsController.captureTransferAnalytics(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: 'Missing required fields',
                message: 'The following fields are required: transaction_id, bank_id',
                required_fields: ['transaction_id', 'bank_id', 'amount']
            });
        });

        it('should return 400 for invalid amount', async () => {
            const req = createMockRequest({}, {}, {
                transaction_id: 'transfer_12345',
                bank_id: '550e8400-e29b-41d4-a716-446655440000',
                amount: -1000
            });
            const res = createMockResponse();

            await analyticsController.captureTransferAnalytics(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: 'Invalid amount',
                message: 'Amount must be a positive number'
            });
        });
    });

    describe('Error Handling', () => {
        it('should handle database connection errors', async () => {
            const req = createMockRequest(
                { bankId: '550e8400-e29b-41d4-a716-446655440000' },
                { period: '30d' }
            );
            const res = createMockResponse();

            analyticsController.analyticsService.getKPIs = jest.fn().mockRejectedValue(
                new Error('database connection failed')
            );

            await analyticsController.getKPIs(req, res);

            expect(res.status).toHaveBeenCalledWith(503);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: 'Database connection error',
                message: 'Unable to connect to analytics database'
            });
        });

        it('should handle general errors', async () => {
            const req = createMockRequest(
                { bankId: '550e8400-e29b-41d4-a716-446655440000' },
                { period: '30d' }
            );
            const res = createMockResponse();

            analyticsController.analyticsService.getKPIs = jest.fn().mockRejectedValue(
                new Error('Unknown error occurred')
            );

            await analyticsController.getKPIs(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: 'Internal server error',
                message: 'Failed to retrieve KPIs. Please try again later.'
            });
        });
    });
});

// Example usage for manual testing
if (require.main === module) {
    console.log('Running AnalyticsController tests...');
    
    // Example of how to test manually
    const controller = new AnalyticsController();
    
    console.log('AnalyticsController initialized successfully');
    console.log('Available methods:');
    console.log('- getKPIs(req, res)');
    console.log('- getVolumeTrends(req, res)');
    console.log('- getTransferTypes(req, res)');
    console.log('- getNetworkPerformance(req, res)');
    console.log('- getAnalyticsDashboard(req, res)');
    console.log('- getCostSavings(req, res)');
    console.log('- captureTransferAnalytics(req, res)');
} 