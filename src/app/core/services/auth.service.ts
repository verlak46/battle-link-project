import { Injectable, signal } from '@angular/core';
import { auth } from '../../app.config';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, User } from 'firebase/auth';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = auth;

  user = signal<User | null>(null);
  loading = signal(true);

  /** Resuelve cuando el estado de auth ha sido restaurado (útil para guards). */
  private resolveReady!: () => void;
  readonly ready = new Promise<void>((resolve) => {
    this.resolveReady = resolve;
  });

  constructor() {
    onAuthStateChanged(this.auth, (firebaseUser) => {
      this.user.set(firebaseUser);
      this.loading.set(false);
      this.resolveReady();
    });
  }

  async register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  async login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  async logout() {
    return signOut(this.auth);
  }
}