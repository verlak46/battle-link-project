import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { PerfilPage } from './perfil';
import { AuthService } from '../../core/services/auth.service';

function createAuthMock() {
  return {
    user: () =>
      ({
        displayName: 'Test User',
        email: 'test@example.com',
        photoURL: null,
      } as unknown),
    logout: jasmine.createSpy('logout').and.resolveTo(undefined),
  } as Partial<AuthService> as AuthService;
}

describe('PerfilPage', () => {
  let authMock: AuthService;

  beforeEach(async () => {
    authMock = createAuthMock();

    await TestBed.configureTestingModule({
      imports: [PerfilPage],
      providers: [provideIonicAngular(), provideRouter([]), { provide: AuthService, useValue: authMock }],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PerfilPage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render ion-header with title "Perfil"', () => {
    const fixture = TestBed.createComponent(PerfilPage);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('ion-title')?.textContent?.trim()).toBe('Perfil');
  });

  it('should show user display name and email', () => {
    const fixture = TestBed.createComponent(PerfilPage);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Test User');
    expect(el.textContent).toContain('test@example.com');
  });

  it('should call logout when button is clicked', async () => {
    const fixture = TestBed.createComponent(PerfilPage);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const button = Array.from(el.querySelectorAll('ion-button')).find((b) =>
      b.textContent?.includes('Cerrar sesión'),
    ) as HTMLElement | undefined;
    expect(button).toBeTruthy();
    button?.click();
    await Promise.resolve();
    expect(authMock.logout).toHaveBeenCalled();
  });
});
