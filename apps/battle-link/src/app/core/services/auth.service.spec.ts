import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { vi } from 'vitest';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

// Mock Firebase packages (npm modules — allowed in Angular tests)
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  GoogleAuthProvider: class {},
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
}));

const base = environment.apiUrl.replace(/\/$/, '');
const STORAGE_KEY = 'battle-link-auth';

function wrap<T>(data: T) {
  return { statusCode: 200, message: 'ok', data };
}

const MOCK_USER = {
  _id: 'u1',
  email: 'test@test.com',
  onboardingCompleted: false,
} as any;

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with null user when no session in localStorage', () => {
    expect(service.user()).toBeNull();
  });

  it('should restore user from localStorage on construction', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: 'tok', user: MOCK_USER }));

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const freshService = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);

    expect(freshService.user()).toEqual(MOCK_USER);
  });

  it('should clear session if localStorage has invalid JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'NOT_JSON');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const freshService = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);

    expect(freshService.user()).toBeNull();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('should resolve ready promise after construction', async () => {
    await expect(service.ready).resolves.toBeUndefined();
  });

  it('getToken() should return null when no session', () => {
    expect(service.getToken()).toBeNull();
  });

  it('getToken() should return stored token', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: 'my-token', user: MOCK_USER }));
    expect(service.getToken()).toBe('my-token');
  });

  it('clearSession() should remove localStorage and set user to null', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: 'tok', user: MOCK_USER }));
    service['user'].set(MOCK_USER);

    service.clearSession();

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(service.user()).toBeNull();
  });

  it('logout() should clear the session', async () => {
    service['user'].set(MOCK_USER);
    await service.logout();
    expect(service.user()).toBeNull();
  });

  it('login() should call /auth/login and save session', async () => {
    const promise = service.login('test@test.com', '1234');

    const req = http.expectOne(`${base}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@test.com', password: '1234' });
    req.flush(wrap({ token: 'jwt-token', user: MOCK_USER }));

    await promise;

    expect(service.user()).toEqual(MOCK_USER);
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored.token).toBe('jwt-token');
    expect(stored.user).toEqual(MOCK_USER);
  });

  it('register() should call /auth/register and save session', async () => {
    const promise = service.register('new@test.com', 'pass123');

    const req = http.expectOne(`${base}/auth/register`);
    expect(req.request.method).toBe('POST');
    req.flush(wrap({ token: 'jwt-new', user: { ...MOCK_USER, email: 'new@test.com' } }));

    await promise;

    expect(service.user()?.email).toBe('new@test.com');
    expect(service.getToken()).toBe('jwt-new');
  });

  it('refreshProfile() should call /user/profile and update user signal', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: 'existing-token', user: MOCK_USER }));
    const updatedUser = { ...MOCK_USER, name: 'Updated Name' };

    const promise = service.refreshProfile();

    const req = http.expectOne(`${base}/user/profile`);
    req.flush(wrap(updatedUser));
    await promise;

    expect(service.user()).toEqual(updatedUser);
    expect(service.getToken()).toBe('existing-token');
  });

  it('completeOnboarding() should POST and update user signal', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: 'tok', user: MOCK_USER }));
    const payload = { name: 'Test', nick: 'tester', favoriteGames: ['wh40k'] };
    const updatedUser = { ...MOCK_USER, onboardingCompleted: true };

    const promise = service.completeOnboarding(payload);

    const req = http.expectOne(`${base}/user/onboarding`);
    expect(req.request.method).toBe('POST');
    req.flush(wrap(updatedUser));
    await promise;

    expect(service.user()?.onboardingCompleted).toBe(true);
  });

  it('forgotPassword() should call /auth/forgot-password', async () => {
    const promise = service.forgotPassword('user@test.com');

    const req = http.expectOne(`${base}/auth/forgot-password`);
    expect(req.request.body).toEqual({ email: 'user@test.com' });
    req.flush(wrap(undefined));

    await promise;
  });

  it('resetPassword() should call /auth/reset-password', async () => {
    const promise = service.resetPassword('reset-tok', 'newpassword');

    const req = http.expectOne(`${base}/auth/reset-password`);
    expect(req.request.body).toEqual({ token: 'reset-tok', password: 'newpassword' });
    req.flush(wrap(undefined));

    await promise;
  });

  it('updateProfile() should PATCH /user/profile and update user', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: 'tok', user: MOCK_USER }));
    const payload = { name: 'New Name' };
    const updatedUser = { ...MOCK_USER, name: 'New Name' };

    const promise = service.updateProfile(payload);

    const req = http.expectOne(`${base}/user/profile`);
    expect(req.request.method).toBe('PATCH');
    req.flush(wrap(updatedUser));
    await promise;

    expect(service.user()?.name).toBe('New Name');
  });
});
