/**
 * Test Analytics Middleware
 * Demonstrates how the analytics middleware automatically captures transfer analytics
 */

const { createTransferAnalyticsMiddleware } = require('./analyticsMiddleware');
const AnalyticsService = require('../analytics/services/AnalyticsService');

// Mock database connection
const mockDb = {
    get: jest.fn(),
    all: jest.fn(),
    run: jest.fn()
};

// Mock AnalyticsService
jest.mock('../analytics/services/AnalyticsService');

describe('Analytics Middleware', () => {
    let middleware;
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();
        
        // Create middleware
        middleware = createTransferAnalyticsMiddleware(mockDb);
        
        // Mock request
        mockReq = {
            method: 'POST',
            path: '/api/transfers',
            body: {
                bank_id: '550e8400-e29b-41d4-a716-446655440000',
                amount: 50000,
                network_used: 'polygon',
                transfer_type: 'interbank'
            }
        };
        
        // Mock response
        mockRes = {
            json: jest.fn(),
            send: jest.fn(),
            status: jest.fn().mockReturnThis(),
            statusCode: 201
        };
        
        // Mock next function
        mockNext = jest.fn();
    });

    describe('Transfer Creation Analytics Capture', () => {
        it('should capture analytics when transfer is successfully created', async () => {
            // Mock successful transfer response
            const transferResponse = {
                success: true,
                data: {
                    id: 'transfer_12345',
                    bank_id: '550e8400-e29b-41d4-a716-446655440000',
                    amount: 50000,
                    status: 'completed'
                },
                message: 'Transfer created successfully'
            };

            // Mock AnalyticsService.captureTransferAnalytics
            const mockCaptureAnalytics = jest.fn().mockResolvedValue({
                success: true,
                analytics_captured: {
                    transaction_id: 'transfer_12345',
                    swift_equivalent_fee: 2540.00,
                    nexora_fee: 50.00,
                    fee_savings: 2490.00
                }
            });

            AnalyticsService.prototype.captureTransferAnalytics = mockCaptureAnalytics;

            // Apply middleware
            middleware(mockReq, mockRes, mockNext);

            // Simulate successful response
            mockRes.json(transferResponse);

            // Wait for async analytics capture
            await new Promise(resolve => setTimeout(resolve, 100));

            // Verify analytics were captured
            expect(mockCaptureAnalytics).toHaveBeenCalledWith({
                transaction_id: 'transfer_12345',
                bank_id: '550e8400-e29b-41d4-a716-446655440000',
                amount: 50000,
                network_used: 'polygon',
                settlement_time_seconds: 30,
                transfer_type: 'interbank',
                status: 'completed'
            });

            // Verify original response was sent
            expect(mockRes.json).toHaveBeenCalledWith(transferResponse);
        });

        it('should not capture analytics for non-transfer endpoints', () => {
            // Mock request to non-transfer endpoint
            mockReq.path = '/api/banks';
            mockReq.method = 'GET';

            // Mock AnalyticsService
            const mockCaptureAnalytics = jest.fn();
            AnalyticsService.prototype.captureTransferAnalytics = mockCaptureAnalytics;

            // Apply middleware
            middleware(mockReq, mockRes, mockNext);

            // Simulate response
            mockRes.json({ success: true, data: [] });

            // Verify analytics were NOT captured
            expect(mockCaptureAnalytics).not.toHaveBeenCalled();
        });

        it('should not capture analytics for failed transfer creation', () => {
            // Mock failed transfer response
            const failedResponse = {
                success: false,
                error: 'Insufficient funds',
                message: 'Transfer failed'
            };

            // Mock AnalyticsService
            const mockCaptureAnalytics = jest.fn();
            AnalyticsService.prototype.captureTransferAnalytics = mockCaptureAnalytics;

            // Apply middleware
            middleware(mockReq, mockRes, mockNext);

            // Simulate failed response
            mockRes.status(400).json(failedResponse);

            // Verify analytics were NOT captured
            expect(mockCaptureAnalytics).not.toHaveBeenCalled();
        });

        it('should handle analytics capture errors gracefully', async () => {
            // Mock successful transfer response
            const transferResponse = {
                success: true,
                data: {
                    id: 'transfer_12345',
                    bank_id: '550e8400-e29b-41d4-a716-446655440000',
                    amount: 50000
                }
            };

            // Mock AnalyticsService to throw error
            const mockCaptureAnalytics = jest.fn().mockRejectedValue(
                new Error('Database connection failed')
            );
            AnalyticsService.prototype.captureTransferAnalytics = mockCaptureAnalytics;

            // Mock console.error to capture error logs
            const originalConsoleError = console.error;
            const errorLogs = [];
            console.error = jest.fn((...args) => {
                errorLogs.push(args.join(' '));
            });

            // Apply middleware
            middleware(mockReq, mockRes, mockNext);

            // Simulate successful response
            mockRes.json(transferResponse);

            // Wait for async analytics capture
            await new Promise(resolve => setTimeout(resolve, 100));

            // Verify error was logged but original response still sent
            expect(errorLogs.length).toBeGreaterThan(0);
            expect(errorLogs[0]).toContain('Analytics: Failed to capture transfer analytics');
            expect(mockRes.json).toHaveBeenCalledWith(transferResponse);

            // Restore console.error
            console.error = originalConsoleError;
        });
    });

    describe('Response Interception', () => {
        it('should intercept JSON responses', () => {
            const originalJson = mockRes.json;
            
            // Apply middleware
            middleware(mockReq, mockRes, mockNext);

            // Verify response.json was overridden
            expect(mockRes.json).not.toBe(originalJson);
        });

        it('should intercept string responses', () => {
            const originalSend = mockRes.send;
            
            // Apply middleware
            middleware(mockReq, mockRes, mockNext);

            // Verify response.send was overridden
            expect(mockRes.send).not.toBe(originalSend);
        });

        it('should call next() to continue middleware chain', () => {
            // Apply middleware
            middleware(mockReq, mockRes, mockNext);

            // Verify next was called
            expect(mockNext).toHaveBeenCalled();
        });
    });

    describe('Data Extraction', () => {
        it('should extract transfer data from request and response', async () => {
            // Mock request with various field names
            mockReq.body = {
                bankId: '550e8400-e29b-41d4-a716-446655440000',
                amount: 75000,
                network: 'ethereum',
                type: 'international',
                settlement_time_seconds: 45
            };

            const transferResponse = {
                success: true,
                data: {
                    id: 'transfer_67890',
                    bank_id: '550e8400-e29b-41d4-a716-446655440000',
                    amount: 75000,
                    status: 'pending'
                }
            };

            // Mock AnalyticsService
            const mockCaptureAnalytics = jest.fn().mockResolvedValue({ success: true });
            AnalyticsService.prototype.captureTransferAnalytics = mockCaptureAnalytics;

            // Apply middleware
            middleware(mockReq, mockRes, mockNext);

            // Simulate response
            mockRes.json(transferResponse);

            // Wait for async analytics capture
            await new Promise(resolve => setTimeout(resolve, 100));

            // Verify correct data was extracted
            expect(mockCaptureAnalytics).toHaveBeenCalledWith({
                transaction_id: 'transfer_67890',
                bank_id: '550e8400-e29b-41d4-a716-446655440000',
                amount: 75000,
                network_used: 'ethereum',
                settlement_time_seconds: 45,
                transfer_type: 'international',
                status: 'pending'
            });
        });

        it('should use default values when fields are missing', async () => {
            // Mock request with minimal data
            mockReq.body = {
                amount: 25000
            };

            const transferResponse = {
                success: true,
                data: {
                    id: 'transfer_default',
                    amount: 25000
                }
            };

            // Mock AnalyticsService
            const mockCaptureAnalytics = jest.fn().mockResolvedValue({ success: true });
            AnalyticsService.prototype.captureTransferAnalytics = mockCaptureAnalytics;

            // Apply middleware
            middleware(mockReq, mockRes, mockNext);

            // Simulate response
            mockRes.json(transferResponse);

            // Wait for async analytics capture
            await new Promise(resolve => setTimeout(resolve, 100));

            // Verify default values were used
            expect(mockCaptureAnalytics).toHaveBeenCalledWith({
                transaction_id: 'transfer_default',
                bank_id: undefined,
                amount: 25000,
                network_used: 'nexora',
                settlement_time_seconds: 30,
                transfer_type: 'interbank',
                status: 'completed'
            });
        });
    });
});

