import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/ml-recommendations - List ML recommendations
 */
export async function GET(request: NextRequest) {
    return NextResponse.json(
        { message: 'ML Recommendations API - to be implemented', recommendations: [] },
        { status: 501 }
    );
}
