/**
 * Analytics Middleware
 * Automatically captures analytics data when transfers are created
 * Intercepts POST /api/transfers responses and calls AnalyticsService
 */

const AnalyticsService = require('../analytics/services/AnalyticsService');

/**
 * Creates analytics middleware that captures transfer analytics
 * @param {Object} db - Database connection object
 * @returns {Function} Express middleware function
 */
function createAnalyticsMiddleware(db) {
    // Initialize analytics service with database connection
    const analyticsService = new AnalyticsService(db);

    /**
     * Middleware to intercept transfer creation and capture analytics
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next function
     */
    return function analyticsMiddleware(req, res, next) {
        // Store original response methods
        const originalJson = res.json;
        const originalSend = res.send;
        const originalStatus = res.status;

        // Track if we've already processed this response
        let analyticsProcessed = false;

        // Override res.json to intercept JSON responses
        res.json = function(data) {
            // Call original json method first
            const result = originalJson.call(this, data);
            
            // Process analytics if this is a successful transfer creation
            if (!analyticsProcessed && shouldCaptureAnalytics(req, data)) {
                analyticsProcessed = true;
                captureTransferAnalyticsAsync(req, data);
            }
            
            return result;
        };

        // Override res.send to intercept other response types
        res.send = function(data) {
            // Call original send method first
            const result = originalSend.call(this, data);
            
            // Try to parse JSON if it's a string
            if (!analyticsProcessed && typeof data === 'string') {
                try {
                    const jsonData = JSON.parse(data);
                    if (shouldCaptureAnalytics(req, jsonData)) {
                        analyticsProcessed = true;
                        captureTransferAnalyticsAsync(req, jsonData);
                    }
                } catch (error) {
                    // Not JSON data, ignore
                }
            }
            
            return result;
        };

        // Override res.status to track status codes
        res.status = function(code) {
            // Store status code for analytics processing
            res.statusCode = code;
            return originalStatus.call(this, code);
        };

        // Continue to next middleware
        next();
    };

    /**
     * Determines if analytics should be captured for this request/response
     * @param {Object} req - Express request object
     * @param {Object} responseData - Response data
     * @returns {boolean} True if analytics should be captured
     */
    function shouldCaptureAnalytics(req, responseData) {
        // Check if this is a POST request to /api/transfers
        const isTransferCreation = req.method === 'POST' && 
                                 (req.path === '/api/transfers' || req.path === '/transfers');

        // Check if response indicates successful transfer creation
        const isSuccessful = responseData && 
                           responseData.success === true && 
                           responseData.data && 
                           responseData.data.id;

        // Check if response status is 2xx
        const isSuccessStatus = req.res && req.res.statusCode >= 200 && req.res.statusCode < 300;

        return isTransferCreation && isSuccessful && isSuccessStatus;
    }

    /**
     * Asynchronously captures transfer analytics without blocking the response
     * @param {Object} req - Express request object
     * @param {Object} responseData - Response data from transfer creation
     */
    async function captureTransferAnalyticsAsync(req, responseData) {
        try {
            // Extract transfer data from request and response
            const transferData = {
                transaction_id: responseData.data.id,
                bank_id: req.body.bank_id || req.body.bankId || responseData.data.bank_id,
                amount: req.body.amount || responseData.data.amount,
                network_used: req.body.network_used || req.body.network || 'nexora',
                settlement_time_seconds: req.body.settlement_time_seconds || 30,
                transfer_type: req.body.transfer_type || req.body.type || 'interbank',
                status: responseData.data.status || 'completed'
            };

            // Validate required fields
            if (!transferData.transaction_id || !transferData.bank_id || !transferData.amount) {
                console.warn('Analytics: Missing required fields for transfer analytics', {
                    transaction_id: transferData.transaction_id,
                    bank_id: transferData.bank_id,
                    amount: transferData.amount
                });
                return;
            }

            // Capture analytics asynchronously
            const analyticsResult = await analyticsService.captureTransferAnalytics(transferData);
            
            console.log('Analytics: Transfer analytics captured successfully', {
                transaction_id: transferData.transaction_id,
                bank_id: transferData.bank_id,
                amount: transferData.amount,
                analytics_result: analyticsResult
            });

        } catch (error) {
            // Log error but don't fail the original request
            console.error('Analytics: Failed to capture transfer analytics', {
                error: error.message,
                transaction_id: responseData.data?.id,
                bank_id: req.body.bank_id || req.body.bankId,
                amount: req.body.amount
            });
        }
    }
}

