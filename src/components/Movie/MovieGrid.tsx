import { Loader2 } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Movie } from '@/types/movie';
import { MovieCard } from './MovieCard';

interface MovieGridProps {
  title: string;
  movies: Movie[];
  onMovieSelect?: (movie: Movie) => void;
  onPlayClick?: () => void;
  usePosters?: boolean;
  isLoading?: boolean;
}

export function MovieGrid({
  title,
  movies,
  onMovieSelect,
  onPlayClick,
  usePosters = false,
  isLoading = false,
}: MovieGridProps) {
  return (
    <div className="py-6">
      <div className="flex items-center gap-4 mb-4 px-6">
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        {isLoading && <Loader2 className="h-5 w-5 animate-spin text-white/70" />}
      </div>
      <div className="relative group">
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {movies.map((movie) => (
              <CarouselItem
                key={movie.id}
                className={`pl-2 md:pl-4 ${
                  usePosters
                    ? 'basis-[40%] sm:basis-[30%] md:basis-[20%] lg:basis-[15%]'
                    : 'basis-[85%] sm:basis-[45%] md:basis-[35%] lg:basis-[25%]'
                }`}
              >
                <MovieCard
                  movie={movie}
                  onClick={() => {
                    if (onMovieSelect) {
                      onMovieSelect(movie);
                    }
                    if (onPlayClick) {
                      onPlayClick();
                    }
                  }}
                  usePosters={usePosters}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CarouselNext className="right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Carousel>
      </div>
    </div>
  );
}
