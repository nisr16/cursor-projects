import React from 'react';
import { SystemHealth as SystemHealthType } from '../types/operations';
import { Activity, Wifi, AlertTriangle } from 'lucide-react';

interface SystemHealthProps {
  health: SystemHealthType;
}

const SystemHealth: React.FC<SystemHealthProps> = ({ health }) => {
  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99.9) return 'text-fintech-green';
    if (uptime >= 99.5) return 'text-fintech-yellow';
    return 'text-fintech-red';
  };

  const getResponseTimeColor = (responseTime: number) => {
    if (responseTime <= 50) return 'text-fintech-green';
    if (responseTime <= 100) return 'text-fintech-yellow';
    return 'text-fintech-red';
  };

  const getErrorRateColor = (errorRate: number) => {
    if (errorRate <= 0.1) return 'text-fintech-green';
    if (errorRate <= 1.0) return 'text-fintech-yellow';
    return 'text-fintech-red';
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">System Health</h3>
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-fintech-blue" />
          <span className="text-sm text-gray-400">Real-time</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Wifi className="w-4 h-4 text-fintech-green" />
            <span className="text-sm text-gray-400">Uptime</span>
          </div>
          <div className={`text-2xl font-bold ${getUptimeColor(health.uptime)}`}>
            {health.uptime}%
          </div>
          <div className="text-xs text-gray-500">Target: 99.99%</div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-4 h-4 text-fintech-blue" />
            <span className="text-sm text-gray-400">Response Time</span>
          </div>
          <div className={`text-2xl font-bold ${getResponseTimeColor(health.apiResponseTime)}`}>
            {health.apiResponseTime}ms
          </div>
          <div className="text-xs text-gray-500">Target: &lt;50ms</div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Wifi className="w-4 h-4 text-fintech-purple" />
            <span className="text-sm text-gray-400">Connections</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {health.activeConnections.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">Active connections</div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-fintech-red" />
            <span className="text-sm text-gray-400">Error Rate</span>
          </div>
          <div className={`text-2xl font-bold ${getErrorRateColor(health.errorRate)}`}>
            {health.errorRate}%
          </div>
          <div className="text-xs text-gray-500">Target: &lt;0.1%</div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gray-800/30 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Last Updated</span>
          <span className="text-white">{new Date(health.lastUpdated).toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth; 