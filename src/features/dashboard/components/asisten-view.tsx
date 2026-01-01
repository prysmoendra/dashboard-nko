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

export function AsistenDashboardView() {
  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      
      {/* --- Header Section --- */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Dashboard Central
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
        <StatCard
          title="Total Dashboard"
          value="8"
          icon={<LayoutDashboard className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />}
          bgIcon="bg-blue-100"
        />
        <StatCard
          title="Sistem Aktif"
          value="7"
          icon={<Zap className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />}
          bgIcon="bg-green-100"
        />
        <StatCard
          title="Maintenance"
          value="1"
          icon={<Settings className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />}
          bgIcon="bg-orange-100"
        />
        <StatCard
          title="Data Points"
          value="5.2M"
          icon={<Database className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />}
          bgIcon="bg-purple-100"
        />
      </div>

      {/* --- Action Section --- */}
      <div className="space-y-6">
        
        {/* Link ke Instruksi */}
        <div className="rounded-xl border border-orange-400 bg-white p-5 sm:p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Inbox className="h-5 w-5 text-orange-600" />
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Instruksi dari Kepala Bidang</h2>
          </div>
          <p className="mb-6 text-sm text-gray-600">
            Lihat dan tindak lanjuti instruksi dari Kepala Bidang
          </p>
          
          <Link 
            href="/dashboard/asisten/instruksi" 
            className="group flex w-full flex-col items-center justify-center rounded-lg border border-gray-100 bg-gray-50 py-6 sm:py-8 hover:bg-gray-100 transition-colors active:scale-[0.99]"
          >
            <Inbox className="mb-2 h-6 w-6 text-orange-500 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-gray-900">Lihat Instruksi</span>
            <span className="text-xs text-gray-500 text-center px-4">Koordinasikan ke pegawai</span>
          </Link>
        </div>

        {/* Link ke Review & Approval */}
        <div className="rounded-xl border border-blue-400 bg-white p-5 sm:p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-blue-600" />
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Review & Approval</h2>
          </div>
          <p className="mb-6 text-sm text-gray-600">
            Lihat dan tindak lanjuti instruksi dari Kepala Bidang
          </p>
          
          <Link 
            href="/dashboard/asisten/review" 
            className="group flex w-full flex-col items-center justify-center rounded-lg border border-gray-100 bg-gray-50 py-6 sm:py-8 hover:bg-gray-100 transition-colors active:scale-[0.99]"
          >
            <CheckSquare className="mb-2 h-6 w-6 text-blue-500 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-gray-900">Lihat Review & Approval</span>
            <span className="text-xs text-gray-500 text-center px-4">Review dan Approval Data Input</span>
          </Link>
        </div>
      </div>

      {/* --- Bottom Dashboard Links --- */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <DashboardLinkCard
          title="NKO 2025 - UP3 Cimahi"
          description="Dashboard monitoring NKO UP3 Cimahi"
          metricTag="24 Metrics"
          icon={<BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />}
          iconBg="bg-blue-600"
        />
        <DashboardLinkCard
          title="ULP CIKO"
          description="Monitoring Unit Layanan Pelanggan Ciko"
          metricTag="18 Metrics"
          icon={<TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />}
          iconBg="bg-green-500"
        />
      </div>

    </div>
  );
}

// --- Komponen Pendukung ---

function StatCard({ title, value, icon, bgIcon }: any) {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      <div>
        <p className="text-xs sm:text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-1 text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg ${bgIcon}`}>
        {icon}
      </div>
    </div>
  );
}

function DashboardLinkCard({ title, description, metricTag, icon, iconBg }: any) {
  return (
    <div className="flex flex-col justify-between rounded-xl border bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      <div>
        <div className="flex items-start justify-between">
          <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg ${iconBg} shadow-sm`}>
            {icon}
          </div>
          <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-[10px] sm:text-xs font-medium text-gray-600">
            {metricTag}
          </span>
        </div>
        <h3 className="mt-4 text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-xs sm:text-sm text-gray-500">{description}</p>
      </div>
      
      <button className="mt-6 w-full rounded-md bg-blue-600 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors active:bg-blue-800">
        Lihat Dashboard
      </button>
    </div>
  );
}