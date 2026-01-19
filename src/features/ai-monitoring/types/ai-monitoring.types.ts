/**
 * AI Monitoring - Type definitions
 * Types for Kabid monitoring dashboard with AI integration
 */

/**
 * Period selection for filtering monitoring data
 */
export interface MonitoringPeriod {
    month: number;        // 1-12
    year: number;         // e.g., 2026
    week: number;         // 1-4
}

/**
 * Monitoring row combining targets and achievements
 * Used for displaying performance data in the table
 */
export interface MonitoringRow {
    id: string;
    indicatorName: string;
    divisionName: string;
    targetValue: number;
    weight: number;
    realization: number | null;  // null if no achievement data exists
    month: number;
    year: number;
    week: number;
    unitName: string;
}

/**
 * AI Prediction Request payload
 * Sent to Python API at POST /predict
 */
export interface AIPredictionRequest {
    month: number;
    year: number;
    week: number;
    indicator_name: string;
    target: number;
    weight: number;
    realization: number;
    division_name: string;
    unit_name: string;
}

/**
 * AI Prediction Response from Python API
 */
export interface AIPredictionResponse {
    prediction: number;           // Numerical prediction score
    status: 'Merah' | 'Kuning' | 'Hijau';  // Traffic light status
    wisdom_message: string;       // AI-generated instruction message
    assigned_role: string;        // Role to assign the action plan
}

/**
 * Action Plan data model
 * Stored in Supabase action_plans table
 */
export interface ActionPlan {
    id?: string;
    indicatorName: string;
    week: number;
    month: number;
    year: number;
    aiMessage: string;            // Original AI-generated message
    finalInstruction: string;     // Edited by Kabid
    assignedRole: string;         // From AI response
    createdBy?: string;           // User UUID
    unitId?: string;              // Work unit UUID
    createdAt?: string;
}

/**
 * Action Plan submission payload
 */
export interface ActionPlanPayload {
    indicator_name: string;
    week: number;
    month: number;
    year: number;
    ai_message: string;
    final_instruction: string;
    assigned_role: string;
    created_by?: string;
    unit_id?: string;
}

/**
 * UI state for AI Analysis Modal
 */
export interface AIAnalysisState {
    isOpen: boolean;
    loading: boolean;
    error: string | null;
    prediction: AIPredictionResponse | null;
    editedMessage: string;
    rowData: MonitoringRow | null;
}

/**
 * Division performance data for grouped bar chart
 */
export interface DivisionPerformance {
    division: string;
    nilaiMax: number;     // Target sum
    nilaiAkhir: number;   // Realization sum
    achievementPercent: number; // Achievement percentage
}

/**
 * Executive dashboard statistics (for ASKBID view)
 */
export interface ExecutiveDashboardStats {
    kpiCounts: {
        green: number;
        yellow: number;
        red: number;
    };
    trendData: Array<{
        month: string;
        score: number;
        weight: number;
    }>;
    underperformers: Array<{
        indicator_name: string;
        achievement_percent: number;
        deviation: number;
        gap: number;
    }>;
    lossPoint: number;
    divisionPerformance: Array<{
        division: string;
        nilaiMax: number;
        nilaiAkhir: number;
        achievementPercent: number;
    }>;
}

/**
 * Monthly trend data point for executive dashboard
 */
export interface MonthlyTrendPoint {
    month: string;  // Month name (e.g., "Jan", "Feb")
    score: number;  // Weighted average score for the month
    weight: number; // Total weight for the month
}

/**
 * Underperformer indicator data
 */
export interface UnderperformerIndicator {
    indicator_name: string;
    achievement_percent: number;
    deviation: number; // Gap to 100% (negative value)
    gap: number; // Positive gap to 100% for chart display
}
