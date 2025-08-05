import { FinancialKPI, RevenueBreakdown, BankRevenue, Transaction, GrowthMetrics } from '../types/financial';

export const financialKPIs: FinancialKPI[] = [
  {
    title: 'Total Revenue',
    value: '$2.4M',
    target: '$3M',
    growth: '+23%',
    growthType: 'positive',
    icon: '💰'
  },
  {
    title: 'Net Revenue',
    value: '$1.8M',
    target: '$2.2M',
    growth: '+18%',
    growthType: 'positive',
    icon: '📈'
  },
  {
    title: 'Growth Rate',
    value: '+23%',
    target: '+20%',
    growth: '+3%',
    growthType: 'positive',
    icon: '📊'
  },
  {
    title: 'TPV',
    value: '$240M',
    target: '$250M',
    growth: '+15%',
    growthType: 'positive',
    icon: '💳'
  },
  {
    title: 'Transaction Count',
    value: '12,847',
    target: '15,000',
    growth: '+8%',
    growthType: 'positive',
    icon: '🔄'
  }
];

export const revenueBreakdown: RevenueBreakdown[] = [
  {
    source: 'Transaction Fees',
    percentage: 70,
    amount: 1680000,
    color: '#3b82f6'
  },
  {
    source: 'Membership Fees',
    percentage: 20,
    amount: 480000,
    color: '#10b981'
  },
  {
    source: 'SaaS Tools',
    percentage: 10,
    amount: 240000,
    color: '#8b5cf6'
  }
];

export const topBanks: BankRevenue[] = [
  {
    name: 'Banco Industrial',
    revenue: 450000,
    transactions: 2847,
    avgTransactionValue: 158000
  },
  {
    name: 'HSBC LATAM',
    revenue: 380000,
    transactions: 2156,
    avgTransactionValue: 176000
  },
  {
    name: 'Banco Santander',
    revenue: 320000,
    transactions: 1892,
    avgTransactionValue: 169000
  },
  {
    name: 'BBVA México',
    revenue: 280000,
    transactions: 1654,
    avgTransactionValue: 169000
  },
  {
    name: 'Banco Bradesco',
    revenue: 240000,
    transactions: 1423,
    avgTransactionValue: 169000
  },
  {
    name: 'Itaú Unibanco',
    revenue: 210000,
    transactions: 1245,
    avgTransactionValue: 169000
  },
  {
    name: 'Banco do Brasil',
    revenue: 180000,
    transactions: 1067,
    avgTransactionValue: 169000
  },
  {
    name: 'Banco Galicia',
    revenue: 150000,
    transactions: 889,
    avgTransactionValue: 169000
  },
  {
    name: 'Banco Macro',
    revenue: 120000,
    transactions: 711,
    avgTransactionValue: 169000
  },
  {
    name: 'Banco Credicoop',
    revenue: 90000,
    transactions: 533,
    avgTransactionValue: 169000
  }
];

export const recentTransactions: Transaction[] = [
  {
    id: 'TXN-2024-001',
    bankName: 'Banco Industrial',
    amount: 2500000,
    fee: 12500,
    timestamp: '2024-01-15T14:30:00Z',
    status: 'completed'
  },
  {
    id: 'TXN-2024-002',
    bankName: 'HSBC LATAM',
    amount: 1800000,
    fee: 9000,
    timestamp: '2024-01-15T14:25:00Z',
    status: 'completed'
  },
  {
    id: 'TXN-2024-003',
    bankName: 'Banco Santander',
    amount: 3200000,
    fee: 16000,
    timestamp: '2024-01-15T14:20:00Z',
    status: 'completed'
  },
  {
    id: 'TXN-2024-004',
    bankName: 'BBVA México',
    amount: 1500000,
    fee: 7500,
    timestamp: '2024-01-15T14:15:00Z',
    status: 'completed'
  },
  {
    id: 'TXN-2024-005',
    bankName: 'Banco Bradesco',
    amount: 2800000,
    fee: 14000,
    timestamp: '2024-01-15T14:10:00Z',
    status: 'completed'
  },
  {
    id: 'TXN-2024-006',
    bankName: 'Itaú Unibanco',
    amount: 1900000,
    fee: 9500,
    timestamp: '2024-01-15T14:05:00Z',
    status: 'completed'
  }
];

export const growthMetrics: GrowthMetrics = {
  tpv: [
    { month: 'Jan', value: 180000000, label: 'Jan 2024' },
    { month: 'Feb', value: 195000000, label: 'Feb 2024' },
    { month: 'Mar', value: 210000000, label: 'Mar 2024' },
    { month: 'Apr', value: 225000000, label: 'Apr 2024' },
    { month: 'May', value: 240000000, label: 'May 2024' },
    { month: 'Jun', value: 255000000, label: 'Jun 2024' },
    { month: 'Jul', value: 270000000, label: 'Jul 2024' },
    { month: 'Aug', value: 285000000, label: 'Aug 2024' },
    { month: 'Sep', value: 300000000, label: 'Sep 2024' },
    { month: 'Oct', value: 315000000, label: 'Oct 2024' },
    { month: 'Nov', value: 330000000, label: 'Nov 2024' },
    { month: 'Dec', value: 240000000, label: 'Dec 2024' }
  ],
  transactions: [
    { month: 'Jan', value: 8500, label: 'Jan 2024' },
    { month: 'Feb', value: 9200, label: 'Feb 2024' },
    { month: 'Mar', value: 9900, label: 'Mar 2024' },
    { month: 'Apr', value: 10600, label: 'Apr 2024' },
    { month: 'May', value: 11300, label: 'May 2024' },
    { month: 'Jun', value: 12000, label: 'Jun 2024' },
    { month: 'Jul', value: 12700, label: 'Jul 2024' },
    { month: 'Aug', value: 13400, label: 'Aug 2024' },
    { month: 'Sep', value: 14100, label: 'Sep 2024' },
    { month: 'Oct', value: 14800, label: 'Oct 2024' },
    { month: 'Nov', value: 15500, label: 'Nov 2024' },
    { month: 'Dec', value: 12847, label: 'Dec 2024' }
  ],
  newBanks: [
    { month: 'Jan', value: 12, label: 'Jan 2024' },
    { month: 'Feb', value: 15, label: 'Feb 2024' },
    { month: 'Mar', value: 18, label: 'Mar 2024' },
    { month: 'Apr', value: 22, label: 'Apr 2024' },
    { month: 'May', value: 25, label: 'May 2024' },
    { month: 'Jun', value: 28, label: 'Jun 2024' },
    { month: 'Jul', value: 32, label: 'Jul 2024' },
    { month: 'Aug', value: 35, label: 'Aug 2024' },
    { month: 'Sep', value: 38, label: 'Sep 2024' },
    { month: 'Oct', value: 42, label: 'Oct 2024' },
    { month: 'Nov', value: 45, label: 'Nov 2024' },
    { month: 'Dec', value: 48, label: 'Dec 2024' }
  ]
}; 