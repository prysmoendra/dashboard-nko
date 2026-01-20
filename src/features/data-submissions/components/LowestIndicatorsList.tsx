'use client';

import React from 'react';
import { TrendingDown } from 'lucide-react';

interface LowestIndicatorsListProps {
    data: Array<{ indicatorName: string; achievementPercentage: number }>;
}

export function LowestIndicatorsList({ data }: LowestIndicatorsListProps) {
    // Show empty state if no data
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex flex-col">
                <div className="flex flex-col justify-start items-start mb-8">
                    <div className="flex flex-row items-center gap-2">
                        <TrendingDown className="w-5 h-5 text-orange-600" />
                        <h3 className="text-lg font-semibold text-gray-900">5 Indikator Terendah</h3>
                    </div>
                    <p className="text-sm text-gray-500">Indikator dengan persentase capaian terendah</p>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                    <p className="text-sm text-center">Belum ada data indikator</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex flex-col">
            <div className="flex flex-col justify-start items-start mb-8">
                <div className="flex flex-row items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-orange-600" />
                    <h3 className="text-lg font-semibold text-gray-900">5 Indikator Terendah</h3>
                </div>
                <p className="text-sm text-gray-500">Area fokus peningkatan realisasi</p>
            </div>

            <div className="flex-1 space-y-3">
                {data.map((item, index) => {
                    // Determine color based on percentage
                    let percentColor = 'text-red-600';
                    let bgColor = 'bg-red-50';

                    if (item.achievementPercentage >= 80) {
                        percentColor = 'text-green-600';
                        bgColor = 'bg-green-50';
                    } else if (item.achievementPercentage >= 60) {
                        percentColor = 'text-yellow-600';
                        bgColor = 'bg-yellow-50';
                    } else if (item.achievementPercentage >= 40) {
                        percentColor = 'text-orange-600';
                        bgColor = 'bg-orange-50';
                    }

                    return (
                        <div
                            key={index}
                            className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-900 truncate" title={item.indicatorName}>
                                    {item.indicatorName}
                                </p>
                            </div>
                            <div className={`flex-shrink-0 px-2 py-1 rounded ${bgColor}`}>
                                <span className={`text-xs font-bold ${percentColor}`}>
                                    {item.achievementPercentage.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {data.length === 0 && (
                <p className="text-xs text-gray-400 text-center mt-4">
                    Semua indikator berkinerja baik! 🎉
                </p>
            )}
        </div>
    );
}
