'use client';

import React from 'react';
import SharedProfilePage from '@/features/dashboard/components/SharedProfilePage';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';

export default function KabidProfilePage() {
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
        role: 'Kepala Bidang',
        unit: user.work_unit || 'Unit Tidak Diketahui',
        bidang: user.division || 'Divisi Tidak Diketahui',
        jabatanLengkap: 'Manager / Kepala Bidang',
        joinDate: 'Januari 2024',
        accessLevel: 'Level 3 (Target Setting & Full Access)',
        totalDashboards: 5
    };

    return (
        <SharedProfilePage
            user={userProfile}
            roleLabel="Kepala Bidang / Manager"
            backUrl="/dashboard/kabid"
        />
    );
}
