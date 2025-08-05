import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ActiveBank } from '../types/operations';
import { Users, Wifi, WifiOff, Clock } from 'lucide-react';

interface ActiveBanksProps {
  banks: ActiveBank[];
}

const ActiveBanks: React.FC<ActiveBanksProps> = ({ banks }) => {
  const navigate = useNavigate();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Wifi className="w-4 h-4 text-fintech-green" />;
      case 'idle':
        return <Clock className="w-4 h-4 text-fintech-yellow" />;
      case 'offline':
        return <WifiOff className="w-4 h-4 text-gray-400" />;
      default:
        return <Wifi className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-fintech-green';
      case 'idle':
        return 'text-fintech-yellow';
      case 'offline':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  const handleBankClick = (bankName: string) => {
    navigate(`/bank/${encodeURIComponent(bankName)}`);
  };

  const totalUsers = banks.reduce((sum, bank) => sum + bank.usersOnline, 0);
  const activeBanks = banks.filter(bank => bank.status === 'active').length;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Active Banks & Users</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-fintech-blue" />
            <span className="text-sm text-gray-400">{totalUsers} users</span>
          </div>
          <div className="flex items-center space-x-2">
            <Wifi className="w-4 h-4 text-fintech-green" />
            <span className="text-sm text-gray-400">{activeBanks} active</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {banks.map((bank) => (
          <div key={bank.name} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
            <div className="flex items-center space-x-3">
              {getStatusIcon(bank.status)}
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span 
                    className="font-medium text-white hover:text-fintech-blue transition-colors cursor-pointer"
                    onClick={() => handleBankClick(bank.name)}
                  >
                    {bank.name}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(bank.status)} bg-opacity-20`}>
                    {bank.status}
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  {bank.usersOnline} users • {bank.lastActivity}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium text-white">
                {bank.usersOnline}
              </div>
              <div className="text-xs text-gray-400">
                users online
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveBanks; 