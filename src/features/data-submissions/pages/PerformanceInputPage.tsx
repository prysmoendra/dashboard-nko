'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Target, Info, ChevronLeft, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Header } from '@/shared/components/layout/header';
import { performanceService } from '../api/performance.service';
import type { PerformanceInputRow, PerformancePeriod } from '../types/performance-input.types';
import { getWeekNumber, isWeekInFuture } from '@/shared/utils/date.utils';

// Month options for dropdown
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

// Week options
const WEEKS = [
    { value: 1, label: 'Week 1' },
    { value: 2, label: 'Week 2' },
    { value: 3, label: 'Week 3' },
    { value: 4, label: 'Week 4' },
];

// Generate year options (current year ± 2 years)
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

export function PerformanceInputPage() {
    const router = useRouter();

    // State
    const [period, setPeriod] = useState<PerformancePeriod>({
        month: new Date().getMonth() + 1,
        year: currentYear,
        week: getWeekNumber(new Date()),
    });
    const [unitName] = useState<string>('ULP Cimahi Kota'); // TODO: Get from user session
    const [rows, setRows] = useState<PerformanceInputRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);

    // Fetch targets when period changes
    const handleFetchTargets = async () => {
        if (!period.month || !period.year) {
            toast.error('Periode belum lengkap', {
                description: 'Silakan pilih bulan dan tahun terlebih dahulu.',
            });
            return;
        }

        setRows([]); // Clear old data first
        setLoading(true);
        try {
            const targets = await performanceService.getMonthlyTargets(
                period.month,
                period.year,
                period.week,
                unitName
            );

            const inputRows: PerformanceInputRow[] = targets.map(target => ({
                targetId: target.id,
                indicatorName: target.indicator_name,
                divisionName: target.division_name,
                targetValue: target.target_value,
                weight: target.weight,
                realization: target.realization_value ?? null,
                approvalStatus: target.approval_status || 'draft',
                rejectionReason: target.rejection_reason,
                // targetId is already defined above at line 72, removing duplicate
            }));

            setRows(inputRows);
            setDataLoaded(true);

            if (inputRows.length === 0) {
                toast.warning('Tidak ada data target', {
                    description: 'Tidak ada target untuk periode yang dipilih.',
                });
            }
        } catch (error) {
            console.error('Error fetching targets:', error);
            toast.error('Gagal memuat data target', {
                description: 'Silakan coba lagi atau hubungi administrator.',
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle realization input change
    const handleRealizationChange = (index: number, value: string) => {
        const newRows = [...rows];
        const numValue = value === '' ? 0 : parseFloat(value);
        newRows[index].realization = numValue;
        setRows(newRows);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all realizations are filled
        const emptyRealizations = rows.filter(r => r.realization === null || r.realization === undefined);
        if (emptyRealizations.length > 0) {
            toast.error('Data belum lengkap', {
                description: `${emptyRealizations.length} indikator belum diisi realisasinya.`,
            });
            return;
        }

        setSubmitting(true);
        try {
            await performanceService.submitPerformanceRealization({
                period,
                unitName,
                realizations: rows.map(r => ({
                    targetId: r.targetId,
                    indicatorName: r.indicatorName,
                    divisionName: r.divisionName,
                    target: r.targetValue,
                    weight: r.weight,
                    realization: r.realization!,
                })),
            });

            toast.success('Data berhasil disubmit!', {
                description: 'Realisasi kinerja telah dikirim untuk review.',
            });
            // Refresh data to show updated status
            handleFetchTargets();
        } catch (error) {
            console.error('Error submitting performance:', error);
            toast.error('Gagal menyimpan data', {
                description: 'Silakan coba lagi.',
            });
        } finally {
            setSubmitting(false);
        }
    };

    // Check if form is locked (pending or approved)
    const hasRejectedRows = rows.some(r => r.approvalStatus === 'rejected');
    const hasPendingRows = rows.some(r => r.approvalStatus === 'pending_review');
    const hasApprovedRows = rows.some(r => r.approvalStatus === 'approved');
    const isFormLocked = hasPendingRows || hasApprovedRows;
    const canSubmit = !isFormLocked && rows.length > 0;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* <Header /> */}

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
                    <h1 className="text-3xl font-bold text-gray-900">Input Realisasi Kinerja Mingguan</h1>
                    <p className="text-gray-500 mt-1">Catat realisasi kinerja NKO untuk periode mingguan</p>
                </div>

                {/* Section A: Context Header (Filters) */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
                    <div className="flex items-start gap-4 pb-4 border-b border-gray-100 mb-6">
                        <div className="p-3 bg-blue-50 rounded-xl shrink-0">
                            <Calendar className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Filter Periode</h2>
                            <p className="text-sm text-gray-500">Pilih bulan, tahun, dan minggu untuk memuat data target</p>
                        </div>
                    </div>

                    {/* Filter Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* Month Selector */}
                        <div className="space-y-1.5">
                            <label htmlFor="month" className="block text-sm font-medium text-gray-700">
                                Bulan <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="month"
                                value={period.month}
                                onChange={(e) => setPeriod({ ...period, month: parseInt(e.target.value) })}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all text-gray-700"
                            >
                                {MONTHS.map(m => (
                                    <option key={m.value} value={m.value}>{m.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Year Selector */}
                        <div className="space-y-1.5">
                            <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                                Tahun <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="year"
                                value={period.year}
                                onChange={(e) => setPeriod({ ...period, year: parseInt(e.target.value) })}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all text-gray-700"
                            >
                                {YEARS.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>

                        {/* Week Selector */}
                        <div className="space-y-1.5">
                            <label htmlFor="week" className="block text-sm font-medium text-gray-700">
                                Minggu <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="week"
                                value={period.week}
                                onChange={(e) => setPeriod({ ...period, week: parseInt(e.target.value) })}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all text-gray-700"
                            >
                                {WEEKS.map(w => (
                                    <option
                                        key={w.value}
                                        value={w.value}
                                        disabled={isWeekInFuture(w.value, period.month, period.year)}
                                    >
                                        {w.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Unit Name (Read-Only) */}
                    <div className="space-y-1.5 mb-6">
                        <label htmlFor="unitName" className="block text-sm font-medium text-gray-700">
                            Nama Unit
                        </label>
                        <input
                            type="text"
                            id="unitName"
                            value={unitName}
                            readOnly
                            disabled
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                    </div>

                    {/* Load Data Button */}
                    <button
                        type="button"
                        onClick={handleFetchTargets}
                        disabled={loading}
                        className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Memuat Data...' : 'Muat Data Target'}
                    </button>
                </div>

                {/* Section B: Performance Input Form */}
                {dataLoaded && rows.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <form onSubmit={handleSubmit}>
                            {/* Form Content */}
                            <div className="p-6 sm:p-8 space-y-6">
                                {/* Header Form Internal */}
                                <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                                    <div className="p-3 bg-green-50 rounded-xl shrink-0">
                                        <Target className="w-6 h-6 text-green-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-800">Input Realisasi Kinerja</h2>
                                        <p className="text-sm text-gray-500">Isi nilai realisasi untuk setiap indikator</p>
                                    </div>
                                </div>

                                {/* Info Box */}
                                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <span className="text-xs text-gray-500 block mb-1">Periode:</span>
                                        <span className="font-semibold text-gray-900">
                                            {MONTHS.find(m => m.value === period.month)?.label} {period.year} - Minggu {period.week}
                                        </span>
                                    </div>
                                    <div className="sm:text-right">
                                        <span className="text-xs text-gray-500 block mb-1">Unit:</span>
                                        <span className="font-semibold text-gray-900">{unitName}</span>
                                    </div>
                                </div>

                                {/* Rejection Reason Alert */}
                                {hasRejectedRows && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-red-900 text-sm mb-1">Data Ditolak oleh Askbid</h3>
                                                {rows.filter(r => r.rejectionReason).map((row, idx) => (
                                                    <div key={idx} className="text-sm text-red-700 mt-2">
                                                        <span className="font-medium">{row.indicatorName}:</span> {row.rejectionReason}
                                                    </div>
                                                ))}
                                                <p className="text-sm text-red-700 mt-2">Silakan perbaiki data dan submit ulang.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Pending Approval Alert */}
                                {hasPendingRows && (
                                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <Clock className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-orange-900 text-sm mb-1">Menunggu Persetujuan</h3>
                                                <p className="text-sm text-orange-700">Data sedang dalam proses review oleh Askbid. Anda tidak dapat mengubah data saat ini.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Approved Alert */}
                                {hasApprovedRows && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-green-900 text-sm mb-1">Data Disetujui</h3>
                                                <p className="text-sm text-green-700">Data realisasi Anda telah disetujui oleh Askbid.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Performance Table - Desktop */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Indikator</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Divisi</th>
                                                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Target</th>
                                                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Bobot</th>
                                                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Realisasi <span className="text-red-500">*</span></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows.map((row, index) => (
                                                <tr key={row.targetId} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4 text-sm text-gray-900">{row.indicatorName}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">{row.divisionName}</td>
                                                    <td className="py-3 px-4 text-center">
                                                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded">
                                                            {row.targetValue.toFixed(2)}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded">
                                                            {row.weight}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            value={row.realization ?? ''}
                                                            onChange={(e) => handleRealizationChange(index, e.target.value)}
                                                            placeholder="0.0"
                                                            required
                                                            disabled={isFormLocked}
                                                            className={`w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 text-center text-gray-900 ${isFormLocked ? 'bg-gray-100 cursor-not-allowed' : ''
                                                                }`}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Performance Cards - Mobile */}
                                <div className="md:hidden space-y-4">
                                    {rows.map((row, index) => (
                                        <div key={row.targetId} className="border border-gray-200 rounded-lg p-4 space-y-3">
                                            <div>
                                                <div className="text-xs text-gray-500 mb-1">Indikator</div>
                                                <div className="font-semibold text-gray-900">{row.indicatorName}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 mb-1">Divisi</div>
                                                <div className="text-sm text-gray-700">{row.divisionName}</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <div className="text-xs text-gray-500 mb-1">Target</div>
                                                    <div className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded inline-block">
                                                        {row.targetValue.toFixed(2)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500 mb-1">Bobot</div>
                                                    <div className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded inline-block">
                                                        {row.weight}
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    Realisasi <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={row.realization ?? ''}
                                                    onChange={(e) => handleRealizationChange(index, e.target.value)}
                                                    placeholder="0.0"
                                                    required
                                                    disabled={isFormLocked}
                                                    className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 text-gray-900 ${isFormLocked ? 'bg-gray-100 cursor-not-allowed' : ''
                                                        }`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Form Footer */}
                            <div className="p-6 bg-gray-50 border-t border-gray-200">
                                <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <Info className="w-5 h-5 text-gray-400 shrink-0" />
                                        <p className="text-sm text-gray-600">Data akan disimpan ke sistem NKO</p>
                                    </div>
                                    <div className="flex gap-3 w-full sm:w-auto">
                                        <Link
                                            href="/dashboard/pegawai"
                                            className="w-full sm:w-auto text-center py-3 px-6 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-gray-200"
                                        >
                                            Batal
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={submitting || isFormLocked}
                                            className={`w-full sm:w-auto text-center py-3 px-6 font-semibold rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${isFormLocked
                                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                                : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
                                                }`}
                                        >
                                            {submitting
                                                ? 'Menyimpan...'
                                                : isFormLocked
                                                    ? (hasPendingRows ? 'Menunggu Persetujuan' : 'Data Disetujui')
                                                    : 'Submit untuk Review'
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                {/* Empty State */}
                {dataLoaded && rows.length === 0 && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Target className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak Ada Data Target</h3>
                        <p className="text-gray-500">Tidak ada target yang ditemukan untuk periode yang dipilih.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
