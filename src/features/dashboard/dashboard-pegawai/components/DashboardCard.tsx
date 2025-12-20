// dashboard-pegawai/components/DashboardCard.tsx
import React from 'react';
import { BarChart2, Activity } from 'lucide-react';
import { DashboardItem } from '../types/dashboard';

interface DashboardCardProps {
  data: DashboardItem;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between h-full">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-lg ${data.type === 'nko' ? 'bg-blue-600' : 'bg-green-500'}`}>
             {data.type === 'nko' 
               ? <BarChart2 className="w-6 h-6 text-white" />
               : <Activity className="w-6 h-6 text-white" />
             }
          </div>
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
            {data.metricCount} Metrics
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900">{data.title}</h3>
        <p className="text-sm text-gray-500 mt-2">{data.description}</p>
      </div>
      
      <div className="p-4 border-t border-gray-100">
        <button className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-colors">
          Lihat Dashboard
        </button>
      </div>
    </div>
  );
};

export default DashboardCard;