import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase Client Configuration
 * 
 * This module provides type-safe Supabase client instances for both
 * server-side and client-side usage.
 */

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Create a Supabase client for browser usage
 * This client can be used in Client Components and API routes
 */
export const createBrowserClient = () => {
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error(
            'Missing Supabase environment variables. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env.local file.'
        );
    }

    return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
        },
    });
};

/**
 * Singleton browser client instance
 * Use this for client-side operations
 * 
 * NOTE: This will throw an error if environment variables are not configured.
 * Make sure to set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 * in your .env.local file before using this client.
 */
export const supabase = createBrowserClient();
