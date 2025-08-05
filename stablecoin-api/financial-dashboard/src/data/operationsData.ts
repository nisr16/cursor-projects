import { 
  LiveTransaction, 
  PendingApproval, 
  SystemHealth, 
  SecurityAlert, 
  BankHealth, 
  GeographicFlow, 
  UsagePattern, 
  ActiveBank 
} from '../types/operations';

export const liveTransactions: LiveTransaction[] = [
  {
    id: 'TXN-2024-001',
    bankName: 'Banco Industrial',
    amount: 2500000,
    status: 'processing',
    timestamp: '2024-01-15T14:30:00Z',
    route: 'USDC → EUR',
    processingTime: 2.3
  },
  {
    id: 'TXN-2024-002',
    bankName: 'HSBC LATAM',
    amount: 1800000,
    status: 'pending',
    timestamp: '2024-01-15T14:29:00Z',
    route: 'USDT → BRL',
    approvalTier: '$250k+'
  },
  {
    id: 'TXN-2024-003',
    bankName: 'Banco Santander',
    amount: 3200000,
    status: 'completed',
    timestamp: '2024-01-15T14:28:00Z',
    route: 'USDC → MXN',
    processingTime: 1.8
  },
  {
    id: 'TXN-2024-004',
    bankName: 'BBVA México',
    amount: 1500000,
    status: 'processing',
    timestamp: '2024-01-15T14:27:00Z',
    route: 'USDT → ARS',
    processingTime: 3.1
  },
  {
    id: 'TXN-2024-005',
    bankName: 'Banco Bradesco',
    amount: 2800000,
    status: 'pending',
    timestamp: '2024-01-15T14:26:00Z',
    route: 'USDC → CLP',
    approvalTier: '$250k+'
  },
  {
    id: 'TXN-2024-006',
    bankName: 'Itaú Unibanco',
    amount: 1900000,
    status: 'completed',
    timestamp: '2024-01-15T14:25:00Z',
    route: 'USDT → COP',
    processingTime: 2.1
  },
  {
    id: 'TXN-2024-007',
    bankName: 'Banco do Brasil',
    amount: 1200000,
    status: 'failed',
    timestamp: '2024-01-15T14:24:00Z',
    route: 'USDC → PEN'
  },
  {
    id: 'TXN-2024-008',
    bankName: 'Banco Galicia',
    amount: 900000,
    status: 'processing',
    timestamp: '2024-01-15T14:23:00Z',
    route: 'USDT → UYU',
    processingTime: 1.5
  },
  {
    id: 'TXN-2024-009',
    bankName: 'Banco Macro',
    amount: 2100000,
    status: 'pending',
    timestamp: '2024-01-15T14:22:00Z',
    route: 'USDC → VES',
    approvalTier: '$250k+'
  },
  {
    id: 'TXN-2024-010',
    bankName: 'Banco Credicoop',
    amount: 750000,
    status: 'completed',
    timestamp: '2024-01-15T14:21:00Z',
    route: 'USDT → GTQ',
    processingTime: 1.9
  }
];

export const pendingApprovals: PendingApproval[] = [
  {
    id: 'APP-2024-001',
    bankName: 'HSBC LATAM',
    amount: 3200000,
    tier: '$250k+',
    requestedBy: 'Maria Rodriguez',
    requestedAt: '2024-01-15T14:25:00Z',
    urgency: 'high'
  },
  {
    id: 'APP-2024-002',
    bankName: 'Banco Bradesco',
    amount: 2800000,
    tier: '$250k+',
    requestedBy: 'Carlos Silva',
    requestedAt: '2024-01-15T14:20:00Z',
    urgency: 'high'
  },
  {
    id: 'APP-2024-003',
    bankName: 'Banco Macro',
    amount: 2100000,
    tier: '$250k+',
    requestedBy: 'Ana Martinez',
    requestedAt: '2024-01-15T14:15:00Z',
    urgency: 'medium'
  },
  {
    id: 'APP-2024-004',
    bankName: 'Banco Industrial',
    amount: 850000,
    tier: '$50k',
    requestedBy: 'Luis Gonzalez',
    requestedAt: '2024-01-15T14:10:00Z',
    urgency: 'low'
  },
  {
    id: 'APP-2024-005',
    bankName: 'BBVA México',
    amount: 450000,
    tier: '$50k',
    requestedBy: 'Patricia Lopez',
    requestedAt: '2024-01-15T14:05:00Z',
    urgency: 'low'
  }
];

export const systemHealth: SystemHealth = {
  apiResponseTime: 45,
  uptime: 99.99,
  activeConnections: 1247,
  errorRate: 0.02,
  lastUpdated: '2024-01-15T14:30:00Z'
};

export const securityAlerts: SecurityAlert[] = [
  {
    id: 'SEC-2024-001',
    type: 'auth_failure',
    severity: 'medium',
    description: 'Multiple failed login attempts from Banco Industrial',
    bankName: 'Banco Industrial',
    timestamp: '2024-01-15T14:28:00Z',
    resolved: false
  },
  {
    id: 'SEC-2024-002',
    type: 'suspicious_pattern',
    severity: 'high',
    description: 'Unusual transaction pattern detected from HSBC LATAM',
    bankName: 'HSBC LATAM',
    timestamp: '2024-01-15T14:25:00Z',
    resolved: false
  },
  {
    id: 'SEC-2024-003',
    type: 'rate_limit',
    severity: 'low',
    description: 'API rate limit exceeded for Banco Santander',
    bankName: 'Banco Santander',
    timestamp: '2024-01-15T14:20:00Z',
    resolved: true
  },
  {
    id: 'SEC-2024-004',
    type: 'geographic_anomaly',
    severity: 'medium',
    description: 'Transaction from unexpected location',
    bankName: 'BBVA México',
    timestamp: '2024-01-15T14:15:00Z',
    resolved: false
  }
];

