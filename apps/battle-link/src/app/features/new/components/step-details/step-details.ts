import { Component, input, output } from '@angular/core';
import { IonItem, IonLabel, IonInput, IonTextarea } from '@ionic/angular/standalone';
import { TipoCreacion } from '../../new-form.types';
import { ImageUploadComponent } from '../../../../shared/components/image-upload/image-upload';

@Component({
  selector: 'app-step-details',
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
    <app-image-upload
      entityType="events"
      [imageUrl]="imageUrl()"
      (imageUrlChange)="imageUrlChange.emit($event)">
    </app-image-upload>
  `,
  imports: [IonItem, IonLabel, IonInput, IonTextarea, ImageUploadComponent],
})
export class StepDetailsComponent {
  tipo = input.required<TipoCreacion>();
  titulo = input('');
  descripcion = input('');
  maxJugadores = input('');
  imageUrl = input<string | undefined>(undefined);

  tituloChange = output<string>();
  descripcionChange = output<string>();
  maxJugadoresChange = output<string>();
  imageUrlChange = output<string>();
}
