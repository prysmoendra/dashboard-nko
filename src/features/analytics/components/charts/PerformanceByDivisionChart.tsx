'use client';

import React from 'react';
import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

interface PerformanceByDivisionChartProps {
    data: { division: string; nilaiMax: number; nilaiAkhir: number; achievementPercent: number }[];
}

export function PerformanceByDivisionChart({ data }: PerformanceByDivisionChartProps) {
    // Custom tooltip
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length > 0) {
            const division = payload[0]?.payload?.division || 'Unknown';
            const nilaiMax = payload[0]?.payload?.nilaiMax ?? 0;
            const nilaiAkhir = payload[0]?.payload?.nilaiAkhir ?? 0;
            const achievementPercent = payload[0]?.payload?.achievementPercent ?? 0;

            return (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                    <p className="text-sm font-semibold text-gray-900 mb-2">
                        {division}
                    </p>
                    <div className="flex flex-col gap-1 text-xs">
                        <div className="flex justify-between gap-3">
                            <span className="text-gray-500">Nilai Max:</span>
                            <span className="font-medium text-blue-600">
                                {typeof nilaiMax === 'number' ? nilaiMax.toFixed(2) : '0.00'}
                            </span>
                        </div>
                        <div className="flex justify-between gap-3">
                            <span className="text-gray-500">Nilai Akhir:</span>
                            <span className="font-medium text-green-700">
                                {typeof nilaiAkhir === 'number' ? nilaiAkhir.toFixed(2) : '0.00'}
                            </span>
                        </div>
                        <div className="flex justify-between gap-3">
                            <span className="text-gray-500">% Pencapaian:</span>
                            <span className="font-bold text-yellow-600">
                                {typeof achievementPercent === 'number' ? achievementPercent.toFixed(2) : '0.00'}%
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
                <p className="text-sm">Tidak ada data per divisi</p>
            </div>
        );
    }

    return (
        <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis
                        dataKey="division"
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        tickLine={{ stroke: '#d1d5db' }}
                    />

                    {/* Left Y-Axis: Percentage (0-100%) */}
                    <YAxis
                        yAxisId="left"
                        orientation="left"
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        tickLine={{ stroke: '#d1d5db' }}
                        tickFormatter={(value) => `${value}%`}
                        domain={[0, 100]}
                        label={{ value: '% Pencapaian', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
                    />

                    {/* Right Y-Axis: Raw Values (Hidden but functional for bar scaling) */}
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        hide
                    />

                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
                    <Legend />

                    {/* Bars bind to right axis (raw values) */}
                    <Bar yAxisId="right" dataKey="nilaiMax" fill="#3b82f6" name="Nilai Max" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="nilaiAkhir" fill="#36b063ff" name="Nilai Akhir" radius={[4, 4, 0, 0]} />

                    {/* Line binds to left axis (percentage) */}
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="achievementPercent"
                        stroke="#c3950cff"
                        strokeWidth={2}
                        name="% Pencapaian"
                        dot={{ r: 4, fill: '#eab308' }}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}
