import type { Metadata } from 'next';
import { KabidDashboardPage } from '@/features/analytics/pages/KabidDashboardPage';

export const metadata: Metadata = {
    title: 'Dashboard Kabid - PLN',
    description: 'Dashboard for heads of division with AI-powered monitoring',
};

export default function Page() {
    return <KabidDashboardPage />;
}
