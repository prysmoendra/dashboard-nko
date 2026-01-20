import React, { useState } from 'react';
import { X, UserPlus, Shield } from 'lucide-react';
import { UserFormFields } from './UserFormFields';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserSchema, type CreateUserFormData } from '../schemas/user-schema';
import { createUser } from '../services/user.service';
import { toast } from 'sonner';

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function AddUserModal({ isOpen, onClose, onSuccess }: AddUserModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CreateUserFormData>({
        resolver: zodResolver(createUserSchema),
    });

    const onSubmit = async (data: CreateUserFormData) => {
        setIsSubmitting(true);

        try {
            await createUser(data);

            toast.success('User berhasil ditambahkan!', {
                description: `${data.name} telah ditambahkan ke sistem.`,
            });

            reset();
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('[AddUserModal] Error creating user:', error);
            toast.error('Gagal menambahkan user', {
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-lg text-white">
                            <UserPlus className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Tambah User Baru</h2>
                            <p className="text-xs text-gray-500">Masukkan detail pengguna baru...</p>
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
                        <UserFormFields register={register} errors={errors} isEditMode={false} />

                        {/* Info Box */}
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                            <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-blue-700 mb-1">Informasi Penting:</h4>
                                <ul className="text-xs text-blue-600 space-y-1 list-disc list-inside">
                                    <li>Email harus menggunakan domain @pln.co.id</li>
                                    <li>Password minimal 6 karakter</li>
                                    <li>Setiap role memiliki akses dan wewenang yang berbeda</li>
                                    <li>User akan langsung aktif setelah ditambahkan</li>
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
                                    <UserPlus className="w-4 h-4" /> Tambah User
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
