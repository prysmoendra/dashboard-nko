import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET /api/auth/me
 * Fetches the current authenticated user's profile data
 */
export async function GET(request: NextRequest) {
    try {
        console.log('🔍 [/api/auth/me] Checking session cookie...');

        // Get session token from cookie
        const sessionToken = request.cookies.get('session')?.value;

        if (!sessionToken) {
            console.log('❌ [/api/auth/me] No session cookie found');
            return NextResponse.json(
                { error: 'Not authenticated - no session cookie' },
                { status: 401 }
            );
        }

        console.log('✅ [/api/auth/me] Session cookie found, validating...');

        // Create Supabase client with the session token
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            console.error('❌ [/api/auth/me] Missing Supabase environment variables');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        // Get the authenticated user from Supabase using the token
        console.log('🔐 [/api/auth/me] Verifying token with Supabase...');
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(sessionToken);

        if (authError) {
            console.error('❌ [/api/auth/me] Auth error:', authError.message);
            return NextResponse.json(
                { error: 'Invalid or expired session', details: authError.message },
                { status: 401 }
            );
        }

        if (!authUser) {
            console.error('❌ [/api/auth/me] No user returned from Supabase');
            return NextResponse.json(
                { error: 'Invalid or expired session' },
                { status: 401 }
            );
        }

        console.log('✅ [/api/auth/me] User authenticated, ID:', authUser.id);

        // Fetch user profile from the users table with role information
        console.log('📊 [/api/auth/me] Fetching user profile from database...');
        const { data: profile, error: profileError } = await supabase
            .from('users')
            .select(`
                id, 
                email, 
                full_name, 
                work_unit, 
                division,
                roles!inner(name)
            `)
            .eq('id', authUser.id)
            .single();

        if (profileError) {
            console.error('❌ [/api/auth/me] Profile fetch error:', profileError);
            return NextResponse.json(
                { error: 'User profile not found', details: profileError.message },
                { status: 404 }
            );
        }

        if (!profile) {
            console.error('❌ [/api/auth/me] No profile data returned');
            return NextResponse.json(
                { error: 'User profile not found' },
                { status: 404 }
            );
        }

        console.log('✅ [/api/auth/me] Profile fetched successfully for:', profile.email);

        // Extract role name from the joined roles table
        const roleName = (profile.roles as any)?.name || 'unknown';
        console.log('🎭 [/api/auth/me] User role:', roleName);

        // Return user data with role_name from the roles table
        return NextResponse.json({
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name,
            role: roleName, // role_name from roles table (e.g., "super-admin")
            work_unit: profile.work_unit,
            division: profile.division,
        });
    } catch (error) {
        console.error('❌ [/api/auth/me] Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
