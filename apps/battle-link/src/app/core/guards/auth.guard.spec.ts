import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

function makeAuthMock(user: any, ready: Promise<void> = Promise.resolve()) {
  return {
    user: signal(user),
    ready,
  } satisfies Partial<AuthService>;
}

function runGuard(authMock: Partial<AuthService>, url = '/home') {
  TestBed.overrideProvider(AuthService, { useValue: authMock });

  const router = TestBed.inject(Router);
  const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

  const route = {} as any;
  const state = { url } as any;

  const result = TestBed.runInInjectionContext(() => authGuard(route, state));
  return { result, navigateSpy };
}

describe('authGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: makeAuthMock(null) },
      ],
    });
  });

  it('should return false and navigate to /login when user is null', async () => {
    const authMock = makeAuthMock(null);
    const { result, navigateSpy } = runGuard(authMock);

    const outcome = await result;
    expect(outcome).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should return true for authenticated user with onboarding completed', async () => {
    const authMock = makeAuthMock({ onboardingCompleted: true });
    const { result, navigateSpy } = runGuard(authMock);

    const outcome = await result;
    expect(outcome).toBe(true);
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should redirect to /onboarding when user has not completed onboarding', async () => {
    const authMock = makeAuthMock({ onboardingCompleted: false });
    const { result, navigateSpy } = runGuard(authMock, '/home');

    const outcome = await result;
    expect(outcome).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/onboarding']);
  });

  it('should allow access to /onboarding even when onboarding is not completed', async () => {
    const authMock = makeAuthMock({ onboardingCompleted: false });
    const { result, navigateSpy } = runGuard(authMock, '/onboarding');

    const outcome = await result;
    expect(outcome).toBe(true);
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should wait for auth.ready before evaluating', async () => {
    let resolve!: () => void;
    const ready = new Promise<void>((r) => { resolve = r; });
    const authMock = makeAuthMock({ onboardingCompleted: true }, ready);
    const { result } = runGuard(authMock);

    // Not yet resolved
    let settled = false;
    Promise.resolve(result).then(() => { settled = true; });
    await Promise.resolve(); // micro-task flush
    expect(settled).toBe(false);

    resolve();
    const outcome = await Promise.resolve(result);
    expect(outcome).toBe(true);
  });
});
