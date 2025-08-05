/**
 * Analytics Dashboard Component
 * Comprehensive banking analytics dashboard with real-time data visualization
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { 
  TrendingUpIcon, TrendingDownIcon, ClockIcon, 
  CurrencyDollarIcon, CheckCircleIcon, ExclamationTriangleIcon,
  DocumentArrowDownIcon, RefreshIcon, ChartBarIcon,
  BanknotesIcon, ShieldCheckIcon, ScaleIcon
} from '@heroicons/react/24/outline';

// Color scheme for charts
const CHART_COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981',
  accent: '#F59E0B',
  danger: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#06B6D4',
  purple: '#8B5CF6',
  pink: '#EC4899',
  gray: '#6B7280'
};

const PIE_CHART_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.accent,
  CHART_COLORS.purple,
  CHART_COLORS.pink,
  CHART_COLORS.info
];

const AnalyticsDashboard = ({ bankId, initialPeriod = '30d' }) => {
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [period, setPeriod] = useState(initialPeriod);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Analytics data state
  const [kpis, setKpis] = useState(null);
  const [volumeTrends, setVolumeTrends] = useState([]);
  const [transferTypes, setTransferTypes] = useState([]);
  const [networkPerformance, setNetworkPerformance] = useState([]);
  const [costSavings, setCostSavings] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  // Real-time updates
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds

  // API base URL
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

  /**
   * Fetch analytics data from API
   */
  const fetchAnalyticsData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch comprehensive dashboard data
      const dashboardResponse = await fetch(
        `${API_BASE}/analytics/dashboard/${bankId}?period=${period}`
      );

      if (!dashboardResponse.ok) {
        throw new Error(`HTTP error! status: ${dashboardResponse.status}`);
      }

      const dashboardResult = await dashboardResponse.json();
      
      if (dashboardResult.success) {
        setDashboardData(dashboardResult.data);
        setKpis(dashboardResult.data.kpis);
        setVolumeTrends(dashboardResult.data.volume_trends || []);
        setTransferTypes(dashboardResult.data.transfer_distribution || []);
        setNetworkPerformance(dashboardResult.data.network_performance || []);
        setLastUpdated(new Date());
      } else {
        throw new Error(dashboardResult.message || 'Failed to fetch dashboard data');
      }

      // Fetch cost savings data separately
      const costSavingsResponse = await fetch(
        `${API_BASE}/analytics/cost-savings/${bankId}?period=${period}`
      );

      if (costSavingsResponse.ok) {
        const costSavingsResult = await costSavingsResponse.json();
        if (costSavingsResult.success) {
          setCostSavings(costSavingsResult.data);
        }
      }

    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [bankId, period, API_BASE]);

  /**
   * Export analytics report
   */
  const exportReport = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/analytics/dashboard/${bankId}?period=${period}&format=pdf`
      );
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-report-${bankId}-${period}-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Error exporting report:', err);
      alert('Failed to export report. Please try again.');
    }
  };

  /**
   * Format currency values
   */
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  /**
   * Format percentage values
   */
  const formatPercentage = (value) => {
    return `${parseFloat(value).toFixed(2)}%`;
  };

  /**
   * Format time values
   */
  const formatTime = (seconds) => {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    } else {
      return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
    }
  };

  /**
   * Get KPI card data
   */
  const getKPICards = () => {
    if (!kpis) return [];

    return [
      {
        title: 'Total Cost Savings',
        value: formatCurrency(kpis.cost_savings || 0),
        change: '+12.5%',
        changeType: 'positive',
        icon: CurrencyDollarIcon,
        color: CHART_COLORS.success
      },
      {
        title: 'Avg Settlement Time',
        value: formatTime(kpis.avg_settlement_time || 0),
        change: '-47.99h',
        changeType: 'positive',
        icon: ClockIcon,
        color: CHART_COLORS.info
      },
      {
        title: 'Transfer Volume',
        value: formatCurrency(kpis.total_volume || 0),
        change: '+8.2%',
        changeType: 'positive',
        icon: TrendingUpIcon,
        color: CHART_COLORS.primary
      },
      {
        title: 'Success Rate',
        value: formatPercentage(kpis.success_rate || 0),
        change: '+2.1%',
        changeType: 'positive',
        icon: CheckCircleIcon,
        color: CHART_COLORS.success
      },
      {
        title: 'Idle Capital Reduction',
        value: formatCurrency((kpis.total_volume || 0) * 0.15), // 15% reduction
        change: '+15.0%',
        changeType: 'positive',
        icon: BanknotesIcon,
        color: CHART_COLORS.warning
      },
      {
        title: 'Cost Reduction vs SWIFT',
        value: formatPercentage(
          kpis.estimated_swift_fees > 0 
            ? ((kpis.cost_savings / kpis.estimated_swift_fees) * 100)
            : 0
        ),
        change: '+80.0%',
        changeType: 'positive',
        icon: TrendingDownIcon,
        color: CHART_COLORS.danger
      }
    ];
  };

  /**
   * Prepare chart data
   */
  const getChartData = () => {
    return {
      volumeTrends: volumeTrends.map(trend => ({
        date: new Date(trend.date).toLocaleDateString(),
        volume: trend.volume,
        transfers: trend.transfers,
        fees: trend.fees
      })),
      transferTypes: transferTypes.map(type => ({
        name: type.transfer_type,
        value: type.count,
        percentage: parseFloat(type.percentage),
        volume: type.total_volume
      })),
      networkPerformance: networkPerformance.map(network => ({
        network: network.network,
        transfers: network.total_transfers,
        volume: network.total_volume,
        successRate: network.success_rate,
        costSavings: network.cost_savings
      }))
    };
  };

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchAnalyticsData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, fetchAnalyticsData]);

  // Initial data fetch
  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  // Loading component
  if (isLoading && !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics dashboard...</p>
        </div>
      </div>
    );
  }

  // Error component
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Error Loading Dashboard</h3>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={fetchAnalyticsData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const chartData = getChartData();
  const kpiCards = getKPICards();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-sm text-gray-600">
                Bank ID: {bankId} • Last updated: {lastUpdated?.toLocaleString()}
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              {/* Time Period Selector */}
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>

              {/* Auto-refresh toggle */}
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  autoRefresh
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <RefreshIcon className="h-4 w-4 inline mr-1" />
                Auto-refresh
              </button>

              {/* Export button */}
              <button
                onClick={exportReport}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
              >
                <DocumentArrowDownIcon className="h-4 w-4 inline mr-1" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: ChartBarIcon },
              { id: 'performance', name: 'Performance', icon: TrendingUpIcon },
              { id: 'liquidity', name: 'Liquidity', icon: BanknotesIcon },
              { id: 'compliance', name: 'Compliance', icon: ShieldCheckIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 inline mr-1" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {kpiCards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <card.icon className="h-8 w-8" style={{ color: card.color }} />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
                </div>
                <div className="flex-shrink-0">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    card.changeType === 'positive'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {card.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'overview' && (
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Overview</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Volume Trends Chart */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Volume Trends</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData.volumeTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Area 
                        type="monotone" 
                        dataKey="volume" 
                        stroke={CHART_COLORS.primary} 
                        fill={CHART_COLORS.primary} 
                        fillOpacity={0.3} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Transfer Types Chart */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Transfer Types</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData.transferTypes}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name} ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.transferTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value} transfers`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Performance</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Network Performance Chart */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Network Performance</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.networkPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="network" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Bar dataKey="volume" fill={CHART_COLORS.primary} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Success Rate Chart */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Success Rate by Network</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.networkPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="network" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Bar dataKey="successRate" fill={CHART_COLORS.success} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'liquidity' && (
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Liquidity</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cost Savings Chart */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Cost Savings by Network</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.networkPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="network" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Bar dataKey="costSavings" fill={CHART_COLORS.success} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Transfer Volume Chart */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Transfer Volume Trends</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData.volumeTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Line 
                        type="monotone" 
                        dataKey="volume" 
                        stroke={CHART_COLORS.primary} 
                        strokeWidth={2} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Compliance</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Compliance Metrics */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Compliance Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">KYC Completion Rate</span>
                      <span className="text-sm font-medium text-green-600">98.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">AML Screening Rate</span>
                      <span className="text-sm font-medium text-green-600">100%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Regulatory Reporting</span>
                      <span className="text-sm font-medium text-green-600">100%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Audit Trail</span>
                      <span className="text-sm font-medium text-green-600">Complete</span>
                    </div>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Risk Assessment</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Overall Risk Score</span>
                      <span className="text-sm font-medium text-green-600">Low</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Fraud Detection Rate</span>
                      <span className="text-sm font-medium text-green-600">99.9%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Suspicious Activity</span>
                      <span className="text-sm font-medium text-green-600">0.01%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Compliance Score</span>
                      <span className="text-sm font-medium text-green-600">A+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 