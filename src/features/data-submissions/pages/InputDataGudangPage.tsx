'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Package, Info, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Header } from '@/shared/components/layout/header';

// Tipe data untuk state form gudang
interface GudangForm {
    jenisTransaksi: string;
    namaBarang: string;
    jumlah: string;
    satuan: string;
    supplier: string;
    keterangan: string;
}

export function InputDataGudangPage() {
    const router = useRouter();

    // State awal
    const [form, setForm] = useState<GudangForm>({
        jenisTransaksi: 'Barang Masuk',
        namaBarang: '',
        jumlah: '',
        satuan: '',
        supplier: '',
        keterangan: ''
    });

    // Handle perubahan input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // Handle submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Data Gudang:', form);
        toast.success('Transaksi Gudang berhasil disubmit!', {
            description: 'Data telah tersimpan.',
        });
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
                    <h1 className="text-3xl font-bold text-gray-900">Input Data Gudang</h1>
                    <p className="text-gray-500 mt-1">Catat transaksi barang masuk atau keluar gudang.</p>
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <form onSubmit={handleSubmit}>
                        {/* Form Content */}
                        <div className="p-6 sm:p-8 space-y-6">

                            {/* Header Form Internal */}
                            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                                <div className="p-3 bg-purple-50 rounded-xl shrink-0">
                                    <Package className="w-6 h-6 text-purple-500" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800">Detail Transaksi Gudang</h2>
                                    <p className="text-sm text-gray-500">Isi detail transaksi barang.</p>
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

                            {/* Input: Jenis Transaksi */}
                            <div className="space-y-1.5">
                                <label htmlFor="jenisTransaksi" className="block text-sm font-medium text-gray-700">
                                    Jenis Transaksi <span className="text-red-500">*</span>
                                </label>
                                <select id="jenisTransaksi" name="jenisTransaksi" required value={form.jenisTransaksi} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all text-gray-700">
                                    <option value="Barang Masuk">🟢 Barang Masuk</option>
                                    <option value="Barang Keluar">🔴 Barang Keluar</option>
                                </select>
                            </div>

                            {/* Input: Nama Barang */}
                            <div className="space-y-1.5">
                                <label htmlFor="namaBarang" className="block text-sm font-medium text-gray-700">
                                    Nama Barang <span className="text-red-500">*</span>
                                </label>
                                <input type="text" id="namaBarang" name="namaBarang" required value={form.namaBarang} onChange={handleChange} placeholder="Contoh: Kabel NYY 3x4mm" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400" />
                            </div>

                            {/* Row: Jumlah & Satuan (Grid 2 Kolom) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Jumlah */}
                                <div className="space-y-1.5">
                                    <label htmlFor="jumlah" className="block text-sm font-medium text-gray-700">
                                        Jumlah <span className="text-red-500">*</span>
                                    </label>
                                    <input type="number" id="jumlah" name="jumlah" required min="1" value={form.jumlah} onChange={handleChange} placeholder="0" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400" />
                                </div>
                                {/* Satuan */}
                                <div className="space-y-1.5">
                                    <label htmlFor="satuan" className="block text-sm font-medium text-gray-700">
                                        Satuan <span className="text-red-500">*</span>
                                    </label>
                                    <select id="satuan" name="satuan" required value={form.satuan} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all text-gray-700">
                                        <option value="" disabled>Pilih satuan..</option>
                                        <option value="Pcs">Pcs</option>
                                        <option value="Unit">Unit</option>
                                        <option value="Meter">Meter</option>
                                        <option value="Roll">Roll</option>
                                        <option value="Set">Set</option>
                                        <option value="Box">Box</option>
                                    </select>
                                </div>
                            </div>

                            {/* Supplier (Opsional) */}
                            <div className="space-y-1.5">
                                <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">
                                    Supplier (Opsional)
                                </label>
                                <input type="text" id="supplier" name="supplier" value={form.supplier} onChange={handleChange} placeholder="Nama supplier barang" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400" />
                            </div>

                            {/* Keterangan */}
                            <div className="space-y-1.5">
                                <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700">
                                    Keterangan <span className="text-red-500">*</span>
                                </label>
                                <textarea id="keterangan" name="keterangan" required rows={4} value={form.keterangan} onChange={handleChange} placeholder="Keterangan tambahan mengenai transaksi..." className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 resize-none" />
                            </div>

                        </div>

                        {/* Form Footer */}
                        <div className="p-6 bg-gray-50 border-t border-gray-200">
                            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <Info className="w-5 h-5 text-gray-500 shrink-0" />
                                    <p className="text-sm text-gray-600">Transaksi gudang akan diverifikasi oleh supervisor sebelum update stock.</p>
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
