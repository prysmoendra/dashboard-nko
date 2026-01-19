import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
    try {
        // 1. Get session token from cookie
        const sessionToken = request.cookies.get('session')?.value;

        if (!sessionToken) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        // 2. Initialize Supabase Client to verify Session
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabaseVerifier = createClient(supabaseUrl, supabaseAnonKey);

        // 3. Verify User and get ID
        const { data: { user }, error: authError } = await supabaseVerifier.auth.getUser(sessionToken);

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Invalid session' },
                { status: 401 }
            );
        }

        // 4. Initialize Supabase Admin Client
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!serviceRoleKey) {
            console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

        // 5. Parse Body
        const body = await request.json();
        const { full_name } = body;

        if (!full_name) {
            return NextResponse.json(
                { error: 'Full name is required' },
                { status: 400 }
            );
        }

        // 6. Update user (DB and Auth) using Admin Client to bypass RLS/Session issues

        // Update public.users
        const { error: dbError } = await supabaseAdmin
            .from('users')
            .update({ full_name })
            .eq('id', user.id);

        if (dbError) {
            console.error('DB Update Error:', dbError);
            throw new Error('Failed to update profile in database');
        }

        // Update Supabase Auth metadata
        const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
            user.id,
            { user_metadata: { full_name } }
        );

        if (authUpdateError) {
            console.warn('Auth Metadata Update Warning:', authUpdateError);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Update Profile Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
