import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Welcome - PLN Dashboard Suite',
    description: 'Public information and getting started',
};

/**
 * Public landing page
 */
export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center max-w-2xl mx-auto px-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    PLN Dashboard Suite
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                    Akses terpusat untuk NKO 2025, Gudang, dan Jaringan
                </p>
                <a
                    href="/auth/login"
                    className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    Login
                </a>
            </div>
        </div>
    );
}
