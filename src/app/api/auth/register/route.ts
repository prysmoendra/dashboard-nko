import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/features/auth/services/auth.service';
import { registerSchema } from '@/features/auth/schemas/register-schema';

/**
 * POST /api/auth/register
 * 
 * Thin API route that delegates registration logic to AuthService.
 * This keeps the route handler clean and testable.
 */
export async function POST(request: NextRequest) {
    try {
        // Parse and validate request body
        const body = await request.json();

        // Validate input using Zod schema
        const validationResult = registerSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validationResult.error.issues },
                { status: 400 }
            );
        }

        // Delegate to service layer for business logic
        const { user, session } = await authService.register(validationResult.data);

        // Create response with user data
        const response = NextResponse.json({ user }, { status: 201 });

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
        // Handle registration errors
        console.error('Registration API error:', error);

        let errorMessage = 'Registration failed';
        let statusCode = 400;

        if (error instanceof Error) {
            errorMessage = error.message;

            // Check if it's an environment variable error
            if (error.message.includes('Missing Supabase environment variables')) {
                errorMessage = 'Server configuration error. Please contact administrator.';
                statusCode = 500;
            }
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: statusCode }
        );
    }
}
