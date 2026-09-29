'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
        AlertDialog,
        AlertDialogAction,
        AlertDialogCancel,
        AlertDialogContent,
        AlertDialogDescription,
        AlertDialogFooter,
        AlertDialogHeader,
        AlertDialogTitle,
    } from '@/components/ui/alert-dialog';
import Link from 'next/link';
import { Wrench, ChevronLeft, AlertCircle, Calendar } from 'lucide-react';
import { performanceService } from '../api/performance.service';
import type { MonthlyTarget } from '../types/performance-input.types';

const MONTHS = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' },
];

export function RejectedDataMaintenancePage() {
    const [unitName] = useState<string>('ULP Cimahi Kota'); // TODO: Get from user session
    const [rejectedTargets, setRejectedTargets] = useState<MonthlyTarget[]>([]);
    const [loading, setLoading] = useState(false);
    const [updatedValues, setUpdatedValues] = useState<{ [key: string]: number }>({});
    const [submitting, setSubmitting] = useState<{ [key: string]: boolean }>({});
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [pendingTargetId, setPendingTargetId] = useState<string | null>(null);

    // Fetch rejected targets
    const fetchRejectedTargets = async () => {
        setLoading(true);
        try {
            const data = await performanceService.getRejectedTargets(unitName);
            setRejectedTargets(data);

            // Initialize updated values with current realization values
            const initialValues: { [key: string]: number } = {};
            data.forEach(target => {
                if (target.realization_value !== null && target.realization_value !== undefined) {
                    initialValues[target.id] = target.realization_value;
                }
            });
            setUpdatedValues(initialValues);
        } catch (error) {
            console.error('Error fetching rejected targets:', error);
            toast.error('Gagal memuat data yang ditolak. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchRejectedTargets();
    }, []);

    // Handle value change
    const handleValueChange = (targetId: string, value: string) => {
        const numValue = value === '' ? 0 : parseFloat(value);
        setUpdatedValues(prev => ({
            ...prev,
            [targetId]: numValue
        }));
    };

    // Handle resubmit - open confirmation dialog
    const handleResubmit = (targetId: string) => {
        const newValue = updatedValues[targetId];

        if (newValue === null || newValue === undefined) {
            toast.error('Silakan masukkan nilai realisasi terlebih dahulu');
            return;
        }

        setPendingTargetId(targetId);
        setConfirmDialogOpen(true);
    };

    // Confirm resubmit from dialog
    const handleConfirmResubmit = async () => {
        if (!pendingTargetId) return;

        const newValue = updatedValues[pendingTargetId];
        setConfirmDialogOpen(false);
        setSubmitting(prev => ({ ...prev, [pendingTargetId]: true }));

        try {
            await performanceService.resubmitRejectedTarget(pendingTargetId, newValue);
            toast.success('Data berhasil dikirim ulang untuk review!');
            // Refresh the list
            fetchRejectedTargets();
        } catch (error) {
            console.error('Error resubmitting:', error);
            toast.error('Gagal mengirim ulang data. Silakan coba lagi.');
        } finally {
            setSubmitting(prev => ({ ...prev, [pendingTargetId]: false }));
            setPendingTargetId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <Link
                        href="/dashboard/pegawai"
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-4"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Kembali ke Dashboard
                    </Link>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-red-50 rounded-xl">
                            <Wrench className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Perbaikan Data Ditolak</h1>
                            <p className="text-gray-500 mt-1">Perbaiki dan kirim ulang data yang ditolak oleh Askbid</p>
                        </div>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-blue-900 text-sm mb-1">Informasi</h3>
                            <p className="text-sm text-blue-700">
                                Data di bawah ini telah ditolak oleh Askbid. Silakan perbaiki nilai realisasi sesuai dengan
                                alasan penolakan, kemudian kirim ulang untuk direview.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex h-64 items-center justify-center rounded-xl border border-gray-200 bg-white">
                        <p className="text-gray-500">Memuat data...</p>
                    </div>
                ) : rejectedTargets.length === 0 ? (
                    <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                            <Wrench className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak Ada Data Ditolak</h3>
                        <p className="text-gray-500">Semua data realisasi Anda telah disetujui atau masih dalam proses review.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {rejectedTargets.map((target) => (
                            <div key={target.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                {/* Card Header */}
                                <div className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100 px-6 py-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-900 mb-1">{target.indicator_name}</h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {MONTHS.find(m => m.value === target.month)?.label} {target.year}
                                                </span>
                                                <span>•</span>
                                                <span>{target.division_name}</span>
                                            </div>
                                        </div>
                                        <div className="shrink-0">
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                                Ditolak
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-6 space-y-4">
                                    {/* Rejection Reason Alert */}
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-red-900 text-sm mb-1">Alasan Penolakan:</h4>
                                                <p className="text-sm text-red-700">{target.rejection_reason || 'Tidak ada alasan yang diberikan'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Target and Realization */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Target
                                            </label>
                                            <div className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium">
                                                {target.target_value.toFixed(2)}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Bobot
                                            </label>
                                            <div className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium">
                                                {target.weight}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Realisasi (Perbaiki) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={updatedValues[target.id] ?? ''}
                                                onChange={(e) => handleValueChange(target.id, e.target.value)}
                                                placeholder="0.0"
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-gray-900"
                                                disabled={submitting[target.id]}
                                            />
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="flex justify-end pt-2">
                                        <button
                                            onClick={() => handleResubmit(target.id)}
                                            disabled={submitting[target.id]}
                                            className="px-6 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {submitting[target.id] ? 'Mengirim...' : 'Kirim Ulang untuk Review'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Confirmation Dialog */}
            <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Pengiriman Ulang</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin mengirim ulang data ini untuk direview? Data akan ditinjau kembali oleh Askbid.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmResubmit} className="bg-red-600 hover:bg-red-700">Kirim Ulang</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
