import { create } from 'zustand';

/**
 * Data submissions local state
 * For filters, sorting, pagination, etc.
 */
interface DataSubmissionsState {
    filter: string;
    setFilter: (filter: string) => void;
}

export const useDataSubmissionsStore = create<DataSubmissionsState>((set) => ({
    filter: 'all',
    setFilter: (filter) => set({ filter }),
}));
