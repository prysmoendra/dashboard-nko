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

        // 2. Initialize Supabase Client to verify Session (Anon is fine for verification)
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
        const { password } = body;

        if (!password || password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // 6. Update Password as Admin
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            user.id,
            { password: password }
        );

        if (updateError) {
            console.error('Supabase Admin Password Update Error:', updateError);
            return NextResponse.json(
                { error: updateError.message },
                { status: 400 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Update Password Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
