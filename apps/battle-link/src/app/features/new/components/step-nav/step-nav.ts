import { Component, input, output } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForwardOutline, chevronBackOutline, checkmarkOutline } from 'ionicons/icons';
import { CreationType } from '../../new-form.types';

@Component({
  selector: 'app-step-nav',
  template: `
    <div class="step__actions">
      @if (showPrevious()) {
        <ion-button fill="outline" (click)="previous.emit()">
          <ion-icon slot="start" name="chevron-back-outline"></ion-icon>
          Anterior
        </ion-button>
      }
      @if (!isLastStep()) {
        <ion-button [disabled]="!valid()" (click)="next.emit()" class="btn-siguiente">
          Siguiente
          <ion-icon slot="end" name="chevron-forward-outline"></ion-icon>
        </ion-button>
      } @else {
        <ion-button [disabled]="!valid()" (click)="confirm.emit()" color="success" class="btn-siguiente">
          <ion-icon slot="start" name="checkmark-outline"></ion-icon>
          {{ type() === 'partida' ? 'Crear Partida' : 'Crear Evento' }}
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
      padding-bottom: 8px;
    }
    .btn-siguiente { flex: 1; max-width: 200px; }
  `],
  imports: [IonButton, IonIcon],
})
export class StepNavComponent {
  type = input.required<CreationType>();
  valid = input(false);
  isLastStep = input(false);
  showPrevious = input(false);

  previous = output<void>();
  next = output<void>();
  confirm = output<void>();

  constructor() {
    addIcons({ chevronForwardOutline, chevronBackOutline, checkmarkOutline });
  }
}
