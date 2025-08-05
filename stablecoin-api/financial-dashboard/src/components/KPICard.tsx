import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FinancialKPI } from '../types/financial';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  kpi: FinancialKPI;
}

const KPICard: React.FC<KPICardProps> = ({ kpi }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const kpiType = kpi.title.toLowerCase().replace(/\s+/g, '');
    navigate(`/kpi/${kpiType}`);
  };

  return (
    <div 
      className="metric-card cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-fintech-blue/20"
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{kpi.icon}</span>
          <h3 className="text-sm font-medium text-gray-400">{kpi.title}</h3>
        </div>
        {kpi.growth && (
          <div className={`flex items-center space-x-1 text-xs ${
            kpi.growthType === 'positive' ? 'growth-positive' : 'growth-negative'
          }`}>
            {kpi.growthType === 'positive' ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{kpi.growth}</span>
          </div>
        )}
      </div>
      
      <div className="mb-2">
        <div className="text-2xl font-bold text-white">{kpi.value}</div>
        {kpi.target && (
          <div className="text-xs text-gray-500">
            Target: {kpi.target}
          </div>
        )}
      </div>
    </div>
  );
};

export default KPICard; 