import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { MovieGrid } from '@/components//Movie/MovieGrid';
import AuthNavbar from '@/components/Layouts/AuthNavbar';
import { FeaturedMovie } from '@/components/Movie/FeaturedMovie';
import { MovieDialog } from '@/components/Movie/MovieDialog';
import { PopularGrid } from '@/components/Movie/PopularGrid';
import { useMovieStore } from '@/store/movieStore';
import { useSearchStore } from '@/store/searchStore';
import { Movie, MovieResponse } from '@/types/movie';

const API_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZjE0OGFmYzBmNTI3MzViYzViMzllYmMwNmU3ZDFkYiIsIm5iZiI6MTY2MjM0MjYzMi45NjcsInN1YiI6IjYzMTU1NWU4OTQwOGVjMDA3YmVkM2EwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3nQoagcQ9Vok-Gll6iOjVMiCZgtsyM5K8VbRjw1WGbE';

const fetchMovies = async (endpoint: string): Promise<MovieResponse> => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_TOKEN}`,
    },
  };

  const response = await fetch(endpoint, options);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};

const searchMovies = async (query: string): Promise<Movie[]> => {
  if (!query) {
    return [];
  }

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_TOKEN}`,
    },
  };

  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
      query
    )}&language=en-US&page=1`,
    options
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data.results;
};

const getSimilarMovies = async (movieId: number): Promise<Movie[]> => {
  if (!movieId) {
    return [];
  }

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_TOKEN}`,
    },
  };

  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/similar?language=en-US&page=1`,
    options
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data.results;
};

const getRecommendedMovies = async (movieId: number): Promise<Movie[]> => {
  if (!movieId) {
    return [];
  }

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_TOKEN}`,
    },
  };

  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/recommendations?language=en-US&page=1`,
    options
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data.results;
};

export const MenuPage = () => {
  const { setMovies, selectedMovie, setSelectedMovie } = useMovieStore();
  const { searchQuery } = useSearchStore();
  const [showMovieDialog, setShowMovieDialog] = React.useState(false);
  const [dialogMovie, setDialogMovie] = React.useState<Movie | null>(null);

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['search-movies', searchQuery],
    queryFn: () => searchMovies(searchQuery),
    enabled: !!searchQuery,
  });

  const { data: similarMovies } = useQuery({
    queryKey: ['similar-movies', searchResults?.[0]?.id],
    queryFn: () => getSimilarMovies(searchResults?.[0]?.id as number),
    enabled: !!searchResults?.[0]?.id && !!searchQuery,
  });

  const { data: recommendedMovies } = useQuery({
    queryKey: ['recommended-movies', searchResults?.[0]?.id],
    queryFn: () => getRecommendedMovies(searchResults?.[0]?.id as number),
    enabled: !!searchResults?.[0]?.id && !!searchQuery,
  });

  const { data: popularMovies, isLoading: isLoadingPopular } = useQuery({
    queryKey: ['popular-movies'],
    queryFn: () => fetchMovies('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1'),
  });

  const { data: topRatedMovies } = useQuery({
    queryKey: ['top-rated-movies'],
    queryFn: () =>
      fetchMovies('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1'),
  });

  const { data: upcomingMovies } = useQuery({
    queryKey: ['upcoming-movies'],
    queryFn: () => fetchMovies('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1'),
  });

  const { data: nowPlayingMovies } = useQuery({
    queryKey: ['now-playing-movies'],
    queryFn: () =>
      fetchMovies('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1'),
  });

  const handleMovieSelect = (movie: Movie) => {
    setDialogMovie(movie);
    setShowMovieDialog(true);
  };

  // Update store when data changes
  React.useEffect(() => {
    if (searchQuery && searchResults) {
      setMovies(searchResults);
      if (searchResults.length > 0) {
        setSelectedMovie(searchResults[0]);
      }
    } else if (popularMovies?.results) {
      setMovies(popularMovies.results);
      if (!selectedMovie) {
        setSelectedMovie(popularMovies.results[0]);
      }
    }
  }, [popularMovies, searchResults, searchQuery, selectedMovie, setMovies, setSelectedMovie]);

  // Loading states and error handling
  if (isLoadingPopular && !searchQuery) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin text-primary-500 rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  if (!popularMovies?.results && !searchResults) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error loading movies</h2>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AuthNavbar />
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        {selectedMovie && (
          <>
            <FeaturedMovie
              movie={selectedMovie}
              onPlayClick={() => handleMovieSelect(selectedMovie)}
            />
            {dialogMovie && (
              <MovieDialog
                movie={dialogMovie}
                open={showMovieDialog}
                onOpenChange={setShowMovieDialog}
              />
            )}
          </>
        )}

        <div className="relative z-10 -mt-32 px-4 sm:px-6 lg:px-14">
          {searchQuery ? (
            <div className="">
              <MovieGrid
                title={`Top Results for "${searchQuery}"`}
                movies={searchResults || []}
                onMovieSelect={handleMovieSelect}
                onPlayClick={() => setShowMovieDialog(true)}
                usePosters
                isLoading={isSearching}
              />

              {similarMovies && similarMovies.length > 0 && (
                <MovieGrid
                  title="More Like This"
                  movies={similarMovies}
                  onMovieSelect={handleMovieSelect}
                  onPlayClick={() => setShowMovieDialog(true)}
                  usePosters
                />
              )}

              {recommendedMovies && recommendedMovies.length > 0 && (
                <MovieGrid
                  title="Recommended"
                  movies={recommendedMovies}
                  onMovieSelect={handleMovieSelect}
                  onPlayClick={() => setShowMovieDialog(true)}
                  usePosters
                />
              )}
            </div>
          ) : (
            <>
              <PopularGrid
                title="Popular Now"
                movies={popularMovies?.results || []}
                onMovieSelect={handleMovieSelect}
                usePosters
              />

              {topRatedMovies?.results && (
                <MovieGrid
                  title="Top Rated"
                  movies={topRatedMovies.results}
                  onMovieSelect={handleMovieSelect}
                  onPlayClick={() => setShowMovieDialog(true)}
                  usePosters
                />
              )}

              {upcomingMovies?.results && (
                <MovieGrid
                  title="Upcoming"
                  movies={upcomingMovies.results}
                  onMovieSelect={handleMovieSelect}
                  onPlayClick={() => setShowMovieDialog(true)}
                  usePosters
                />
              )}

              {nowPlayingMovies?.results && (
                <MovieGrid
                  title="Now Playing"
                  movies={nowPlayingMovies.results}
                  onMovieSelect={handleMovieSelect}
                  onPlayClick={() => setShowMovieDialog(true)}
                  usePosters
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};
