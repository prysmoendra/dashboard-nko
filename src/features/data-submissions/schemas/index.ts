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
