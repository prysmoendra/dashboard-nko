import { z } from 'zod';

/**
 * Validation schemas for data submissions
 */

export const createSubmissionSchema = z.object({
    type: z.enum(['gudang', 'gangguan', 'maintenance', 'log-aktivitas']),
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    data: z.record(z.string(), z.unknown()),
});

export const updateSubmissionSchema = z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    status: z.enum(['draft', 'submitted', 'approved', 'rejected']).optional(),
    data: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Performance Input Validation Schemas
 */

// Period selection schema
export const performancePeriodSchema = z.object({
    month: z.number().int().min(1).max(12),
    year: z.number().int().min(2020).max(2100),
    week: z.number().int().min(1).max(4),
});

// Single realization input schema
export const performanceRealizationSchema = z.object({
    indicatorName: z.string().min(1, 'Indicator name is required'),
    realization: z.number({
        message: 'Realization must be a valid number',
    }).nonnegative('Realization cannot be negative'),
});

// Bulk submission schema
export const bulkPerformanceSubmissionSchema = z.object({
    period: performancePeriodSchema,
    unitName: z.string().min(1, 'Unit name is required'),
    realizations: z.array(performanceRealizationSchema).min(1, 'At least one realization is required'),
});

