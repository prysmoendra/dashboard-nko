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

interface TrendNKOChartProps {
    data: { month: string; score: number; weight: number }[];
}

export function TrendNKOChart({ data }: TrendNKOChartProps) {
    // Custom tooltip to show both Bobot and Nilai
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const weight = payload[0]?.payload?.weight ?? 0;
            const score = payload[0]?.value ?? 0;

            return (
                <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg">
                    <p className="font-bold text-gray-900 mb-2">{label}</p>
                    <div className="flex flex-col gap-1 text-sm">
                        <div className="flex justify-between gap-4">
                            <span className="text-gray-500">Bobot:</span>
                            <span className="font-medium text-gray-900">
                                {typeof weight === 'number' ? weight.toFixed(2) : '0.00'}
                            </span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-gray-500">Nilai:</span>
                            <span className="font-bold text-purple-600">
                                {typeof score === 'number' ? score.toFixed(2) : '0.00'}
                            </span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    // Show empty state if no data
    if (data.length === 0) {
        return (
            <div className="w-full h-[350px] flex items-center justify-center text-gray-400">
                <p className="text-sm">Tidak ada data trend</p>
            </div>
        );
    }

    return (
        <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="month"
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        tickLine={{ stroke: '#d1d5db' }}
                    />
                    <YAxis
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        tickLine={{ stroke: '#d1d5db' }}
                        label={{ value: 'Score', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(168, 85, 247, 0.1)' }} />
                    <Bar dataKey="score" fill="#a855f7" radius={[8, 8, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
