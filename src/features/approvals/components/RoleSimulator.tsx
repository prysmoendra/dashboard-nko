/**
 * RoleSimulator Component
 * Dropdown for simulating different Asman roles
 */

"use client";

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { AsmanRole, RoleSimulatorOption } from '../types';

interface RoleSimulatorProps {
    selectedRole: AsmanRole | null;
    onRoleChange: (role: AsmanRole | null) => void;
}

const ROLE_OPTIONS: RoleSimulatorOption[] = [
    { label: 'Asman Jaringan', value: 'Asman Jaringan' },
    { label: 'Asman Pemasaran', value: 'Asman Pemasaran' },
    { label: 'Asman TEL', value: 'Asman TEL' },
];

export function RoleSimulator({ selectedRole, onRoleChange }: RoleSimulatorProps) {
    return (
        <div className="flex items-center gap-3">
            <label htmlFor="role-simulator" className="text-sm font-medium text-gray-700">
                Lihat sebagai:
            </label>
            <div className="relative">
                <select
                    id="role-simulator"
                    value={selectedRole || ''}
                    onChange={(e) => onRoleChange(e.target.value as AsmanRole || null)}
                    className="appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    <option value="">Semua Role</option>
                    {ROLE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            </div>
        </div>
    );
}
