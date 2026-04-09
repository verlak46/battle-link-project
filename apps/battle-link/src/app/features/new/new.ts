import { Component, signal, computed, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { AuthService } from '../../core/services/auth.service';
import { addIcons } from 'ionicons';
import {
  gameControllerOutline,
  calendarOutline,
  locationOutline,
  listOutline,
  checkmarkOutline,
  chevronForwardOutline,
  chevronBackOutline,
} from 'ionicons/icons';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { CreationType, NewFormData, WIZARD_STEPS } from './new-form.types';
import { ApiService, CreateEventPayload } from '../../core/services/api.service';
import { Place } from '@battle-link/shared-models';
import { TypeSelectorComponent } from './components/type-selector/type-selector';
import { StepHeaderComponent } from './components/step-header/step-header';
import { StepNavComponent } from './components/step-nav/step-nav';
import { StepEventKindComponent } from './components/step-event-kind/step-event-kind';
import { StepGameComponent } from './components/step-game/step-game';
import { StepDateComponent } from './components/step-date/step-date';
import { StepLocationComponent } from './components/step-location/step-location';
import { StepDetailsComponent } from './components/step-details/step-details';

@Component({
  selector: 'app-new',
  templateUrl: './new.html',
  styleUrl: './new.scss',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    TypeSelectorComponent,
    StepEventKindComponent,
    StepHeaderComponent,
    StepNavComponent,
    StepGameComponent,
    StepDateComponent,
    StepLocationComponent,
    StepDetailsComponent,
    TranslatePipe,
  ],
})
export class NewPage {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  readonly steps = WIZARD_STEPS;

  userLocation = computed(() => this.auth.user()?.location ?? null);
  userLocationLabel = computed(() => this.auth.user()?.locationLabel ?? null);

  type = signal<CreationType | null>('game');

  private readonly emptyForm: NewFormData = {
    game: '',
    system: '',
    startDate: '',
    endDate: '',
    time: '',
    city: '',
    address: '',
    title: '',
    description: '',
    maxPlayers: '',
    contactUrl: '',
    imageUrl: undefined,
    locationMode: undefined,
    locationRadius: undefined,
    locationCoords: undefined,
  };
  currentStep = signal(1);
  saving = signal(false);
  errorMessage = signal<string | null>(null);
  places = toSignal(this.api.getPlaces(), { initialValue: [] as Place[] });

  form = signal<NewFormData>({ ...this.emptyForm });

  isStepValid = computed(() => {
    if (this.type() === null) return false;
    const f = this.form();
    switch (this.currentStep()) {
      case 1: return f.game.trim().length > 0;
      case 2: return f.startDate.trim().length > 0;
      case 3: {
        if (f.placeId) return true;
        if (this.type() === 'game') return true;
        return f.address.trim().length > 0;
      }
      case 4: return f.title.trim().length > 0;
      default: return false;
    }
  });

  isLastStep = computed(() => this.currentStep() === this.steps.length);

  constructor() {
    addIcons({
      gameControllerOutline,
      calendarOutline,
      locationOutline,
      listOutline,
      checkmarkOutline,
      chevronForwardOutline,
      chevronBackOutline,
    });
  }

  onTypeChange(next: CreationType | null): void {
    const prev = this.type();
    const categoryChanged = (prev === 'game') !== (next === 'game');
    this.type.set(next);
    if (categoryChanged) {
      this.form.set({ ...this.emptyForm });
      this.currentStep.set(1);
      this.errorMessage.set(null);
    }
  }

  patch(partial: Partial<NewFormData>) {
    this.form.update((f) => ({ ...f, ...partial }));
  }

  goToStep(step: number) {
    if (step < this.currentStep()) {
      this.currentStep.set(step);
    }
  }

  next() {
    if (!this.isStepValid()) return;
    if (!this.isLastStep()) {
      this.currentStep.update((s) => s + 1);
    }
  }

  previous() {
    if (this.currentStep() > 1) {
      this.currentStep.update((s) => s - 1);
    }
  }

  async confirm(): Promise<void> {
    if (!this.isStepValid()) return;
    this.saving.set(true);
    this.errorMessage.set(null);
    const f = this.form();
    const type = this.type();
    if (type === null) return;
    const location =
      f.locationMode === 'profile' && this.userLocation()
        ? this.userLocation()!
        : f.locationCoords
        ? { type: 'Point' as const, coordinates: [f.locationCoords[1], f.locationCoords[0]] as [number, number] }
        : undefined;
    const payload: CreateEventPayload = {
      title: f.title,
      type,
      game: f.game,
      system: f.system || undefined,
      startDate: f.startDate,
      endDate: f.endDate || undefined,
      time: f.time || undefined,
      description: f.description || undefined,
      imageUrl: f.imageUrl,
      contactUrl: f.contactUrl || undefined,
      maxPlayers: f.maxPlayers ? parseInt(f.maxPlayers, 10) : undefined,
      city: f.city || undefined,
      address: f.address || undefined,
      location,
      locationRadius: f.locationMode === 'approximate' ? f.locationRadius : undefined,
      placeId: f.placeId,
      placeName: f.placeName,
    };
    try {
      await firstValueFrom(this.api.createEvent(payload));
      await this.router.navigate(['/tabs', 'explore']);
    } catch {
      this.errorMessage.set(this.translate.instant('NEW.ERROR'));
      this.saving.set(false);
    }
  }
}
