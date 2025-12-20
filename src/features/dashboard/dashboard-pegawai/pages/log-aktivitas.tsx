'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Info, AlertCircle, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Header } from '@/shared/components/layout/header';

// Tipe data untuk state form log aktivitas
interface LogAktivitasForm {
  lokasi: string;
  jenisAktivitas: string;
  waktuMulai: string;
  waktuSelesai: string;
  deskripsi: string;
  urlFoto: string;
}

export default function LogAktivitas() {
  const router = useRouter();
  
  // State awal
  const [form, setForm] = useState<LogAktivitasForm>({
    lokasi: '',
    jenisAktivitas: '',
    waktuMulai: '',
    waktuSelesai: '',
    deskripsi: '',
    urlFoto: ''
  });

  // Handle perubahan input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Log Aktivitas:', form);
    alert('Log Aktivitas berhasil disubmit!');
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
          <h1 className="text-3xl font-bold text-gray-900">Log Aktivitas Lapangan</h1>
          <p className="text-gray-500 mt-1">Catat aktivitas dan progress pekerjaan di lapangan.</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit}>
            {/* Form Content */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Header Form Internal */}
              <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                <div className="p-3 bg-green-50 rounded-xl shrink-0">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Detail Aktivitas</h2>
                  <p className="text-sm text-gray-500">Isi detail pekerjaan yang dilakukan.</p>
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

              {/* Input: Lokasi Aktivitas */}
              <div className="space-y-1.5">
                <label htmlFor="lokasi" className="block text-sm font-medium text-gray-700">
                  Lokasi Aktivitas <span className="text-red-500">*</span>
                </label>
                <input type="text" id="lokasi" name="lokasi" required value={form.lokasi} onChange={handleChange} placeholder="Contoh: Gardu Distribusi Cimahi Utara" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400" />
              </div>

              {/* Input: Jenis Aktivitas */}
              <div className="space-y-1.5">
                <label htmlFor="jenisAktivitas" className="block text-sm font-medium text-gray-700">
                  Jenis Aktivitas <span className="text-red-500">*</span>
                </label>
                <input type="text" id="jenisAktivitas" name="jenisAktivitas" required value={form.jenisAktivitas} onChange={handleChange} placeholder="Contoh: Inspeksi Rutin, Perbaikan, Instalasi, dll" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400" />
              </div>

              {/* Row: Waktu Mulai & Selesai (Grid 2 Kolom) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label htmlFor="waktuMulai" className="block text-sm font-medium text-gray-700">
                    Waktu Mulai <span className="text-red-500">*</span>
                  </label>
                  <input type="datetime-local" id="waktuMulai" name="waktuMulai" required value={form.waktuMulai} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-700" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="waktuSelesai" className="block text-sm font-medium text-gray-700">
                    Waktu Selesai <span className="text-red-500">*</span>
                  </label>
                  <input type="datetime-local" id="waktuSelesai" name="waktuSelesai" required value={form.waktuSelesai} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-700" />
                </div>
              </div>

              {/* Deskripsi Progress */}
              <div className="space-y-1.5">
                <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">
                  Deskripsi Progress Pekerjaan <span className="text-red-500">*</span>
                </label>
                <textarea id="deskripsi" name="deskripsi" required rows={4} value={form.deskripsi} onChange={handleChange} placeholder="Jelaskan detail aktivitas yang telah dilakukan..." className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 resize-none" />
              </div>

              {/* URL Foto Dokumentasi (Opsional) */}
              <div className="space-y-1.5">
                <label htmlFor="urlFoto" className="block text-sm font-medium text-gray-700">
                  URL Foto Dokumentasi (Opsional)
                </label>
                <input type="url" id="urlFoto" name="urlFoto" value={form.urlFoto} onChange={handleChange} placeholder="https://example.com/foto-aktivitas.jpg" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400" />
                <p className="text-xs text-gray-500 mt-1">Upload foto dokumentasi ke cloud storage dan paste URL di sini</p>
              </div>

            </div>

            {/* Form Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <AlertCircle className="w-5 h-5 text-gray-400 shrink-0" />
                  <p className="text-sm text-gray-600">Log aktivitas akan diverifikasi sebelum tersimpan di sistem.</p>
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
                    Submit Log
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