import React, { createContext, useContext, useState, ReactNode } from "react";
import { ImageSourcePropType } from "react-native";
import {
  PROFILE_SCREEN_DETAILS,
  PROFILE_ACCOUNTS,
  PROFILE_DEFAULT_AVATAR,
  PRIMARY_TEST_USER,
} from "@/src/core/test/profileData";

interface ProfileData {
  name: string;
  email: string;
  bio: string;
  interests: string[];
  stats: {
    following: number;
    tickets: number;
  };
  avatar: ImageSourcePropType;
}

interface ProfileContextType {
  profile: ProfileData;
  updateProfile: (updates: Partial<ProfileData>) => void;
  updateName: (name: string) => void;
  updateBio: (bio: string) => void;
  updateAvatar: (avatar: ImageSourcePropType) => void;
  updateInterests: (interests: string[]) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>({
    name: PROFILE_SCREEN_DETAILS.name,
    email: PROFILE_SCREEN_DETAILS.email,
    bio: PROFILE_SCREEN_DETAILS.bio,
    interests: [...PROFILE_SCREEN_DETAILS.interests],
    stats: { ...PROFILE_SCREEN_DETAILS.stats },
    avatar: PROFILE_DEFAULT_AVATAR,
  });

  const updateProfile = (updates: Partial<ProfileData>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const updateName = (name: string) => {
    setProfile((prev) => ({ ...prev, name }));
  };

  const updateBio = (bio: string) => {
    setProfile((prev) => ({ ...prev, bio }));
  };

  const updateAvatar = (avatar: ImageSourcePropType) => {
    setProfile((prev) => ({ ...prev, avatar }));
  };

  const updateInterests = (interests: string[]) => {
    setProfile((prev) => ({ ...prev, interests }));
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        updateProfile,
        updateName,
        updateBio,
        updateAvatar,
        updateInterests,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}

export default ProfileContext;
