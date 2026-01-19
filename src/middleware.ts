import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

/**
 * Role-based route protection mapping
 * Maps each role to their allowed dashboard routes
 */
const ROLE_ROUTES: Record<string, string[]> = {
    'pegawai': ['/dashboard/pegawai'],
    'asisten': ['/dashboard/asisten'],
    'kepala-bidang': ['/dashboard/kabid'],
    'super-admin': ['/dashboard/admin'],
};

/**
 * Public routes that don't require authentication
 */
const PUBLIC_ROUTES = ['/auth/login', '/auth/register', '/'];

/**
 * Root middleware for Next.js application
 * Handles authentication, redirects, and role-based access control
 */
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public routes
    if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Get session cookie
    const sessionCookie = request.cookies.get('session');

    // No session = not authenticated
    if (!sessionCookie) {
        console.log('[Middleware] No session found, redirecting to login');
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
        // Skip JWT verification if no secret is configured (development mode)
        if (!process.env.SUPABASE_JWT_SECRET) {
            console.warn('[Middleware] SUPABASE_JWT_SECRET not configured, skipping JWT verification');
            return NextResponse.next();
        }

        // Verify JWT token
        const secret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET);
        const { payload } = await jwtVerify(sessionCookie.value, secret);

        // Extract user role from JWT
        // Supabase stores custom claims in user_metadata or app_metadata
        const userRole = (payload.user_metadata as any)?.role_name ||
            (payload.app_metadata as any)?.role ||
            (payload as any).role;

        if (!userRole) {
            console.error('[Middleware] No role found in session payload');
            // Allow access but log warning - role might be in database only
            return NextResponse.next();
        }

        // Check if user is accessing a dashboard route
        if (pathname.startsWith('/dashboard/')) {
            // Get allowed routes for user's role
            const allowedRoutes = ROLE_ROUTES[userRole as string] || [];

            // Check if current path is allowed
            const isAllowed = allowedRoutes.some(route => pathname.startsWith(route));

            if (!isAllowed && allowedRoutes.length > 0) {
                // User trying to access unauthorized dashboard
                // Redirect to their correct dashboard
                console.log(`[Middleware] User with role ${userRole} trying to access ${pathname}, redirecting to ${allowedRoutes[0]}`);
                const correctDashboard = allowedRoutes[0];
                return NextResponse.redirect(new URL(correctDashboard, request.url));
            }
        }

        // User is authenticated and authorized
        return NextResponse.next();
    } catch (error) {
        console.error('[Middleware] Auth error:', error);
        // Invalid token = redirect to login
        // Clear the invalid session cookie
        const response = NextResponse.redirect(new URL('/auth/login', request.url));
        response.cookies.delete('session');
        return response;
    }
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
