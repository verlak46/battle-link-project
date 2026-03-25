import { TestBed } from '@angular/core/testing';
import {
  provideHttpClient,
  withInterceptors,
  HttpClient,
} from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

const base = environment.apiUrl.replace(/\/$/, '');

function makeAuthMock(token: string | null) {
  return { getToken: () => token } satisfies Partial<AuthService>;
}

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  function setup(token: string | null) {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: makeAuthMock(token) },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  }

  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  it('should attach Authorization header to API requests when token exists', () => {
    setup('my-jwt-token');

    http.get(`${base}/user/profile`).subscribe();

    const req = httpMock.expectOne(`${base}/user/profile`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer my-jwt-token');
    req.flush({});
  });

  it('should not attach Authorization header when token is null', () => {
    setup(null);

    http.get(`${base}/user/profile`).subscribe();

    const req = httpMock.expectOne(`${base}/user/profile`);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should skip auth routes (/auth/) even when token exists', () => {
    setup('my-jwt-token');

    http.post(`${base}/auth/login`, {}).subscribe();

    const req = httpMock.expectOne(`${base}/auth/login`);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should skip /auth/register even when token exists', () => {
    setup('my-jwt-token');

    http.post(`${base}/auth/register`, {}).subscribe();

    const req = httpMock.expectOne(`${base}/auth/register`);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should not attach Authorization to non-API URLs', () => {
    setup('my-jwt-token');

    http.get('https://external.example.com/data').subscribe();

    const req = httpMock.expectOne('https://external.example.com/data');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});
