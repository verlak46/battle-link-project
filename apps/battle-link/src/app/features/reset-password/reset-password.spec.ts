import { TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { signal } from '@angular/core';
import { ResetPasswordPage } from './reset-password';
import { AuthService } from '../../core/services/auth.service';
import { provideTestTranslations } from '../../testing/translate-testing';

function makeRoute(token: string | null) {
  return {
    snapshot: {
      queryParamMap: {
        get: (key: string) => (key === 'token' ? token : null),
      },
    },
  };
}

function makeAuthMock(opts: { resetPassword?: () => Promise<void> } = {}) {
  return {
    user: signal(null),
    ready: Promise.resolve(),
    resetPassword: opts.resetPassword ?? vi.fn().mockResolvedValue(undefined),
  } satisfies Partial<AuthService>;
}

describe('ResetPasswordPage', () => {
  function setup(token: string | null = 'valid-token', authMock = makeAuthMock()) {
    TestBed.configureTestingModule({
      imports: [ResetPasswordPage],
      providers: [
        provideIonicAngular(),
        provideRouter([]),
        { provide: AuthService, useValue: authMock },
        { provide: ActivatedRoute, useValue: makeRoute(token) },
        provideTestTranslations(),
      ],
    });
    const fixture = TestBed.createComponent(ResetPasswordPage);
    fixture.detectChanges();
    return { fixture, authMock };
  }

  afterEach(() => TestBed.resetTestingModule());

  it('should create', () => {
    const { fixture } = setup();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should set invalidToken = true when no token in query params', () => {
    const { fixture } = setup(null);
    expect(fixture.componentInstance.invalidToken()).toBe(true);
  });

  it('should not set invalidToken when token is present', () => {
    const { fixture } = setup('my-token');
    expect(fixture.componentInstance.invalidToken()).toBe(false);
  });

  it('should not call resetPassword if form is invalid', async () => {
    const { fixture, authMock } = setup();
    await fixture.componentInstance.submit();
    expect(authMock.resetPassword).not.toHaveBeenCalled();
  });

  it('should set errorMessage when passwords do not match', async () => {
    const { fixture } = setup();
    fixture.componentInstance.form.setValue({ password: 'password1', confirmPassword: 'password2' });
    await fixture.componentInstance.submit();
    expect(fixture.componentInstance.errorMessage()).toBe('Las contraseñas no coinciden.');
  });

  it('should call resetPassword and set done=true on success', async () => {
    const authMock = makeAuthMock();
    const { fixture } = setup('my-token', authMock);

    fixture.componentInstance.form.setValue({ password: 'password1', confirmPassword: 'password1' });
    await fixture.componentInstance.submit();

    expect(authMock.resetPassword).toHaveBeenCalledWith('my-token', 'password1');
    expect(fixture.componentInstance.done()).toBe(true);
    expect(fixture.componentInstance.loading()).toBe(false);
  });

  it('should set errorMessage on resetPassword failure', async () => {
    const { HttpErrorResponse } = await import('@angular/common/http');
    const authMock = makeAuthMock({
      resetPassword: vi.fn().mockRejectedValue(
        new HttpErrorResponse({ error: { message: 'Token expired' }, status: 400 })
      ),
    });
    const { fixture } = setup('expired-token', authMock);

    fixture.componentInstance.form.setValue({ password: 'password1', confirmPassword: 'password1' });
    await fixture.componentInstance.submit();

    expect(fixture.componentInstance.errorMessage()).toBe('Token expired');
    expect(fixture.componentInstance.done()).toBe(false);
    expect(fixture.componentInstance.loading()).toBe(false);
  });

  it('should require password of at least 8 characters', () => {
    const { fixture } = setup();
    fixture.componentInstance.form.setValue({ password: 'short', confirmPassword: 'short' });
    expect(fixture.componentInstance.form.invalid).toBe(true);
  });
});
