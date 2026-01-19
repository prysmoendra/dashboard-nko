import { supabase } from '@/shared/lib/supabase';
import type { MonitoringRow, ActionPlanPayload, ExecutiveDashboardStats } from '../types/ai-monitoring.types';


/**
 * MonitoringService - Supabase operations for Kabid monitoring
 * Handles data fetching and action plan submissions
 * 
 * IMPORTANT: This service fetches realization data from nko_achievements table, which
 * contains ONLY APPROVED realization data (via the Maker-Checker approval workflow).
 * Draft or pending data in monthly_targets is NOT included in AI analysis.
 * This ensures that only validated and approved data is used for AI-driven insights.
 */
export class MonitoringService {
    /**
     * Fetch monitoring data by joining monthly_targets with weekly_realizations
     * @param month - Filter by month (1-12)
     * @param year - Filter by year
     * @param week - Filter by week (1-5)
     * @param unitName - Filter by work unit name
     */
    async getMonitoringData(
        month: number,
        year: number,
        week: number,
        unitName: string
    ): Promise<MonitoringRow[]> {
        try {
            // Step 1: Get unit_id from work_units table
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
            // Note: We do NOT select realization columns from monthly_targets anymore
            const { data: targets, error: targetsError } = await supabase
                .from('monthly_targets')
                .select(`
                    id,
                    indicator_name,
                    division_name,
                    target_value,
                    weight,
                    month,
                    year,
                    work_units!inner (
                        name
                    )
                `)
                .eq('month', month)
                .eq('year', year)
                .eq('unit_id', unitId)
                .order('indicator_name', { ascending: true });

            if (targetsError) {
                console.error('Error fetching monthly targets:', JSON.stringify(targetsError, null, 2));
                throw new Error('Failed to fetch monthly targets');
            }

            if (!targets || targets.length === 0) {
                console.log(`No targets found for ${unitName} (${month}/${year})`);
                return [];
            }

            // Step 3: Fetch weekly realizations (ACTUALS) for this specific week
            // utilizing the foreign key monthly_target_id
            const targetIds = targets.map(t => t.id);
            const { data: realizations, error: realizationError } = await supabase
                .from('weekly_realizations')
                .select('monthly_target_id, realization_value, status, week')
                .in('monthly_target_id', targetIds)
                .eq('week', week);

            if (realizationError) {
                console.error('Error fetching weekly realizations:', JSON.stringify(realizationError, null, 2));
                // We can continue, assuming no data (all 0)
            }

            // Step 4: Create a map of realizations by monthly_target_id
            const realizationMap = new Map<string, number>();
            if (realizations) {
                realizations.forEach(r => {
                    realizationMap.set(r.monthly_target_id, r.realization_value);
                });
            }

            // Step 5: Combine targets with realizations
            const monitoringRows: MonitoringRow[] = targets.map(target => ({
                id: target.id,
                indicatorName: target.indicator_name,
                divisionName: target.division_name,
                targetValue: target.target_value,
                weight: target.weight,
                // If no realization row, default to 0 (or null if preferred, but user asked for "clean form" logic -> usually 0 or empty)
                realization: realizationMap.get(target.id) ?? 0,
                month,
                year,
                week,
                unitName: (target.work_units as any)?.name || unitName,
            }));

            console.log(`Found ${monitoringRows.length} monitoring rows for ${unitName} (${month}/${year}, Week ${week})`);
            return monitoringRows;
        } catch (error) {
            console.error('Error in getMonitoringData:', error);
            throw error;
        }
    }

