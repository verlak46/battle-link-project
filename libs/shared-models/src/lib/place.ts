import { GeoLocation } from './geo';

export type PlaceType = 'store' | 'club';
export type PlaceStatus = 'pending' | 'approved' | 'rejected';

export interface Place {
  _id: string;
  name: string;
  type: PlaceType;
  status: PlaceStatus;
  city: string;
  address: string;
  description?: string;
  phone?: string;
  website?: string;
  wargames: string[];
  location: GeoLocation;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlacePayload {
  name: string;
  type: PlaceType;
  city: string;
  address: string;
  location: GeoLocation;
  description?: string;
  phone?: string;
  website?: string;
  wargames?: string[];
}
