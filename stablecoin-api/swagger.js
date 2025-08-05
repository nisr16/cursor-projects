const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Enterprise Stablecoin Banking API',
      version: '1.0.0',
      description: `
## 🏦 Enterprise Stablecoin Banking API

A comprehensive API for 30-second cross-border bank transfers using stablecoin infrastructure. This API enables banks to replace traditional 48-hour SWIFT transfers with instant stablecoin transfers.

### 🎯 Key Features
- **Multi-bank support** with isolated data environments
- **Role-based access control** with custom approval workflows
- **Real-time notifications** via WebSocket connections
- **Comprehensive audit trails** for compliance
- **Enterprise-grade security** with API key authentication

### 🚀 Getting Started
1. Register your bank using /api/banks/register
2. Create users and assign roles
3. Set up approval rules for transfers
4. Create wallets for your subsidiaries
5. Start making 30-second cross-border transfers

### 🔐 Authentication
All API requests require an API key in the X-API-Key header. Your API key is provided during bank registration.

### 📊 Transfer Approval Workflow
- **$0-$9,999**: Auto-approved
- **$10,000-$49,999**: Requires 1 approval (Manager+)
- **$50,000-$249,999**: Requires 1 approval (VP+)
- **$250,000+**: Requires 2 approvals (CEO+)

### 🌐 Real-time Updates
Connect to WebSocket endpoint for real-time transfer status updates and notifications.
      `,
      contact: {
        name: 'API Support',
        email: 'support@stablecoin-api.com',
        url: 'https://stablecoin-api.com/support'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'https://stablecoin-banking-api-production.up.railway.app',
        description: 'Production server',
      },
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Health',
        description: 'System health and status endpoints',
      },
      {
        name: 'Banks',
        description: 'Bank registration and profile management',
      },
      {
        name: 'Users',
        description: 'Bank user management and role assignment',
      },
      {
        name: 'Roles',
        description: 'Role-based permissions and approval rules',
      },
      {
        name: 'Wallets',
        description: 'Bank wallet creation and balance management',
      },
      {
        name: 'Transfers',
        description: 'Cross-border transfer operations and approval workflows',
      },
      {
        name: 'Notifications',
        description: 'Real-time notifications, WebSocket connections, and messaging',
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API key for bank authentication. Include this header with all requests.',
        },
      },
      schemas: {
        // Error Response Schemas
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
              example: 'Invalid API key'
            },
            code: {
              type: 'string',
              description: 'Error code for programmatic handling',
              example: 'AUTH_FAILED'
            },
            details: {
              type: 'object',
              description: 'Additional error details',
              example: { field: 'api_key', reason: 'missing' }
            }
          }
        },
        ValidationError: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Validation failed'
            },
            required: {
              type: 'array',
              items: { type: 'string' },
              example: ['bank_name', 'contact_email']
            },
            invalid_fields: {
              type: 'object',
              example: { email: 'Invalid email format' }
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Success message',
              example: 'Bank registered successfully'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        },
        
        // Bank Schemas
        Bank: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Unique bank identifier',
              example: 1
            },
            bank_name: {
              type: 'string',
              description: 'Official bank name',
              example: 'Nexora Bank'
            },
            bank_code: {
              type: 'string',
              description: 'Unique bank code',
              example: 'NEX001'
            },
            api_key: {
              type: 'string',
              description: 'API key for authentication',
              example: 'sk_live_abc123...'
            },
            contact_email: {
              type: 'string',
              description: 'Primary contact email',
              example: 'treasury@nexora.com'
            },
            country: {
              type: 'string',
              description: 'Bank country',
              example: 'Costa Rica'
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'suspended'],
              description: 'Bank status',
              example: 'active'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Registration timestamp',
              example: '2024-01-15T10:30:00.000Z'
            }
          }
        },
        
        // User Schemas
        BankUser: {
          type: 'object',
          properties: {
            user_id: {
              type: 'string',
              description: 'Unique user identifier',
              example: 'user_abc123'
            },
            username: {
              type: 'string',
              description: 'Username',
              example: 'jdoe'
            },
            email: {
              type: 'string',
              description: 'User email',
              example: 'john.doe@bank.com'
            },
            full_name: {
              type: 'string',
              description: 'Full name',
              example: 'John Doe'
            },
            role: {
              type: 'string',
              description: 'User role',
              example: 'treasury_operator'
            },
            department: {
              type: 'string',
              description: 'Department',
              example: 'Treasury'
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'suspended'],
              description: 'User status',
              example: 'active'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp',
              example: '2024-01-15T10:30:00.000Z'
            }
          }
        },
        
        // Wallet Schemas
        Wallet: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique wallet identifier',
              example: 'wallet_1000'
            },
            bank_name: {
              type: 'string',
              description: 'Name of the bank',
              example: 'Nexora Bank'
            },
            subsidiary_name: {
              type: 'string',
              description: 'Name of the bank subsidiary',
              example: 'Costa Rica Branch'
            },
            currency: {
              type: 'string',
              description: 'Wallet currency',
              example: 'USDC'
            },
            balance: {
              type: 'number',
              description: 'Current wallet balance',
              example: 1000000.50
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'suspended'],
              description: 'Wallet status',
              example: 'active'
            },
            public_address: {
              type: 'string',
              description: 'Blockchain public address',
              example: '0x2ead08772db3c...'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Wallet creation timestamp',
              example: '2024-01-15T10:30:00.000Z'
            }
          }
        },
        
        // Transfer Schemas
        Transfer: {
          type: 'object',
          properties: {
            transfer_id: {
              type: 'string',
              description: 'Unique transfer identifier',
              example: 'transfer_1001'
            },
            from_wallet_id: {
              type: 'string',
              description: 'Source wallet ID',
              example: 'wallet_1000'
            },
            to_wallet_id: {
              type: 'string',
              description: 'Destination wallet ID',
              example: 'wallet_1001'
            },
            amount: {
              type: 'number',
              description: 'Transfer amount',
              example: 75000.00
            },
            currency: {
              type: 'string',
              description: 'Transfer currency',
              example: 'USDC'
            },
            fees: {
              type: 'number',
              description: 'Transaction fees',
              example: 75.00
            },
            status: {
              type: 'string',
              enum: ['pending_approval', 'approved', 'completed', 'rejected', 'failed'],
              description: 'Transfer status',
              example: 'pending_approval'
            },
            approval_status: {
              type: 'string',
              enum: ['pending', 'approved', 'rejected'],
              description: 'Approval status',
              example: 'pending'
            },
            required_approvals: {
              type: 'integer',
              description: 'Number of approvals required',
              example: 1
            },
            approved_by: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of user IDs who approved',
              example: ['user_abc123']
            },
            initiated_by: {
              type: 'string',
              description: 'User ID who initiated the transfer',
              example: 'user_abc123'
            },
            reason: {
              type: 'string',
              description: 'Transfer reason',
              example: 'Quarterly liquidity rebalancing'
            },
            transaction_hash: {
              type: 'string',
              description: 'Blockchain transaction hash',
              example: '0xabc123...'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Transfer creation timestamp',
              example: '2024-01-15T10:30:00.000Z'
            }
          }
        },
        
        // Role Schemas
        Role: {
          type: 'object',
          properties: {
            role_name: {
              type: 'string',
              description: 'Role name',
              example: 'treasury_operator'
            },
            role_level: {
              type: 'integer',
              description: 'Role permission level (1-10)',
              example: 5
            },
            permissions: {
              type: 'string',
              description: 'Comma-separated permissions',
              example: 'view_reports,initiate_transfers'
            },
            description: {
              type: 'string',
              description: 'Role description',
              example: 'Can initiate transfers and view reports'
            }
          }
        },
        
        // Approval Rule Schemas
        ApprovalRule: {
          type: 'object',
          properties: {
            rule_name: {
              type: 'string',
              description: 'Rule name',
              example: 'Standard Transfer'
            },
            min_amount: {
              type: 'number',
              description: 'Minimum amount for this rule',
              example: 10000
            },
            max_amount: {
              type: 'number',
              nullable: true,
              description: 'Maximum amount for this rule',
              example: 100000
            },
            required_role_level: {
              type: 'integer',
              description: 'Minimum role level required for approval',
              example: 2
            },
            required_approvals: {
              type: 'integer',
              description: 'Number of approvals required',
              example: 1
            },
            auto_approve: {
              type: 'boolean',
              description: 'Whether transfers are auto-approved',
              example: false
            }
          }
        },
        
        // Notification Schemas
        Notification: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Notification ID',
              example: 1
            },
            user_id: {
              type: 'integer',
              description: 'User ID',
              example: 1
            },
            type: {
              type: 'string',
              description: 'Notification type',
              example: 'transfer_completed'
            },
            title: {
              type: 'string',
              description: 'Notification title',
              example: 'Transfer Completed'
            },
            message: {
              type: 'string',
              description: 'Notification message',
              example: 'Transfer #1001 has been completed successfully'
            },
            status: {
              type: 'string',
              enum: ['unread', 'read', 'archived'],
              description: 'Notification status',
              example: 'unread'
            },
            priority: {
              type: 'string',
              enum: ['low', 'normal', 'high', 'urgent'],
              description: 'Notification priority',
              example: 'normal'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Notification creation timestamp',
              example: '2024-01-15T10:30:00.000Z'
            }
          }
        },
        
        // Webhook Schemas
        WebhookEndpoint: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Webhook ID',
              example: 1
            },
            bank_id: {
              type: 'integer',
              description: 'Bank ID',
              example: 1
            },
            url: {
              type: 'string',
              description: 'Webhook URL',
              example: 'https://bank.com/webhooks'
            },
            events: {
              type: 'array',
              items: { type: 'string' },
              description: 'Events to listen for',
              example: ['transfer_completed', 'transfer_failed']
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive'],
              description: 'Webhook status',
              example: 'active'
            }
          }
        },
        
        // Notification Preferences Schemas
        NotificationPreferences: {
          type: 'object',
          properties: {
            user_id: {
              type: 'integer',
              description: 'User ID',
              example: 1
            },
            email_enabled: {
              type: 'boolean',
              description: 'Email notifications enabled',
              example: true
            },
            sms_enabled: {
              type: 'boolean',
              description: 'SMS notifications enabled',
              example: false
            },
            push_enabled: {
              type: 'boolean',
              description: 'Push notifications enabled',
              example: true
            },
            transfer_notifications: {
              type: 'boolean',
              description: 'Transfer-related notifications',
              example: true
            },
            system_notifications: {
              type: 'boolean',
              description: 'System notifications',
              example: false
            }
          }
        }
      }
    }
  },
  apis: [
    './server.js', 
    './wallet.js', 
    './transfers.js', 
    './banks.js', 
    './users.js', 
    './roles.js', 
    './notifications.js'
  ],
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi,
};