import { supabase } from '@/shared/lib/supabase';
import type {
    PendingApprovalTarget,
    ApprovalActionPayload,
    RealizationReviewStats,
    ReviewFilter
} from '../types/approval.types';

/**
 * ApprovalService - Business logic for Askbid review and approval workflow
 * REFACTORED: Uses weekly_realizations for approval queue
 */
export class ApprovalService {
    /**
     * Get pending approvals filtered by status
     */
    async getPendingApprovals(
        filter: ReviewFilter = 'pending_review',
        unitId?: string
    ): Promise<PendingApprovalTarget[]> {
        // We select from weekly_realizations and JOIN monthly_targets
        let query = supabase
            .from('weekly_realizations')
            .select(`
                id,
                week,
                realization_value,
                status,
                submitted_at,
                monthly_targets!inner (
                    id,
                    indicator_name,
                    division_name,
                    target_value,
                    weight,
                    month,
                    year,
                    unit_id,
                    work_units!inner (
                        id,
                        name
                    )
                )
            `);

        // Apply status filter
        if (filter !== 'all') {
            query = query.eq('status', filter);
        }

        // Apply unit filter if provided
        if (unitId) {
            query = query.eq('monthly_targets.unit_id', unitId);
        }

        // Order by submission time (newest first)
        query = query.order('submitted_at', { ascending: false, nullsFirst: false });

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching pending approvals:', JSON.stringify(error, null, 2));
            throw new Error('Failed to fetch pending approvals');
        }

