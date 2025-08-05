/**
 * Analytics Routes
 * Express router for analytics endpoints
 */

const express = require('express');
const AnalyticsController = require('../controllers/AnalyticsController');

const router = express.Router();
const analyticsController = new AnalyticsController();

/**
 * @swagger
 * /api/analytics/{bankId}/kpis:
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
router.get('/:bankId/kpis', analyticsController.getKPIs.bind(analyticsController));

/**
 * @swagger
 * /api/analytics/{bankId}/volume-trends:
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
router.get('/:bankId/volume-trends', analyticsController.getVolumeTrends.bind(analyticsController));

/**
 * @swagger
 * /api/analytics/{bankId}/transfer-types:
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
router.get('/:bankId/transfer-types', analyticsController.getTransferTypes.bind(analyticsController));

/**
 * @swagger
 * /api/analytics/{bankId}/network-performance:
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
router.get('/:bankId/network-performance', analyticsController.getNetworkPerformance.bind(analyticsController));

/**
 * @swagger
 * /api/analytics/{bankId}/dashboard:
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
router.get('/:bankId/dashboard', analyticsController.getAnalyticsDashboard.bind(analyticsController));

/**
 * @swagger
 * /api/analytics/{bankId}/cost-savings:
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
router.get('/:bankId/cost-savings', analyticsController.getCostSavings.bind(analyticsController));

/**
 * @swagger
 * /api/analytics/capture-transfer:
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

module.exports = router; 