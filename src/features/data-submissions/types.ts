/**
 * Data Submissions - Type definitions
 */

export type SubmissionStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

export type SubmissionType =
    | 'gudang'           // Warehouse inventory
    | 'gangguan'         // Fault report
    | 'maintenance'      // Maintenance update
    | 'log-aktivitas';   // Activity log

export interface Submission {
    id: string;
    type: SubmissionType;
    title: string;
    description: string;
    status: SubmissionStatus;
    submittedBy: string;
    submittedAt: Date;
    updatedAt: Date;
    data: Record<string, unknown>; // Type-specific data
}

export interface CreateSubmissionPayload {
    type: SubmissionType;
    title: string;
    description: string;
    data: Record<string, unknown>;
}

export interface UpdateSubmissionPayload {
    title?: string;
    description?: string;
    status?: SubmissionStatus;
    data?: Record<string, unknown>;
}
