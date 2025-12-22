import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Authentication - PLN Dashboard Suite',
    description: 'Secure authentication for PLN employees',
};

/**
 * Auth layout - Wrapper for all auth routes
 * Provides consistent metadata and structure
 */
export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
