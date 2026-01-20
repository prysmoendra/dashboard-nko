'use client';

import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

interface WeeklyPerformanceTrendChartProps {
    data: Array<{ week: number; percentage: number; label: string }>;
}

export function WeeklyPerformanceTrendChart({ data }: WeeklyPerformanceTrendChartProps) {
    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const percentage = payload[0]?.value ?? 0;

            return (
                <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg">
                    <p className="font-bold text-gray-900 mb-2">{label}</p>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">Capaian:</span>
                        <span className="font-bold text-blue-600">
                            {typeof percentage === 'number' ? percentage.toFixed(1) : '0.0'}%
                        </span>
                    </div>
                </div>
            );
        }
        return null;
    };

    // Show empty state if no data
    if (!data || data.length === 0) {
        return (
            <div className="w-full h-[300px] flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-center">
                    <p className="text-sm font-medium">Belum ada data realisasi</p>
                    <p className="text-xs mt-1">Mulai input kinerja mingguan untuk melihat tren</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="label"
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        tickLine={{ stroke: '#d1d5db' }}
                    />
                    <YAxis
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        tickLine={{ stroke: '#d1d5db' }}
                        label={{
                            value: 'Capaian (%)',
                            angle: -90,
                            position: 'insideLeft',
                            fill: '#6b7280',
                            style: { fontSize: 12 }
                        }}
                        domain={[0, 100]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        wrapperStyle={{ fontSize: '12px' }}
                        iconType="line"
                    />
                    <Line
                        type="monotone"
                        dataKey="percentage"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', r: 5 }}
                        activeDot={{ r: 7 }}
                        name="Persentase Realisasi"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
