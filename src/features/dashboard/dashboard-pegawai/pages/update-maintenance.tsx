'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Settings, Info, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Header } from '@/shared/components/layout/header';

// Tipe data untuk state form maintenance
interface MaintenanceForm {
  namaAsset: string;
  jenisMaintenance: string;
  status: string;
  tanggalJadwal: string;
  komponenDiganti: string;
  catatan: string;
}

export default function UpdateMaintenance() {
  const router = useRouter();
  
  // State awal
  const [form, setForm] = useState<MaintenanceForm>({
    namaAsset: '',
    jenisMaintenance: '',
    status: 'Scheduled',
    tanggalJadwal: '',
    komponenDiganti: '',
    catatan: ''
  });

  // Handle perubahan input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Data Maintenance:', form);
    alert('Data Maintenance berhasil disubmit!');
    router.push('/dashboard/pegawai');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard/pegawai"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali ke Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Update Status Maintenance</h1>
          <p className="text-gray-500 mt-1">Isi formulir di bawah untuk memperbarui status dan detail maintenance.</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit}>
            {/* Form Content */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Header Form Internal */}
              <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                <div className="p-3 bg-orange-50 rounded-xl shrink-0">
                  <Settings className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Detail Maintenance</h2>
                  <p className="text-sm text-gray-500">Pastikan semua data diisi dengan benar.</p>
                </div>
              </div>

              {/* Info User Box */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Disubmit oleh:</span>
                  <span className="font-semibold text-gray-900">Demo</span>
                </div>
                <div className="sm:text-right">
                  <span className="text-xs text-gray-500 block mb-1">Unit:</span>
                  <span className="font-semibold text-gray-900">Up3 Cimahi</span>
                </div>
              </div>

              {/* Input: Nama Asset */}
              <div className="space-y-1.5">
                <label htmlFor="namaAsset" className="block text-sm font-medium text-gray-700">
                  Nama Asset/Peralatan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="namaAsset"
                  name="namaAsset"
                  required
                  value={form.namaAsset}
                  onChange={handleChange}
                  placeholder="Contoh: Trafo Gardu Induk A"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Input Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Jenis Maintenance */}
                <div className="space-y-1.5">
                  <label htmlFor="jenisMaintenance" className="block text-sm font-medium text-gray-700">
                    Jenis Maintenance <span className="text-red-500">*</span>
                  </label>
                  <select id="jenisMaintenance" name="jenisMaintenance" required value={form.jenisMaintenance} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all text-gray-700">
                    <option value="" disabled>Pilih jenis maintenance..</option>
                    <option value="preventive">Preventive Maintenance (Pencegahan)</option>
                    <option value="corrective">Corrective Maintenance (Perbaikan)</option>
                    <option value="predictive">Predictive Maintenance</option>
                    <option value="overhaul">Overhaul Total</option>
                  </select>
                </div>
                {/* Status */}
                <div className="space-y-1.5">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select id="status" name="status" required value={form.status} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all text-gray-700">
                    <option value="Scheduled">🔵 Scheduled - Dijadwalkan</option>
                    <option value="In Progress">🟠 In Progress - Sedang Dikerjakan</option>
                    <option value="Completed">🟢 Completed - Selesai</option>
                    <option value="Pending">🔴 Pending - Tertunda</option>
                  </select>
                </div>
              </div>

              {/* Tanggal Jadwal */}
              <div className="space-y-1.5">
                <label htmlFor="tanggalJadwal" className="block text-sm font-medium text-gray-700">
                  Tanggal Jadwal <span className="text-red-500">*</span>
                </label>
                <input type="datetime-local" id="tanggalJadwal" name="tanggalJadwal" required value={form.tanggalJadwal} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-700" />
              </div>

              {/* Komponen Diganti (Opsional) */}
              <div className="space-y-1.5">
                <label htmlFor="komponenDiganti" className="block text-sm font-medium text-gray-700">
                  Komponen yang Diganti (Opsional)
                </label>
                <input type="text" id="komponenDiganti" name="komponenDiganti" value={form.komponenDiganti} onChange={handleChange} placeholder="Contoh: Circuit Breaker, Isolator, dll" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400" />
              </div>

              {/* Catatan/Hasil */}
              <div className="space-y-1.5">
                <label htmlFor="catatan" className="block text-sm font-medium text-gray-700">
                  Catatan/Hasil Maintenance <span className="text-red-500">*</span>
                </label>
                <textarea id="catatan" name="catatan" required rows={4} value={form.catatan} onChange={handleChange} placeholder="Jelaskan detail pekerjaan maintenance yang dilakukan..." className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 resize-none" />
              </div>

            </div>

            {/* Form Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Info className="w-5 h-5 text-gray-400 shrink-0" />
                  <p className="text-sm text-gray-600">Data maintenance akan melalui proses approval sebelum masuk ke sistem.</p>
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
                    className="w-full sm:w-auto text-center py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Submit Data
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}