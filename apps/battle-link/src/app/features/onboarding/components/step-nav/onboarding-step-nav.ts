import { Component, input, output } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-onboarding-step-nav',
  template: `
    <div class="step__actions">
      @if (showPrevious()) {
        <ion-button fill="outline" (click)="previous.emit()">
          Anterior
        </ion-button>
      }
      @if (!isLastStep()) {
        <ion-button
          color="primary"
          (click)="next.emit()"
          [disabled]="!valid()"
        >
          Siguiente
        </ion-button>
      } @else {
        <ion-button
          color="success"
          (click)="finalize.emit()"
          [disabled]="!valid() || loading()"
        >
          Finalizar
        </ion-button>
      }
    </div>
  `,
  styles: [`
    .step__actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 16px;
    }
  `],
  imports: [IonButton],
})
export class OnboardingStepNavComponent {
  valid = input(false);
  isLastStep = input(false);
  showPrevious = input(false);
  loading = input(false);

  previous = output<void>();
  next = output<void>();
  finalize = output<void>();
}
