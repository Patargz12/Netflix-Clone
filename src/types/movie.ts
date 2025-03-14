export interface Movie {
    adult?: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language?: string;
    original_title?: string;
    overview?: string;
    popularity?: number;
    poster_path: string;
    release_date?: string;
    title: string;
    genres?: Genre[];
    video?: boolean;
    vote_average: number;
    vote_count?: number;
}

export interface MovieResponse {
    page: number;
    results: Movie[];
}

export interface MovieVideo {
    iso_639_1: string;
    iso_3166_1: string;
    name: string;
    key: string;
    site: string;
    size: number;
    type: string;
    official: boolean;
    published_at: string;
    id: string;
}

export interface MovieVideoResponse {
    id: number;
    results: MovieVideo[];
}

export interface Cast {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

export interface MovieDetails extends Movie {
    belongs_to_collection: {
        id: number;
        name: string;
        poster_path: string | null;
        backdrop_path: string | null;
    } | null;
    budget: number;
    genres: Genre[];
    homepage: string | null;
    imdb_id: string | null;
    production_companies: {
        id: number;
        logo_path: string | null;
        name: string;
        origin_country: string;
    }[];
    production_countries: {
        iso_3166_1: string;
        name: string;
    }[];
    revenue: number;
    runtime: number | null;
    spoken_languages: {
        english_name: string;
        iso_639_1: string;
        name: string;
    }[];
    status: string;
    tagline: string | null;
}

export interface MovieCredits {
    id: number;
    cast: Cast[];
}

export interface Genre {
    id: number;
    name: string;
}

