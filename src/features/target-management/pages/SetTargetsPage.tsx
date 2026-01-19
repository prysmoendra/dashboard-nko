'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Calendar, Plus, Trash2, Save, AlertCircle, CheckCircle } from 'lucide-react';
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
import { targetManagementService } from '../api/target-management.service';
import { DIVISIONS, INDICATORS_BY_DIVISION, type TargetInputRow, type TargetPeriod, type Division } from '../types/target-input.types';

// Month options
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

// Generate year options
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

// Helper to generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Create empty row
const createEmptyRow = (): TargetInputRow => ({
    id: generateId(),
    divisionName: 'JAR',
    indicatorName: '',
    unitMeasurement: '',
    targetValue: null,
    weight: null,
});

export function SetTargetsPage() {
    // State
    const [period, setPeriod] = useState<TargetPeriod>({
        month: new Date().getMonth() + 1,
        year: currentYear,
    });
    const [unitName] = useState<string>('ULP Cimahi Kota'); // TODO: Get from user session
    const [rows, setRows] = useState<TargetInputRow[]>([createEmptyRow()]);
    const [submitting, setSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
    const [showOverwriteDialog, setShowOverwriteDialog] = useState(false);
    const [pendingSubmit, setPendingSubmit] = useState(false);

    // Add new row
    const handleAddRow = () => {
        setRows([...rows, createEmptyRow()]);
    };

    // Delete row
    const handleDeleteRow = (id: string) => {
        if (rows.length === 1) {
            toast.error('Minimal harus ada satu baris target', {
                description: 'Tambahkan baris baru sebelum menghapus.',
            });
            return;
        }
        setRows(rows.filter(row => row.id !== id));
    };

    // Update row field
    const handleUpdateRow = (id: string, field: keyof TargetInputRow, value: any) => {
        setRows(rows.map(row =>
            row.id === id ? { ...row, [field]: value } : row
        ));
    };

    // Handle division change - reset indicator and related fields
    const handleDivisionChange = (id: string, newDivision: Division) => {
        setRows(rows.map(row =>
            row.id === id ? {
                ...row,
                divisionName: newDivision,
                indicatorName: '',
                unitMeasurement: '',
                weight: null,
            } : row
        ));
    };

    // Handle indicator change - auto-fill unit and weight
    const handleIndicatorChange = (id: string, indicatorName: string, division: Division) => {
        // Find the indicator definition to get default unit and weight
        const indicator = INDICATORS_BY_DIVISION[division].find(ind => ind.name === indicatorName);

        setRows(rows.map(row =>
            row.id === id ? {
                ...row,
                indicatorName,
                unitMeasurement: indicator?.unit || '',
                weight: indicator?.weight || null,
            } : row
        ));
    };

    // Calculate total weight
    const totalWeight = rows.reduce((sum, row) => sum + (row.weight || 0), 0);

    // Handle submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate
        const validation = targetManagementService.validateTargets(rows);
        setValidationErrors(validation.errors);
        setValidationWarnings(validation.warnings);

        if (!validation.isValid) {
            return;
        }

        // Check if overwriting
        const hasExisting = await targetManagementService.checkExistingTargets(period, unitName);
        if (hasExisting) {
            setPendingSubmit(true);
            setShowOverwriteDialog(true);
        } else {
            await submitTargets();
        }
    };

    // Submit targets
    const submitTargets = async () => {
        setSubmitting(true);
        try {
            await targetManagementService.submitMonthlyTargets(period, unitName, rows);
            toast.success('Target berhasil disimpan!', {
                description: `Target untuk ${MONTHS.find(m => m.value === period.month)?.label} ${period.year} telah tersimpan.`,
            });

            // Reset form
            setRows([createEmptyRow()]);
            setValidationErrors([]);
            setValidationWarnings([]);
            setShowOverwriteDialog(false);
            setPendingSubmit(false);
        } catch (error) {
            console.error('Error submitting targets:', error);
            toast.error('Gagal menyimpan target', {
                description: 'Silakan coba lagi atau hubungi administrator.',
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <Link
                        href="/dashboard/kabid"
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-4"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Kembali ke Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Input Target Bulanan</h1>
                    <p className="text-gray-500 mt-1">Tetapkan target NKO untuk setiap indikator kinerja</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Period Selector */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
                        <div className="flex items-start gap-4 pb-4 border-b border-gray-100 mb-6">
                            <div className="p-3 bg-blue-50 rounded-xl shrink-0">
                                <Calendar className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">Periode Target</h2>
                                <p className="text-sm text-gray-500">Pilih bulan dan tahun untuk target</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Month */}
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

                            {/* Year */}
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

                            {/* Unit Name */}
                            <div className="space-y-1.5">
                                <label htmlFor="unitName" className="block text-sm font-medium text-gray-700">
                                    Unit Kerja
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
                        </div>
                    </div>

                    {/* Validation Messages */}
                    {validationErrors.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-red-900 mb-2">Error Validasi</h3>
                                    <ul className="list-disc list-inside space-y-1">
                                        {validationErrors.map((error, i) => (
                                            <li key={i} className="text-sm text-red-700">{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {validationWarnings.length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-yellow-900 mb-2">Perhatian</h3>
                                    <ul className="list-disc list-inside space-y-1">
                                        {validationWarnings.map((warning, i) => (
                                            <li key={i} className="text-sm text-yellow-700">{warning}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Target Input Table */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800">Daftar Target</h2>
                                    <p className="text-sm text-gray-500">Tambahkan indikator dan target kinerja</p>
                                </div>
                                <div className="text-sm">
                                    <span className="text-gray-500">Total Bobot: </span>
                                    <span className={`font-bold ${totalWeight > 100 ? 'text-red-600' : totalWeight === 100 ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {totalWeight.toFixed(1)}%
                                    </span>
                                </div>
                            </div>

                            {/* Desktop Table */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700 w-32">Divisi</th>
                                            <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Nama Indikator</th>
                                            <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700 w-32">Satuan</th>
                                            <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700 w-32">Target</th>
                                            <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700 w-24">Bobot (%)</th>
                                            <th className="text-center py-3 px-2 text-sm font-semibold text-gray-700 w-16">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row) => (
                                            <tr key={row.id} className="border-b border-gray-100">
                                                <td className="py-3 px-2">
                                                    <select
                                                        value={row.divisionName}
                                                        onChange={(e) => handleDivisionChange(row.id, e.target.value as Division)}
                                                        className="w-full px-2 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-gray-900"
                                                        required
                                                    >
                                                        {DIVISIONS.map(div => (
                                                            <option key={div} value={div}>{div}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="py-3 px-2">
                                                    <select
                                                        value={row.indicatorName}
                                                        onChange={(e) => handleIndicatorChange(row.id, e.target.value, row.divisionName)}
                                                        className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-gray-900"
                                                        required
                                                    >
                                                        <option value="">Pilih Indikator</option>
                                                        {INDICATORS_BY_DIVISION[row.divisionName].map(indicator => (
                                                            <option key={indicator.name} value={indicator.name}>{indicator.name}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="py-3 px-2">
                                                    <input
                                                        type="text"
                                                        value={row.unitMeasurement}
                                                        onChange={(e) => handleUpdateRow(row.id, 'unitMeasurement', e.target.value)}
                                                        placeholder="Menit/Plg"
                                                        className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                                                        required
                                                    />
                                                </td>
                                                <td className="py-3 px-2">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={row.targetValue ?? ''}
                                                        onChange={(e) => handleUpdateRow(row.id, 'targetValue', e.target.value ? parseFloat(e.target.value) : null)}
                                                        placeholder="0.0"
                                                        className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                                                        required
                                                    />
                                                </td>
                                                <td className="py-3 px-2">
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        min="0"
                                                        max="100"
                                                        value={row.weight ?? ''}
                                                        onChange={(e) => handleUpdateRow(row.id, 'weight', e.target.value ? parseFloat(e.target.value) : null)}
                                                        placeholder="0.0"
                                                        className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-gray-900 placeholder:text-gray-400"
                                                        required
                                                    />
                                                </td>
                                                <td className="py-3 px-2 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteRow(row.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                        title="Hapus baris"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="lg:hidden space-y-4">
                                {rows.map((row, index) => (
                                    <div key={row.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-semibold text-gray-700">Target #{index + 1}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteRow(row.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Divisi</label>
                                                <select
                                                    value={row.divisionName}
                                                    onChange={(e) => handleDivisionChange(row.id, e.target.value as Division)}
                                                    className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm text-gray-900"
                                                    required
                                                >
                                                    {DIVISIONS.map(div => (
                                                        <option key={div} value={div}>{div}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Nama Indikator</label>
                                                <select
                                                    value={row.indicatorName}
                                                    onChange={(e) => handleIndicatorChange(row.id, e.target.value, row.divisionName)}
                                                    className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm text-gray-900"
                                                    required
                                                >
                                                    <option value="">Pilih Indikator</option>
                                                    {INDICATORS_BY_DIVISION[row.divisionName].map(indicator => (
                                                        <option key={indicator.name} value={indicator.name}>{indicator.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2">
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">Satuan</label>
                                                    <input
                                                        type="text"
                                                        value={row.unitMeasurement}
                                                        onChange={(e) => handleUpdateRow(row.id, 'unitMeasurement', e.target.value)}
                                                        className="w-full px-2 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 placeholder:text-gray-400"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">Target</label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={row.targetValue ?? ''}
                                                        onChange={(e) => handleUpdateRow(row.id, 'targetValue', e.target.value ? parseFloat(e.target.value) : null)}
                                                        className="w-full px-2 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 placeholder:text-gray-400"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">Bobot (%)</label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={row.weight ?? ''}
                                                        onChange={(e) => handleUpdateRow(row.id, 'weight', e.target.value ? parseFloat(e.target.value) : null)}
                                                        className="w-full px-2 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 placeholder:text-gray-400"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add Row Button */}
                            <button
                                type="button"
                                onClick={handleAddRow}
                                className="mt-4 w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 text-gray-600 font-medium rounded-lg hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                            >
                                <Plus className="w-5 h-5" />
                                Tambah Baris
                            </button>
                        </div>

                        {/* Form Footer */}
                        <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-gray-400" />
                                <p className="text-sm text-gray-600">Data akan disimpan ke sistem NKO</p>
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-5 h-5" />
                                {submitting ? 'Menyimpan...' : 'Simpan Target'}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Overwrite Confirmation Dialog */}
                <AlertDialog open={showOverwriteDialog} onOpenChange={setShowOverwriteDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Target Sudah Ada</AlertDialogTitle>
                            <AlertDialogDescription>
                                Target untuk <span className="font-semibold">{MONTHS.find(m => m.value === period.month)?.label} {period.year}</span> sudah ada. Apakah Anda ingin mengganti target yang sudah ada?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => {
                                setPendingSubmit(false);
                                setSubmitting(false);
                            }}>
                                Batal
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={submitTargets}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Ya, Ganti Target
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </main>
        </div>
    );
}
