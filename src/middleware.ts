import { NextRequest, NextResponse } from 'next/server';

/**
 * Root middleware for Next.js application
 * Handles authentication, redirects, and request processing
 */
export function middleware(request: NextRequest) {
    // TODO: Implement middleware logic
    // - Check authentication
    // - Redirect unauthenticated users
    // - Role-based access control

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api routes
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
