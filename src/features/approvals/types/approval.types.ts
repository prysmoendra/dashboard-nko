/**
 * Approval Types - Type definitions for Askbid review workflow
 */

import type { ApprovalStatus } from '@/features/data-submissions/types/performance-input.types';

/**
 * Target pending approval review
 */
export interface PendingApprovalTarget {
    id: string;
    indicator_name: string;
    division_name: string;
    target_value: number;
    weight: number;
    realization_value: number;
    approval_status: ApprovalStatus;
    submitted_at: string;  // ISO timestamp
    unit_name: string;
    month: number;
    year: number;
    week?: number;
}

/**
 * Approval action payload
 */
export interface ApprovalActionPayload {
    targetId: string;
    action: 'approve' | 'reject';
    rejectionReason?: string;  // Required if action is 'reject'
}

/**
 * Statistics for realization review dashboard
 */
export interface RealizationReviewStats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
}

/**
 * Filter options for review page
 */
export type ReviewFilter = 'all' | 'pending_review' | 'approved' | 'rejected';
