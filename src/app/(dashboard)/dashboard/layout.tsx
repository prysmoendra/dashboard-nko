import { Header } from '@/shared/components/layout/dashboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dashboard - PLN Dashboard Suite',
    description: 'Internal dashboard for PLN employees',
};

/**
 * Dashboard layout - Shared layout for all dashboard pages
 * Includes header and consistent structure for all dashboard routes
 */
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main>{children}</main>
        </div>
    );
}
