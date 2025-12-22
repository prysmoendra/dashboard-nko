import { PegawaiDashboardPage } from '@/features/data-submissions/pages/PegawaiDashboardPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pegawai Dashboard - PLN',
  description: 'Dashboard for PLN employees',
};

export default function Page() {
  return <PegawaiDashboardPage />;
}
