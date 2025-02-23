'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProfileList } from '@/components/Cms/ProfileList';
import { Button } from '@/components/ui/button';
import { mockProfiles } from '@/data/profiles';
import { useProfileStore } from '@/store/profileStore';
import type { Profile, ProfilesState } from '@/types/profile/user';

export function AccountsPage() {
  const [state, setState] = useState<ProfilesState>({
    isLoading: true,
    error: null,
    profiles: [],
  });

  const setProfile = useProfileStore((state) => state.setProfile);

  useEffect(() => {
    // Simulate API call
    const fetchProfiles = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setState((prev) => ({
          ...prev,
          isLoading: false,
          profiles: mockProfiles,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load profiles',
        }));
      }
    };

    fetchProfiles();
  }, []);

  const navigate = useNavigate();

  const handleProfileSelect = (profile: Profile) => {
    setProfile(profile);
    navigate('/menu');
  };

  const handleAddProfile = () => {
    console.log('Add profile clicked');
    // Handle adding new profile
  };

  const handleBackClick = () => {
    navigate('/login'); // This will navigate to the previous page
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 md:p-8 relative">
      <Button
        onClick={handleBackClick}
        variant="ghost"
        className="absolute top-4 left-4 text-white hover:bg-gray-800"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <h1 className="text-white text-3xl md:text-5xl font-medium mb-8 md:mb-16">Who's watching?</h1>

      <ProfileList
        profiles={state.profiles}
        isLoading={state.isLoading}
        error={state.error}
        onProfileSelect={handleProfileSelect}
        onAddProfile={handleAddProfile}
      />

      <button
        type="button"
        className="mt-8 md:mt-16 px-4 py-2 text-gray-400 hover:text-white border border-gray-400 hover:border-white transition-colors duration-200"
      >
        Manage Profiles
      </button>
    </div>
  );
}
