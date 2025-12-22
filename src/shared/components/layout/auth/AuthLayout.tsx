/**
 * AuthLayout - Shared layout component for auth pages
 * Provides consistent styling and structure for login, register, etc.
 */
export function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            {children}
        </div>
    );
}
