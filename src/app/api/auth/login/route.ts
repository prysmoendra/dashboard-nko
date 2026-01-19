import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/features/auth/services/auth.service';
import { loginSchema } from '@/features/auth/schemas/login-schema';

/**
 * Get dashboard URL based on user role
 */
function getRedirectUrlForRole(role: string): string {
    const roleRedirectMap: Record<string, string> = {
        'pegawai': '/dashboard/pegawai',
        'asisten': '/dashboard/askbid', // Fixed: Redirect to askbid
        'askbid': '/dashboard/askbid',  // Added alias
        'assistant_manager': '/dashboard/askbid', // Added alias
        'kepala-bidang': '/dashboard/kabid',
        'kabid': '/dashboard/kabid', // Added alias
        'manager': '/dashboard/kabid', // Added alias
        'super-admin': '/dashboard/admin',
    };

    return roleRedirectMap[role] || '/dashboard';
}

/**
 * POST /api/auth/login
 * 
 * Thin API route that delegates authentication logic to AuthService.
 * This keeps the route handler clean and testable.
 */
export async function POST(request: NextRequest) {
    try {
        // Parse and validate request body
        const body = await request.json();

        // Validate input using Zod schema
        const validationResult = loginSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validationResult.error.issues },
                { status: 400 }
            );
        }

        // Delegate to service layer for business logic
        const { user, session } = await authService.login(validationResult.data);

        // Determine redirect URL based on role
        const redirectUrl = getRedirectUrlForRole(user.role);

        // Create response with user data and redirect URL
        const response = NextResponse.json({
            user,
            success: true,
            redirectUrl
        }, { status: 200 });

        // Set httpOnly session cookie for security
        // httpOnly prevents XSS attacks by making cookie inaccessible to JavaScript
        // Using maxAge instead of expires for better browser compatibility
        console.log('[Login] Setting session cookie for user:', user.email);
        response.cookies.set({
            name: 'session',
            value: session.token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
            path: '/',
        });

        return response;
    } catch (error) {
        // Handle authentication errors
        const errorMessage = error instanceof Error ? error.message : 'Authentication failed';

        return NextResponse.json(
            { error: errorMessage },
            { status: 401 }
        );
    }
}
