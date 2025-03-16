import { useEffect, useRef, useState } from 'react';
import { Play, Plus, ThumbsUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MovieCard } from '@/components/Movie/MovieCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton'; // Our custom Skeleton component
import type { Cast, Movie, MovieDetails } from '@/types/movie';
import type { TVAsMovie } from '@/types/tv';
import { getMediaEndpoint, getMediaId } from '@/utils/tvAdapter';

const API_KEY =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZjE0OGFmYzBmNTI3MzViYzViMzllYmMwNmU3ZDFkYiIsIm5iZiI6MTY2MjM0MjYzMi45NjcsInN1YiI6IjYzMTU1NWU4OTQwOGVjMDA3YmVkM2EwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3nQoagcQ9Vok-Gll6iOjVMiCZgtsyM5K8VbRjw1WGbE';

interface MovieDialogProps {
  movie: Movie | TVAsMovie;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MovieDialog({ movie: initialMovie, open, onOpenChange }: MovieDialogProps) {
  const navigate = useNavigate();
  const [currentMovie, setCurrentMovie] = useState<Movie | TVAsMovie>(initialMovie);
  const [cast, setCast] = useState<Cast[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [isTV, setIsTV] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldScrollTop, setShouldScrollTop] = useState(false);

  // Add refs to track current fetch request and prevent race conditions
  const currentRequestId = useRef<string | null>(null);
  const isMounted = useRef(true);
  // Ref for the scroll area
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const dialogContentRef = useRef<HTMLDivElement>(null);

  // Clear all state when component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Scroll to top effect - improved with more specific selectors and multiple attempts
  useEffect(() => {
    if (shouldScrollTop) {
      const attemptScroll = () => {
        console.log('Attempting to scroll to top');

        // Try targeting the specific Radix UI ScrollArea viewport
        const radixViewport = document.querySelector('[data-radix-scroll-area-viewport]');
        if (radixViewport) {
          console.log('Found Radix viewport, scrolling to top');
          radixViewport.scrollTop = 0;
          return true;
        }

        // Try targeting any scrollable div within the dialog
        const scrollableElements = Array.from(
          document.querySelectorAll('[role="dialog"] *')
        ).filter((el) => {
          const style = window.getComputedStyle(el);
          return (
            (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
            el.scrollHeight > el.clientHeight
          );
        });

        if (scrollableElements.length > 0) {
          console.log('Found scrollable elements:', scrollableElements.length);
          scrollableElements.forEach((el) => {
            el.scrollTop = 0;
          });
          return true;
        }

        // Try more generic approaches
        const dialogElement = document.querySelector('[role="dialog"]');
        if (dialogElement) {
          dialogElement.scrollTop = 0;
        }

        const scrollArea = document.querySelector('.max-h-\\[90vh\\]');
        if (scrollArea) {
          scrollArea.scrollTop = 0;
        }

        const dialogContent = document.querySelector('[role="dialog"] > div');
        if (dialogContent) {
          dialogContent.scrollTop = 0;
        }

        console.log('Tried all scroll approaches');
        return false;
      };
      // Multiple delayed attempts with increasing timeouts
      // This ensures we catch the element after any rendering or state updates
      const timeouts = [50, 100, 300, 500].map((delay) =>
        setTimeout(() => {
          console.log(`Retry scrolling after ${delay}ms`);
          attemptScroll();

          // On the last attempt, reset the flag regardless
          if (delay === 500) {
            setShouldScrollTop(false);
          }
        }, delay)
      );

      return () => {
        timeouts.forEach(clearTimeout);
      };
    }
  }, [shouldScrollTop]);

  // Handle dialog open/close
  useEffect(() => {
    if (!open) {
      // Reset everything when dialog closes
      return;
    }

    // Always show loading when dialog opens
    setIsLoading(true);

    // Reset data states to avoid seeing previous data
    setMovieDetails(null);
    setCast([]);
    setRecommendedMovies([]);

    // Scroll to top when dialog opens
    setShouldScrollTop(true);
  }, [open]);

  // Handle movie changes
  useEffect(() => {
    if (!open) {
      return;
    }

    console.log('Dialog movie updated:', initialMovie);

    // Always reset to loading state when movie changes
    setIsLoading(true);

    // Reset previous data
    setMovieDetails(null);
    setCast([]);
    setRecommendedMovies([]);

    setCurrentMovie(initialMovie);

    // Check if it's a TV show
    const { mediaType } = getMediaId(initialMovie);
    setIsTV(mediaType === 'tv');

    // Scroll to top when movie changes
    setShouldScrollTop(true);
  }, [initialMovie, open]);

  // Fetch media details when currentMovie changes
  useEffect(() => {
    if (!open || !currentMovie?.id) {
      return;
    }

    // Generate a unique ID for this request
    const requestId = `${currentMovie.id}-${Date.now()}`;
    currentRequestId.current = requestId;

    // Always ensure loading state is active
    setIsLoading(true);

    const fetchMediaDetails = async () => {
      // If component unmounted or request is no longer current, abort
      if (!isMounted.current || currentRequestId.current !== requestId) {
        return;
      }

      try {
        const { mediaType } = getMediaId(currentMovie);
        console.log(`Fetching details for ${mediaType} with ID: ${currentMovie.id}`);

        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
        };

        // Use the correct endpoint based on media type
        const detailsEndpoint = getMediaEndpoint(currentMovie, '?language=en-US');
        console.log('Details endpoint:', detailsEndpoint);

        const detailsResponse = await fetch(detailsEndpoint, options);

        // Check if this request is still relevant
        if (!isMounted.current || currentRequestId.current !== requestId) {
          return;
        }

        const detailsData = await detailsResponse.json();
        setMovieDetails(detailsData);

        // Use the correct endpoint for credits
        const creditsEndpoint = getMediaEndpoint(currentMovie, '/credits?language=en-US');
        const castResponse = await fetch(creditsEndpoint, options);

        // Check if this request is still relevant
        if (!isMounted.current || currentRequestId.current !== requestId) {
          return;
        }

        const castData = await castResponse.json();
        setCast(castData.cast?.slice(0, 6) || []);

        // Use the correct endpoint for recommendations
        const recommendationsEndpoint = getMediaEndpoint(
          currentMovie,
          '/recommendations?language=en-US'
        );
        const recommendedResponse = await fetch(recommendationsEndpoint, options);

        // Check if this request is still relevant
        if (!isMounted.current || currentRequestId.current !== requestId) {
          return;
        }

        const recommendedData = await recommendedResponse.json();
        setRecommendedMovies(recommendedData.results?.slice(0, 8) || []);

        // Only set loading to false if this is still the current request
        if (currentRequestId.current === requestId) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching details:', error);

        // Only set loading to false if this is still the current request
        if (currentRequestId.current === requestId) {
          setIsLoading(false);
        }
      }
    };

    fetchMediaDetails();
  }, [currentMovie, open]);

  const handlePlayClick = () => {
    onOpenChange(false);
    const { id, mediaType } = getMediaId(currentMovie);
    console.log(`Playing ${mediaType} with ID ${id}: ${currentMovie.title}`);
    navigate(`/watch/${mediaType}/${id}`);
  };

  const handleRecommendedMovieClick = (selectedMovie: Movie) => {
    console.log('Recommended movie clicked:', selectedMovie.title);

    // Force scrolling first, before state changes
    const scrollNow = () => {
      console.log('Immediate scroll attempt');
      // Target all potential scrollable elements
      const scrollTargets = [
        document.querySelector('[data-radix-scroll-area-viewport]'),
        document.querySelector('[role="dialog"]'),
        document.querySelector('.max-h-\\[90vh\\]'),
        document.querySelector('[role="dialog"] > div'),
      ];

      scrollTargets.forEach((element) => {
        if (element) {
          element.scrollTop = 0;
        }
      });
    };

    // Try to scroll immediately
    scrollNow();

    // Set loading state immediately
    setIsLoading(true);

    // Reset all data states first
    setMovieDetails(null);
    setCast([]);
    setRecommendedMovies([]);

    // Create a new request ID to cancel any in-progress fetches
    currentRequestId.current = `${selectedMovie.id}-${Date.now()}`;

    // Update current movie which will trigger the fetch effect
    setCurrentMovie(selectedMovie);

    // Set the scroll flag to trigger the useEffect for multiple scroll attempts
    setShouldScrollTop(true);

    // Also try scrolling after a brief delay
    setTimeout(scrollNow, 10);
  };

  const getTitle = () => {
    if (!movieDetails) {
      return currentMovie.title || 'Loading...';
    }
    return isTV ? (movieDetails as any).name : movieDetails.title;
  };

  const getReleaseDate = () => {
    if (!movieDetails) {
      return currentMovie.release_date?.split('-')[0] || '';
    }
    return isTV
      ? (movieDetails as any).first_air_date?.split('-')[0] || ''
      : movieDetails.release_date?.split('-')[0] || '';
  };

  const getDurationInfo = () => {
    if (!movieDetails) {
      return null;
    }

    if (isTV) {
      const seasons = (movieDetails as any).number_of_seasons;
      if (seasons) {
        return (
          <span>
            {seasons} Season{seasons !== 1 ? 's' : ''}
          </span>
        );
      }
      return null;
    }

    return movieDetails.runtime ? <span>{movieDetails.runtime} min</span> : null;
  };

  // Loading skeleton UI for the header
  const LoadingHeader = () => (
    <div className="relative aspect-video">
      <div className="w-full h-full bg-zinc-800 animate-pulse" />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative md:absolute md:inset-0 flex flex-col bg-zinc-900 md:bg-inherit">
        <div className="flex-1 flex items-end justify-start mb-1 mt-4 ">
          <Skeleton className="h-12 w-3/4 bg-zinc-700" />
        </div>

        <div className="p-4 space-y-4 ">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-24 bg-zinc-700 rounded-md" />
            <Skeleton className="h-10 w-10 bg-zinc-700 rounded-md" />
            <Skeleton className="h-10 w-10 bg-zinc-700 rounded-md" />
          </div>

          <div className="flex gap-4">
            <Skeleton className="h-5 w-16 bg-zinc-700" />
            <Skeleton className="h-5 w-10 bg-zinc-700" />
            <Skeleton className="h-5 w-20 bg-zinc-700" />
          </div>
        </div>
      </div>
    </div>
  );

  // Loading skeleton UI for the content
  const LoadingContent = () => (
    <div className="p-6 bg-zinc-900">
      <div className="grid md:grid-cols-2 gap-0 md:gap-8">
        <div>
          <Skeleton className="h-4 w-full bg-zinc-700 mb-2" />
          <Skeleton className="h-4 w-full bg-zinc-700 mb-2" />
          <Skeleton className="h-4 w-3/4 bg-zinc-700 mb-8" />
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <Skeleton className="h-4 w-24 bg-zinc-700 mb-2" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-4 w-20 bg-zinc-700" />
              <Skeleton className="h-4 w-20 bg-zinc-700" />
              <Skeleton className="h-4 w-20 bg-zinc-700" />
            </div>
          </div>
          <div>
            <Skeleton className="h-4 w-24 bg-zinc-700 mb-2" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-4 w-16 bg-zinc-700" />
              <Skeleton className="h-4 w-20 bg-zinc-700" />
              <Skeleton className="h-4 w-16 bg-zinc-700" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Skeleton className="h-6 w-48 bg-zinc-700 mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="aspect-[2/3]">
                <Skeleton className="h-full w-full bg-zinc-700 rounded-md" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  // Create a wrapper to ensure loading state visibility
  const ProtectedContent = ({ children }: { children: React.ReactNode }) => {
    // Force loading state to be visible for at least 400ms
    const [forceLoading, setForceLoading] = useState(true);

    useEffect(() => {
      // Always reset force loading when isLoading changes to true
      if (isLoading) {
        setForceLoading(true);
        return;
      }

      // If loading completed, we still force it to show for a minimum time
      const timer = setTimeout(() => {
        setForceLoading(false);

        // Try to scroll to top when content is shown
        if (shouldScrollTop) {
          console.log('Attempting to scroll after content is shown');
          const scrollTargets = [
            document.querySelector('[data-radix-scroll-area-viewport]'),
            document.querySelector('[role="dialog"]'),
            document.querySelector('.max-h-\\[90vh\\]'),
            document.querySelector('[role="dialog"] > div'),
          ];

          scrollTargets.forEach((element) => {
            if (element) {
              element.scrollTop = 0;
            }
          });
        }
      }, 400);

      return () => clearTimeout(timer);
    }, [isLoading]);

    if (isLoading || forceLoading || !movieDetails) {
      return (
        <>
          <LoadingHeader />
          <LoadingContent />
        </>
      );
    }

    return <>{children}</>;
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpenState) => {
        // When dialog is about to close, reset states
        if (!newOpenState) {
          setIsLoading(true);
          setMovieDetails(null);
          setCast([]);
          setRecommendedMovies([]);
          currentRequestId.current = null;
        }
        onOpenChange(newOpenState);
      }}
    >
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-zinc-900" ref={dialogContentRef}>
        <ScrollArea className="max-h-[90vh] scroll-area" ref={scrollAreaRef}>
          <ProtectedContent>
            <div className="relative aspect-video">
              <img
                src={`https://image.tmdb.org/t/p/original${
                  movieDetails?.backdrop_path || currentMovie.backdrop_path
                }`}
                alt={getTitle()}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />

              <div className="relative md:absolute md:inset-0 flex flex-col bg-zinc-900 md:bg-inherit">
                <div className="flex-1 flex items-end justify-start mb-1 mt-4 ">
                  <DialogTitle className="text-white text-3xl md:text-5xl font-bold text-start px-4">
                    {getTitle()}
                  </DialogTitle>
                </div>

                <div className="p-4 space-y-4 ">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 flex-wrap flex-1">
                      <Button className="sm:w-auto" onClick={handlePlayClick}>
                        <Play className="h-5 w-5" />
                        Play
                      </Button>
                      <Button variant="secondary" className="bg-white/30 hover:bg-white/30">
                        <Plus className="h-5 w-5" />
                      </Button>
                      <Button variant="secondary" className="bg-white/30 hover:bg-white/30">
                        <ThumbsUp className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-4 text-white text-sm">
                    <span className="text-green-500 font-medium">
                      {Math.round((movieDetails?.vote_average || currentMovie.vote_average) * 10)}%
                      Match
                    </span>
                    <span>{getReleaseDate()}</span>
                    {getDurationInfo()}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-zinc-900">
              <div className="grid md:grid-cols-2 gap-0 md:gap-8">
                <div>
                  <p className="text-white/90 line-clamp-3 text-sm sm:text-base mb-8">
                    {movieDetails?.overview || currentMovie.overview}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-zinc-400 flex flex-wrap space-x-4 text-sm space-y-1">
                    <h4 className="text-white text-sm mb-3">
                      Cast:{' '}
                      {cast.map((actor) => (
                        <span className="font-regular text-zinc-400 text-sm ml-2" key={actor.id}>
                          {actor.name}
                        </span>
                      ))}
                    </h4>
                  </div>

                  <div className="text-zinc-400 text-sm space-y-1">
                    <h4 className="text-white text-sm mb-3">
                      Genres:{' '}
                      {movieDetails?.genres?.map((genre) => (
                        <span className="font-regular text-zinc-400 text-sm ml-2" key={genre.id}>
                          {genre.name}
                        </span>
                      ))}
                    </h4>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-white text-lg font-medium mb-4">More Like This</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {recommendedMovies.map((recommendedMovie) => (
                    <MovieCard
                      key={recommendedMovie.id}
                      movie={recommendedMovie}
                      onClick={handleRecommendedMovieClick}
                      usePosters
                    />
                  ))}
                </div>
              </div>
            </div>
          </ProtectedContent>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
