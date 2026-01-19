/**
 * InstruksiInboxPage - Instruction inbox for Asman
 * Displays and manages instructions from Kabid
 */

"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/shared/lib/supabase';
import { ActionPlanService } from '../services/action-plan.service';
import { RoleSimulator } from '../components/RoleSimulator';
import { InstructionCard } from '../components/InstructionCard';
import { ReportModal } from '../components/ReportModal';
import {
    AsmanRole,
    InstructionFilterTab,
    ActionPlanWithStatus,
} from '../types';
import { Inbox, Loader2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const TABS: { label: string; value: InstructionFilterTab }[] = [
    { label: 'Semua', value: 'all' },
    { label: 'Belum Dibaca', value: 'pending' },
    { label: 'Dalam Proses', value: 'in_progress' },
    { label: 'Selesai', value: 'done' },
];

export function InstruksiInboxPage() {
    const [service] = useState(() => new ActionPlanService(supabase));

    // State
    const [selectedRole, setSelectedRole] = useState<AsmanRole | null>(null);
    const [activeTab, setActiveTab] = useState<InstructionFilterTab>('all');
    const [instructions, setInstructions] = useState<ActionPlanWithStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedInstruction, setSelectedInstruction] = useState<ActionPlanWithStatus | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Fetch instructions
    const fetchInstructions = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await service.fetchActionPlans(selectedRole, activeTab);
            setInstructions(data);
        } catch (err) {
            console.error('Error fetching instructions:', err);
            setError('Gagal memuat instruksi. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch on mount and when filters change
    useEffect(() => {
        fetchInstructions();
    }, [selectedRole, activeTab]);

    // Handle "Proses" button
    const handleProcess = async (id: string) => {
        try {
            await service.updateStatus(id, 'in_progress');
            await fetchInstructions(); // Refresh list
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Gagal memproses instruksi. Silakan coba lagi.');
        }
    };

    // Handle "Lapor Selesai" button
    const handleComplete = (id: string) => {
        const instruction = instructions.find((i) => i.id === id);
        if (instruction) {
            setSelectedInstruction(instruction);
            setModalOpen(true);
        }
    };

    // Handle report submission
    const handleSubmitReport = async (reportText: string) => {
        if (!selectedInstruction) return;

        setSubmitting(true);

        try {
            await service.submitReport(selectedInstruction.id, reportText);
            setModalOpen(false);
            setSelectedInstruction(null);
            await fetchInstructions(); // Refresh list
        } catch (err) {
            console.error('Error submitting report:', err);
            alert('Gagal mengirim laporan. Silakan coba lagi.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 space-y-6">
            <Link
                href="/dashboard/askbid"
                className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
                <ChevronLeft className="h-4 w-4" /> Kembali ke Dashboard
            </Link>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Instruksi dari Kepala Bidang
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Kelola dan tindak lanjuti instruksi dari Kabid
                    </p>
                </div>

                {/* Role Simulator */}
                <RoleSimulator
                    selectedRole={selectedRole}
                    onRoleChange={setSelectedRole}
                />
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                    {TABS.map((tab) => {
                        const isActive = activeTab === tab.value;
                        return (
                            <button
                                key={tab.value}
                                onClick={() => setActiveTab(tab.value)}
                                className={`
                                    whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium
                                    ${isActive
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    }
                                `}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Content */}
            <div>
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                ) : error ? (
                    <div className="rounded-lg bg-red-50 p-6 text-center">
                        <p className="text-sm text-red-800">{error}</p>
                        <button
                            onClick={fetchInstructions}
                            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                            Coba Lagi
                        </button>
                    </div>
                ) : instructions.length === 0 ? (
                    <div className="rounded-lg bg-gray-50 p-12 text-center">
                        <Inbox className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-4 text-sm font-medium text-gray-900">
                            Tidak ada instruksi
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {activeTab === 'all'
                                ? 'Belum ada instruksi dari Kabid'
                                : `Tidak ada instruksi dengan status "${TABS.find(t => t.value === activeTab)?.label}"`}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                        {instructions.map((instruction) => (
                            <InstructionCard
                                key={instruction.id}
                                instruction={instruction}
                                onProcess={handleProcess}
                                onComplete={handleComplete}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Report Modal */}
            <ReportModal
                isOpen={modalOpen}
                instructionTitle={selectedInstruction?.indicator_name || ''}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedInstruction(null);
                }}
                onSubmit={handleSubmitReport}
                isSubmitting={submitting}
            />
        </div>
    );
}
