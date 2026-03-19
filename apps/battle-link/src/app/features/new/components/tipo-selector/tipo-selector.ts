import { Component, input, output } from '@angular/core';
import {
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/angular/standalone';
import { TipoCreacion } from '../../nuevo-form.types';

@Component({
  selector: 'app-tipo-selector',
  template: `
    <ion-segment [value]="tipo()" (ionChange)="tipoChange.emit($any($event).detail.value)" class="tipo-segment">
      <ion-segment-button value="partida">
        <ion-label>🎲 Partida</ion-label>
      </ion-segment-button>
      <ion-segment-button value="evento">
        <ion-label>📅 Evento</ion-label>
      </ion-segment-button>
    </ion-segment>
  `,
  styles: [`
    .tipo-segment { margin-bottom: 24px; }
  `],
  imports: [IonSegment, IonSegmentButton, IonLabel],
})
export class TipoSelectorComponent {
  tipo = input.required<TipoCreacion>();
  tipoChange = output<TipoCreacion>();
}
