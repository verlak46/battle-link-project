import { Component, signal, computed, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
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

import { CreationType, NewFormData, WIZARD_STEPS } from './new-form.types';
import { ApiService } from '../../core/services/api.service';
import { Place } from '@battle-link/shared-models';
import { TypeSelectorComponent } from './components/type-selector/type-selector';
import { StepHeaderComponent } from './components/step-header/step-header';
import { StepNavComponent } from './components/step-nav/step-nav';
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
    StepHeaderComponent,
    StepNavComponent,
    StepGameComponent,
    StepDateComponent,
    StepLocationComponent,
    StepDetailsComponent,
  ],
})
export class NewPage {
  private readonly api = inject(ApiService);
  readonly steps = WIZARD_STEPS;

  type = signal<CreationType>('partida');
  currentStep = signal(1);
  places = toSignal(this.api.getPlaces(), { initialValue: [] as Place[] });

  form = signal<NewFormData>({
    game: '',
    system: '',
    date: '',
    time: '',
    city: '',
    address: '',
    title: '',
    description: '',
    maxPlayers: '',
    imageUrl: undefined,
  });

  isStepValid = computed(() => {
    const f = this.form();
    switch (this.currentStep()) {
      case 1: return f.game.trim().length > 0;
      case 2: return f.date.trim().length > 0;
      case 3: return f.city.trim().length > 0;
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

  confirm() {
    if (!this.isStepValid()) return;
    console.log('Crear', this.type(), this.form());
  }
}
