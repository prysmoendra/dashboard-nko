'use client';

import React from 'react';
import SharedProfilePage from '@/features/dashboard/components/SharedProfilePage';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';

export default function AdminProfilePage() {
  const { user, isLoading } = useAuthSession();

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Memuat profil...</div>;
  }

  if (!user) {
    return <div className="p-8 text-center text-red-500">Gagal memuat profil user.</div>;
  }

  // Transform auth user to profile format
  const userProfile = {
    id: user.id,
    name: user.full_name,
    email: user.email,
    role: 'Super Admin',
    unit: user.work_unit || 'Semua Unit',
    bidang: user.division || 'Semua Bidang',
    jabatanLengkap: 'Administrator Sistem',
    joinDate: 'November 2025',
    accessLevel: 'Full Access (Admin)',
    totalDashboards: 8
  };

  return (
    <SharedProfilePage
      user={userProfile}
      roleLabel="Super Admin"
      backUrl="/dashboard/admin"
    />
  );
}