"use client";

import React from 'react';
import { toast } from "sonner";
import {
    ChevronLeft, Mail, Building, Briefcase, Shield, Calendar,
    LayoutDashboard, User, LogOut
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { authService } from '@/features/auth/services/auth.service';

interface UserProfile {
    id: string;
    name: string;
    email: string;
    role?: string;
    unit: string;
    bidang: string;
    jabatanLengkap?: string;
    joinDate?: string;
    accessLevel?: string;
    totalDashboards?: string | number;
}

interface SharedProfilePageProps {
    user: UserProfile;
    roleLabel: string;
    backUrl: string;
}

export default function SharedProfilePage({
    user,
    roleLabel,
    backUrl
}: SharedProfilePageProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    // Logout State
    const [showLogoutModal, setShowLogoutModal] = React.useState(false);
    const [isLoggingOut, setIsLoggingOut] = React.useState(false);

    // Profile State
    const [fullName, setFullName] = React.useState(user.name);

    // Password State
    const [passwordForm, setPasswordForm] = React.useState({
        newPassword: '',
        confirmPassword: ''
    });

    // Update local state when user prop changes (e.g. initial load)
    React.useEffect(() => {
        setFullName(user.name);
    }, [user.name]);

    const confirmLogout = async () => {
        setIsLoggingOut(true);
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/auth/login');
        } catch (error) {
            console.error('Logout failed', error);
            // Even if api fails, we should redirect to login
            router.push('/auth/login');
        } finally {
            // No need to set false if redirecting, but good for safety
            setIsLoggingOut(false);
            setShowLogoutModal(false);
        }
    };

    const handleSaveProfile = async () => {
        setIsLoading(true);
        try {
            await authService.updateProfile(user.id, { full_name: fullName });
            toast.success('Profil berhasil diperbarui!');
            setIsEditing(false);
            window.location.reload(); // Force refresh to update Header session data
        } catch (error) {
            console.error(error);
            toast.error('Gagal memperbarui profil.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
            toast.error('Mohon isi kedua kolom password.');
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('Konfirmasi password tidak cocok.');
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            toast.error('Password minimal 6 karakter.');
            return;
        }

        setIsLoading(true);
        try {
            await authService.updatePassword(passwordForm.newPassword);
            toast.success('Password berhasil diubah!');
            setPasswordForm({ newPassword: '', confirmPassword: '' });
        } catch (error) {
            console.error(error);
            toast.error('Gagal mengubah password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 pb-10 max-w-5xl mx-auto">
            {/* Top Navigation */}
            <div>
                <Link
                    href={backUrl}
                    className="mb-6 mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" /> Kembali ke Dashboard
                </Link>
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center text-white">
                        <User className="h-5 w-5" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Profil Pengguna</h1>
                </div>
            </div>

            {/* Header Card (Avatar & Badges) */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    {/* Avatar */}
                    <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-blue-600 text-3xl sm:text-4xl font-semibold text-white ring-4 ring-blue-50 shrink-0">
                        {fullName.charAt(0).toUpperCase()}
                    </div>

                    <div className="space-y-2">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{fullName}</h2>
                            <p className="text-gray-500">{user.email}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Badge
                                color="blue"
                                icon={<Shield className="h-3 w-3" />}
                                text={roleLabel}
                            />
                            <Badge
                                color="green"
                                icon={<Building className="h-3 w-3" />}
                                text={user.unit}
                            />
                            <Badge
                                color="purple"
                                icon={<Briefcase className="h-3 w-3" />}
                                text={user.bidang}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Info Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="mb-6 border-b border-gray-100 pb-4 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Informasi Akun</h3>
                        <p className="text-sm text-gray-500">Informasi detail tentang akun Anda</p>
                    </div>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                        {isEditing ? 'Batal Edit' : 'Edit Profil'}
                    </button>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                <User className="h-4 w-4" />
                            </div>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                disabled={!isEditing}
                                className={`block w-full rounded-lg border bg-white py-2.5 pl-10 text-gray-900 focus:ring-2 focus:ring-blue-500 sm:text-sm ${isEditing ? 'border-blue-300' : 'border-gray-200 bg-gray-50 text-gray-600'
                                    }`}
                            />
                        </div>
                    </div>

                    <ReadOnlyInput
                        label="Email"
                        value={user.email}
                        icon={<Mail className="h-4 w-4" />}
                    />
                    <ReadOnlyInput
                        label="Unit Kerja"
                        value={user.unit}
                        icon={<Building className="h-4 w-4" />}
                    />
                    <ReadOnlyInput
                        label="Bidang"
                        value={user.bidang}
                        icon={<Building className="h-4 w-4" />}
                    />
                    <div className="md:col-span-2">
                        <ReadOnlyInput
                            label="Role/Jabatan"
                            value={roleLabel}
                            icon={<Shield className="h-4 w-4" />}
                        />
                    </div>
                </div>

                {isEditing && (
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleSaveProfile}
                            disabled={isLoading}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                )}
            </div>

            {/* Security Card (NEW) */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="mb-6 border-b border-gray-100 pb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Keamanan Akun</h3>
                    <p className="text-sm text-gray-500">Perbarui kata sandi Anda</p>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Password Baru</label>
                        <input
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                            className="block w-full rounded-lg border border-gray-200 py-2.5 px-3 text-gray-900 focus:ring-2 focus:ring-blue-500 sm:text-sm"
                            placeholder="Minimal 6 karakter"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Konfirmasi Password</label>
                        <input
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="block w-full rounded-lg border border-gray-200 py-2.5 px-3 text-gray-900 focus:ring-2 focus:ring-blue-500 sm:text-sm"
                            placeholder="Ulangi password baru"
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleChangePassword}
                        disabled={isLoading || !passwordForm.newPassword}
                        className="border border-blue-200 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Memproses...' : 'Ganti Password'}
                    </button>
                </div>
            </div>

            {/* System Info Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="mb-6 border-b border-gray-100 pb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Informasi Sistem</h3>
                    <p className="text-sm text-gray-500">Informasi terkait akses sistem</p>
                </div>
                <div className="space-y-6">
                    <SystemInfoItem
                        icon={<Calendar className="h-5 w-5 text-gray-400" />}
                        label="Akun Dibuat"
                        value={user.joinDate || "-"}
                    />
                    <div className="border-b border-gray-100"></div>
                    <SystemInfoItem
                        icon={<Shield className="h-5 w-5 text-gray-400" />}
                        label="Level Akses"
                        value={user.accessLevel || "Standard User"}
                    />
                    <div className="border-b border-gray-100"></div>
                    <SystemInfoItem
                        icon={<LayoutDashboard className="h-5 w-5 text-gray-400" />}
                        label="Total Dashboard Akses"
                        value={`${user.totalDashboards || 0} Dashboard`}
                    />
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                    href={backUrl}
                    className="flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                    Kembali ke Dashboard
                </Link>
                <button
                    type="button"
                    onClick={() => setShowLogoutModal(true)}
                    className="flex items-center justify-center rounded-lg border border-red-200 bg-white px-6 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                    Keluar
                </button>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 scale-100 animate-in zoom-in-95 duration-200">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <LogOut className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Konfirmasi Keluar</h3>
                            <p className="text-sm text-gray-500 mt-2">
                                Apakah Anda yakin ingin keluar dari aplikasi? Anda harus login kembali untuk mengakses dashboard.
                            </p>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmLogout}
                                disabled={isLoggingOut}
                                className="flex-1 px-4 py-2 bg-red-600 rounded-lg text-white font-medium hover:bg-red-700 transition-colors flex justify-center items-center gap-2"
                            >
                                {isLoggingOut ? 'Keluar...' : 'Ya, Keluar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper Components

function Badge({ color, icon, text }: { color: 'blue' | 'green' | 'purple', icon: React.ReactNode, text: string }) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-700 ring-blue-700/10',
        green: 'bg-green-50 text-green-700 ring-green-600/20',
        purple: 'bg-purple-50 text-purple-700 ring-purple-700/10'
    };

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${colorClasses[color]}`}>
            {icon}
            {text}
        </span>
    );
}

function ReadOnlyInput({ label, value, icon }: { label: string, value: string, icon?: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <div className="relative">
                {icon && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        {icon}
                    </div>
                )}
                <input
                    type="text"
                    readOnly
                    value={value}
                    className={`block w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 text-gray-600 focus:ring-0 sm:text-sm ${icon ? 'pl-10' : 'pl-3'}`}
                />
            </div>
        </div>
    );
}

function SystemInfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="flex items-start gap-4">
            <div className="mt-1">{icon}</div>
            <div>
                <p className="text-sm font-medium text-gray-900">{label}</p>
                <p className="text-sm text-gray-500">{value}</p>
            </div>
        </div>
    );
}
