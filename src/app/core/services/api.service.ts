import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Wargame } from '../../shared/models/IWargame';
import { Venue, CreateVenuePayload } from '../../shared/models/IVenue';

export type ExperienceLevel = 'beginner' | 'casual' | 'competitive';

export interface UserLocation {
  type: 'Point';
  coordinates: [number, number];
}

export interface AuthUser {
  _id: string;
  provider: 'local' | 'google';
  googleId?: string | null;
  email: string;
  name: string;
  nick?: string;
  picture?: string | null;
  favoriteGames: string[];
  experienceLevel?: ExperienceLevel;
  location?: UserLocation | null;
  onboardingCompleted: boolean;
  isAdmin?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface AuthPasswordRequest {
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  name?: string;
  nick?: string;
  favoriteGames?: string[];
  experienceLevel?: ExperienceLevel;
  location?: UserLocation | null;
}

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = environment.apiUrl.replace(/\/$/, '');

  constructor(private readonly http: HttpClient) {}

  private unwrap<T>(source: Observable<ApiResponse<T>>): Observable<T> {
    return source.pipe(map((res) => res.data));
  }

  getWargames(): Observable<Wargame[]> {
    return this.unwrap(this.http.get<ApiResponse<Wargame[]>>(`${this.baseUrl}/wargames`));
  }

  authGoogle(token: string): Observable<AuthResponse> {
    return this.unwrap(
      this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/auth/google`, { token }),
    );
  }

  authRegister(payload: AuthPasswordRequest): Observable<AuthResponse> {
    return this.unwrap(
      this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/auth/register`, payload),
    );
  }

  authLogin(payload: AuthPasswordRequest): Observable<AuthResponse> {
    return this.unwrap(
      this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/auth/login`, payload),
    );
  }

  authForgotPassword(email: string): Observable<void> {
    return this.unwrap(
      this.http.post<ApiResponse<void>>(`${this.baseUrl}/auth/forgot-password`, { email }),
    );
  }

  authResetPassword(token: string, password: string): Observable<void> {
    return this.unwrap(
      this.http.post<ApiResponse<void>>(`${this.baseUrl}/auth/reset-password`, { token, password }),
    );
  }

  getProfile(): Observable<AuthUser> {
    return this.unwrap(this.http.get<ApiResponse<AuthUser>>(`${this.baseUrl}/user/profile`));
  }

  completeOnboarding(payload: UpdateProfilePayload): Observable<AuthUser> {
    return this.unwrap(
      this.http.post<ApiResponse<AuthUser>>(`${this.baseUrl}/user/onboarding`, payload),
    );
  }

  updateProfile(payload: UpdateProfilePayload): Observable<AuthUser> {
    return this.unwrap(
      this.http.patch<ApiResponse<AuthUser>>(`${this.baseUrl}/user/profile`, payload),
    );
  }

  getVenues(): Observable<Venue[]> {
    return this.unwrap(this.http.get<ApiResponse<Venue[]>>(`${this.baseUrl}/venues`));
  }

  getVenue(id: string): Observable<Venue> {
    return this.unwrap(this.http.get<ApiResponse<Venue>>(`${this.baseUrl}/venues/${id}`));
  }

  createVenue(payload: CreateVenuePayload): Observable<Venue> {
    return this.unwrap(this.http.post<ApiResponse<Venue>>(`${this.baseUrl}/venues`, payload));
  }

  updateVenue(id: string, payload: Partial<CreateVenuePayload>): Observable<Venue> {
    return this.unwrap(this.http.patch<ApiResponse<Venue>>(`${this.baseUrl}/venues/${id}`, payload));
  }

  deleteVenue(id: string): Observable<void> {
    return this.unwrap(this.http.delete<ApiResponse<void>>(`${this.baseUrl}/venues/${id}`));
  }

  getPendingVenues(): Observable<Venue[]> {
    return this.unwrap(this.http.get<ApiResponse<Venue[]>>(`${this.baseUrl}/venues/pending`));
  }

  approveVenue(id: string): Observable<Venue> {
    return this.unwrap(this.http.patch<ApiResponse<Venue>>(`${this.baseUrl}/venues/${id}/approve`, {}));
  }

  rejectVenue(id: string): Observable<Venue> {
    return this.unwrap(this.http.patch<ApiResponse<Venue>>(`${this.baseUrl}/venues/${id}/reject`, {}));
  }
}
