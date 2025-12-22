'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
    const router = useRouter();

    useEffect(() => {
        // Clear session and redirect
        document.cookie = 'session=; Max-Age=0; path=/;';
        router.push('/auth/login');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <p className="text-gray-600">Logging out...</p>
            </div>
        </div>
    );
}
