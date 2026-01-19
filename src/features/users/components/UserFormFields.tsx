import React from 'react';
import { User, Mail, Shield, Building2, Briefcase } from 'lucide-react';

interface UserFormFieldsProps {
    defaultValues?: {
        name?: string;
        email?: string;
        role?: string;
        unit?: string;
        bidang?: string;
    };
}

export function UserFormFields({ defaultValues }: UserFormFieldsProps) {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                        <User className="w-3.5 h-3.5" /> Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        defaultValue={defaultValues?.name}
                        placeholder="Contoh: Ahmad Fadillah"
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" /> Email PLN <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        defaultValue={defaultValues?.email}
                        placeholder="nama@pln.co.id"
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5" /> Role / Jabatan <span className="text-red-500">*</span>
                    </label>
                    <select
                        defaultValue={defaultValues?.role || ""}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                    >
                        <option value="">Pilih role pengguna</option>
                        <option value="Super Admin">Super Admin</option>
                        <option value="Kepala Bidang">Kepala Bidang</option>
                        <option value="Pegawai">Pegawai</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" /> Unit Kerja <span className="text-red-500">*</span>
                    </label>
                    <select
                        defaultValue={defaultValues?.unit || ""}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                    >
                        <option value="">Pilih unit kerja</option>
                        <option value="UP3 Cimahi">UP3 Cimahi</option>
                        <option value="ULP Ciko">ULP Ciko</option>
                    </select>
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" /> Bidang <span className="text-red-500">*</span>
                </label>
                <select
                    defaultValue={defaultValues?.bidang || ""}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                >
                    <option value="">Pilih bidang</option>
                    <option value="Distribusi">Distribusi</option>
                    <option value="Konstruksi">Konstruksi</option>
                </select>
            </div>
        </>
    );
}
