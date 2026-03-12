import { Component, input, output } from '@angular/core';
import { IonItem, IonLabel, IonInput, IonIcon, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { locationOutline } from 'ionicons/icons';
import { Venue } from '../../../../shared/models/IVenue';

@Component({
  selector: 'app-paso-ubicacion',
  template: `
    <ion-item>
      <ion-label position="stacked">Tienda / Club (opcional)</ion-label>
      <ion-select
        [value]="venueId()"
        (ionChange)="onVenueChange($any($event).detail.value)"
        placeholder="Sin tienda registrada"
        interface="action-sheet">
        <ion-select-option [value]="null">Sin tienda registrada</ion-select-option>
        @for (v of venues(); track v._id) {
          <ion-select-option [value]="v._id">{{ v.name }} — {{ v.city }}</ion-select-option>
        }
      </ion-select>
    </ion-item>

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
  `,
  styles: [`
    ion-item { margin-bottom: 4px; }
  `],
  imports: [IonItem, IonLabel, IonInput, IonIcon, IonSelect, IonSelectOption],
})
export class PasoUbicacionComponent {
  ciudad = input('');
  direccion = input('');
  venueId = input<string | null>(null);
  venues = input<Venue[]>([]);

  ciudadChange = output<string>();
  direccionChange = output<string>();
  venueIdChange = output<string | null>();

  constructor() {
    addIcons({ locationOutline });
  }

  onVenueChange(id: string | null) {
    this.venueIdChange.emit(id);
    if (id) {
      const venue = this.venues().find((v) => v._id === id);
      if (venue) {
        this.ciudadChange.emit(venue.city);
        this.direccionChange.emit(venue.address);
      }
    }
  }
}
