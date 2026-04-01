import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  User,
  GeoLocation,
  ExperienceLevel,
  Game,
  Place,
  CreatePlacePayload,
} from '@battle-link/shared-models';

export type { User as AuthUser, GeoLocation as UserLocation, ExperienceLevel } from '@battle-link/shared-models';

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
  picture?: string;
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

  getWargames(): Observable<Game[]> {
    return this.unwrap(this.http.get<ApiResponse<Game[]>>(`${this.baseUrl}/wargames`));
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

  getProfile(): Observable<User> {
    return this.unwrap(this.http.get<ApiResponse<User>>(`${this.baseUrl}/user/profile`));
  }

  completeOnboarding(payload: UpdateProfilePayload): Observable<User> {
    return this.unwrap(
      this.http.post<ApiResponse<User>>(`${this.baseUrl}/user/onboarding`, payload),
    );
  }

  updateProfile(payload: UpdateProfilePayload): Observable<User> {
    return this.unwrap(
      this.http.patch<ApiResponse<User>>(`${this.baseUrl}/user/profile`, payload),
    );
  }

  getPlaces(): Observable<Place[]> {
    return this.unwrap(this.http.get<ApiResponse<Place[]>>(`${this.baseUrl}/places`));
  }

  getPlace(id: string): Observable<Place> {
    return this.unwrap(this.http.get<ApiResponse<Place>>(`${this.baseUrl}/places/${id}`));
  }

  createPlace(payload: CreatePlacePayload): Observable<Place> {
    return this.unwrap(this.http.post<ApiResponse<Place>>(`${this.baseUrl}/places`, payload));
  }

  updatePlace(id: string, payload: Partial<CreatePlacePayload>): Observable<Place> {
    return this.unwrap(this.http.patch<ApiResponse<Place>>(`${this.baseUrl}/places/${id}`, payload));
  }

  deletePlace(id: string): Observable<void> {
    return this.unwrap(this.http.delete<ApiResponse<void>>(`${this.baseUrl}/places/${id}`));
  }

  getPendingPlaces(): Observable<Place[]> {
    return this.unwrap(this.http.get<ApiResponse<Place[]>>(`${this.baseUrl}/places/pending`));
  }

  approvePlace(id: string): Observable<Place> {
    return this.unwrap(this.http.patch<ApiResponse<Place>>(`${this.baseUrl}/places/${id}/approve`, {}));
  }

  rejectPlace(id: string): Observable<Place> {
    return this.unwrap(this.http.patch<ApiResponse<Place>>(`${this.baseUrl}/places/${id}/reject`, {}));
  }
}
