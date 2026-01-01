import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backUrl?: string; // Opsional
}

export default function PageHeader({ 
  title, 
  subtitle, 
  backUrl = "/dashboard/kepala-bidang" 
}: PageHeaderProps) {
  return (
    <div className="mb-8">
      {/* Tombol Kembali */}
      <Link 
        href={backUrl} 
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4 font-medium"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali
      </Link>

      {/* Judul & Subjudul */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-gray-500 mt-2 text-lg">{subtitle}</p>}
      </div>
    </div>
  );
}