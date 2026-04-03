import { Component, input, output } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-onboarding-step-nav',
  template: `
    <div class="step__actions">
      @if (showPrevious()) {
        <ion-button fill="outline" (click)="previous.emit()">
          {{ 'COMMON.PREVIOUS' | translate }}
        </ion-button>
      }
      @if (!isLastStep()) {
        <ion-button
          color="primary"
          (click)="next.emit()"
          [disabled]="!valid()"
        >
          {{ 'COMMON.NEXT' | translate }}
        </ion-button>
      } @else {
        <ion-button
          color="success"
          (click)="finalize.emit()"
          [disabled]="!valid() || loading()"
        >
          {{ 'COMMON.FINISH' | translate }}
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
  imports: [IonButton, TranslatePipe],
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
