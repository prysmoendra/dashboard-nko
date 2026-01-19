/**
 * Approvals Feature - Type Definitions
 * Types for Askbid (Asisten Kepala Bidang) dashboard and instruction management
 */

/**
 * Action Plan Status
 */
export type ActionPlanStatus = 'pending' | 'in_progress' | 'done';

/**
 * Status Color for urgency indicators
 */
export type StatusColor = 'Merah' | 'Kuning' | 'Hijau';

/**
 * Tab options for filtering instructions
 */
export type InstructionFilterTab = 'all' | 'pending' | 'in_progress' | 'done';

/**
 * Role options for simulator
 */
export type AsmanRole = 'Asman Jaringan' | 'Asman Pemasaran' | 'Asman TEL';

/**
 * Action Plan with status tracking
 * Extended from AI-generated action plans with Asman workflow fields
 */
export interface ActionPlanWithStatus {
    id: string;
    indicator_name: string;
    week: number;
    month: number;
    year: number;
    ai_message: string;
    final_instruction: string;
    assigned_role: string;
    status: ActionPlanStatus;
    status_color?: StatusColor;
    response_text?: string;
    created_at: string;
    updated_at?: string;
    created_by?: string;
    unit_id?: string;
}

/**
 * Database payload for updating action plan status
 */
export interface UpdateActionPlanStatusPayload {
    status: ActionPlanStatus;
}

/**
 * Database payload for submitting completion report
 */
export interface SubmitReportPayload {
    status: ActionPlanStatus;
    response_text: string;
}

/**
 * Role simulator option for dropdown
 */
export interface RoleSimulatorOption {
    label: AsmanRole;
    value: string;
}

/**
 * UI state for instruction filters
 */
export interface InstructionFilters {
    role: AsmanRole | null;
    status: InstructionFilterTab;
}
