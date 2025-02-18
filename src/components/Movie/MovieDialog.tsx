import { useEffect, useState } from 'react';
import { Play, Plus, ThumbsUp, Volume2, VolumeX, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MovieCard } from '@/components/Movie/MovieCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Cast, Movie, MovieDetails } from '@/types/movie';

const API_KEY =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZjE0OGFmYzBmNTI3MzViYzViMzllYmMwNmU3ZDFkYiIsIm5iZiI6MTY2MjM0MjYzMi45NjcsInN1YiI6IjYzMTU1NWU4OTQwOGVjMDA3YmVkM2EwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3nQoagcQ9Vok-Gll6iOjVMiCZgtsyM5K8VbRjw1WGbE';

interface MovieDialogProps {
  movie: Movie;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MovieDialog({ movie: initialMovie, open, onOpenChange }: MovieDialogProps) {
  const navigate = useNavigate();
  const [currentMovie, setCurrentMovie] = useState<Movie>(initialMovie);
  const [cast, setCast] = useState<Cast[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);

  useEffect(() => {
    setCurrentMovie(initialMovie);
  }, [initialMovie]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
        };

        const detailsResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${currentMovie.id}?language=en-US`,
          options
        );
        const detailsData = await detailsResponse.json();
        setMovieDetails(detailsData);

        const castResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${currentMovie.id}/credits?language=en-US`,
          options
        );
        const castData = await castResponse.json();
        setCast(castData.cast.slice(0, 6));

        console.log('Cast API Response:', castData); // Debugging

        const recommendedResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${currentMovie.id}/recommendations?language=en-US`,
          options
        );
        const recommendedData = await recommendedResponse.json();
        setRecommendedMovies(recommendedData.results.slice(0, 8));
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    if (open && currentMovie.id) {
      fetchMovieDetails();
    }
  }, [currentMovie.id, open]);

  const handlePlayClick = () => {
    onOpenChange(false);
    navigate(`/watch/${movieDetails?.id}`);
  };

  const handleRecommendedMovieClick = (selectedMovie: Movie) => {
    setCurrentMovie(selectedMovie);
    const dialogContent = document.querySelector('[role="dialog"]');
    if (dialogContent) {
      dialogContent.scrollTop = 0;
    }
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
              alt={movieDetails?.title || currentMovie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative md:absolute md:inset-0 flex flex-col bg-zinc-900 md:bg-inherit">
              <div className="flex-1 flex items-end justify-start mb-1 mt-4 ">
                <DialogTitle className="text-white text-3xl md:text-5xl font-bold text-start px-4">
                  {movieDetails?.title || currentMovie.title}
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
                  <span>
                    {movieDetails?.release_date?.split('-')[0] ||
                      currentMovie.release_date.split('-')[0]}
                  </span>
                  {movieDetails?.runtime && <span>{movieDetails.runtime} min</span>}
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
