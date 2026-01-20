'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, AlertTriangle, TrendingUp, CheckCircle, CheckSquare } from 'lucide-react';
import { StatsCard } from '@/shared/components/ui/StatsCard';
import ActionCard from '@/features/data-submissions/components/ActionCard';
import { StatusDistributionChart } from '../components/StatusDistributionChart';
import { CriticalIndicatorsChart } from '../components/CriticalIndicatorsChart';
import { askbidDashboardService } from '../api/askbid-dashboard.service';
import { getWeekNumber } from '@/shared/utils/date.utils';
import type { ActionItem } from '@/features/data-submissions/types/dashboard';

/**
 * AsistenDashboardPage - Supervisor control tower dashboard for Asisten Kepala Bidang
 * Provides multi-unit oversight with supervisory metrics and diagnostic analytics
 */
export function AsistenDashboardPage() {
    const [bidangScope] = useState<string | undefined>(undefined); // TODO: Get from user session
    const [loading, setLoading] = useState(true);

    // Current date context
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    const currentWeek = getWeekNumber(today);

    // Dashboard metrics state
    const [pendingReviewCount, setPendingReviewCount] = useState<number>(0);
    const [unitsWithoutSubmission, setUnitsWithoutSubmission] = useState<number>(0);
    const [averagePerformance, setAveragePerformance] = useState<number>(0);
    const [approvedCount, setApprovedCount] = useState<number>(0);
    const [statusDistributionData, setStatusDistributionData] = useState<Array<{ status: string; label: string; count: number; color: string }>>([]);
    const [criticalIndicatorsData, setCriticalIndicatorsData] = useState<Array<{ indicatorName: string; achievementPercentage: number }>>([]);

    // Fetch all dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const [
                    pendingCount,
                    unitsWithoutSub,
                    avgPerformance,
                    approvedThisMonth,
                    statusDistribution,
                    criticalIndicators
                ] = await Promise.all([
                    askbidDashboardService.getPendingReviewCount(bidangScope),
                    askbidDashboardService.getUnitsWithoutSubmission(bidangScope, currentWeek, currentMonth, currentYear),
                    askbidDashboardService.getAverageBidangPerformance(bidangScope, currentMonth, currentYear),
                    askbidDashboardService.getApprovedCountThisMonth(bidangScope, currentMonth, currentYear),
                    askbidDashboardService.getStatusDistribution(bidangScope, currentWeek, currentMonth, currentYear),
                    askbidDashboardService.getLowestIndicatorsScopeWide(bidangScope, currentMonth, currentYear, 10)
                ]);

                setPendingReviewCount(pendingCount);
                setUnitsWithoutSubmission(unitsWithoutSub);
                setAveragePerformance(avgPerformance);
                setApprovedCount(approvedThisMonth);
                setStatusDistributionData(statusDistribution);
                setCriticalIndicatorsData(criticalIndicators);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [bidangScope, currentMonth, currentYear, currentWeek]);

    // Stats data for Row 1
    const statsData = [
        {
            label: 'Menunggu Review',
            value: pendingReviewCount,
            icon: AlertCircle,
            iconColor: pendingReviewCount > 0 ? 'text-orange-600' : 'text-gray-600',
            bgColor: pendingReviewCount > 0 ? 'bg-orange-100' : 'bg-gray-100'
        },
        {
            label: 'Unit Belum Lapor',
            value: unitsWithoutSubmission,
            icon: AlertTriangle,
            iconColor: 'text-yellow-600',
            bgColor: 'bg-yellow-100'
        },
        {
            label: 'Rata-rata Kinerja',
            value: `${averagePerformance}%`,
            icon: TrendingUp,
            iconColor: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            label: 'Total Disetujui',
            value: approvedCount,
            icon: CheckCircle,
            iconColor: 'text-green-600',
            bgColor: 'bg-green-100'
        }
    ];

    // Action data for Row 2
    const actionData: ActionItem[] = [
        {
            title: 'Review & Approval',
            description: 'Periksa dan setujui laporan kinerja mingguan',
            iconType: 'warehouse',
            href: '/dashboard/askbid/review',
            badge: pendingReviewCount // Show pending count badge
        },
        {
            title: 'Monitoring Unit',
            description: 'Pantau status pengiriman laporan per unit',
            iconType: 'monitoring',
            href: '/dashboard/askbid/instruksi'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 py-0">
            {/* Section Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Control Tower Supervisor</h1>
                <p className="text-gray-500 mb-4">Monitor kinerja unit dan kelola workflow approval</p>

                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">Role Anda:</span>
                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">Asisten Kepala Bidang</span>
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">Up3 Cimahi</span>
                </div>
            </div>

            {/* ROW 1: Supervisory Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsData.map((stat, idx) => (
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
            <div className="bg-white border rounded-2xl p-6 mb-8 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <CheckSquare className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Workflow Management</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {actionData.map((action, idx) => (
                        <ActionCard key={idx} data={action} />
                    ))}
                </div>
            </div>

            {/* ROW 3: Critical Indicators & Status Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                {/* Left: Critical Indicators Chart (2/3 width) */}
                <div className="lg:col-span-2">
                    {loading ? (
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-full flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-full flex flex-col">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Area Fokus Perbaikan</h3>
                                <p className="text-sm text-gray-500">Indikator dengan pencapaian terendah yang memerlukan perhatian</p>
                            </div>
                            <div className="flex-1 min-h-[400px]">
                                {criticalIndicatorsData.length > 0 ? (
                                    <CriticalIndicatorsChart data={criticalIndicatorsData} />
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-400">
                                        <p className="text-sm text-center">Belum ada data indikator</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Status Distribution Chart (1/3 width) */}
                <div className="lg:col-span-1">
                    {loading ? (
                        <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <StatusDistributionChart data={statusDistributionData} />
                    )}
                </div>
            </div>
        </div>
    );
}
