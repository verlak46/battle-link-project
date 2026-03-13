import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { gameControllerOutline, locationOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApiService, ExperienceLevel } from '../../core/services/api.service';
import { Wargame } from '../../shared/models/IWargame';
import { StepHeaderComponent } from '../nuevo/components/step-header/step-header';
import { PasoPerfilOnboardingComponent } from './components/paso-perfil/paso-perfil';
import { PasoJuegosOnboardingComponent } from './components/paso-juegos/paso-juegos';
import { PasoUbicacionOnboardingComponent } from './components/paso-ubicacion/paso-ubicacion';
import { OnboardingStepNavComponent } from './components/step-nav/onboarding-step-nav';
import { getApiError } from '../../core/utils/api-error';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.scss',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSpinner,
    StepHeaderComponent,
    PasoPerfilOnboardingComponent,
    PasoJuegosOnboardingComponent,
    PasoUbicacionOnboardingComponent,
    OnboardingStepNavComponent,
  ],
})
export class OnboardingPage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  step = signal(1);
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  wargames = toSignal(this.api.getWargames(), { initialValue: [] as Wargame[] });

  name = signal('');
  nick = signal('');
  experienceLevel = signal<ExperienceLevel | null>(null);
  favoriteGamesIds = signal<string[]>([]);

  location = signal<[number, number] | null>(null);
  locationLoading = signal(false);

  experienceLabel(level: ExperienceLevel): string {
    if (level === 'beginner') return 'Principiante';
    if (level === 'casual') return 'Casual';
    return 'Competitivo';
  }

  pasos = [
    { id: 1, titulo: 'Perfil', icono: 'person-circle-outline' },
    { id: 2, titulo: 'Juegos favoritos', icono: 'game-controller-outline' },
    { id: 3, titulo: 'Ubicación', icono: 'location-outline' },
  ];

  totalPasos = this.pasos.length;

  esUltimoPaso = computed(() => this.step() === this.totalPasos);

  esPasoValido = computed(() => {
    switch (this.step()) {
      case 1:
        return this.name().trim().length > 0 && this.nick().trim().length >= 3 && !!this.experienceLevel();
      case 2:
        return this.favoriteGamesIds().length > 0;
      case 3:
        // La ubicación es opcional; siempre válido.
        return true;
      default:
        return false;
    }
  });

  constructor() {
    addIcons({ gameControllerOutline, locationOutline });
  }

  ngOnInit(): void {
    const current = this.auth.user();
    if (current) {
      this.name.set(current.name ?? '');
      this.nick.set(current.nick ?? current.name ?? '');
      if (current.experienceLevel) {
        this.experienceLevel.set(current.experienceLevel);
      }
      if (current.favoriteGames?.length) {
        this.favoriteGamesIds.set(current.favoriteGames);
      }
    }

  }

  siguiente() {
    if (!this.esPasoValido()) return;
    if (!this.esUltimoPaso()) {
      this.step.update((s) => s + 1);
    }
  }

  anterior() {
    if (this.step() > 1) {
      this.step.update((s) => s - 1);
    }
  }

  usarUbicacionActual() {
    if (!('geolocation' in navigator)) {
      this.errorMessage.set('La geolocalización no está disponible en este navegador.');
      return;
    }

    this.locationLoading.set(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.location.set([pos.coords.latitude, pos.coords.longitude]);
        this.locationLoading.set(false);
      },
      () => {
        this.locationLoading.set(false);
        this.errorMessage.set('No se pudo obtener tu ubicación.');
      },
    );
  }

  async finalizar() {
    if (!this.esPasoValido()) return;
    this.loading.set(true);
    this.errorMessage.set(null);

    try {
      const coords = this.location();
      let location: { type: 'Point'; coordinates: [number, number] } | null = null;
      if (coords) {
        location = {
          type: 'Point',
          // GeoJSON: [long, lat]
          coordinates: [coords[1], coords[0]],
        };
      }

      await this.auth.completeOnboarding({
        name: this.name().trim(),
        nick: this.nick().trim(),
        experienceLevel: this.experienceLevel() ?? undefined,
        favoriteGames: this.favoriteGamesIds(),
        location,
      });

      this.router.navigate(['/']);
    } catch (err) {
      const message = getApiError(err, 'No se pudo completar el onboarding.');
      this.errorMessage.set(message);
    } finally {
      this.loading.set(false);
    }
  }
}