        return (data || []).map(record => ({
            id: record.id, // Weekly Realization ID
            target_id: record.monthly_targets.id,
            indicator_name: record.monthly_targets.indicator_name,
            division_name: record.monthly_targets.division_name,
            target_value: record.monthly_targets.target_value,
            weight: record.monthly_targets.weight,
            realization_value: record.realization_value,
            approval_status: record.status as any,
            submitted_at: record.submitted_at,
            unit_name: record.monthly_targets.work_units?.name || 'Unknown Unit',
            month: record.monthly_targets.month,
            year: record.monthly_targets.year,
            week: record.week // Important: Includes week
        }));
    }

    /**
     * Approve a realization (update status and insert into nko_achievements)
     */
    async approveRealization(weeklyRealizationId: string): Promise<void> {
        // Step 1: Get the complete record (weekly joined with monthly)
        const { data: record, error: fetchError } = await supabase
            .from('weekly_realizations')
            .select(`
                id, week, realization_value,
                monthly_targets (
                    id, unit_id, division_name, indicator_name, unit_measurement, target_value, weight, month, year
                )
            `)
            .eq('id', weeklyRealizationId)
            .single();

        if (fetchError || !record || !record.monthly_targets) {
            console.error('Error fetching target for approval:', JSON.stringify(fetchError, null, 2));
            throw new Error('Failed to find target for approval');
        }

        const target = record.monthly_targets; // Typecast or accessor
        const monthlyTarget = Array.isArray(target) ? target[0] : target; // Handle potential array return depending on type gen

        // Step 2: Update approval status to 'approved' in weekly_realizations
        const { error: updateError } = await supabase
            .from('weekly_realizations')
            .update({
                status: 'approved'
            })
            .eq('id', weeklyRealizationId);

        if (updateError) {
            console.error('Error updating approval status:', JSON.stringify(updateError, null, 2));
            throw new Error('Failed to approve realization');
        }

        // Step 3: Insert into nko_achievements
        const achievementPayload = {
            unit_id: monthlyTarget.unit_id,
            division_name: monthlyTarget.division_name,
            indicator_name: monthlyTarget.indicator_name,
            unit_measurement: monthlyTarget.unit_measurement,
            month: monthlyTarget.month,
            year: monthlyTarget.year,
            target: monthlyTarget.target_value,
            weight: monthlyTarget.weight,
            realization: record.realization_value,
            week: record.week
        };

        const { error: insertError } = await supabase
            .from('nko_achievements')
            .insert(achievementPayload);

        if (insertError) {
            console.error('Error inserting into nko_achievements:', JSON.stringify(insertError, null, 2));
            // Rollback: Set status back to pending_review
            await supabase
                .from('weekly_realizations')
                .update({ status: 'pending_review' })
                .eq('id', weeklyRealizationId);
            throw new Error('Failed to insert approved data into nko_achievements');
        }

        console.log(`Successfully approved realization for ${weeklyRealizationId}`);
    }

    /**
     * Reject a realization with reason
     */
    async rejectRealization(weeklyRealizationId: string, rejectionReason: string): Promise<void> {
        const { error } = await supabase
            .from('weekly_realizations')
            .update({
                status: 'rejected',
                rejection_reason: rejectionReason
            })
            .eq('id', weeklyRealizationId);

        if (error) {
            console.error('Error rejecting realization:', JSON.stringify(error, null, 2));
            throw new Error('Failed to reject realization');
        }

        console.log(`Successfully rejected realization ${weeklyRealizationId}`);
    }

    /**
     * Bulk approve multiple realizations
     */
    async bulkApproveRealizations(ids: string[]): Promise<{
        succeeded: number;
        failed: number;
        errors: string[];
    }> {
        const results = await Promise.allSettled(
            ids.map(id => this.approveRealization(id))
        );

        const succeeded = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;
        const errors = results
            .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
            .map(r => r.reason?.message || 'Unknown error');

        return { succeeded, failed, errors };
    }

    /**
     * Bulk reject multiple realizations with a single reason
     */
    async bulkRejectRealizations(
        ids: string[],
        rejectionReason: string
    ): Promise<{
        succeeded: number;
        failed: number;
    }> {
        const { error, count } = await supabase
            .from('weekly_realizations')
            .update({
                status: 'rejected',
                rejection_reason: rejectionReason
            })
            .in('id', ids);

        if (error) {
            console.error('Error during bulk rejection:', JSON.stringify(error, null, 2));
            throw new Error('Failed to reject realizations');
        }

        return {
            succeeded: count || 0,
            failed: ids.length - (count || 0)
        };
    }

    /**
     * Get approval statistics for dashboard
     * UPDATED to query weekly_realizations
     */
    async getApprovalStats(unitId?: string): Promise<RealizationReviewStats> {
        // This query requires joining monthly_targets if we need to filter by unitId
        // If unitId is NOT required, simple count on table.
        // If unitId IS required, we need a join.

        // Simpler approach: Supabase count with filter.
        let query = supabase.from('weekly_realizations').select('status, monthly_targets!inner(unit_id)', { count: 'exact', head: true });

        if (unitId) {
            query = query.eq('monthly_targets.unit_id', unitId);
        }

        const [totalResult, pendingResult, approvedResult, rejectedResult] = await Promise.all([
            query, // Total (actually we might want all statuses)
            supabase.from('weekly_realizations').select('status, monthly_targets!inner(unit_id)', { count: 'exact', head: true }).eq('status', 'pending_review').eq('monthly_targets.unit_id', unitId || ''),
            supabase.from('weekly_realizations').select('status, monthly_targets!inner(unit_id)', { count: 'exact', head: true }).eq('status', 'approved').eq('monthly_targets.unit_id', unitId || ''),
            supabase.from('weekly_realizations').select('status, monthly_targets!inner(unit_id)', { count: 'exact', head: true }).eq('status', 'rejected').eq('monthly_targets.unit_id', unitId || '')
        ]);

        // Note: The above queries are slightly simplified and might need adjustment if unitId is undefined (empty string filter might fail).
        // Let's make it robust.

        const getCount = async (status?: string) => {
            let q = supabase.from('weekly_realizations').select('id, monthly_targets!inner(unit_id)', { count: 'exact', head: true });
            if (status) q = q.eq('status', status);
            if (unitId) q = q.eq('monthly_targets.unit_id', unitId);
            const { count } = await q;
            return count || 0;
        };

        const total = await getCount();
        const pending = await getCount('pending_review');
        const approved = await getCount('approved');
        const rejected = await getCount('rejected');

        return { total, pending, approved, rejected };
    }
}

// Export singleton
export const approvalService = new ApprovalService();
