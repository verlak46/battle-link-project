import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
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
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
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
    TranslatePipe,
  ],
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly translate = inject(TranslateService);

  readonly logoUrl = '/logo_white.png';

  mode = signal<'login' | 'register'>('login');
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  sessionExpired = signal(false);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: [''],
  });

  isRegister = computed(() => this.mode() === 'register');

  constructor() {
    addIcons({ logoGoogle });
    this.sessionExpired.set(this.route.snapshot.queryParamMap.get('reason') === 'session-expired');
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
        this.errorMessage.set(this.translate.instant('LOGIN.ERROR_PASSWORDS_MISMATCH'));
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
          : getApiError(err, this.translate.instant('LOGIN.ERROR_GOOGLE'));
      this.errorMessage.set(message);
    } finally {
      this.loading.set(false);
    }
  }

  private firebaseMessage(code: string): string {
    const keyMap: Record<string, string> = {
      'auth/email-already-in-use': 'LOGIN.FIREBASE_EMAIL_IN_USE',
      'auth/invalid-email': 'LOGIN.FIREBASE_INVALID_EMAIL',
      'auth/operation-not-allowed': 'LOGIN.FIREBASE_OPERATION_NOT_ALLOWED',
      'auth/weak-password': 'LOGIN.FIREBASE_WEAK_PASSWORD',
      'auth/user-disabled': 'LOGIN.FIREBASE_USER_DISABLED',
      'auth/user-not-found': 'LOGIN.FIREBASE_USER_NOT_FOUND',
      'auth/wrong-password': 'LOGIN.FIREBASE_WRONG_PASSWORD',
      'auth/invalid-credential': 'LOGIN.FIREBASE_INVALID_CREDENTIAL',
      'auth/popup-closed-by-user': 'LOGIN.FIREBASE_POPUP_CLOSED',
      'auth/popup-blocked': 'LOGIN.FIREBASE_POPUP_BLOCKED',
    };
    const key = keyMap[code] ?? 'LOGIN.ERROR_AUTH';
    return this.translate.instant(key);
  }
}
