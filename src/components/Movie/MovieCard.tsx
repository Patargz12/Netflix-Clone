import { Play } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card } from '@/components/ui/card';
import { Movie } from '@/types/movie';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
  usePosters?: boolean;
}

export function MovieCard({ movie, onClick, usePosters = false }: MovieCardProps) {
  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all hover:scale-105 bg-transparent border-0"
      onClick={() => onClick(movie)}
    >
      <AspectRatio ratio={usePosters ? 2 / 3 : 16 / 9}>
        <img
          src={`https://image.tmdb.org/t/p/w500${
            usePosters ? movie.poster_path : movie.backdrop_path
          }`}
          alt={movie.title}
          className="object-cover w-full h-full transition-all rounded-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity rounded-lg">
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center backdrop-blur-sm">
              <Play className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="absolute bottom-0 p-4">
            <h3 className="text-white font-semibold text-sm line-clamp-1">{movie.title}</h3>
          </div>
        </div>
      </AspectRatio>
    </Card>
  );
}
