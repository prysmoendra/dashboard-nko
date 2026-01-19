"use client";

import React, { useState } from 'react';
import { ChevronLeft, Activity, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export function ReviewApprovalPage() {
    const [activeTab, setActiveTab] = useState('Semua');
    const tabs = [
        { label: 'Semua', count: 0 },
        { label: 'Gangguan', count: 0 },
        { label: 'Maintenance', count: 0 },
        { label: 'Gudang', count: 0 },
        { label: 'Log Aktivitas', count: 0 },
    ];

    return (
        <div className="space-y-8 pb-10">
            <div>
                <Link href="/dashboard/asisten" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                    <ChevronLeft className="h-4 w-4" /> Kembali
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Review & Approval</h1>
                <p className="mt-2 text-gray-600">Review dan approve laporan dari tim</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total Laporan" value="0" icon={<Activity className="h-6 w-6 text-blue-600" />} />
                <StatCard label="Menunggu" value="0" icon={<Clock className="h-6 w-6 text-orange-600" />} />
                <StatCard label="Approved" value="0" icon={<CheckCircle className="h-6 w-6 text-green-600" />} />
                <StatCard label="Rejected" value="0" icon={<XCircle className="h-6 w-6 text-red-600" />} />
            </div>

            <div className="flex flex-wrap gap-2 rounded-xl bg-gray-100 p-1.5 w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.label}
                        onClick={() => setActiveTab(tab.label)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeTab === tab.label ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                    >
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
                    <AlertCircle className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Tidak ada laporan</h3>
                <p className="mt-1 text-sm text-gray-500">Belum ada data laporan yang masuk untuk saat ini.</p>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div><p className="text-sm font-medium text-gray-500">{label}</p><p className="mt-1 text-3xl font-bold text-gray-900">{value}</p></div>
            <div>{icon}</div>
        </div>
    );
}
