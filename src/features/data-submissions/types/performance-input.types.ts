/**
 * Performance Input - Type definitions
 * Types for weekly NKO performance realization input feature
 */

/**
 * Period selection for filtering targets
 */
export interface PerformancePeriod {
    month: number;        // 1-12
    year: number;         // e.g., 2025
    week: number;         // 1-4
}

/**
 * Approval status for the Maker-Checker workflow
 */
export type ApprovalStatus = 'draft' | 'pending_review' | 'approved' | 'rejected';

/**
 * Monthly target data from Supabase monthly_targets table
 * Enhanced with approval workflow fields
 */
export interface MonthlyTarget {
    id: string;
    indicator_name: string;
    division_name: string;
    target_value: number;
    weight: number;
    month?: number;
    year?: number;
    unit_name?: string;
    // Approval workflow fields
    realization_value?: number | null;
    approval_status?: ApprovalStatus;
    rejection_reason?: string | null;
    submitted_at?: string | null;  // ISO timestamp
}

/**
 * Performance input row for the form
 * Combines target data with user's realization input and approval status
 */
export interface PerformanceInputRow {
    targetId: string;
    indicatorName: string;
    divisionName: string;
    targetValue: number;
    weight: number;
    realization: number | null;  // User input, nullable until filled
    approvalStatus?: ApprovalStatus;  // Current approval state
    rejectionReason?: string | null;  // Reason if rejected
}

/**
 * Form state for the entire performance input page
 */
export interface PerformanceInputFormState {
    period: PerformancePeriod | null;
    unitName: string;
    rows: PerformanceInputRow[];
}

/**
 * Payload for submitting performance realization to nko_achievements table
 */
export interface PerformanceRealizationPayload {
    month: number;
    year: number;
    week: number;
    unit_id: string;      // Changed from unit_name to unit_id (UUID FK to work_units)
    indicator_name: string;
    realization: number;
    submitted_by?: string;  // Optional, can be set server-side
}

/**
 * Bulk submission payload
 */
export interface BulkPerformanceSubmission {
    period: PerformancePeriod;
    unitName: string;
    realizations: Array<{
        targetId: string; // [NEW] Explicit Monthly Target ID
        indicatorName: string;
        divisionName: string;
        target: number
        weight: number;
        realization: number;
    }>;
}
