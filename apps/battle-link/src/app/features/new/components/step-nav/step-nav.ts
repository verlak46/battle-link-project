import { Component, input, output } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForwardOutline, chevronBackOutline, checkmarkOutline } from 'ionicons/icons';
import { TipoCreacion } from '../../new-form.types';

@Component({
  selector: 'app-step-nav',
  template: `
    <div class="step__actions">
      @if (mostrarAnterior()) {
        <ion-button fill="outline" (click)="anterior.emit()">
          <ion-icon slot="start" name="chevron-back-outline"></ion-icon>
          Anterior
        </ion-button>
      }
      @if (!esUltimoPaso()) {
        <ion-button [disabled]="!valido()" (click)="siguiente.emit()" class="btn-siguiente">
          Siguiente
          <ion-icon slot="end" name="chevron-forward-outline"></ion-icon>
        </ion-button>
      } @else {
        <ion-button [disabled]="!valido()" (click)="confirmar.emit()" color="success" class="btn-siguiente">
          <ion-icon slot="start" name="checkmark-outline"></ion-icon>
          {{ tipo() === 'partida' ? 'Crear Partida' : 'Crear Evento' }}
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
  tipo = input.required<TipoCreacion>();
  valido = input(false);
  esUltimoPaso = input(false);
  mostrarAnterior = input(false);

  anterior = output<void>();
  siguiente = output<void>();
  confirmar = output<void>();

  constructor() {
    addIcons({ chevronForwardOutline, chevronBackOutline, checkmarkOutline });
  }
}
