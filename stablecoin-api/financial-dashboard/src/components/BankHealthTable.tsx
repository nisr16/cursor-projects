import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BankHealth } from '../types/operations';
import { Wifi, WifiOff, Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { formatTimeAgo } from '../utils/formatters';

interface BankHealthTableProps {
  banks: BankHealth[];
}

const BankHealthTable: React.FC<BankHealthTableProps> = ({ banks }) => {
  const navigate = useNavigate();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <Wifi className="w-4 h-4 text-fintech-green" />;
      case 'degraded':
        return <Clock className="w-4 h-4 text-fintech-yellow" />;
      case 'offline':
        return <WifiOff className="w-4 h-4 text-fintech-red" />;
      default:
        return <Wifi className="w-4 h-4 text-gray-400" />;
    }
  };

  const getIntegrationIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-fintech-green" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-fintech-yellow" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-fintech-red" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-fintech-green';
    if (score >= 75) return 'text-fintech-yellow';
    return 'text-fintech-red';
  };

  const handleBankClick = (bankName: string) => {
    navigate(`/bank/${encodeURIComponent(bankName)}`);
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Bank Integration Health</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Bank</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Status</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Health Score</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Integration</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Users</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Last Sync</th>
            </tr>
          </thead>
          <tbody>
            {banks.map((bank) => (
              <tr key={bank.bankName} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="py-3 px-4">
                  <span 
                    className="font-medium hover:text-fintech-blue transition-colors cursor-pointer"
                    onClick={() => handleBankClick(bank.bankName)}
                  >
                    {bank.bankName}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    {getStatusIcon(bank.status)}
                    <span className="text-sm capitalize">{bank.status}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`font-medium ${getHealthScoreColor(bank.healthScore)}`}>
                    {bank.healthScore}%
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    {getIntegrationIcon(bank.integrationStatus)}
                    <span className="text-sm capitalize">{bank.integrationStatus}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-sm">{bank.activeUsers}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-sm text-gray-400">
                    {formatTimeAgo(bank.lastSync)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BankHealthTable; 