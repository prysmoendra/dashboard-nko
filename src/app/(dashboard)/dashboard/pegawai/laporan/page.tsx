"use client";

import React, { useState } from 'react';
import {
  ChevronLeft, Activity, Clock, CheckCircle, XCircle,
  AlertCircle, FileText, Zap
} from 'lucide-react';
import Link from 'next/link';

export default function PegawaiLaporanPage() {
  const [activeFilter, setActiveFilter] = useState("Semua");

  // --- DATA STATISTIK (Semua 0 sesuai gambar) ---
  const stats = [
    {
      label: "Total Laporan",
      value: 0,
      icon: Activity,
      color: "text-blue-600",
      bgIcon: "bg-transparent" // Icon chart garis biru tanpa background
    },
    {
      label: "Menunggu",
      value: 0,
      icon: Clock,
      color: "text-orange-500",
      bgIcon: "bg-transparent"
    },
    {
      label: "Approved",
      value: 0,
      icon: CheckCircle,
      color: "text-green-500",
      bgIcon: "bg-transparent"
    },
    {
      label: "Rejected",
      value: 0,
      icon: XCircle,
      color: "text-red-500",
      bgIcon: "bg-transparent"
    },
  ];

  // --- DATA FILTER ---
  const filters = [
    { id: "Semua", label: "Semua (0)" },
    { id: "Gangguan", label: "Gangguan (0)" },
    { id: "Maintenance", label: "Maintenance (0)" },
    { id: "Gudang", label: "Gudang (0)" },
    { id: "Log", label: "Log Aktivitas (0)" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">

      {/* --- 1. TOP NAVIGATION BAR --- */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/pegawai"
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali
        </Link>
        <div className="h-6 w-px bg-gray-300"></div>

        {/* Judul Halaman dengan Ikon Petir Biru */}
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1 rounded-md">
            <Zap className="w-3 h-3 text-white" fill="currentColor" />
          </div>
          <span className="font-bold text-gray-900 text-sm">Data & Laporan</span>
        </div>
      </div>

      {/* --- 2. HEADER TITLE --- */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Laporan Saya</h1>
        <p className="text-gray-500">Lihat status semua laporan yang Anda submit</p>
      </div>

      {/* --- 3. STATS CARDS (4 Kotak) --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
            </div>
            {/* Icon di sebelah kanan */}
            <div className={`${stat.bgIcon}`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} strokeWidth={1.5} />
            </div>
          </div>
        ))}
      </div>

      {/* --- 4. FILTER BAR --- */}
      <div className="bg-gray-100 p-1.5 rounded-xl inline-flex flex-wrap gap-1 mb-8">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeFilter === filter.id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:bg-gray-200/50 hover:text-gray-700"
              }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* --- 5. EMPTY STATE (Konten Kosong) --- */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-80 flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak ada laporan</h3>
        <p className="text-gray-400 text-sm max-w-xs mx-auto">
          Belum ada data laporan yang ditemukan untuk kategori ini.
        </p>
      </div>

    </div>
  );
}