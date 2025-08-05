import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Users, Activity, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { formatCurrency, formatTimeAgo } from '../utils/formatters';
import { topBanks } from '../data/mockData';
import { liveTransactions, bankHealth, activeBanks } from '../data/operationsData';

const BankProfile: React.FC = () => {
  const { bankId } = useParams<{ bankId: string }>();
  const navigate = useNavigate();

  // Decode bank ID and find bank data
  const bankName = decodeURIComponent(bankId!);
  const bankData = topBanks.find(bank => bank.name === bankName);
  const bankHealthData = bankHealth.find(bank => bank.bankName === bankName);
  const activeBankData = activeBanks.find(bank => bank.name === bankName);
  
  // Get bank-specific transactions
  const bankTransactions = liveTransactions.filter(tx => tx.bankName === bankName);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-4 h-4 text-fintech-green" />;
      case 'degraded':
        return <AlertCircle className="w-4 h-4 text-fintech-yellow" />;
      case 'offline':
        return <Clock className="w-4 h-4 text-fintech-red" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-fintech-green';
      case 'degraded':
        return 'text-fintech-yellow';
      case 'offline':
        return 'text-fintech-red';
      default:
        return 'text-gray-400';
    }
  };

  if (!bankData) {
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
          <h1 className="text-2xl font-bold mb-4">Bank Not Found</h1>
          <p className="text-gray-400">The requested bank profile is not available.</p>
        </div>
      </div>
    );
  }

  const monthlyData = [
    { month: 'Jan', revenue: 35000, transactions: 180 },
    { month: 'Feb', revenue: 42000, transactions: 220 },
    { month: 'Mar', revenue: 38000, transactions: 195 },
    { month: 'Apr', revenue: 45000, transactions: 240 },
    { month: 'May', revenue: 52000, transactions: 280 },
    { month: 'Jun', revenue: 48000, transactions: 260 },
    { month: 'Jul', revenue: 55000, transactions: 300 },
    { month: 'Aug', revenue: 62000, transactions: 340 },
    { month: 'Sep', revenue: 58000, transactions: 320 },
    { month: 'Oct', revenue: 65000, transactions: 360 },
    { month: 'Nov', revenue: 72000, transactions: 400 },
    { month: 'Dec', revenue: bankData.revenue / 1000, transactions: bankData.transactions }
  ];

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

      {/* Bank Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Building2 className="w-8 h-8 text-fintech-blue" />
          <div>
            <h1 className="text-3xl font-bold text-white">{bankData.name}</h1>
            <p className="text-gray-400">Bank Profile & Performance</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-fintech-dark rounded-lg p-4 border border-gray-800">
            <div className="text-2xl font-bold text-white">{formatCurrency(bankData.revenue)}</div>
            <div className="text-sm text-gray-400">Total Revenue</div>
          </div>
          <div className="bg-fintech-dark rounded-lg p-4 border border-gray-800">
            <div className="text-2xl font-bold text-white">{bankData.transactions.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Transactions</div>
          </div>
          <div className="bg-fintech-dark rounded-lg p-4 border border-gray-800">
            <div className="text-2xl font-bold text-white">{formatCurrency(bankData.avgTransactionValue)}</div>
            <div className="text-sm text-gray-400">Avg Transaction</div>
          </div>
          <div className="bg-fintech-dark rounded-lg p-4 border border-gray-800">
            <div className="flex items-center space-x-2">
              {getStatusIcon(bankHealthData?.status || 'online')}
              <div>
                <div className="text-2xl font-bold text-white">{bankHealthData?.healthScore || 95}%</div>
                <div className="text-sm text-gray-400">Health Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Trend */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Revenue Trend (Last 12 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [formatCurrency(value * 1000), 'Revenue']}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Transaction Volume */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Transaction Volume Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
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
              <Bar dataKey="transactions" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bank Status & Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Bank Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(bankHealthData?.status || 'online')}
                <div>
                  <div className="font-medium text-white">Connection Status</div>
                  <div className="text-sm text-gray-400">
                    {bankHealthData?.lastSync ? formatTimeAgo(bankHealthData.lastSync) : 'Unknown'}
                  </div>
                </div>
              </div>
              <span className={`text-sm px-2 py-1 rounded-full ${getStatusColor(bankHealthData?.status || 'online')} bg-opacity-20`}>
                {bankHealthData?.status || 'online'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Users className="w-4 h-4 text-fintech-blue" />
                <div>
                  <div className="font-medium text-white">Active Users</div>
                  <div className="text-sm text-gray-400">Currently online</div>
                </div>
              </div>
              <span className="text-white font-medium">{activeBankData?.usersOnline || 0}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Activity className="w-4 h-4 text-fintech-green" />
                <div>
                  <div className="font-medium text-white">Integration Health</div>
                  <div className="text-sm text-gray-400">API connectivity</div>
                </div>
              </div>
              <span className={`text-sm px-2 py-1 rounded-full ${
                bankHealthData?.integrationStatus === 'healthy' ? 'text-fintech-green' : 
                bankHealthData?.integrationStatus === 'warning' ? 'text-fintech-yellow' : 'text-fintech-red'
              } bg-opacity-20`}>
                {bankHealthData?.integrationStatus || 'healthy'}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {bankTransactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-white">{transaction.id}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      transaction.status === 'completed' ? 'text-fintech-green' :
                      transaction.status === 'processing' ? 'text-fintech-blue' :
                      transaction.status === 'pending' ? 'text-fintech-yellow' : 'text-fintech-red'
                    } bg-opacity-20`}>
                      {transaction.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {transaction.route} • {formatTimeAgo(transaction.timestamp)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-white">
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-fintech-dark rounded-lg p-4 border border-gray-800">
          <div className="text-sm text-gray-400 mb-1">Success Rate</div>
          <div className="text-xl font-bold text-fintech-green">98.5%</div>
        </div>
        <div className="bg-fintech-dark rounded-lg p-4 border border-gray-800">
          <div className="text-sm text-gray-400 mb-1">Avg Processing Time</div>
          <div className="text-xl font-bold text-white">2.3s</div>
        </div>
        <div className="bg-fintech-dark rounded-lg p-4 border border-gray-800">
          <div className="text-sm text-gray-400 mb-1">Monthly Growth</div>
          <div className="text-xl font-bold text-fintech-green">+12%</div>
        </div>
      </div>
    </div>
  );
};

export default BankProfile; 