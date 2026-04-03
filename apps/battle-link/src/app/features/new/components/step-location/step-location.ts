import { AfterViewInit, Component, NgZone, ViewChild, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton, IonIcon, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircleOutline } from 'ionicons/icons';
import { TranslatePipe } from '@ngx-translate/core';
import { Place } from '@battle-link/shared-models';

@Component({
  selector: 'app-step-location',
  template: `
    <ion-item>
      <ion-label position="stacked">{{ 'NEW.PLACE' | translate }}</ion-label>
      <ion-select
        [value]="placeId()"
        (ionChange)="onPlaceChange($any($event).detail.value)"
        [placeholder]="'NEW.NO_PLACE' | translate"
        interface="action-sheet">
        <ion-select-option [value]="null">{{ 'NEW.NO_PLACE' | translate }}</ion-select-option>
        @for (v of places(); track v._id) {
          <ion-select-option [value]="v._id">{{ v.name }} — {{ v.city }}</ion-select-option>
        }
      </ion-select>
    </ion-item>

    @if (!placeId()) {
      <div class="register-place">
        <ion-button fill="clear" size="small" routerLink="/places/new">
          <ion-icon slot="start" name="add-circle-outline"></ion-icon>
          {{ 'NEW.REGISTER_PLACE' | translate }}
        </ion-button>
      </div>
    }

    @if (!placeId()) {
      <ion-item>
        <ion-label position="stacked">{{ 'NEW.PLACE_NAME' | translate }}</ion-label>
        <ion-input
          [value]="placeName()"
          (ionInput)="placeNameChange.emit($any($event).detail.value)"
          [placeholder]="'NEW.PLACE_NAME_PLACEHOLDER' | translate"
          clearInput>
        </ion-input>
      </ion-item>
    }

    <ion-item>
      <ion-label position="stacked">{{ 'NEW.CITY' | translate }}</ion-label>
      <ion-input
        [value]="city()"
        (ionInput)="cityChange.emit($any($event).detail.value)"
        [placeholder]="'NEW.CITY_PLACEHOLDER' | translate"
        clearInput>
      </ion-input>
    </ion-item>

    <ion-item>
      <ion-label position="stacked">{{ 'NEW.ADDRESS' | translate }}</ion-label>
      <ion-input
        #addressInput
        [value]="address()"
        (ionInput)="addressChange.emit($any($event).detail.value)"
        [placeholder]="'NEW.ADDRESS_PLACEHOLDER' | translate"
        autocomplete="off">
      </ion-input>
    </ion-item>
  `,
  styles: [`
    ion-item { margin-bottom: 4px; }
    .register-place {
      display: flex;
      justify-content: flex-end;
      margin-top: -4px;
      margin-bottom: 8px;
    }
  `],
  imports: [IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonButton, IonIcon, RouterLink, TranslatePipe],
})
export class StepLocationComponent implements AfterViewInit {
  @ViewChild('addressInput') private addressInputRef!: IonInput;

  private readonly zone = inject(NgZone);

  constructor() {
    addIcons({ addCircleOutline });
  }

  city = input('');
  address = input('');
  placeId = input<string | null>(null);
  placeName = input<string>('');
  places = input<Place[]>([]);

  cityChange = output<string>();
  addressChange = output<string>();
  placeIdChange = output<string | null>();
  placeNameChange = output<string>();

  ngAfterViewInit() {
    this.addressInputRef.getInputElement().then((el) => {
      const autocomplete = new google.maps.places.Autocomplete(el, {
        types: ['address'],
        fields: ['formatted_address', 'address_components'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        this.zone.run(() => {
          if (place.formatted_address) {
            this.addressChange.emit(place.formatted_address);
          }
          const cityComp = place.address_components?.find((c) =>
            c.types.includes('locality') || c.types.includes('administrative_area_level_2'),
          );
          if (cityComp) {
            this.cityChange.emit(cityComp.long_name);
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
        this.cityChange.emit(place.city);
        this.addressChange.emit(place.address);
        this.placeNameChange.emit(place.name);
      }
    } else {
      this.placeNameChange.emit('');
    }
  }
}
