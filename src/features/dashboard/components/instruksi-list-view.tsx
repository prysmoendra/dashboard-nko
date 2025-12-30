"use client";

import React, { useState } from 'react';
import { 
  ArrowLeft, FileText, AlertCircle, Clock, CheckCircle, Filter, Eye 
} from 'lucide-react';
import Link from 'next/link';
import { InstructionDetailModal } from './instruction-detail-modal';

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

const MOCK_DATA: Instruction[] = [
  {
    id: 'KEP-001',
    title: 'Perbaikan Jaringan Segera di Area Cibeureum',
    desc: 'Berdasarkan laporan gangguan yang masuk, diperlukan perbaikan jaringan segera di area Cibeureum. Koordinasikan dengan tim lapangan untuk penanganan dalam 24 jam.',
    priority: 'Urgent',
    category: 'operasional',
    from: 'Kepala Bidang Teknik',
    date: '2025-11-27 09:30',
    status: 'Selesai',
    actionNote: 'Tim lapangan sudah dikirim dan perbaikan selesai dilaksanakan pukul 16:00. Area Cibeureum sudah normal kembali.',
    completionDate: '2025-11-27 16:30'
  },
  {
    id: 'KEP-002',
    title: 'Review Jadwal Maintenance Triwulan IV',
    desc: 'Mohon review ulang jadwal maintenance triwulan IV mengingat ada beberapa unit yang perlu diprioritaskan.',
    priority: 'Sedang',
    category: 'maintenance',
    from: 'Kepala Bidang Teknik',
    date: '2025-11-26 14:15',
    status: 'Dalam Proses',
    actionNote: 'Sedang mengkoordinasikan dengan tim maintenance untuk review jadwal. Target selesai besok siang.'
  },
  {
    id: 'KEP-003',
    title: 'Pengadaan Material Kabel ACSR',
    desc: 'Segera koordinasikan pengadaan kabel ACSR 150mm untuk proyek perluasan jaringan bulan depan.',
    priority: 'Tinggi',
    category: 'pengadaan',
    from: 'Kepala Bidang Teknik',
    date: '2025-11-25 10:00',
    status: 'Dibaca',
  },
  {
    id: 'KEP-004',
    title: 'Evaluasi Kinerja Tim Lapangan',
    desc: 'Lakukan evaluasi kinerja tim lapangan bulan November dan buat laporan untuk rapat koordinasi minggu depan.',
    priority: 'Sedang',
    category: 'lainnya',
    from: 'Kepala Bidang Teknik',
    date: '2025-11-24 08:00',
    status: 'Belum Dibaca',
  },
];

export function InstruksiListView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Instruction | null>(null);

  const handleViewDetail = (item: Instruction) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedItem(null), 200);
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <Link 
          href="/dashboard/asisten" 
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Instruksi dari Kepala Bidang</h1>
        <p className="mt-1 text-gray-500">Lihat dan tindak lanjuti instruksi dari Kepala Bidang untuk dikoordinasikan kepada pegawai</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatItem label="Total Instruksi" count="4" icon={<FileText className="h-6 w-6 text-blue-600" />} bg="bg-blue-50" />
        <StatItem label="Belum Dibaca" count="1" icon={<AlertCircle className="h-6 w-6 text-red-600" />} bg="bg-red-50" />
        <StatItem label="Dalam Proses" count="1" icon={<Clock className="h-6 w-6 text-orange-600" />} bg="bg-orange-50" />
        <StatItem label="Selesai" count="1" icon={<CheckCircle className="h-6 w-6 text-green-600" />} bg="bg-green-50" />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border bg-white text-gray-500 hover:bg-gray-50"><Filter className="h-4 w-4" /></button>
        <FilterButton label="Semua" count={4} active />
        <FilterButton label="Belum Dibaca" count={1} />
        <FilterButton label="Dibaca" count={1} />
        <FilterButton label="Dalam Proses" count={1} />
        <FilterButton label="Selesai" count={1} />
      </div>

      <div className="space-y-4">
        {MOCK_DATA.map((item) => (
          <InstructionCard key={item.id} data={item} onViewDetail={() => handleViewDetail(item)} />
        ))}
      </div>

      <InstructionDetailModal isOpen={isModalOpen} onClose={handleCloseModal} data={selectedItem} />
    </div>
  );
}

function StatItem({ label, count, icon, bg }: any) {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-white p-5 shadow-sm">
      <div><p className="text-sm font-medium text-gray-500">{label}</p><p className="mt-1 text-2xl font-bold text-gray-900">{count}</p></div>
      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${bg}`}>{icon}</div>
    </div>
  );
}
function FilterButton({ label, count, active }: any) {
  return (
    <button className={`whitespace-nowrap rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
      {label} ({count})
    </button>
  );
}
function InstructionCard({ data, onViewDetail }: { data: Instruction, onViewDetail: () => void }) {
  const isUnread = data.status === 'Belum Dibaca';
  const borderClass = isUnread ? 'border-red-300 ring-1 ring-red-100' : 'border-gray-200';
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
  return (
    <div className={`rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md ${borderClass}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-gray-900">{data.title}</h3>
            <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${getPriorityColor(data.priority)}`}>{data.priority}</span>
            {isUnread && <span className="inline-flex items-center rounded bg-red-600 px-2 py-0.5 text-xs font-bold text-white shadow-sm">BARU</span>}
          </div>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{data.desc}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-gray-500">
            <span className="font-medium text-gray-900">ID: <span className="font-normal text-gray-500">{data.id}</span></span>
            <span><span className="font-medium text-gray-900">Kategori: </span>{data.category}</span>
            <span><span className="font-medium text-gray-900">Dari: </span>{data.from}</span>
            <span><span className="font-medium text-gray-900">Tanggal: </span>{data.date}</span>
          </div>
          {['Dalam Proses', 'Selesai'].includes(data.status) && data.actionNote && (
            <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 sm:p-4">
              <p className="text-sm text-blue-800 line-clamp-1"><span className="font-bold mr-1">Tindakan:</span>{data.actionNote}</p>
            </div>
          )}
        </div>
        <div className="flex shrink-0 flex-row items-center justify-between gap-3 sm:flex-col sm:items-end">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(data.status)}`}>
            {data.status === 'Selesai' && <CheckCircle className="mr-1 h-3 w-3" />}
            {data.status === 'Dalam Proses' && <Clock className="mr-1 h-3 w-3" />}
            {data.status}
          </span>
          <button onClick={onViewDetail} className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Eye className="h-4 w-4" /> Lihat Detail
          </button>
        </div>
      </div>
    </div>
  );
}