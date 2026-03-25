import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

const base = environment.apiUrl.replace(/\/$/, '');

function wrap<T>(data: T) {
  return { statusCode: 200, message: 'ok', data };
}

describe('ApiService', () => {
  let service: ApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getWargames()', () => {
    it('should GET /wargames and unwrap data', () => {
      const mockGames = [{ id: 'wh40k', name: 'Warhammer 40K' }];
      service.getWargames().subscribe((res) => expect(res).toEqual(mockGames));
      const req = http.expectOne(`${base}/wargames`);
      expect(req.request.method).toBe('GET');
      req.flush(wrap(mockGames));
    });
  });

  describe('authGoogle()', () => {
    it('should POST /auth/google with token and unwrap', () => {
      const mockRes = { token: 'jwt', user: { _id: '1', email: 'a@b.com' } };
      service.authGoogle('firebase-token').subscribe((res) => expect(res).toEqual(mockRes));
      const req = http.expectOne(`${base}/auth/google`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ token: 'firebase-token' });
      req.flush(wrap(mockRes));
    });
  });

  describe('authRegister()', () => {
    it('should POST /auth/register', () => {
      const payload = { email: 'test@test.com', password: '1234' };
      const mockRes = { token: 'jwt', user: { _id: '1', email: 'test@test.com' } };
      service.authRegister(payload).subscribe((res) => expect(res).toEqual(mockRes));
      const req = http.expectOne(`${base}/auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush(wrap(mockRes));
    });
  });

  describe('authLogin()', () => {
    it('should POST /auth/login', () => {
      const payload = { email: 'test@test.com', password: '1234' };
      const mockRes = { token: 'jwt', user: { _id: '1', email: 'test@test.com' } };
      service.authLogin(payload).subscribe((res) => expect(res).toEqual(mockRes));
      const req = http.expectOne(`${base}/auth/login`);
      expect(req.request.method).toBe('POST');
      req.flush(wrap(mockRes));
    });
  });

  describe('authForgotPassword()', () => {
    it('should POST /auth/forgot-password with email', () => {
      service.authForgotPassword('user@test.com').subscribe();
      const req = http.expectOne(`${base}/auth/forgot-password`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email: 'user@test.com' });
      req.flush(wrap(undefined));
    });
  });

  describe('authResetPassword()', () => {
    it('should POST /auth/reset-password with token and password', () => {
      service.authResetPassword('reset-token', 'newpass').subscribe();
      const req = http.expectOne(`${base}/auth/reset-password`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ token: 'reset-token', password: 'newpass' });
      req.flush(wrap(undefined));
    });
  });

  describe('getProfile()', () => {
    it('should GET /user/profile', () => {
      const mockUser = { _id: '1', email: 'a@b.com' };
      service.getProfile().subscribe((res) => expect(res).toEqual(mockUser));
      const req = http.expectOne(`${base}/user/profile`);
      expect(req.request.method).toBe('GET');
      req.flush(wrap(mockUser));
    });
  });

  describe('completeOnboarding()', () => {
    it('should POST /user/onboarding', () => {
      const payload = { name: 'Test', nick: 'tester' };
      service.completeOnboarding(payload).subscribe();
      const req = http.expectOne(`${base}/user/onboarding`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush(wrap({ _id: '1', email: 'a@b.com' }));
    });
  });

  describe('updateProfile()', () => {
    it('should PATCH /user/profile', () => {
      const payload = { name: 'Updated' };
      service.updateProfile(payload).subscribe();
      const req = http.expectOne(`${base}/user/profile`);
      expect(req.request.method).toBe('PATCH');
      req.flush(wrap({ _id: '1', email: 'a@b.com' }));
    });
  });

  describe('getPlaces()', () => {
    it('should GET /places', () => {
      const mockPlaces = [{ _id: 'p1', name: 'Place 1' }];
      service.getPlaces().subscribe((res) => expect(res).toEqual(mockPlaces));
      const req = http.expectOne(`${base}/places`);
      expect(req.request.method).toBe('GET');
      req.flush(wrap(mockPlaces));
    });
  });

  describe('getPlace()', () => {
    it('should GET /places/:id', () => {
      const mockPlace = { _id: 'p1', name: 'Place 1' };
      service.getPlace('p1').subscribe((res) => expect(res).toEqual(mockPlace));
      const req = http.expectOne(`${base}/places/p1`);
      expect(req.request.method).toBe('GET');
      req.flush(wrap(mockPlace));
    });
  });

  describe('createPlace()', () => {
    it('should POST /places', () => {
      const payload = { name: 'New Place', address: 'Street 1' } as any;
      service.createPlace(payload).subscribe();
      const req = http.expectOne(`${base}/places`);
      expect(req.request.method).toBe('POST');
      req.flush(wrap({ _id: 'p2', name: 'New Place' }));
    });
  });

  describe('deletePlace()', () => {
    it('should DELETE /places/:id', () => {
      service.deletePlace('p1').subscribe();
      const req = http.expectOne(`${base}/places/p1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(wrap(undefined));
    });
  });

  describe('getPendingPlaces()', () => {
    it('should GET /places/pending', () => {
      service.getPendingPlaces().subscribe();
      const req = http.expectOne(`${base}/places/pending`);
      expect(req.request.method).toBe('GET');
      req.flush(wrap([]));
    });
  });

  describe('approvePlace()', () => {
    it('should PATCH /places/:id/approve', () => {
      service.approvePlace('p1').subscribe();
      const req = http.expectOne(`${base}/places/p1/approve`);
      expect(req.request.method).toBe('PATCH');
      req.flush(wrap({ _id: 'p1' }));
    });
  });

  describe('rejectPlace()', () => {
    it('should PATCH /places/:id/reject', () => {
      service.rejectPlace('p1').subscribe();
      const req = http.expectOne(`${base}/places/p1/reject`);
      expect(req.request.method).toBe('PATCH');
      req.flush(wrap({ _id: 'p1' }));
    });
  });
});
