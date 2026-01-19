import React from 'react';
import { X, Edit, Shield } from 'lucide-react';
import { UserFormFields } from './UserFormFields';
import { User } from '../types';

interface EditUserModalProps {
    isOpen: boolean;
    user: User | null;
    onClose: () => void;
    onSubmit?: () => void;
}

export function EditUserModal({ isOpen, user, onClose, onSubmit }: EditUserModalProps) {
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
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <UserFormFields
                        defaultValues={{
                            name: user.name,
                            email: user.email,
                            role: user.role,
                            unit: user.unit,
                            bidang: user.bidang,
                        }}
                    />

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
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onSubmit}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm"
                    >
                        <Edit className="w-4 h-4" /> Simpan Perubahan
                    </button>
                </div>
            </div>
        </div>
    );
}
