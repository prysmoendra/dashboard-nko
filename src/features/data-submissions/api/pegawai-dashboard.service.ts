import { supabase } from '@/shared/lib/supabase';

/**
 * PegawaiDashboardService - Business logic for employee operational dashboard
 * Provides personalized metrics and analytics for individual employees
 */
export class PegawaiDashboardService {
    /**
     * Check if employee has submitted performance data for a specific week
     */
    async getWeeklySubmissionStatus(
        unitName: string,
        week: number,
        month: number,
        year: number
    ): Promise<{ hasSubmitted: boolean; week: number }> {
        // Get unit_id
        const { data: unitData } = await supabase
            .from('work_units')
            .select('id')
            .eq('name', unitName)
            .single();

        if (!unitData) {
            return { hasSubmitted: false, week };
        }

        // Check if any weekly_realizations exist for this week
        const { data, error } = await supabase
            .from('weekly_realizations')
            .select('id, monthly_targets!inner(unit_id)')
            .eq('week', week)
            .eq('monthly_targets.unit_id', unitData.id)
            .eq('monthly_targets.month', month)
            .eq('monthly_targets.year', year)
            .limit(1);

        if (error) {
            console.error('Error checking weekly submission:', error);
            return { hasSubmitted: false, week };
        }

        return {
            hasSubmitted: (data && data.length > 0),
            week
        };
    }

    /**
     * Get count of rejected items that need revision
     */
    async getRejectedItemsCount(unitName: string): Promise<number> {
        const { data: unitData } = await supabase
            .from('work_units')
            .select('id')
            .eq('name', unitName)
            .single();

        if (!unitData) return 0;

        const { count, error } = await supabase
            .from('weekly_realizations')
            .select('id, monthly_targets!inner(unit_id)', { count: 'exact', head: true })
            .eq('status', 'rejected')
            .eq('monthly_targets.unit_id', unitData.id);

        if (error) {
            console.error('Error fetching rejected count:', error);
            return 0;
        }

        return count || 0;
    }

    /**
     * Calculate monthly achievement percentage
     * (Sum of approved weekly realizations / Monthly Target) * 100
     */
    async getMonthlyAchievementPercentage(
        unitName: string,
        month: number,
        year: number
    ): Promise<{ percentage: number; approvedCount: number; totalTargets: number }> {
        const { data: unitData } = await supabase
            .from('work_units')
            .select('id')
            .eq('name', unitName)
            .single();

        if (!unitData) {
            return { percentage: 0, approvedCount: 0, totalTargets: 0 };
        }

        // Get all monthly targets for this period
        const { data: targets } = await supabase
            .from('monthly_targets')
            .select('id, target_value, indicator_name')
            .eq('unit_id', unitData.id)
            .eq('month', month)
            .eq('year', year);

        if (!targets || targets.length === 0) {
            return { percentage: 0, approvedCount: 0, totalTargets: 0 };
        }

        const targetIds = targets.map(t => t.id);

        // Get approved weekly realizations
        const { data: realizations } = await supabase
            .from('weekly_realizations')
            .select('monthly_target_id, realization_value')
            .in('monthly_target_id', targetIds)
            .eq('status', 'approved');

        if (!realizations || realizations.length === 0) {
            return { percentage: 0, approvedCount: 0, totalTargets: targets.length };
        }

        // Calculate total realization per indicator (sum across weeks)
        const realizationMap = new Map<string, number>();
        realizations.forEach(r => {
            const current = realizationMap.get(r.monthly_target_id) || 0;
            realizationMap.set(r.monthly_target_id, current + (r.realization_value || 0));
        });

        // Calculate achievement percentage per indicator, then average
        let totalPercentage = 0;
        let indicatorCount = 0;

        targets.forEach(target => {
            const totalRealization = realizationMap.get(target.id) || 0;
            if (target.target_value > 0) {
                const achievementPercent = (totalRealization / target.target_value) * 100;
                totalPercentage += Math.min(achievementPercent, 100); // Cap at 100%
                indicatorCount++;
            }
        });

        const averagePercentage = indicatorCount > 0 ? totalPercentage / indicatorCount : 0;

        return {
            percentage: Math.round(averagePercentage * 10) / 10, // Round to 1 decimal
            approvedCount: realizationMap.size,
            totalTargets: targets.length
        };
    }

