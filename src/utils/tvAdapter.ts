
import type { TV, TVAsMovie } from '@/types/tv';
import type { Movie } from '@/types/movie';

// Adapt TV show data to match Movie interface structure for component reuse
export function adaptTVToMovie(tvShow: TV): TVAsMovie {
    return {
        id: tvShow.id,
        title: tvShow.name,
        overview: tvShow.overview,
        poster_path: tvShow.poster_path,
        backdrop_path: tvShow.backdrop_path,
        vote_average: tvShow.vote_average,
        release_date: tvShow.first_air_date,
        genre_ids: tvShow.genre_ids,
        media_type: 'tv',
        original_name: tvShow.name,
    };
}

export function adaptTVArrayToMovies(tvShows: TV[]): TVAsMovie[] {
    return tvShows.map(adaptTVToMovie);
}

// Function to get movieId or tvId with media type
export function getMediaId(item: Movie | TVAsMovie): { id: number; mediaType: 'movie' | 'tv' } {
    if ('media_type' in item && item.media_type === 'tv') {
        return { id: item.id, mediaType: 'tv' };
    }
    // For search results, they may not have media_type explicitly set
    // Check if the item has original_name which is specific to TV shows
    if ('original_name' in item && item.original_name && !('media_type' in item)) {
        return { id: item.id, mediaType: 'tv' };
    }
    return { id: item.id, mediaType: 'movie' };
}

// Function to get the correct API endpoint based on media type
export function getMediaEndpoint(item: Movie | TVAsMovie, endpoint: string): string {
    const { id, mediaType } = getMediaId(item);
    return `https://api.themoviedb.org/3/${mediaType}/${id}${endpoint}`;
}