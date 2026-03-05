import { Component, input, output } from '@angular/core';
import { IonItem, IonLabel, IonInput } from '@ionic/angular/standalone';
import { TipoCreacion } from '../../nuevo-form.types';

@Component({
  selector: 'app-paso-juego',
  template: `
    <ion-item>
      <ion-label position="stacked">
        {{ tipo() === 'partida' ? 'Juego / Sistema' : 'Nombre del juego' }} *
      </ion-label>
      <ion-input
        [value]="juego()"
        (ionInput)="juegoChange.emit($any($event).detail.value)"
        placeholder="Ej. Warhammer 40K, D&D 5e..."
        clearInput>
      </ion-input>
    </ion-item>
    <ion-item>
      <ion-label position="stacked">Edición / Sistema (opcional)</ion-label>
      <ion-input
        [value]="sistema()"
        (ionInput)="sistemaChange.emit($any($event).detail.value)"
        placeholder="Ej. 10ª edición, Pathfinder 2e...">
      </ion-input>
    </ion-item>
  `,
  imports: [IonItem, IonLabel, IonInput],
})
export class PasoJuegoComponent {
  tipo = input.required<TipoCreacion>();
  juego = input('');
  sistema = input('');

  juegoChange = output<string>();
  sistemaChange = output<string>();
}
