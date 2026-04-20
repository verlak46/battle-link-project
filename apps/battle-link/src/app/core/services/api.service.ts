import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  User,
  GeoLocation,
  ExperienceLevel,
  Game,
  Place,
  CreatePlacePayload,
  Event,
  EventsPage,
  CreateEventPayload,
} from '@battle-link/shared-models';

export type { User as AuthUser, GeoLocation as UserLocation, ExperienceLevel, Event, EventsPage, CreateEventPayload } from '@battle-link/shared-models';

export interface AuthResponse {
  token: string;
  user: User;
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
  location?: GeoLocation | null;
  locationLabel?: string;
  picture?: string;
}

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl.replace(/\/$/, '');

  private get<T>(path: string): Observable<T> {
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}/${path}`).pipe(map((res) => res.data));
  }

  private getWithParams<T>(path: string, params: Record<string, string>): Observable<T> {
    const httpParams = new HttpParams({ fromObject: params });
    return this.http
      .get<ApiResponse<T>>(`${this.baseUrl}/${path}`, { params: httpParams })
      .pipe(map((res) => res.data));
  }

  private post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}/${path}`, body).pipe(map((res) => res.data));
  }

  private patch<T>(path: string, body: unknown): Observable<T> {
    return this.http.patch<ApiResponse<T>>(`${this.baseUrl}/${path}`, body).pipe(map((res) => res.data));
  }

  private delete<T>(path: string): Observable<T> {
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}/${path}`).pipe(map((res) => res.data));
  }

  // Auth
  authGoogle(token: string): Observable<AuthResponse> {
    return this.post('auth/google', { token });
  }

  authRegister(payload: AuthPasswordRequest): Observable<AuthResponse> {
    return this.post('auth/register', payload);
  }

  authLogin(payload: AuthPasswordRequest): Observable<AuthResponse> {
    return this.post('auth/login', payload);
  }

  authForgotPassword(email: string): Observable<void> {
    return this.post('auth/forgot-password', { email });
  }

  authResetPassword(token: string, password: string): Observable<void> {
    return this.post('auth/reset-password', { token, password });
  }

  // User
  getProfile(): Observable<User> {
    return this.get('user/profile');
  }

  completeOnboarding(payload: UpdateProfilePayload): Observable<User> {
    return this.post('user/onboarding', payload);
  }

  updateProfile(payload: UpdateProfilePayload): Observable<User> {
    return this.patch('user/profile', payload);
  }

  // Wargames
  getWargames(): Observable<Game[]> {
    return this.get('wargames');
  }

  // Events
  createEvent(payload: CreateEventPayload): Observable<Event> {
    return this.post('events', payload);
  }

  getEvents(params: { lat?: number; lng?: number; page?: number; limit?: number; excludeUserId?: string } = {}): Observable<EventsPage> {
    const p: Record<string, string> = {};
    if (params.lat != null) p['lat'] = String(params.lat);
    if (params.lng != null) p['lng'] = String(params.lng);
    if (params.page != null) p['page'] = String(params.page);
    if (params.limit != null) p['limit'] = String(params.limit);
    if (params.excludeUserId) p['excludeUserId'] = params.excludeUserId;
    return this.getWithParams<EventsPage>('events', p);
  }

  getMyEvents(): Observable<Event[]> {
    return this.get('events/mine');
  }

  getEvent(id: string): Observable<Event> {
    return this.get(`events/${id}`);
  }

  joinEvent(id: string): Observable<Event> {
    return this.patch(`events/${id}/join`, {});
  }

  leaveEvent(id: string): Observable<Event> {
    return this.patch(`events/${id}/leave`, {});
  }

  // Places
  getPlaces(): Observable<Place[]> {
    return this.get('places');
  }

  getPlace(id: string): Observable<Place> {
    return this.get(`places/${id}`);
  }

  createPlace(payload: CreatePlacePayload): Observable<Place> {
    return this.post('places', payload);
  }

  updatePlace(id: string, payload: Partial<CreatePlacePayload>): Observable<Place> {
    return this.patch(`places/${id}`, payload);
  }

  deletePlace(id: string): Observable<void> {
    return this.delete(`places/${id}`);
  }

  getPendingPlaces(): Observable<Place[]> {
    return this.get('places/pending');
  }

  approvePlace(id: string): Observable<Place> {
    return this.patch(`places/${id}/approve`, {});
  }

  rejectPlace(id: string): Observable<Place> {
    return this.patch(`places/${id}/reject`, {});
  }
}
