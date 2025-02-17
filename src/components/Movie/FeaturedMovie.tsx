import { useEffect, useState } from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';
import ReactPlayer from 'react-player/youtube';
import { Button } from '@/components/ui/button';
import { Movie, MovieVideo } from '@/types/movie';

interface FeaturedMovieProps {
  movie: Movie;
  onPlayClick: () => void;
}

export function FeaturedMovie({ movie, onPlayClick }: FeaturedMovieProps) {
  const [video, setVideo] = useState<MovieVideo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/videos?language=en-US`,
          {
            headers: {
              accept: 'application/json',
              Authorization:
                'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZjE0OGFmYzBmNTI3MzViYzViMzllYmMwNmU3ZDFkYiIsIm5iZiI6MTY2MjM0MjYzMi45NjcsInN1YiI6IjYzMTU1NWU4OTQwOGVjMDA3YmVkM2EwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3nQoagcQ9Vok-Gll6iOjVMiCZgtsyM5K8VbRjw1WGbE',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data && Array.isArray(data.results) && data.results.length > 0) {
          const trailer = data.results.find(
            (v: MovieVideo) =>
              (v.type === 'Trailer' || v.type === 'Teaser') && v.site === 'YouTube' && v.official
          );
          setVideo(trailer || null);
        } else {
          setVideo(null);
        }
      } catch (error) {
        console.error('Error fetching video:', error);
        setVideo(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (movie?.id) {
      fetchVideo();
    }
  }, [movie.id]);

  return (
    <div className="relative h-[100vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        {!isLoading && video ? (
          <div className="relative w-full h-full">
            <div className="absolute inset-0 overflow-hidden">
              <ReactPlayer
                url={`https://www.youtube.com/embed/${video.key}?autoplay=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${video.key}&modestbranding=1&vq=hd1080`}
                playing
                loop
                muted={isMuted}
                width="100%"
                height="100%"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  objectFit: 'cover',
                }}
                config={{
                  playerVars: {
                    controls: 0,
                    modestbranding: 1,
                    showinfo: 0,
                    rel: 0,
                    iv_load_policy: 3,
                    vq: 'hd1080', // Force 1080p quality
                    hd: 1, // Enable HD mode
                  },
                  onUnstarted: () => {
                    // This ensures HD quality is maintained even after player initialization
                    const player = document.querySelector('iframe');
                    if (player) {
                      player.setAttribute('allowfullscreen', '1');
                      player.setAttribute(
                        'allow',
                        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                      );
                    }
                  },
                }}
                className="react-player"
              />
            </div>
          </div>
        ) : (
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      </div>

      <div className="relative h-full container mx-auto flex flex-col justify-end pb-16 pt-0 px-4 sm:px-6">
        <div className="max-w-3xl space-y-4 ml-2 md:ml-10">
          <h1 className="text-2xl md:text-6xl font-bold tracking-tight text-white">
            {movie.title}
          </h1>
          <p className="text-md text-white/80 max-w-2xl line-clamp-3">{movie.overview}</p>
          <div className="flex gap-4 flex-wrap pb-24">
            <Button size="lg" className="sm:w-auto" onClick={onPlayClick}>
              <Play className="mr-2 h-5 w-5" /> Play
            </Button>

            {video && (
              <Button
                size="icon"
                variant="secondary"
                className="bg-white/20 h-14 w-14 hover:bg-white/30"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