/**
 * Creates analytics middleware specifically for transfer endpoints
 * @param {Object} db - Database connection object
 * @returns {Function} Express middleware function
 */
function createTransferAnalyticsMiddleware(db) {
    return function transferAnalyticsMiddleware(req, res, next) {
        // Only apply to transfer-related endpoints
        const transferEndpoints = [
            '/api/transfers',
            '/transfers',
            '/api/transfer',
            '/transfer'
        ];

        const isTransferEndpoint = transferEndpoints.some(endpoint => 
            req.path === endpoint || req.path.startsWith(endpoint + '/')
        );

        if (!isTransferEndpoint) {
            return next();
        }

        // Apply analytics middleware
        return createAnalyticsMiddleware(db)(req, res, next);
    };
}

/**
 * Creates analytics middleware for specific endpoints
 * @param {Object} db - Database connection object
 * @param {Array} endpoints - Array of endpoint paths to monitor
 * @returns {Function} Express middleware function
 */
function createEndpointSpecificAnalyticsMiddleware(db, endpoints) {
    return function endpointAnalyticsMiddleware(req, res, next) {
        const isTargetEndpoint = endpoints.some(endpoint => 
            req.path === endpoint || req.path.startsWith(endpoint + '/')
        );

        if (!isTargetEndpoint) {
            return next();
        }

        // Apply analytics middleware
        return createAnalyticsMiddleware(db)(req, res, next);
    };
}

/**
 * Creates analytics middleware with custom capture logic
 * @param {Object} db - Database connection object
 * @param {Function} captureLogic - Custom function to determine if analytics should be captured
 * @returns {Function} Express middleware function
 */
function createCustomAnalyticsMiddleware(db, captureLogic) {
    return function customAnalyticsMiddleware(req, res, next) {
        // Store original response methods
        const originalJson = res.json;
        const originalSend = res.send;

        // Track if we've already processed this response
        let analyticsProcessed = false;

        // Override res.json to intercept JSON responses
        res.json = function(data) {
            // Call original json method first
            const result = originalJson.call(this, data);
            
            // Process analytics using custom logic
            if (!analyticsProcessed && captureLogic(req, data)) {
                analyticsProcessed = true;
                captureTransferAnalyticsAsync(req, data);
            }
            
            return result;
        };

        // Override res.send to intercept other response types
        res.send = function(data) {
            // Call original send method first
            const result = originalSend.call(this, data);
            
            // Try to parse JSON if it's a string
            if (!analyticsProcessed && typeof data === 'string') {
                try {
                    const jsonData = JSON.parse(data);
                    if (captureLogic(req, jsonData)) {
                        analyticsProcessed = true;
                        captureTransferAnalyticsAsync(req, jsonData);
                    }
                } catch (error) {
                    // Not JSON data, ignore
                }
            }
            
            return result;
        };

        // Continue to next middleware
        next();
    };

    /**
     * Asynchronously captures transfer analytics
     * @param {Object} req - Express request object
     * @param {Object} responseData - Response data
     */
    async function captureTransferAnalyticsAsync(req, responseData) {
        try {
            const analyticsService = new AnalyticsService(db);
            
            // Extract transfer data
            const transferData = {
                transaction_id: responseData.data?.id || responseData.id,
                bank_id: req.body.bank_id || req.body.bankId || responseData.data?.bank_id,
                amount: req.body.amount || responseData.data?.amount,
                network_used: req.body.network_used || req.body.network || 'nexora',
                settlement_time_seconds: req.body.settlement_time_seconds || 30,
                transfer_type: req.body.transfer_type || req.body.type || 'interbank',
                status: responseData.data?.status || 'completed'
            };

            // Validate required fields
            if (!transferData.transaction_id || !transferData.bank_id || !transferData.amount) {
                console.warn('Analytics: Missing required fields for transfer analytics', transferData);
                return;
            }

            // Capture analytics
            const analyticsResult = await analyticsService.captureTransferAnalytics(transferData);
            
            console.log('Analytics: Transfer analytics captured successfully', {
                transaction_id: transferData.transaction_id,
                analytics_result: analyticsResult
            });

        } catch (error) {
            console.error('Analytics: Failed to capture transfer analytics', {
                error: error.message,
                transaction_id: responseData.data?.id
            });
        }
    }
}

module.exports = {
    createAnalyticsMiddleware,
    createTransferAnalyticsMiddleware,
    createEndpointSpecificAnalyticsMiddleware,
    createCustomAnalyticsMiddleware
}; 