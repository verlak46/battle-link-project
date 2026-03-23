import { Component, input, output } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkOutline } from 'ionicons/icons';
import { WizardStep } from '../../new-form.types';

@Component({
  selector: 'app-step-header',
  template: `
    @if (step().id > 1) {
      <div class="step__connector"></div>
    }
    <div
      class="step__header"
      [class.step__header--clickable]="done()"
      (click)="done() && clicked.emit(step().id)"
    >
      <div class="step__bubble">
        @if (done()) {
          <ion-icon name="checkmark-outline"></ion-icon>
        } @else {
          <span>{{ step().id }}</span>
        }
      </div>
      <div class="step__meta">
        <p class="step__num">Paso {{ step().id }} de {{ total() }}</p>
        <h3 class="step__title">
          <ion-icon [name]="step().icon"></ion-icon>
          {{ step().title }}
        </h3>
      </div>
    </div>
  `,
  styleUrl: './step-header.scss',
  imports: [IonIcon],
  host: {
    '[class.step--active]': 'active()',
    '[class.step--done]': 'done()',
    'class': 'step',
  },
})
export class StepHeaderComponent {
  step = input.required<WizardStep>();
  total = input.required<number>();
  active = input(false);
  done = input(false);
  clicked = output<number>();

  constructor() {
    addIcons({ checkmarkOutline });
  }
}
