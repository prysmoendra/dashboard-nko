// Lokasi: src/app/(dashboard)/dashboard/asisten/review/page.tsx

import type { Metadata } from 'next';
// PASTIKAN YANG DI-IMPORT ADALAH 'ReviewApprovalView', BUKAN 'UserProfileView'
import { ReviewApprovalView } from '@/features/dashboard/components/review-approval-view';

export const metadata: Metadata = {
  title: 'Review & Approval | NKO System',
  description: 'Halaman review dan approval laporan',
};

export default function ReviewPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
      {/* Panggil komponen Review, bukan Profil */}
      <ReviewApprovalView />
    </div>
  );
}