    /**
     * Get executive dashboard statistics
     * Used for high-level overview on Kabid Dashboard
     */
    async getExecutiveDashboardStats(
        year: number,
        month?: number | null,
        divisionName?: string | null
    ): Promise<ExecutiveDashboardStats> {
        try {
            // Build base query
            let query = supabase
                .from('nko_achievements')
                .select('*')
                .eq('year', year);

            // Apply optional filters
            if (month !== null && month !== undefined) {
                query = query.eq('month', month);
            }
            if (divisionName) {
                query = query.eq('division_name', divisionName);
            }

            const { data: achievements, error } = await query;

            if (error) {
                console.error('Error fetching achievements for dashboard:', JSON.stringify(error, null, 2));
                throw new Error('Failed to fetch dashboard statistics');
            }

            if (!achievements || achievements.length === 0) {
                console.log(`No achievements found for year ${year}`);
                return {
                    kpiCounts: { green: 0, yellow: 0, red: 0 },
                    trendData: this.getEmptyTrendData(),
                    underperformers: [],
                    lossPoint: 0,
                    divisionPerformance: []
                };
            }

            // Calculate KPI counts based on achievement_percent
            let greenCount = 0;
            let yellowCount = 0;
            let redCount = 0;

            const achievementsWithPercent = achievements.map(ach => {
                const achievementPercent = ach.target > 0 ? (ach.realization / ach.target) * 100 : 0;

                // Categorize into traffic lights
                if (achievementPercent > 100) {
                    greenCount++;
                } else if (achievementPercent >= 95 && achievementPercent <= 100) {
                    yellowCount++;
                } else {
                    redCount++;
                }

                return {
                    ...ach,
                    achievement_percent: achievementPercent
                };
            });

            // Calculate trend data (monthly averages)
            const trendData = this.calculateMonthlyTrends(achievementsWithPercent, year);

            // Aggregate underperformers by indicator name (eliminate duplicates)
            const indicatorMap = new Map<string, { totalPercent: number; count: number }>();

            achievementsWithPercent.forEach(ach => {
                const safePercent = Number(ach.achievement_percent) || 0;
                const existing = indicatorMap.get(ach.indicator_name) || { totalPercent: 0, count: 0 };
                existing.totalPercent += safePercent;
                existing.count += 1;
                indicatorMap.set(ach.indicator_name, existing);
            });

            // Calculate average achievement and gap for each unique indicator
            const uniqueIndicators = Array.from(indicatorMap.entries())
                .map(([indicator_name, data]) => {
                    const avgAchievement = data.count > 0 ? data.totalPercent / data.count : 0;
                    const gap = 100 - avgAchievement; // Positive gap to 100%
                    const deviation = avgAchievement - 100; // Keep for backward compat
                    return {
                        indicator_name,
                        achievement_percent: Number(avgAchievement.toFixed(2)),
                        deviation: Number(deviation.toFixed(2)),
                        gap: Number(gap.toFixed(2))
                    };
                })
                .filter(item => item.achievement_percent > 0 && item.achievement_percent < 100) // Exclude 0% (no data) and >= 100% (met target)
                .sort((a, b) => b.gap - a.gap) // Sort by largest gap first
                .slice(0, 10); // Take top 10 worst

            console.log('Unique Underperformers:', JSON.stringify(uniqueIndicators, null, 2));
            const underperformers = uniqueIndicators;

            // Calculate loss point (sum of negative deviations)
            const lossPoint = achievements.reduce((sum, ach) => {
                if (ach.realization < ach.target) {
                    return sum + (ach.target - ach.realization);
                }
                return sum;
            }, 0);

            // Calculate division performance (grouped by division)
            const divisionPerformance = this.calculateDivisionPerformance(achievements);

            console.log(`Dashboard stats for ${year}: Green=${greenCount}, Yellow=${yellowCount}, Red=${redCount}, Loss=${lossPoint.toFixed(2)}`);
            console.log('Division Performance Stats:', JSON.stringify(divisionPerformance, null, 2));

            return {
                kpiCounts: { green: greenCount, yellow: yellowCount, red: redCount },
                trendData,
                underperformers,
                lossPoint,
                divisionPerformance
            };
        } catch (error) {
            console.error('Error in getExecutiveDashboardStats:', error);
            throw error;
        }
    }

    /**
     * Calculate monthly trends (weighted average scores by month)
     */
    private calculateMonthlyTrends(
        achievements: Array<{ month: number; realization: number; weight: number }>,
        year: number
    ): { month: string; score: number; weight: number }[] {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // Group by month and calculate weighted scores
        const monthlyData = new Map<number, { totalWeightedScore: number; totalWeight: number }>();

        achievements.forEach(ach => {
            const existing = monthlyData.get(ach.month) || { totalWeightedScore: 0, totalWeight: 0 };
            existing.totalWeightedScore += ach.realization * ach.weight;
            existing.totalWeight += ach.weight;
            monthlyData.set(ach.month, existing);
        });

        // Generate data for all 12 months
        return monthNames.map((monthName, index) => {
            const monthNumber = index + 1;
            const data = monthlyData.get(monthNumber);
            const score = data && data.totalWeight > 0 ? data.totalWeightedScore / data.totalWeight : 0;
            const weight = data ? data.totalWeight : 0;

            return {
                month: monthName,
                score: Math.round(score * 100) / 100,  // Round to 2 decimal places
                weight: Math.round(weight * 100) / 100  // Round to 2 decimal places
            };
        });
    }

    /**
     * Get empty trend data (all months with 0 score and 0 weight)
     */
    private getEmptyTrendData(): { month: string; score: number; weight: number }[] {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return monthNames.map(month => ({ month, score: 0, weight: 0 }));
    }

