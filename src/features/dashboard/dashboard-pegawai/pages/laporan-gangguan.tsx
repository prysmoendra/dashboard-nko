// dashboard-pegawai/pages/laporan-gangguan.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Activity, Info, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Header } from '@/shared/components/layout/header';

// Tipe data untuk state form (asumsi sama)
interface FormData {
  lokasi: string;
  jenisGangguan: string;
  prioritas: string;
  waktuKejadian: string;
  deskripsi: string;
  urlFoto: string;
}

export default function LaporanGangguan() {
  const router = useRouter();
  
  const [form, setForm] = useState<FormData>({
    lokasi: '',
    jenisGangguan: '',
    prioritas: 'Medium',
    waktuKejadian: '',
    deskripsi: '',
    urlFoto: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Data Laporan:', form);
    alert('Laporan berhasil disubmit!');
    // Redirect atau reset form setelah submit
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
          <h1 className="text-3xl font-bold text-gray-900">Laporan Gangguan Baru</h1>
          <p className="text-gray-500 mt-1">Isi formulir di bawah untuk melaporkan gangguan listrik atau infrastruktur.</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit}>
            {/* Form Content */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Header Form Internal */}
              <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                <div className="p-3 bg-red-50 rounded-xl shrink-0">
                  <Activity className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Detail Laporan</h2>
                  <p className="text-sm text-gray-500">Pastikan semua data diisi dengan benar.</p>
                </div>
              </div>

              {/* Info Box (User & Unit) */}
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

              {/* Input: Lokasi Gangguan */}
              <div className="space-y-1.5">
                <label htmlFor="lokasi" className="block text-sm font-medium text-gray-700">
                  Lokasi Gangguan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lokasi"
                  name="lokasi"
                  required
                  value={form.lokasi}
                  onChange={handleChange}
                  placeholder="Contoh: Jl. Raya Cimahi No. 123"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Input Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Jenis Gangguan */}
                <div className="space-y-1.5">
                  <label htmlFor="jenisGangguan" className="block text-sm font-medium text-gray-700">
                    Jenis Gangguan <span className="text-red-500">*</span>
                  </label>
                  <select id="jenisGangguan" name="jenisGangguan" required value={form.jenisGangguan} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all text-gray-700">
                    <option value="" disabled>Pilih jenis gangguan..</option>
                    <option value="padam_total">Padam Total</option>
                    <option value="tegangan_tidak_stabil">Tegangan Tidak Stabil</option>
                    <option value="tiang_roboh">Tiang Roboh</option>
                    <option value="kabel_putus">Kabel Putus</option>
                  </select>
                </div>
                {/* Prioritas */}
                <div className="space-y-1.5">
                  <label htmlFor="prioritas" className="block text-sm font-medium text-gray-700">
                    Prioritas <span className="text-red-500">*</span>
                  </label>
                  <select id="prioritas" name="prioritas" required value={form.prioritas} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all text-gray-700">
                    <option value="Low">Low - Tidak Mendesak</option>
                    <option value="Medium">Medium - Perlu Perhatian</option>
                    <option value="High">High - Darurat</option>
                  </select>
                </div>
              </div>

              {/* Waktu Kejadian */}
              <div className="space-y-1.5">
                <label htmlFor="waktuKejadian" className="block text-sm font-medium text-gray-700">
                  Waktu Kejadian <span className="text-red-500">*</span>
                </label>
                <input type="datetime-local" id="waktuKejadian" name="waktuKejadian" required value={form.waktuKejadian} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-700" />
              </div>

              {/* Deskripsi */}
              <div className="space-y-1.5">
                <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">
                  Deskripsi Detail <span className="text-red-500">*</span>
                </label>
                <textarea id="deskripsi" name="deskripsi" required rows={4} value={form.deskripsi} onChange={handleChange} placeholder="Jelaskan detail gangguan yang terjadi..." className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 resize-none" />
              </div>

              {/* URL Foto */}
              <div className="space-y-1.5">
                <label htmlFor="urlFoto" className="block text-sm font-medium text-gray-700">
                  URL Foto (Opsional)
                </label>
                <input type="url" id="urlFoto" name="urlFoto" value={form.urlFoto} onChange={handleChange} placeholder="https://example.com/foto-gangguan.jpg" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400" />
                <p className="text-xs text-gray-500 mt-1">Upload foto ke cloud storage dan paste URL di sini</p>
              </div>

            </div>

            {/* Form Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Info className="w-5 h-5 text-gray-400 shrink-0" />
                  <p className="text-sm text-gray-600">Laporan akan direview oleh atasan.</p>
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
                    Submit Laporan
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