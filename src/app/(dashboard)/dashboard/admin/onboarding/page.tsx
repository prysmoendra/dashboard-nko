"use client";

import React, { useState } from 'react';
import { 
  Zap, User, Briefcase, Shield, Info, CheckCircle, 
  ChevronDown 
} from 'lucide-react';
import Link from 'next/link';

export default function AdminOnboardingPage() {
  const [role] = useState("Super Admin");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      
      {/* Container Putih Tengah */}
      <div className="bg-white max-w-xl w-full rounded-2xl shadow-sm border border-gray-200 p-8">
        
        {/* --- 1. HEADER LOGO --- */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <Zap className="w-6 h-6 text-white fill-current" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Selamat Datang di PLN Dashboard Suite</h1>
          <p className="text-gray-500">
            Halo <span className="font-bold text-gray-800">Demo</span>, silakan pilih role dan unit kerja Anda
          </p>
        </div>

        {/* --- 2. FORM SECTION --- */}
        <div className="space-y-6">
          
          {/* Email (Read Only) */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              value="Email: demo@pln.co.id" 
              readOnly
              className="block w-full pl-10 pr-3 py-3 border border-blue-200 rounded-lg bg-blue-50 text-gray-600 sm:text-sm focus:ring-0 focus:border-blue-200"
            />
          </div>

          {/* Pilih Role (Dropdown) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Briefcase className="w-4 h-4" /> Pilih Role/Jabatan
            </label>
            <div className="relative">
              <div className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 pr-10 appearance-none font-medium">
                Super Admin
                <span className="block text-xs text-gray-400 font-normal mt-0.5">Full system access</span>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Alert Info (Ungu) */}
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 flex gap-3">
            <div className="shrink-0 mt-0.5">
              <Briefcase className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-purple-900">Super Admin Access</h4>
              <p className="text-xs text-purple-700 mt-1 leading-relaxed">
                Anda akan memiliki akses penuh ke semua bidang dan unit kerja. Tidak perlu memilih bidang atau unit kerja tertentu.
              </p>
            </div>
          </div>

          {/* Preview Profil (Hijau) */}
          <div className="bg-green-50 border border-green-100 rounded-xl p-4">
            <p className="text-sm font-medium text-green-800 mb-3">Preview Profil Anda:</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Role:</p>
                <p className="text-sm font-bold text-gray-800 flex items-center gap-1">
                   Super Admin
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Akses:</p>
                <p className="text-sm font-bold text-purple-600">
                  Semua Bidang & Unit
                </p>
              </div>
            </div>
          </div>

          {/* --- 3. FOOTER BUTTON --- */}
          <div>
            <Link 
              href="/dashboard/admin" 
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Lanjutkan ke Dashboard
            </Link>
            <p className="mt-4 text-center text-xs text-gray-400">
              Pastikan informasi yang Anda pilih sudah benar. Anda dapat mengubahnya nanti di halaman profil.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}