    /**
     * Calculate division performance (aggregate target and realization by division)
     */
    private calculateDivisionPerformance(
        achievements: Array<{ division_name: string; target: number; realization: number }>
    ): { division: string; nilaiMax: number; nilaiAkhir: number; achievementPercent: number }[] {
        const divisionMap = new Map<string, { target: number; realization: number }>();

        // Aggregate by division with robust number parsing
        achievements.forEach(ach => {
            // Force convert to Number and default to 0 if NaN, null, or undefined
            const safeTarget = Number(ach.target) || 0;
            const safeRealization = Number(ach.realization) || 0;

            const existing = divisionMap.get(ach.division_name) || { target: 0, realization: 0 };
            existing.target += safeTarget;
            existing.realization += safeRealization;
            divisionMap.set(ach.division_name, existing);
        });

        // Convert to array and sort by division name
        const divisionPerformance = Array.from(divisionMap.entries())
            .map(([division, data]) => {
                const achievementPercent = data.target > 0 ? (data.realization / data.target) * 100 : 0;
                return {
                    division,
                    nilaiMax: Math.round(data.target * 100) / 100,
                    nilaiAkhir: Math.round(data.realization * 100) / 100,
                    achievementPercent: Math.round(achievementPercent * 100) / 100
                };
            })
            .sort((a, b) => a.division.localeCompare(b.division));

        console.log('Fixed Division Stats:', JSON.stringify(divisionPerformance, null, 2));

        return divisionPerformance;
    }

    /**
     * Submit action plan to Supabase
     * @param actionPlan - Action plan data to insert
     */
    async submitActionPlan(actionPlan: ActionPlanPayload): Promise<void> {
        try {
            const { error } = await supabase
                .from('action_plans')
                .insert([actionPlan]);

            if (error) {
                console.error('Error submitting action plan:', JSON.stringify(error, null, 2));
                console.error('Payload:', JSON.stringify(actionPlan, null, 2));
                throw new Error('Failed to submit action plan');
            }

            console.log('Successfully submitted action plan for:', actionPlan.indicator_name);
        } catch (error) {
            console.error('Error in submitActionPlan:', error);
            throw error;
        }
    }

    /**
     * Get detailed performance logs (paginated and aggregated by indicator)
     * For detailed table view in dashboard
     */
    async getDetailedPerformanceLogs(
        year: number,
        month?: number | null,
        divisionName?: string | null,
        page: number = 1,
        limit: number = 10
    ): Promise<{
        data: Array<{
            id: string;
            indicator_name: string;
            unit_measurement: string;
            target: number;
            realization: number;
            achievement_percent: number;
            score: number;
        }>;
        total: number;
        page: number;
        totalPages: number;
    }> {
        try {
            // Build base query - fetch ALL data first for aggregation
            let query = supabase
                .from('nko_achievements')
                .select('*')
                .eq('year', year);

            // Apply optional filters
            if (month !== null && month !== undefined) {
                query = query.eq('month', month);
            }

            if (divisionName) {
                query = query.eq('division_name', divisionName);
            }

            // Fetch all data (no pagination at query level)
            const { data: achievements, error } = await query
                .order('indicator_name', { ascending: true });

            if (error) {
                console.error('Error fetching detailed performance logs:', error);
                throw error;
            }

            // Aggregate data by indicator_name
            const indicatorMap = new Map<string, {
                indicator_name: string;
                unit_measurement: string;
                target: number;
                realization: number;
                weight: number;
            }>();

            (achievements || []).forEach(ach => {
                const safeTarget = Number(ach.target) || 0;
                const safeRealization = Number(ach.realization) || 0;
                const safeWeight = Number(ach.weight) || 0;

                const existing = indicatorMap.get(ach.indicator_name);

                if (existing) {
                    // Aggregate: sum targets and realizations
                    existing.target += safeTarget;
                    existing.realization += safeRealization;
                } else {
                    // First occurrence: create entry
                    indicatorMap.set(ach.indicator_name, {
                        indicator_name: ach.indicator_name || 'Unknown',
                        unit_measurement: ach.unit_measurement || '-',
                        target: safeTarget,
                        realization: safeRealization,
                        weight: safeWeight
                    });
                }
            });

            // Convert map to array and calculate achievement & points
            const aggregatedData = Array.from(indicatorMap.values()).map(item => {
                // Calculate achievement percentage
                const achievementPercent = item.target > 0
                    ? (item.realization / item.target) * 100
                    : 0;

                // Calculate point: (achievement_percent * weight) / 100
                const point = (achievementPercent * item.weight) / 100;

                return {
                    id: item.indicator_name, // Use indicator name as ID since it's unique
                    indicator_name: item.indicator_name,
                    unit_measurement: item.unit_measurement,
                    target: item.target,
                    realization: item.realization,
                    achievement_percent: Number(achievementPercent.toFixed(2)),
                    score: Number(point.toFixed(2))
                };
            });

            // Apply pagination to aggregated data
            const total = aggregatedData.length;
            const totalPages = Math.ceil(total / limit);
            const offset = (page - 1) * limit;
            const paginatedData = aggregatedData.slice(offset, offset + limit);

            return {
                data: paginatedData,
                total,
                page,
                totalPages
            };
        } catch (error) {
            console.error('Error in getDetailedPerformanceLogs:', error);
            return {
                data: [],
                total: 0,
                page: 1,
                totalPages: 0
            };
        }
    }
}

// Export singleton
export const monitoringService = new MonitoringService();
