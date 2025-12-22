import { NextRequest, NextResponse } from 'next/server';
import { submissionsService } from '@/features/data-submissions/api/submissions.service';
import { updateSubmissionSchema } from '@/features/data-submissions/schemas';

/**
 * GET /api/data-submissions/[id] - Get submission detail
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const submission = await submissionsService.getSubmission(id);
        return NextResponse.json({ submission }, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Submission not found';
        return NextResponse.json({ error: message }, { status: 404 });
    }
}

/**
 * PATCH /api/data-submissions/[id] - Update submission
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Validate input
        const validationResult = updateSubmissionSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validationResult.error.issues },
                { status: 400 }
            );
        }

        const submission = await submissionsService.updateSubmission(
            id,
            validationResult.data
        );

        return NextResponse.json({ submission }, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update submission';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

/**
 * DELETE /api/data-submissions/[id] - Delete submission
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await submissionsService.deleteSubmission(id);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete submission';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

