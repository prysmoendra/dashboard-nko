'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User, FileText, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AUTH_ROUTES } from '@/shared/routes';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch current user session
  const { user, isLoading } = useAuthSession();

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
    try {
      setIsLoggingOut(true);

      // Call logout API
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Redirect to login page
        router.push(AUTH_ROUTES.LOGIN);
      } else {
        console.error('Logout failed');
        // Still redirect to login even if API fails
        router.push(AUTH_ROUTES.LOGIN);
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Redirect to login page even on error
      router.push(AUTH_ROUTES.LOGIN);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Get user display name with fallback
  const displayName = user?.full_name || 'Pengguna';

  // Get first letter for avatar initial
  const avatarInitial = user?.full_name?.charAt(0).toUpperCase() || 'U';

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
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <p className="text-sm font-semibold text-gray-900">{displayName}</p>
          )}
        </div>
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold hover:bg-blue-700 transition-colors">
          {isLoading ? (
            <div className="w-6 h-6 bg-blue-400 rounded-full animate-pulse"></div>
          ) : (
            avatarInitial
          )}
        </div>
      </button>

      {/* Menu Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 origin-top-right animate-in fade-in zoom-in-95 duration-100">

          {/* Header Info User */}
          <div className="px-4 py-3 border-b border-gray-100 mb-1">
            {isLoading ? (
              <>
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
              </>
            ) : (
              <>
                <p className="text-sm font-bold text-gray-900">{displayName}</p>
                <p className="text-xs text-gray-500 mt-0.5">{user?.email || 'Email tidak tersedia'}</p>
              </>
            )}
          </div>

          {/* List Menu */}
          <div className="px-2 space-y-1">
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <User className="w-4 h-4 text-gray-500" />
              Profil
            </a>

            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <FileText className="w-4 h-4 text-gray-500" />
              Data & Laporan
            </a>

            <div className="border-t border-gray-100 my-1 pt-1"></div>

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