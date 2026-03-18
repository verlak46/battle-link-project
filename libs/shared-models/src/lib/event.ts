import { GeoLocation } from './geo';

export type EventStatus = 'draft' | 'published' | 'cancelled' | 'finished';
export type EventType = 'friendly' | 'league' | 'tournament' | 'campaign';

export interface Event {
  _id: string;
  title: string;
  description?: string;
  type: EventType;
  status: EventStatus;
  game: string;
  maxPlayers: number;
  currentPlayers: number;
  location?: GeoLocation;
  placeId?: string;
  placeName?: string;
  startDate: string;
  endDate?: string;
  createdBy: string;
  participants: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventPayload {
  title: string;
  type: EventType;
  game: string;
  maxPlayers: number;
  startDate: string;
  description?: string;
  endDate?: string;
  location?: GeoLocation;
  placeId?: string;
  placeName?: string;
}
