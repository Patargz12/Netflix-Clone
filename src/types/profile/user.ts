export interface Profile {
    id: string;
    name: string;
    imageUrl?: string;
}

export interface ProfilesState {
    isLoading: boolean;
    error: string | null;
    profiles: Profile[];
}