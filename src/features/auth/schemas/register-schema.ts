import { z } from 'zod';

/**
 * Registration form validation schema
 */
export const registerSchema = z.object({
    name: z
        .string()
        .min(3, 'Nama minimal 3 karakter')
        .max(100, 'Nama maksimal 100 karakter'),
    email: z
        .string()
        .min(1, 'Email harus diisi')
        .email('Format email tidak valid')
        .refine((email) => email.endsWith('@pln.co.id'), {
            message: 'Email harus menggunakan domain @pln.co.id',
        }),
    password: z
        .string()
        .min(6, 'Password minimal 6 karakter')
        .max(50, 'Password maksimal 50 karakter'),
    confirmPassword: z
        .string()
        .min(1, 'Konfirmasi password harus diisi'),
    roleName: z.enum(['pegawai', 'asisten', 'kepala-bidang', 'super-admin'], {
        message: 'Pilih salah satu role',
    }),
    workUnit: z
        .string()
        .min(1, 'Unit kerja harus dipilih'),
    division: z
        .string()
        .min(1, 'Bidang harus dipilih'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak sama',
    path: ['confirmPassword'],
});

/**
 * Inferred TypeScript type from Zod schema
 */
export type RegisterFormData = z.infer<typeof registerSchema>;
