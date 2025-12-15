import { z } from 'zod';

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email harus diisi')
        .email('Format email tidak valid'),
    password: z
        .string()
        .min(6, 'Password minimal 6 karakter'),
});

/**
 * Inferred TypeScript type from Zod schema
 */
export type LoginFormData = z.infer<typeof loginSchema>;
