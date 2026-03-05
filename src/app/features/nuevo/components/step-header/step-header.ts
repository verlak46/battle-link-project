import { Component, input, output } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkOutline } from 'ionicons/icons';
import { PasoWizard } from '../../nuevo-form.types';

@Component({
  selector: 'app-step-header',
  template: `
    @if (paso().id > 1) {
      <div class="step__connector"></div>
    }
    <div
      class="step__header"
      [class.step__header--clickable]="done()"
      (click)="done() && clicked.emit(paso().id)"
    >
      <div class="step__bubble">
        @if (done()) {
          <ion-icon name="checkmark-outline"></ion-icon>
        } @else {
          <span>{{ paso().id }}</span>
        }
      </div>
      <div class="step__meta">
        <p class="step__num">Paso {{ paso().id }} de {{ total() }}</p>
        <h3 class="step__title">
          <ion-icon [name]="paso().icono"></ion-icon>
          {{ paso().titulo }}
        </h3>
      </div>
    </div>
  `,
  styleUrl: './step-header.css',
  imports: [IonIcon],
  host: {
    '[class.step--active]': 'active()',
    '[class.step--done]': 'done()',
    'class': 'step',
  },
})
export class StepHeaderComponent {
  paso = input.required<PasoWizard>();
  total = input.required<number>();
  active = input(false);
  done = input(false);
  clicked = output<number>();

  constructor() {
    addIcons({ checkmarkOutline });
  }
}
