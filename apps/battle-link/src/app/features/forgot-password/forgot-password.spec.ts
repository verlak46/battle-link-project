import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { signal } from '@angular/core';
import { ForgotPasswordPage } from './forgot-password';
import { AuthService } from '../../core/services/auth.service';

function makeAuthMock(opts: { forgotPassword?: () => Promise<void> } = {}) {
  return {
    user: signal(null),
    ready: Promise.resolve(),
    forgotPassword: opts.forgotPassword ?? vi.fn().mockResolvedValue(undefined),
  } satisfies Partial<AuthService>;
}

describe('ForgotPasswordPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordPage],
      providers: [
        provideIonicAngular(),
        provideRouter([]),
        { provide: AuthService, useValue: makeAuthMock() },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ForgotPasswordPage);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should start with sent = false', () => {
    const fixture = TestBed.createComponent(ForgotPasswordPage);
    expect(fixture.componentInstance.sent()).toBe(false);
  });

  it('should start with loading = false', () => {
    const fixture = TestBed.createComponent(ForgotPasswordPage);
    expect(fixture.componentInstance.loading()).toBe(false);
  });

  it('should not call forgotPassword when form is invalid', async () => {
    const authMock = makeAuthMock();
    TestBed.overrideProvider(AuthService, { useValue: authMock });

    const fixture = TestBed.createComponent(ForgotPasswordPage);
    fixture.detectChanges();

    await fixture.componentInstance.submit();
    expect(authMock.forgotPassword).not.toHaveBeenCalled();
  });

  it('should call forgotPassword with the email and set sent to true on success', async () => {
    const authMock = makeAuthMock();
    TestBed.overrideProvider(AuthService, { useValue: authMock });

    const fixture = TestBed.createComponent(ForgotPasswordPage);
    fixture.detectChanges();

    fixture.componentInstance.form.setValue({ email: 'user@test.com' });
    await fixture.componentInstance.submit();

    expect(authMock.forgotPassword).toHaveBeenCalledWith('user@test.com');
    expect(fixture.componentInstance.sent()).toBe(true);
    expect(fixture.componentInstance.loading()).toBe(false);
  });

  it('should set errorMessage on forgotPassword failure', async () => {
    const { HttpErrorResponse } = await import('@angular/common/http');
    const authMock = makeAuthMock({
      forgotPassword: vi.fn().mockRejectedValue(
        new HttpErrorResponse({ error: { message: 'User not found' }, status: 404 })
      ),
    });
    TestBed.overrideProvider(AuthService, { useValue: authMock });

    const fixture = TestBed.createComponent(ForgotPasswordPage);
    fixture.detectChanges();

    fixture.componentInstance.form.setValue({ email: 'ghost@test.com' });
    await fixture.componentInstance.submit();

    expect(fixture.componentInstance.errorMessage()).toBe('User not found');
    expect(fixture.componentInstance.sent()).toBe(false);
    expect(fixture.componentInstance.loading()).toBe(false);
  });

  it('should mark form invalid for non-email value', async () => {
    const fixture = TestBed.createComponent(ForgotPasswordPage);
    fixture.detectChanges();

    fixture.componentInstance.form.setValue({ email: 'not-an-email' });
    expect(fixture.componentInstance.form.invalid).toBe(true);
  });
});
