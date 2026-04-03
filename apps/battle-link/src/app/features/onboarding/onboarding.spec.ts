import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { OnboardingPage } from './onboarding';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { of } from 'rxjs';
import { provideTestTranslations } from '../../testing/translate-testing';

describe('OnboardingPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardingPage],
      providers: [
        provideIonicAngular(),
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            user: () => null,
            completeOnboarding: () => Promise.resolve(),
          } as unknown as Partial<AuthService>,
        },
        {
          provide: ApiService,
          useValue: {
            getWargames: () => of([]),
          } as Partial<ApiService>,
        },
        provideTestTranslations(),
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(OnboardingPage);
    expect(fixture.componentInstance).toBeTruthy();
  });
});

