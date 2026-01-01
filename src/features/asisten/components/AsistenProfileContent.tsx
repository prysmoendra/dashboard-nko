"use client";

import React from 'react';
import { 
  ArrowLeft, Mail, Building2, Briefcase, Shield, Calendar, 
  LayoutDashboard, LogOut, User 
} from 'lucide-react';
import Link from 'next/link';

export default function AsistenProfileContent() {
  // Data Hardcode sesuai gambar referensi "Emo"
  const user = {
    name: "Emo",
    email: "emo@pln.co.id",
    role: "Asisten Kepala Bidang",
    unit: "UP3 Cimahi",
    bidang: "Distribusi", // Sesuai badge ungu di gambar
    joinDate: "19 November 2025",
    accessLevel: "Standard User",
    totalDashboards: 8
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      
      {/* --- HEADER NAVIGASI --- */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/asisten" className="flex items-center text-gray-500 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-1" />
          Kembali
        </Link>
        <div className="h-6 w-px bg-gray-300"></div>
        <h1 className="text-xl font-bold text-gray-800">Profil Pengguna</h1>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">

        {/* --- KARTU 1: HEADER PROFIL (FOTO & BADGES) --- */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6">
          {/* Avatar Lingkaran Biru */}
          <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-normal shrink-0">
            E
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-1">
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
            
            {/* Badges Role & Unit (Sesuai Gambar) */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
              {/* Badge Role (Biru) */}
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                <Shield className="w-3 h-3 mr-1" /> {user.role}
              </span>
              {/* Badge Unit (Hijau) */}
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                <Building2 className="w-3 h-3 mr-1" /> {user.unit}
              </span>
              {/* Badge Bidang (Ungu) */}
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                <Briefcase className="w-3 h-3 mr-1" /> Bidang {user.bidang}
              </span>
            </div>
          </div>
        </div>

        {/* --- KARTU 2: INFORMASI AKUN (FORM READ-ONLY) --- */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Informasi Akun</h3>
            <p className="text-sm text-gray-500">Informasi detail tentang akun Anda</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Lengkap */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <div className="p-3 bg-gray-50 rounded-lg text-gray-800 border border-gray-100 text-sm">
                {user.name}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg text-gray-800 border border-gray-100 text-sm">
                <Mail className="w-4 h-4 text-gray-400 mr-2" />
                {user.email}
              </div>
            </div>

            {/* Unit Kerja */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit Kerja</label>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg text-gray-800 border border-gray-100 text-sm">
                <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                {user.unit}
              </div>
            </div>

            {/* Bidang */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bidang</label>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg text-gray-800 border border-gray-100 text-sm">
                <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                {user.bidang}
              </div>
            </div>

            {/* Role/Jabatan (Full Width) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Role/Jabatan</label>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg text-gray-800 border border-gray-100 text-sm">
                <Shield className="w-4 h-4 text-gray-400 mr-2" />
                {user.role}
              </div>
            </div>
          </div>
        </div>

        {/* --- KARTU 3: INFORMASI SISTEM --- */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Informasi Sistem</h3>
            <p className="text-sm text-gray-500">Informasi terkait akses sistem</p>
          </div>

          <div className="space-y-4">
            {/* Akun Dibuat */}
            <div className="flex items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
              <div className="p-2 bg-gray-50 rounded-lg mr-4">
                <Calendar className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Akun Dibuat</p>
                <p className="text-xs text-gray-500">{user.joinDate}</p>
              </div>
            </div>

            {/* Level Akses */}
            <div className="flex items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
              <div className="p-2 bg-gray-50 rounded-lg mr-4">
                <Shield className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Level Akses</p>
                <p className="text-xs text-gray-500">{user.accessLevel}</p>
              </div>
            </div>

            {/* Total Dashboard */}
            <div className="flex items-start">
              <div className="p-2 bg-gray-50 rounded-lg mr-4">
                <LayoutDashboard className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Total Dashboard Akses</p>
                <p className="text-xs text-gray-500">{user.totalDashboards} Dashboard</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- TOMBOL FOOTER --- */}
        <div className="flex items-center gap-3 mt-8">
          <Link 
            href="/dashboard/asisten"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Kembali ke Dashboard
          </Link>
          <button className="px-4 py-2 border border-red-500 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors flex items-center">
            Keluar
          </button>
        </div>

      </div>
    </div>
  );
}