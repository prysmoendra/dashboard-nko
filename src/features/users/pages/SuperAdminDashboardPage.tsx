"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, UserPlus, Zap } from 'lucide-react';
import Link from 'next/link';
import { StatsCard } from '@/shared/components/ui/StatsCard';
import { SearchBar } from '@/shared/components/ui/SearchBar';
import { UserCard } from '@/features/users/components/UserCard';
import { AddUserModal } from '@/features/users/components/AddUserModal';
import { EditUserModal } from '@/features/users/components/EditUserModal';
import { User } from '@/features/users/types';
import { getAllUsers, type UserWithRole } from '@/features/users/services/user.service';
import { toast } from 'sonner';

/**
 * SuperAdminDashboardPage - Main dashboard for Super Admin role
 * Part of users feature (manages user accounts and permissions)
 */
export function SuperAdminDashboardPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch users on mount
    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setIsLoading(true);
        try {
            const data = await getAllUsers();

            // Transform UserWithRole to User format
            const transformedUsers: User[] = data.map((user, index) => ({
                id: parseInt(user.id) || index,
                name: user.name,
                email: user.email,
                initial: getInitials(user.name),
                role: getRoleDisplayName(user.role_name), // Display name
                role_name: user.role_name, // Preserve original enum value
                roleColor: getRoleColor(user.role_name),
                unit: user.work_unit,
                bidang: user.division || '-',
            }));

            setUsers(transformedUsers);
        } catch (error) {
            console.error('[SuperAdminDashboard] Error loading users:', error);
            toast.error('Gagal memuat data pengguna', {
                description: error instanceof Error ? error.message : 'Terjadi kesalahan',
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Helper function to get initials from name
    const getInitials = (name: string): string => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Helper function to get role display name
    const getRoleDisplayName = (roleName: string): string => {
        const roleMap: Record<string, string> = {
            'pegawai': 'Pegawai',
            'asisten': 'Askabid',
            'kepala-bidang': 'Kabid',
            'super-admin': 'Super Admin',
        };
        return roleMap[roleName] || roleName;
    };

    // Helper function to get role color
    const getRoleColor = (roleName: string): string => {
        const colorMap: Record<string, string> = {
            'pegawai': 'bg-blue-50 text-blue-600 border-blue-100',
            'asisten': 'bg-purple-50 text-purple-600 border-purple-100',
            'kepala-bidang': 'bg-green-50 text-green-600 border-green-100',
            'super-admin': 'bg-red-50 text-red-600 border-red-100',
        };
        return colorMap[roleName] || 'bg-gray-50 text-gray-600 border-gray-100';
    };

    // Calculate stats
    const stats = [
        {
            label: "Total Users",
            value: users.length,
            icon: Users,
            color: "text-blue-600"
        },
        {
            label: "Pegawai",
            value: users.filter(u => u.role === 'Pegawai').length
        },
        {
            label: "Askabid",
            value: users.filter(u => u.role === 'Askabid').length
        },
        {
            label: "Kabid",
            value: users.filter(u => u.role === 'Kabid').length
        },
        {
            label: "Admin",
            value: users.filter(u => u.role === 'Super Admin').length,
            highlight: "text-red-600"
        },
    ];

    // Filter users based on search term (with safe null checks)
    const filteredUsers = users.filter(user => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (user.name?.toLowerCase() || '').includes(searchLower) ||
            (user.email?.toLowerCase() || '').includes(searchLower) ||
            (user.unit?.toLowerCase() || '').includes(searchLower)
        );
    });

    const handleEditClick = (user: User) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleAddClick = () => {
        setIsAddModalOpen(true);
    };

    const handleModalSuccess = () => {
        loadUsers(); // Refresh user list
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Main Container with Proper Padding */}
            <div className="container mx-auto px-6 py-8 max-w-7xl">
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
                        Tambah User Baru
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
                        <p className="text-sm text-gray-500">
                            {filteredUsers.length} pengguna dari {users.length} total
                        </p>
                    </div>
                    <div className="p-6 space-y-4">
                        {isLoading ? (
                            <div className="text-center py-12">
                                <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                <p className="mt-4 text-gray-500">Memuat data pengguna...</p>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="text-center py-12">
                                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">
                                    {searchTerm ? 'Tidak ada pengguna yang cocok dengan pencarian' : 'Belum ada pengguna'}
                                </p>
                            </div>
                        ) : (
                            filteredUsers.map((user) => (
                                <UserCard
                                    key={user.id}
                                    user={user}
                                    onEdit={handleEditClick}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Modals */}
                <AddUserModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSuccess={handleModalSuccess}
                />

                <EditUserModal
                    isOpen={isEditModalOpen}
                    user={selectedUser}
                    onClose={() => setIsEditModalOpen(false)}
                />
            </div>
        </div>
    );
}
