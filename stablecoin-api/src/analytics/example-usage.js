/**
 * Example Usage - Analytics Routes Integration
 * Demonstrates how to integrate analytics routes into the main Express application
 */

const express = require('express');
const createAnalyticsRoutes = require('./routes');
const db = require('../database/connection');

// Example: How to integrate analytics routes into your main app
function setupAnalyticsRoutes(app) {
    // Create analytics routes with database connection
    const analyticsRoutes = createAnalyticsRoutes(db);
    
    // Mount analytics routes under /api/analytics prefix
    app.use('/api/analytics', analyticsRoutes);
    
    console.log('✅ Analytics routes mounted at /api/analytics');
    console.log('📊 Available endpoints:');
    console.log('   GET  /api/analytics/kpis/:bankId');
    console.log('   GET  /api/analytics/trends/:bankId');
    console.log('   GET  /api/analytics/transfer-types/:bankId');
    console.log('   GET  /api/analytics/network-performance/:bankId');
    console.log('   GET  /api/analytics/dashboard/:bankId');
    console.log('   GET  /api/analytics/cost-savings/:bankId');
    console.log('   POST /api/analytics/capture-transfer');
    console.log('   GET  /api/analytics/health');
}

// Example: Complete Express app setup
function createExpressApp() {
    const app = express();
    
    // Middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    // CORS middleware (if needed)
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
    
    // Setup analytics routes
    setupAnalyticsRoutes(app);
    
    // Other routes can be added here
    app.get('/', (req, res) => {
        res.json({
            message: 'USDC Banking API',
            version: '1.0.0',
            analytics: '/api/analytics/health'
        });
    });
    
    // Error handling middleware
    app.use((err, req, res, next) => {
        console.error('Error:', err);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Something went wrong'
        });
    });
    
    return app;
}

// Example: How to test the routes
function testAnalyticsRoutes() {
    const app = createExpressApp();
    
    // Example: Test health endpoint
    const testHealth = async () => {
        const response = await fetch('http://localhost:3000/api/analytics/health');
        const data = await response.json();
        console.log('Health check response:', data);
    };
    
    // Example: Test KPIs endpoint
    const testKPIs = async (bankId) => {
        const response = await fetch(`http://localhost:3000/api/analytics/kpis/${bankId}?period=30d`);
        const data = await response.json();
        console.log('KPIs response:', data);
    };
    
    // Example: Test capture transfer endpoint
    const testCaptureTransfer = async () => {
        const transferData = {
            transaction_id: 'test_transfer_123',
            bank_id: '550e8400-e29b-41d4-a716-446655440000',
            amount: 50000.00,
            network_used: 'polygon',
            settlement_time_seconds: 25,
            transfer_type: 'interbank',
            status: 'completed'
        };
        
        const response = await fetch('http://localhost:3000/api/analytics/capture-transfer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transferData)
        });
        
        const data = await response.json();
        console.log('Capture transfer response:', data);
    };
    
    return {
        testHealth,
        testKPIs,
        testCaptureTransfer
    };
}

// Example: Server startup
function startServer() {
    const app = createExpressApp();
    const PORT = process.env.PORT || 3000;
    
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📊 Analytics API available at http://localhost:${PORT}/api/analytics`);
        console.log(`🏥 Health check at http://localhost:${PORT}/api/analytics/health`);
    });
}

// Export functions for use in other files
module.exports = {
    createExpressApp,
    setupAnalyticsRoutes,
    testAnalyticsRoutes,
    startServer
};

// Run example if this file is executed directly
if (require.main === module) {
    console.log('📊 Analytics Routes Example');
    console.log('==========================');
    
    // Create app and show available endpoints
    const app = createExpressApp();
    
    console.log('\n🎯 Available Analytics Endpoints:');
    console.log('==================================');
    console.log('GET  /api/analytics/kpis/:bankId?period=30d');
    console.log('GET  /api/analytics/trends/:bankId?period=7d');
    console.log('GET  /api/analytics/transfer-types/:bankId?period=90d');
    console.log('GET  /api/analytics/network-performance/:bankId?period=1y');
    console.log('GET  /api/analytics/dashboard/:bankId?period=30d');
    console.log('GET  /api/analytics/cost-savings/:bankId?period=30d');
    console.log('POST /api/analytics/capture-transfer');
    console.log('GET  /api/analytics/health');
    
    console.log('\n📝 Example Usage:');
    console.log('==================');
    console.log('// Get KPIs for last 30 days');
    console.log('GET /api/analytics/kpis/550e8400-e29b-41d4-a716-446655440000?period=30d');
    
    console.log('\n// Get volume trends for last 7 days');
    console.log('GET /api/analytics/trends/550e8400-e29b-41d4-a716-446655440000?period=7d');
    
    console.log('\n// Capture transfer analytics');
    console.log('POST /api/analytics/capture-transfer');
    console.log('Body: { "transaction_id": "123", "bank_id": "uuid", "amount": 50000 }');
    
    console.log('\n// Health check');
    console.log('GET /api/analytics/health');
} 