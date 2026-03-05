import { Component, input, output } from '@angular/core';
import { IonItem, IonLabel, IonInput } from '@ionic/angular/standalone';

@Component({
  selector: 'app-paso-fecha',
  template: `
    <ion-item>
      <ion-label position="stacked">Fecha *</ion-label>
      <ion-input
        type="date"
        [value]="fecha()"
        (ionInput)="fechaChange.emit($any($event).detail.value)">
      </ion-input>
    </ion-item>
    <ion-item>
      <ion-label position="stacked">Hora (opcional)</ion-label>
      <ion-input
        type="time"
        [value]="hora()"
        (ionInput)="horaChange.emit($any($event).detail.value)">
      </ion-input>
    </ion-item>
  `,
  imports: [IonItem, IonLabel, IonInput],
})
export class PasoFechaComponent {
  fecha = input('');
  hora = input('');

  fechaChange = output<string>();
  horaChange = output<string>();
}
