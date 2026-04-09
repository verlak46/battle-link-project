import { GeoLocation } from './geo';

export type CreationType = 'game' | 'tournament' | 'campaign' | 'league';
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'finished';

export interface Event {
  _id: string;
  title: string;
  type: CreationType;
  game: string;
  system?: string;
  startDate: string;
  endDate?: string;
  time?: string;
  description?: string;
  imageUrl?: string;
  contactUrl?: string;
  maxPlayers?: number;
  currentPlayers: number;
  city?: string;
  address?: string;
  location?: GeoLocation;
  locationRadius?: number;
  placeId?: string;
  placeName?: string;
  status: EventStatus;
  createdBy: string;
  participants: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventPayload {
  title: string;
  type: CreationType;
  game: string;
  system?: string;
  startDate: string;
  endDate?: string;
  time?: string;
  description?: string;
  imageUrl?: string;
  contactUrl?: string;
  maxPlayers?: number;
  city?: string;
  address?: string;
  location?: GeoLocation;
  locationRadius?: number;
  placeId?: string;
  placeName?: string;
}
