import { AfterViewInit, Component, NgZone, ViewChild, inject, input, output } from '@angular/core';
import { IonInput, IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { Place } from '@battle-link/shared-models';

@Component({
  selector: 'app-paso-ubicacion',
  template: `
    <ion-item>
      <ion-label position="stacked">Tienda / Club (opcional)</ion-label>
      <ion-select
        [value]="placeId()"
        (ionChange)="onPlaceChange($any($event).detail.value)"
        placeholder="Sin tienda registrada"
        interface="action-sheet">
        <ion-select-option [value]="null">Sin tienda registrada</ion-select-option>
        @for (v of places(); track v._id) {
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
        #direccionInput
        [value]="direccion()"
        (ionInput)="direccionChange.emit($any($event).detail.value)"
        placeholder="Ej. Calle Mayor 12, Club Dragón"
        autocomplete="off">
      </ion-input>
    </ion-item>
  `,
  styles: [`
    ion-item { margin-bottom: 4px; }
  `],
  imports: [IonItem, IonLabel, IonInput, IonSelect, IonSelectOption],
})
export class PasoUbicacionComponent implements AfterViewInit {
  @ViewChild('direccionInput') private direccionInputRef!: IonInput;

  private readonly zone = inject(NgZone);

  ciudad = input('');
  direccion = input('');
  placeId = input<string | null>(null);
  places = input<Place[]>([]);

  ciudadChange = output<string>();
  direccionChange = output<string>();
  placeIdChange = output<string | null>();

  ngAfterViewInit() {
    this.direccionInputRef.getInputElement().then((el) => {
      const autocomplete = new google.maps.places.Autocomplete(el, {
        types: ['address'],
        fields: ['formatted_address', 'address_components'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        this.zone.run(() => {
          if (place.formatted_address) {
            this.direccionChange.emit(place.formatted_address);
          }
          const cityComp = place.address_components?.find((c) =>
            c.types.includes('locality') || c.types.includes('administrative_area_level_2'),
          );
          if (cityComp) {
            this.ciudadChange.emit(cityComp.long_name);
          }
        });
      });
    });
  }

  onPlaceChange(id: string | null) {
    this.placeIdChange.emit(id);
    if (id) {
      const place = this.places().find((v) => v._id === id);
      if (place) {
        this.ciudadChange.emit(place.city);
        this.direccionChange.emit(place.address);
      }
    }
  }
}
