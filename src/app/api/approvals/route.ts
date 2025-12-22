import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/approvals - List pending approvals
 */
export async function GET(request: NextRequest) {
    return NextResponse.json(
        { message: 'Approvals API - to be implemented', approvals: [] },
        { status: 501 }
    );
}

/**
 * POST /api/approvals - Bulk approval action
 */
export async function POST(request: NextRequest) {
    return NextResponse.json(
        { message: 'Bulk approval endpoint - to be implemented' },
        { status: 501 }
    );
}