export const bankHealth: BankHealth[] = [
  {
    bankName: 'Banco Industrial',
    healthScore: 98,
    lastSync: '2024-01-15T14:30:00Z',
    activeUsers: 45,
    status: 'online',
    integrationStatus: 'healthy'
  },
  {
    bankName: 'HSBC LATAM',
    healthScore: 95,
    lastSync: '2024-01-15T14:29:00Z',
    activeUsers: 32,
    status: 'online',
    integrationStatus: 'healthy'
  },
  {
    bankName: 'Banco Santander',
    healthScore: 87,
    lastSync: '2024-01-15T14:28:00Z',
    activeUsers: 28,
    status: 'degraded',
    integrationStatus: 'warning'
  },
  {
    bankName: 'BBVA México',
    healthScore: 92,
    lastSync: '2024-01-15T14:27:00Z',
    activeUsers: 23,
    status: 'online',
    integrationStatus: 'healthy'
  },
  {
    bankName: 'Banco Bradesco',
    healthScore: 89,
    lastSync: '2024-01-15T14:26:00Z',
    activeUsers: 19,
    status: 'online',
    integrationStatus: 'healthy'
  },
  {
    bankName: 'Itaú Unibanco',
    healthScore: 94,
    lastSync: '2024-01-15T14:25:00Z',
    activeUsers: 16,
    status: 'online',
    integrationStatus: 'healthy'
  },
  {
    bankName: 'Banco do Brasil',
    healthScore: 76,
    lastSync: '2024-01-15T14:24:00Z',
    activeUsers: 12,
    status: 'degraded',
    integrationStatus: 'error'
  },
  {
    bankName: 'Banco Galicia',
    healthScore: 91,
    lastSync: '2024-01-15T14:23:00Z',
    activeUsers: 8,
    status: 'online',
    integrationStatus: 'healthy'
  }
];

export const geographicFlows: GeographicFlow[] = [
  { from: 'Brazil', to: 'United States', volume: 45000000, count: 234 },
  { from: 'Mexico', to: 'United States', volume: 38000000, count: 189 },
  { from: 'Argentina', to: 'United States', volume: 32000000, count: 156 },
  { from: 'Colombia', to: 'United States', volume: 28000000, count: 134 },
  { from: 'Chile', to: 'United States', volume: 24000000, count: 98 },
  { from: 'Peru', to: 'United States', volume: 18000000, count: 76 },
  { from: 'Uruguay', to: 'United States', volume: 12000000, count: 45 },
  { from: 'Paraguay', to: 'United States', volume: 8000000, count: 32 }
];

export const usagePatterns: UsagePattern[] = [
  { hour: 0, volume: 12000000, transactions: 45 },
  { hour: 1, volume: 8000000, transactions: 32 },
  { hour: 2, volume: 6000000, transactions: 28 },
  { hour: 3, volume: 5000000, transactions: 25 },
  { hour: 4, volume: 4000000, transactions: 22 },
  { hour: 5, volume: 3000000, transactions: 18 },
  { hour: 6, volume: 5000000, transactions: 24 },
  { hour: 7, volume: 8000000, transactions: 35 },
  { hour: 8, volume: 15000000, transactions: 68 },
  { hour: 9, volume: 25000000, transactions: 95 },
  { hour: 10, volume: 35000000, transactions: 124 },
  { hour: 11, volume: 42000000, transactions: 156 },
  { hour: 12, volume: 45000000, transactions: 178 },
  { hour: 13, volume: 48000000, transactions: 189 },
  { hour: 14, volume: 52000000, transactions: 201 },
  { hour: 15, volume: 55000000, transactions: 215 },
  { hour: 16, volume: 58000000, transactions: 228 },
  { hour: 17, volume: 52000000, transactions: 198 },
  { hour: 18, volume: 45000000, transactions: 167 },
  { hour: 19, volume: 38000000, transactions: 145 },
  { hour: 20, volume: 32000000, transactions: 123 },
  { hour: 21, volume: 28000000, transactions: 98 },
  { hour: 22, volume: 20000000, transactions: 76 },
  { hour: 23, volume: 15000000, transactions: 58 }
];

export const activeBanks: ActiveBank[] = [
  { name: 'Banco Industrial', usersOnline: 45, lastActivity: '2m ago', status: 'active' },
  { name: 'HSBC LATAM', usersOnline: 32, lastActivity: '1m ago', status: 'active' },
  { name: 'Banco Santander', usersOnline: 28, lastActivity: '5m ago', status: 'active' },
  { name: 'BBVA México', usersOnline: 23, lastActivity: '3m ago', status: 'active' },
  { name: 'Banco Bradesco', usersOnline: 19, lastActivity: '1m ago', status: 'active' },
  { name: 'Itaú Unibanco', usersOnline: 16, lastActivity: '4m ago', status: 'active' },
  { name: 'Banco do Brasil', usersOnline: 12, lastActivity: '10m ago', status: 'idle' },
  { name: 'Banco Galicia', usersOnline: 8, lastActivity: '2m ago', status: 'active' },
  { name: 'Banco Macro', usersOnline: 6, lastActivity: '7m ago', status: 'idle' },
  { name: 'Banco Credicoop', usersOnline: 4, lastActivity: '15m ago', status: 'idle' }
]; 