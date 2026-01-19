import React from 'react';
import { Edit, Trash2, Mail, Shield, Building2, Briefcase } from 'lucide-react';
import { User } from '../types';

interface UserCardProps {
    user: User;
    onEdit: (user: User) => void;
    onDelete?: (user: User) => void;
}

export function UserCard({ user, onEdit, onDelete }: UserCardProps) {
    return (
        <div className="border border-gray-200 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {user.initial}
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 text-lg">{user.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {user.email}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${user.roleColor}`}>
                            <Shield className="w-3 h-3 mr-1" /> {user.role}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-white text-gray-700 border border-gray-300">
                            <Building2 className="w-3 h-3 mr-1" /> {user.unit}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                            <Briefcase className="w-3 h-3 mr-1" /> {user.bidang}
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto justify-end">
                <button
                    onClick={() => onEdit(user)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    <Edit className="w-4 h-4" /> Edit
                </button>
                {onDelete && (
                    <button
                        onClick={() => onDelete(user)}
                        className="flex items-center gap-2 px-3 py-2 border border-red-100 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
