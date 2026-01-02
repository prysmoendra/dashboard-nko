"use client";

import React, { useState } from 'react';
import { 
  ArrowLeft, Users, UserPlus, Search, Edit, Trash2, 
  Shield, Building2, Briefcase, Zap, X, User, Mail, Save 
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // --- STATE MODAL (PENTING: KITA PAKAI 2 STATE TERPISAH) ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);   // Untuk Modal Tambah
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Untuk Modal Edit
  const [selectedUser, setSelectedUser] = useState<any>(null);   // Data user yang sedang diedit

  // --- DATA DUMMY ---
  const users = [
    {
      id: 1,
      name: "Admin PLN",
      email: "admin@pln.co.id",
      initial: "AP",
      role: "Super Admin",
      roleColor: "bg-red-50 text-red-600 border-red-100",
      unit: "UP3 Cimahi",
      bidang: "Distribusi",
    },
  ];

  const stats = [
    { label: "Total Users", value: 1, icon: Users, color: "text-blue-600" },
    { label: "Pegawai", value: 0, icon: null },
    { label: "Askabid", value: 0, icon: null },
    { label: "Kabid", value: 0, icon: null },
    { label: "Admin", value: 1, icon: null, highlight: "text-red-600" },
  ];

  // --- LOGIKA TOMBOL ---
  // 1. Saat tombol Edit ditekan
  const handleEditClick = (user: any) => {
    setSelectedUser(user);     // Simpan data user ini
    setIsEditModalOpen(true);  // Buka modal EDIT
  };

  // 2. Saat tombol Tambah ditekan
  const handleAddClick = () => {
    setIsAddModalOpen(true);   // Buka modal TAMBAH
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans relative">
      
      {/* ---------------- BAGIAN DASHBOARD (NAVIGASI, STATS, TABEL) ---------------- */}

      {/* Navigasi Atas */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="#" className="flex items-center text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
        </Link>
        <div className="h-6 w-px bg-gray-300"></div>
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1 rounded-md">
            <Zap className="w-3 h-3 text-white" fill="currentColor" />
          </div>
          <span className="font-bold text-gray-900 text-sm">Super Admin</span>
        </div>
      </div>

      {/* Header & Tombol Tambah */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-500">Kelola akses dan role pengguna PLN Dashboard Suite</p>
        </div>
        
        {/* TOMBOL PEMICU MODAL TAMBAH */}
        <button 
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          Tambah User
        </button>
      </div>

      {/* Statistik Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-28">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-gray-500">{stat.label}</span>
              {stat.icon && <stat.icon className="w-5 h-5 text-blue-600" />}
            </div>
            <h3 className={`text-3xl font-bold ${stat.highlight || "text-gray-900"}`}>
              {stat.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-2 rounded-xl border border-gray-200 mb-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" placeholder="Cari nama, email, atau unit..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:ring-0 focus:bg-gray-100 transition-colors"
          />
        </div>
      </div>

      {/* Tabel User */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-white">
          <h3 className="text-lg font-bold text-gray-900">Daftar Pengguna</h3>
          <p className="text-sm text-gray-500">{users.length} pengguna dari {users.length} total</p>
        </div>
        <div className="p-6 space-y-4">
          {users.map((user) => (
            <div key={user.id} className="border border-gray-200 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {user.initial}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{user.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3"/> {user.email}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${user.roleColor}`}><Shield className="w-3 h-3 mr-1" /> {user.role}</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-white text-gray-700 border border-gray-300"><Building2 className="w-3 h-3 mr-1" /> {user.unit}</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200"><Briefcase className="w-3 h-3 mr-1" /> {user.bidang}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto justify-end">
                {/* TOMBOL EDIT (Memicu Modal Edit) */}
                <button 
                  onClick={() => handleEditClick(user)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button className="flex items-center gap-2 px-3 py-2 border border-red-100 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* ---------------- MODAL 1: TAMBAH USER BARU (FORM KOSONG) ---------------- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Header Modal Tambah */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
               <div className="flex items-center gap-3">
                 <div className="bg-blue-600 p-2 rounded-lg text-white">
                   <UserPlus className="w-5 h-5" />
                 </div>
                 <div>
                   <h2 className="text-lg font-bold text-gray-900">Tambah User Baru</h2>
                   <p className="text-xs text-gray-500">Masukkan detail pengguna baru...</p>
                 </div>
               </div>
               <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                 <X className="w-5 h-5" />
               </button>
            </div>

            {/* Content Form Tambah (PLACEHOLDER) */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                     <User className="w-3.5 h-3.5" /> Nama Lengkap <span className="text-red-500">*</span>
                   </label>
                   {/* Pakai Placeholder */}
                   <input type="text" placeholder="Contoh: Ahmad Fadillah" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                     <Mail className="w-3.5 h-3.5" /> Email PLN <span className="text-red-500">*</span>
                   </label>
                   <input type="email" placeholder="nama@pln.co.id" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                     <Shield className="w-3.5 h-3.5" /> Role / Jabatan <span className="text-red-500">*</span>
                   </label>
                   <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 text-gray-500">
                     <option>Pilih role pengguna</option>
                     <option>Super Admin</option>
                     <option>Kepala Bidang</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                     <Building2 className="w-3.5 h-3.5" /> Unit Kerja <span className="text-red-500">*</span>
                   </label>
                   <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 text-gray-500">
                     <option>Pilih unit kerja</option>
                     <option>UP3 Cimahi</option>
                   </select>
                 </div>
              </div>

              <div className="mb-6">
                 <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                   <Briefcase className="w-3.5 h-3.5" /> Bidang <span className="text-red-500">*</span>
                 </label>
                 <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 text-gray-500">
                   <option>Pilih bidang</option>
                   <option>Distribusi</option>
                 </select>
              </div>

              {/* Info Box Biru */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                 <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                 <div>
                   <h4 className="text-sm font-bold text-blue-700 mb-1">Informasi Penting:</h4>
                   <ul className="text-xs text-blue-600 space-y-1 list-disc list-inside">
                     <li>Email harus menggunakan domain @pln.co.id</li>
                     <li>Setiap role memiliki akses dan wewenang yang berbeda</li>
                     <li>User akan langsung aktif setelah ditambahkan</li>
                   </ul>
                 </div>
              </div>
            </div>

            {/* Footer Modal Tambah */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">Batal</button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm">
                <UserPlus className="w-4 h-4" /> Tambah User
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ---------------- MODAL 2: EDIT USER (FORM TERISI / PRE-FILLED) ---------------- */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Header Modal Edit */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
               <div className="flex items-center gap-3">
                 <div className="bg-blue-50 p-2 rounded-lg">
                   <Edit className="w-5 h-5 text-blue-600" />
                 </div>
                 <div>
                   <h2 className="text-lg font-bold text-gray-900">Edit User</h2>
                   <p className="text-xs text-gray-500">Perbarui informasi pengguna...</p>
                 </div>
               </div>
               <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                 <X className="w-5 h-5" />
               </button>
            </div>

            {/* Content Modal Edit (DEFAULT VALUE) */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                     <User className="w-3.5 h-3.5" /> Nama Lengkap <span className="text-red-500">*</span>
                   </label>
                   {/* Pakai DefaultValue dari selectedUser */}
                   <input type="text" defaultValue={selectedUser.name} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                     <Mail className="w-3.5 h-3.5" /> Email PLN <span className="text-red-500">*</span>
                   </label>
                   <input type="email" defaultValue={selectedUser.email} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                     <Shield className="w-3.5 h-3.5" /> Role / Jabatan <span className="text-red-500">*</span>
                   </label>
                   <select defaultValue={selectedUser.role} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 text-gray-600">
                     <option>Super Admin</option>
                     <option>Pegawai</option>
                     <option>Kepala Bidang</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                     <Building2 className="w-3.5 h-3.5" /> Unit Kerja <span className="text-red-500">*</span>
                   </label>
                   <select defaultValue={selectedUser.unit} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 text-gray-600">
                     <option>UP3 Cimahi</option>
                     <option>ULP Ciko</option>
                   </select>
                 </div>
              </div>

              <div className="mb-6">
                 <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                   <Briefcase className="w-3.5 h-3.5" /> Bidang <span className="text-red-500">*</span>
                 </label>
                 <select defaultValue={selectedUser.bidang} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 text-gray-600">
                   <option>Distribusi</option>
                   <option>Konstruksi</option>
                 </select>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                 <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                 <div>
                   <h4 className="text-sm font-bold text-blue-700 mb-1">Informasi Penting:</h4>
                   <ul className="text-xs text-blue-600 space-y-1 list-disc list-inside">
                     <li>Perubahan data akan langsung diterapkan</li>
                     <li>User akan menerima notifikasi jika email diubah</li>
                   </ul>
                 </div>
              </div>
            </div>

            {/* Footer Modal Edit */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium">Batal</button>
              <button onClick={() => setIsEditModalOpen(false)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm">
                  <Edit className="w-4 h-4" /> Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}