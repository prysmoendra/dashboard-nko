"use client";

import React from 'react';
import { 
  ArrowLeft, Mail, Building2, Briefcase, Shield, Calendar, 
  LayoutDashboard, LogOut, User 
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminProfilePage() {
  const router = useRouter();

  // --- DATA DUMMY SUPER ADMIN (Sesuai Gambar 19) ---
  const userProfile = {
    name: "Demo",
    email: "demo@pln.co.id",
    role: "Super Admin",
    unit: "Semua Unit",
    bidang: "Semua Bidang",
    joinDate: "19 November 2025",
    accessLevel: "Standard User", // Sesuai teks di gambar
    totalDashboards: 8
  };

  const handleLogout = () => {
    // Logika logout sederhana
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      
      {/* --- 1. HEADER NAVIGASI --- */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/dashboard/admin" 
          className="flex items-center text-gray-500 hover:text-blue-600 transition-colors group text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Kembali
        </Link>
        <div className="h-6 w-px bg-gray-300"></div>
        
        {/* Judul Halaman dengan Ikon Petir Biru (Opsional, di gambar hanya teks) */}
        <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1 rounded-md">
                <Shield className="w-3 h-3 text-white" fill="currentColor" />
            </div>
            <span className="font-bold text-gray-900 text-sm">Profil Pengguna</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">

        {/* --- KARTU 1: HEADER PROFIL (Avatar & Badges) --- */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8">
          {/* Avatar Besar */}
          <div className="w-28 h-28 rounded-full bg-blue-600 flex items-center justify-center text-white text-5xl font-semibold shadow-md shrink-0">
            {userProfile.name.charAt(0)}
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">{userProfile.name}</h2>
            <p className="text-gray-500 text-lg flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4" />
              {userProfile.email}
            </p>
            
            {/* Badges */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
              {/* Badge Role (Biru) */}
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-700 border border-blue-200">
                <Shield className="w-4 h-4 mr-1.5" /> {userProfile.role}
              </span>
              {/* Badge Unit (Hijau) */}
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                <Building2 className="w-4 h-4 mr-1.5" /> {userProfile.unit}
              </span>
              {/* Badge Bidang (Ungu) */}
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-700 border border-purple-200">
                <Briefcase className="w-4 h-4 mr-1.5" /> 
                <span className="whitespace-pre-line text-left">{userProfile.bidang}</span>
              </span>
            </div>
          </div>
        </div>

        {/* --- GRID KARTU INFORMASI --- */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          
          {/* --- KARTU 2: INFORMASI AKUN (Kiri) --- */}
          <div className="md:col-span-3 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-1">Informasi Akun</h3>
              <p className="text-sm text-gray-500">Informasi detail tentang akun Anda</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nama Lengkap */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Nama Lengkap</label>
                    <div className="p-4 bg-gray-50 rounded-xl text-gray-900 border border-gray-200 font-medium text-sm">
                    {userProfile.name}
                    </div>
                </div>
                 {/* Email */}
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Email</label>
                    <div className="flex items-center p-4 bg-gray-50 rounded-xl text-gray-900 border border-gray-200 font-medium text-sm">
                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                    {userProfile.email}
                    </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Unit Kerja */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Unit Kerja</label>
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl text-gray-900 border border-gray-200 font-medium text-sm">
                    <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                    {userProfile.unit}
                  </div>
                </div>

                {/* Bidang */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Bidang</label>
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl text-gray-900 border border-gray-200 font-medium text-sm">
                    <Briefcase className="w-4 h-4 text-gray-400 mr-2" />
                    Semua Bidang
                  </div>
                </div>
              </div>

              {/* Role/Jabatan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Role/Jabatan</label>
                <div className="flex items-center p-4 bg-gray-50 rounded-xl text-gray-900 border border-gray-200 font-medium text-sm">
                  <Shield className="w-4 h-4 text-gray-400 mr-2" />
                  {userProfile.role}
                </div>
              </div>
            </div>
          </div>

          {/* --- KARTU 3: INFORMASI SISTEM (Kanan) --- */}
          <div className="md:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full flex flex-col">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-1">Informasi Sistem</h3>
              <p className="text-sm text-gray-500">Informasi terkait akses sistem</p>
            </div>

            <div className="space-y-6 flex-1">
              {/* Item 1: Tanggal Bergabung */}
              <div className="flex items-center p-4 bg-white rounded-xl border-b border-gray-100 last:border-0">
                <div className="mr-4 text-gray-400">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-0.5">Akun Dibuat</p>
                  <p className="text-xs text-gray-500">{userProfile.joinDate}</p>
                </div>
              </div>

              {/* Item 2: Level Akses */}
              <div className="flex items-center p-4 bg-white rounded-xl border-b border-gray-100 last:border-0">
                <div className="mr-4 text-gray-400">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-0.5">Level Akses</p>
                  <p className="text-xs text-gray-500">{userProfile.accessLevel}</p>
                </div>
              </div>

              {/* Item 3: Total Dashboard */}
              <div className="flex items-center p-4 bg-white rounded-xl">
                <div className="mr-4 text-gray-400">
                  <LayoutDashboard className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-0.5">Total Dashboard Akses</p>
                  <p className="text-xs text-gray-500">{userProfile.totalDashboards} Dashboard</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- FOOTER BUTTONS --- */}
        <div className="flex items-center gap-4 mt-8 pt-6">
          <Link 
            href="/dashboard/admin"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center min-w-[180px]"
          >
            Kembali ke Dashboard
          </Link>
          <button 
            onClick={handleLogout}
            className="px-6 py-3 border border-red-500 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center min-w-[120px]"
          >
            Keluar
          </button>
        </div>

      </div>
    </div>
  );
}