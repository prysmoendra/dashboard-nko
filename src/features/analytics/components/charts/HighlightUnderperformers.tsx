'use client';

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LabelList
} from 'recharts';

interface HighlightUnderperformersProps {
    data: { indicator_name: string; achievement_percent: number; deviation: number; gap: number }[];
}

export function HighlightUnderperformers({ data }: HighlightUnderperformersProps) {
    // Truncate long indicator names
    const truncateName = (name: string, maxLength: number = 25): string => {
        if (name.length <= maxLength) return name;
        return name.substring(0, maxLength) + '...';
    };

    // Prepare display data with truncated names
    const displayData = data.map(item => ({
        ...item,
        displayName: truncateName(item.indicator_name)
    }));

    // Custom tooltip to show full name
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const fullName = payload[0].payload.indicator_name;
            const achievementPercent = payload[0].payload.achievement_percent;
            const gap = payload[0].value;

            return (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-xs">
                    <p className="text-sm font-semibold text-gray-900 mb-2 break-words">
                        {fullName}
                    </p>
                    <div className="flex flex-col gap-1 text-xs">
                        <div className="flex justify-between gap-3">
                            <span className="text-gray-500">Achievement:</span>
                            <span className="font-medium text-gray-900">
                                {typeof achievementPercent === 'number' ? achievementPercent.toFixed(2) : '0.00'}%
                            </span>
                        </div>
                        <div className="flex justify-between gap-3">
                            <span className="text-gray-500">Gap to 100%:</span>
                            <span className="font-bold text-blue-600">
                                -{typeof gap === 'number' ? gap.toFixed(2) : '0.00'}
                            </span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    // Show empty state if no data
    if (displayData.length === 0) {
        return (
            <div className="w-full h-[400px] flex items-center justify-center text-gray-400">
                <p className="text-sm">Semua indikator mencapai target</p>
            </div>
        );
    }

    return (
        <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={displayData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} vertical={true} />
                    <XAxis
                        type="number"
                        domain={[0, 'auto']}
                        tickCount={6}
                        tick={{ fill: '#6b7280', fontSize: 11 }}
                        tickLine={{ stroke: '#d1d5db' }}
                        axisLine={true}
                        tickFormatter={(value) => value === 0 ? '0' : `-${Math.round(value)}`}
                        padding={{ right: 20 }}
                    />
                    <YAxis
                        type="category"
                        dataKey="displayName"
                        tick={{ fill: '#6b7280', fontSize: 11 }}
                        tickLine={{ stroke: '#d1d5db' }}
                        width={150}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
                    <Bar dataKey="gap" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                        <LabelList
                            dataKey="gap"
                            position="right"
                            fill="#374151"
                            fontSize={10}
                            formatter={(value: any) => {
                                const num = Number(value);
                                return !isNaN(num) ? `-${num.toFixed(1)}` : '';
                            }}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
