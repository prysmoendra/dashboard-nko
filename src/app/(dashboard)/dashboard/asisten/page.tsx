import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Asisten Dashboard - PLN',
    description: 'Dashboard for assistant heads of division',
};

export default function AsistenDashboardPage() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Asisten Dashboard
                </h1>
                <p className="text-gray-500">
                    Approval and review workspace for assistant heads
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
