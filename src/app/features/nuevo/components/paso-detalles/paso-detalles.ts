import { Component, input, output } from '@angular/core';
import { IonItem, IonLabel, IonInput, IonTextarea } from '@ionic/angular/standalone';
import { TipoCreacion } from '../../nuevo-form.types';

@Component({
  selector: 'app-paso-detalles',
  template: `
    <ion-item>
      <ion-label position="stacked">
        {{ tipo() === 'partida' ? 'Título de la partida *' : 'Título del evento *' }}
      </ion-label>
      <ion-input
        [value]="titulo()"
        (ionInput)="tituloChange.emit($any($event).detail.value)"
        placeholder="Dale un nombre atractivo"
        clearInput>
      </ion-input>
    </ion-item>
    <ion-item>
      <ion-label position="stacked">Descripción (opcional)</ion-label>
      <ion-textarea
        [value]="descripcion()"
        (ionInput)="descripcionChange.emit($any($event).detail.value)"
        placeholder="Cuéntanos más sobre la partida o evento..."
        rows="4"
        autoGrow>
      </ion-textarea>
    </ion-item>
    <ion-item>
      <ion-label position="stacked">Máx. jugadores (opcional)</ion-label>
      <ion-input
        type="number"
        [value]="maxJugadores()"
        (ionInput)="maxJugadoresChange.emit($any($event).detail.value)"
        placeholder="Ej. 6"
        min="1">
      </ion-input>
    </ion-item>
  `,
  imports: [IonItem, IonLabel, IonInput, IonTextarea],
})
export class PasoDetallesComponent {
  tipo = input.required<TipoCreacion>();
  titulo = input('');
  descripcion = input('');
  maxJugadores = input('');

  tituloChange = output<string>();
  descripcionChange = output<string>();
  maxJugadoresChange = output<string>();
}
