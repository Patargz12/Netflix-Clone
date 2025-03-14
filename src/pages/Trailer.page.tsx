import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface MovieVideo {
  key: string;
  site: string;
  type: string;
}

export const TrailerPage = () => {
  const { mediaType, id } = useParams();
  const navigate = useNavigate();
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrailer = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZjE0OGFmYzBmNTI3MzViYzViMzllYmMwNmU3ZDFkYiIsIm5iZiI6MTY2MjM0MjYzMi45NjcsInN1YiI6IjYzMTU1NWU4OTQwOGVjMDA3YmVkM2EwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3nQoagcQ9Vok-Gll6iOjVMiCZgtsyM5K8VbRjw1WGbE`,
          },
        };

        console.log(`Fetching trailer for ${mediaType} with ID: ${id}`);

        // Fetch details to get the title
        const detailsResponse = await fetch(
          `https://api.themoviedb.org/3/${mediaType}/${id}?language=en-US`,
          options
        );

        if (!detailsResponse.ok) {
          throw new Error(`Failed to fetch details: ${detailsResponse.status}`);
        }

        const detailsData = await detailsResponse.json();
        const contentTitle = mediaType === 'tv' ? detailsData.name : detailsData.title;
        setTitle(contentTitle);
        console.log(`Found title: ${contentTitle}`);

        // Fetch videos
        const videosResponse = await fetch(
          `https://api.themoviedb.org/3/${mediaType}/${id}/videos?language=en-US`,
          options
        );

        if (!videosResponse.ok) {
          throw new Error(`Failed to fetch videos: ${videosResponse.status}`);
        }

        const videosData = await videosResponse.json();
        console.log(`Found ${videosData.results?.length || 0} videos`);

        // Find the official trailer or use the first video
        const trailer =
          videosData.results.find(
            (video: MovieVideo) =>
              video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser')
          ) || videosData.results[0];

        if (trailer) {
          console.log(`Selected video key: ${trailer.key}`);
          setVideoKey(trailer.key);
        } else {
          console.log('No suitable trailer found');
          setVideoKey(null);
        }
      } catch (error) {
        console.error('Error fetching trailer:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch trailer');
      } finally {
        setIsLoading(false);
      }
    };

    if (id && mediaType) {
      fetchTrailer();
    } else {
      setError('Invalid media type or ID');
      setIsLoading(false);
    }
  }, [id, mediaType]);

  return (
    <div className="min-h-screen bg-black">
      <div className="fixed top-0 left-0 w-full bg-black/90 z-10 p-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center text-white hover:text-gray-300 transition-colors"
        >
          <ArrowLeft className="h-6 w-6 mr-2" />
          <span className="text-lg font-medium">{title || 'Loading...'}</span>
        </button>
      </div>

      <div className="pt-16 h-screen">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-white">
            <p>Error: {error}</p>
          </div>
        ) : videoKey ? (
          <iframe
            title={`Trailer for ${title}`}
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
