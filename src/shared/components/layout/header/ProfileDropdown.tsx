'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut } from 'lucide-react'; // Pakai ikon Settings (Gear)
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Data User Hardcode (Agar pasti muncul "Demo", bukan "Pengguna")
  const user = {
    name: "Demo",
    email: "demo@pln.co.id",
    initial: "D"
  };

  // Menutup dropdown saat klik di luar area
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    setTimeout(() => {
        router.push('/login'); 
    }, 1000);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Tombol Trigger (Avatar) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 focus:outline-none"
      >
        <div className="text-right hidden sm:block">
          <p className="text-sm text-gray-500">Selamat datang,</p>
          <p className="text-sm font-semibold text-gray-900">{user.name}</p>
        </div>
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold hover:bg-blue-700 transition-colors">
          {user.initial}
        </div>
      </button>

      {/* Menu Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 origin-top-right animate-in fade-in zoom-in-95 duration-100">

          {/* Header Info User */}
          <div className="px-4 py-3 border-b border-gray-100 mb-1">
            <p className="text-sm font-bold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
          </div>

          {/* List Menu */}
          <div className="px-2 space-y-1">
            
            {/* 1. Profil */}
            <Link
              href="/dashboard/admin/profile"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4 text-gray-500" />
              Profil
            </Link>

            {/* 2. Super Admin (GANTI TEXT DAN ICON DI SINI) */}
            <Link
              href="/dashboard/admin"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4 text-gray-500" /> {/* Ikon Gear */}
              Super Admin
            </Link>

            <div className="border-t border-gray-100 my-1 pt-1"></div>

            {/* 3. Keluar */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="w-4 h-4" />
              {isLoggingOut ? 'Logging out...' : 'Keluar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;