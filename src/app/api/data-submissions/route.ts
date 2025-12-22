import { NextRequest, NextResponse } from 'next/server';
import { submissionsService } from '@/features/data-submissions/api/submissions.service';
import { createSubmissionSchema } from '@/features/data-submissions/schemas';

/**
 * GET /api/data-submissions - List all submissions
 */
export async function GET(request: NextRequest) {
    try {
        // TODO: Get user ID from session
        const userId = 'current-user-id'; // Replace with actual auth

        const submissions = await submissionsService.getSubmissions(userId);

        return NextResponse.json({ submissions }, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch submissions';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

/**
 * POST /api/data-submissions - Create new submission
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validationResult = createSubmissionSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validationResult.error.issues },
                { status: 400 }
            );
        }

        // TODO: Get user ID from session
        const userId = 'current-user-id';

        const submission = await submissionsService.createSubmission(
            userId,
            validationResult.data
        );

        return NextResponse.json({ submission }, { status: 201 });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create submission';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
