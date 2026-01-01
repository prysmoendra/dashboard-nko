"use client";

import React from 'react';
import { 
  LayoutDashboard, Activity, Settings, Database, 
  FileText, ScrollText, BarChart2, TrendingUp, 
  ArrowLeft 
} from 'lucide-react';
import Link from 'next/link';

export default function KepalaBidangDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      
      {/* --- HEADER NAVIGASI --- */}
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Menu Utama
        </Link>
      </div>

      {/* --- 1. HEADER SECTION --- */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Central</h1>
        <p className="text-gray-500 mb-4">Akses semua dashboard dan sistem monitoring PLN dalam satu tempat</p>
        
        {/* Badges Role & Unit */}
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-500">Role Anda:</span>
          {/* Badge Biru untuk Kabid */}
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
            Kepala Bidang
          </span>
          {/* Badge Hijau untuk Unit */}
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
            Up3 Cimahi
          </span>
        </div>
      </div>

      {/* --- 2. STATS CARDS (4 KOTAK STANDAR) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Dashboard</p>
            <h3 className="text-3xl font-bold text-gray-900">8</h3>
          </div>
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <LayoutDashboard className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Sistem Aktif</p>
            <h3 className="text-3xl font-bold text-green-600">7</h3>
          </div>
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Maintenance</p>
            <h3 className="text-3xl font-bold text-orange-600">1</h3>
          </div>
          <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
            <Settings className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Data Points</p>
            <h3 className="text-3xl font-bold text-purple-600">5.2M</h3>
          </div>
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <Database className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* --- 3. ACTION SECTIONS (Instruksi & Keputusan) --- */}
      <div className="space-y-6 mb-10">
        
        {/* KOTAK ORANGE: Instruksi Target Bulanan */}
        <div className="bg-white rounded-xl border border-orange-500 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-gray-800">
            <FileText className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-lg">Instruksi Target Bulanan</h3>
          </div>
          <p className="text-gray-500 mb-6 text-sm">Buat dan kirim instruksi kepada Asisten Kepala Bidang</p>
          
          {/* Empty State Box */}
          <div className="border border-gray-100 rounded-lg bg-gray-50 h-24 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-100 transition-colors">
             <FileText className="w-6 h-6 text-orange-500 mb-1 opacity-70" />
             <p className="text-sm font-bold text-gray-800">Buat Instruksi</p>
             <p className="text-xs text-gray-400">Kirim instruksi ke Asisten Kepala Bidang</p>
          </div>
        </div>

        {/* KOTAK UNGU: Rekomendasi Keputusan (KHUSUS KABID) */}
        <div className="bg-white rounded-xl border border-purple-500 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-gray-800">
            <ScrollText className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-lg">Rekomendasi Keputusan</h3>
          </div>
          <p className="text-gray-500 mb-6 text-sm">Buat dan kirim keputusan kepada Asisten Kepala Bidang</p>
          
          {/* Empty State Box */}
          <div className="border border-gray-100 rounded-lg bg-gray-50 h-24 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-100 transition-colors">
             <ScrollText className="w-6 h-6 text-purple-500 mb-1 opacity-70" />
             <p className="text-sm font-bold text-gray-800">Buat Keputusan</p>
             <p className="text-xs text-gray-400">Kirim instruksi ke Asisten Kepala Bidang</p>
          </div>
        </div>

      </div>

      {/* --- 4. DASHBOARD LINKS (NKO & ULP) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* NKO Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-600 rounded-lg text-white">
              <BarChart2 className="w-6 h-6" />
            </div>
            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded">24 Metrics</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">NKO 2025 - UP3 Cimahi</h3>
          <p className="text-gray-500 text-sm mb-6">Dashboard monitoring NKO UP3 Cimahi</p>
          <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
            Lihat Dashboard
          </button>
        </div>

        {/* ULP Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-500 rounded-lg text-white">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded">18 Metrics</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">ULP CIKO</h3>
          <p className="text-gray-500 text-sm mb-6">Monitoring Unit Layanan Pelanggan Ciko</p>
          <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
            Lihat Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}