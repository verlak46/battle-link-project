import { GeoLocation } from './geo';

export type ExperienceLevel = 'beginner' | 'casual' | 'competitive';
export type AuthProvider = 'local' | 'google';

export interface User {
  _id: string;
  email: string;
  name: string;
  nick?: string;
  picture?: string | null;
  googleId?: string | null;
  provider: AuthProvider;
  favoriteGames: string[];
  experienceLevel?: ExperienceLevel;
  location?: GeoLocation | null;
  onboardingCompleted: boolean;
  isAdmin?: boolean;
  createdAt: string;
  updatedAt: string;
}
