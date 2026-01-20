'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, ShieldAlert, TrendingUp, FileCheck, FileInput, Wrench } from 'lucide-react';
import { StatsCard } from '@/shared/components/ui/StatsCard';
import { StatusCard } from '@/shared/components/ui/StatusCard';
import ActionCard from '@/features/data-submissions/components/ActionCard';
import { WeeklyPerformanceTrendChart } from '@/features/data-submissions/components/WeeklyPerformanceTrendChart';
import { LowestIndicatorsList } from '@/features/data-submissions/components/LowestIndicatorsList';
import { pegawaiDashboardService } from '../api/pegawai-dashboard.service';
import { getWeekNumber } from '@/shared/utils/date.utils';
import type { ActionItem } from '../types/dashboard';

/**
 * PegawaiDashboardPage - Operational dashboard for pegawai role
 * Displays personalized metrics, action center, and performance analytics
 */
export function PegawaiDashboardPage() {
    const [unitName] = useState<string>('ULP Cimahi Kota'); // TODO: Get from user session
    const [loading, setLoading] = useState(true);

    // Current date context
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    const currentWeek = getWeekNumber(today);

    // Dashboard metrics state
    const [weeklySubmissionStatus, setWeeklySubmissionStatus] = useState<{ hasSubmitted: boolean; week: number }>({ hasSubmitted: false, week: currentWeek });
    const [rejectedCount, setRejectedCount] = useState<number>(0);
    const [monthlyAchievement, setMonthlyAchievement] = useState<{ percentage: number; approvedCount: number; totalTargets: number }>({ percentage: 0, approvedCount: 0, totalTargets: 0 });
    const [ytdCount, setYtdCount] = useState<number>(0);
    const [weeklyTrendData, setWeeklyTrendData] = useState<Array<{ week: number; percentage: number; label: string }>>([]);
    const [lowestIndicators, setLowestIndicators] = useState<Array<{ indicatorName: string; achievementPercentage: number }>>([]);

    // Fetch all dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const [
                    submissionStatus,
                    rejectedItemsCount,
                    achievement,
                    ytdApprovedCount,
                    trendData,
                    lowestPerformers
                ] = await Promise.all([
                    pegawaiDashboardService.getWeeklySubmissionStatus(unitName, currentWeek, currentMonth, currentYear),
                    pegawaiDashboardService.getRejectedItemsCount(unitName),
                    pegawaiDashboardService.getMonthlyAchievementPercentage(unitName, currentMonth, currentYear),
                    pegawaiDashboardService.getYTDApprovedCount(unitName, currentYear),
                    pegawaiDashboardService.getWeeklyPerformanceTrend(unitName, currentMonth, currentYear),
                    pegawaiDashboardService.getLowestIndicators(unitName, currentMonth, currentYear, 5)
                ]);

                setWeeklySubmissionStatus(submissionStatus);
                setRejectedCount(rejectedItemsCount);
                setMonthlyAchievement(achievement);
                setYtdCount(ytdApprovedCount);
                setWeeklyTrendData(trendData);
                setLowestIndicators(lowestPerformers);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [unitName, currentMonth, currentYear, currentWeek]);

    // Stats data for Row 1
    const statsData = [
        {
            label: `Laporan Minggu ${weeklySubmissionStatus.week}`,
            value: weeklySubmissionStatus.hasSubmitted ? 'Sudah Dikirim' : 'Menunggu Input',
            icon: weeklySubmissionStatus.hasSubmitted ? CheckCircle : AlertTriangle,
            iconColor: weeklySubmissionStatus.hasSubmitted ? 'text-green-600' : 'text-yellow-600',
            bgColor: weeklySubmissionStatus.hasSubmitted ? 'bg-green-100' : 'bg-yellow-100'
        },
        {
            label: 'Perlu Perbaikan',
            value: rejectedCount,
            icon: ShieldAlert,
            iconColor: rejectedCount > 0 ? 'text-red-600' : 'text-gray-600',
            bgColor: rejectedCount > 0 ? 'bg-red-100' : 'bg-gray-100'
        },
        {
            label: 'Capaian Bulan Ini',
            value: `${monthlyAchievement.percentage}%`,
            icon: TrendingUp,
            iconColor: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            label: `Total Laporan ${currentYear}`,
            value: ytdCount,
            icon: FileCheck,
            iconColor: 'text-purple-600',
            bgColor: 'bg-purple-100'
        }
    ];

    // Action data for Row 2
    const actionData: ActionItem[] = [
        {
            title: 'Input Kinerja Mingguan',
            description: 'Catat realisasi kinerja untuk minggu ini',
            iconType: 'performance',
            href: '/dashboard/pegawai/input-kinerja'
        },
        {
            title: 'Update / Perbaikan Data',
            description: 'Perbaiki data realisasi yang ditolak',
            iconType: 'maintenance',
            href: '/dashboard/pegawai/update-maintenance',
            badge: rejectedCount // Add badge showing rejected count
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Section Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Raport Digital Pegawai</h1>
                <p className="text-gray-500 mb-4">Monitor kinerja dan kelola realisasi mingguan Anda</p>

                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">Role Anda:</span>
                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">Pegawai</span>
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">{unitName}</span>
                </div>
            </div>

            {/* ROW 1: Top Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Premium Status Card */}
                <StatusCard
                    weekNumber={weeklySubmissionStatus.week}
                    status={weeklySubmissionStatus.hasSubmitted ? 'submitted' : 'pending'}
                    icon={weeklySubmissionStatus.hasSubmitted ? CheckCircle : AlertTriangle}
                />

                {/* Regular Stats Cards */}
                {statsData.slice(1).map((stat, idx) => (
                    <StatsCard
                        key={idx}
                        label={stat.label}
                        value={stat.value}
                        icon={stat.icon}
                        iconColor={stat.iconColor}
                        bgColor={stat.bgColor}
                    />
                ))}
            </div>

            {/* ROW 2: Action Center */}
            <div className="bg-white border border-blue-200 rounded-2xl p-6 mb-8 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <FileInput className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Input & Pembaruan</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {actionData.map((action, idx) => (
                        <ActionCard key={idx} data={action} />
                    ))}
                </div>
            </div>

            {/* ROW 3: Charts & Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                {/* Left: Weekly Performance Trend Chart (2/3 width) */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Tren Realisasi Mingguan</h3>
                        <p className="text-sm text-gray-500">Persentase capaian per minggu (Bulan Berjalan)</p>
                    </div>
                    {loading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="flex-1">
                            <WeeklyPerformanceTrendChart data={weeklyTrendData} />
                        </div>
                    )}
                </div>

                {/* Right: Lowest Indicators List (1/3 width) */}
                <div className="lg:col-span-1">
                    {loading ? (
                        <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <LowestIndicatorsList data={lowestIndicators} />
                    )}
                </div>
            </div>
        </div>
    );
}
