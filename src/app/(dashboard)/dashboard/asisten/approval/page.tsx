"use client";

import React, { useState } from 'react';
import { 
  ArrowLeft, Activity, Clock, CheckCircle, XCircle, 
  AlertCircle 
} from 'lucide-react';
import Link from 'next/link';

export default function ApprovalPage() {
  // State untuk Tab yang sedang aktif
  const [activeTab, setActiveTab] = useState("Semua");

  // Data Statistik (Semua 0 sesuai gambar)
  const stats = [
    {
      title: "Total Laporan",
      value: "0",
      icon: Activity,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100"
    },
    {
      title: "Menunggu",
      value: "0",
      icon: Clock,
      color: "text-yellow-500", // Warna Orange/Kuning
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-100"
    },
    {
      title: "Approved",
      value: "0",
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-100"
    },
    {
      title: "Rejected",
      value: "0",
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-100"
    },
  ];

  // List Tab Filter
  const tabs = [
    "Semua", "Gangguan", "Maintenance", "Gudang", "Log Aktivitas"
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      
      {/* --- HEADER NAVIGASI --- */}
      <div className="flex items-center gap-4 mb-6">
        <Link 
          href="/dashboard/asisten" 
          className="flex items-center text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Kembali
        </Link>
        <div className="h-6 w-px bg-gray-300"></div>
        {/* Ikon Petir Biru sesuai gambar */}
        <div className="flex items-center gap-2 text-gray-800 font-bold text-lg">
          <div className="p-1 bg-blue-600 rounded-md">
            <Activity className="w-4 h-4 text-white" />
          </div>
          Data & Laporan
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Review & Approval</h1>
        <p className="text-gray-500 mt-1 text-lg">Review dan approve laporan dari tim</p>
      </div>

      {/* --- KARTU STATISTIK (4 KOTAK) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">{stat.title}</p>
              <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
            </div>
            {/* Ikon di sebelah kanan */}
            <div className={`p-3 rounded-full bg-opacity-0 ${stat.color}`}>
              <stat.icon className="w-8 h-8" />
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
                ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200"
                : "text-gray-900 bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {tab} (0)
          </button>
        ))}
      </div>

      {/* --- EMPTY STATE (KOSONG) --- */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm h-80 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center mb-4 text-gray-400">
          <AlertCircle className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 text-lg font-medium">
          Tidak ada laporan
        </p>
      </div>

    </div>
  );
}