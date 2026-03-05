import { Component, inject, input, output } from '@angular/core';
import { IonItem, IonLabel, IonInput, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { toSignal } from '@angular/core/rxjs-interop';
import { TipoCreacion } from '../../nuevo-form.types';
import { FirestoreService } from '../../../../core/services/firestore.service';
import { Wargame } from '../../../../shared/models/IWargame';

@Component({
  selector: 'app-paso-juego',
  template: `
    <ion-item>
      <ion-label position="stacked">
        {{ tipo() === 'partida' ? 'Juego / Sistema' : 'Nombre del juego' }} *
      </ion-label>
      <ion-select
        [value]="juego()"
        (ionChange)="juegoChange.emit($any($event).detail.value)"
        interface="popover"
        placeholder="Selecciona un wargame">
        @for (game of wargames(); track game.id) {
          <ion-select-option [value]="game.id">
            {{ game.name }}
          </ion-select-option>
        }
      </ion-select>
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
  imports: [IonItem, IonLabel, IonInput, IonSelect, IonSelectOption],
})
export class PasoJuegoComponent {
  private readonly firestore = inject(FirestoreService);

  tipo = input.required<TipoCreacion>();
  juego = input('');
  sistema = input('');

  juegoChange = output<string>();
  sistemaChange = output<string>();

  wargames = toSignal(this.firestore.getActiveWargames(), {
    initialValue: [] as Wargame[],
  });
}
