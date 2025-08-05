import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LiveTransaction } from '../types/operations';
import { formatCurrency, formatTimeAgo } from '../utils/formatters';
import { Clock, CheckCircle, XCircle, Loader, AlertCircle } from 'lucide-react';

interface LiveTransactionFeedProps {
  transactions: LiveTransaction[];
}

const LiveTransactionFeed: React.FC<LiveTransactionFeedProps> = ({ transactions }) => {
  const navigate = useNavigate();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-fintech-green" />;
      case 'processing':
        return <Loader className="w-4 h-4 text-fintech-blue animate-spin" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-fintech-yellow" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-fintech-red" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
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

  const handleBankClick = (bankName: string) => {
    navigate(`/bank/${encodeURIComponent(bankName)}`);
  };

  const handleTransactionClick = (transactionId: string) => {
    navigate(`/transaction/${transactionId}`);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Live Transaction Feed</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-fintech-green rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-400">Live</span>
        </div>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
            <div className="flex items-center space-x-3">
              {getStatusIcon(transaction.status)}
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span 
                    className="font-medium text-white hover:text-fintech-blue transition-colors cursor-pointer"
                    onClick={() => handleBankClick(transaction.bankName)}
                  >
                    {transaction.bankName}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.status)} bg-opacity-20`}>
                    {transaction.status}
                  </span>
                  {transaction.approvalTier && (
                    <span className="text-xs px-2 py-1 rounded-full bg-fintech-purple bg-opacity-20 text-fintech-purple">
                      {transaction.approvalTier}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-400">
                  {transaction.route} • {formatTimeAgo(transaction.timestamp)}
                </div>
                {transaction.processingTime && (
                  <div className="text-xs text-gray-500">
                    Processing: {transaction.processingTime}s
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium text-white">
                {formatCurrency(transaction.amount)}
              </div>
              <div 
                className="text-xs text-gray-400 hover:text-fintech-blue transition-colors cursor-pointer"
                onClick={() => handleTransactionClick(transaction.id)}
              >
                {transaction.id}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveTransactionFeed; 