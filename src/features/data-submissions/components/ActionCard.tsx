// data-submissions/components/ActionCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { FileWarning, Wrench, Package, MapPin, Target, MessageCircleWarning } from 'lucide-react';
import { ActionItem } from '@/features/data-submissions/types/dashboard';

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
            case 'performance': return <Target className={`${iconClass} text-blue-500`} />;
            case 'monitoring': return <MessageCircleWarning className={`${iconClass} text-amber-500`} />;
        }
    };

    return (
        <Link href={data.href} className="flex flex-col">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center text-center h-full relative">
                {/* Notification Badge */}
                {data.badge !== undefined && data.badge > 0 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                        {data.badge > 99 ? '99+' : data.badge}
                    </div>
                )}

                {getIcon()}
                <h4 className="font-semibold text-gray-900">{data.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{data.description}</p>
            </div>
        </Link>
    );
};

export default ActionCard;
