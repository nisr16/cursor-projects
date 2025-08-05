import React from 'react';
import { SecurityAlert } from '../types/operations';
import { Shield, AlertTriangle, XCircle, Clock, CheckCircle } from 'lucide-react';
import { formatTimeAgo } from '../utils/formatters';

interface SecurityAlertsProps {
  alerts: SecurityAlert[];
}

const SecurityAlerts: React.FC<SecurityAlertsProps> = ({ alerts }) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-4 h-4 text-fintech-red" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-fintech-red" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-fintech-yellow" />;
      case 'low':
        return <Clock className="w-4 h-4 text-fintech-blue" />;
      default:
        return <Shield className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-fintech-red bg-fintech-red bg-opacity-20';
      case 'high':
        return 'text-fintech-red bg-fintech-red bg-opacity-20';
      case 'medium':
        return 'text-fintech-yellow bg-fintech-yellow bg-opacity-20';
      case 'low':
        return 'text-fintech-blue bg-fintech-blue bg-opacity-20';
      default:
        return 'text-gray-400 bg-gray-600 bg-opacity-20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'auth_failure':
        return <Shield className="w-3 h-3" />;
      case 'suspicious_pattern':
        return <AlertTriangle className="w-3 h-3" />;
      case 'rate_limit':
        return <Clock className="w-3 h-3" />;
      case 'geographic_anomaly':
        return <XCircle className="w-3 h-3" />;
      default:
        return <Shield className="w-3 h-3" />;
    }
  };

  const unresolvedAlerts = alerts.filter(alert => !alert.resolved);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Security Alerts</h3>
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-fintech-red" />
          <span className="text-sm text-gray-400">{unresolvedAlerts.length} active</span>
        </div>
      </div>
      
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {alerts.map((alert) => (
          <div key={alert.id} className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
            alert.resolved ? 'bg-gray-800/30' : 'bg-gray-800/50 hover:bg-gray-800/70'
          }`}>
            {getSeverityIcon(alert.severity)}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(alert.severity)}`}>
                  {alert.severity.toUpperCase()}
                </span>
                {alert.resolved && (
                  <span className="text-xs px-2 py-1 rounded-full bg-fintech-green bg-opacity-20 text-fintech-green">
                    RESOLVED
                  </span>
                )}
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  {getTypeIcon(alert.type)}
                  <span>{alert.type.replace('_', ' ')}</span>
                </div>
              </div>
              <div className="text-sm text-white mb-1">
                {alert.description}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{alert.bankName || 'System-wide'}</span>
                <span>{formatTimeAgo(alert.timestamp)}</span>
              </div>
            </div>
            {alert.resolved && (
              <CheckCircle className="w-4 h-4 text-fintech-green mt-1" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityAlerts; 