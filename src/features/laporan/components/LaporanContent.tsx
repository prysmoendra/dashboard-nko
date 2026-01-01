"use client"; // Wajib karena ada useState (interaktif)

import React, { useState } from 'react';
import { 
  FileText, Clock, CheckCircle, XCircle, 
  Activity, AlertCircle 
} from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Kita pakai export default biar gampang di-import
export default function LaporanContent() {
  // State untuk Tab Filter
  const [activeTab, setActiveTab] = useState("Semua");

  // Data Statistik Dummy
  const stats = [
    {
      title: "Total Laporan",
      value: "0",
      icon: Activity,
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      title: "Menunggu",
      value: "0",
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Approved",
      value: "0",
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      title: "Rejected",
      value: "0",
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-50"
    },
  ];

  // List Tab
  const tabs = [
    "Semua", "Gangguan", "Maintenance", "Gudang", "Log Aktivitas"
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      
      {/* --- HEADER --- */}
      <div className="flex items-center gap-4 mb-6">
        <Link 
          href="/dashboard" 
          className="flex items-center text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Kembali
        </Link>
        <div className="h-6 w-px bg-gray-300"></div>
        <div className="flex items-center gap-2 text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full text-sm">
          <FileText className="w-4 h-4" />
          Data & Laporan
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Laporan Saya</h1>
        <p className="text-gray-500 mt-1">Lihat status semua laporan yang Anda submit</p>
      </div>

      {/* --- KARTU STATISTIK --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-full ${stat.bgColor} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* --- TABS FILTER --- */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-white text-gray-800 shadow-sm ring-1 ring-gray-200"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            {tab} (0)
          </button>
        ))}
      </div>

      {/* --- EMPTY STATE --- */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center h-64 flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">Tidak ada laporan</h3>
        <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">
          Belum ada data laporan yang ditemukan untuk kategori ini.
        </p>
      </div>

    </div>
  );
}