import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/approvals/[id] - Get approval detail
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    return NextResponse.json(
        { message: 'Approval detail endpoint - to be implemented', id },
        { status: 501 }
    );
}

/**
 * PATCH /api/approvals/[id] - Approve or reject
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    return NextResponse.json(
        { message: 'Approve/reject endpoint - to be implemented', id },
        { status: 501 }
    );
}
