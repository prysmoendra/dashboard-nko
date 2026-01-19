'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Calendar, Activity, Zap } from 'lucide-react';
import { AIAnalysisModal } from '../components/AIAnalysisModal';
import { monitoringService } from '../api/monitoring.service';
import { aiPredictionService } from '../api/ai-prediction.service';
import type {
    MonitoringRow,
    MonitoringPeriod,
    AIPredictionResponse,
    AIAnalysisState
} from '../types/ai-monitoring.types';

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

export function MonitoringDashboardPage() {
    // State
    const [period, setPeriod] = useState<MonitoringPeriod>({
        month: new Date().getMonth() + 1,
        year: currentYear,
        week: 1,
    });
    const [unitName] = useState<string>('ULP Cimahi Kota'); // TODO: Get from user session
    const [rows, setRows] = useState<MonitoringRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // AI Analysis Modal State
    const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisState>({
        isOpen: false,
        loading: false,
        error: null,
        prediction: null,
        editedMessage: '',
        rowData: null,
    });

    // Fetch monitoring data
    const handleFetchData = async () => {
        if (!period.month || !period.year) {
            alert('Silakan pilih bulan dan tahun terlebih dahulu');
            return;
        }

        setLoading(true);
        try {
            const data = await monitoringService.getMonitoringData(
                period.month,
                period.year,
                period.week,
                unitName
            );

            setRows(data);
            setDataLoaded(true);

            if (data.length === 0) {
                alert('Tidak ada data monitoring untuk periode yang dipilih');
            }
        } catch (error) {
            console.error('Error fetching monitoring data:', error);
            alert('Gagal memuat data monitoring. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    // Handle AI Analysis click
    const handleAnalyzeClick = async (row: MonitoringRow) => {
        // Validate that realization exists
        if (row.realization === null || row.realization === undefined) {
            alert('Tidak ada data realisasi untuk indikator ini. AI hanya dapat menganalisa data yang sudah memiliki realisasi.');
            return;
        }

        // Open modal and set loading
        setAiAnalysis({
            isOpen: true,
            loading: true,
            error: null,
            prediction: null,
            editedMessage: '',
            rowData: row,
        });

        try {
            // Call AI API
            const prediction = await aiPredictionService.predictPerformance({
                month: row.month,
                year: row.year,
                week: row.week,
                indicator_name: row.indicatorName,
                target: row.targetValue,
                weight: row.weight,
                realization: row.realization,
                division_name: row.divisionName,
                unit_name: unitName,
            });

            // Update modal with prediction results
            setAiAnalysis(prev => ({
                ...prev,
                loading: false,
                prediction,
                editedMessage: prediction.wisdom_message,
            }));
        } catch (error) {
            console.error('Error getting AI prediction:', error);
            setAiAnalysis(prev => ({
                ...prev,
                loading: false,
                error: error instanceof Error ? error.message : 'Failed to get AI prediction',
            }));
        }
    };

    // Handle instruction submission
    const handleSubmitInstruction = async () => {
        if (!aiAnalysis.prediction || !aiAnalysis.rowData) return;

        setSubmitting(true);
        try {
            await monitoringService.submitActionPlan({
                indicator_name: aiAnalysis.rowData.indicatorName,
                week: aiAnalysis.rowData.week,
                month: aiAnalysis.rowData.month,
                year: aiAnalysis.rowData.year,
                ai_message: aiAnalysis.prediction.wisdom_message,
                final_instruction: aiAnalysis.editedMessage,
                assigned_role: aiAnalysis.prediction.assigned_role,
            });

            alert('Instruksi berhasil dikirim!');

            // Close modal
            setAiAnalysis({
                isOpen: false,
                loading: false,
                error: null,
                prediction: null,
                editedMessage: '',
                rowData: null,
            });
        } catch (error) {
            console.error('Error submitting instruction:', error);
            alert('Gagal mengirim instruksi. Silakan coba lagi.');
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
                    <h1 className="text-3xl font-bold text-gray-900">Monitoring Kinerja Tim</h1>
                    <p className="text-gray-500 mt-1">Monitor realisasi kinerja dan dapatkan insight dari AI</p>
                </div>

                {/* Filter Section */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
                    <div className="flex items-start gap-4 pb-4 border-b border-gray-100 mb-6">
                        <div className="p-3 bg-blue-50 rounded-xl shrink-0">
                            <Calendar className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Filter Periode</h2>
                            <p className="text-sm text-gray-500">Pilih bulan, tahun, dan minggu untuk melihat data monitoring</p>
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
                                    <option key={w.value} value={w.value}>{w.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Unit Name (Read-Only) */}
                    <div className="space-y-1.5 mb-6">
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

                    {/* Load Data Button */}
                    <button
                        type="button"
                        onClick={handleFetchData}
                        disabled={loading}
                        className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Memuat Data...' : 'Muat Data'}
                    </button>
                </div>

                {/* Monitoring Table */}
                {dataLoaded && rows.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6 sm:p-8 space-y-6">
                            {/* Header */}
                            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                                <div className="p-3 bg-green-50 rounded-xl shrink-0">
                                    <Activity className="w-6 h-6 text-green-500" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800">Data Monitoring Kinerja</h2>
                                    <p className="text-sm text-gray-500">Target dan realisasi kinerja tim</p>
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

                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Indikator</th>
                                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Target</th>
                                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Realisasi</th>
                                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Bobot</th>
                                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row) => (
                                            <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-4">
                                                    <div className="text-sm font-medium text-gray-900">{row.indicatorName}</div>
                                                    <div className="text-xs text-gray-500 mt-0.5">{row.divisionName}</div>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded">
                                                        {row.targetValue.toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    {row.realization !== null ? (
                                                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded">
                                                            {row.realization.toFixed(2)}
                                                        </span>
                                                    ) : (
                                                        <span className="text-sm text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded">
                                                        {row.weight}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <button
                                                        onClick={() => handleAnalyzeClick(row)}
                                                        disabled={row.realization === null}
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <Zap className="w-4 h-4" />
                                                        Analisa AI
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="md:hidden space-y-4">
                                {rows.map((row) => (
                                    <div key={row.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                                        <div>
                                            <div className="text-xs text-gray-500 mb-1">Indikator</div>
                                            <div className="font-semibold text-gray-900">{row.indicatorName}</div>
                                            <div className="text-sm text-gray-600 mt-0.5">{row.divisionName}</div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div>
                                                <div className="text-xs text-gray-500 mb-1">Target</div>
                                                <div className="px-2 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded text-center">
                                                    {row.targetValue.toFixed(2)}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 mb-1">Realisasi</div>
                                                {row.realization !== null ? (
                                                    <div className="px-2 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded text-center">
                                                        {row.realization.toFixed(2)}
                                                    </div>
                                                ) : (
                                                    <div className="text-sm text-gray-400 text-center">-</div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 mb-1">Bobot</div>
                                                <div className="px-2 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded text-center">
                                                    {row.weight}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleAnalyzeClick(row)}
                                            disabled={row.realization === null}
                                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Zap className="w-4 h-4" />
                                            Analisa AI
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {dataLoaded && rows.length === 0 && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Activity className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak Ada Data</h3>
                        <p className="text-gray-500">Tidak ada data monitoring untuk periode yang dipilih.</p>
                    </div>
                )}
            </main>

            {/* AI Analysis Modal */}
            <AIAnalysisModal
                isOpen={aiAnalysis.isOpen}
                onClose={() => setAiAnalysis({
                    isOpen: false,
                    loading: false,
                    error: null,
                    prediction: null,
                    editedMessage: '',
                    rowData: null,
                })}
                rowData={aiAnalysis.rowData}
                prediction={aiAnalysis.prediction}
                loading={aiAnalysis.loading}
                error={aiAnalysis.error}
                editedMessage={aiAnalysis.editedMessage}
                onMessageChange={(message) => setAiAnalysis(prev => ({ ...prev, editedMessage: message }))}
                onSubmit={handleSubmitInstruction}
                submitting={submitting}
            />
        </div>
    );
}
