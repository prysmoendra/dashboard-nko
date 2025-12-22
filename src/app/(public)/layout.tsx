import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'PLN Dashboard Suite',
    description: 'Landing page for PLN Dashboard Suite',
};

/**
 * Public layout for marketing/landing pages
 */
export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
