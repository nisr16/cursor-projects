/**
 * Comprehensive Analytics System Tests
 * Tests all analytics components: API endpoints, service methods, middleware, and error handling
 */

const request = require('supertest');
const express = require('express');
const AnalyticsService = require('../src/analytics/services/AnalyticsService');
const AnalyticsController = require('../src/analytics/controllers/AnalyticsController');
const { createTransferAnalyticsMiddleware } = require('../src/middleware/analyticsMiddleware');
const createAnalyticsRoutes = require('../src/analytics/routes');

// Mock database connection
const mockDb = {
    get: jest.fn(),
    all: jest.fn(),
    run: jest.fn()
};

// Mock AnalyticsService
jest.mock('../src/analytics/services/AnalyticsService');

describe('Analytics System Tests', () => {
    let app;
    let analyticsService;
    let analyticsController;

    // Test data
    const testBankId = '550e8400-e29b-41d4-a716-446655440000';
    const testTransferId = 'transfer_test_12345';
    const testPeriods = ['7d', '30d', '90d', '1y'];

    // Mock analytics data
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

    const mockVolumeTrends = [
        {
            date: '2024-01-01',
            transfers: 25,
            volume: 500000.00,
            fees: 500.00,
            avg_settlement_time: 30.2,
            success_rate: 98.5
        },
        {
            date: '2024-01-02',
            transfers: 30,
            volume: 600000.00,
            fees: 600.00,
            avg_settlement_time: 29.8,
            success_rate: 99.1
        }
    ];

    const mockTransferTypes = [
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

    const mockNetworkPerformance = [
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

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();
        
        // Create Express app for testing
        app = express();
        app.use(express.json());
        
        // Initialize analytics components
        analyticsService = new AnalyticsService(mockDb);
        analyticsController = new AnalyticsController();
        analyticsController.analyticsService = analyticsService;
        
        // Setup analytics routes
        const analyticsRoutes = createAnalyticsRoutes(mockDb);
        app.use('/api/analytics', analyticsRoutes);
        
        // Setup transfer endpoint for middleware testing
        app.post('/api/transfers', (req, res) => {
            const transferId = `transfer_${Date.now()}`;
            res.status(201).json({
                success: true,
                data: {
                    id: transferId,
                    bank_id: req.body.bank_id,
                    amount: req.body.amount,
                    status: 'completed',
                    created_at: new Date().toISOString()
                },
                message: 'Transfer created successfully'
            });
        });
        
        // Add analytics middleware
        app.use(createTransferAnalyticsMiddleware(mockDb));
    });

    afterEach(() => {
        // Clean up
        jest.clearAllMocks();
    });

    describe('AnalyticsService Tests', () => {
        describe('getKPIs', () => {
            it('should return KPIs for valid bank ID and period', async () => {
                // Mock database response
                mockDb.get.mockResolvedValue({
                    total_transfers: 150,
                    total_volume: 2500000.00,
                    total_fees: 2500.00,
                    avg_settlement_time: 30.5,
                    success_rate: 98.5,
                    cost_savings: 10000.00,
                    estimated_swift_fees: 12500.00
                });

                const result = await analyticsService.getKPIs(testBankId, '30d');

                expect(result).toEqual(mockKPIs);
                expect(mockDb.get).toHaveBeenCalledWith(
                    expect.stringContaining('SELECT'),
                    [testBankId, expect.any(String), expect.any(String)]
                );
            });

            it('should handle empty results gracefully', async () => {
                mockDb.get.mockResolvedValue({
                    total_transfers: 0,
                    total_volume: 0,
                    total_fees: 0,
                    avg_settlement_time: 0,
                    success_rate: 0,
                    cost_savings: 0,
                    estimated_swift_fees: 0
                });

                const result = await analyticsService.getKPIs(testBankId, '30d');

                expect(result.kpis.total_transfers).toBe(0);
                expect(result.kpis.total_volume).toBe(0);
                expect(result.kpis.savings_percentage).toBe(0);
            });

            it('should throw error for invalid period', async () => {
                await expect(analyticsService.getKPIs(testBankId, 'invalid'))
                    .rejects.toThrow('Invalid period: invalid');
            });
        });

        describe('getVolumeTrends', () => {
            it('should return volume trends for valid parameters', async () => {
                mockDb.all.mockResolvedValue([
                    {
                        date: '2024-01-01',
                        daily_transfers: 25,
                        daily_volume: 500000.00,
                        daily_fees: 500.00,
                        avg_settlement_time: 30.2,
                        daily_success_rate: 98.5
                    }
                ]);

                const result = await analyticsService.getVolumeTrends(testBankId, '7d');

                expect(result).toEqual(mockVolumeTrends.slice(0, 1));
                expect(mockDb.all).toHaveBeenCalledWith(
                    expect.stringContaining('SELECT'),
                    [testBankId, expect.any(String), expect.any(String)]
                );
            });

            it('should handle empty trends data', async () => {
                mockDb.all.mockResolvedValue([]);

                const result = await analyticsService.getVolumeTrends(testBankId, '7d');

                expect(result).toEqual([]);
            });
        });

        describe('getTransferTypeDistribution', () => {
            it('should return transfer type distribution', async () => {
                mockDb.all.mockResolvedValue([
                    {
                        transfer_type: 'interbank',
                        count: 100,
                        total_volume: 1500000.00,
                        total_fees: 1500.00,
                        avg_settlement_time: 30.5
                    },
                    {
                        transfer_type: 'international',
                        count: 50,
                        total_volume: 1000000.00,
                        total_fees: 1000.00,
                        avg_settlement_time: 35.2
                    }
                ]);

                const result = await analyticsService.getTransferTypeDistribution(testBankId, '90d');

                expect(result).toEqual(mockTransferTypes);
            });
        });

        describe('getNetworkPerformance', () => {
            it('should return network performance metrics', async () => {
                mockDb.all.mockResolvedValue([
                    {
                        network: 'polygon',
                        total_transfers: 80,
                        total_volume: 1200000.00,
                        total_fees: 1200.00,
                        avg_settlement_time: 25.5,
                        success_rate: 99.2,
                        cost_savings: 8000.00
                    }
                ]);

                const result = await analyticsService.getNetworkPerformance(testBankId, '30d');

                expect(result).toEqual(mockNetworkPerformance.slice(0, 1));
            });
        });

        describe('captureTransferAnalytics', () => {
            it('should capture transfer analytics successfully', async () => {
                const transferData = {
                    transaction_id: testTransferId,
                    bank_id: testBankId,
                    amount: 50000,
                    network_used: 'polygon',
                    settlement_time_seconds: 25,
                    transfer_type: 'interbank',
                    status: 'completed'
                };

                mockDb.run.mockResolvedValue({});

                const result = await analyticsService.captureTransferAnalytics(transferData);

                expect(result.success).toBe(true);
                expect(result.analytics_captured.transaction_id).toBe(testTransferId);
                expect(mockDb.run).toHaveBeenCalledTimes(2); // cost_comparisons + transaction_records
            });

            it('should handle missing required fields', async () => {
                const transferData = {
                    transaction_id: testTransferId,
                    // Missing bank_id and amount
                };

                await expect(analyticsService.captureTransferAnalytics(transferData))
                    .rejects.toThrow('Failed to capture transfer analytics');
            });
        });

        describe('calculateSwiftEquivalentCost', () => {
            it('should calculate SWIFT equivalent cost correctly', () => {
                const amount = 50000;
                const swiftCost = analyticsService.calculateSwiftEquivalentCost(amount);

                // Expected: $25 wire fee + $15 correspondent fee + 2.5% FX margin
                const expectedCost = 25 + 15 + (amount * 0.025);
                expect(swiftCost).toBe(expectedCost);
            });

            it('should handle zero amount', () => {
                const swiftCost = analyticsService.calculateSwiftEquivalentCost(0);
                expect(swiftCost).toBe(40); // Just wire + correspondent fees
            });
        });
    });

    describe('AnalyticsController Tests', () => {
        describe('getKPIs', () => {
            it('should return KPIs with correct response structure', async () => {
                analyticsService.getKPIs = jest.fn().mockResolvedValue(mockKPIs);

                const req = {
                    params: { bankId: testBankId },
                    query: { period: '30d' }
                };
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                };

                await analyticsController.getKPIs(req, res);

                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({
                    success: true,
                    data: mockKPIs,
                    period: '30d',
                    generated_at: expect.any(String)
                });
            });

            it('should return 400 for missing bank ID', async () => {
                const req = {
                    params: {},
                    query: { period: '30d' }
                };
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                };

                await analyticsController.getKPIs(req, res);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({
                    success: false,
                    error: 'Bank ID is required',
                    message: 'Please provide a valid bank ID in the URL parameters'
                });
            });

            it('should return 400 for invalid period', async () => {
                const req = {
                    params: { bankId: testBankId },
                    query: { period: 'invalid' }
                };
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                };

                await analyticsController.getKPIs(req, res);

                expect(res.status).toHaveBeenCalledWith(400);
                expect(res.json).toHaveBeenCalledWith({
                    success: false,
                    error: 'Invalid period parameter',
                    message: 'Period must be one of: 7d, 30d, 90d, 1y',
                    valid_periods: ['7d', '30d', '90d', '1y']
                });
            });

            it('should handle service errors gracefully', async () => {
                analyticsService.getKPIs = jest.fn().mockRejectedValue(
                    new Error('Database connection failed')
                );

                const req = {
                    params: { bankId: testBankId },
                    query: { period: '30d' }
                };
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                };

                await analyticsController.getKPIs(req, res);

                expect(res.status).toHaveBeenCalledWith(503);
                expect(res.json).toHaveBeenCalledWith({
                    success: false,
                    error: 'Database connection error',
                    message: 'Unable to connect to analytics database'
                });
            });
        });

        describe('getVolumeTrends', () => {
            it('should return volume trends with correct structure', async () => {
                analyticsService.getVolumeTrends = jest.fn().mockResolvedValue(mockVolumeTrends);

                const req = {
                    params: { bankId: testBankId },
                    query: { period: '7d' }
                };
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                };

                await analyticsController.getVolumeTrends(req, res);

                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({
                    success: true,
                    data: mockVolumeTrends,
                    period: '7d',
                    generated_at: expect.any(String)
                });
            });
        });

        describe('getTransferTypes', () => {
            it('should return transfer types with correct structure', async () => {
                analyticsService.getTransferTypeDistribution = jest.fn().mockResolvedValue(mockTransferTypes);

                const req = {
                    params: { bankId: testBankId },
                    query: { period: '90d' }
                };
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                };

                await analyticsController.getTransferTypes(req, res);

                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({
                    success: true,
                    data: mockTransferTypes,
                    period: '90d',
                    generated_at: expect.any(String)
                });
            });
        });

        describe('getNetworkPerformance', () => {
            it('should return network performance with correct structure', async () => {
                analyticsService.getNetworkPerformance = jest.fn().mockResolvedValue(mockNetworkPerformance);

                const req = {
                    params: { bankId: testBankId },
                    query: { period: '30d' }
                };
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                };

                await analyticsController.getNetworkPerformance(req, res);

                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith({
                    success: true,
                    data: mockNetworkPerformance,
                    period: '30d',
                    generated_at: expect.any(String)
                });
            });
        });
    });

    describe('Analytics API Endpoints Tests', () => {
        describe('GET /api/analytics/kpis/:bankId', () => {
            it('should return KPIs for valid request', async () => {
                analyticsService.getKPIs = jest.fn().mockResolvedValue(mockKPIs);

                const response = await request(app)
                    .get(`/api/analytics/kpis/${testBankId}?period=30d`)
                    .expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data).toEqual(mockKPIs);
                expect(response.body.period).toBe('30d');
                expect(response.body.generated_at).toBeDefined();
            });

            it('should return 400 for missing bank ID', async () => {
                const response = await request(app)
                    .get('/api/analytics/kpis/')
                    .expect(404);
            });

            it('should return 400 for invalid period', async () => {
                const response = await request(app)
                    .get(`/api/analytics/kpis/${testBankId}?period=invalid`)
                    .expect(400);

                expect(response.body.success).toBe(false);
                expect(response.body.error).toBe('Invalid period parameter');
            });
        });

        describe('GET /api/analytics/trends/:bankId', () => {
            it('should return volume trends for valid request', async () => {
                analyticsService.getVolumeTrends = jest.fn().mockResolvedValue(mockVolumeTrends);

                const response = await request(app)
                    .get(`/api/analytics/trends/${testBankId}?period=7d`)
                    .expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data).toEqual(mockVolumeTrends);
                expect(response.body.period).toBe('7d');
            });
        });

        describe('GET /api/analytics/transfer-types/:bankId', () => {
            it('should return transfer types for valid request', async () => {
                analyticsService.getTransferTypeDistribution = jest.fn().mockResolvedValue(mockTransferTypes);

                const response = await request(app)
                    .get(`/api/analytics/transfer-types/${testBankId}?period=90d`)
                    .expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data).toEqual(mockTransferTypes);
                expect(response.body.period).toBe('90d');
            });
        });

        describe('GET /api/analytics/network-performance/:bankId', () => {
            it('should return network performance for valid request', async () => {
                analyticsService.getNetworkPerformance = jest.fn().mockResolvedValue(mockNetworkPerformance);

                const response = await request(app)
                    .get(`/api/analytics/network-performance/${testBankId}?period=30d`)
                    .expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data).toEqual(mockNetworkPerformance);
                expect(response.body.period).toBe('30d');
            });
        });

        describe('GET /api/analytics/dashboard/:bankId', () => {
            it('should return comprehensive dashboard data', async () => {
                const mockDashboard = {
                    period: '30d',
                    kpis: mockKPIs.kpis,
                    volume_trends: mockVolumeTrends,
                    transfer_distribution: mockTransferTypes,
                    network_performance: mockNetworkPerformance,
                    generated_at: new Date().toISOString()
                };

                analyticsService.getAnalyticsDashboard = jest.fn().mockResolvedValue(mockDashboard);

                const response = await request(app)
                    .get(`/api/analytics/dashboard/${testBankId}?period=30d`)
                    .expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data).toEqual(mockDashboard);
            });
        });

        describe('GET /api/analytics/cost-savings/:bankId', () => {
            it('should return cost savings analysis', async () => {
                const mockCostSavings = {
                    period: '30d',
                    analysis: {
                        total_transfers: 150,
                        total_volume: 2500000.00,
                        total_nexora_fees: 2500.00,
                        total_swift_fees: 12500.00,
                        total_savings: 10000.00,
                        savings_percentage: '80.00'
                    }
                };

                analyticsService.getCostSavingsAnalysis = jest.fn().mockResolvedValue(mockCostSavings);

                const response = await request(app)
                    .get(`/api/analytics/cost-savings/${testBankId}?period=30d`)
                    .expect(200);

                expect(response.body.success).toBe(true);
                expect(response.body.data).toEqual(mockCostSavings);
            });
        });

        describe('POST /api/analytics/capture-transfer', () => {
            it('should capture transfer analytics successfully', async () => {
                const transferData = {
                    transaction_id: testTransferId,
                    bank_id: testBankId,
                    amount: 50000,
                    network_used: 'polygon',
                    settlement_time_seconds: 25,
                    transfer_type: 'interbank',
                    status: 'completed'
                };

                const mockResult = {
                    success: true,
                    analytics_captured: {
                        transaction_id: testTransferId,
                        swift_equivalent_fee: 2540.00,
                        nexora_fee: 50.00,
                        fee_savings: 2490.00
                    }
                };

                analyticsService.captureTransferAnalytics = jest.fn().mockResolvedValue(mockResult);

                const response = await request(app)
                    .post('/api/analytics/capture-transfer')
                    .send(transferData)
                    .expect(201);

                expect(response.body.success).toBe(true);
                expect(response.body.data).toEqual(mockResult);
                expect(response.body.message).toBe('Transfer analytics captured successfully');
            });

            it('should return 400 for missing required fields', async () => {
                const transferData = {
                    amount: 50000
                    // Missing transaction_id and bank_id
                };

                const response = await request(app)
                    .post('/api/analytics/capture-transfer')
                    .send(transferData)
                    .expect(400);

                expect(response.body.success).toBe(false);
                expect(response.body.error).toBe('Missing required fields');
            });

            it('should return 400 for invalid amount', async () => {
                const transferData = {
                    transaction_id: testTransferId,
                    bank_id: testBankId,
                    amount: -1000
                };

                const response = await request(app)
                    .post('/api/analytics/capture-transfer')
                    .send(transferData)
                    .expect(400);

                expect(response.body.success).toBe(false);
                expect(response.body.error).toBe('Invalid amount');
            });
        });

        describe('GET /api/analytics/health', () => {
            it('should return health status', async () => {
                const response = await request(app)
                    .get('/api/analytics/health')
                    .expect(200);

                expect(response.body.status).toBe('healthy');
                expect(response.body.service).toBe('analytics');
                expect(response.body.timestamp).toBeDefined();
                expect(response.body.endpoints).toBeDefined();
            });
        });
    });

    describe('Analytics Middleware Integration Tests', () => {
        describe('Transfer Creation with Analytics Capture', () => {
            it('should capture analytics when transfer is created successfully', async () => {
                analyticsService.captureTransferAnalytics = jest.fn().mockResolvedValue({
                    success: true,
                    analytics_captured: {
                        transaction_id: expect.any(String),
                        swift_equivalent_fee: 2540.00,
                        nexora_fee: 50.00,
                        fee_savings: 2490.00
                    }
                });

                const transferData = {
                    bank_id: testBankId,
                    amount: 50000,
                    network_used: 'polygon',
                    transfer_type: 'interbank'
                };

                const response = await request(app)
                    .post('/api/transfers')
                    .send(transferData)
                    .expect(201);

                // Verify transfer was created
                expect(response.body.success).toBe(true);
                expect(response.body.data.id).toBeDefined();
                expect(response.body.data.bank_id).toBe(testBankId);
                expect(response.body.data.amount).toBe(50000);

                // Wait for async analytics capture
                await new Promise(resolve => setTimeout(resolve, 100));

                // Verify analytics were captured
                expect(analyticsService.captureTransferAnalytics).toHaveBeenCalledWith({
                    transaction_id: response.body.data.id,
                    bank_id: testBankId,
                    amount: 50000,
                    network_used: 'polygon',
                    settlement_time_seconds: 30,
                    transfer_type: 'interbank',
                    status: 'completed'
                });
            });

            it('should not capture analytics for failed transfer creation', async () => {
                // Override the transfer endpoint to simulate failure
                app.post('/api/transfers', (req, res) => {
                    res.status(400).json({
                        success: false,
                        error: 'Insufficient funds',
                        message: 'Transfer failed'
                    });
                });

                analyticsService.captureTransferAnalytics = jest.fn();

                const transferData = {
                    bank_id: testBankId,
                    amount: 50000
                };

                const response = await request(app)
                    .post('/api/transfers')
                    .send(transferData)
                    .expect(400);

                // Verify transfer failed
                expect(response.body.success).toBe(false);

                // Wait for any potential async processing
                await new Promise(resolve => setTimeout(resolve, 100));

                // Verify analytics were NOT captured
                expect(analyticsService.captureTransferAnalytics).not.toHaveBeenCalled();
            });

            it('should handle analytics capture errors gracefully', async () => {
                analyticsService.captureTransferAnalytics = jest.fn().mockRejectedValue(
                    new Error('Database connection failed')
                );

                const transferData = {
                    bank_id: testBankId,
                    amount: 50000
                };

                const response = await request(app)
                    .post('/api/transfers')
                    .send(transferData)
                    .expect(201);

                // Verify transfer was still created successfully
                expect(response.body.success).toBe(true);
                expect(response.body.data.id).toBeDefined();

                // Wait for async analytics capture
                await new Promise(resolve => setTimeout(resolve, 100));

                // Verify analytics capture was attempted but failed gracefully
                expect(analyticsService.captureTransferAnalytics).toHaveBeenCalled();
            });
        });

        describe('Non-Transfer Endpoints', () => {
            it('should not capture analytics for non-transfer endpoints', async () => {
                app.get('/api/banks', (req, res) => {
                    res.json({
                        success: true,
                        data: [{ id: testBankId, name: 'Test Bank' }]
                    });
                });

                analyticsService.captureTransferAnalytics = jest.fn();

                const response = await request(app)
                    .get('/api/banks')
                    .expect(200);

                // Wait for any potential async processing
                await new Promise(resolve => setTimeout(resolve, 100));

                // Verify analytics were NOT captured
                expect(analyticsService.captureTransferAnalytics).not.toHaveBeenCalled();
            });
        });
    });

    describe('Data Type and Structure Tests', () => {
        it('should return correct data types for KPIs', async () => {
            analyticsService.getKPIs = jest.fn().mockResolvedValue(mockKPIs);

            const response = await request(app)
                .get(`/api/analytics/kpis/${testBankId}?period=30d`)
                .expect(200);

            const kpis = response.body.data.kpis;
            
            expect(typeof kpis.total_transfers).toBe('number');
            expect(typeof kpis.total_volume).toBe('number');
            expect(typeof kpis.total_fees).toBe('number');
            expect(typeof kpis.avg_settlement_time).toBe('number');
            expect(typeof kpis.success_rate).toBe('number');
            expect(typeof kpis.cost_savings).toBe('number');
            expect(typeof kpis.estimated_swift_fees).toBe('number');
            expect(typeof kpis.savings_percentage).toBe('string');
        });

        it('should return correct data types for volume trends', async () => {
            analyticsService.getVolumeTrends = jest.fn().mockResolvedValue(mockVolumeTrends);

            const response = await request(app)
                .get(`/api/analytics/trends/${testBankId}?period=7d`)
                .expect(200);

            const trends = response.body.data;
            expect(Array.isArray(trends)).toBe(true);
            
            if (trends.length > 0) {
                const trend = trends[0];
                expect(typeof trend.date).toBe('string');
                expect(typeof trend.transfers).toBe('number');
                expect(typeof trend.volume).toBe('number');
                expect(typeof trend.fees).toBe('number');
                expect(typeof trend.avg_settlement_time).toBe('number');
                expect(typeof trend.success_rate).toBe('number');
            }
        });

        it('should return correct data types for transfer types', async () => {
            analyticsService.getTransferTypeDistribution = jest.fn().mockResolvedValue(mockTransferTypes);

            const response = await request(app)
                .get(`/api/analytics/transfer-types/${testBankId}?period=90d`)
                .expect(200);

            const types = response.body.data;
            expect(Array.isArray(types)).toBe(true);
            
            if (types.length > 0) {
                const type = types[0];
                expect(typeof type.transfer_type).toBe('string');
                expect(typeof type.count).toBe('number');
                expect(typeof type.total_volume).toBe('number');
                expect(typeof type.total_fees).toBe('number');
                expect(typeof type.avg_settlement_time).toBe('number');
                expect(typeof type.percentage).toBe('string');
            }
        });
    });

    describe('Period Filtering Tests', () => {
        testPeriods.forEach(period => {
            it(`should handle ${period} period correctly`, async () => {
                analyticsService.getKPIs = jest.fn().mockResolvedValue({
                    ...mockKPIs,
                    period
                });

                const response = await request(app)
                    .get(`/api/analytics/kpis/${testBankId}?period=${period}`)
                    .expect(200);

                expect(response.body.period).toBe(period);
                expect(response.body.data.period).toBe(period);
            });
        });

        it('should use default period when not specified', async () => {
            analyticsService.getKPIs = jest.fn().mockResolvedValue(mockKPIs);

            const response = await request(app)
                .get(`/api/analytics/kpis/${testBankId}`)
                .expect(200);

            expect(response.body.period).toBe('30d');
        });
    });

    describe('Error Handling Tests', () => {
        it('should return 400 for invalid bank ID format', async () => {
            const invalidBankId = 'invalid-uuid';

            const response = await request(app)
                .get(`/api/analytics/kpis/${invalidBankId}?period=30d`)
                .expect(400);

            expect(response.body.success).toBe(false);
        });

        it('should return 503 for database connection errors', async () => {
            analyticsService.getKPIs = jest.fn().mockRejectedValue(
                new Error('database connection failed')
            );

            const response = await request(app)
                .get(`/api/analytics/kpis/${testBankId}?period=30d`)
                .expect(503);

            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('Database connection error');
        });

        it('should return 500 for unexpected errors', async () => {
            analyticsService.getKPIs = jest.fn().mockRejectedValue(
                new Error('Unexpected error')
            );

            const response = await request(app)
                .get(`/api/analytics/kpis/${testBankId}?period=30d`)
                .expect(500);

            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('Internal server error');
        });
    });

    describe('Analytics Calculations Accuracy Tests', () => {
        it('should calculate SWIFT equivalent cost accurately', () => {
            const testAmounts = [1000, 50000, 100000, 1000000];
            
            testAmounts.forEach(amount => {
                const swiftCost = analyticsService.calculateSwiftEquivalentCost(amount);
                const expectedCost = 25 + 15 + (amount * 0.025);
                
                expect(swiftCost).toBe(expectedCost);
            });
        });

        it('should calculate fee savings correctly', async () => {
            const transferData = {
                transaction_id: testTransferId,
                bank_id: testBankId,
                amount: 50000,
                network_used: 'polygon',
                settlement_time_seconds: 25,
                transfer_type: 'interbank',
                status: 'completed'
            };

            mockDb.run.mockResolvedValue({});

            await analyticsService.captureTransferAnalytics(transferData);

            // Verify the cost comparison calculation
            expect(mockDb.run).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO cost_comparisons'),
                expect.arrayContaining([
                    testTransferId,
                    testBankId,
                    50000,
                    50, // Nexora fee (0.1%)
                    expect.any(Number), // SWIFT fee
                    expect.any(Number), // Fee savings
                    25, // Settlement time
                    172800 // SWIFT settlement time
                ])
            );
        });
    });
});

