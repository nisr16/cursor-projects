/**
 * App Integration - Analytics Routes and Middleware Integration
 * Shows how to integrate analytics into the main Express application
 */

const express = require('express');
const createAnalyticsRoutes = require('./analytics/routes');
const { 
    createAnalyticsMiddleware, 
    createTransferAnalyticsMiddleware 
} = require('./middleware/analyticsMiddleware');
const db = require('./database/connection');

/**
 * Creates the main Express application with analytics integration
 * @returns {express.Application} Configured Express app
 */
function createAppWithAnalytics() {
    const app = express();

    // ========================================
    // MIDDLEWARE SETUP
    // ========================================

    // Standard middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // CORS middleware
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        if (req.method === 'OPTIONS') {
            res.sendStatus(200);
        } else {
            next();
        }
    });

    // Request logging middleware
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });

    // ========================================
    // ANALYTICS MIDDLEWARE SETUP
    // ========================================

    // Add analytics middleware for transfer endpoints
    // This will automatically capture analytics when transfers are created
    app.use(createTransferAnalyticsMiddleware(db));

    console.log('✅ Analytics middleware configured for transfer endpoints');

    // ========================================
    // ROUTES SETUP
    // ========================================

    // Health check endpoint
    app.get('/health', (req, res) => {
        res.json({
            status: 'healthy',
            service: 'USDC Banking API',
            timestamp: new Date().toISOString(),
            features: ['transfers', 'analytics', 'banks']
        });
    });

    // Root endpoint
    app.get('/', (req, res) => {
        res.json({
            message: 'USDC Banking API',
            version: '1.0.0',
            endpoints: {
                health: '/health',
                analytics: '/api/analytics/health',
                transfers: '/api/transfers',
                banks: '/api/banks'
            }
        });
    });

    // ========================================
    // ANALYTICS ROUTES SETUP
    // ========================================

    // Create and mount analytics routes
    const analyticsRoutes = createAnalyticsRoutes(db);
    app.use('/api/analytics', analyticsRoutes);

    console.log('✅ Analytics routes mounted at /api/analytics');

    // ========================================
    // EXISTING ROUTES (PRESERVED)
    // ========================================

    // Example: Existing transfer routes
    app.post('/api/transfers', (req, res) => {
        // Simulate transfer creation
        const transferId = `transfer_${Date.now()}`;
        
        // This response will be intercepted by analytics middleware
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

    // Example: Existing bank routes
    app.get('/api/banks', (req, res) => {
        res.json({
            success: true,
            data: [
                {
                    id: '550e8400-e29b-41d4-a716-446655440000',
                    name: 'Nexora Bank',
                    status: 'active'
                }
            ]
        });
    });

    // ========================================
    // ERROR HANDLING MIDDLEWARE
    // ========================================

    // 404 handler
    app.use((req, res) => {
        res.status(404).json({
            success: false,
            error: 'Not Found',
            message: `Route ${req.method} ${req.path} not found`
        });
    });

    // Global error handler
    app.use((err, req, res, next) => {
        console.error('Error:', err);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Something went wrong'
        });
    });

    return app;
}

/**
 * Alternative: Add analytics to existing app without modifying existing code
 * @param {express.Application} existingApp - Existing Express app
 * @returns {express.Application} App with analytics added
 */
function addAnalyticsToExistingApp(existingApp) {
    // Add analytics middleware before existing routes
    existingApp.use(createTransferAnalyticsMiddleware(db));

    // Add analytics routes
    const analyticsRoutes = createAnalyticsRoutes(db);
    existingApp.use('/api/analytics', analyticsRoutes);

    console.log('✅ Analytics added to existing app');

    return existingApp;
}

/**
 * Creates app with custom analytics configuration
 * @param {Object} options - Configuration options
 * @returns {express.Application} Configured Express app
 */
