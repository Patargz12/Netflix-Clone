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

// Search movies from TMDB
const searchMovies = async (query: string): Promise<Movie[]> => {
  if (!query) return [];

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

// Get similar movies
const getSimilarMovies = async (movieId: number): Promise<Movie[]> => {
  if (!movieId) return [];

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

// Get recommended movies
const getRecommendedMovies = async (movieId: number): Promise<Movie[]> => {
  if (!movieId) return [];

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

// Genre IDs from TMDB
const GENRE_IDS = {
  horror: 27,
  drama: 18,
  romance: 10749,
  animation: 16,
  family: 10751,
  adventure: 12,
  fantasy: 14,
  comedy: 35,
};

export const MenuPage = () => {
  const { setMovies, selectedMovie, setSelectedMovie } = useMovieStore();
  const { searchQuery } = useSearchStore();
  const [showMovieDialog, setShowMovieDialog] = React.useState(false);

  // Fetch search results
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['search-movies', searchQuery],
    queryFn: () => searchMovies(searchQuery),
    enabled: !!searchQuery,
  });

  // Fetch similar movies based on the first search result
  const { data: similarMovies } = useQuery({
    queryKey: ['similar-movies', searchResults?.[0]?.id],
    queryFn: () => getSimilarMovies(searchResults?.[0]?.id),
    enabled: !!searchResults?.[0]?.id && !!searchQuery,
  });

  // Fetch recommended movies based on the first search result
  const { data: recommendedMovies } = useQuery({
    queryKey: ['recommended-movies', searchResults?.[0]?.id],
    queryFn: () => getRecommendedMovies(searchResults?.[0]?.id),
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

  const { data: horrorMovies } = useQuery({
    queryKey: ['horror-movies'],
    queryFn: () =>
      fetchMovies(
        `https://api.themoviedb.org/3/discover/movie?with_genres=${GENRE_IDS.horror}&language=en-US&page=1`
      ),
  });

  const { data: dramaMovies } = useQuery({
    queryKey: ['drama-movies'],
    queryFn: () =>
      fetchMovies(
        `https://api.themoviedb.org/3/discover/movie?with_genres=${GENRE_IDS.drama}&language=en-US&page=1`
      ),
  });

  const { data: romanceMovies } = useQuery({
    queryKey: ['romance-movies'],
    queryFn: () =>
      fetchMovies(
        `https://api.themoviedb.org/3/discover/movie?with_genres=${GENRE_IDS.romance}&language=en-US&page=1`
      ),
  });

  const { data: animeMovies } = useQuery({
    queryKey: ['anime-movies'],
    queryFn: () =>
      fetchMovies(
        `https://api.themoviedb.org/3/discover/movie?with_genres=${GENRE_IDS.animation}&language=en-US&page=1`
      ),
  });

  const { data: familyMovies } = useQuery({
    queryKey: ['family-movies'],
    queryFn: () =>
      fetchMovies(
        `https://api.themoviedb.org/3/discover/movie?with_genres=${GENRE_IDS.family}&language=en-US&page=1`
      ),
  });

  const { data: adventureMovies } = useQuery({
    queryKey: ['adventure-movies'],
    queryFn: () =>
      fetchMovies(
        `https://api.themoviedb.org/3/discover/movie?with_genres=${GENRE_IDS.adventure}&language=en-US&page=1`
      ),
  });

  const { data: fantasyMovies } = useQuery({
    queryKey: ['fantasy-movies'],
    queryFn: () =>
      fetchMovies(
        `https://api.themoviedb.org/3/discover/movie?with_genres=${GENRE_IDS.fantasy}&language=en-US&page=1`
      ),
  });

  const { data: comedyMovies } = useQuery({
    queryKey: ['comedy-movies'],
    queryFn: () =>
      fetchMovies(
        `https://api.themoviedb.org/3/discover/movie?with_genres=${GENRE_IDS.comedy}&language=en-US&page=1`
      ),
  });

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

  // Loading state for initial load only
  if (isLoadingPopular && !searchQuery) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
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
            <FeaturedMovie movie={selectedMovie} onPlayClick={() => setShowMovieDialog(true)} />
            <MovieDialog
              movie={selectedMovie}
              open={showMovieDialog}
              onOpenChange={setShowMovieDialog}
            />
          </>
        )}

        <div className="relative z-10 -mt-32 px-4 sm:px-6 lg:px-14">
          {searchQuery ? (
            <div className="space-y-8">
              <MovieGrid
                title={`Top Results for "${searchQuery}"`}
                movies={searchResults || []}
                onMovieSelect={setSelectedMovie}
                onPlayClick={() => setShowMovieDialog(true)}
                usePosters
                isLoading={isSearching}
              />

              {similarMovies && similarMovies.length > 0 && (
                <MovieGrid
                  title="More Like This"
                  movies={similarMovies}
                  onMovieSelect={setSelectedMovie}
                  onPlayClick={() => setShowMovieDialog(true)}
                  usePosters
                />
              )}

              {recommendedMovies && recommendedMovies.length > 0 && (
                <MovieGrid
                  title="Recommended"
                  movies={recommendedMovies}
                  onMovieSelect={setSelectedMovie}
                  onPlayClick={() => setShowMovieDialog(true)}
                  usePosters
                />
              )}
            </div>
          ) : (
            <>
              <PopularGrid
                title="Popular Now"
                movies={popularMovies.results}
                onMovieSelect={setSelectedMovie}
                usePosters
              />

              {topRatedMovies?.results && (
                <MovieGrid
                  title="Top Rated"
                  movies={topRatedMovies.results}
                  onMovieSelect={setSelectedMovie}
                  onPlayClick={() => setShowMovieDialog(true)}
                  usePosters
                />
              )}

              {upcomingMovies?.results && (
                <MovieGrid
                  title="Coming Soon"
                  movies={upcomingMovies.results}
                  onMovieSelect={setSelectedMovie}
                  onPlayClick={() => setShowMovieDialog(true)}
                  usePosters
                />
              )}

              {familyMovies?.results && (
                <MovieGrid
                  title="Family & Kids"
                  movies={familyMovies.results}
                  onMovieSelect={setSelectedMovie}
                  onPlayClick={() => setShowMovieDialog(true)}
                  usePosters
                />
              )}

              {adventureMovies?.results && (
                <MovieGrid
                  title="Adventure"
                  movies={adventureMovies.results}
                  onMovieSelect={setSelectedMovie}
                  onPlayClick={() => setShowMovieDialog(true)}
                  usePosters
                />
              )}

              {fantasyMovies?.results && (
                <MovieGrid
                  title="Fantasy"
                  movies={fantasyMovies.results}
                  onMovieSelect={setSelectedMovie}
                  onPlayClick={() => setShowMovieDialog(true)}
                  usePosters
                />
              )}

              {horrorMovies?.results && (
                <MovieGrid
                  title="Horror"
                  movies={horrorMovies.results}
                  onMovieSelect={setSelectedMovie}
                  onPlayClick={() => setShowMovieDialog(true)}
                  usePosters
                />
              )}

              {dramaMovies?.results && (
                <MovieGrid
                  title="Drama"
                  movies={dramaMovies.results}
                  onMovieSelect={setSelectedMovie}
                  onPlayClick={() => setShowMovieDialog(true)}
                  usePosters
                />
              )}

              {romanceMovies?.results && (
                <MovieGrid
                  title="Romance"
                  movies={romanceMovies.results}
                  onMovieSelect={setSelectedMovie}
                  onPlayClick={() => setShowMovieDialog(true)}
                  usePosters
                />
              )}

              {animeMovies?.results && (
                <MovieGrid
                  title="Animation"
                  movies={animeMovies.results}
                  onMovieSelect={setSelectedMovie}
                  onPlayClick={() => setShowMovieDialog(true)}
                  usePosters
                />
              )}

              {comedyMovies?.results && (
                <MovieGrid
                  title="Comedy"
                  movies={comedyMovies.results}
                  onMovieSelect={setSelectedMovie}
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
