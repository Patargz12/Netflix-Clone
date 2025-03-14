import { useEffect, useState } from 'react';
import { Play, Plus, ThumbsUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MovieCard } from '@/components/Movie/MovieCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
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

  useEffect(() => {
    console.log('Dialog movie updated:', initialMovie);
    setCurrentMovie(initialMovie);
    // Check if it's a TV show
    const { mediaType } = getMediaId(initialMovie);
    setIsTV(mediaType === 'tv');
  }, [initialMovie]);

  useEffect(() => {
    const fetchMediaDetails = async () => {
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
        const detailsData = await detailsResponse.json();
        setMovieDetails(detailsData);

        // Use the correct endpoint for credits
        const creditsEndpoint = getMediaEndpoint(currentMovie, '/credits?language=en-US');
        const castResponse = await fetch(creditsEndpoint, options);
        const castData = await castResponse.json();
        setCast(castData.cast?.slice(0, 6) || []);

        // Use the correct endpoint for recommendations
        const recommendationsEndpoint = getMediaEndpoint(
          currentMovie,
          '/recommendations?language=en-US'
        );
        const recommendedResponse = await fetch(recommendationsEndpoint, options);
        const recommendedData = await recommendedResponse.json();
        setRecommendedMovies(recommendedData.results?.slice(0, 8) || []);
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    if (open && currentMovie.id) {
      fetchMediaDetails();
    }
  }, [currentMovie, open]);

  const handlePlayClick = () => {
    onOpenChange(false);
    const { id, mediaType } = getMediaId(currentMovie);
    console.log(`Playing ${mediaType} with ID ${id}: ${currentMovie.title}`);
    navigate(`/watch/${mediaType}/${id}`);
  };

  const handleRecommendedMovieClick = (selectedMovie: Movie) => {
    setCurrentMovie(selectedMovie);
    const dialogContent = document.querySelector('[role="dialog"]');
    if (dialogContent) {
      dialogContent.scrollTop = 0;
    }
  };

  const getTitle = () => {
    if (!movieDetails) return currentMovie.title;
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
    if (!movieDetails) return null;

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-zinc-900">
        <ScrollArea className="max-h-[90vh]">
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
                      <Play className=" h-5 w-5" />
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
