import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, UrlTree } from '@angular/router';
import { signal } from '@angular/core';
import { adminGuard } from './admin.guard';
import { AuthService } from '../services/auth.service';

function makeAuthMock(user: any) {
  return { user: signal(user), ready: Promise.resolve() } satisfies Partial<AuthService>;
}

function runGuard(authMock: Partial<AuthService>) {
  TestBed.overrideProvider(AuthService, { useValue: authMock });
  const result = TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any));
  return result;
}

describe('adminGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: makeAuthMock(null) },
      ],
    });
  });

  it('should return true for an admin user', async () => {
    const result = await runGuard(makeAuthMock({ isAdmin: true }));
    expect(result).toBe(true);
  });

  it('should return a UrlTree redirecting to / for a non-admin user', async () => {
    const result = await runGuard(makeAuthMock({ isAdmin: false }));
    expect(result instanceof UrlTree).toBe(true);
    const router = TestBed.inject(Router);
    expect(router.serializeUrl(result as UrlTree)).toBe('/');
  });

  it('should return a UrlTree for a null user', async () => {
    const result = await runGuard(makeAuthMock(null));
    expect(result instanceof UrlTree).toBe(true);
  });
});
