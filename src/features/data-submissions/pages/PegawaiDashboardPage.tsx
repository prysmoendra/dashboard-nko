'use client';

import React from 'react';
import { Settings, BarChart3, Zap, Settings as SettingsIcon, Database, BarChart2, Activity } from 'lucide-react';
import { StatsCard } from '@/shared/components/ui/StatsCard';
import { DashboardPreviewCard } from '@/shared/components/ui/DashboardPreviewCard';
import ActionCard from '@/features/data-submissions/components/ActionCard';

// Import types
import { ActionItem, DashboardItem } from '@/features/data-submissions/types/dashboard';

// Stats data
const statsData = [
    { label: 'Total Dashboard', value: 8, icon: BarChart3, iconColor: 'text-blue-600', bgColor: 'bg-blue-100' },
    { label: 'Maintenance', value: 1, icon: SettingsIcon, iconColor: 'text-orange-600', bgColor: 'bg-orange-100' },
    { label: 'Sistem Aktif', value: 7, icon: Zap, iconColor: 'text-green-600', bgColor: 'bg-green-100' },
    { label: 'Data Points', value: '5.2M', icon: Database, iconColor: 'text-purple-600', bgColor: 'bg-purple-100' },
];

const actionData: ActionItem[] = [
    { title: 'Input Kinerja', description: 'Catat realisasi kinerja mingguan', iconType: 'performance', href: '/dashboard/pegawai/input-kinerja' },
    { title: 'Update Maintenance', description: 'Update status maintenance', iconType: 'maintenance', href: '/dashboard/pegawai/update-maintenance' },
    { title: 'Laporan Gangguan', description: 'Submit laporan gangguan', iconType: 'report', href: '/dashboard/pegawai/laporan-gangguan' },
    { title: 'Data Gudang', description: 'Input inventory gudang', iconType: 'warehouse', href: '/dashboard/pegawai/input-data-gudang' },
    { title: 'Log Aktivitas', description: 'Catat aktivitas lapangan', iconType: 'activity', href: '/dashboard/pegawai/log-aktivitas' },
];

const dashboardData: DashboardItem[] = [
    { title: 'NKO 2025 - UP3 Cimahi', description: 'Dashboard monitoring NKO UP3 Cimahi', metricCount: 24, type: 'nko', href: '#' },
    { title: 'ULP CIKO', description: 'Monitoring Unit Layanan Pelanggan Ciko', metricCount: 18, type: 'ulp', href: '#' },
];

/**
 * PegawaiDashboardPage - Main dashboard for pegawai role
 * Now part of data-submissions feature
 */
export function PegawaiDashboardPage() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Section Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Pegawai</h1>
                <p className="text-gray-500 mb-4">Akses semua dashboard dan sistem monitoring PLN dalam satu tempat</p>

                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">Role Anda:</span>
                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">Pegawai</span>
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">Up3 Cimahi</span>
                </div>
            </div>

            {/* 1. Summary Stats Grid */}
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

            {/* 2. Input Data & Laporan Section */}
            <div className="bg-white border border-blue-200 rounded-2xl p-6 mb-8 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <Settings className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Input Data & Laporan</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {actionData.map((action, idx) => (
                        <ActionCard key={idx} data={action} />
                    ))}
                </div>
            </div>

            {/* 3. Dashboard List Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {dashboardData.map((dash, idx) => (
                    <DashboardPreviewCard
                        key={idx}
                        title={dash.title}
                        description={dash.description}
                        metricCount={dash.metricCount}
                        icon={dash.type === 'nko' ? BarChart2 : Activity}
                        iconBg={dash.type === 'nko' ? 'bg-blue-600' : 'bg-green-500'}
                    />
                ))}
            </div>
        </div>
    );
}
