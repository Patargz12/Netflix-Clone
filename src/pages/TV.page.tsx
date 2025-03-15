import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import AuthNavbar from '@/components/Layouts/AuthNavbar';
import { FeaturedMovie } from '@/components/Movie/FeaturedMovie';
import { MovieDialog } from '@/components/Movie/MovieDialog';
import { MovieGrid } from '@/components/Movie/MovieGrid';
import { PopularGrid } from '@/components/Movie/PopularGrid';
import { useSearchStore } from '@/store/searchStore';
import { useTVStore } from '@/store/tvStore';
import type { TV, TVResponse } from '@/types/tv';
import { adaptTVArrayToMovies, adaptTVToMovie, getMediaId } from '@/utils/tvAdapter';

const API_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZjE0OGFmYzBmNTI3MzViYzViMzllYmMwNmU3ZDFkYiIsIm5iZiI6MTY2MjM0MjYzMi45NjcsInN1YiI6IjYzMTU1NWU4OTQwOGVjMDA3YmVkM2EwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3nQoagcQ9Vok-Gll6iOjVMiCZgtsyM5K8VbRjw1WGbE';

const fetchTVShows = async (endpoint: string): Promise<TVResponse> => {
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

const searchTVShows = async (query: string): Promise<TV[]> => {
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
    `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(
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

const getSimilarTVShows = async (tvId: number): Promise<TV[]> => {
  if (!tvId) {
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
    `https://api.themoviedb.org/3/tv/${tvId}/similar?language=en-US&page=1`,
    options
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data.results;
};

const getRecommendedTVShows = async (tvId: number): Promise<TV[]> => {
  if (!tvId) {
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
    `https://api.themoviedb.org/3/tv/${tvId}/recommendations?language=en-US&page=1`,
    options
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data.results;
};

const TV_GENRE_IDS = {
  drama: 18,
  comedy: 35,
  scifi: 10765,
  action: 10759,
  crime: 80,
  documentary: 99,
  family: 10751,
  kids: 10762,
  mystery: 9648,
  reality: 10764,
  fantasy: 10765,
};

export const TVPage = () => {
  const { setTVShows, selectedShow, setSelectedShow } = useTVStore();
  const { searchQuery } = useSearchStore();
  const [showDialog, setShowDialog] = useState(false);
  const [dialogShow, setDialogShow] = useState<TV | null>(null);

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['search-tv', searchQuery],
    queryFn: () => searchTVShows(searchQuery),
    enabled: !!searchQuery,
  });

  const { data: similarShows } = useQuery({
    queryKey: ['similar-tvshows', searchResults?.[0]?.id],
    queryFn: () => getSimilarTVShows(searchResults?.[0]?.id as number),
    enabled: !!searchResults?.[0]?.id && !!searchQuery,
  });

  const { data: recommendedShows } = useQuery({
    queryKey: ['recommended-tvshows', searchResults?.[0]?.id],
    queryFn: () => getRecommendedTVShows(searchResults?.[0]?.id as number),
    enabled: !!searchResults?.[0]?.id && !!searchQuery,
  });

  const { data: popularShows, isLoading: isLoadingPopular } = useQuery({
    queryKey: ['popular-tvshows'],
    queryFn: () => fetchTVShows('https://api.themoviedb.org/3/tv/popular?language=en-US&page=1'),
  });

  const { data: topRatedShows } = useQuery({
    queryKey: ['top-rated-tvshows'],
    queryFn: () => fetchTVShows('https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1'),
  });

  const { data: airingTodayShows } = useQuery({
    queryKey: ['airing-today-tvshows'],
    queryFn: () =>
      fetchTVShows('https://api.themoviedb.org/3/tv/airing_today?language=en-US&page=1'),
  });

  const { data: dramaShows } = useQuery({
    queryKey: ['drama-tvshows'],
    queryFn: () =>
      fetchTVShows(
        `https://api.themoviedb.org/3/discover/tv?with_genres=${TV_GENRE_IDS.drama}&language=en-US&page=1`
      ),
  });

  const { data: comedyShows } = useQuery({
    queryKey: ['comedy-tvshows'],
    queryFn: () =>
      fetchTVShows(
        `https://api.themoviedb.org/3/discover/tv?with_genres=${TV_GENRE_IDS.comedy}&language=en-US&page=1`
      ),
  });

  const { data: scifiShows } = useQuery({
    queryKey: ['scifi-tvshows'],
    queryFn: () =>
      fetchTVShows(
        `https://api.themoviedb.org/3/discover/tv?with_genres=${TV_GENRE_IDS.scifi}&language=en-US&page=1`
      ),
  });

  const { data: actionShows } = useQuery({
    queryKey: ['action-tvshows'],
    queryFn: () =>
      fetchTVShows(
        `https://api.themoviedb.org/3/discover/tv?with_genres=${TV_GENRE_IDS.action}&language=en-US&page=1`
      ),
  });

  const { data: crimeShows } = useQuery({
    queryKey: ['crime-tvshows'],
    queryFn: () =>
      fetchTVShows(
        `https://api.themoviedb.org/3/discover/tv?with_genres=${TV_GENRE_IDS.crime}&language=en-US&page=1`
      ),
  });

  const { data: familyShows } = useQuery({
    queryKey: ['family-tvshows'],
    queryFn: () =>
      fetchTVShows(
        `https://api.themoviedb.org/3/discover/tv?with_genres=${TV_GENRE_IDS.family}&language=en-US&page=1`
      ),
  });

  useEffect(() => {
    if (searchQuery && searchResults) {
      setTVShows(searchResults);
      if (searchResults.length > 0) {
        setSelectedShow(searchResults[0]);
      }
    } else if (popularShows?.results) {
      setTVShows(popularShows.results);
      if (!selectedShow) {
        setSelectedShow(popularShows.results[0]);
      }
    }
  }, [popularShows, searchResults, searchQuery, selectedShow, setTVShows, setSelectedShow]);

  const handleMovieSelect = (movie: TV) => {
    setSelectedShow(movie);
    setDialogShow(movie);
    setShowDialog(true);
  };

  const handleFeaturedPlayClick = () => {
    if (selectedShow) {
      handleMovieSelect(selectedShow);
    }
  };
  if (isLoadingPopular && !searchQuery) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin text-primary-500 rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  if (!popularShows?.results && !searchResults) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error loading TV shows</h2>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AuthNavbar />
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        {selectedShow && (
          <>
            <FeaturedMovie
              movie={adaptTVToMovie(selectedShow)}
              onPlayClick={handleFeaturedPlayClick}
            />
            {dialogShow && (
              <MovieDialog
                movie={adaptTVToMovie(dialogShow)}
                open={showDialog}
                onOpenChange={setShowDialog}
              />
            )}
          </>
        )}

        <div className="relative z-10 -mt-32 px-4 sm:px-6 lg:px-14">
          {searchQuery ? (
            <div className="">
              <MovieGrid
                title={`Top Results for "${searchQuery}"`}
                movies={adaptTVArrayToMovies(searchResults || [])}
                onMovieSelect={(movie) => {
                  // FIXED: Find the correct TV show from search results and use handleMovieSelect
                  const tvShow = searchResults?.find((show) => show.id === movie.id);
                  if (tvShow) {
                    handleMovieSelect(tvShow);
                  }
                }}
                onPlayClick={() => {
                  if (dialogShow) {
                    setShowDialog(true);
                  }
                }}
                usePosters
                isLoading={isSearching}
              />

              {similarShows && similarShows.length > 0 && (
                <MovieGrid
                  title="More Like This"
                  movies={adaptTVArrayToMovies(similarShows)}
                  onMovieSelect={(movie) => {
                    // FIXED: Find the correct TV show from similarShows (not searchResults)
                    // This was a critical bug in the original code
                    const tvShow = similarShows.find((show) => show.id === movie.id);
                    if (tvShow) {
                      handleMovieSelect(tvShow);
                    }
                  }}
                  onPlayClick={() => {
                    if (dialogShow) {
                      setShowDialog(true);
                    }
                  }}
                  usePosters
                />
              )}

              {recommendedShows && recommendedShows.length > 0 && (
                <MovieGrid
                  title="Recommended"
                  movies={adaptTVArrayToMovies(recommendedShows)}
                  onMovieSelect={(movie) => {
                    // FIXED: Find the correct TV show from recommendedShows (not searchResults)
                    // This was a critical bug in the original code
                    const tvShow = recommendedShows.find((show) => show.id === movie.id);
                    if (tvShow) {
                      handleMovieSelect(tvShow);
                    }
                  }}
                  onPlayClick={() => {
                    if (dialogShow) {
                      setShowDialog(true);
                    }
                  }}
                  usePosters
                />
              )}
            </div>
          ) : (
            <>
              <MovieGrid
                title="Popular TV Shows"
                movies={adaptTVArrayToMovies(popularShows?.results || [])}
                onMovieSelect={(movie) => {
                  // FIXED: Find the correct TV show from popularShows (not searchResults)
                  // This was a critical bug in the original code
                  const tvShow = popularShows?.results.find((show) => show.id === movie.id);
                  if (tvShow) {
                    handleMovieSelect(tvShow);
                  }
                }}
                onPlayClick={() => {
                  if (dialogShow) {
                    setShowDialog(true);
                  }
                }}
                usePosters
              />

              {topRatedShows?.results && (
                <MovieGrid
                  title="Top Rated"
                  movies={adaptTVArrayToMovies(topRatedShows.results)}
                  onMovieSelect={(movie) => {
                    // FIXED: Use handleMovieSelect to ensure both selectedShow and dialogShow are updated
                    const tvShow = topRatedShows.results.find((show) => show.id === movie.id);
                    if (tvShow) {
                      handleMovieSelect(tvShow);
                    }
                  }}
                  onPlayClick={() => {
                    if (dialogShow) {
                      setShowDialog(true);
                    }
                  }}
                  usePosters
                />
              )}

              {airingTodayShows?.results && (
                <MovieGrid
                  title="Airing Today"
                  movies={adaptTVArrayToMovies(airingTodayShows.results)}
                  onMovieSelect={(movie) => {
                    // FIXED: Use handleMovieSelect to ensure both selectedShow and dialogShow are updated
                    const tvShow = airingTodayShows.results.find((show) => show.id === movie.id);
                    if (tvShow) {
                      handleMovieSelect(tvShow);
                    }
                  }}
                  onPlayClick={() => {
                    if (dialogShow) {
                      setShowDialog(true);
                    }
                  }}
                  usePosters
                />
              )}

              {dramaShows?.results && (
                <MovieGrid
                  title="Drama"
                  movies={adaptTVArrayToMovies(dramaShows.results)}
                  onMovieSelect={(movie) => {
                    // FIXED: Use handleMovieSelect to ensure both selectedShow and dialogShow are updated
                    const tvShow = dramaShows.results.find((show) => show.id === movie.id);
                    if (tvShow) {
                      handleMovieSelect(tvShow);
                    }
                  }}
                  onPlayClick={() => {
                    if (dialogShow) {
                      setShowDialog(true);
                    }
                  }}
                  usePosters
                />
              )}

              {comedyShows?.results && (
                <MovieGrid
                  title="Comedy"
                  movies={adaptTVArrayToMovies(comedyShows.results)}
                  onMovieSelect={(movie) => {
                    // FIXED: Use handleMovieSelect to ensure both selectedShow and dialogShow are updated
                    const tvShow = comedyShows.results.find((show) => show.id === movie.id);
                    if (tvShow) {
                      handleMovieSelect(tvShow);
                    }
                  }}
                  onPlayClick={() => {
                    if (dialogShow) {
                      setShowDialog(true);
                    }
                  }}
                  usePosters
                />
              )}

              {scifiShows?.results && (
                <MovieGrid
                  title="Sci-Fi & Fantasy"
                  movies={adaptTVArrayToMovies(scifiShows.results)}
                  onMovieSelect={(movie) => {
                    // FIXED: Use handleMovieSelect to ensure both selectedShow and dialogShow are updated
                    const tvShow = scifiShows.results.find((show) => show.id === movie.id);
                    if (tvShow) {
                      handleMovieSelect(tvShow);
                    }
                  }}
                  onPlayClick={() => {
                    if (dialogShow) {
                      setShowDialog(true);
                    }
                  }}
                  usePosters
                />
              )}

              {actionShows?.results && (
                <MovieGrid
                  title="Action & Adventure"
                  movies={adaptTVArrayToMovies(actionShows.results)}
                  onMovieSelect={(movie) => {
                    // FIXED: Use handleMovieSelect to ensure both selectedShow and dialogShow are updated
                    const tvShow = actionShows.results.find((show) => show.id === movie.id);
                    if (tvShow) {
                      handleMovieSelect(tvShow);
                    }
                  }}
                  onPlayClick={() => {
                    if (dialogShow) {
                      setShowDialog(true);
                    }
                  }}
                  usePosters
                />
              )}

              {crimeShows?.results && (
                <MovieGrid
                  title="Crime"
                  movies={adaptTVArrayToMovies(crimeShows.results)}
                  onMovieSelect={(movie) => {
                    // FIXED: Use handleMovieSelect to ensure both selectedShow and dialogShow are updated
                    const tvShow = crimeShows.results.find((show) => show.id === movie.id);
                    if (tvShow) {
                      handleMovieSelect(tvShow);
                    }
                  }}
                  onPlayClick={() => {
                    if (dialogShow) {
                      setShowDialog(true);
                    }
                  }}
                  usePosters
                />
              )}

              {familyShows?.results && (
                <MovieGrid
                  title="Family"
                  movies={adaptTVArrayToMovies(familyShows.results)}
                  onMovieSelect={(movie) => {
                    // FIXED: Use handleMovieSelect to ensure both selectedShow and dialogShow are updated
                    const tvShow = familyShows.results.find((show) => show.id === movie.id);
                    if (tvShow) {
                      handleMovieSelect(tvShow);
                    }
                  }}
                  onPlayClick={() => {
                    if (dialogShow) {
                      setShowDialog(true);
                    }
                  }}
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
