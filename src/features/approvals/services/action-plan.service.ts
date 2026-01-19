/**
 * Action Plan Service
 * Service layer for managing action plans (instructions from Kabid to Asman)
 */

import { SupabaseClient } from '@supabase/supabase-js';
import {
    ActionPlanWithStatus,
    ActionPlanStatus,
    UpdateActionPlanStatusPayload,
    SubmitReportPayload,
    InstructionFilterTab,
} from '../types';

export class ActionPlanService {
    private supabase: SupabaseClient;

    constructor(supabase: SupabaseClient) {
        this.supabase = supabase;
    }

    /**
     * Fetch action plans with optional filters
     * @param role - Filter by assigned role (e.g., "Asman Jaringan")
     * @param status - Filter by status (pending, in_progress, done)
     */
    async fetchActionPlans(
        role?: string | null,
        status?: InstructionFilterTab
    ): Promise<ActionPlanWithStatus[]> {
        try {
            let query = this.supabase
                .from('action_plans')
                .select('*')
                .order('created_at', { ascending: false });

            // Apply role filter if provided
            if (role) {
                query = query.eq('assigned_role', role);
            }

            // Apply status filter if provided and not 'all'
            if (status && status !== 'all') {
                query = query.eq('status', status);
            }

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching action plans:', error);
                throw new Error(`Failed to fetch action plans: ${error.message}`);
            }

            return data || [];
        } catch (error) {
            console.error('ActionPlanService.fetchActionPlans:', error);
            throw error;
        }
    }

    /**
     * Update action plan status
     * @param id - Action plan ID
     * @param status - New status
     */
    async updateStatus(
        id: string,
        status: ActionPlanStatus
    ): Promise<ActionPlanWithStatus> {
        try {
            const payload: UpdateActionPlanStatusPayload = { status };

            const { data, error } = await this.supabase
                .from('action_plans')
                .update(payload)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Error updating action plan status:', error);
                throw new Error(`Failed to update status: ${error.message}`);
            }

            if (!data) {
                throw new Error('No data returned after update');
            }

            return data;
        } catch (error) {
            console.error('ActionPlanService.updateStatus:', error);
            throw error;
        }
    }

    /**
     * Submit completion report
     * @param id - Action plan ID
     * @param responseText - Asman's completion report
     */
    async submitReport(
        id: string,
        responseText: string
    ): Promise<ActionPlanWithStatus> {
        try {
            const payload: SubmitReportPayload = {
                status: 'done',
                response_text: responseText,
            };

            const { data, error } = await this.supabase
                .from('action_plans')
                .update(payload)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Error submitting report:', error);
                throw new Error(`Failed to submit report: ${error.message}`);
            }

            if (!data) {
                throw new Error('No data returned after report submission');
            }

            return data;
        } catch (error) {
            console.error('ActionPlanService.submitReport:', error);
            throw error;
        }
    }

    /**
     * Get action plan by ID
     * @param id - Action plan ID
     */
    async getById(id: string): Promise<ActionPlanWithStatus | null> {
        try {
            const { data, error } = await this.supabase
                .from('action_plans')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching action plan:', error);
                throw new Error(`Failed to fetch action plan: ${error.message}`);
            }

            return data;
        } catch (error) {
            console.error('ActionPlanService.getById:', error);
            throw error;
        }
    }
}
