import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/users - List users
 */
export async function GET(request: NextRequest) {
    return NextResponse.json(
        { message: 'Users API - to be implemented', users: [] },
        { status: 501 }
    );
}

/**
 * POST /api/users - Create user
 */
export async function POST(request: NextRequest) {
    return NextResponse.json(
        { message: 'Create user endpoint - to be implemented' },
        { status: 501 }
    );
}
