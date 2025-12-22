import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/analytics - Get analytics data
 */
export async function GET(request: NextRequest) {
    return NextResponse.json(
        {
            message: 'Analytics API - to be implemented',
            data: {
                totalSubmissions: 0,
                pendingApprovals: 0,
                approvedToday: 0,
            }
        },
        { status: 501 }
    );
}
