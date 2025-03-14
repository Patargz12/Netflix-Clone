export interface TV {
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    vote_average: number;
    first_air_date: string;
    genre_ids: number[];
}

export interface TVResponse {
    page: number;
    results: TV[];
    total_pages: number;
    total_results: number;
}

export interface TVDetails extends TV {
    genres: { id: number; name: string }[];
    number_of_seasons: number;
    number_of_episodes: number;
    episode_run_time: number[];
    status: string;
    in_production: boolean;
    created_by: { id: number; name: string; profile_path: string }[];
}

export interface TVCast {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

// Type for adapting TV show data to Movie interface for reusing components
export interface TVAsMovie {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    vote_average: number;
    release_date: string;
    genre_ids: number[];
    media_type: 'tv';
    original_name?: string;
}
