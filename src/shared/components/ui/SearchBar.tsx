import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

/**
 * SearchBar - Reusable search input component
 * Provides consistent search UX across all features
 */
export function SearchBar({
    value,
    onChange,
    placeholder = "Search..."
}: SearchBarProps) {
    return (
        <div className="bg-white p-2 rounded-xl border border-gray-200 mb-6 shadow-sm">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:ring-0 focus:bg-gray-100 transition-colors"
                />
            </div>
        </div>
    );
}
