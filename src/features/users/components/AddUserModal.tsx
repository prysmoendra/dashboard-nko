import React from 'react';
import { X, UserPlus, Shield } from 'lucide-react';
import { UserFormFields } from './UserFormFields';

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: () => void;
}

export function AddUserModal({ isOpen, onClose, onSubmit }: AddUserModalProps) {
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
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <UserFormFields />

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                        <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-bold text-blue-700 mb-1">Informasi Penting:</h4>
                            <ul className="text-xs text-blue-600 space-y-1 list-disc list-inside">
                                <li>Email harus menggunakan domain @pln.co.id</li>
                                <li>Setiap role memiliki akses dan wewenang yang berbeda</li>
                                <li>User akan langsung aktif setelah ditambahkan</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onSubmit}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm"
                    >
                        <UserPlus className="w-4 h-4" /> Tambah User
                    </button>
                </div>
            </div>
        </div>
    );
}
