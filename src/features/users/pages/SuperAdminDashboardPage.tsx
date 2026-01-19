"use client";

import React from 'react';
import { ArrowLeft, Users, UserPlus, Zap } from 'lucide-react';
import Link from 'next/link';
import { StatsCard } from '@/shared/components/ui/StatsCard';
import { SearchBar } from '@/shared/components/ui/SearchBar';
import { useState } from 'react';
import { UserCard } from '@/features/users/components/UserCard';
import { AddUserModal } from '@/features/users/components/AddUserModal';
import { EditUserModal } from '@/features/users/components/EditUserModal';
import { User } from '@/features/users/types';

/**
 * SuperAdminDashboardPage - Main dashboard for Super Admin role
 * Part of users feature (manages user accounts and permissions)
 */
export function SuperAdminDashboardPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Mock data
    const users: User[] = [
        {
            id: 1,
            name: "Admin PLN",
            email: "admin@pln.co.id",
            initial: "AP",
            role: "Super Admin",
            roleColor: "bg-red-50 text-red-600 border-red-100",
            unit: "UP3 Cimahi",
            bidang: "Distribusi",
        },
    ];

    const stats = [
        { label: "Total Users", value: 1, icon: Users, color: "text-blue-600" },
        { label: "Pegawai", value: 0 },
        { label: "Askabid", value: 0 },
        { label: "Kabid", value: 0 },
        { label: "Admin", value: 1, highlight: "text-red-600" },
    ];

    const handleEditClick = (user: User) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleAddClick = () => {
        setIsAddModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans relative">
            {/* Navigation */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="#" className="flex items-center text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                </Link>
                <div className="h-6 w-px bg-gray-300"></div>
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 p-1 rounded-md">
                        <Zap className="w-3 h-3 text-white" fill="currentColor" />
                    </div>
                    <span className="font-bold text-gray-900 text-sm">Super Admin</span>
                </div>
            </div>

            {/* Header & Add Button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
                    <p className="text-gray-500">Kelola akses dan role pengguna PLN Dashboard Suite</p>
                </div>
                <button
                    onClick={handleAddClick}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                    <UserPlus className="w-4 h-4" />
                    Tambah User
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {stats.map((stat, idx) => (
                    <StatsCard
                        key={idx}
                        label={stat.label}
                        value={stat.value}
                        icon={stat.icon}
                        highlight={stat.highlight}
                        variant="compact"
                    />
                ))}
            </div>

            {/* Search Bar */}
            <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Cari nama, email, atau unit..."
            />

            {/* User Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-white">
                    <h3 className="text-lg font-bold text-gray-900">Daftar Pengguna</h3>
                    <p className="text-sm text-gray-500">{users.length} pengguna dari {users.length} total</p>
                </div>
                <div className="p-6 space-y-4">
                    {users.map((user) => (
                        <UserCard
                            key={user.id}
                            user={user}
                            onEdit={handleEditClick}
                        />
                    ))}
                </div>
            </div>

            {/* Modals */}
            <AddUserModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            <EditUserModal
                isOpen={isEditModalOpen}
                user={selectedUser}
                onClose={() => setIsEditModalOpen(false)}
            />
        </div>
    );
}
