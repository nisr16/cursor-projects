import React from 'react';
import { PendingApproval } from '../types/operations';
import { formatCurrency, formatTimeAgo } from '../utils/formatters';
import { AlertTriangle, Clock, User } from 'lucide-react';

interface PendingApprovalsProps {
  approvals: PendingApproval[];
}

const PendingApprovals: React.FC<PendingApprovalsProps> = ({ approvals }) => {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'text-fintech-red';
      case 'medium':
        return 'text-fintech-yellow';
      case 'low':
        return 'text-fintech-green';
      default:
        return 'text-gray-400';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case '$250k+':
        return 'bg-fintech-red bg-opacity-20 text-fintech-red';
      case '$50k':
        return 'bg-fintech-yellow bg-opacity-20 text-fintech-yellow';
      case '$10k':
        return 'bg-fintech-green bg-opacity-20 text-fintech-green';
      default:
        return 'bg-gray-600 bg-opacity-20 text-gray-400';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Pending Approvals</h3>
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-fintech-yellow" />
          <span className="text-sm text-gray-400">{approvals.length} pending</span>
        </div>
      </div>
      
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {approvals.map((approval) => (
          <div key={approval.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${getUrgencyColor(approval.urgency)}`}></div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-white">{approval.bankName}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getTierColor(approval.tier)}`}>
                    {approval.tier}
                  </span>
                </div>
                <div className="text-sm text-gray-400 flex items-center space-x-2">
                  <User className="w-3 h-3" />
                  <span>{approval.requestedBy}</span>
                  <span>•</span>
                  <Clock className="w-3 h-3" />
                  <span>{formatTimeAgo(approval.requestedAt)}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium text-white">
                {formatCurrency(approval.amount)}
              </div>
              <div className="text-xs text-gray-400">
                {approval.id}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingApprovals; 