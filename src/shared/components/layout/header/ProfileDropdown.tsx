'use client';

import React, { useState, useRef, useEffect } from 'react';
// Menambahkan ikon Settings (Gear)
import { User, Settings, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Tambahkan Link Next.js
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch session
  const { user, isLoading } = useAuthSession();

  // Menutup dropdown saat klik di luar area (TIDAK DIRUBAH)
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

  const confirmLogout = async () => {
    setIsLoggingOut(true);

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Logout gagal');
      }

      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Gagal logout. Silakan coba lagi.');
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  // Determine Profile Path based on Role
  const getProfilePath = (role?: string) => {
    if (!role) return '/dashboard/profile'; // Fallback

    const lowerRole = role.toLowerCase();

    // 1. Handle KABID (Catch all variations)
    // If the DB returns 'kepala_bidang', 'kepala-bidang', 'manager', or 'kabid' -> FORCE 'kabid' path
    if (
      lowerRole === 'kabid' ||
      lowerRole === 'manager' ||
      lowerRole.includes('kepala') || // Catch 'kepala_bidang'
      lowerRole === 'kepala-bidang'
    ) {
      return '/dashboard/kabid/profile';
    }

    // 2. Handle ASKBID
    if (
      lowerRole === 'askbid' ||
      lowerRole === 'assistant_manager' ||
      lowerRole === 'asisten'
    ) {
      return '/dashboard/askbid/profile';
    }

    // 3. Handle PEGAWAI
    if (lowerRole === 'pegawai') {
      return '/dashboard/pegawai/profile';
    }

    // Default Fallback (Only for unknown roles)
    return `/dashboard/${lowerRole}/profile`;
  };

  const profilePath = getProfilePath(user?.role);
  const displayName = user?.full_name || 'Pengguna';
  const displayEmail = user?.email || '-';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Tombol Trigger (Avatar) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 focus:outline-none"
      >
        <div className="text-right hidden sm:block">
          <p className="text-sm text-gray-500">Selamat datang,</p>
          {isLoading ? (
            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mt-1"></div>
          ) : (
            <p className="text-sm font-semibold text-gray-900">{displayName}</p>
          )}
        </div>
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold hover:bg-blue-700 transition-colors">
          {isLoading ? '...' : initial}
        </div>
      </button>

      {/* Menu Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 origin-top-right animate-in fade-in zoom-in-95 duration-100">

          {/* Header Info User */}
          <div className="px-4 py-3 border-b border-gray-100 mb-1">
            <p className="text-sm font-bold text-gray-900">{displayName}</p>
            <p className="text-xs text-gray-500 mt-0.5">{displayEmail}</p>
          </div>

          {/* List Menu */}
          <div className="px-2 space-y-1">

            {/* 1. Menu Profil */}
            <Link
              href={profilePath}
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4 text-gray-500" />
              Profil
            </Link>

            {/* 2. Menu Super Admin (DITAMBAHKAN/DIUBAH DARI DATA & LAPORAN) */}
            <Link
              href="/dashboard/admin"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4 text-gray-500" />
              Super Admin
            </Link>

            <div className="border-t border-gray-100 my-1 pt-1"></div>

            {/* 3. Tombol Logout */}
            <button
              onClick={() => {
                setIsOpen(false);
                setShowLogoutModal(true);
              }}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 scale-100 animate-in zoom-in-95 duration-200">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <LogOut className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Konfirmasi Keluar</h3>
              <p className="text-sm text-gray-500 mt-2">
                Apakah Anda yakin ingin keluar dari aplikasi? Anda harus login kembali untuk mengakses dashboard.
              </p>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmLogout}
                disabled={isLoggingOut}
                className="flex-1 px-4 py-2 bg-red-600 rounded-lg text-white font-medium hover:bg-red-700 transition-colors flex justify-center items-center gap-2"
              >
                {isLoggingOut ? 'Keluar...' : 'Ya, Keluar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;