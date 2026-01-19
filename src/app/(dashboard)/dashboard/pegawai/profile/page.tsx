'use client';

import React from 'react';
import SharedProfilePage from '@/features/dashboard/components/SharedProfilePage';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';

export default function PegawaiProfilePage() {
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
    role: 'Pegawai',
    unit: user.work_unit || 'Unit Tidak Diketahui',
    bidang: user.division || 'Divisi Tidak Diketahui',
    jabatanLengkap: 'Staf Pelaksana',
    joinDate: 'Januari 2024',
    accessLevel: 'Level 1 (Input & View)',
    totalDashboards: 1
  };

  return (
    <SharedProfilePage
      user={userProfile}
      roleLabel="Pegawai / Staf"
      backUrl="/dashboard/pegawai"
    />
  );
}