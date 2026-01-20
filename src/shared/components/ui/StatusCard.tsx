import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatusCardProps {
    weekNumber: number;
    status: 'submitted' | 'pending';
    icon: LucideIcon;
}

/**
 * StatusCard - Premium status card with border-accent design
 * Used for weekly submission status on Pegawai dashboard
 */
export function StatusCard({ weekNumber, status, icon: Icon }: StatusCardProps) {
    const isSubmitted = status === 'submitted';

    // Design configuration based on status
    const config = isSubmitted
        ? {
            containerBg: 'bg-white',
            borderColor: 'border-emerald-500',
            badgeBg: 'bg-emerald-100',
            badgeText: 'text-emerald-700',
            iconColor: 'text-emerald-300',
            statusText: 'Sudah Dikirim'
        }
        : {
            containerBg: 'bg-white',
            borderColor: 'border-amber-500',
            badgeBg: 'bg-amber-100',
            badgeText: 'text-amber-700',
            iconColor: 'text-amber-300',
            statusText: 'Menunggu Input'
        };

    return (
        <div className={`${config.containerBg} p-6 rounded-xl border-l-4 ${config.borderColor} border-r border-t border-b border-gray-200 shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between">
                {/* Left: Text Content */}
                <div className="flex-1">
                    <p className="text-gray-700 text-sm font-semibold mb-3">
                        Status Laporan Minggu {weekNumber}
                    </p>
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full ${config.badgeBg} ${config.badgeText} text-sm font-semibold`}>
                        {config.statusText}
                    </span>
                </div>

                {/* Right: Faded Icon */}
                <div className="ml-4">
                    <Icon className={`w-12 h-12 ${config.iconColor}`} strokeWidth={1.5} />
                </div>
            </div>
        </div>
    );
}
