import { Component, computed, input, output } from '@angular/core';
import { IonItem, IonLabel, IonInput } from '@ionic/angular/standalone';

@Component({
  selector: 'app-step-date',
  template: `
    <ion-item>
      <ion-label position="stacked">Fecha inicio *</ion-label>
      <ion-input
        type="date"
        [value]="startDate()"
        [min]="today"
        (ionInput)="startDateChange.emit($any($event).detail.value)">
      </ion-input>
    </ion-item>
    <ion-item>
      <ion-label position="stacked">Fecha fin (opcional)</ion-label>
      <ion-input
        type="date"
        [value]="endDate()"
        [min]="endDateMin()"
        (ionInput)="endDateChange.emit($any($event).detail.value)">
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
  readonly today = new Date().toISOString().split('T')[0];

  startDate = input('');
  endDate = input('');
  time = input('');

  endDateMin = computed(() => this.startDate() || this.today);

  startDateChange = output<string>();
  endDateChange = output<string>();
  timeChange = output<string>();
}
