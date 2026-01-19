import { supabase } from '@/shared/lib/supabase';
import type {
    TargetInputRow,
    TargetSubmissionPayload,
    TargetValidationResult
} from '../types/target-input.types';

/**
 * TargetManagementService - Handle monthly target operations
 */
export class TargetManagementService {
    /**
     * Validate target input rows
     */
    validateTargets(rows: TargetInputRow[]): TargetValidationResult {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Check if there are any rows
        if (rows.length === 0) {
            errors.push('Harap tambahkan minimal satu target');
            return { isValid: false, errors, warnings };
        }

        // Validate each row
        rows.forEach((row, index) => {
            const rowNum = index + 1;

            if (!row.divisionName) {
                errors.push(`Baris ${rowNum}: Divisi harus diisi`);
            }

            if (!row.indicatorName.trim()) {
                errors.push(`Baris ${rowNum}: Nama indikator harus diisi`);
            }

            if (!row.unitMeasurement.trim()) {
                errors.push(`Baris ${rowNum}: Satuan harus diisi`);
            }

            if (row.targetValue === null || row.targetValue <= 0) {
                errors.push(`Baris ${rowNum}: Target harus lebih dari 0`);
            }

            if (row.weight === null || row.weight <= 0) {
                errors.push(`Baris ${rowNum}: Bobot harus lebih dari 0`);
            }
        });

        // Check for duplicate indicator names
        const indicatorNames = rows.map(r => r.indicatorName.toLowerCase().trim());
        const duplicates = indicatorNames.filter((name, idx) =>
            name && indicatorNames.indexOf(name) !== idx
        );

        if (duplicates.length > 0) {
            errors.push(`Nama indikator duplikat: ${[...new Set(duplicates)].join(', ')}`);
        }

        // Check total weight
        const totalWeight = rows.reduce((sum, row) => sum + (row.weight || 0), 0);

        if (totalWeight > 100) {
            warnings.push(`Total bobot (${totalWeight.toFixed(1)}%) melebihi 100%`);
        } else if (totalWeight < 100) {
            warnings.push(`Total bobot (${totalWeight.toFixed(1)}%) kurang dari 100%`);
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings,
        };
    }

    /**
     * Submit monthly targets to Supabase
     */
    async submitMonthlyTargets(
        period: { month: number; year: number },
        unitName: string,
        rows: TargetInputRow[]
    ): Promise<void> {
        try {
            // Step 1: Get unit_id from work_units table
            const { data: unitData, error: unitError } = await supabase
                .from('work_units')
                .select('id')
                .eq('name', unitName)
                .single();

            if (unitError || !unitData) {
                console.error('Error fetching work unit:', JSON.stringify(unitError, null, 2));
                throw new Error(`Gagal menemukan unit: ${unitName}`);
            }

            const unitId = unitData.id;

            // Step 2: Check if targets already exist for this period
            const { data: existingTargets, error: checkError } = await supabase
                .from('monthly_targets')
                .select('id')
                .eq('unit_id', unitId)
                .eq('month', period.month)
                .eq('year', period.year)
                .limit(1);

            if (checkError) {
                console.error('Error checking existing targets:', checkError);
                throw new Error('Gagal memeriksa target yang ada');
            }

            // Step 3: If targets exist, ask for confirmation (handled by UI)
            // For now, we'll delete existing targets and insert new ones
            if (existingTargets && existingTargets.length > 0) {
                const { error: deleteError } = await supabase
                    .from('monthly_targets')
                    .delete()
                    .eq('unit_id', unitId)
                    .eq('month', period.month)
                    .eq('year', period.year);

                if (deleteError) {
                    console.error('Error deleting existing targets:', deleteError);
                    throw new Error('Gagal menghapus target lama');
                }
            }

            // Step 4: Prepare payloads
            const payloads: TargetSubmissionPayload[] = rows.map(row => ({
                unit_id: unitId,
                month: period.month,
                year: period.year,
                division_name: row.divisionName,
                indicator_name: row.indicatorName,
                unit_measurement: row.unitMeasurement,
                target_value: row.targetValue!,
                weight: row.weight!,
            }));

            // Step 5: Bulk insert
            const { error: insertError } = await supabase
                .from('monthly_targets')
                .insert(payloads);

            if (insertError) {
                console.error('Error inserting targets:', JSON.stringify(insertError, null, 2));
                console.error('Payloads:', JSON.stringify(payloads, null, 2));
                throw new Error('Gagal menyimpan target. Silakan coba lagi.');
            }

            console.log(`Successfully inserted ${payloads.length} monthly targets`);
        } catch (error) {
            console.error('Error in submitMonthlyTargets:', error);
            throw error;
        }
    }

    /**
     * Check if targets exist for a period
     */
    async checkExistingTargets(
        period: { month: number; year: number },
        unitName: string
    ): Promise<boolean> {
        try {
            const { data: unitData, error: unitError } = await supabase
                .from('work_units')
                .select('id')
                .eq('name', unitName)
                .single();

            if (unitError || !unitData) {
                return false;
            }

            const { data, error } = await supabase
                .from('monthly_targets')
                .select('id')
                .eq('unit_id', unitData.id)
                .eq('month', period.month)
                .eq('year', period.year)
                .limit(1);

            if (error) {
                console.error('Error checking targets:', error);
                return false;
            }

            return (data && data.length > 0);
        } catch (error) {
            console.error('Error in checkExistingTargets:', error);
            return false;
        }
    }
}

// Export singleton
export const targetManagementService = new TargetManagementService();
