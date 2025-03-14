
import { create } from 'zustand';
import type { TV } from '@/types/tv';

interface TVStore {
    tvShows: TV[];
    setTVShows: (tvShows: TV[]) => void;
    selectedShow: TV | null;
    setSelectedShow: (show: TV | null) => void;
}

export const useTVStore = create<TVStore>((set) => ({
    tvShows: [],
    setTVShows: (tvShows) => set({ tvShows }),
    selectedShow: null,
    setSelectedShow: (show) => set({ selectedShow: show }),
}));
