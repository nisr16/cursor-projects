import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Transaction } from '../types/financial';
import { formatCurrency, formatTimeAgo } from '../utils/formatters';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const navigate = useNavigate();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-fintech-green" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-fintech-yellow" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-fintech-red" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-fintech-green';
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
      <h3 className="text-lg font-semibold mb-4">Recent High-Value Transactions</h3>
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
            <div className="flex items-center space-x-3">
              {getStatusIcon(transaction.status)}
              <div>
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
                </div>
                <div className="text-sm text-gray-400">
                  <span 
                    className="hover:text-fintech-blue transition-colors cursor-pointer"
                    onClick={() => handleTransactionClick(transaction.id)}
                  >
                    {transaction.id}
                  </span>
                  {' • '}
                  {formatTimeAgo(transaction.timestamp)}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium text-white">
                {formatCurrency(transaction.amount)}
              </div>
              <div className="text-sm text-gray-400">
                Fee: {formatCurrency(transaction.fee)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions; 