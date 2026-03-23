import { Component, input, output } from '@angular/core';
import { IonButton, IonSpinner } from '@ionic/angular/standalone';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-onboarding-step-location',
  template: `
    <section>
      <h3>Ubicación</h3>
      <p class="onboarding__hint">
        Opcional, pero nos ayuda a mostrarte partidas y eventos cerca de ti.
      </p>

      <ion-button
        expand="block"
        color="secondary"
        (click)="useLocation.emit()"
        [disabled]="locationLoading()"
      >
        @if (locationLoading()) {
          <ion-spinner slot="start"></ion-spinner>
        }
        Usar mi ubicación actual
      </ion-button>

      @if (location()) {
        <p class="onboarding__location">
          Ubicación guardada (lat: {{ location()![0] | number:'1.4-4' }},
          lng: {{ location()![1] | number:'1.4-4' }}).
        </p>
      }
    </section>
  `,
  styles: [`
    .onboarding__hint {
      font-size: 13px;
      color: var(--ion-color-medium);
      margin-bottom: 8px;
    }

    .onboarding__location {
      margin-top: 12px;
      font-size: 13px;
    }
  `],
  imports: [IonButton, IonSpinner, DecimalPipe],
})
export class OnboardingStepLocationComponent {
  location = input<[number, number] | null>(null);
  locationLoading = input(false);

  useLocation = output<void>();
}
