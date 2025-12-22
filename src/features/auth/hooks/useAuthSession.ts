'use client';

import { useState, useEffect } from 'react';

/**
 * User data returned from the /api/auth/me endpoint
 */
export interface AuthUser {
    id: string;
    email: string;
    full_name: string;
    role: string;
    work_unit?: string;
    division?: string;
}

/**
 * Return type for the useAuthSession hook
 */
interface UseAuthSessionReturn {
    user: AuthUser | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage the current authenticated user's session
 * 
 * @returns {UseAuthSessionReturn} Object containing user data, loading state, and error state
 * 
 * @example
 * const { user, isLoading, error } = useAuthSession();
 * 
 * if (isLoading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error}</div>;
 * if (!user) return <div>Not authenticated</div>;
 * 
 * return <div>Welcome, {user.full_name}!</div>;
 */
export function useAuthSession(): UseAuthSessionReturn {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/auth/me', {
                method: 'GET',
                credentials: 'include', // Include cookies
            });

            if (!response.ok) {
                if (response.status === 401) {
                    // Not authenticated - this is expected for logged-out users
                    setUser(null);
                    return;
                }

                throw new Error('Failed to fetch user data');
            }

            const userData = await response.json();
            setUser(userData);
        } catch (err) {
            console.error('Error fetching user session:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return {
        user,
        isLoading,
        error,
        refetch: fetchUser,
    };
}
