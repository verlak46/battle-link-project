import { Component, input, output } from '@angular/core';
import { IonItem, IonLabel, IonInput, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { locationOutline } from 'ionicons/icons';

@Component({
  selector: 'app-paso-ubicacion',
  template: `
    <ion-item>
      <ion-label position="stacked">Ciudad *</ion-label>
      <ion-input
        [value]="ciudad()"
        (ionInput)="ciudadChange.emit($any($event).detail.value)"
        placeholder="Ej. Madrid, Barcelona..."
        clearInput>
      </ion-input>
    </ion-item>
    <ion-item>
      <ion-label position="stacked">Dirección / Local (opcional)</ion-label>
      <ion-input
        [value]="direccion()"
        (ionInput)="direccionChange.emit($any($event).detail.value)"
        placeholder="Ej. Calle Mayor 12, Club Dragón">
      </ion-input>
    </ion-item>
    <div class="map-placeholder">
      <ion-icon name="location-outline"></ion-icon>
      <p>Map picker — próximamente</p>
    </div>
  `,
  styles: [`
    .map-placeholder {
      margin-top: 12px;
      height: 160px;
      border-radius: 12px;
      border: 2px dashed var(--ion-color-medium);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: var(--ion-color-medium);
      background: color-mix(in srgb, var(--ion-color-medium) 5%, transparent);
    }
    .map-placeholder ion-icon { font-size: 2.5rem; }
    .map-placeholder p { margin: 0; font-size: 0.85rem; }
  `],
  imports: [IonItem, IonLabel, IonInput, IonIcon],
})
export class PasoUbicacionComponent {
  ciudad = input('');
  direccion = input('');

  ciudadChange = output<string>();
  direccionChange = output<string>();

  constructor() {
    addIcons({ locationOutline });
  }
}
