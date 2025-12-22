import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/debug/cookies
 * Debug endpoint to check all incoming cookies
 */
export async function GET(request: NextRequest) {
    const cookies = request.cookies.getAll();

    console.log('🍪 [/api/debug/cookies] All incoming cookies:', cookies);

    return NextResponse.json({
        message: 'Cookie debug endpoint',
        cookies: cookies.map(cookie => ({
            name: cookie.name,
            value: cookie.value.substring(0, 20) + '...', // Truncate for security
            exists: true,
        })),
        count: cookies.length,
        hasSessionCookie: !!request.cookies.get('session'),
    });
}
