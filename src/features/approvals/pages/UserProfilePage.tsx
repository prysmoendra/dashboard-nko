"use client";

import React from 'react';
import { ChevronLeft, Mail, Building, Briefcase, Shield, Calendar, LayoutDashboard, User } from 'lucide-react';
import Link from 'next/link';

export function UserProfilePage() {
    return (
        <div className="space-y-6 pb-10 max-w-5xl mx-auto">
            <div>
                <Link href="/dashboard/asisten" className="mb-6 mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                    <ChevronLeft className="h-4 w-4" /> Kembali ke Dashboard
                </Link>
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center text-white"><User className="h-5 w-5" /></div>
                    <h1 className="text-2xl font-bold text-gray-900">Profil Pengguna</h1>
                </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-blue-600 text-3xl sm:text-4xl font-semibold text-white ring-4 ring-blue-50">E</div>
                    <div className="space-y-2">
                        <div><h2 className="text-2xl font-bold text-gray-900">Emo</h2><p className="text-gray-500">emo@pln.co.id</p></div>
                        <div className="flex flex-wrap gap-2">
                            <Badge color="blue" icon={<Shield className="h-3 w-3" />} text="Asisten Kepala Bidang" />
                            <Badge color="green" icon={<Building className="h-3 w-3" />} text="UP3 Cimahi" />
                            <Badge color="purple" icon={<Briefcase className="h-3 w-3" />} text="Bidang Distribusi" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="mb-6 border-b border-gray-100 pb-4"><h3 className="text-lg font-semibold text-gray-900">Informasi Akun</h3><p className="text-sm text-gray-500">Informasi detail tentang akun Anda</p></div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <ReadOnlyInput label="Nama Lengkap" value="Emo" />
                    <ReadOnlyInput label="Email" value="emo@pln.co.id" icon={<Mail className="h-4 w-4" />} />
                    <ReadOnlyInput label="Unit Kerja" value="UP3 Cimahi" icon={<Building className="h-4 w-4" />} />
                    <ReadOnlyInput label="Bidang" value="Distribusi" icon={<Building className="h-4 w-4" />} />
                    <div className="md:col-span-2"><ReadOnlyInput label="Role/Jabatan" value="Asisten Kepala Bidang" icon={<Shield className="h-4 w-4" />} /></div>
                </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="mb-6 border-b border-gray-100 pb-4"><h3 className="text-lg font-semibold text-gray-900">Informasi Sistem</h3><p className="text-sm text-gray-500">Informasi terkait akses sistem</p></div>
                <div className="space-y-6">
                    <SystemInfoItem icon={<Calendar className="h-5 w-5 text-gray-400" />} label="Akun Dibuat" value="19 November 2025" />
                    <div className="border-b border-gray-100"></div>
                    <SystemInfoItem icon={<Shield className="h-5 w-5 text-gray-400" />} label="Level Akses" value="Standard User" />
                    <div className="border-b border-gray-100"></div>
                    <SystemInfoItem icon={<LayoutDashboard className="h-5 w-5 text-gray-400" />} label="Total Dashboard Akses" value="8 Dashboard" />
                </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/dashboard/asisten" className="flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">Kembali ke Dashboard</Link>
                <button type="button" className="flex items-center justify-center rounded-lg border border-red-200 bg-white px-6 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors" onClick={() => alert("Fitur logout akan diimplementasikan nanti.")}>Keluar</button>
            </div>
        </div>
    );
}

function Badge({ color, icon, text }: any) {
    const colorClasses = { blue: 'bg-blue-50 text-blue-700 ring-blue-700/10', green: 'bg-green-50 text-green-700 ring-green-600/20', purple: 'bg-purple-50 text-purple-700 ring-purple-700/10' };
    // @ts-ignore
    return <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${colorClasses[color]}`}>{icon}{text}</span>;
}
function ReadOnlyInput({ label, value, icon }: any) {
    return <div className="space-y-1.5"><label className="text-sm font-medium text-gray-700">{label}</label><div className="relative">{icon && <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">{icon}</div>}<input type="text" readOnly value={value} className={`block w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 text-gray-600 focus:ring-0 sm:text-sm ${icon ? 'pl-10' : 'pl-3'}`} /></div></div>;
}
function SystemInfoItem({ icon, label, value }: any) {
    return <div className="flex items-start gap-4"><div className="mt-1">{icon}</div><div><p className="text-sm font-medium text-gray-900">{label}</p><p className="text-sm text-gray-500">{value}</p></div></div>;
}
