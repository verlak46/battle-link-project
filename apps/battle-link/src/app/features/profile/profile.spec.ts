import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { of } from 'rxjs';
import { ProfilePage } from './profile';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { provideTestTranslations } from '../../testing/translate-testing';

describe('ProfilePage', () => {
  let authMock: AuthService;
  let logoutCalled = 0;

  beforeEach(async () => {
    logoutCalled = 0;
    authMock = {
      user: () =>
        ({
          name: 'Test User',
          email: 'test@example.com',
          picture: null,
        } as unknown),
      logout: async () => {
        logoutCalled++;
      },
      ready: Promise.resolve(),
      refreshProfile: async () => {},
    } as Partial<AuthService> as AuthService;

    await TestBed.configureTestingModule({
      imports: [ProfilePage],
      providers: [
        provideIonicAngular(),
        provideRouter([{ path: 'login', component: ProfilePage }]),
        { provide: AuthService, useValue: authMock },
        { provide: ApiService, useValue: { getMyEvents: () => of([]) } },
        provideTestTranslations(),
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ProfilePage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render ion-header with title "Perfil"', () => {
    const fixture = TestBed.createComponent(ProfilePage);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('ion-title')?.textContent?.trim()).toBe('Perfil');
  });

  it('should show user initials in the avatar', () => {
    const fixture = TestBed.createComponent(ProfilePage);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    // initials computed from "Test User" → "TU"
    expect(el.textContent).toContain('TU');
  });

  it('should show email in account view', () => {
    const fixture = TestBed.createComponent(ProfilePage);
    fixture.detectChanges();
    fixture.componentInstance.showAccount.set(true);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('test@example.com');
  });

  it('should call logout when Cerrar sesión button is clicked in account view', async () => {
    const fixture = TestBed.createComponent(ProfilePage);
    fixture.detectChanges();
    fixture.componentInstance.showAccount.set(true);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const button = Array.from(el.querySelectorAll('ion-item')).find((b) =>
      b.textContent?.includes('Cerrar sesión'),
    ) as HTMLElement | undefined;
    expect(button).toBeTruthy();
    button?.click();
    await Promise.resolve();
    expect(logoutCalled).toBe(1);
  });
});
