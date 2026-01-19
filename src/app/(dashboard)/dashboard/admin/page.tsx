import type { Metadata } from 'next';
import { SuperAdminDashboardPage } from '@/features/users/pages/SuperAdminDashboardPage';

export const metadata: Metadata = {
  title: 'Super Admin Dashboard - PLN',
  description: 'User management dashboard for Super Admin',
};

export default function Page() {
  return <SuperAdminDashboardPage />;
}