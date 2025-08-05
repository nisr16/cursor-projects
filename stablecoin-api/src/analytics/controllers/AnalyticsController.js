/**
 * AnalyticsController - Handles HTTP requests for analytics endpoints
 * Provides REST API endpoints for KPI tracking, cost analysis, and performance metrics
 */

const AnalyticsService = require('../services/AnalyticsService');
const db = require('../../database/connection');

class AnalyticsController {
    constructor() {
        this.analyticsService = new AnalyticsService(db);
    }

    /**
     * GET endpoint for dashboard KPIs
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getKPIs(req, res) {
        try {
            // Extract parameters from request
            const { bankId } = req.params;
            const { period = '30d' } = req.query;

            // Validate required parameters
            if (!bankId) {
                return res.status(400).json({
                    success: false,
                    error: 'Bank ID is required',
                    message: 'Please provide a valid bank ID in the URL parameters'
                });
            }

            // Validate period parameter
            const validPeriods = ['7d', '30d', '90d', '1y'];
            if (!validPeriods.includes(period)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid period parameter',
                    message: 'Period must be one of: 7d, 30d, 90d, 1y',
                    valid_periods: validPeriods
                });
            }

            // Get KPIs from analytics service
            const result = await this.analyticsService.getKPIs(bankId, period);

            // Return successful response
            return res.status(200).json({
                success: true,
                data: result,
                period,
                generated_at: new Date().toISOString()
            });

        } catch (error) {
            console.error('Error getting KPIs:', error);
            
            // Handle specific error types
            if (error.message.includes('Invalid period')) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid period parameter',
                    message: error.message
                });
            }

            // Handle database connection errors
            if (error.message.includes('database') || error.message.includes('connection')) {
                return res.status(503).json({
                    success: false,
                    error: 'Database connection error',
                    message: 'Unable to connect to analytics database'
                });
            }

            // Default error response
            return res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: 'Failed to retrieve KPIs. Please try again later.'
            });
        }
    }

    /**
     * GET endpoint for volume trend data
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getVolumeTrends(req, res) {
        try {
            // Extract parameters from request
            const { bankId } = req.params;
            const { period = '30d' } = req.query;

            // Validate required parameters
            if (!bankId) {
                return res.status(400).json({
                    success: false,
                    error: 'Bank ID is required',
                    message: 'Please provide a valid bank ID in the URL parameters'
                });
            }

            // Validate period parameter
            const validPeriods = ['7d', '30d', '90d', '1y'];
            if (!validPeriods.includes(period)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid period parameter',
                    message: 'Period must be one of: 7d, 30d, 90d, 1y',
                    valid_periods: validPeriods
                });
            }

            // Get volume trends from analytics service
            const result = await this.analyticsService.getVolumeTrends(bankId, period);

            // Return successful response
            return res.status(200).json({
                success: true,
                data: result,
                period,
                generated_at: new Date().toISOString()
            });

        } catch (error) {
            console.error('Error getting volume trends:', error);
            
            // Handle specific error types
            if (error.message.includes('Invalid period')) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid period parameter',
                    message: error.message
                });
            }

            // Handle database connection errors
            if (error.message.includes('database') || error.message.includes('connection')) {
                return res.status(503).json({
                    success: false,
                    error: 'Database connection error',
                    message: 'Unable to connect to analytics database'
                });
            }

            // Default error response
            return res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: 'Failed to retrieve volume trends. Please try again later.'
            });
        }
    }

    /**
     * GET endpoint for transfer type distribution
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getTransferTypes(req, res) {
        try {
            // Extract parameters from request
            const { bankId } = req.params;
            const { period = '30d' } = req.query;

            // Validate required parameters
            if (!bankId) {
                return res.status(400).json({
                    success: false,
                    error: 'Bank ID is required',
                    message: 'Please provide a valid bank ID in the URL parameters'
                });
            }

            // Validate period parameter
            const validPeriods = ['7d', '30d', '90d', '1y'];
            if (!validPeriods.includes(period)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid period parameter',
                    message: 'Period must be one of: 7d, 30d, 90d, 1y',
                    valid_periods: validPeriods
                });
            }

            // Get transfer type distribution from analytics service
            const result = await this.analyticsService.getTransferTypeDistribution(bankId, period);

            // Return successful response
            return res.status(200).json({
                success: true,
                data: result,
                period,
                generated_at: new Date().toISOString()
            });

        } catch (error) {
            console.error('Error getting transfer types:', error);
            
            // Handle specific error types
            if (error.message.includes('Invalid period')) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid period parameter',
                    message: error.message
                });
            }

            // Handle database connection errors
            if (error.message.includes('database') || error.message.includes('connection')) {
                return res.status(503).json({
                    success: false,
                    error: 'Database connection error',
                    message: 'Unable to connect to analytics database'
                });
            }

            // Default error response
            return res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: 'Failed to retrieve transfer type distribution. Please try again later.'
            });
        }
    }

    /**
     * GET endpoint for network performance metrics
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getNetworkPerformance(req, res) {
        try {
            // Extract parameters from request
            const { bankId } = req.params;
            const { period = '30d' } = req.query;

            // Validate required parameters
            if (!bankId) {
                return res.status(400).json({
                    success: false,
                    error: 'Bank ID is required',
                    message: 'Please provide a valid bank ID in the URL parameters'
                });
            }

            // Validate period parameter
            const validPeriods = ['7d', '30d', '90d', '1y'];
            if (!validPeriods.includes(period)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid period parameter',
                    message: 'Period must be one of: 7d, 30d, 90d, 1y',
                    valid_periods: validPeriods
                });
            }

            // Get network performance from analytics service
            const result = await this.analyticsService.getNetworkPerformance(bankId, period);

            // Return successful response
            return res.status(200).json({
                success: true,
                data: result,
                period,
                generated_at: new Date().toISOString()
            });

        } catch (error) {
            console.error('Error getting network performance:', error);
            
            // Handle specific error types
            if (error.message.includes('Invalid period')) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid period parameter',
                    message: error.message
                });
            }

            // Handle database connection errors
            if (error.message.includes('database') || error.message.includes('connection')) {
                return res.status(503).json({
                    success: false,
                    error: 'Database connection error',
                    message: 'Unable to connect to analytics database'
                });
            }

            // Default error response
            return res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: 'Failed to retrieve network performance metrics. Please try again later.'
            });
        }
    }

    /**
     * GET endpoint for comprehensive analytics dashboard
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getAnalyticsDashboard(req, res) {
        try {
            // Extract parameters from request
            const { bankId } = req.params;
            const { period = '30d' } = req.query;

            // Validate required parameters
            if (!bankId) {
                return res.status(400).json({
                    success: false,
                    error: 'Bank ID is required',
                    message: 'Please provide a valid bank ID in the URL parameters'
                });
            }

            // Validate period parameter
            const validPeriods = ['7d', '30d', '90d', '1y'];
            if (!validPeriods.includes(period)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid period parameter',
                    message: 'Period must be one of: 7d, 30d, 90d, 1y',
                    valid_periods: validPeriods
                });
            }

            // Get comprehensive dashboard data from analytics service
            const result = await this.analyticsService.getAnalyticsDashboard(bankId, period);

            // Return successful response
            return res.status(200).json({
                success: true,
                data: result,
                period,
                generated_at: new Date().toISOString()
            });

        } catch (error) {
            console.error('Error getting analytics dashboard:', error);
            
            // Handle specific error types
            if (error.message.includes('Invalid period')) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid period parameter',
                    message: error.message
                });
            }

            // Handle database connection errors
            if (error.message.includes('database') || error.message.includes('connection')) {
                return res.status(503).json({
                    success: false,
                    error: 'Database connection error',
                    message: 'Unable to connect to analytics database'
                });
            }

            // Default error response
            return res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: 'Failed to retrieve analytics dashboard. Please try again later.'
            });
        }
    }

    /**
     * GET endpoint for cost savings analysis
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getCostSavings(req, res) {
        try {
            // Extract parameters from request
            const { bankId } = req.params;
            const { period = '30d' } = req.query;

            // Validate required parameters
            if (!bankId) {
                return res.status(400).json({
                    success: false,
                    error: 'Bank ID is required',
                    message: 'Please provide a valid bank ID in the URL parameters'
                });
            }

            // Validate period parameter
            const validPeriods = ['7d', '30d', '90d', '1y'];
            if (!validPeriods.includes(period)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid period parameter',
                    message: 'Period must be one of: 7d, 30d, 90d, 1y',
                    valid_periods: validPeriods
                });
            }

            // Get cost savings analysis from analytics service
            const result = await this.analyticsService.getCostSavingsAnalysis(bankId, period);

            // Return successful response
            return res.status(200).json({
                success: true,
                data: result,
                period,
                generated_at: new Date().toISOString()
            });

        } catch (error) {
            console.error('Error getting cost savings analysis:', error);
            
            // Handle specific error types
            if (error.message.includes('Invalid period')) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid period parameter',
                    message: error.message
                });
            }

            // Handle database connection errors
            if (error.message.includes('database') || error.message.includes('connection')) {
                return res.status(503).json({
                    success: false,
                    error: 'Database connection error',
                    message: 'Unable to connect to analytics database'
                });
            }

            // Default error response
            return res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: 'Failed to retrieve cost savings analysis. Please try again later.'
            });
        }
    }

    /**
     * POST endpoint for capturing transfer analytics
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async captureTransferAnalytics(req, res) {
        try {
            // Extract transfer data from request body
            const transfer = req.body;

            // Validate required fields
            const requiredFields = ['transaction_id', 'bank_id', 'amount'];
            const missingFields = requiredFields.filter(field => !transfer[field]);

            if (missingFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields',
                    message: `The following fields are required: ${missingFields.join(', ')}`,
                    required_fields: requiredFields
                });
            }

            // Validate amount is a positive number
            if (typeof transfer.amount !== 'number' || transfer.amount <= 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid amount',
                    message: 'Amount must be a positive number'
                });
            }

            // Capture analytics using analytics service
            const result = await this.analyticsService.captureTransferAnalytics(transfer);

            // Return successful response
            return res.status(201).json({
                success: true,
                data: result,
                message: 'Transfer analytics captured successfully',
                generated_at: new Date().toISOString()
            });

        } catch (error) {
            console.error('Error capturing transfer analytics:', error);
            
            // Handle database connection errors
            if (error.message.includes('database') || error.message.includes('connection')) {
                return res.status(503).json({
                    success: false,
                    error: 'Database connection error',
                    message: 'Unable to connect to analytics database'
                });
            }

            // Handle constraint violation errors
            if (error.message.includes('UNIQUE constraint') || error.message.includes('duplicate')) {
                return res.status(409).json({
                    success: false,
                    error: 'Duplicate transaction',
                    message: 'Analytics for this transaction have already been captured'
                });
            }

            // Default error response
            return res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: 'Failed to capture transfer analytics. Please try again later.'
            });
        }
    }
}

module.exports = AnalyticsController; 