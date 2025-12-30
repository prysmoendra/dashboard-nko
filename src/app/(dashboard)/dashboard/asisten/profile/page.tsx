import type { Metadata } from 'next';
import { UserProfileView } from '@/features/dashboard/components/user-profile-view';

export const metadata: Metadata = {
  title: 'Profil Pengguna | NKO System',
  description: 'Informasi detail akun pengguna',
};

export default function ProfilePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
      <UserProfileView />
    </div>
  );
}