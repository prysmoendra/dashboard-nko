"use client";

import React from 'react';
import { X, CheckCircle, Clock, AlertCircle } from 'lucide-react';

type Instruction = {
  id: string;
  title: string;
  desc: string;
  priority: 'Urgent' | 'Tinggi' | 'Sedang' | 'Rendah';
  category: string;
  from: string;
  date: string;
  status: 'Selesai' | 'Dalam Proses' | 'Dibaca' | 'Belum Dibaca';
  actionNote?: string;
  completionDate?: string;
};

interface InstructionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Instruction | null;
}

export function InstructionDetailModal({ isOpen, onClose, data }: InstructionDetailModalProps) {
  if (!isOpen || !data) return null;

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'Urgent': return 'bg-red-100 text-red-700';
      case 'Tinggi': return 'bg-orange-100 text-orange-700';
      case 'Sedang': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'Selesai': return 'bg-green-100 text-green-700';
      case 'Dalam Proses': return 'bg-orange-100 text-orange-700';
      case 'Belum Dibaca': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // Logic Conditional Render: Box biru HANYA jika 'Selesai' atau 'Dalam Proses'
  const showActionBox = (data.status === 'Selesai' || data.status === 'Dalam Proses') && Boolean(data.actionNote);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-3xl rounded-xl bg-white shadow-2xl ring-1 ring-gray-200 animate-in fade-in zoom-in duration-200">
        <div className="flex items-start justify-between border-b border-gray-100 p-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Detail Instruksi</h2>
            <p className="mt-1 text-sm text-gray-500">Tindak lanjuti instruksi dari Kepala Bidang</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-lg font-bold text-gray-900">{data.title}</h3>
              <span className={`inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium ${getPriorityColor(data.priority)}`}>{data.priority}</span>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(data.status)}`}>
                {data.status === 'Selesai' && <CheckCircle className="mr-1 h-3 w-3" />}
                {data.status === 'Dalam Proses' && <Clock className="mr-1 h-3 w-3" />}
                {data.status === 'Belum Dibaca' && <AlertCircle className="mr-1 h-3 w-3" />}
                {data.status}
              </span>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{data.desc}</p>
          </div>
          <div className="grid grid-cols-1 gap-y-4 gap-x-8 sm:grid-cols-2 pt-2">
            <div><p className="text-sm text-gray-500">ID:</p><p className="font-medium text-gray-900">{data.id}</p></div>
            <div><p className="text-sm text-gray-500">Kategori:</p><p className="font-medium text-gray-900 capitalize">{data.category}</p></div>
            <div><p className="text-sm text-gray-500">Pengirim:</p><p className="font-medium text-gray-900">{data.from}</p></div>
            <div><p className="text-sm text-gray-500">Tanggal:</p><p className="font-medium text-gray-900">{data.date}</p></div>
          </div>
          {showActionBox && (
            <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-5">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Tindakan yang Diambil:</h4>
              <p className="text-sm text-blue-800 leading-relaxed mb-3">{data.actionNote}</p>
              {data.completionDate && (<p className="text-xs text-blue-600 font-medium">Diselesaikan: {data.completionDate}</p>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}