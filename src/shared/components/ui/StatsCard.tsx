import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    label: string;
    value: string | number;
    icon?: LucideIcon;
    iconColor?: string;
    bgColor?: string;
    highlight?: string;
    variant?: 'default' | 'compact';
}

/**
 * StatsCard - Unified statistics card component
 * Used across multiple dashboards to display key metrics
 * 
 * Variants:
 * - default: Icon on right, horizontal layout (Pegawai, Asisten)
 * - compact: Icon on top right, vertical layout (Super Admin)
 */
export function StatsCard({
    label,
    value,
    icon: Icon,
    iconColor = 'text-blue-600',
    bgColor = 'bg-blue-100',
    highlight,
    variant = 'default'
}: StatsCardProps) {
    if (variant === 'compact') {
        // Compact variant - used by Super Admin dashboard
        return (
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-28">
                <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-500">{label}</span>
                    {Icon && <Icon className={`w-5 h-5 ${iconColor}`} />}
                </div>
                <h3 className={`text-3xl font-bold ${highlight || "text-gray-900"}`}>
                    {value}
                </h3>
            </div>
        );
    }

    // Default variant - used by Pegawai and Asisten dashboards
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
                <p className="text-gray-500 text-sm font-medium">{label}</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
            </div>
            {Icon && (
                <div className={`p-3 rounded-lg ${bgColor}`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
            )}
        </div>
    );
}
