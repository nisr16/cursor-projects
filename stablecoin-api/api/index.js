/**
 * VERCEL SERVERLESS API - STABLECOIN BANKING PLATFORM
 * 
 * This is the main API entry point for Vercel deployment.
 * It handles all banking operations in a serverless environment.
 * 
 * Author: Development Team
 * Version: 1.0.0
 * Last Updated: August 2025
 */

const express = require('express');
const app = express();

// Import all route modules
const walletRoutes = require('../wallet');
const transferRoutes = require('../transfers');
const bankRoutes = require('../banks');
const userRoutes = require('../users');
const roleRoutes = require('../roles');
const { router: notificationRoutes } = require('../notifications');
const { specs, swaggerUi } = require('../swagger');

// Initialize database
const db = require('../database/connection');

// Middleware
app.use(express.json());

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// API Routes
app.use('/api/wallet', walletRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/banks', bankRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'stablecoin-banking-api',
    version: '1.0.0'
  });
});

// Root API endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Enterprise Stablecoin Banking API',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/api/health'
  });
});

// Export for Vercel
module.exports = app; 