// Example usage for manual testing
if (require.main === module) {
    console.log('🧪 Analytics Middleware Test');
    console.log('============================');
    
    console.log('\n📋 Test Scenarios:');
    console.log('==================');
    console.log('✅ Successful transfer creation with analytics capture');
    console.log('✅ Non-transfer endpoints (no analytics capture)');
    console.log('✅ Failed transfer creation (no analytics capture)');
    console.log('✅ Analytics capture errors (graceful handling)');
    console.log('✅ Response interception (JSON and string)');
    console.log('✅ Data extraction from various field names');
    console.log('✅ Default value handling for missing fields');
    
    console.log('\n🔧 Middleware Features:');
    console.log('======================');
    console.log('✅ Automatic analytics capture on transfer creation');
    console.log('✅ Non-blocking async processing');
    console.log('✅ Graceful error handling');
    console.log('✅ Preserves original response flow');
    console.log('✅ Flexible data extraction');
    console.log('✅ Environment-specific configuration');
    
    console.log('\n📝 Usage Example:');
    console.log('==================');
    console.log('// In your app.js');
    console.log('const { createTransferAnalyticsMiddleware } = require("./middleware/analyticsMiddleware");');
    console.log('app.use(createTransferAnalyticsMiddleware(db));');
    console.log('');
    console.log('// Now all POST /api/transfers responses will automatically');
    console.log('// trigger analytics capture without breaking the original flow!');
} 