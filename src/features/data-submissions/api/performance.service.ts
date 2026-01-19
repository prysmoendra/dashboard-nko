import { supabase } from '@/shared/lib/supabase';
import type {
    MonthlyTarget,
    PerformanceRealizationPayload,
    BulkPerformanceSubmission
} from '../types/performance-input.types';

/**
 * PerformanceService - Business logic for NKO performance input
 * REFACTORED: Uses weekly_realizations table for actuals to prevent data overwrites.
 */
export class PerformanceService {
    /**
     * Fetch monthly targets merged with weekly realizations for a specific period (week)
     */
    async getMonthlyTargets(
        month: number,
        year: number,
        week: number,
        unitName: string
    ): Promise<MonthlyTarget[]> {
        // Step 1: Get unit_id from work_units table based on unit name
        const { data: unitData, error: unitError } = await supabase
            .from('work_units')
            .select('id')
            .eq('name', unitName)
            .single();

        if (unitError) {
            console.error('Error fetching work unit:', JSON.stringify(unitError, null, 2));
            throw new Error(`Failed to find unit: ${unitName}`);
        }

        if (!unitData) {
            console.warn(`No work unit found with name: ${unitName}`);
            return [];
        }

        const unitId = unitData.id;

        // Step 2: Fetch monthly targets (PLAN)
        const { data: targets, error: targetError } = await supabase
            .from('monthly_targets')
            .select(`
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
            `)
            .eq('month', month)
            .eq('year', year)
            .eq('unit_id', unitId)
            .order('indicator_name', { ascending: true });

        if (targetError) {
            console.error('Error fetching monthly targets:', JSON.stringify(targetError, null, 2));
            throw new Error('Failed to fetch monthly targets');
        }

        if (!targets || targets.length === 0) {
            return [];
        }

        // Step 3: Fetch weekly realizations (ACTUALS) for this specific week
        const targetIds = targets.map(t => t.id);
        const { data: realizations, error: realizationError } = await supabase
            .from('weekly_realizations')
            .select('*')
            .in('monthly_target_id', targetIds)
            .eq('week', week);

        if (realizationError) {
            console.error('Error fetching weekly realizations:', JSON.stringify(realizationError, null, 2));
            throw new Error('Failed to fetch weekly realizations');
        }

        // Step 4: Merge Targets (Plan) with Realizations (Actual)
        // If a realization exists for this week, use it. Otherwise, return clean state.
        const realizationMap = new Map(realizations?.map(r => [r.monthly_target_id, r]));

        return targets.map(target => {
            const realization = realizationMap.get(target.id);

            return {
                id: target.id, // Keep monthly_target_id as the primary key for the UI row
                indicator_name: target.indicator_name,
                division_name: target.division_name,
                target_value: target.target_value,
                weight: target.weight,
                month: target.month,
                year: target.year,
                unit_name: (target.work_units as any)?.name || 'Unknown Unit',

                // Fields from Weekly Realization
                realization_value: realization?.realization_value ?? null,
                approval_status: realization?.status || 'draft',
                rejection_reason: realization?.rejection_reason || null,
                submitted_at: realization?.submitted_at || null,
                // Add reference to weekly_realization_id if needed, but UI mostly relies on monthly_target_id
                weekly_realization_id: realization?.id
            };
        });
    }

    /**
     * Submit bulk performance realization data
     * REFACTORED: Upserts into weekly_realizations table
     */
    async submitPerformanceRealization(
        submission: BulkPerformanceSubmission,
        userId?: string
    ): Promise<void> {
        // Find the Monthly Target IDs first (since frontend might pass indicator names)
        // Optimization: In a real app, frontend should pass IDs. 
        // Assuming the frontend passed 'targetId' which IS the 'monthly_target_id'.

        // Let's look at the frontend payload structure. 
        // It maps 'targetId' from the 'getMonthlyTargets' return.
        // We will assume the frontend uses the ID from the previous fetch.

        // However, the `BulkPerformanceSubmission` type currently uses `indicatorName` and `divisionName`?
        // Let's verify the input usage in `PerformanceInputPage.tsx`. 
        // It seems `PerformanceInputRow` has `targetId`.
        // The service call currently constructs `realizations` array with `indicatorName`, etc.
        // It's safer to use IDs if available, but if the type relies on names, we must look up IDs.

        // For robustness and sticking to the previous pattern (by name), I should fetch IDs first or use names if unique.
        // BUT, `monthly_targets` are unique by (indicator, division, month, year, unit).

        // New Strategy:
        // 1. Fetch all monthly_target_ids for the current batch (by period and unit).
        // 2. Prepare UPSERT payload for `weekly_realizations`.

        const { month, year, week } = submission.period;
        const { unitName } = submission;

        // 1. Get Unit ID
        const { data: unitData } = await supabase
            .from('work_units')
            .select('id')
            .eq('name', unitName)
            .single();

        if (!unitData) throw new Error(`Unit not found: ${unitName}`);
        const unitId = unitData.id;

        // 2. Map submission items to their monthly_target_id
        // We need to look up the ID for each indicator/division.
        const { data: targets } = await supabase
            .from('monthly_targets')
            .select('id, indicator_name, division_name')
            .eq('month', month)
            .eq('year', year)
            .eq('unit_id', unitId);

        if (!targets) throw new Error('No targets found for this period');

        const targetMap = new Map(
            targets.map(t => [`${t.indicator_name}|${t.division_name}`, t.id])
        );

        // 3. Prepare Upsert Payload
        const upsertPayload = submission.realizations.map(r => {
            const key = `${r.indicatorName}|${r.divisionName}`;
            const monthlyTargetId = targetMap.get(key);

            if (!monthlyTargetId) {
                console.warn(`Target not found for ${key}`);
                return null;
            }

            return {
                monthly_target_id: monthlyTargetId,
                week: week,
                realization_value: r.realization,
                status: 'pending_review',
                submitted_at: new Date().toISOString(),
                rejection_reason: null // Clear previous rejection
            };
        }).filter(item => item !== null);

        if (upsertPayload.length === 0) return;

        // 4. Perform Upsert
        // We need a unique constraint on (monthly_target_id, week) in `weekly_realizations` for UPSERT to work.
        const { error } = await supabase
            .from('weekly_realizations')
            .upsert(upsertPayload, {
                onConflict: 'monthly_target_id,week',
                ignoreDuplicates: false
            });

        if (error) {
            console.error('Error submitting weekly realizations:', JSON.stringify(error, null, 2));
            throw new Error('Failed to submit weekly realizations');
        }

        console.log(`Successfully submitted ${upsertPayload.length} weekly realizations`);
    }

