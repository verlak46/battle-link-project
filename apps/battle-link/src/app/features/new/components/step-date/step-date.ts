import { Component, computed, input, output } from '@angular/core';
import { IonItem, IonLabel, IonInput } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-step-date',
  template: `
    <ion-item>
      <ion-label position="stacked">{{ 'NEW.START_DATE' | translate }}</ion-label>
      <ion-input
        type="date"
        [value]="startDate()"
        [min]="today"
        (ionInput)="startDateChange.emit($any($event).detail.value)">
      </ion-input>
    </ion-item>
    <ion-item>
      <ion-label position="stacked">{{ 'NEW.END_DATE' | translate }}</ion-label>
      <ion-input
        type="date"
        [value]="endDate()"
        [min]="endDateMin()"
        (ionInput)="endDateChange.emit($any($event).detail.value)">
      </ion-input>
    </ion-item>
    <ion-item>
      <ion-label position="stacked">{{ 'NEW.TIME' | translate }}</ion-label>
      <ion-input
        type="time"
        [value]="time()"
        (ionInput)="timeChange.emit($any($event).detail.value)">
      </ion-input>
    </ion-item>
  `,
  imports: [IonItem, IonLabel, IonInput, TranslatePipe],
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
