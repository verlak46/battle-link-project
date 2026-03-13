import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import {
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logoGoogle } from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';
import { getApiError } from '../../core/utils/api-error';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.scss',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonItem,
    IonInput,
    IonButton,
    IonIcon,
    IonSpinner,
  ],
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly logoUrl = '/logo_white.png';

  /** 'login' | 'register' */
  mode = signal<'login' | 'register'>('login');
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: [''],
  });

  isRegister = computed(() => this.mode() === 'register');

  constructor() {
    addIcons({ logoGoogle });
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
  get confirmPassword() {
    return this.loginForm.get('confirmPassword');
  }

  onSegmentChange(event: CustomEvent) {
    const value = event.detail.value as 'login' | 'register';
    this.mode.set(value);
    this.errorMessage.set(null);
    this.loginForm.patchValue({ confirmPassword: '' });
    if (value === 'login') {
      this.confirmPassword?.clearValidators();
    } else {
      this.confirmPassword?.setValidators([Validators.required]);
    }
    this.confirmPassword?.updateValueAndValidity();
  }

  async submit() {
    this.errorMessage.set(null);
    const email = this.loginForm.get('email')?.value ?? '';
    const password = this.loginForm.get('password')?.value ?? '';

    if (this.isRegister()) {
      const confirm = this.loginForm.get('confirmPassword')?.value ?? '';
      if (password !== confirm) {
        this.errorMessage.set('Las contraseñas no coinciden.');
        return;
      }
    }

    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;

    this.loading.set(true);
    try {
      if (this.isRegister()) {
        await this.auth.register(email, password);
      } else {
        await this.auth.login(email, password);
      }

      const user = this.auth.user();
      const target = user?.onboardingCompleted ? '/' : '/onboarding';
      this.router.navigate([target]);
    } catch (err: unknown) {
      this.errorMessage.set(getApiError(err));
    } finally {
      this.loading.set(false);
    }
  }

  async loginWithGoogle() {
    this.errorMessage.set(null);
    this.loading.set(true);
    try {
      await this.auth.loginWithGoogle();
      const user = this.auth.user();
      const target = user?.onboardingCompleted ? '/' : '/onboarding';
      this.router.navigate([target]);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'code' in err
          ? this.firebaseMessage((err as { code: string }).code)
          : getApiError(err, 'No se pudo iniciar sesión con Google.');
      this.errorMessage.set(message);
    } finally {
      this.loading.set(false);
    }
  }

  private firebaseMessage(code: string): string {
    const messages: Record<string, string> = {
      'auth/email-already-in-use': 'Este correo ya está registrado.',
      'auth/invalid-email': 'Correo electrónico no válido.',
      'auth/operation-not-allowed': 'Operación no permitida.',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
      'auth/user-not-found': 'No existe una cuenta con este correo.',
      'auth/wrong-password': 'Contraseña incorrecta.',
      'auth/invalid-credential': 'Credenciales incorrectas.',
      'auth/popup-closed-by-user': 'Se cerró la ventana de Google.',
      'auth/popup-blocked': 'El navegador bloqueó la ventana de Google.',
    };
    return messages[code] ?? 'Error de autenticación.';
  }
}
