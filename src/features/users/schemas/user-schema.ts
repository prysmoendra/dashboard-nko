import { z } from 'zod';

/**
 * Validation schema for creating a new user
 */
export const createUserSchema = z.object({
    name: z.string()
        .min(3, 'Nama harus minimal 3 karakter')
        .max(100, 'Nama terlalu panjang'),

    email: z.string()
        .email('Format email tidak valid')
        .refine(
            (email) => email.endsWith('@pln.co.id'),
            'Email harus menggunakan domain @pln.co.id'
        ),

    password: z.string()
        .min(6, 'Password harus minimal 6 karakter')
        .max(100, 'Password terlalu panjang'),

    roleName: z.enum(['pegawai', 'asisten', 'kepala-bidang', 'super-admin'], {
        errorMap: () => ({ message: 'Pilih role yang valid' }),
    }),

    workUnit: z.string()
        .min(1, 'Unit kerja harus dipilih'),

    division: z.string().optional(),
});

/**
 * Validation schema for updating a user
 */
export const updateUserSchema = z.object({
    name: z.string()
        .min(3, 'Nama harus minimal 3 karakter')
        .max(100, 'Nama terlalu panjang')
        .optional(),

    email: z.string()
        .email('Format email tidak valid')
        .refine(
            (email) => email.endsWith('@pln.co.id'),
            'Email harus menggunakan domain @pln.co.id'
        )
        .optional(),

    roleName: z.enum(['pegawai', 'asisten', 'kepala-bidang', 'super-admin'])
        .optional(),

    workUnit: z.string().optional(),

    division: z.string().optional(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
