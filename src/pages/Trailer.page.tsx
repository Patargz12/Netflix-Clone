import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface MovieVideo {
  key: string;
  site: string;
  type: string;
}

export const TrailerPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [movieTitle, setMovieTitle] = useState<string>('');

  useEffect(() => {
    const fetchMovieTrailer = async () => {
      try {
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZjE0OGFmYzBmNTI3MzViYzViMzllYmMwNmU3ZDFkYiIsIm5iZiI6MTY2MjM0MjYzMi45NjcsInN1YiI6IjYzMTU1NWU4OTQwOGVjMDA3YmVkM2EwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3nQoagcQ9Vok-Gll6iOjVMiCZgtsyM5K8VbRjw1WGbE`,
          },
        };

        console.log('Fetching trailer for movie ID:', movieId, movieTitle); // Debugging

        // Fetch movie details to get the title
        const movieResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
          options
        );
        const movieData = await movieResponse.json();
        setMovieTitle(movieData.title);

        // Fetch movie videos
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
          options
        );
        const data = await response.json();

        // Find the official trailer or use the first video
        const trailer =
          data.results.find(
            (video: MovieVideo) =>
              video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser')
          ) || data.results[0];

        if (trailer) {
          setVideoKey(trailer.key);
        }
      } catch (error) {
        console.error('Error fetching movie trailer:', error);
      }
    };

    if (movieId) {
      fetchMovieTrailer();
    }
  }, [movieId]);

  return (
    <div className="min-h-screen bg-black">
      <div className="fixed top-0 left-0 w-full bg-black/90 z-10 p-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center text-white hover:text-gray-300 transition-colors"
        >
          <ArrowLeft className="h-6 w-6 mr-2" />
          <span className="text-lg font-medium">{movieTitle}</span>
        </button>
      </div>

      <div className="pt-16 h-screen">
        {videoKey ? (
          <iframe
            title={`Trailer for ${movieTitle}`}
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&controls=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            <p>No trailer available</p>
          </div>
        )}
      </div>
    </div>
  );
};
