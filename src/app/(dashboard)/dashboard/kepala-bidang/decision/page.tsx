"use client";

import React, { useState } from 'react';
import { 
  FileText, Send, Clock, CheckCircle, 
  Filter, Check, Eye, Plus 
} from 'lucide-react';
// Import komponen yang BARU saja kita buat di Tahap 1
import PageHeader from '@/shared/components/PageHeader';

export default function DecisionPage() {
  const [activeFilter, setActiveFilter] = useState("Semua");

  // --- DATA DUMMY (Persis Sesuai Gambar) ---
  const decisions = [
    {
      id: "KEP001",
      title: "Perbaikan Jaringan Segera di Area Cibeureum",
      status: "Selesai",
      statusColor: "bg-green-500 text-white border-green-500", // Badge Hijau Solid
      statusIcon: Check,
      tag: "Urgent",
      tagColor: "bg-red-100 text-red-600",
      desc: "Berdasarkan laporan gangguan yang masuk, diperlukan perbaikan jaringan segera di area Cibeureum. Koordinasikan dengan tim lapangan untuk penanganan dalam 24 jam.",
      meta: { id: "KEP001", cat: "Operasional", to: "Asisten Kepala Bidang Operasional", date: "2025-11-27 09:30" },
      note: "Sudah selesai ditangani oleh tim" // Catatan Hijau
    },
    {
      id: "KEP002",
      title: "Review Jadwal Maintenance Triwulan IV",
      status: "Dibaca",
      statusColor: "bg-gray-100 text-gray-600 border-gray-200", // Badge Abu
      statusIcon: Eye,
      tag: "Sedang",
      tagColor: "bg-blue-100 text-blue-600",
      desc: "Mohon review ulang jadwal maintenance triwulan IV mengingat ada beberapa unit yang perlu diprioritaskan.",
      meta: { id: "KEP002", cat: "Maintenance", to: "Asisten Kepala Bidang Maintenance", date: "2025-11-26 14:15" },
      note: null
    },
    {
      id: "KEP003",
      title: "Pengadaan Material Kabel ACSR",
      status: "Terkirim",
      statusColor: "bg-black text-white border-black", // Badge Hitam
      statusIcon: Send,
      tag: "Tinggi",
      tagColor: "bg-orange-100 text-orange-600",
      desc: "Segera koordinasikan pengadaan kabel ACSR 150mm untuk proyek perluasan jaringan bulan depan.",
      meta: { id: "KEP003", cat: "Pengadaan", to: "Asisten Kepala Bidang Gudang", date: "2025-11-25 10:00" },
      note: null
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      
      {/* 1. HEADER */}
      <PageHeader 
        title="Keputusan & Instruksi Kepala Bidang"
        subtitle="Buat dan kirim keputusan kepada Asisten Kepala Bidang untuk dikoordinasikan kepada pegawai"
      />

      {/* 2. TOMBOL BUAT BARU */}
      <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors mb-8 shadow-sm">
        <FileText className="w-4 h-4" />
        Buat Keputusan Baru
      </button>

      {/* 3. STATISTIK CARDS (4 Kotak) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Keputusan", val: "3", icon: FileText, color: "text-gray-900", bg: "bg-blue-50 text-blue-600" },
          { label: "Terkirim", val: "1", icon: Send, color: "text-blue-600", bg: "bg-blue-100 text-blue-600" },
          { label: "Dalam Proses", val: "1", icon: Clock, color: "text-orange-600", bg: "bg-orange-100 text-orange-600" },
          { label: "Selesai", val: "1", icon: CheckCircle, color: "text-green-600", bg: "bg-green-100 text-green-600" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-gray-200 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <h3 className={`text-3xl font-bold ${stat.color}`}>{stat.val}</h3>
            </div>
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* 4. FILTER BAR */}
      <div className="bg-white p-2 rounded-xl border border-gray-200 mb-6 flex flex-wrap items-center gap-2">
        <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg">
          <Filter className="w-5 h-5" />
        </button>
        {["Semua (3)", "Terkirim (1)", "Dibaca (1)", "Selesai (1)"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors border ${
              activeFilter === tab 
                ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 5. LIST KARTU */}
      <div className="space-y-4">
        {decisions.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            
            {/* Header Kartu */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${item.tagColor}`}>
                  {item.tag}
                </span>
              </div>
              
              {/* Badge Status */}
              <div className={`px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-bold border ${item.statusColor}`}>
                <item.statusIcon className="w-3 h-3" />
                {item.status}
              </div>
            </div>

            {/* Deskripsi */}
            <p className="text-gray-600 text-sm mb-4 leading-relaxed max-w-4xl">
              {item.desc}
            </p>

            {/* Meta Data (Baris Abu-abu) */}
            <div className="flex flex-wrap gap-y-2 text-xs text-gray-500 mb-4 items-center">
              <div className="mr-5"><span className="font-bold text-gray-700">ID:</span> {item.meta.id}</div>
              <div className="mr-5"><span className="font-bold text-gray-700">Kategori:</span> {item.meta.cat}</div>
              <div className="mr-5"><span className="font-bold text-gray-700">Penerima:</span> {item.meta.to}</div>
              <div><span className="font-bold text-gray-700">Tanggal:</span> {item.meta.date}</div>
            </div>

            {/* Catatan (Hijau) - Hanya muncul jika ada */}
            {item.note && (
              <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-sm text-green-800 flex items-start gap-2">
                 <span className="font-bold">Catatan:</span> {item.note}
              </div>
            )}

          </div>
        ))}
      </div>

    </div>
  );
}