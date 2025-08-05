import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, DollarSign, CreditCard, Users, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { formatCurrency } from '../utils/formatters';
import { financialKPIs, revenueBreakdown, growthMetrics } from '../data/mockData';

const KPIDetails: React.FC = () => {
  const { kpiType } = useParams<{ kpiType: string }>();
  const navigate = useNavigate();

  const kpi = financialKPIs.find(k => k.title.toLowerCase().replace(/\s+/g, '') === kpiType);

  const getKpiIcon = (type: string) => {
    switch (type) {
      case 'totalrevenue':
      case 'netrevenue':
        return <DollarSign className="w-6 h-6 text-fintech-green" />;
      case 'tpv':
        return <CreditCard className="w-6 h-6 text-fintech-blue" />;
      case 'transactioncount':
        return <Users className="w-6 h-6 text-fintech-purple" />;
      case 'growthrate':
        return <Activity className="w-6 h-6 text-fintech-yellow" />;
      default:
        return <TrendingUp className="w-6 h-6 text-fintech-blue" />;
    }
  };

  const getChartData = (type: string) => {
    switch (type) {
      case 'tpv':
        return growthMetrics.tpv;
      case 'transactioncount':
        return growthMetrics.transactions;
      case 'growthrate':
        return growthMetrics.newBanks;
      default:
        return growthMetrics.tpv;
    }
  };

  const getRevenueBreakdown = () => {
    return revenueBreakdown.map(item => ({
      name: item.source,
      value: item.amount,
      color: item.color
    }));
  };

  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

  if (!kpi) {
    return (
      <div className="min-h-screen bg-fintech-darker p-6">
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">KPI Not Found</h1>
          <p className="text-gray-400">The requested KPI details are not available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fintech-darker p-6">
      {/* Header with Back Button */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* KPI Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          {getKpiIcon(kpiType!)}
          <div>
            <h1 className="text-3xl font-bold text-white">{kpi.title}</h1>
            <p className="text-gray-400">Detailed breakdown and analysis</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-fintech-dark rounded-lg p-4 border border-gray-800">
            <div className="text-2xl font-bold text-white">{kpi.value}</div>
            <div className="text-sm text-gray-400">Current Value</div>
          </div>
          <div className="bg-fintech-dark rounded-lg p-4 border border-gray-800">
            <div className="text-2xl font-bold text-white">{kpi.target}</div>
            <div className="text-sm text-gray-400">Target</div>
          </div>
          <div className="bg-fintech-dark rounded-lg p-4 border border-gray-800">
            <div className={`text-2xl font-bold ${kpi.growthType === 'positive' ? 'text-fintech-green' : 'text-fintech-red'}`}>
              {kpi.growth}
            </div>
            <div className="text-sm text-gray-400">Growth</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Trend Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Trend Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getChartData(kpiType!)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Breakdown (for revenue KPIs) */}
        {(kpiType === 'totalrevenue' || kpiType === 'netrevenue') && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Revenue Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getRevenueBreakdown()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getRevenueBreakdown().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [formatCurrency(value), 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Transaction Volume Chart (for TPV) */}
        {kpiType === 'tpv' && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Transaction Volume by Bank</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueBreakdown.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="source" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [formatCurrency(value), 'Volume']}
                />
                <Bar dataKey="amount" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-fintech-dark rounded-lg p-4 border border-gray-800">
          <div className="text-sm text-gray-400 mb-1">Monthly Average</div>
          <div className="text-xl font-bold text-white">
            {kpiType === 'tpv' ? '$20M' : kpiType === 'transactioncount' ? '1,070' : '$200K'}
          </div>
        </div>
        <div className="bg-fintech-dark rounded-lg p-4 border border-gray-800">
          <div className="text-sm text-gray-400 mb-1">Peak Value</div>
          <div className="text-xl font-bold text-white">
            {kpiType === 'tpv' ? '$25M' : kpiType === 'transactioncount' ? '1,200' : '$250K'}
          </div>
        </div>
        <div className="bg-fintech-dark rounded-lg p-4 border border-gray-800">
          <div className="text-sm text-gray-400 mb-1">Growth Rate</div>
          <div className="text-xl font-bold text-fintech-green">+15%</div>
        </div>
        <div className="bg-fintech-dark rounded-lg p-4 border border-gray-800">
          <div className="text-sm text-gray-400 mb-1">Forecast</div>
          <div className="text-xl font-bold text-white">
            {kpiType === 'tpv' ? '$30M' : kpiType === 'transactioncount' ? '1,500' : '$300K'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPIDetails; 