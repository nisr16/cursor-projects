/**
 * Test Setup for Analytics System
 * Configures the testing environment and global test utilities
 */

// Global test utilities
global.testUtils = {
    // Create mock request object
    createMockRequest: (params = {}, query = {}, body = {}) => ({
        params,
        query,
        body,
        method: 'GET',
        path: '/test'
    }),

    // Create mock response object
    createMockResponse: () => ({
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
        statusCode: 200
    }),

    // Create mock database connection
    createMockDb: () => ({
        get: jest.fn(),
        all: jest.fn(),
        run: jest.fn(),
        close: jest.fn()
    }),

    // Test data constants
    testData: {
        bankId: '550e8400-e29b-41d4-a716-446655440000',
        transferId: 'transfer_test_12345',
        periods: ['7d', '30d', '90d', '1y'],
        
        // Mock analytics data
        mockKPIs: {
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
        },
        
        mockVolumeTrends: [
            {
                date: '2024-01-01',
                transfers: 25,
                volume: 500000.00,
                fees: 500.00,
                avg_settlement_time: 30.2,
                success_rate: 98.5
            }
        ],
        
        mockTransferTypes: [
            {
                transfer_type: 'interbank',
                count: 100,
                total_volume: 1500000.00,
                total_fees: 1500.00,
                avg_settlement_time: 30.5,
                percentage: '66.67'
            }
        ],
        
        mockNetworkPerformance: [
            {
                network: 'polygon',
                total_transfers: 80,
                total_volume: 1200000.00,
                total_fees: 1200.00,
                avg_settlement_time: 25.5,
                success_rate: 99.2,
                cost_savings: 8000.00
            }
        ]
    },

    // Helper functions
    helpers: {
        // Wait for async operations
        wait: (ms = 100) => new Promise(resolve => setTimeout(resolve, ms)),
        
        // Create test transfer data
        createTransferData: (overrides = {}) => ({
            transaction_id: 'transfer_test_12345',
            bank_id: '550e8400-e29b-41d4-a716-446655440000',
            amount: 50000,
            network_used: 'polygon',
            settlement_time_seconds: 25,
            transfer_type: 'interbank',
            status: 'completed',
            ...overrides
        }),
        
        // Validate response structure
        validateResponseStructure: (response, expectedKeys = []) => {
            expect(response).toHaveProperty('success');
            expect(typeof response.success).toBe('boolean');
            
            if (response.success) {
                expect(response).toHaveProperty('data');
                expect(response).toHaveProperty('generated_at');
                expect(typeof response.generated_at).toBe('string');
                
                expectedKeys.forEach(key => {
                    expect(response).toHaveProperty(key);
                });
            } else {
                expect(response).toHaveProperty('error');
                expect(response).toHaveProperty('message');
            }
        },
        
        // Validate analytics data types
        validateAnalyticsDataTypes: (data) => {
            if (data.kpis) {
                expect(typeof data.kpis.total_transfers).toBe('number');
                expect(typeof data.kpis.total_volume).toBe('number');
                expect(typeof data.kpis.total_fees).toBe('number');
                expect(typeof data.kpis.avg_settlement_time).toBe('number');
                expect(typeof data.kpis.success_rate).toBe('number');
                expect(typeof data.kpis.cost_savings).toBe('number');
            }
            
            if (Array.isArray(data)) {
                data.forEach(item => {
                    if (item.date) expect(typeof item.date).toBe('string');
                    if (item.transfers) expect(typeof item.transfers).toBe('number');
                    if (item.volume) expect(typeof item.volume).toBe('number');
                    if (item.fees) expect(typeof item.fees).toBe('number');
                });
            }
        }
    }
};

// Global test configuration
global.testConfig = {
    // Test timeouts
    timeouts: {
        short: 1000,
        medium: 5000,
        long: 10000
    },
    
    // Test retries
    retries: {
        network: 3,
        database: 2
    },
    
    // Mock data configuration
    mockData: {
        enableRealisticData: true,
        enableRandomData: false,
        defaultPeriod: '30d'
    }
};

// Global beforeAll setup
beforeAll(() => {
    // Set up global test environment
    process.env.NODE_ENV = 'test';
    process.env.TEST_MODE = 'true';
    
    // Suppress console logs during tests unless explicitly enabled
    if (!process.env.TEST_VERBOSE) {
        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
    }
});

// Global afterAll cleanup
afterAll(() => {
    // Restore console methods
    jest.restoreAllMocks();
});

// Global beforeEach setup
beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Reset test data
    global.testUtils.testData = {
        ...global.testUtils.testData
    };
});

// Global afterEach cleanup
afterEach(() => {
    // Clean up any remaining timers
    jest.clearAllTimers();
});

// Custom matchers for analytics testing
expect.extend({
    // Check if response has correct analytics structure
    toHaveAnalyticsStructure(received) {
        const pass = received &&
                    typeof received === 'object' &&
                    'success' in received &&
                    'data' in received &&
                    'generated_at' in received;
        
        return {
            pass,
            message: () => 
                pass
                    ? `Expected response not to have analytics structure`
                    : `Expected response to have analytics structure with success, data, and generated_at properties`
        };
    },
    
    // Check if analytics data has correct types
    toHaveCorrectAnalyticsTypes(received) {
        if (!received || typeof received !== 'object') {
            return {
                pass: false,
                message: () => 'Expected analytics data to be an object'
            };
        }
        
        const requiredTypes = {
            total_transfers: 'number',
            total_volume: 'number',
            total_fees: 'number',
            avg_settlement_time: 'number',
            success_rate: 'number'
        };
        
        const pass = Object.entries(requiredTypes).every(([key, type]) => {
            return received[key] === undefined || typeof received[key] === type;
        });
        
        return {
            pass,
            message: () => 
                pass
                    ? `Expected analytics data not to have correct types`
                    : `Expected analytics data to have correct types for all required fields`
        };
    },
    
    // Check if period is valid
    toBeValidPeriod(received) {
        const validPeriods = ['7d', '30d', '90d', '1y'];
        const pass = validPeriods.includes(received);
        
        return {
            pass,
            message: () => 
                pass
                    ? `Expected period not to be valid`
                    : `Expected period to be one of: ${validPeriods.join(', ')}`
        };
    }
});

// Export test utilities for use in other test files
module.exports = {
    testUtils: global.testUtils,
    testConfig: global.testConfig
}; 