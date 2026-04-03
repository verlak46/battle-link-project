import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { LoginPage } from './login';
import { AuthService } from '../../core/services/auth.service';
import { provideTestTranslations } from '../../testing/translate-testing';

function createAuthMock() {
  const login = async (email: string, password: string) => undefined;
  const register = async (email: string, password: string) => undefined;
  const loginWithGoogle = async () => undefined;
  return {
    user: () => ({ onboardingCompleted: true } as unknown),
    loading: () => false,
    login,
    register,
    loginWithGoogle,
    loginCalls: [] as [string, string][],
    registerCalls: [] as [string, string][],
  };
}

describe('LoginPage', () => {
  let authMock: ReturnType<typeof createAuthMock>;

  beforeEach(async () => {
    authMock = createAuthMock();
    authMock.login = async (email: string, password: string) => {
      authMock.loginCalls.push([email, password]);
    };
    authMock.register = async (email: string, password: string) => {
      authMock.registerCalls.push([email, password]);
    };

    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        provideIonicAngular(),
        provideRouter([
          { path: '', component: LoginPage },
          { path: 'onboarding', component: LoginPage },
        ]),
        { provide: AuthService, useValue: authMock },
        provideTestTranslations(),
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(LoginPage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should use logo at /logo_white.png', () => {
    const fixture = TestBed.createComponent(LoginPage);
    expect(fixture.componentInstance.logoUrl).toBe('/logo_white.png');
  });

  it('should default to login mode', () => {
    const fixture = TestBed.createComponent(LoginPage);
    expect(fixture.componentInstance.mode()).toBe('login');
  });

  it('should have segment for login and register', () => {
    const fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const buttons = el.querySelectorAll('ion-segment-button');
    expect(buttons.length).toBe(2);
    expect(Array.from(buttons).map((b) => b.getAttribute('value'))).toEqual([
      'login',
      'register',
    ]);
  });

  it('should show confirm password field only in register mode', () => {
    const fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[formControlName="confirmPassword"]')).toBeNull();
    fixture.componentInstance.mode.set('register');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[formControlName="confirmPassword"]')).toBeTruthy();
  });

  it('submit should call auth.login in login mode', async () => {
    const fixture = TestBed.createComponent(LoginPage);
    fixture.componentInstance.loginForm.patchValue({
      email: 'a@b.com',
      password: '123456',
    });
    fixture.detectChanges();
    await fixture.componentInstance.submit();
    expect(authMock.loginCalls).toEqual([['a@b.com', '123456']]);
  });

  it('submit should call auth.register in register mode', async () => {
    const fixture = TestBed.createComponent(LoginPage);
    fixture.componentInstance.mode.set('register');
    fixture.componentInstance.loginForm.patchValue({
      email: 'a@b.com',
      password: '123456',
      confirmPassword: '123456',
    });
    fixture.detectChanges();
    await fixture.componentInstance.submit();
    expect(authMock.registerCalls).toEqual([['a@b.com', '123456']]);
  });
});
