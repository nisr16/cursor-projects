import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { RevenueBreakdown } from '../types/financial';
import { formatCurrency } from '../utils/formatters';

interface RevenueBreakdownChartProps {
  data: RevenueBreakdown[];
}

const RevenueBreakdownChart: React.FC<RevenueBreakdownChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-fintech-dark border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{data.source}</p>
          <p className="text-gray-300">{formatCurrency(data.amount)}</p>
          <p className="text-gray-400">{data.percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Revenue Breakdown</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="amount"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry: any) => (
                <span className="text-gray-300">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueBreakdownChart; 