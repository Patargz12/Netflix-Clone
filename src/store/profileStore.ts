import { create } from 'zustand';
import { Profile } from "@/types/profile/user";

interface ProfileState {
    profile: Profile | null;
    setProfile: (profile: Profile) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
    profile: null,
    setProfile: (profile: Profile) => set({ profile }),
}))

