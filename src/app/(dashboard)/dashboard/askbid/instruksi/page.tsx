import type { Metadata } from 'next';
import { InstruksiInboxPage } from '@/features/approvals/pages/InstruksiInboxPage';

export const metadata: Metadata = {
    title: 'Instruksi dari Kepala Bidang | NKO System',
    description: 'Kelola dan tindak lanjuti instruksi dari Kepala Bidang',
};

export default function InstruksiPage() {
    return <InstruksiInboxPage />;
}
