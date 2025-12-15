import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/features/auth/services/auth.service';
import { loginSchema } from '@/features/auth/schemas/login-schema';

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

        // Create response with user data
        const response = NextResponse.json({ user }, { status: 200 });

        // Set httpOnly session cookie for security
        // httpOnly prevents XSS attacks by making cookie inaccessible to JavaScript
        response.cookies.set({
            name: 'session',
            value: session.token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: session.expiresAt,
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
