import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { HomePage } from './home';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';

const MOCK_USER = {
  _id: 'mock-user-id',
  email: 'test@test.com',
  nick: 'testuser',
  name: 'Test User',
  onboardingCompleted: true,
} as any;

function makeAuthMock(user: any = null) {
  return {
    user: signal(user),
    ready: Promise.resolve(),
  } satisfies Partial<AuthService>;
}

function makeApiMock(places: any[] = []) {
  return {
    getPlaces: () => of(places),
  } satisfies Partial<ApiService>;
}

describe('HomePage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        provideIonicAngular(),
        provideRouter([]),
        { provide: AuthService, useValue: makeAuthMock(MOCK_USER) },
        { provide: ApiService, useValue: makeApiMock() },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show nick as displayNick when user has nick', () => {
    const fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
    expect(fixture.componentInstance.displayNick()).toBe('testuser');
  });

  it('should fall back to name when nick is absent', () => {
    TestBed.overrideProvider(AuthService, {
      useValue: makeAuthMock({ ...MOCK_USER, nick: undefined }),
    });
    const fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
    expect(fixture.componentInstance.displayNick()).toBe('Test User');
  });

  it('should fall back to "Jugador" when no nick or name', () => {
    TestBed.overrideProvider(AuthService, {
      useValue: makeAuthMock(null),
    });
    const fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
    expect(fixture.componentInstance.displayNick()).toBe('Jugador');
  });

  it('should render ion-header', () => {
    const fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('ion-header')).toBeTruthy();
  });

  it('should render ion-content', () => {
    const fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('ion-content')).toBeTruthy();
  });

  it('should load nearby places from API', () => {
    const places = [{ _id: 'p1', name: 'Place 1' }, { _id: 'p2', name: 'Place 2' }];
    TestBed.overrideProvider(ApiService, { useValue: makeApiMock(places) });
    const fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
    expect(fixture.componentInstance.nearbyPlaces()).toEqual(places);
  });
});
