'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Clock, Activity, Search, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
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
import { approvalService } from '../api/approval.service';
import { BulkActionBar } from '../components/BulkActionBar';
import type { PendingApprovalTarget, ReviewFilter, RealizationReviewStats } from '../types/approval.types';

export function RealizationReviewPage() {
    const [activeFilter, setActiveFilter] = useState<ReviewFilter>('pending_review');
    const [targets, setTargets] = useState<PendingApprovalTarget[]>([]);
    const [stats, setStats] = useState<RealizationReviewStats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
    const [loading, setLoading] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedTarget, setSelectedTarget] = useState<PendingApprovalTarget | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    // Bulk action states
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isBulkReject, setIsBulkReject] = useState(false);
    const [bulkLoading, setBulkLoading] = useState(false);

    // Approval confirmation states
    const [showApprovalDialog, setShowApprovalDialog] = useState(false);
    const [showBulkApprovalDialog, setShowBulkApprovalDialog] = useState(false);
    const [targetToApprove, setTargetToApprove] = useState<PendingApprovalTarget | null>(null);

    // Fetch targets based on filter
    const fetchTargets = async () => {
        setLoading(true);
        try {
            const data = await approvalService.getPendingApprovals(activeFilter);
            setTargets(data);
        } catch (error) {
            console.error('Error fetching targets:', error);
            toast.error('Gagal memuat data approval', {
                description: 'Silakan coba lagi atau hubungi administrator.',
            });
        } finally {
            setLoading(false);
        }
    };

    // Fetch stats
    const fetchStats = async () => {
        try {
            const statsData = await approvalService.getApprovalStats();
            setStats(statsData);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    // Initial load
    useEffect(() => {
        fetchTargets();
        fetchStats();
        clearSelections(); // Clear selections when filter changes
    }, [activeFilter]);

    // Handle approve - show dialog
    const handleApproveClick = (target: PendingApprovalTarget) => {
        setTargetToApprove(target);
        setShowApprovalDialog(true);
    };

    // Handle approve - confirm
    const handleApproveConfirm = async () => {
        if (!targetToApprove) return;

        try {
            await approvalService.approveRealization(targetToApprove.id);
            toast.success('Realisasi berhasil disetujui!', {
                description: `Indikator: ${targetToApprove.indicator_name}`,
            });
            setShowApprovalDialog(false);
            setTargetToApprove(null);
            fetchTargets();
            fetchStats();
        } catch (error) {
            console.error('Error approving:', error);
            toast.error('Gagal menyetujui realisasi', {
                description: 'Silakan coba lagi.',
            });
        }
    };

    // Handle reject - open modal
    const handleRejectClick = (target: PendingApprovalTarget) => {
        setSelectedTarget(target);
        setShowRejectModal(true);
        setRejectionReason('');
    };

    // Handle reject - submit
    const handleRejectSubmit = async () => {
        if (!rejectionReason.trim()) {
            toast.error('Alasan penolakan diperlukan', {
                description: 'Silakan masukkan alasan penolakan.',
            });
            return;
        }

        try {
            if (isBulkReject) {
                // Bulk reject
                setBulkLoading(true);
                const result = await approvalService.bulkRejectRealizations(selectedIds, rejectionReason);
                toast.success(`Berhasil menolak ${result.succeeded} dari ${selectedIds.length} data`, {
                    description: 'Data telah diperbarui.',
                });
                clearSelections();
            } else {
                // Single reject
                if (!selectedTarget) return;
                await approvalService.rejectRealization(selectedTarget.id, rejectionReason);
                toast.success('Realisasi berhasil ditolak', {
                    description: 'Pegawai dapat memperbaiki dan mengirim ulang.',
                });
                setSelectedTarget(null);
            }

            setShowRejectModal(false);
            setRejectionReason('');
            setIsBulkReject(false);
            fetchTargets();
            fetchStats();
        } catch (error) {
            console.error('Error rejecting:', error);
            toast.error('Gagal menolak realisasi', {
                description: 'Silakan coba lagi.',
            });
        } finally {
            setBulkLoading(false);
        }
    };

    // Bulk action handlers
    const handleSelectAll = () => {
        const pendingTargets = targets.filter(t => t.approval_status === 'pending_review');
        if (selectedIds.length === pendingTargets.length) {
            // Deselect all
            setSelectedIds([]);
        } else {
            // Select all pending
            setSelectedIds(pendingTargets.map(t => t.id));
        }
    };

    const handleSelectOne = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(selectedId => selectedId !== id)
                : [...prev, id]
        );
    };

    const clearSelections = () => {
        setSelectedIds([]);
    };

    const handleBulkApproveClick = () => {
        if (selectedIds.length === 0) return;
        setShowBulkApprovalDialog(true);
    };

    const handleBulkApproveConfirm = async () => {
        setBulkLoading(true);
        try {
            const result = await approvalService.bulkApproveRealizations(selectedIds);

            if (result.failed > 0) {
                toast.warning(`Berhasil menyetujui ${result.succeeded} dari ${selectedIds.length} data`, {
                    description: `${result.failed} data gagal diproses.`,
                });
            } else {
                toast.success(`Berhasil menyetujui ${result.succeeded} data!`, {
                    description: 'Semua realisasi telah disetujui.',
                });
            }

            setShowBulkApprovalDialog(false);
            clearSelections();
            fetchTargets();
            fetchStats();
        } catch (error) {
            console.error('Error bulk approving:', error);
            toast.error('Gagal melakukan bulk approval', {
                description: 'Silakan coba lagi.',
            });
        } finally {
            setBulkLoading(false);
        }
    };

    const handleBulkReject = () => {
        if (selectedIds.length === 0) return;
        setIsBulkReject(true);
        setShowRejectModal(true);
        setRejectionReason('');
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div>
                <Link
                    href="/dashboard/askbid"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                    {/* <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard */}
                    <ChevronLeft className="h-4 w-4" /> Kembali ke Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Review & Approval Realisasi</h1>
                <p className="mt-2 text-gray-600">Review dan setujui realisasi kinerja dari pegawai</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Total Laporan"
                    value={stats.total.toString()}
                    icon={<Activity className="h-6 w-6 text-blue-600" />}
                />
                <StatCard
                    label="Menunggu"
                    value={stats.pending.toString()}
                    icon={<Clock className="h-6 w-6 text-orange-600" />}
                />
                <StatCard
                    label="Approved"
                    value={stats.approved.toString()}
                    icon={<CheckCircle className="h-6 w-6 text-green-600" />}
                />
                <StatCard
                    label="Rejected"
                    value={stats.rejected.toString()}
                    icon={<XCircle className="h-6 w-6 text-red-600" />}
                />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 rounded-xl bg-gray-100 p-1.5 w-fit">
                {[
                    { label: 'Semua', value: 'all' as ReviewFilter, count: stats.total },
                    { label: 'Menunggu Review', value: 'pending_review' as ReviewFilter, count: stats.pending },
                    { label: 'Disetujui', value: 'approved' as ReviewFilter, count: stats.approved },
                    { label: 'Ditolak', value: 'rejected' as ReviewFilter, count: stats.rejected },
                ].map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveFilter(tab.value)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeFilter === tab.value
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                            }`}
                    >
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            {/* Targets Table */}
            {loading ? (
                <div className="flex h-64 items-center justify-center rounded-xl border border-gray-200 bg-white">
                    <p className="text-gray-500">Memuat data...</p>
                </div>
            ) : targets.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
                        <AlertCircle className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Tidak ada data</h3>
                    <p className="mt-1 text-sm text-gray-500">Tidak ada realisasi dengan status "{activeFilter}"</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="py-3 px-4 w-12">
                                        {activeFilter === 'pending_review' && (
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.length === targets.filter(t => t.approval_status === 'pending_review').length && targets.filter(t => t.approval_status === 'pending_review').length > 0}
                                                onChange={handleSelectAll}
                                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                                title="Select All"
                                            />
                                        )}
                                    </th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">Indikator</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">Divisi</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">Unit</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-700 uppercase">Target</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-700 uppercase">Realisasi</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-700 uppercase">Status</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-700 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {targets.map((target) => (
                                    <tr key={target.id} className="hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            {target.approval_status === 'pending_review' && (
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(target.id)}
                                                    onChange={() => handleSelectOne(target.id)}
                                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                                />
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-900">{target.indicator_name}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{target.division_name}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{target.unit_name}</td>
                                        <td className="py-3 px-4 text-center">
                                            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded">
                                                {target.target_value.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-sm font-semibold rounded">
                                                {target.realization_value.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            {getStatusBadge(target.approval_status)}
                                        </td>
                                        <td className="py-3 px-4">
                                            {target.approval_status === 'pending_review' && (
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleApproveClick(target)}
                                                        className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
                                                    >
                                                        Setujui
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectClick(target)}
                                                        className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors"
                                                    >
                                                        Tolak
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden divide-y divide-gray-200">
                        {targets.map((target) => (
                            <div key={target.id} className="p-4 space-y-3 relative">
                                {/* Checkbox for mobile */}
                                {target.approval_status === 'pending_review' && (
                                    <div className="absolute top-4 right-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(target.id)}
                                            onChange={() => handleSelectOne(target.id)}
                                            className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                        />
                                    </div>
                                )}
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">Indikator</div>
                                    <div className="font-semibold text-gray-900">{target.indicator_name}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">Divisi</div>
                                        <div className="text-sm text-gray-700">{target.division_name}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">Unit</div>
                                        <div className="text-sm text-gray-700">{target.unit_name}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">Target</div>
                                        <div className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded inline-block">
                                            {target.target_value.toFixed(2)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">Realisasi</div>
                                        <div className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-semibold rounded inline-block">
                                            {target.realization_value.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">Status</div>
                                    {getStatusBadge(target.approval_status)}
                                </div>
                                {target.approval_status === 'pending_review' && (
                                    <div className="flex gap-2 pt-2">
                                        <button
                                            onClick={() => handleApproveClick(target)}
                                            className="flex-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            Setujui
                                        </button>
                                        <button
                                            onClick={() => handleRejectClick(target)}
                                            className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            Tolak
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Bulk Action Bar */}
            <BulkActionBar
                selectedCount={selectedIds.length}
                onApproveAll={handleBulkApproveClick}
                onRejectAll={handleBulkReject}
                onClear={clearSelections}
                loading={bulkLoading}
            />

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Tolak Realisasi</h2>
                        {isBulkReject ? (
                            <p className="text-sm text-gray-600 mb-4">
                                Anda akan menolak <span className="font-semibold">{selectedIds.length} realisasi</span> dengan alasan yang sama.
                            </p>
                        ) : (
                            <p className="text-sm text-gray-600 mb-4">
                                Indikator: <span className="font-semibold">{selectedTarget?.indicator_name}</span>
                            </p>
                        )}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Alasan Penolakan <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                rows={4}
                                placeholder="Jelaskan alasan penolakan..."
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all resize-none text-gray-900"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setSelectedTarget(null);
                                    setRejectionReason('');
                                    setIsBulkReject(false);
                                }}
                                disabled={bulkLoading}
                                className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleRejectSubmit}
                                disabled={bulkLoading}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {bulkLoading ? 'Memproses...' : 'Tolak Realisasi'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Single Approval Dialog */}
            <AlertDialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Persetujuan</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menyetujui realisasi untuk <span className="font-semibold">"{targetToApprove?.indicator_name}"</span>?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleApproveConfirm}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Ya, Setujui
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Bulk Approval Dialog */}
            <AlertDialog open={showBulkApprovalDialog} onOpenChange={setShowBulkApprovalDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Persetujuan Massal</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menyetujui <span className="font-semibold">{selectedIds.length} realisasi kinerja</span> secara sekaligus? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleBulkApproveConfirm}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Ya, Setujui Semua ({selectedIds.length})
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

// Helper Components
function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
            </div>
            <div>{icon}</div>
        </div>
    );
}

function getStatusBadge(status: string) {
    const badges = {
        pending_review: (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                <Clock className="w-3 h-3" />
                Menunggu Review
            </span>
        ),
        approved: (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                <CheckCircle className="w-3 h-3" />
                Disetujui
            </span>
        ),
        rejected: (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                <XCircle className="w-3 h-3" />
                Ditolak
            </span>
        ),
        draft: (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                Draft
            </span>
        ),
    };
    return badges[status as keyof typeof badges] || null;
}
