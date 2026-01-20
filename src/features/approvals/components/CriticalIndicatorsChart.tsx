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
    Cell
} from 'recharts';

interface CriticalIndicatorsChartProps {
    data: Array<{ indicatorName: string; achievementPercentage: number }>;
}

export function CriticalIndicatorsChart({ data }: CriticalIndicatorsChartProps) {
    // Custom tooltip
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const item = payload[0].payload;

            return (
                <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg">
                    <p className="font-bold text-gray-900 mb-2 text-sm">{item.indicatorName}</p>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">Pencapaian:</span>
                        <span className="font-bold text-orange-600">
                            {item.achievementPercentage.toFixed(1)}%
                        </span>
                    </div>
                </div>
            );
        }
        return null;
    };

    // Determine color based on percentage
    const getBarColor = (percentage: number) => {
        if (percentage >= 60) return '#f97316'; // orange (needs improvement)
        if (percentage >= 40) return '#ef4444'; // red (critical)
        return '#dc2626'; // dark red (very critical)
    };

    // Show empty state if no data
    if (!data || data.length === 0) {
        return (
            <div className="h-full flex items-center justify-center text-gray-400">
                <p className="text-sm text-center">Belum ada data indikator</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                    <XAxis
                        type="number"
                        tick={{ fill: '#6b7280', fontSize: 10 }}
                        tickLine={{ stroke: '#d1d5db' }}
                        domain={[0, 100]}
                        label={{ value: 'Pencapaian (%)', position: 'insideBottom', offset: -5, fill: '#6b7280' }}
                    />
                    <YAxis
                        type="category"
                        dataKey="indicatorName"
                        tick={{ fill: '#6b7280', fontSize: 10 }}
                        tickLine={{ stroke: '#d1d5db' }}
                        width={170}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(249, 115, 22, 0.1)' }} />
                    <Bar dataKey="achievementPercentage" radius={[0, 4, 4, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getBarColor(entry.achievementPercentage)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
