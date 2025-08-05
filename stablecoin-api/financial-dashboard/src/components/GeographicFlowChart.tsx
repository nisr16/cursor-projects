import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GeographicFlow } from '../types/operations';
import { formatCurrency, formatNumber } from '../utils/formatters';

interface GeographicFlowChartProps {
  data: GeographicFlow[];
}

const GeographicFlowChart: React.FC<GeographicFlowChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-fintech-dark border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{data.from} → {data.to}</p>
          <p className="text-gray-300">{formatCurrency(data.volume)}</p>
          <p className="text-gray-400">{formatNumber(data.count)} transactions</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Geographic Flow</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="from" 
              stroke="#9CA3AF"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="volume" 
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GeographicFlowChart; 