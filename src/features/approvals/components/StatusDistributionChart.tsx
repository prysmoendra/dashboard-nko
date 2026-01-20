'use client';

import React, { useState } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend
} from 'recharts';

interface StatusDistributionChartProps {
    data: Array<{ status: string; label: string; count: number; color: string }>;
}

export function StatusDistributionChart({ data }: StatusDistributionChartProps) {
    // Calculate total
    const total = data.reduce((sum, d) => sum + d.count, 0);

    // Track hovered segment for opacity effect
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    // Custom tooltip with high z-index
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const item = payload[0].payload;
            const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0.0';

            return (
                <div className="z-50 bg-white p-3 border border-gray-100 rounded-xl shadow-xl">
                    <p className="text-sm font-semibold text-gray-900 mb-2">{item.label}</p>
                    <div className="flex items-center gap-2 text-sm">
                        <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: item.color }}
                        ></span>
                        <span className="text-gray-600">
                            {item.count} Unit ({percentage}%)
                        </span>
                    </div>
                </div>
            );
        }
        return null;
    };

    // Show empty state if no data
    if (!data || data.length === 0 || data.every(d => d.count === 0)) {
        return (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 h-full flex flex-col">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Status Laporan</h3>
                    <p className="text-sm text-gray-500">Distribusi status laporan mingguan</p>
                </div>
                <div className="flex-1 flex items-center justify-center text-gray-400">
                    <p className="text-sm text-center">Belum ada data laporan</p>
                </div>
            </div>
        );
    }

    // Filter out zero counts for cleaner chart
    const chartData = data.filter(d => d.count > 0);

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-full flex flex-col">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Status Laporan</h3>
                <p className="text-sm text-gray-500">Distribusi status laporan mingguan</p>
            </div>

            <div className="flex-1 min-h-[250px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="45%"
                            innerRadius="55%"
                            outerRadius="75%"
                            paddingAngle={2}
                            dataKey="count"
                            onMouseEnter={(_, index) => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(null)}
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                                    style={{ cursor: 'pointer' }}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: 'transparent' }}
                            wrapperStyle={{ zIndex: 100 }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={40}
                            wrapperStyle={{ paddingTop: '10px' }}
                            formatter={(value, entry: any) => (
                                <span className="text-xs text-gray-700">
                                    {entry.payload.label} ({entry.payload.count})
                                </span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Static Center Label - Lower z-index */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-6" style={{ top: '-10%', zIndex: 1 }}>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900">
                            {total}
                        </div>
                        <div className="text-sm text-gray-500 font-medium mt-1">
                            Total Unit
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
