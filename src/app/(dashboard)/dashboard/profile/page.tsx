import React from 'react';
// Mengambil tampilan yang kita buat di langkah 2
import UserProfile from '@/features/profile/components/UserProfile';
// Mengambil tipe data dari langkah 1
import { UserProfileData } from '@/features/profile/types';

// Ini fungsi pura-pura mengambil data (nanti diganti koneksi database)
async function getUserProfile(): Promise<UserProfileData> {
  return {
    fullName: "Demo",
    email: "demo@pln.co.id",
    avatarInitial: "D",
    role: "Pegawai",
    unit: "UP3 Cimahi",
    department: "Bidang Distribusi",
    accountCreatedAt: "19 November 2025",
    accessLevel: "Standard User",
    totalDashboards: 8,
  };
}

// Ini adalah Halaman utamanya
export default async function ProfilePage() {
  // Ambil data
  const userData = await getUserProfile();

  // Tampilkan komponen dengan data tersebut
  return (
    <UserProfile data={userData} />
  );
}