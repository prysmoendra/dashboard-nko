"use client"; // Wajib ada untuk komponen interaktif di Next.js

import React from "react";
// Import ikon-ikon
import { ArrowLeft, Mail, Building2, Briefcase, Shield, Calendar, LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
// Import tipe data yang kita buat di Langkah 1
import { UserProfileData } from "../types";

// Kita tentukan bahwa komponen ini butuh data (props)
interface UserProfileProps {
  data: UserProfileData;
}

export default function UserProfile({ data }: UserProfileProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* --- HEADER (Tombol Kembali & Judul) --- */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center text-gray-500 hover:text-gray-700 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-1" />
            Kembali
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Profil Pengguna</h1>
        </div>
      </div>

      {/* --- KONTEN UTAMA --- */}
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* KARTU 1: Header Profil (Foto & Nama) */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Lingkaran Inisial Nama */}
            <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold shrink-0">
                {data.avatarInitial}
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">{data.fullName}</h2>
                <p className="text-gray-500">{data.email}</p>
                
                {/* Badges / Label warna-warni */}
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        <Shield className="w-3 h-3 mr-1" /> {data.role}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                        <Building2 className="w-3 h-3 mr-1" /> {data.unit}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                        <Briefcase className="w-3 h-3 mr-1" /> {data.department}
                    </span>
                </div>
            </div>
        </div>

        {/* KARTU 2: Informasi Akun */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Informasi Akun</h3>
                <p className="text-sm text-gray-500">Informasi detail tentang akun Anda</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nama Lengkap */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-800 border border-gray-100">
                        {data.fullName}
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg text-gray-800 border border-gray-100">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        {data.email}
                    </div>
                </div>

                 {/* Unit Kerja */}
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit Kerja</label>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg text-gray-800 border border-gray-100">
                        <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                        {data.unit}
                    </div>
                </div>

                {/* Bidang */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bidang</label>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg text-gray-800 border border-gray-100">
                        <Briefcase className="w-4 h-4 text-gray-400 mr-2" />
                        {data.department}
                    </div>
                </div>

                {/* Role */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role/Jabatan</label>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg text-gray-800 border border-gray-100">
                        <Shield className="w-4 h-4 text-gray-400 mr-2" />
                        {data.role}
                    </div>
                </div>
            </div>
        </div>

        {/* KARTU 3: Informasi Sistem */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Informasi Sistem</h3>
                <p className="text-sm text-gray-500">Informasi terkait akses sistem</p>
            </div>

            <div className="space-y-4">
                <div className="flex items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="p-2 bg-gray-50 rounded-lg mr-4">
                        <Calendar className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">Akun Dibuat</p>
                        <p className="text-xs text-gray-500">{data.accountCreatedAt}</p>
                    </div>
                </div>

                <div className="flex items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="p-2 bg-gray-50 rounded-lg mr-4">
                        <Shield className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">Level Akses</p>
                        <p className="text-xs text-gray-500">{data.accessLevel}</p>
                    </div>
                </div>

                <div className="flex items-start">
                    <div className="p-2 bg-gray-50 rounded-lg mr-4">
                        <LayoutDashboard className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">Total Dashboard Akses</p>
                        <p className="text-xs text-gray-500">{data.totalDashboards} Dashboard</p>
                    </div>
                </div>
            </div>
        </div>

        {/* TOMBOL AKSI BAWAH */}
        <div className="flex items-center gap-3 mt-8">
            <Link 
                href="/dashboard"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
                Kembali ke Dashboard
            </Link>
            <button className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors flex items-center">
                <LogOut className="w-4 h-4 mr-2" />
                Keluar
            </button>
        </div>

      </div>
    </div>
  );
}