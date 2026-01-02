"use client";

import React from 'react';
import { 
  ArrowLeft, Mail, Building2, Briefcase, Shield, Calendar, 
  LayoutDashboard, LogOut 
} from 'lucide-react';
import Link from 'next/link';

// --- DATA DUMMY KHUSUS PEGAWAI ---
// Data ini disesuaikan agar relevan dengan role Pegawai
const userProfile = {
  name: "Ahmad Fauzi",
  email: "ahmad.fauzi@pln.co.id",
  role: "Pegawai", // Role diubah jadi Pegawai
  unit: "UP3 Cimahi",
  bidang: "Distribusi",
  jabatanLengkap: "Staf Teknik Distribusi", // Tambahan detail jabatan
  joinDate: "10 Januari 2023",
  accessLevel: "Basic User", // Level akses standar pegawai
  totalDashboards: 2 // Pegawai mungkin hanya akses sedikit dashboard
};

export default function PegawaiProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      
      {/* --- 1. HEADER NAVIGASI (KEMBALI) --- */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/dashboard/pegawai" 
          className="flex items-center text-gray-500 hover:text-blue-600 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Kembali</span>
        </Link>
        <div className="h-6 w-px bg-gray-300"></div>
        <h1 className="text-xl font-bold text-gray-800">Profil Pengguna</h1>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">

        {/* --- KARTU 1: HEADER PROFIL UTAMA (FOTO & BADGES) --- */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8">
          {/* Avatar Lingkaran Besar */}
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-5xl font-semibold shadow-md shrink-0">
            {userProfile.name.charAt(0)}
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">{userProfile.name}</h2>
            <p className="text-gray-500 text-lg flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4" />
              {userProfile.email}
            </p>
            
            {/* Badges Role & Unit (Warna disesuaikan untuk Pegawai) */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
              {/* Badge Role - Biru untuk Pegawai */}
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-700 border border-blue-200">
                <Shield className="w-4 h-4 mr-1.5" /> {userProfile.role}
              </span>
              {/* Badge Unit - Hijau */}
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                <Building2 className="w-4 h-4 mr-1.5" /> {userProfile.unit}
              </span>
              {/* Badge Bidang - Ungu */}
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-700 border border-purple-200">
                <Briefcase className="w-4 h-4 mr-1.5" /> {userProfile.bidang}
              </span>
            </div>
          </div>
        </div>

        {/* --- GRID KARTU INFORMASI DETAIL --- */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          
          {/* --- KARTU 2: INFORMASI AKUN (Kiri - Lebih Lebar) --- */}
          <div className="md:col-span-3 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-1">Informasi Akun</h3>
              <p className="text-sm text-gray-500">Detail data kepegawaian Anda</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Nama Lengkap */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Nama Lengkap</label>
                <div className="p-4 bg-gray-50 rounded-xl text-gray-900 border border-gray-200 font-medium flex items-center">
                  <UserIcon className="w-5 h-5 text-gray-400 mr-3" />
                  {userProfile.name}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Email Kedinasan</label>
                <div className="flex items-center p-4 bg-gray-50 rounded-xl text-gray-900 border border-gray-200 font-medium">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  {userProfile.email}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Unit Kerja */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Unit Kerja</label>
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl text-gray-900 border border-gray-200 font-medium">
                    <Building2 className="w-5 h-5 text-gray-400 mr-3" />
                    {userProfile.unit}
                  </div>
                </div>

                {/* Bidang */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Bidang</label>
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl text-gray-900 border border-gray-200 font-medium">
                    <Briefcase className="w-5 h-5 text-gray-400 mr-3" />
                    {userProfile.bidang}
                  </div>
                </div>
              </div>

              {/* Jabatan Lengkap */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Jabatan Lengkap</label>
                <div className="flex items-center p-4 bg-gray-50 rounded-xl text-gray-900 border border-gray-200 font-medium">
                  <Shield className="w-5 h-5 text-gray-400 mr-3" />
                  {userProfile.jabatanLengkap}
                </div>
              </div>
            </div>
          </div>

          {/* --- KARTU 3: INFORMASI SISTEM (Kanan) --- */}
          <div className="md:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full flex flex-col">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-1">Informasi Sistem</h3>
              <p className="text-sm text-gray-500">Status dan akses akun di aplikasi</p>
            </div>

            <div className="space-y-6 flex-1">
              {/* Item 1: Tanggal Bergabung */}
              <div className="flex items-center p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg mr-4">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Terdaftar Sejak</p>
                  <p className="text-lg font-bold text-gray-900">{userProfile.joinDate}</p>
                </div>
              </div>

              {/* Item 2: Level Akses */}
              <div className="flex items-center p-4 bg-green-50/50 rounded-xl border border-green-100">
                <div className="p-3 bg-green-100 text-green-600 rounded-lg mr-4">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Level Akses</p>
                  <p className="text-lg font-bold text-gray-900">{userProfile.accessLevel}</p>
                </div>
              </div>

              {/* Item 3: Total Dashboard */}
              <div className="flex items-center p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-lg mr-4">
                  <LayoutDashboard className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Akses Dashboard</p>
                  <p className="text-lg font-bold text-gray-900">{userProfile.totalDashboards} Unit</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- FOOTER BUTTONS --- */}
        <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
          <button className="px-6 py-3 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-sm font-bold transition-colors flex items-center gap-2">
            <LogOut className="w-5 h-5" />
            Keluar Aplikasi
          </button>
          <Link 
            href="/dashboard/pegawai"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center gap-2"
          >
            <LayoutDashboard className="w-5 h-5" />
            Kembali ke Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
}

// Komponen User Icon kecil untuk di dalam input
function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  )
}