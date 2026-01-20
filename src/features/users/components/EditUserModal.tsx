import React, { useState, useEffect } from 'react';
import { X, Edit, Shield } from 'lucide-react';
import { UserFormFields } from './UserFormFields';
import { User } from '../types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUserSchema, type UpdateUserFormData } from '../schemas/user-schema';
import { toast } from 'sonner';

interface EditUserModalProps {
    isOpen: boolean;
    user: User | null;
    onClose: () => void;
    onSuccess?: () => void;
}

export function EditUserModal({ isOpen, user, onClose, onSuccess }: EditUserModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<UpdateUserFormData>({
        resolver: zodResolver(updateUserSchema),
    });

    // Pre-fill form data when user prop changes
    useEffect(() => {
        if (user) {
            // Reset all fields first
            reset({
                name: user.name,
                email: user.email,
                roleName: user.role_name as any, // Use role_name (enum value) not role (display name)
                workUnit: user.unit,
                division: user.bidang || '',
            });

            // Explicitly set roleName to ensure select dropdown updates
            // This is crucial for select components to display the correct value
            setValue('roleName', user.role_name as any, {
                shouldValidate: true,
                shouldDirty: false
            });
        }
    }, [user, reset, setValue]);

    const onSubmit = async (data: UpdateUserFormData) => {
        setIsSubmitting(true);

        try {
            // TODO: Implement actual update user service call
            console.log('[EditUserModal] Updating user:', { userId: user?.id, data });

            toast.success('User berhasil diperbarui!', {
                description: `Data ${data.name} telah diperbarui.`,
            });

            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('[EditUserModal] Error updating user:', error);
            toast.error('Gagal memperbarui user', {
                description: error instanceof Error ? error.message : 'Terjadi kesalahan',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            reset();
            onClose();
        }
    };

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-50 p-2 rounded-lg">
                            <Edit className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Edit User</h2>
                            <p className="text-xs text-gray-500">Perbarui informasi pengguna...</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="p-6">
                        <UserFormFields register={register} errors={errors} isEditMode={true} />

                        {/* Info Box */}
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                            <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-blue-700 mb-1">Informasi Penting:</h4>
                                <ul className="text-xs text-blue-600 space-y-1 list-disc list-inside">
                                    <li>Perubahan data akan langsung diterapkan</li>
                                    <li>User akan menerima notifikasi jika email diubah</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    <Edit className="w-4 h-4" /> Simpan Perubahan
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
