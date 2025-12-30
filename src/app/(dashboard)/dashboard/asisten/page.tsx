import type { Metadata } from 'next';
import { AsistenDashboardView } from '@/features/dashboard/components/asisten-view';

export const metadata: Metadata = {
  title: 'Dashboard Central | NKO System',
  description: 'Pusat monitoring dan approval untuk Asisten Kepala Bidang',
};

export default function AsistenDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
      <AsistenDashboardView />
    </div>
  );
}
