import type { Metadata } from 'next';
import { RealizationReviewPage } from '@/features/approvals/pages/RealizationReviewPage';

export const metadata: Metadata = {
  title: 'Review & Approval Realisasi | NKO System',
  description: 'Halaman review dan approval realisasi kinerja',
};

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
      <RealizationReviewPage />
    </div>
  );
}