    /**
     * Get total count of approved reports for the year (YTD)
     */
    async getYTDApprovedCount(unitName: string, year: number): Promise<number> {
        const { data: unitData } = await supabase
            .from('work_units')
            .select('id')
            .eq('name', unitName)
            .single();

        if (!unitData) return 0;

        // Get all monthly targets for this year
        const { data: targets } = await supabase
            .from('monthly_targets')
            .select('id')
            .eq('unit_id', unitData.id)
            .eq('year', year);

        if (!targets || targets.length === 0) return 0;

        const targetIds = targets.map(t => t.id);

        // Count approved weekly realizations
        const { count, error } = await supabase
            .from('weekly_realizations')
            .select('id', { count: 'exact', head: true })
            .in('monthly_target_id', targetIds)
            .eq('status', 'approved');

        if (error) {
            console.error('Error fetching YTD count:', error);
            return 0;
        }

        return count || 0;
    }

    /**
     * Get weekly performance trend data for the current month
     */
    async getWeeklyPerformanceTrend(
        unitName: string,
        month: number,
        year: number
    ): Promise<Array<{ week: number; percentage: number; label: string }>> {
        const { data: unitData } = await supabase
            .from('work_units')
            .select('id')
            .eq('name', unitName)
            .single();

        if (!unitData) return [];

        // Get monthly targets
        const { data: targets } = await supabase
            .from('monthly_targets')
            .select('id, target_value')
            .eq('unit_id', unitData.id)
            .eq('month', month)
            .eq('year', year);

        if (!targets || targets.length === 0) return [];

        const targetIds = targets.map(t => t.id);

        // Get all weekly realizations for this month
        const { data: realizations } = await supabase
            .from('weekly_realizations')
            .select('monthly_target_id, week, realization_value, status')
            .in('monthly_target_id', targetIds)
            .eq('status', 'approved');

        if (!realizations || realizations.length === 0) return [];

        // Group by week and calculate average achievement
        const weeklyData = new Map<number, { totalPercent: number; count: number }>();

        realizations.forEach(r => {
            const target = targets.find(t => t.id === r.monthly_target_id);
            if (target && target.target_value > 0) {
                const percent = (r.realization_value / target.target_value) * 100;
                const current = weeklyData.get(r.week) || { totalPercent: 0, count: 0 };
                weeklyData.set(r.week, {
                    totalPercent: current.totalPercent + percent,
                    count: current.count + 1
                });
            }
        });

        // Convert to array format for chart
        const result: Array<{ week: number; percentage: number; label: string }> = [];
        for (let week = 1; week <= 5; week++) {
            const data = weeklyData.get(week);
            const avgPercent = data ? data.totalPercent / data.count : 0;
            result.push({
                week,
                percentage: Math.round(avgPercent * 10) / 10,
                label: `Minggu ${week}`
            });
        }

        return result;
    }

    /**
     * Get indicators with lowest achievement percentages
     */
    async getLowestIndicators(
        unitName: string,
        month: number,
        year: number,
        limit: number = 5
    ): Promise<Array<{ indicatorName: string; achievementPercentage: number }>> {
        const { data: unitData } = await supabase
            .from('work_units')
            .select('id')
            .eq('name', unitName)
            .single();

        if (!unitData) return [];

        // Get monthly targets
        const { data: targets } = await supabase
            .from('monthly_targets')
            .select('id, indicator_name, target_value')
            .eq('unit_id', unitData.id)
            .eq('month', month)
            .eq('year', year);

        if (!targets || targets.length === 0) return [];

        const targetIds = targets.map(t => t.id);

        // Get approved realizations
        const { data: realizations } = await supabase
            .from('weekly_realizations')
            .select('monthly_target_id, realization_value')
            .in('monthly_target_id', targetIds)
            .eq('status', 'approved');

        // Calculate achievement per indicator
        const indicatorAchievements: Array<{ indicatorName: string; achievementPercentage: number }> = [];

        targets.forEach(target => {
            const targetRealizations = realizations?.filter(r => r.monthly_target_id === target.id) || [];
            const totalRealization = targetRealizations.reduce((sum, r) => sum + (r.realization_value || 0), 0);
            const achievementPercent = target.target_value > 0
                ? (totalRealization / target.target_value) * 100
                : 0;

            indicatorAchievements.push({
                indicatorName: target.indicator_name,
                achievementPercentage: Math.round(achievementPercent * 10) / 10
            });
        });

        // Sort by lowest percentage and take top N
        return indicatorAchievements
            .sort((a, b) => a.achievementPercentage - b.achievementPercentage)
            .slice(0, limit);
    }
}

export const pegawaiDashboardService = new PegawaiDashboardService();
