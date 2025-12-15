'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Select Component - shadcn/ui style dropdown
 */

interface SelectContextValue {
    value: string;
    onChange: (value: string) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextValue | undefined>(undefined);

const useSelectContext = () => {
    const context = React.useContext(SelectContext);
    if (!context) {
        throw new Error('Select components must be used within Select');
    }
    return context;
};

interface SelectProps {
    value: string;
    onChange: (value: string) => void;
    children: React.ReactNode;
}

export function Select({ value, onChange, children }: SelectProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <SelectContext.Provider value={{ value, onChange, open, setOpen }}>
            <div className="relative">{children}</div>
        </SelectContext.Provider>
    );
}

interface SelectTriggerProps {
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export function SelectTrigger({ placeholder = 'Pilih...', disabled = false, className = '' }: SelectTriggerProps) {
    const { value, open, setOpen } = useSelectContext();
    const displayValue = value || placeholder;

    return (
        <button
            type="button"
            disabled={disabled}
            onClick={() => setOpen(!open)}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all flex items-center justify-between bg-white hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
            <span className={value ? 'text-gray-900' : 'text-gray-500'}>{displayValue}</span>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
    );
}

interface SelectContentProps {
    children: React.ReactNode;
}

export function SelectContent({ children }: SelectContentProps) {
    const { open, setOpen } = useSelectContext();
    const ref = React.useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open, setOpen]);

    if (!open) return null;

    return (
        <div
            ref={ref}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
        >
            {children}
        </div>
    );
}

interface SelectItemProps {
    value: string;
    children: React.ReactNode;
}

export function SelectItem({ value, children }: SelectItemProps) {
    const { value: selectedValue, onChange, setOpen } = useSelectContext();
    const isSelected = selectedValue === value;

    return (
        <button
            type="button"
            onClick={() => {
                onChange(value);
                setOpen(false);
            }}
            className={`w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors ${isSelected ? 'bg-blue-100 text-blue-900 font-medium' : 'text-gray-900'
                }`}
        >
            {children}
        </button>
    );
}
