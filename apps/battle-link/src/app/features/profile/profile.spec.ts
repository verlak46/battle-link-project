import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { ProfilePage } from './profile';
import { AuthService } from '../../core/services/auth.service';

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
    } as Partial<AuthService> as AuthService;

    await TestBed.configureTestingModule({
      imports: [ProfilePage],
      providers: [provideIonicAngular(), provideRouter([]), { provide: AuthService, useValue: authMock }],
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

  it('should show user display name and email', () => {
    const fixture = TestBed.createComponent(ProfilePage);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Test User');
    expect(el.textContent).toContain('test@example.com');
  });

  it('should call logout when button is clicked', async () => {
    const fixture = TestBed.createComponent(ProfilePage);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const button = Array.from(el.querySelectorAll('ion-button')).find((b) =>
      b.textContent?.includes('Cerrar sesión'),
    ) as HTMLElement | undefined;
    expect(button).toBeTruthy();
    button?.click();
    await Promise.resolve();
    expect(logoutCalled).toBe(1);
  });
});
