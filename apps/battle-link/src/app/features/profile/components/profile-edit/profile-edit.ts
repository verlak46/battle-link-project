import { Component, OnInit, inject, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
} from '@ionic/angular/standalone';
import { AuthService } from '../../../../core/services/auth.service';
import { ApiService, ExperienceLevel } from '../../../../core/services/api.service';
import { getApiError } from '../../../../core/utils/api-error';
import { Wargame } from '../../../../shared/models/IWargame';
import { OnboardingStepGamesComponent } from '../../../onboarding/components/step-games/step-games';
import { OnboardingStepLocationComponent } from '../../../onboarding/components/step-location/step-location';
import { ImageUploadComponent } from '../../../../shared/components/image-upload/image-upload';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.html',
  styleUrl: './profile-edit.scss',
  imports: [
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonSegment,
    IonSegmentButton,
    IonSpinner,
    OnboardingStepGamesComponent,
    OnboardingStepLocationComponent,
    ImageUploadComponent,
  ],
})
export class ProfileEditComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly api = inject(ApiService);

  closed = output<void>();

  nick = signal('');
  picture = signal<string | undefined>(undefined);
  experienceLevel = signal<ExperienceLevel | null>(null);
  favoriteGamesIds = signal<string[]>([]);
  wargames = toSignal(this.api.getWargames(), { initialValue: [] as Wargame[] });
  location = signal<[number, number] | null>(null);
  locationLoading = signal(false);
  saving = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const current = this.auth.user();
    if (current) {
      this.nick.set(current.nick ?? '');
      this.picture.set(current.picture ?? undefined);
      this.experienceLevel.set(current.experienceLevel ?? null);
      this.favoriteGamesIds.set(current.favoriteGames ?? []);
      const coords = current.location?.coordinates;
      if (coords?.length === 2) {
        const [lng, lat] = coords;
        this.location.set([lat, lng]);
      }
    }

  }

  setExperience(level: ExperienceLevel): void {
    this.experienceLevel.set(level);
  }

  useCurrentLocation(): void {
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

  async save(): Promise<void> {
    this.saving.set(true);
    this.errorMessage.set(null);
    try {
      const coords = this.location();
      let locationPayload: { type: 'Point'; coordinates: [number, number] } | null = null;
      if (coords) {
        locationPayload = { type: 'Point', coordinates: [coords[1], coords[0]] };
      }

      const nickValue = this.nick().trim();
      await this.auth.updateProfile({
        nick: nickValue || undefined,
        experienceLevel: this.experienceLevel() ?? undefined,
        favoriteGames: this.favoriteGamesIds(),
        location: locationPayload,
        picture: this.picture(),
      });
      this.closed.emit();
    } catch (err) {
      this.errorMessage.set(getApiError(err, 'No se pudo guardar el perfil.'));
    } finally {
      this.saving.set(false);
    }
  }

  cancel(): void {
    this.closed.emit();
  }
}
