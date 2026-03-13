import { inject, Injectable, signal } from '@angular/core';
import { auth } from '../../app.config';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { firstValueFrom } from 'rxjs';
import { ApiService, AuthPasswordRequest, AuthResponse, AuthUser, UpdateProfilePayload } from './api.service';

const STORAGE_KEY = 'battle-link-auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly firebaseAuth = auth;
  private readonly api = inject(ApiService);

  user = signal<AuthUser | null>(null);
  loading = signal(true);

  private resolveReady!: () => void;
  readonly ready = new Promise<void>((resolve) => {
    this.resolveReady = resolve;
  });

  constructor() {
    this.restoreSession();
  }

  private restoreSession(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const { token, user } = JSON.parse(raw) as { token: string; user: AuthUser };
        if (token && user) {
          this.user.set(user);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      this.loading.set(false);
      this.resolveReady();
    }
  }

  private saveSession(token: string, user: AuthUser): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
    this.user.set(user);
  }

  clearSession(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.user.set(null);
  }

  /** Token JWT para el interceptor HTTP. */
  getToken(): string | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw) as { token?: string };
      return data.token ?? null;
    } catch {
      return null;
    }
  }

  async loginWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(this.firebaseAuth, provider);
    const idToken = await credential.user.getIdToken();
    await signOut(this.firebaseAuth);

    const { token, user }: AuthResponse = await firstValueFrom(this.api.authGoogle(idToken));
    this.saveSession(token, user);
  }

  async logout(): Promise<void> {
    this.clearSession();
  }

  async register(email: string, password: string): Promise<void> {
    const payload: AuthPasswordRequest = { email, password };
    const { token, user }: AuthResponse = await firstValueFrom(this.api.authRegister(payload));
    this.saveSession(token, user);
  }

  async login(email: string, password: string): Promise<void> {
    const payload: AuthPasswordRequest = { email, password };
    const { token, user }: AuthResponse = await firstValueFrom(this.api.authLogin(payload));
    this.saveSession(token, user);
  }

  async refreshProfile(): Promise<void> {
    const profile = await firstValueFrom(this.api.getProfile());

    // Mantener el mismo token en localStorage, solo refrescar los datos de usuario.
    const token = this.getToken();
    if (token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user: profile }));
    }
    this.user.set(profile);
  }

  async completeOnboarding(payload: UpdateProfilePayload): Promise<void> {
    const updated = await firstValueFrom(this.api.completeOnboarding(payload));

    const token = this.getToken();
    if (token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user: updated }));
    }
    this.user.set(updated);
  }

  async forgotPassword(email: string): Promise<void> {
    await firstValueFrom(this.api.authForgotPassword(email));
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await firstValueFrom(this.api.authResetPassword(token, password));
  }

  async updateProfile(payload: UpdateProfilePayload): Promise<void> {
    const updated = await firstValueFrom(this.api.updateProfile(payload));

    const token = this.getToken();
    if (token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user: updated }));
    }
    this.user.set(updated);
  }
}
