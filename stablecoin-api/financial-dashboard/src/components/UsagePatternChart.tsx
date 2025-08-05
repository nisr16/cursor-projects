import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UsagePattern } from '../types/operations';
import { formatCurrency, formatNumber } from '../utils/formatters';

interface UsagePatternChartProps {
  data: UsagePattern[];
}

const UsagePatternChart: React.FC<UsagePatternChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-fintech-dark border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{data.hour}:00 UTC</p>
          <p className="text-gray-300">{formatCurrency(data.volume)} volume</p>
          <p className="text-gray-400">{formatNumber(data.transactions)} transactions</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Peak Usage Patterns (24h)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="hour" 
              stroke="#9CA3AF"
              fontSize={12}
              tickFormatter={(value) => `${value}:00`}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="volume" 
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UsagePatternChart; 