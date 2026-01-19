"use client";

import React from 'react';
import {
    LayoutDashboard,
    Zap,
    Settings,
    Database,
    Inbox,
    CheckSquare,
    BarChart3,
    TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { StatsCard } from '@/shared/components/ui/StatsCard';
import { DashboardPreviewCard } from '@/shared/components/ui/DashboardPreviewCard';

/**
 * AsistenDashboardPage - Main dashboard for Asisten Kepala Bidang role
 * Part of approvals feature (handles instruksi and review/approval workflows)
 */
export function AsistenDashboardPage() {
    const stats = [
        { label: "Total Dashboard", value: 8, icon: LayoutDashboard, iconColor: "text-blue-600", bgColor: "bg-blue-100" },
        { label: "Sistem Aktif", value: 7, icon: Zap, iconColor: "text-green-600", bgColor: "bg-green-100" },
        { label: "Maintenance", value: 1, icon: Settings, iconColor: "text-orange-600", bgColor: "bg-orange-100" },
        { label: "Data Points", value: "5.2M", icon: Database, iconColor: "text-purple-600", bgColor: "bg-purple-100" },
    ];

    const dashboards = [
        { title: "NKO 2025 - UP3 Cimahi", description: "Dashboard monitoring NKO UP3 Cimahi", metricCount: 24, icon: BarChart3, iconBg: "bg-blue-600" },
        { title: "ULP CIKO", description: "Monitoring Unit Layanan Pelanggan Ciko", metricCount: 18, icon: TrendingUp, iconBg: "bg-green-500" },
    ];

    return (
        <div className="space-y-6 sm:space-y-8 pb-10">

            {/* --- Header Section --- */}
            <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Dashboard Asisten Kepala Bidang
                </h1>
                <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
                    Akses semua dashboard dan sistem monitoring PLN dalam satu tempat
                </p>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-500">Role Anda:</span>
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs sm:text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        Asisten Kepala Bidang
                    </span>
                    <span className="hidden sm:inline text-gray-400">•</span>
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2.5 py-1 text-xs sm:text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        Up3 Cimahi
                    </span>
                </div>
            </div>

            {/* --- Stats Cards --- */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, idx) => (
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

            {/* --- Action Section --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Link ke Instruksi */}
                <div className="rounded-xl border border-orange-400 bg-white p-5 sm:p-6 shadow-sm h-full flex flex-col">
                    <div className="mb-4 flex items-center gap-2">
                        <Inbox className="h-5 w-5 text-orange-600" />
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Instruksi dari Kepala Bidang</h2>
                    </div>
                    <p className="mb-6 text-sm text-gray-600">
                        Lihat dan tindak lanjuti instruksi dari Kepala Bidang
                    </p>

                    <Link
                        href="/dashboard/askbid/instruksi"
                        className="group flex w-full flex-col items-center justify-center rounded-lg border border-gray-100 bg-gray-50 py-6 sm:py-8 hover:bg-gray-100 transition-colors active:scale-[0.99] mt-auto"
                    >
                        <Inbox className="mb-2 h-6 w-6 text-orange-500 group-hover:scale-110 transition-transform" />
                        <span className="font-medium text-gray-900">Lihat Instruksi</span>
                        <span className="text-xs text-gray-500 text-center px-4">Koordinasikan ke pegawai</span>
                    </Link>
                </div>

                {/* Link ke Review & Approval */}
                <div className="rounded-xl border border-blue-400 bg-white p-5 sm:p-6 shadow-sm h-full flex flex-col">
                    <div className="mb-4 flex items-center gap-2">
                        <CheckSquare className="h-5 w-5 text-blue-600" />
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Review & Approval</h2>
                    </div>
                    <p className="mb-6 text-sm text-gray-600">
                        Lihat dan tindak lanjuti instruksi dari Kepala Bidang
                    </p>

                    <Link
                        href="/dashboard/askbid/review"
                        className="group flex w-full flex-col items-center justify-center rounded-lg border border-gray-100 bg-gray-50 py-6 sm:py-8 hover:bg-gray-100 transition-colors active:scale-[0.99] mt-auto"
                    >
                        <CheckSquare className="mb-2 h-6 w-6 text-blue-500 group-hover:scale-110 transition-transform" />
                        <span className="font-medium text-gray-900">Lihat Review & Approval</span>
                        <span className="text-xs text-gray-500 text-center px-4">Review dan Approval Data Input</span>
                    </Link>
                </div>
            </div>

            {/* --- Bottom Dashboard Links --- */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
                {dashboards.map((dashboard, idx) => (
                    <DashboardPreviewCard
                        key={idx}
                        title={dashboard.title}
                        description={dashboard.description}
                        metricCount={dashboard.metricCount}
                        icon={dashboard.icon}
                        iconBg={dashboard.iconBg}
                    />
                ))}
            </div>

        </div>
    );
}
