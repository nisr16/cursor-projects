export interface FinancialKPI {
  title: string;
  value: string;
  target?: string;
  growth?: string;
  growthType?: 'positive' | 'negative';
  icon?: string;
}

export interface RevenueBreakdown {
  source: string;
  percentage: number;
  amount: number;
  color: string;
}

export interface BankRevenue {
  name: string;
  revenue: number;
  transactions: number;
  avgTransactionValue: number;
}

export interface Transaction {
  id: string;
  bankName: string;
  amount: number;
  fee: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface ChartDataPoint {
  month: string;
  value: number;
  label: string;
}

export interface GrowthMetrics {
  tpv: ChartDataPoint[];
  transactions: ChartDataPoint[];
  newBanks: ChartDataPoint[];
} 