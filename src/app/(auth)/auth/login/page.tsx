import { LoginPage } from '@/features/auth/pages/LoginPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login - PLN Dashboard Suite',
    description: 'Akses terpusat untuk NKO 2025, Gudang, dan Jaringan. Khusus pegawai PLN.',
};

/**
 * Login page route - Thin wrapper server component
 */
export default function Page() {
    return <LoginPage />;
}
