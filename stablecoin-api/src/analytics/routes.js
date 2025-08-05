/**
 * Analytics Routes
 * Express router configuration for analytics endpoints
 * Exports a function that takes a database connection and returns configured router
 */

const express = require('express');
const AnalyticsController = require('./controllers/AnalyticsController');

/**
 * Creates and configures analytics routes
 * @param {Object} db - Database connection object
 * @returns {express.Router} Configured Express router
 */
function createAnalyticsRoutes(db) {
    const router = express.Router();
    
    // Initialize analytics controller with database connection
    const analyticsController = new AnalyticsController();
    
    // Override the controller's analytics service with the provided database
    if (db) {
        const AnalyticsService = require('./services/AnalyticsService');
        analyticsController.analyticsService = new AnalyticsService(db);
    }

    /**
     * @swagger
     * /analytics/kpis/{bankId}:
     *   get:
     *     summary: Get KPIs for a bank
     *     description: Retrieve key performance indicators for a specific bank
     *     tags: [Analytics]
     *     parameters:
     *       - in: path
     *         name: bankId
     *         required: true
     *         schema:
     *           type: string
     *         description: Bank UUID
     *       - in: query
     *         name: period
     *         schema:
     *           type: string
     *           enum: [7d, 30d, 90d, 1y]
     *           default: 30d
     *         description: Time period for analytics
     *     responses:
     *       200:
     *         description: KPIs retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 data:
     *                   type: object
     *                 period:
     *                   type: string
     *                 generated_at:
     *                   type: string
     *       400:
     *         description: Invalid parameters
     *       500:
     *         description: Internal server error
     */
    router.get('/kpis/:bankId', analyticsController.getKPIs.bind(analyticsController));

    /**
     * @swagger
     * /analytics/trends/{bankId}:
     *   get:
     *     summary: Get volume trends for a bank
     *     description: Retrieve daily volume and fee trends for charting
     *     tags: [Analytics]
     *     parameters:
     *       - in: path
     *         name: bankId
     *         required: true
     *         schema:
     *           type: string
     *         description: Bank UUID
     *       - in: query
     *         name: period
     *         schema:
     *           type: string
     *           enum: [7d, 30d, 90d, 1y]
     *           default: 30d
     *         description: Time period for analytics
     *     responses:
     *       200:
     *         description: Volume trends retrieved successfully
     *       400:
     *         description: Invalid parameters
     *       500:
     *         description: Internal server error
     */
    router.get('/trends/:bankId', analyticsController.getVolumeTrends.bind(analyticsController));

    /**
     * @swagger
     * /analytics/transfer-types/{bankId}:
     *   get:
     *     summary: Get transfer type distribution
     *     description: Retrieve breakdown by transfer type (interbank, international, etc.)
     *     tags: [Analytics]
     *     parameters:
     *       - in: path
     *         name: bankId
     *         required: true
     *         schema:
     *           type: string
     *         description: Bank UUID
     *       - in: query
     *         name: period
     *         schema:
     *           type: string
     *           enum: [7d, 30d, 90d, 1y]
     *           default: 30d
     *         description: Time period for analytics
     *     responses:
     *       200:
     *         description: Transfer type distribution retrieved successfully
     *       400:
     *         description: Invalid parameters
     *       500:
     *         description: Internal server error
     */
    router.get('/transfer-types/:bankId', analyticsController.getTransferTypes.bind(analyticsController));

    /**
     * @swagger
     * /analytics/network-performance/{bankId}:
     *   get:
     *     summary: Get network performance metrics
     *     description: Retrieve performance metrics by network (Polygon, Ethereum, Arbitrum, Base)
     *     tags: [Analytics]
     *     parameters:
     *       - in: path
     *         name: bankId
     *         required: true
     *         schema:
     *           type: string
     *         description: Bank UUID
     *       - in: query
     *         name: period
     *         schema:
     *           type: string
     *           enum: [7d, 30d, 90d, 1y]
     *           default: 30d
     *         description: Time period for analytics
     *     responses:
     *       200:
     *         description: Network performance metrics retrieved successfully
     *       400:
     *         description: Invalid parameters
     *       500:
     *         description: Internal server error
     */
    router.get('/network-performance/:bankId', analyticsController.getNetworkPerformance.bind(analyticsController));

    /**
     * @swagger
     * /analytics/dashboard/{bankId}:
     *   get:
     *     summary: Get comprehensive analytics dashboard
     *     description: Retrieve complete dashboard data including KPIs, trends, distributions, and network performance
     *     tags: [Analytics]
     *     parameters:
     *       - in: path
     *         name: bankId
     *         required: true
     *         schema:
     *           type: string
     *         description: Bank UUID
     *       - in: query
     *         name: period
     *         schema:
     *           type: string
     *           enum: [7d, 30d, 90d, 1y]
     *           default: 30d
     *         description: Time period for analytics
     *     responses:
     *       200:
     *         description: Dashboard data retrieved successfully
     *       400:
     *         description: Invalid parameters
     *       500:
     *         description: Internal server error
     */
    router.get('/dashboard/:bankId', analyticsController.getAnalyticsDashboard.bind(analyticsController));

    /**
     * @swagger
     * /analytics/cost-savings/{bankId}:
     *   get:
     *     summary: Get cost savings analysis
     *     description: Retrieve detailed cost savings analysis comparing Nexora vs SWIFT
     *     tags: [Analytics]
     *     parameters:
     *       - in: path
     *         name: bankId
     *         required: true
     *         schema:
     *           type: string
     *         description: Bank UUID
     *       - in: query
     *         name: period
     *         schema:
     *           type: string
     *           enum: [7d, 30d, 90d, 1y]
     *           default: 30d
     *         description: Time period for analytics
     *     responses:
     *       200:
     *         description: Cost savings analysis retrieved successfully
     *       400:
     *         description: Invalid parameters
     *       500:
     *         description: Internal server error
     */
    router.get('/cost-savings/:bankId', analyticsController.getCostSavings.bind(analyticsController));

    /**
     * @swagger
     * /analytics/capture-transfer:
     *   post:
     *     summary: Capture transfer analytics
     *     description: Capture analytics when a transfer is created
     *     tags: [Analytics]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - transaction_id
     *               - bank_id
     *               - amount
     *             properties:
     *               transaction_id:
     *                 type: string
     *                 description: Unique transaction ID
     *               bank_id:
     *                 type: string
     *                 description: Bank UUID
     *               amount:
     *                 type: number
     *                 description: Transfer amount in USD
     *               network_used:
     *                 type: string
     *                 default: nexora
     *                 description: Network used for transfer
     *               settlement_time_seconds:
     *                 type: number
     *                 default: 30
     *                 description: Settlement time in seconds
     *               transfer_type:
     *                 type: string
     *                 default: interbank
     *                 description: Type of transfer
     *               status:
     *                 type: string
     *                 default: pending
     *                 description: Transfer status
     *     responses:
     *       201:
     *         description: Transfer analytics captured successfully
     *       400:
     *         description: Invalid request data
     *       409:
     *         description: Duplicate transaction
     *       500:
     *         description: Internal server error
     */
    router.post('/capture-transfer', analyticsController.captureTransferAnalytics.bind(analyticsController));

    /**
     * @swagger
     * /analytics/health:
     *   get:
     *     summary: Analytics service health check
     *     description: Check if analytics service is running properly
     *     tags: [Analytics]
     *     responses:
     *       200:
     *         description: Analytics service is healthy
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: "healthy"
     *                 service:
     *                   type: string
     *                   example: "analytics"
     *                 timestamp:
     *                   type: string
     *                   example: "2024-01-01T12:00:00.000Z"
     */
    router.get('/health', (req, res) => {
        res.status(200).json({
            status: 'healthy',
            service: 'analytics',
            timestamp: new Date().toISOString(),
            endpoints: [
                'GET /analytics/kpis/:bankId',
                'GET /analytics/trends/:bankId',
                'GET /analytics/transfer-types/:bankId',
                'GET /analytics/network-performance/:bankId',
                'GET /analytics/dashboard/:bankId',
                'GET /analytics/cost-savings/:bankId',
                'POST /analytics/capture-transfer'
            ]
        });
    });

    return router;
}

module.exports = createAnalyticsRoutes; 