'use client';

import React from 'react';
import { Settings } from 'lucide-react';
import StatCard from '@/features/dashboard/dashboard-pegawai/components/StatCard';
import ActionCard from '@/features/dashboard/dashboard-pegawai/components/ActionCard';
import DashboardCard from '@/features/dashboard/dashboard-pegawai/components/DashboardCard';

// Import types
import { StatItem, ActionItem, DashboardItem } from '@/features/dashboard/dashboard-pegawai/types/dashboard';

// Data (same as before)
const statsData: StatItem[] = [
    { label: 'Total Dashboard', value: 8, iconType: 'chart', color: 'blue' },
    { label: 'Sistem Aktif', value: 7, iconType: 'bolt', color: 'green' },
    { label: 'Maintenance', value: 1, iconType: 'settings', color: 'orange' },
    { label: 'Data Points', value: '5.2M', iconType: 'database', color: 'purple' },
];

const actionData: ActionItem[] = [
    { title: 'Laporan Gangguan', description: 'Submit laporan gangguan', iconType: 'report', href: '/dashboard/pegawai/laporan-gangguan' },
    { title: 'Update Maintenance', description: 'Update status maintenance', iconType: 'maintenance', href: '/dashboard/pegawai/update-maintenance' },
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Central</h1>
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
                    <StatCard key={idx} data={stat} />
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
                    <DashboardCard key={idx} data={dash} />
                ))}
            </div>
        </div>
    );
}
