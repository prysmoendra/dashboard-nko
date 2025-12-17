// shared/components/layout/header/Header.tsx
import React from 'react';
import { Zap } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-8 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 p-1.5 rounded-lg">
            <Zap className="text-white w-5 h-5" fill="currentColor" />
        </div>
        <span className="font-bold text-gray-900 text-lg">PLN Dashboard Suite</span>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
            <p className="text-sm text-gray-500">Selamat datang,</p>
            <p className="text-sm font-semibold text-gray-900">Demo User</p>
        </div>
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            D
        </div>
      </div>
    </header>
  );
};

export default Header;
