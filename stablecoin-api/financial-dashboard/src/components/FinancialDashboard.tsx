import React from 'react';
import KPICard from './KPICard';
import RevenueBreakdownChart from './RevenueBreakdownChart';
import TopBanksTable from './TopBanksTable';
import GrowthChart from './GrowthChart';
import RecentTransactions from './RecentTransactions';
import { 
  financialKPIs, 
  revenueBreakdown, 
  topBanks, 
  recentTransactions, 
  growthMetrics 
} from '../data/mockData';
import { formatNumber } from '../utils/formatters';

const FinancialDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-fintech-darker p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Financial Operations Dashboard
        </h1>
        <p className="text-gray-400">
          B2B Stablecoin Banking Platform • Real-time financial performance metrics
        </p>
      </div>

      {/* KPI Cards - Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {financialKPIs.map((kpi, index) => (
          <KPICard key={index} kpi={kpi} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left Column - Revenue Analysis */}
        <div className="space-y-8">
          <RevenueBreakdownChart data={revenueBreakdown} />
          <TopBanksTable banks={topBanks} />
        </div>

        {/* Right Column - Growth Trends */}
        <div className="space-y-8">
          <GrowthChart 
            data={growthMetrics.tpv} 
            title="TPV Trend (Last 12 Months)"
            valueFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
            color="#3b82f6"
          />
          <GrowthChart 
            data={growthMetrics.transactions} 
            title="Transaction Volume Trend"
            valueFormatter={formatNumber}
            color="#10b981"
          />
          <GrowthChart 
            data={growthMetrics.newBanks} 
            title="New Bank Acquisition Rate"
            valueFormatter={formatNumber}
            color="#8b5cf6"
          />
        </div>
      </div>

      {/* Bottom Section - Recent Transactions */}
      <div className="mb-8">
        <RecentTransactions transactions={recentTransactions} />
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
        <div className="bg-fintech-dark rounded-lg p-4 border border-gray-800">
          <div className="text-2xl font-bold text-white">48</div>
          <div className="text-sm text-gray-400">Active Banks</div>
        </div>
        <div className="bg-fintech-dark rounded-lg p-4 border border-gray-800">
          <div className="text-2xl font-bold text-white">75%</div>
          <div className="text-sm text-gray-400">Margin</div>
        </div>
        <div className="bg-fintech-dark rounded-lg p-4 border border-gray-800">
          <div className="text-2xl font-bold text-white">$1.2K</div>
          <div className="text-sm text-gray-400">Avg Revenue/Transaction</div>
        </div>
        <div className="bg-fintech-dark rounded-lg p-4 border border-gray-800">
          <div className="text-2xl font-bold text-white">+67%</div>
          <div className="text-sm text-gray-400">QoQ Growth</div>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard; 