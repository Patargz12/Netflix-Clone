import { create } from 'zustand';
import { Movie } from '@/types/movie';

interface MovieStore {
    movies: Movie[];
    setMovies: (movies: Movie[]) => void;
    selectedMovie: Movie | null;
    setSelectedMovie: (movie: Movie | null) => void;
}

export const useMovieStore = create<MovieStore>((set) => ({
    movies: [],
    setMovies: (movies) => set({ movies }),
    selectedMovie: null,
    setSelectedMovie: (movie) => set({ selectedMovie: movie }),
}));