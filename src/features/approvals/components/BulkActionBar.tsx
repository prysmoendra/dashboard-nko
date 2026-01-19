'use client';

import React from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface BulkActionBarProps {
    selectedCount: number;
    onApproveAll: () => void;
    onRejectAll: () => void;
    onClear: () => void;
    loading?: boolean;
}

export function BulkActionBar({
    selectedCount,
    onApproveAll,
    onRejectAll,
    onClear,
    loading = false
}: BulkActionBarProps) {
    if (selectedCount === 0) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom duration-300">
            <div className="bg-white rounded-full shadow-2xl border border-gray-200 px-6 py-4 flex items-center gap-6">
                {/* Selected Count */}
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-900">
                        {selectedCount} item terpilih
                    </span>
                    <button
                        onClick={onClear}
                        disabled={loading}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                        title="Clear selection"
                    >
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                {/* Divider */}
                <div className="h-8 w-px bg-gray-300" />

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onApproveAll}
                        disabled={loading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CheckCircle className="w-4 h-4" />
                        Setujui Semua ({selectedCount})
                    </button>
                    <button
                        onClick={onRejectAll}
                        disabled={loading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <XCircle className="w-4 h-4" />
                        Tolak Semua ({selectedCount})
                    </button>
                </div>
            </div>
        </div>
    );
}
