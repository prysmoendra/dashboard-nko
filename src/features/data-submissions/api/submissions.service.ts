import { supabase } from '@/shared/lib/supabase';
import type {
    Submission,
    CreateSubmissionPayload,
    UpdateSubmissionPayload
} from '../types';

/**
 * SubmissionsService - Business logic for data submissions
 */
export class SubmissionsService {
    /**
     * Fetch all submissions for current user
     */
    async getSubmissions(userId: string): Promise<Submission[]> {
        const { data, error } = await supabase
            .from('submissions')
            .select('*')
            .eq('submitted_by', userId)
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error('Failed to fetch submissions');
        }

        return (data || []).map(this.mapToSubmission);
    }

    /**
     * Get single submission by ID
     */
    async getSubmission(id: string): Promise<Submission> {
        const { data, error } = await supabase
            .from('submissions')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            throw new Error('Submission not found');
        }

        return this.mapToSubmission(data);
    }

    /**
     * Create new submission
     */
    async createSubmission(
        userId: string,
        payload: CreateSubmissionPayload
    ): Promise<Submission> {
        const { data, error } = await supabase
            .from('submissions')
            .insert({
                type: payload.type,
                title: payload.title,
                description: payload.description,
                data: payload.data,
                status: 'draft',
                submitted_by: userId,
            })
            .select()
            .single();

        if (error) {
            throw new Error('Failed to create submission');
        }

        return this.mapToSubmission(data);
    }

    /**
     * Update existing submission
     */
    async updateSubmission(
        id: string,
        payload: UpdateSubmissionPayload
    ): Promise<Submission> {
        const { data, error } = await supabase
            .from('submissions')
            .update(payload)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new Error('Failed to update submission');
        }

        return this.mapToSubmission(data);
    }

    /**
     * Delete submission
     */
    async deleteSubmission(id: string): Promise<void> {
        const { error } = await supabase
            .from('submissions')
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error('Failed to delete submission');
        }
    }

    /**
     * Map database record to Submission type
     */
    private mapToSubmission(record: any): Submission {
        return {
            id: record.id,
            type: record.type,
            title: record.title,
            description: record.description,
            status: record.status,
            submittedBy: record.submitted_by,
            submittedAt: new Date(record.created_at),
            updatedAt: new Date(record.updated_at),
            data: record.data || {},
        };
    }
}

// Export singleton
export const submissionsService = new SubmissionsService();
