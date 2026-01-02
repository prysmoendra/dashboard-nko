'use client';

import React from 'react';
import { Bell, Search } from 'lucide-react';
// Import komponen ProfileDropdown yang sudah kita buat/update tadi
import ProfileDropdown from './ProfileDropdown';

export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
      
      {/* --- BAGIAN KIRI: JUDUL APLIKASI --- */}
      <div className="flex items-center gap-2">
         {/* Anda bisa menambahkan Logo PLN kecil di sini jika mau */}
         <h2 className="text-lg font-bold text-gray-800">PLN Dashboard Suite</h2>
      </div>

      {/* --- BAGIAN KANAN: TOOLS & PROFIL --- */}
      <div className="flex items-center gap-6">
        
        {/* 1. Search Bar */}
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari menu atau data..." 
            className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all w-64"
          />
        </div>

        {/* Garis Pembatas Kecil */}
        <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

        <div className="flex items-center gap-4">
            {/* 2. Tombol Notifikasi */}
            <button className="relative p-2.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors focus:outline-none">
              <Bell className="w-5 h-5" />
              {/* Dot Merah (Indikator ada notifikasi) */}
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* 3. KOMPONEN DROPDOWN PROFIL */}
            {/* Ini memanggil file ProfileDropdown.tsx yang barusan kita update */}
            <ProfileDropdown />
        </div>

      </div>
    </header>
  );
}