'use client';

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';

export interface PerformanceLog {
    id: string;
    indicator_name: string;
    unit_measurement: string;
    target: number;
    realization: number;
    achievement_percent: number;
    score: number;
}

interface PerformanceDetailTableProps {
    data: PerformanceLog[];
    total: number;
    page: number;
    limit: number;
    onPageChange: (newPage: number) => void;
}

type SortKey = 'indicator_name' | 'target' | 'realization' | 'achievement_percent' | 'score';
type SortConfig = { key: SortKey; direction: 'asc' | 'desc' } | null;

export function PerformanceDetailTable({
    data,
    total,
    page,
    limit,
    onPageChange
}: PerformanceDetailTableProps) {
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit + 1;
    const endIndex = Math.min(page * limit, total);

    // Sorting state
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);

    // Handle sort
    const handleSort = (key: SortKey) => {
        setSortConfig(current => {
            if (current?.key === key) {
                // Toggle direction
                return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
            }
            // New key, default to ascending
            return { key, direction: 'asc' };
        });
    };

    // Sort data before pagination
    const sortedData = useMemo(() => {
        if (!sortConfig) return data;

        const sorted = [...data].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            // Handle string comparison
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                const comparison = aValue.localeCompare(bValue);
                return sortConfig.direction === 'asc' ? comparison : -comparison;
            }

            // Handle number comparison
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
            }

            return 0;
        });

        return sorted;
    }, [data, sortConfig]);

    // Helper to get achievement status styling
    const getAchievementStyle = (percent: number): string => {
        if (percent >= 100) {
            return 'bg-green-100 text-green-700 font-bold';
        } else if (percent >= 95) {
            return 'bg-yellow-100 text-yellow-700 font-bold';
        } else {
            return 'bg-red-100 text-red-700 font-bold';
        }
    };

    // Render sort icon
    const renderSortIcon = (key: SortKey) => {
        if (sortConfig?.key === key) {
            return sortConfig.direction === 'asc'
                ? <ChevronUp className="w-4 h-4 text-blue-600" />
                : <ChevronDown className="w-4 h-4 text-blue-600" />;
        }
        return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    };

    // Show empty state
    if (sortedData.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8">
                <p className="text-center text-gray-500">Tidak ada data kinerja</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="text-xs text-white uppercase bg-blue-600">
                        <tr>
                            <th className="px-6 py-3 text-left">No</th>
                            <th
                                className="px-6 py-3 text-left cursor-pointer hover:bg-blue-700 transition-colors"
                                onClick={() => handleSort('indicator_name')}
                            >
                                <div className="flex items-center gap-2">
                                    Kinerja
                                    {renderSortIcon('indicator_name')}
                                </div>
                            </th>
                            <th className="px-6 py-3 text-center">Satuan</th>
                            <th
                                className="px-6 py-3 text-right cursor-pointer hover:bg-blue-700 transition-colors"
                                onClick={() => handleSort('target')}
                            >
                                <div className="flex items-center justify-end gap-2">
                                    Target
                                    {renderSortIcon('target')}
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-right cursor-pointer hover:bg-blue-700 transition-colors"
                                onClick={() => handleSort('realization')}
                            >
                                <div className="flex items-center justify-end gap-2">
                                    Realisasi
                                    {renderSortIcon('realization')}
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-center cursor-pointer hover:bg-blue-700 transition-colors"
                                onClick={() => handleSort('achievement_percent')}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    Pencapaian
                                    {renderSortIcon('achievement_percent')}
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-right cursor-pointer hover:bg-blue-700 transition-colors"
                                onClick={() => handleSort('score')}
                            >
                                <div className="flex items-center justify-end gap-2">
                                    Point
                                    {renderSortIcon('score')}
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((row, index) => (
                            <tr
                                key={row.id}
                                className="bg-white border-b hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-6 py-4 text-gray-700">
                                    {startIndex + index}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {row.indicator_name}
                                </td>
                                <td className="px-6 py-4 text-center text-gray-700">
                                    {row.unit_measurement}
                                </td>
                                <td className="px-6 py-4 text-right text-gray-700 tabular-nums">
                                    {row.target.toLocaleString('id-ID', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </td>
                                <td className="px-6 py-4 text-right text-gray-700 tabular-nums">
                                    {row.realization.toLocaleString('id-ID', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </td>
                                <td className={`px-6 py-4 text-center tabular-nums ${getAchievementStyle(row.achievement_percent)}`}>
                                    {row.achievement_percent.toFixed(2)}%
                                </td>
                                <td className="px-6 py-4 text-right text-gray-700 tabular-nums">
                                    {row.score.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="text-sm text-gray-700">
                    Menampilkan <span className="font-medium">{startIndex}</span> - <span className="font-medium">{endIndex}</span> dari <span className="font-medium">{total}</span> data
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 1}
                        className="px-3 py-1 rounded border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                    </button>
                    <div className="text-sm text-gray-700">
                        Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
                    </div>
                    <button
                        onClick={() => onPageChange(page + 1)}
                        disabled={page >= totalPages}
                        className="px-3 py-1 rounded border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                    >
                        Next
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
