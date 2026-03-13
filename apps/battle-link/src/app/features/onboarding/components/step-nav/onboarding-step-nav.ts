import { Component, input, output } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-onboarding-step-nav',
  template: `
    <div class="step__actions">
      @if (mostrarAnterior()) {
        <ion-button fill="outline" (click)="anterior.emit()">
          Anterior
        </ion-button>
      }
      @if (!esUltimoPaso()) {
        <ion-button
          color="primary"
          (click)="siguiente.emit()"
          [disabled]="!valido()"
        >
          Siguiente
        </ion-button>
      } @else {
        <ion-button
          color="success"
          (click)="finalizar.emit()"
          [disabled]="!valido() || loading()"
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
  valido = input(false);
  esUltimoPaso = input(false);
  mostrarAnterior = input(false);
  loading = input(false);

  anterior = output<void>();
  siguiente = output<void>();
  finalizar = output<void>();
}

