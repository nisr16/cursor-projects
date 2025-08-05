export interface LiveTransaction {
  id: string;
  bankName: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: string;
  route: string;
  approvalTier?: string;
  processingTime?: number;
}

export interface PendingApproval {
  id: string;
  bankName: string;
  amount: number;
  tier: '$10k' | '$50k' | '$250k+';
  requestedBy: string;
  requestedAt: string;
  urgency: 'low' | 'medium' | 'high';
}

export interface SystemHealth {
  apiResponseTime: number;
  uptime: number;
  activeConnections: number;
  errorRate: number;
  lastUpdated: string;
}

export interface SecurityAlert {
  id: string;
  type: 'auth_failure' | 'suspicious_pattern' | 'rate_limit' | 'geographic_anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  bankName?: string;
  timestamp: string;
  resolved: boolean;
}

export interface BankHealth {
  bankName: string;
  healthScore: number;
  lastSync: string;
  activeUsers: number;
  status: 'online' | 'degraded' | 'offline';
  integrationStatus: 'healthy' | 'warning' | 'error';
}

export interface GeographicFlow {
  from: string;
  to: string;
  volume: number;
  count: number;
}

export interface UsagePattern {
  hour: number;
  volume: number;
  transactions: number;
}

export interface ActiveBank {
  name: string;
  usersOnline: number;
  lastActivity: string;
  status: 'active' | 'idle' | 'offline';
} 