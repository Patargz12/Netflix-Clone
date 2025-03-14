import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Profile } from '@/types/profile/user';
import { ProfileCard } from './ProfileCard';

interface ProfileListProps {
  profiles: Profile[];
  isLoading: boolean;
  error: string | null;
  onProfileSelect: (profile: Profile) => void;
  onAddProfile: () => void;
}

export const ProfileList: React.FC<ProfileListProps> = ({
  profiles,
  isLoading,
  error,
  onProfileSelect,
  onAddProfile,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl">Error loading profiles</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8">
      {profiles.map((profile) => (
        <ProfileCard key={profile.id} profile={profile} onClick={onProfileSelect} />
      ))}
      <button
        type="button"
        onClick={onAddProfile}
        className="group flex flex-col items-center space-y-2 focus:outline-none"
      >
        <div className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] flex items-center justify-center  transition duration-200">
          <img
            src="/images/profile/add_profile.png"
            alt="add_profile_icon"
            className="group-hover:ring-4 ring-white rounded-full  "
          />
        </div>
        <span className="text-gray-400 group-hover:text-white transition-colors duration-200">
          Add Profile
        </span>
      </button>
    </div>
  );
};
