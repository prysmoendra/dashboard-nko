// dashboard-pegawai/components/ActionCard.tsx
import React from 'react';
import { FileWarning, Wrench, Package, MapPin } from 'lucide-react';
import { ActionItem } from '../types/dashboard';

interface ActionCardProps {
  data: ActionItem;
}

const ActionCard: React.FC<ActionCardProps> = ({ data }) => {
  const getIcon = () => {
    const iconClass = "w-6 h-6 mb-3";
    switch (data.iconType) {
      case 'report': return <FileWarning className={`${iconClass} text-red-500`} />;
      case 'maintenance': return <Wrench className={`${iconClass} text-orange-500`} />;
      case 'warehouse': return <Package className={`${iconClass} text-purple-500`} />;
      case 'activity': return <MapPin className={`${iconClass} text-green-500`} />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center text-center">
      {getIcon()}
      <h4 className="font-semibold text-gray-900">{data.title}</h4>
      <p className="text-xs text-gray-500 mt-1">{data.description}</p>
    </div>
  );
};

export default ActionCard;