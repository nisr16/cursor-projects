import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, XCircle, Loader, AlertCircle, DollarSign, Building2, User, Timer } from 'lucide-react';
import { formatCurrency, formatTimeAgo } from '../utils/formatters';
import { liveTransactions } from '../data/operationsData';
import { recentTransactions, topBanks } from '../data/mockData';

const TransactionDetails: React.FC = () => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();

  // Find transaction data
  const liveTransaction = liveTransactions.find(tx => tx.id === transactionId);
  const recentTransaction = recentTransactions.find(tx => tx.id === transactionId);
  const transaction = liveTransaction || recentTransaction;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-fintech-green" />;
      case 'processing':
        return <Loader className="w-5 h-5 text-fintech-blue animate-spin" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-fintech-yellow" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-fintech-red" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-fintech-green';
      case 'processing':
        return 'text-fintech-blue';
      case 'pending':
        return 'text-fintech-yellow';
      case 'failed':
        return 'text-fintech-red';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-fintech-green bg-opacity-20';
      case 'processing':
        return 'bg-fintech-blue bg-opacity-20';
      case 'pending':
        return 'bg-fintech-yellow bg-opacity-20';
      case 'failed':
        return 'bg-fintech-red bg-opacity-20';
      default:
        return 'bg-gray-400 bg-opacity-20';
    }
  };

  const timelineEvents = [
    {
      time: '2024-01-15T14:30:00Z',
      event: 'Transaction Initiated',
      description: 'Bank initiated the transaction',
      status: 'completed'
    },
    {
      time: '2024-01-15T14:30:05Z',
      event: 'Validation Started',
      description: 'System validation in progress',
      status: 'completed'
    },
    {
      time: '2024-01-15T14:30:12Z',
      event: 'Compliance Check',
      description: 'AML/KYC verification passed',
      status: 'completed'
    },
    {
      time: '2024-01-15T14:30:18Z',
      event: 'Approval Required',
      description: transaction?.status === 'pending' ? 'Awaiting manual approval' : 'Auto-approved',
      status: transaction?.status === 'pending' ? 'pending' : 'completed'
    },
    {
      time: '2024-01-15T14:30:25Z',
      event: 'Processing',
      description: transaction?.status === 'processing' ? 'Currently processing' : 'Processing completed',
      status: transaction?.status === 'processing' ? 'processing' : 'completed'
    },
    {
      time: '2024-01-15T14:30:32Z',
      event: transaction?.status === 'completed' ? 'Transaction Completed' : 
             transaction?.status === 'failed' ? 'Transaction Failed' : 'In Progress',
      description: transaction?.status === 'completed' ? 'Successfully processed' :
                  transaction?.status === 'failed' ? 'Failed due to insufficient funds' : 'Processing...',
      status: transaction?.status || 'pending'
    }
  ];

  if (!transaction) {
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
          <h1 className="text-2xl font-bold mb-4">Transaction Not Found</h1>
          <p className="text-gray-400">The requested transaction details are not available.</p>
        </div>
      </div>
    );
  }

  const bankData = topBanks.find(bank => bank.name === transaction.bankName);
  const fee = transaction.amount * 0.005; // 0.5% fee

  // Check if transaction has processingTime property (LiveTransaction type)
  const processingTime = 'processingTime' in transaction ? transaction.processingTime : undefined;

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

      {/* Transaction Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <DollarSign className="w-8 h-8 text-fintech-green" />
          <div>
            <h1 className="text-3xl font-bold text-white">{transaction.id}</h1>
            <p className="text-gray-400">Transaction Details & Timeline</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-fintech-dark rounded-lg p-4 border border-gray-800">
            <div className="text-2xl font-bold text-white">{formatCurrency(transaction.amount)}</div>
            <div className="text-sm text-gray-400">Transaction Amount</div>
          </div>
          <div className="bg-fintech-dark rounded-lg p-4 border border-gray-800">
            <div className="text-2xl font-bold text-white">{formatCurrency(fee)}</div>
            <div className="text-sm text-gray-400">Processing Fee</div>
          </div>
          <div className="bg-fintech-dark rounded-lg p-4 border border-gray-800">
            <div className="flex items-center space-x-2">
              {getStatusIcon(transaction.status)}
              <div>
                <div className="text-2xl font-bold text-white capitalize">{transaction.status}</div>
                <div className="text-sm text-gray-400">Status</div>
              </div>
            </div>
          </div>
          <div className="bg-fintech-dark rounded-lg p-4 border border-gray-800">
            <div className="text-2xl font-bold text-white">
              {processingTime ? `${processingTime}s` : 'N/A'}
            </div>
            <div className="text-sm text-gray-400">Processing Time</div>
          </div>
        </div>
      </div>

      {/* Transaction Details & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Transaction Information */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Transaction Information</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Building2 className="w-4 h-4 text-fintech-blue" />
                <div>
                  <div className="font-medium text-white">Bank</div>
                  <div className="text-sm text-gray-400">{transaction.bankName}</div>
                </div>
              </div>
              <button
                onClick={() => navigate(`/bank/${encodeURIComponent(transaction.bankName)}`)}
                className="text-fintech-blue hover:text-fintech-blue-light transition-colors"
              >
                View Profile
              </button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-fintech-yellow" />
                <div>
                  <div className="font-medium text-white">Timestamp</div>
                  <div className="text-sm text-gray-400">{formatTimeAgo(transaction.timestamp)}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <DollarSign className="w-4 h-4 text-fintech-green" />
                <div>
                  <div className="font-medium text-white">Route</div>
                  <div className="text-sm text-gray-400">
                    {('route' in transaction) ? transaction.route : 'USDC → Local Currency'}
                  </div>
                </div>
              </div>
            </div>

            {('approvalTier' in transaction) && (
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-fintech-purple" />
                  <div>
                    <div className="font-medium text-white">Approval Tier</div>
                    <div className="text-sm text-gray-400">{transaction.approvalTier}</div>
                  </div>
                </div>
              </div>
            )}

            {bankData && (
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Timer className="w-4 h-4 text-fintech-blue" />
                  <div>
                    <div className="font-medium text-white">Avg Processing Time</div>
                    <div className="text-sm text-gray-400">2.3s (Bank Average)</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Transaction Timeline</h3>
          <div className="space-y-4">
            {timelineEvents.map((event, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(event.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-white">{event.event}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusBgColor(event.status)} ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">{event.description}</div>
                  <div className="text-xs text-gray-500 mt-1">{formatTimeAgo(event.time)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-fintech-dark rounded-lg p-4 border border-gray-800">
          <div className="text-sm text-gray-400 mb-1">Success Rate</div>
          <div className="text-xl font-bold text-fintech-green">99.2%</div>
        </div>
        <div className="bg-fintech-dark rounded-lg p-4 border border-gray-800">
          <div className="text-sm text-gray-400 mb-1">Similar Transactions</div>
          <div className="text-xl font-bold text-white">1,247</div>
        </div>
        <div className="bg-fintech-dark rounded-lg p-4 border border-gray-800">
          <div className="text-sm text-gray-400 mb-1">Risk Score</div>
          <div className="text-xl font-bold text-fintech-green">Low</div>
        </div>
      </div>

      {/* Related Transactions */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Recent Similar Transactions</h3>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {liveTransactions
            .filter(tx => tx.bankName === transaction.bankName && tx.id !== transaction.id)
            .slice(0, 5)
            .map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors cursor-pointer"
                   onClick={() => navigate(`/transaction/${tx.id}`)}>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-white">{tx.id}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      tx.status === 'completed' ? 'text-fintech-green' :
                      tx.status === 'processing' ? 'text-fintech-blue' :
                      tx.status === 'pending' ? 'text-fintech-yellow' : 'text-fintech-red'
                    } bg-opacity-20`}>
                      {tx.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {('route' in tx) ? tx.route : 'USDC → Local Currency'} • {formatTimeAgo(tx.timestamp)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-white">
                    {formatCurrency(tx.amount)}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;