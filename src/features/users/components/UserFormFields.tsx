import React from 'react';
import { User, Mail, Shield, Building2, Briefcase, Lock } from 'lucide-react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { CreateUserFormData, UpdateUserFormData } from '../schemas/user-schema';

interface UserFormFieldsProps {
    register: UseFormRegister<any>;
    errors: FieldErrors<any>;
    isEditMode?: boolean;
}

const ROLES = [
    { value: 'pegawai', label: 'Pegawai - Staff operasional' },
    { value: 'asisten', label: 'Asisten Kepala Bidang - Supervisor' },
    { value: 'kepala-bidang', label: 'Kepala Bidang - Manager' },
    { value: 'super-admin', label: 'Super Admin - Full system access' },
];

const WORK_UNITS = [
    'UP3 Cimahi',
    'ULP CIKO',
    'ULP Cimindi',
    'ULP Padalarang',
    'Gudang Central',
    'Unit Jaringan',
    'Unit Pembangkit',
    'Unit Maintenance',
];

const DIVISIONS = [
    'Distribusi',
    'Jaringan',
    'Pembangkit',
    'Logistik',
    'Maintenance',
];

/**
 * UserFormFields - Reusable form fields for user creation/editing
 * Integrates with react-hook-form for validation
 */
export function UserFormFields({ register, errors, isEditMode = false }: UserFormFieldsProps) {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Name Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                        <User className="w-3.5 h-3.5" /> Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        {...register('name')}
                        placeholder="Contoh: Ahmad Fadillah"
                        className={`w-full p-2.5 bg-gray-50 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-200'
                            }`}
                    />
                    {errors.name && (
                        <p className="mt-1 text-xs text-red-600">{String(errors.name?.message || '')}</p>
                    )}
                </div>

                {/* Email Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" /> Email PLN <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        {...register('email')}
                        placeholder="nama@pln.co.id"
                        className={`w-full p-2.5 bg-gray-50 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-200'
                            }`}
                    />
                    {errors.email && (
                        <p className="mt-1 text-xs text-red-600">{String(errors.email?.message || '')}</p>
                    )}
                </div>

                {/* Password Field - Only show in create mode */}
                {!isEditMode && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5" /> Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            {...register('password')}
                            placeholder="Minimal 6 karakter"
                            className={`w-full p-2.5 bg-gray-50 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-200'
                                }`}
                        />
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-600">{String(errors.password?.message || '')}</p>
                        )}
                    </div>
                )}

                {/* Role Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5" /> Role / Jabatan <span className="text-red-500">*</span>
                    </label>
                    <select
                        {...register('roleName')}
                        className={`w-full p-2.5 bg-gray-50 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 ${errors.roleName ? 'border-red-500' : 'border-gray-200'
                            }`}
                    >
                        <option value="">Pilih role pengguna</option>
                        {ROLES.map((role) => (
                            <option key={role.value} value={role.value}>
                                {role.label}
                            </option>
                        ))}
                    </select>
                    {errors.roleName && (
                        <p className="mt-1 text-xs text-red-600">{String(errors.roleName?.message || '')}</p>
                    )}
                </div>

                {/* Work Unit Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" /> Unit Kerja <span className="text-red-500">*</span>
                    </label>
                    <select
                        {...register('workUnit')}
                        className={`w-full p-2.5 bg-gray-50 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 ${errors.workUnit ? 'border-red-500' : 'border-gray-200'
                            }`}
                    >
                        <option value="">Pilih unit kerja</option>
                        {WORK_UNITS.map((unit) => (
                            <option key={unit} value={unit}>
                                {unit}
                            </option>
                        ))}
                    </select>
                    {errors.workUnit && (
                        <p className="mt-1 text-xs text-red-600">{String(errors.workUnit?.message || '')}</p>
                    )}
                </div>
            </div>

            {/* Division Field */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" /> Bidang
                </label>
                <select
                    {...register('division')}
                    className={`w-full p-2.5 bg-gray-50 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 ${errors.division ? 'border-red-500' : 'border-gray-200'
                        }`}
                >
                    <option value="">Pilih bidang (opsional)</option>
                    {DIVISIONS.map((division) => (
                        <option key={division} value={division}>
                            {division}
                        </option>
                    ))}
                </select>
                {errors.division && (
                    <p className="mt-1 text-xs text-red-600">{String(errors.division?.message || '')}</p>
                )}
            </div>
        </>
    );
}
