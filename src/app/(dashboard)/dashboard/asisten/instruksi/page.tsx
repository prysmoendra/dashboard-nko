import type { Metadata } from 'next';
import { InstruksiListView } from '@/features/dashboard/components/instruksi-list-view';

export const metadata: Metadata = {
  title: 'Daftar Instruksi | NKO System',
  description: 'Daftar instruksi dari Kepala Bidang',
};

export default function InstruksiPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
      <InstruksiListView />
    </div>
  );
}