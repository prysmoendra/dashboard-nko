'use client';

import React from 'react';
import { TrendingUp, AlertTriangle, AlertCircle } from 'lucide-react';

interface KPITrafficLightProps {
    greenCount: number;
    yellowCount: number;
    redCount: number;
}

export function KPITrafficLight({ greenCount, yellowCount, redCount }: KPITrafficLightProps) {
    const cards = [
        {
            title: 'Kinerja Baik',
            count: greenCount,
            icon: TrendingUp,
            bgColor: 'bg-green-400',
            textColor: 'text-white',
        },
        {
            title: 'Perlu Perhatian',
            count: yellowCount,
            icon: AlertTriangle,
            bgColor: 'bg-yellow-400',
            textColor: 'text-white',
        },
        {
            title: 'Kritis',
            count: redCount,
            icon: AlertCircle,
            bgColor: 'bg-red-400',
            textColor: 'text-white',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <div
                        key={card.title}
                        className={`${card.bgColor} rounded-xl p-6 transition-all hover:shadow-lg relative overflow-hidden`}
                    >
                        <div className="flex flex-col relative z-10">
                            <p className={`text-md font-extrabold ${card.textColor} opacity-90`}>
                                {card.title}
                            </p>
                            <p className={`text-2xl font-bold ${card.textColor} mt-2`}>
                                {card.count}
                            </p>
                        </div>
                        {/* Icon in bottom-right corner */}
                        <Icon className={`absolute right-4 bottom-4 w-16 h-16 ${card.textColor} opacity-20`} />
                    </div>
                );
            })}
        </div>
    );
}
