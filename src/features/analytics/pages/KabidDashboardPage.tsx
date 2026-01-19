'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Activity,
    FileText,
    Target,
    TrendingUp,
    Zap,
    ChevronRight,
    BarChart3,
    RefreshCw
} from 'lucide-react';
import { monitoringService } from '@/features/ai-monitoring/api/monitoring.service';
import { KPITrafficLight } from '../components/charts/KPITrafficLight';
import { TrendNKOChart } from '../components/charts/TrendNKOChart';
import { HighlightUnderperformers } from '../components/charts/HighlightUnderperformers';
import { LossPointGauge } from '../components/charts/LossPointGauge';
import { PerformanceByDivisionChart } from '../components/charts/PerformanceByDivisionChart';
import { PerformanceDetailTable, type PerformanceLog } from '../components/tables/PerformanceDetailTable';

export function KabidDashboardPage() {
    const currentYear = new Date().getFullYear();

    // State management
    const [year, setYear] = useState<number>(currentYear);
    const [month, setMonth] = useState<number | null>(null);
    const [divisionName, setDivisionName] = useState<string | null>(null);
    const [dashboardData, setDashboardData] = useState<{
        kpiCounts: { green: number; yellow: number; red: number };
        trendData: { month: string; score: number; weight: number }[];
        underperformers: { indicator_name: string; achievement_percent: number; deviation: number; gap: number }[];
        lossPoint: number;
        divisionPerformance: { division: string; nilaiMax: number; nilaiAkhir: number; achievementPercent: number }[];
    } | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Table pagination state
    const [tablePage, setTablePage] = useState<number>(1);
    const [tableData, setTableData] = useState<PerformanceLog[]>([]);
    const [tableTotal, setTableTotal] = useState<number>(0);
    const tableLimit = 10;

    // Summary stats (static for operational zone)
    const stats = [
        {
            icon: Target,
            label: 'Total Unit',
            value: '12',
            color: 'blue',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
        },
        {
            icon: FileText,
            label: 'Laporan Masuk',
            value: '24',
            color: 'green',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
        },
        {
            icon: Zap,
            label: 'Action Plan',
            value: '5',
            color: 'purple',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
        },
        {
            icon: TrendingUp,
            label: 'Kinerja Rata-rata',
            value: '87%',
            color: 'orange',
            bgColor: 'bg-orange-50',
            iconColor: 'text-orange-600',
        },
    ];

    // Month options
    const monthOptions = [
        { value: null, label: 'Semua Bulan' },
        { value: 1, label: 'Januari' },
        { value: 2, label: 'Februari' },
        { value: 3, label: 'Maret' },
        { value: 4, label: 'April' },
        { value: 5, label: 'Mei' },
        { value: 6, label: 'Juni' },
        { value: 7, label: 'Juli' },
        { value: 8, label: 'Agustus' },
        { value: 9, label: 'September' },
        { value: 10, label: 'Oktober' },
        { value: 11, label: 'November' },
        { value: 12, label: 'Desember' },
    ];

    // Division options
    const divisionOptions = [
        { value: null, label: 'Semua Divisi' },
        { value: 'JAR', label: 'JAR' },
        { value: 'NPS', label: 'NPS' },
        { value: 'TEL', label: 'TEL' },
    ];

    // Fetch dashboard data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const data = await monitoringService.getExecutiveDashboardStats(year, month, divisionName);
                setDashboardData(data);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Gagal memuat data dashboard');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [year, month, divisionName]);

    // Fetch table data
    useEffect(() => {
        const fetchTableData = async () => {
            try {
                const result = await monitoringService.getDetailedPerformanceLogs(
                    year,
                    month,
                    divisionName,
                    tablePage,
                    tableLimit
                );
                setTableData(result.data);
                setTableTotal(result.total);
            } catch (err) {
                console.error('Error fetching table data:', err);
            }
        };

        fetchTableData();
    }, [year, month, divisionName, tablePage]);

    // Manual refresh handler
    const handleRefresh = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const [dashData, tableResult] = await Promise.all([
                monitoringService.getExecutiveDashboardStats(year, month, divisionName),
                monitoringService.getDetailedPerformanceLogs(year, month, divisionName, tablePage, tableLimit)
            ]);

            setDashboardData(dashData);
            setTableData(tableResult.data);
            setTableTotal(tableResult.total);
        } catch (err) {
            console.error('Error refreshing data:', err);
            setError('Gagal memuat data dashboard');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Kepala Bidang</h1>
                    <p className="text-gray-500 mt-1">Monitoring dan analisa kinerja unit kerja</p>
                </div>

                {/* OPERATIONAL ZONE */}

                {/* Summary Stats - Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.label}
                                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                    </div>
                                    <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                                        <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Quick Actions - Row 2 */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Monitoring Kinerja - Primary Action */}
                        <Link
                            href="/dashboard/kabid/monitoring"
                            className="group bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg hover:shadow-xl transition-all p-8 text-white"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <Activity className="w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold mb-2 group-hover:translate-x-1 transition-transform">
                                        Monitoring Kinerja
                                    </h3>
                                    <p className="text-blue-100 text-sm mb-4">
                                        Pantau kinerja unit dan analisa AI untuk insight mendalam
                                    </p>
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <span>Buka Dashboard</span>
                                        <Zap className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Input Target - Secondary Action */}
                        <Link
                            href="/dashboard/kabid/input-target"
                            className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-8 group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-green-50 rounded-xl">
                                    <Target className="w-8 h-8 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                                        Input Target Bulanan
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        Tetapkan target NKO untuk setiap indikator kinerja
                                    </p>
                                    <div className="inline-flex items-center gap-2 text-sm font-medium text-green-600">
                                        <span>Atur Target</span>
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* EXECUTIVE SUMMARY ZONE */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Executive Summary NKO</h2>

                    {/* Row A: Filters & KPI Traffic Lights */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left: Filter Controls */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-4">Filters</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Tahun
                                        </label>
                                        <select
                                            value={year}
                                            onChange={(e) => setYear(Number(e.target.value))}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value={2024}>2024</option>
                                            <option value={2025}>2025</option>
                                            <option value={2026}>2026</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Bulan
                                        </label>
                                        <select
                                            value={month ?? ''}
                                            onChange={(e) => setMonth(e.target.value ? Number(e.target.value) : null)}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {monthOptions.map((option) => (
                                                <option key={option.label} value={option.value ?? ''}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Divisi
                                        </label>
                                        <select
                                            value={divisionName ?? ''}
                                            onChange={(e) => setDivisionName(e.target.value || null)}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {divisionOptions.map((option) => (
                                                <option key={option.label} value={option.value ?? ''}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <button
                                    onClick={handleRefresh}
                                    disabled={isLoading}
                                    className="mt-4 w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                                    Refresh
                                </button>
                            </div>

                            {/* Right: KPI Traffic Lights */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-4">Status Indikator</h3>
                                {dashboardData && (
                                    <KPITrafficLight
                                        greenCount={dashboardData.kpiCounts.green}
                                        yellowCount={dashboardData.kpiCounts.yellow}
                                        redCount={dashboardData.kpiCounts.red}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
                            <p className="text-red-600 font-medium">{error}</p>
                            <button
                                onClick={handleRefresh}
                                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Coba Lagi
                            </button>
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 mb-6">
                            <div className="flex flex-col items-center justify-center text-gray-400">
                                <RefreshCw className="w-12 h-12 animate-spin mb-4" />
                                <p className="text-sm">Memuat data executive summary...</p>
                            </div>
                        </div>
                    )}

                    {/* Dashboard Content */}
                    {!isLoading && !error && dashboardData && (
                        <>
                            {/* Row B: Loss Point Gauge + Trend Chart */}
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                                {/* Loss Point Gauge (1 column) */}
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                    <h3 className="text-sm font-bold text-gray-900 mb-4">Loss Point</h3>
                                    <LossPointGauge value={dashboardData.lossPoint} />
                                </div>

                                {/* Trend Chart (3 columns) */}
                                <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                    <h3 className="text-sm font-bold text-gray-900 mb-4">
                                        Tren Kinerja NKO {year}
                                    </h3>
                                    {dashboardData.trendData.some(d => d.score > 0) ? (
                                        <TrendNKOChart data={dashboardData.trendData} />
                                    ) : (
                                        <div className="h-[350px] flex flex-col items-center justify-center text-gray-400">
                                            <BarChart3 className="w-12 h-12 mb-3" />
                                            <p className="text-sm">Belum ada data kinerja untuk periode ini</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Row C: Division Performance + Underperformers */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Division Performance Chart */}
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                    <h3 className="text-sm font-bold text-gray-900 mb-4">
                                        Kinerja per Bidang
                                    </h3>
                                    <PerformanceByDivisionChart data={dashboardData.divisionPerformance} />
                                </div>

                                {/* Underperformers Chart */}
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                    <h3 className="text-sm font-bold text-gray-900 mb-4">
                                        Highlight Kinerja {'<'} 100%
                                    </h3>
                                    <HighlightUnderperformers data={dashboardData.underperformers} />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Detailed Performance Table */}
                    <div className="mt-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Detail Data Kinerja
                        </h2>
                        <PerformanceDetailTable
                            data={tableData}
                            total={tableTotal}
                            page={tablePage}
                            limit={tableLimit}
                            onPageChange={setTablePage}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
