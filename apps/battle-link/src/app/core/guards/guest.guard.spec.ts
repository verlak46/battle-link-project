import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';
import { guestGuard } from './guest.guard';
import { AuthService } from '../services/auth.service';

function makeAuthMock(user: any, ready: Promise<void> = Promise.resolve()) {
  return { user: signal(user), ready } satisfies Partial<AuthService>;
}

function runGuard(authMock: Partial<AuthService>) {
  TestBed.overrideProvider(AuthService, { useValue: authMock });
  const router = TestBed.inject(Router);
  const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
  const result = TestBed.runInInjectionContext(() => guestGuard({} as any, {} as any));
  return { result, navigateSpy };
}

describe('guestGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: makeAuthMock(null) },
      ],
    });
  });

  it('should return true when user is not authenticated', async () => {
    const authMock = makeAuthMock(null);
    const { result, navigateSpy } = runGuard(authMock);

    expect(await result).toBe(true);
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should redirect to / when user has completed onboarding', async () => {
    const authMock = makeAuthMock({ onboardingCompleted: true });
    const { result, navigateSpy } = runGuard(authMock);

    expect(await result).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });

  it('should redirect to /onboarding when user has not completed onboarding', async () => {
    const authMock = makeAuthMock({ onboardingCompleted: false });
    const { result, navigateSpy } = runGuard(authMock);

    expect(await result).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/onboarding']);
  });
});
