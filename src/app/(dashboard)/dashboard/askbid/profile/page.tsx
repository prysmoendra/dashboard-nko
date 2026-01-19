'use client';

import React from 'react';
import SharedProfilePage from '@/features/dashboard/components/SharedProfilePage';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';

export default function AskbidProfilePage() {
  const { user, isLoading } = useAuthSession();

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Memuat profil...</div>;
  }

  if (!user) {
    return <div className="p-8 text-center text-red-500">Gagal memuat profil user.</div>;
  }

  const userProfile = {
    id: user.id,
    name: user.full_name,
    email: user.email,
    role: 'Assistant Manager',
    unit: user.work_unit || 'Unit Tidak Diketahui',
    bidang: user.division || 'Divisi Tidak Diketahui',
    jabatanLengkap: 'Assistant Manager',
    joinDate: 'Januari 2024',
    accessLevel: 'Level 2 (Review & Approval)',
    totalDashboards: 3
  };

  return (
    <SharedProfilePage
      user={userProfile}
      roleLabel="Assistant Manager"
      backUrl="/dashboard/askbid"
    />
  );
}