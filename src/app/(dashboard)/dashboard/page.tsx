import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dashboard - PLN',
    description: 'Main dashboard for PLN employees',
};

/**
 * Dashboard root page
 * Redirects based on user role
 */
export default function DashboardPage() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="text-center py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    PLN Dashboard
                </h1>
                <p className="text-gray-600">
                    Select your role to continue
                </p>
            </div>
        </div>
    );
}
