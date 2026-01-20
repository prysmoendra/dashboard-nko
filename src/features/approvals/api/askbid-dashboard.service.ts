import { supabase } from '@/shared/lib/supabase';

/**
 * AskbidDashboardService - Business logic for supervisor operational dashboard
 * Provides supervisory metrics and analytics for Asisten Kepala Bidang (Askbid)
 * Scope: Multi-unit oversight within a bidang
 */
export class AskbidDashboardService {
    /**
     * Get count of items pending review
     */
    async getPendingReviewCount(bidangScope?: string): Promise<number> {
        // Simple count query without complex joins
        const { count, error } = await supabase
            .from('weekly_realizations')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'pending_review');

        if (error) {
            console.error('Error fetching pending review count:', error);
            return 0;
        }

        return count || 0;
    }

    /**
     * Get count of units that have NOT submitted for a specific week
     */
    async getUnitsWithoutSubmission(
        bidangScope: string | undefined,
        week: number,
        month: number,
        year: number
    ): Promise<number> {
        // Get all units
        const { data: allUnits, error: unitsError } = await supabase
            .from('work_units')
            .select('id');

        if (unitsError || !allUnits) {
            console.error('Error fetching units:', unitsError);
            return 0;
        }

        // Get monthly targets for this period
        const { data: targets } = await supabase
            .from('monthly_targets')
            .select('id, unit_id')
            .eq('month', month)
            .eq('year', year);

        if (!targets || targets.length === 0) {
            return allUnits.length; // All units haven't submitted if no targets
        }

        const targetIds = targets.map(t => t.id);

        // Get units that HAVE submitted for this week
        const { data: submittedRealizations } = await supabase
            .from('weekly_realizations')
            .select('monthly_target_id')
            .in('monthly_target_id', targetIds)
            .eq('week', week);

        if (!submittedRealizations) {
            return allUnits.length;
        }

        // Get unique unit IDs that have submitted
        const submittedTargetIds = new Set(submittedRealizations.map(r => r.monthly_target_id));
        const submittedUnitIds = new Set(
            targets
                .filter(t => submittedTargetIds.has(t.id))
                .map(t => t.unit_id)
        );

        // Count units that haven't submitted
        const unitsWithoutSubmission = allUnits.filter(unit => !submittedUnitIds.has(unit.id));

        return unitsWithoutSubmission.length;
    }

    /**
     * Calculate average performance across all units in bidang
     */
    async getAverageBidangPerformance(
        bidangScope: string | undefined,
        month: number,
        year: number
    ): Promise<number> {
        // Get monthly targets for this period
        const { data: targets } = await supabase
            .from('monthly_targets')
            .select('id, target_value')
            .eq('month', month)
            .eq('year', year);

        if (!targets || targets.length === 0) {
            return 0;
        }

        const targetIds = targets.map(t => t.id);

        // Get approved realizations
        const { data: realizations } = await supabase
            .from('weekly_realizations')
            .select('monthly_target_id, realization_value')
            .in('monthly_target_id', targetIds)
            .eq('status', 'approved');

        if (!realizations || realizations.length === 0) {
            return 0;
        }

        // Calculate achievement per target
        let totalPercentage = 0;
        let count = 0;

        targets.forEach(target => {
            const targetRealizations = realizations.filter(r => r.monthly_target_id === target.id);
            const totalRealization = targetRealizations.reduce((sum, r) => sum + (r.realization_value || 0), 0);

            if (target.target_value > 0) {
                const achievementPercent = (totalRealization / target.target_value) * 100;
                totalPercentage += Math.min(achievementPercent, 100); // Cap at 100%
                count++;
            }
        });

        return count > 0 ? Math.round((totalPercentage / count) * 10) / 10 : 0;
    }

    /**
     * Get count of approved items this month
     */
    async getApprovedCountThisMonth(
        bidangScope: string | undefined,
        month: number,
        year: number
    ): Promise<number> {
        // Get monthly targets for this period
        const { data: targets } = await supabase
            .from('monthly_targets')
            .select('id')
            .eq('month', month)
            .eq('year', year);

        if (!targets || targets.length === 0) {
            return 0;
        }

        const targetIds = targets.map(t => t.id);

        // Count approved realizations
        const { count, error } = await supabase
            .from('weekly_realizations')
            .select('id', { count: 'exact', head: true })
            .in('monthly_target_id', targetIds)
            .eq('status', 'approved');

        if (error) {
            console.error('Error fetching approved count:', error);
            return 0;
        }

        return count || 0;
    }

    /**
     * Get unit performance ranking for bar chart
     */
    async getUnitPerformanceRanking(
        bidangScope: string | undefined,
        month: number,
        year: number
    ): Promise<Array<{ unitName: string; averagePerformance: number; color: string }>> {
        // Get all work units
        const { data: units } = await supabase
            .from('work_units')
            .select('id, name');

        if (!units || units.length === 0) {
            return [];
        }

        // Get monthly targets for this period
        const { data: targets } = await supabase
            .from('monthly_targets')
            .select('id, unit_id, target_value')
            .eq('month', month)
            .eq('year', year);

        if (!targets || targets.length === 0) {
            return [];
        }

        const targetIds = targets.map(t => t.id);

        // Get approved realizations
        const { data: realizations } = await supabase
            .from('weekly_realizations')
            .select('monthly_target_id, realization_value')
            .in('monthly_target_id', targetIds)
            .eq('status', 'approved');

        if (!realizations || realizations.length === 0) {
            return [];
        }

        // Calculate performance per unit
        const unitPerformanceMap = new Map<string, { totalPercent: number; count: number; unitName: string }>();

        units.forEach(unit => {
            const unitTargets = targets.filter(t => t.unit_id === unit.id);
            let unitTotalPercent = 0;
            let unitCount = 0;

            unitTargets.forEach(target => {
                const targetRealizations = realizations.filter(r => r.monthly_target_id === target.id);
                const totalRealization = targetRealizations.reduce((sum, r) => sum + (r.realization_value || 0), 0);

                if (target.target_value > 0) {
                    const achievementPercent = (totalRealization / target.target_value) * 100;
                    unitTotalPercent += achievementPercent;
                    unitCount++;
                }
            });

            if (unitCount > 0) {
                unitPerformanceMap.set(unit.id, {
                    totalPercent: unitTotalPercent,
                    count: unitCount,
                    unitName: unit.name
                });
            }
        });

        // Convert to array and calculate averages
        const result = Array.from(unitPerformanceMap.values()).map(({ totalPercent, count, unitName }) => {
            const averagePerformance = Math.round((totalPercent / count) * 10) / 10;

            // Determine color based on performance
            let color = '#ef4444'; // red (< 40%)
            if (averagePerformance >= 80) {
                color = '#22c55e'; // green
            } else if (averagePerformance >= 60) {
                color = '#eab308'; // yellow
            } else if (averagePerformance >= 40) {
                color = '#f97316'; // orange
            }

            return { unitName, averagePerformance, color };
        });

        // Sort by performance descending
        return result.sort((a, b) => b.averagePerformance - a.averagePerformance);
    }

    /**
     * Get status distribution for donut chart
     */
    async getStatusDistribution(
        bidangScope: string | undefined,
        week: number,
        month: number,
        year: number
    ): Promise<Array<{ status: string; label: string; count: number; color: string }>> {
        // Get monthly targets for this period
        const { data: targets } = await supabase
            .from('monthly_targets')
            .select('id')
            .eq('month', month)
            .eq('year', year);

        if (!targets || targets.length === 0) {
            return [
                { status: 'pending_review', label: 'Menunggu Review', count: 0, color: '#f97316' },
                { status: 'approved', label: 'Disetujui', count: 0, color: '#22c55e' },
                { status: 'rejected', label: 'Ditolak', count: 0, color: '#ef4444' },
                { status: 'not_submitted', label: 'Belum Lapor', count: 0, color: '#9ca3af' }
            ];
        }

        const targetIds = targets.map(t => t.id);

        // Get all realizations for this week
        const { data: realizations } = await supabase
            .from('weekly_realizations')
            .select('status')
            .in('monthly_target_id', targetIds)
            .eq('week', week);

        // Count by status
        const pendingCount = realizations?.filter(r => r.status === 'pending_review').length || 0;
        const approvedCount = realizations?.filter(r => r.status === 'approved').length || 0;
        const rejectedCount = realizations?.filter(r => r.status === 'rejected').length || 0;

        // Get units without submission
        const unitsWithoutSubmission = await this.getUnitsWithoutSubmission(bidangScope, week, month, year);

        return [
            { status: 'pending_review', label: 'Menunggu Review', count: pendingCount, color: '#f97316' },
            { status: 'approved', label: 'Disetujui', count: approvedCount, color: '#22c55e' },
            { status: 'rejected', label: 'Ditolak', count: rejectedCount, color: '#ef4444' },
            { status: 'not_submitted', label: 'Belum Lapor', count: unitsWithoutSubmission, color: '#9ca3af' }
        ];
    }

    /**
     * Get division performance for bar chart (aggregated by division_name)
     */
    async getDivisionPerformance(
        bidangScope: string | undefined,
        month: number,
        year: number
    ): Promise<Array<{ division: string; nilaiMax: number; nilaiAkhir: number; achievementPercent: number }>> {
        // Get monthly targets for this period
        const { data: targets } = await supabase
            .from('monthly_targets')
            .select('id, division_name, target_value')
            .eq('month', month)
            .eq('year', year);

        if (!targets || targets.length === 0) {
            return [];
        }

        const targetIds = targets.map(t => t.id);

        // Get approved realizations
        const { data: realizations } = await supabase
            .from('weekly_realizations')
            .select('monthly_target_id, realization_value')
            .in('monthly_target_id', targetIds)
            .eq('status', 'approved');

        if (!realizations || realizations.length === 0) {
            return [];
        }

        // Aggregate by division
        const divisionMap = new Map<string, { target: number; realization: number }>();

        targets.forEach(target => {
            const targetRealizations = realizations.filter(r => r.monthly_target_id === target.id);
            const totalRealization = targetRealizations.reduce((sum, r) => sum + (r.realization_value || 0), 0);

            const divisionName = target.division_name || 'Unknown';
            const existing = divisionMap.get(divisionName) || { target: 0, realization: 0 };

            divisionMap.set(divisionName, {
                target: existing.target + (target.target_value || 0),
                realization: existing.realization + totalRealization
            });
        });

        // Convert to array format for chart
        const result = Array.from(divisionMap.entries()).map(([division, data]) => {
            const achievementPercent = data.target > 0 ? (data.realization / data.target) * 100 : 0;

            return {
                division,
                nilaiMax: Math.round(data.target * 100) / 100,
                nilaiAkhir: Math.round(data.realization * 100) / 100,
                achievementPercent: Math.round(achievementPercent * 100) / 100
            };
        });

        // Sort by division name
        return result.sort((a, b) => a.division.localeCompare(b.division));
    }

    /**
     * Get lowest performing indicators across all units (scope-wide)
     */
    async getLowestIndicatorsScopeWide(
        bidangScope: string | undefined,
        month: number,
        year: number,
        limit: number = 10
    ): Promise<Array<{ indicatorName: string; achievementPercentage: number }>> {
        // Get monthly targets for this period
        const { data: targets } = await supabase
            .from('monthly_targets')
            .select('id, indicator_name, target_value')
            .eq('month', month)
            .eq('year', year);

        if (!targets || targets.length === 0) {
            return [];
        }

        const targetIds = targets.map(t => t.id);

        // Get approved realizations
        const { data: realizations } = await supabase
            .from('weekly_realizations')
            .select('monthly_target_id, realization_value')
            .in('monthly_target_id', targetIds)
            .eq('status', 'approved');

        // Aggregate by indicator name
        const indicatorMap = new Map<string, { target: number; realization: number }>();

        targets.forEach(target => {
            const targetRealizations = realizations?.filter(r => r.monthly_target_id === target.id) || [];
            const totalRealization = targetRealizations.reduce((sum, r) => sum + (r.realization_value || 0), 0);

            const indicatorName = target.indicator_name;
            const existing = indicatorMap.get(indicatorName) || { target: 0, realization: 0 };

            indicatorMap.set(indicatorName, {
                target: existing.target + (target.target_value || 0),
                realization: existing.realization + totalRealization
            });
        });

        // Calculate achievement percentages
        const indicatorAchievements: Array<{ indicatorName: string; achievementPercentage: number }> = [];

        indicatorMap.forEach((data, indicatorName) => {
            const achievementPercent = data.target > 0 ? (data.realization / data.target) * 100 : 0;
            indicatorAchievements.push({
                indicatorName,
                achievementPercentage: Math.round(achievementPercent * 10) / 10
            });
        });

        // Sort by lowest percentage and take top N
        return indicatorAchievements
            .sort((a, b) => a.achievementPercentage - b.achievementPercentage)
            .slice(0, limit);
    }
}

export const askbidDashboardService = new AskbidDashboardService();
