'use client';

import { useState, useEffect } from 'react';
import type { Submission } from '../types';

/**
 * Hook to fetch submissions list
 */
export function useSubmissions() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSubmissions() {
            try {
                const response = await fetch('/api/data-submissions');
                if (!response.ok) {
                    throw new Error('Failed to fetch submissions');
                }
                const data = await response.json();
                setSubmissions(data.submissions || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        }

        fetchSubmissions();
    }, []);

    return { submissions, loading, error };
}
