'use client';

import React from 'react';
import { X, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';
import type { MonitoringRow, AIPredictionResponse } from '../types/ai-monitoring.types';

interface AIAnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
    rowData: MonitoringRow | null;
    prediction: AIPredictionResponse | null;
    loading: boolean;
    error: string | null;
    editedMessage: string;
    onMessageChange: (message: string) => void;
    onSubmit: () => void;
    submitting: boolean;
}

export function AIAnalysisModal({
    isOpen,
    onClose,
    rowData,
    prediction,
    loading,
    error,
    editedMessage,
    onMessageChange,
    onSubmit,
    submitting,
}: AIAnalysisModalProps) {
    if (!isOpen) return null;

    // Status badge styling
    const getStatusBadgeClass = (status: 'Merah' | 'Kuning' | 'Hijau') => {
        switch (status) {
            case 'Merah':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'Kuning':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Hijau':
                return 'bg-green-100 text-green-700 border-green-200';
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-start justify-between p-6 border-b border-gray-200">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-purple-50 rounded-xl shrink-0">
                                <Sparkles className="w-6 h-6 text-purple-500" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Analisa AI</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {rowData?.indicatorName || 'Loading...'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Loading State */}
                        {loading && (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                                <p className="text-gray-600 font-medium">Menganalisa dengan AI...</p>
                                <p className="text-sm text-gray-500 mt-1">Mohon tunggu sebentar</p>
                            </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-red-900">Error</h3>
                                    <p className="text-sm text-red-700 mt-1">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Prediction Results */}
                        {!loading && !error && prediction && (
                            <>
                                {/* Metadata Info */}
                                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-xs text-gray-500 block mb-1">Target</span>
                                        <span className="font-semibold text-gray-900">
                                            {rowData?.targetValue.toFixed(2)}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 block mb-1">Realisasi</span>
                                        <span className="font-semibold text-gray-900">
                                            {rowData?.realization?.toFixed(2) ?? 'N/A'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 block mb-1">Bobot</span>
                                        <span className="font-semibold text-gray-900">
                                            {rowData?.weight}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 block mb-1">Divisi</span>
                                        <span className="font-semibold text-gray-900">
                                            {rowData?.divisionName}
                                        </span>
                                    </div>
                                </div>

                                {/* Prediction Score */}
                                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <TrendingUp className="w-5 h-5 text-blue-600" />
                                        <h3 className="font-semibold text-gray-900">Skor Prediksi AI</h3>
                                    </div>
                                    <p className="text-3xl font-bold text-blue-600">
                                        {prediction.prediction.toFixed(2)}
                                    </p>
                                </div>

                                {/* Status Badge */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status Kinerja
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center px-4 py-2 rounded-lg border font-semibold ${getStatusBadgeClass(prediction.status)}`}>
                                            <span className="w-2 h-2 rounded-full bg-current mr-2" />
                                            {prediction.status}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            (Assigned to: {prediction.assigned_role})
                                        </span>
                                    </div>
                                </div>

                                {/* Editable Wisdom Message */}
                                <div>
                                    <label htmlFor="wisdom-message" className="block text-sm font-medium text-gray-700 mb-2">
                                        Pesan Instruksi AI <span className="text-gray-500">(dapat diedit)</span>
                                    </label>
                                    <textarea
                                        id="wisdom-message"
                                        value={editedMessage}
                                        onChange={(e) => onMessageChange(e.target.value)}
                                        rows={6}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none text-gray-900 placeholder:text-gray-400"
                                        placeholder="Edit instruksi dari AI sebelum mengirim..."
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Edit pesan instruksi sesuai kebutuhan sebelum mengirim ke tim
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    {!loading && !error && prediction && (
                        <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                disabled={submitting}
                                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Batal
                            </button>
                            <button
                                onClick={onSubmit}
                                disabled={submitting || !editedMessage.trim()}
                                className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Mengirim...' : 'Kirim Instruksi'}
                            </button>
                        </div>
                    )}

                    {/* Error Footer */}
                    {error && (
                        <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
