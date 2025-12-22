import { LoginPage } from '@/features/auth/pages/LoginPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Register - PLN Dashboard Suite',
    description: 'Create a new account for PLN Dashboard Suite',
};

export default function Page() {
    return <LoginPage />;
}
