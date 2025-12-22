import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Kepala Bidang Dashboard - PLN',
    description: 'Dashboard for heads of division',
};

export default function KepalaBidangDashboardPage() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Kepala Bidang Dashboard
                </h1>
                <p className="text-gray-500">
                    Analytics and decision support for heads of division
                </p>
            </div>

            <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-gray-600">
                    This dashboard is under development.
                </p>
            </div>
        </div>
    );
}
