'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface LossPointGaugeProps {
    value: number;
}

export function LossPointGauge({ value }: LossPointGaugeProps) {
    // Normalize the value for display (0-100 range for the gauge)
    const maxValue = Math.max(Math.abs(value) * 1.5, 100);
    const percentage = Math.min((Math.abs(value) / maxValue) * 100, 100);

    // Data for half-circle gauge (180 degrees total)
    const data = [
        { name: 'Value', value: percentage },
        { name: 'Remaining', value: 100 - percentage }
    ];

    const COLORS = ['#3b82f6', '#e5e7eb']; // Blue for value, light grey for remaining

    return (
        <div className="relative h-[200px] w-full overflow-hidden flex items-end justify-center">
            {/* Half-circle speedometer gauge */}
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="100%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius="75%"
                        outerRadius="100%"
                        paddingAngle={0}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>

            {/* Text overlay - positioned inside the arc */}
            <div className="absolute bottom-0 flex flex-col items-center mb-0">
                <span className="text-gray-500 text-sm font-medium">Loss Point</span>
                <span className="text-red-500 text-2xl font-bold">-{value.toFixed(2)}</span>
            </div>
        </div>
    );
}
