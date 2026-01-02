"use client";

import React, { useState } from 'react';
import { Zap, User, Building2, Shield, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("Super Admin");

  const handleContinue = () => {
    // Redirect sesuai role yang dipilih
    if (selectedRole === "Super Admin") {
      router.push('/dashboard/admin'); // Masuk ke Dashboard Admin
    } else if (selectedRole === "Pegawai") {
        router.push('/dashboard/pegawai'); // Masuk ke Dashboard Pegawai
    } else {
      router.push('/dashboard/admin'); // Default
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      
      {/* Container Putih */}
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-100 p-8">
        
        {/* Header Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="bg-blue-600 p-3 rounded-xl mb-4 shadow-blue-200 shadow-lg">
            <Zap className="w-8 h-8 text-white" fill="currentColor" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Selamat Datang di PLN Dashboard Suite</h1>
          <p className="text-gray-500 text-sm">
            Halo <span className="font-bold text-gray-700">Demo</span>, silakan pilih role dan unit kerja Anda
          </p>
        </div>

        {/* Form Input */}
        <div className="space-y-5">
          
          {/* Email Read-Only */}
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-blue-600" />
             </div>
             <input type="text" value="Email: demo@pln.co.id" readOnly className="w-full pl-10 pr-4 py-3 bg-blue-50/50 border border-blue-100 text-blue-800 text-sm rounded-lg focus:outline-none cursor-default font-medium" />
          </div>

          {/* Dropdown Role */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-gray-500" /> Pilih Role/Jabatan
            </label>
            <div className="relative">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none font-medium"
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Pegawai">Pegawai</option>
              </select>
              {/* Panah Custom */}
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Info Box Super Admin */}
          {selectedRole === "Super Admin" && (
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-1.5 rounded-lg shrink-0 mt-0.5">
                   <Shield className="w-4 h-4 text-purple-700" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-purple-800 mb-1">Super Admin Access</h4>
                  <p className="text-xs text-purple-700 leading-relaxed">
                    Anda akan memiliki akses penuh ke semua bidang dan unit kerja.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Preview Profil */}
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 mt-2">
            <h4 className="text-xs font-bold text-green-800 mb-3 uppercase tracking-wider opacity-80">Preview Profil Anda:</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Role:</p>
                <p className="text-sm font-bold text-gray-800">{selectedRole}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Akses:</p>
                <p className="text-sm font-bold text-purple-600">
                  {selectedRole === "Super Admin" ? "Semua Bidang" : "Terbatas"}
                </p>
              </div>
            </div>
          </div>

          {/* Tombol Lanjut */}
          <button
            onClick={handleContinue}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-blue-200 active:scale-[0.98] flex items-center justify-center gap-2 group"
          >
            Lanjutkan ke Dashboard
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

        </div>
      </div>
    </div>
  );
}