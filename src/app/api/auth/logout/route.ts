import { NextResponse } from 'next/server';

/**
 * POST /api/auth/logout
 * 
 * Handles user logout by clearing the session cookie.
 * 
 * Note: Supabase session clearing (localStorage) is handled client-side
 * before calling this endpoint. This route only clears the server-side
 * session cookie.
 */
export async function POST() {
    try {
        // Create response
        const response = NextResponse.json(
            { message: 'Logout berhasil' },
            { status: 200 }
        );

        // Delete session cookie by setting it with an expired date
        response.cookies.set({
            name: 'session',
            value: '',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: new Date(0), // Set to epoch time (expired)
            path: '/',
        });

        return response;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Logout gagal';

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
