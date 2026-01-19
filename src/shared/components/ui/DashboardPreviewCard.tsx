import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardPreviewCardProps {
    title: string;
    description: string;
    metricCount: number | string;
    icon: LucideIcon;
    iconBg?: string;
    onViewClick?: () => void;
}

/**
 * DashboardPreviewCard - Preview card for dashboard links
 * Used across role dashboards to display available sub-dashboards
 * (e.g., NKO, ULP dashboards)
 */
export function DashboardPreviewCard({
    title,
    description,
    metricCount,
    icon: Icon,
    iconBg = 'bg-blue-600',
    onViewClick
}: DashboardPreviewCardProps) {
    return (
        <div className="flex flex-col justify-between rounded-xl border bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div>
                <div className="flex items-start justify-between">
                    <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg ${iconBg} shadow-sm`}>
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-[10px] sm:text-xs font-medium text-gray-600">
                        {metricCount} Metrics
                    </span>
                </div>
                <h3 className="mt-4 text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
                <p className="mt-1 text-xs sm:text-sm text-gray-500">{description}</p>
            </div>

            <button
                onClick={onViewClick}
                className="mt-6 w-full rounded-md bg-blue-600 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors active:bg-blue-800"
            >
                Lihat Dashboard
            </button>
        </div>
    );
}
