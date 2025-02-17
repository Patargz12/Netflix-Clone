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
  onMovieSelect: (movie: Movie) => void;
  usePosters?: boolean;
}

export function PopularGrid({ title, movies, onMovieSelect, usePosters = false }: MovieGridProps) {
  return (
    <div className="py-6">
      <h2 className="text-2xl font-semibold mb-4 px-6 mt-8 md:mt-0 text-white">{title}</h2>
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
                <MovieCard movie={movie} onClick={onMovieSelect} usePosters={usePosters} />
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
