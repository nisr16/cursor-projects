import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BankRevenue } from '../types/financial';
import { formatCurrency, formatNumber } from '../utils/formatters';

interface TopBanksTableProps {
  banks: BankRevenue[];
}

const TopBanksTable: React.FC<TopBanksTableProps> = ({ banks }) => {
  const navigate = useNavigate();

  const handleBankClick = (bankName: string) => {
    navigate(`/bank/${encodeURIComponent(bankName)}`);
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Top Contributing Banks</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Bank</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Revenue</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Transactions</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Avg Value</th>
            </tr>
          </thead>
          <tbody>
            {banks.map((bank, index) => (
              <tr key={bank.name} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-fintech-blue rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <span 
                      className="font-medium hover:text-fintech-blue transition-colors cursor-pointer"
                      onClick={() => handleBankClick(bank.name)}
                    >
                      {bank.name}
                    </span>
                  </div>
                </td>
                <td className="text-right py-3 px-4 font-medium">
                  {formatCurrency(bank.revenue)}
                </td>
                <td className="text-right py-3 px-4 text-gray-300">
                  {formatNumber(bank.transactions)}
                </td>
                <td className="text-right py-3 px-4 text-gray-300">
                  {formatCurrency(bank.avgTransactionValue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopBanksTable; 