function createAppWithCustomAnalytics(options = {}) {
    const app = express();

    // Standard middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Custom analytics middleware based on options
    if (options.analyticsMiddleware === 'transfer-only') {
        app.use(createTransferAnalyticsMiddleware(db));
    } else if (options.analyticsMiddleware === 'all-endpoints') {
        app.use(createAnalyticsMiddleware(db));
    } else if (options.analyticsMiddleware === 'custom') {
        const customEndpoints = options.endpoints || ['/api/transfers'];
        app.use(createEndpointSpecificAnalyticsMiddleware(db, customEndpoints));
    }

    // Add analytics routes
    const analyticsRoutes = createAnalyticsRoutes(db);
    app.use('/api/analytics', analyticsRoutes);

    // Add your existing routes here
    // ... existing route setup ...

    return app;
}

/**
 * Example: Testing the integrated app
 */
function testIntegratedApp() {
    const app = createAppWithAnalytics();
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📊 Analytics API: http://localhost:${PORT}/api/analytics`);
        console.log(`🏥 Health check: http://localhost:${PORT}/health`);
        console.log(`💸 Transfer endpoint: http://localhost:${PORT}/api/transfers`);
    });

    return app;
}

/**
 * Example: Environment-specific configuration
 */
function createEnvironmentSpecificApp(environment = 'development') {
    const app = express();

    // Standard middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Environment-specific analytics configuration
    switch (environment) {
        case 'production':
            // Production: Only capture analytics for transfer endpoints
            app.use(createTransferAnalyticsMiddleware(db));
            break;
            
        case 'development':
            // Development: Capture analytics for all endpoints
            app.use(createAnalyticsMiddleware(db));
            break;
            
        case 'testing':
            // Testing: No analytics middleware
            break;
            
        default:
            app.use(createTransferAnalyticsMiddleware(db));
    }

    // Add analytics routes
    const analyticsRoutes = createAnalyticsRoutes(db);
    app.use('/api/analytics', analyticsRoutes);

    // Add your existing routes here
    // ... existing route setup ...

    return app;
}

// Export functions for use in other files
module.exports = {
    createAppWithAnalytics,
    addAnalyticsToExistingApp,
    createAppWithCustomAnalytics,
    testIntegratedApp,
    createEnvironmentSpecificApp
};

// Example usage if this file is executed directly
if (require.main === module) {
    console.log('📊 Analytics Integration Example');
    console.log('===============================');
    
    // Create app with analytics
    const app = createAppWithAnalytics();
    
    console.log('\n🎯 Available Endpoints:');
    console.log('========================');
    console.log('GET  /health');
    console.log('GET  /');
    console.log('POST /api/transfers');
    console.log('GET  /api/banks');
    console.log('GET  /api/analytics/health');
    console.log('GET  /api/analytics/kpis/:bankId');
    console.log('GET  /api/analytics/trends/:bankId');
    console.log('GET  /api/analytics/transfer-types/:bankId');
    console.log('GET  /api/analytics/network-performance/:bankId');
    console.log('GET  /api/analytics/dashboard/:bankId');
    console.log('GET  /api/analytics/cost-savings/:bankId');
    console.log('POST /api/analytics/capture-transfer');
    
    console.log('\n🔧 Integration Features:');
    console.log('=======================');
    console.log('✅ Automatic analytics capture on transfer creation');
    console.log('✅ Non-blocking analytics processing');
    console.log('✅ Graceful error handling');
    console.log('✅ Preserved existing functionality');
    console.log('✅ Environment-specific configuration');
    console.log('✅ Comprehensive API documentation');
    
    console.log('\n📝 Example Transfer Creation:');
    console.log('============================');
    console.log('POST /api/transfers');
    console.log('Body: {');
    console.log('  "bank_id": "550e8400-e29b-41d4-a716-446655440000",');
    console.log('  "amount": 50000,');
    console.log('  "network_used": "polygon",');
    console.log('  "transfer_type": "interbank"');
    console.log('}');
    console.log('');
    console.log('This will automatically trigger analytics capture!');
} 