/**
 * InstructionCard Component
 * Card for displaying individual instruction items
 */

"use client";

import React from 'react';
import { AlertCircle, Info, Clock, CheckCircle2 } from 'lucide-react';
import { ActionPlanWithStatus, ActionPlanStatus } from '../types';

interface InstructionCardProps {
    instruction: ActionPlanWithStatus;
    onProcess: (id: string) => void;
    onComplete: (id: string) => void;
}

export function InstructionCard({ instruction, onProcess, onComplete }: InstructionCardProps) {
    const getUrgencyBadge = () => {
        if (!instruction.status_color) return null;

        if (instruction.status_color === 'Merah') {
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                    <AlertCircle className="h-3 w-3" />
                    Urgent
                </span>
            );
        }

        if (instruction.status_color === 'Kuning') {
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2.5 py-0.5 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">
                    <Info className="h-3 w-3" />
                    Info
                </span>
            );
        }

        return null;
    };

    const getStatusBadge = () => {
        switch (instruction.status) {
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20">
                        <Clock className="h-3 w-3" />
                        Belum Dibaca
                    </span>
                );
            case 'in_progress':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                        <Clock className="h-3 w-3" />
                        Dalam Proses
                    </span>
                );
            case 'done':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        <CheckCircle2 className="h-3 w-3" />
                        Selesai
                    </span>
                );
        }
    };

    const renderActionButton = () => {
        if (instruction.status === 'pending') {
            return (
                <button
                    onClick={() => onProcess(instruction.id)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Proses
                </button>
            );
        }

        if (instruction.status === 'in_progress') {
            return (
                <button
                    onClick={() => onComplete(instruction.id)}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                    Lapor Selesai
                </button>
            );
        }

        return null;
    };

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900">
                        {instruction.indicator_name}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                        Minggu {instruction.week} • {getMonthName(instruction.month)} {instruction.year}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {getUrgencyBadge()}
                    {getStatusBadge()}
                </div>
            </div>

            {/* Body */}
            <div className="mb-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                    {instruction.final_instruction}
                </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3">
                <div className="text-xs text-gray-500">
                    <span className="font-medium">Role:</span> {instruction.assigned_role}
                </div>
                {renderActionButton()}
            </div>

            {/* Response (if done) */}
            {instruction.status === 'done' && instruction.response_text && (
                <div className="mt-4 rounded-lg bg-green-50 p-4 border border-green-200">
                    <p className="text-xs font-medium text-green-900 mb-2">Laporan Asman:</p>
                    <p className="text-sm text-green-800 leading-relaxed">
                        {instruction.response_text}
                    </p>
                </div>
            )}
        </div>
    );
}

function getMonthName(month: number): string {
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return months[month - 1] || '';
}
