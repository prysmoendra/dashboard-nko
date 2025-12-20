// dashboard-pegawai/components/StatCard.tsx
import React from 'react';
import { BarChart3, Zap, Settings, Database } from 'lucide-react';
import { StatItem } from '../types/dashboard';

interface StatCardProps {
  data: StatItem;
}

const StatCard: React.FC<StatCardProps> = ({ data }) => {
  const getIcon = () => {
    switch (data.iconType) {
      case 'chart': return <BarChart3 className="w-6 h-6 text-blue-600" />;
      case 'bolt': return <Zap className="w-6 h-6 text-green-600" />;
      case 'settings': return <Settings className="w-6 h-6 text-orange-600" />;
      case 'database': return <Database className="w-6 h-6 text-purple-600" />;
    }
  };

  const getBgColor = () => {
    switch (data.color) {
      case 'blue': return 'bg-blue-100';
      case 'green': return 'bg-green-100';
      case 'orange': return 'bg-orange-100';
      case 'purple': return 'bg-purple-100';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{data.label}</p>
        <h3 className="text-3xl font-bold text-gray-900 mt-1">{data.value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${getBgColor()}`}>
        {getIcon()}
      </div>
    </div>
  );
};

export default StatCard;