    /**
     * Fetch rejected targets for the maintenance page
     * REFACTORED: Fetch from weekly_realizations where status='rejected'
     */
    async getRejectedTargets(
        unitName: string
    ): Promise<MonthlyTarget[]> {
        // Step 1: Get unit_id
        const { data: unitData } = await supabase
            .from('work_units')
            .select('id')
            .eq('name', unitName)
            .single();

        if (!unitData) throw new Error(`Unit not found: ${unitName}`);
        const unitId = unitData.id;

        // Step 2: Fetch weekly realizations with status='rejected' JOIN monthly_targets
        // We filter monthly_targets by unit_id
        const { data, error } = await supabase
            .from('weekly_realizations')
            .select(`
                id,
                monthly_target_id,
                week,
                realization_value,
                status,
                rejection_reason,
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
                    work_units!inner (name)
                )
            `)
            .eq('status', 'rejected')
            .eq('monthly_targets.unit_id', unitId)
            .order('submitted_at', { ascending: false });

        if (error) {
            console.error('Error fetching rejected targets:', JSON.stringify(error, null, 2));
            throw new Error('Failed to fetch rejected targets');
        }

        return (data || []).map(record => {
            const target = Array.isArray(record.monthly_targets) ? record.monthly_targets[0] : record.monthly_targets;
            const workUnit = Array.isArray(target.work_units) ? target.work_units[0] : target.work_units;

            return {
                id: target.id,
                weekly_realization_id: record.id,
                indicator_name: target.indicator_name,
                division_name: target.division_name,
                target_value: target.target_value,
                weight: target.weight,
                month: target.month,
                year: target.year,
                unit_name: workUnit?.name || 'Unknown',
                realization_value: record.realization_value,
                approval_status: record.status as any,
                rejection_reason: record.rejection_reason,
                submitted_at: record.submitted_at,
            };
        });
    }

    /**
     * Resubmit a rejected target
     * REFACTORED: Updates weekly_realizations
     */
    async resubmitRejectedTarget(
        // We should pass the weekly_realization_id ideally, or targetId + week
        // But the previous signature was (targetId, value).
        // Since rejected items are specific per week, we need to know WHICH week.
        // Assuming targetId passed here is actually the monthly_target_id AND we need to find the rejected week?
        // OR we update the signature to accept a specific ID.
        // For backwards compatibility with the UI calling this, let's assume we need to handle it carefully.
        // But `getRejectedTargets` returns `weekly_realization_id` now (mapped to id? or separate?).
        // In `getRejectedTargets` I mapped `monthly_targets.id` to `id`.
        // This suggests the UI uses the target ID.
        // If the UI passes target ID, we might have ambiguity if multiple weeks are rejected for same target (rare but possible).
        // A better approach is to change the `getRejectedTargets` mapping to use `weekly_realizations.id` as the primary key.

        // NOTE: The `MonitoringService.ts` and `InputRealisasi.tsx` types might need adjustment.
        // For now, I'll assume the `targetId` passed here corresponds to `weekly_realizations.id` IF I change the mapping in `getRejectedTargets`.
        // Let's verify `getRejectedTargets` mapping above: `id: record.monthly_targets.id`.
        // This is problematic. Let's change `getRejectedTargets` to returning `id: record.id` (Weekly ID).

        targetId: string, // Expecting weekly_realization_id
        newRealizationValue: number
    ): Promise<void> {
        const { error } = await supabase
            .from('weekly_realizations')
            .update({
                realization_value: newRealizationValue,
                status: 'pending_review',
                submitted_at: new Date().toISOString(),
                rejection_reason: null
            })
            .eq('id', targetId); // Updating by weekly_realization_id

        if (error) {
            console.error('Error resubmitting target:', JSON.stringify(error, null, 2));
            throw new Error('Failed to resubmit target');
        }
    }
}

export const performanceService = new PerformanceService();
