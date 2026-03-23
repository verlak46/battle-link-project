import { Component, input, output } from '@angular/core';
import { IonItem, IonLabel, IonInput } from '@ionic/angular/standalone';

@Component({
  selector: 'app-step-date',
  template: `
    <ion-item>
      <ion-label position="stacked">Fecha *</ion-label>
      <ion-input
        type="date"
        [value]="date()"
        (ionInput)="dateChange.emit($any($event).detail.value)">
      </ion-input>
    </ion-item>
    <ion-item>
      <ion-label position="stacked">Hora (opcional)</ion-label>
      <ion-input
        type="time"
        [value]="time()"
        (ionInput)="timeChange.emit($any($event).detail.value)">
      </ion-input>
    </ion-item>
  `,
  imports: [IonItem, IonLabel, IonInput],
})
export class StepDateComponent {
  date = input('');
  time = input('');

  dateChange = output<string>();
  timeChange = output<string>();
}
