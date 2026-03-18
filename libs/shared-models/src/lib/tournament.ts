import { GeoLocation } from './geo';

export type TournamentStatus = 'draft' | 'open' | 'in_progress' | 'finished' | 'cancelled';
export type TournamentFormat = 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss';

export interface TournamentParticipant {
  userId: string;
  name: string;
  picture?: string;
  registeredAt: string;
}

export interface Tournament {
  _id: string;
  title: string;
  description?: string;
  game: string;
  format: TournamentFormat;
  status: TournamentStatus;
  maxPlayers: number;
  currentPlayers: number;
  location?: GeoLocation;
  placeId?: string;
  placeName?: string;
  startDate: string;
  endDate?: string;
  prizeDescription?: string;
  entryFee?: number;
  createdBy: string;
  participants: TournamentParticipant[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTournamentPayload {
  title: string;
  game: string;
  format: TournamentFormat;
  maxPlayers: number;
  startDate: string;
  description?: string;
  endDate?: string;
  location?: GeoLocation;
  placeId?: string;
  placeName?: string;
  prizeDescription?: string;
  entryFee?: number;
}
