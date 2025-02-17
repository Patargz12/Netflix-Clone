import React, { useState } from 'react';
import { UserCircle2 } from 'lucide-react';
import { Profile } from '@/types/profile/user';

interface ProfileCardProps {
  profile: Profile;
  onClick: (profile: Profile) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Function to handle image loading
  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  // Function to handle image error
  const handleImageError = () => {
    setImageError(true);
    setIsImageLoading(false);
  };

  // Show placeholder if:
  // 1. No image URL provided
  // 2. Image failed to load
  // 3. Image is still loading
  const showPlaceholder = !profile.imageUrl || imageError || isImageLoading;

  return (
    <button
      type="button"
      onClick={() => onClick(profile)}
      className="group flex flex-col items-center space-y-2 focus:outline-none"
    >
      <div className="relative w-[120px] h-[120px] md:w-[150px] md:h-[150px] rounded-md overflow-hidden group-hover:ring-4 ring-white transition duration-200">
        {profile.imageUrl && !imageError && (
          <img
            src={profile.imageUrl}
            alt={`${profile.name}'s profile`}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}

        {/* Placeholder */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${getGradientColor(profile.name)} transition-opacity duration-300 ${
            showPlaceholder ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <UserCircle2 className="w-24 h-24 text-white/80" />
        </div>
      </div>
      <span className="text-gray-400 group-hover:text-white transition-colors duration-200">
        {profile.name}
      </span>
    </button>
  );
};

// Function to generate consistent gradient colors based on name
const getGradientColor = (name: string): string => {
  // Generate a consistent hash from the name
  const hash = name.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  // Use the hash to select from a predefined set of gradients
  const gradients = [
    'from-red-500 to-red-600',
    'from-blue-500 to-blue-600',
    'from-green-500 to-green-600',
    'from-purple-500 to-purple-600',
    'from-yellow-500 to-yellow-600',
    'from-pink-500 to-pink-600',
    'from-indigo-500 to-indigo-600',
    'from-orange-500 to-orange-600',
  ];

  return gradients[Math.abs(hash) % gradients.length];
};
