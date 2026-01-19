/**
 * ReportModal Component
 * Modal for submitting completion reports
 */

"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ReportModalProps {
    isOpen: boolean;
    instructionTitle: string;
    onClose: () => void;
    onSubmit: (reportText: string) => void;
    isSubmitting?: boolean;
}

export function ReportModal({
    isOpen,
    instructionTitle,
    onClose,
    onSubmit,
    isSubmitting = false,
}: ReportModalProps) {
    const [reportText, setReportText] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!reportText.trim()) {
            setError('Laporan tidak boleh kosong');
            return;
        }

        if (reportText.trim().length < 50) {
            setError('Laporan minimal 50 karakter');
            return;
        }

        setError('');
        onSubmit(reportText.trim());
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setReportText('');
            setError('');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity w-full h-full"
                onClick={handleClose}
            />

            {/* Modal Container */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={handleClose}>
                <div className="relative w-full max-w-lg rounded-lg bg-white shadow-xl my-8" onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Lapor Selesai
                        </h2>
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <form onSubmit={handleSubmit}>
                        <div className="px-6 py-4 space-y-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">
                                    Instruksi:
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                    {instructionTitle}
                                </p>
                            </div>

                            <div>
                                <label htmlFor="report-text" className="block text-sm font-medium text-gray-700 mb-2">
                                    Laporan Penyelesaian
                                </label>
                                <textarea
                                    id="report-text"
                                    rows={6}
                                    value={reportText}
                                    onChange={(e) => {
                                        setReportText(e.target.value);
                                        setError('');
                                    }}
                                    disabled={isSubmitting}
                                    placeholder="Jelaskan tindakan yang telah dilakukan dan hasil yang dicapai..."
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-100 disabled:text-gray-500"
                                />
                                {error && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {error}
                                    </p>
                                )}
                                <p className="mt-2 text-xs text-gray-500">
                                    Minimal 10 karakter
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={isSubmitting}
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Mengirim...' : 'Kirim Laporan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