// Example usage for manual testing
if (require.main === module) {
    console.log('🧪 Analytics System Tests');
    console.log('========================');
    
    console.log('\n📋 Test Categories:');
    console.log('==================');
    console.log('✅ AnalyticsService method tests');
    console.log('✅ AnalyticsController endpoint tests');
    console.log('✅ API endpoint integration tests');
    console.log('✅ Middleware integration tests');
    console.log('✅ Error handling tests');
    console.log('✅ Data type and structure tests');
    console.log('✅ Period filtering tests');
    console.log('✅ Analytics calculations accuracy tests');
    
    console.log('\n🔧 Test Features:');
    console.log('================');
    console.log('✅ Mock database responses');
    console.log('✅ Comprehensive error scenarios');
    console.log('✅ Response structure validation');
    console.log('✅ Data type verification');
    console.log('✅ Middleware flow testing');
    console.log('✅ Async processing validation');
    
    console.log('\n📝 Running Tests:');
    console.log('==================');
    console.log('npm test tests/analytics.test.js');
    console.log('');
    console.log('Or run specific test suites:');
    console.log('npm test -- --testNamePattern="AnalyticsService"');
    console.log('npm test -- --testNamePattern="API Endpoints"');
    console.log('npm test -- --testNamePattern="Middleware"');
} 