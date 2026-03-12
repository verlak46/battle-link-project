export type VenueType = 'store' | 'club';
export type VenueStatus = 'pending' | 'approved' | 'rejected';

export interface Venue {
  _id: string;
  name: string;
  type: VenueType;
  status: VenueStatus;
  city: string;
  address: string;
  description?: string;
  phone?: string;
  website?: string;
  wargames: string[];
  location: { type: 'Point'; coordinates: [number, number] };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVenuePayload {
  name: string;
  type: VenueType;
  city: string;
  address: string;
  location: { type: 'Point'; coordinates: [number, number] };
  description?: string;
  phone?: string;
  website?: string;
  wargames?: string[];
}
