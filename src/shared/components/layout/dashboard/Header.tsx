// shared/components/layout/header/Header.tsx

import React from 'react';
import { Zap } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown'; // Import dari folder yang sama

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-8 flex justify-between items-center sticky top-0 z-40 w-full">
      {/* Bagian Kiri: Logo */}
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 p-1.5 rounded-lg">
            <Zap className="text-white w-5 h-5" fill="currentColor" />
        </div>
        <span className="font-bold text-gray-900 text-lg">PLN Dashboard Suite</span>
      </div>
      
      {/* Bagian Kanan: Profile Dropdown */}
      <div className="flex items-center">
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Header;