import { ChangeDetectionStrategy, Component, NgZone, ViewChild, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton, IonIcon, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, ModalController } from '@ionic/angular/standalone';
import { DecimalPipe } from '@angular/common';
import { addIcons } from 'ionicons';
import { addCircleOutline } from 'ionicons/icons';
import { TranslatePipe } from '@ngx-translate/core';
import { Place, GeoLocation } from '@battle-link/shared-models';
import { CreationType } from '../../new-form.types';
import { LocationPickerModalComponent } from '../location-picker-modal/location-picker-modal';

@Component({
  selector: 'app-step-location',
  template: `
    <!-- Place selector — always shown -->
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

    @if (type() === 'game' && !placeId()) {
      <!-- Game mode: choose location method -->
      <div class="location-section">
        <p class="location-question">{{ 'NEW.LOCATION_QUESTION' | translate }}</p>

        <div class="location-modes">
          @if (userLocation()) {
            <ion-button
              expand="block"
              [fill]="locationMode() === 'profile' ? 'solid' : 'outline'"
              color="secondary"
              (click)="setProfileMode()">
              🏠 {{ 'NEW.LOCATION_PROFILE' | translate }}
            </ion-button>
            @if (locationMode() === 'profile' && userLocationLabel()) {
              <p class="location-label">{{ userLocationLabel() }}</p>
            }
          }

          <ion-button
            expand="block"
            [fill]="locationMode() === 'map' ? 'solid' : 'outline'"
            color="secondary"
            (click)="openMapPicker()">
            📍 {{ 'NEW.LOCATION_MAP' | translate }}
          </ion-button>
          @if (locationMode() === 'map' && locationCoords()) {
            <p class="location-pin-info">
              {{ 'NEW.LOCATION_PIN_SET' | translate }}:
              {{ locationCoords()![0] | number:'1.4-4' }},
              {{ locationCoords()![1] | number:'1.4-4' }}
            </p>
          }

          <!-- <ion-button
            expand="block"
            [fill]="locationMode() === 'approximate' ? 'solid' : 'outline'"
            color="secondary"
            (click)="openApproximatePicker()">
            🔒 {{ 'NEW.LOCATION_APPROXIMATE' | translate }}
          </ion-button> -->
          @if (locationMode() === 'approximate') {
            <div class="radius-chips">
              <ion-button
                size="small"
                [fill]="locationRadius() === 500 ? 'solid' : 'outline'"
                (click)="locationRadiusChange.emit(500)">
                {{ 'NEW.LOCATION_RADIUS_500' | translate }}
              </ion-button>
              <ion-button
                size="small"
                [fill]="locationRadius() === 1000 ? 'solid' : 'outline'"
                (click)="locationRadiusChange.emit(1000)">
                {{ 'NEW.LOCATION_RADIUS_1000' | translate }}
              </ion-button>
              <ion-button
                size="small"
                [fill]="locationRadius() === 5000 ? 'solid' : 'outline'"
                (click)="locationRadiusChange.emit(5000)">
                {{ 'NEW.LOCATION_RADIUS_5000' | translate }}
              </ion-button>
            </div>
          }
        </div>
      </div>

    } @else {
      <!-- Event mode OR game with place selected: show address fields -->
      @if (type() !== 'game' && !placeId()) {
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
        <ion-label position="stacked">{{ 'NEW.CITY_READONLY' | translate }}</ion-label>
        <ion-input [value]="city()" readonly></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">
          {{ 'NEW.ADDRESS' | translate }}
          @if (type() !== 'game') { <span class="required-mark">*</span> }
        </ion-label>
        <ion-input
          #addressInput
          [value]="address()"
          (ionInput)="addressChange.emit($any($event).detail.value)"
          [placeholder]="'NEW.ADDRESS_PLACEHOLDER' | translate"
          autocomplete="off">
        </ion-input>
      </ion-item>
    }
  `,
  styles: [`
    ion-item { margin-bottom: 4px; }
    .register-place {
      display: flex;
      justify-content: flex-end;
      margin-top: -4px;
      margin-bottom: 8px;
    }
    .location-section {
      margin-top: 16px;
    }
    .location-question {
      font-size: 15px;
      font-weight: 500;
      margin-bottom: 12px;
      color: var(--ion-text-color);
    }
    .location-modes {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .location-label {
      font-size: 13px;
      color: var(--ion-color-medium);
      margin: 4px 16px 0;
    }
    .location-pin-info {
      font-size: 12px;
      color: var(--ion-color-medium);
      margin: 4px 16px 0;
    }
    .radius-chips {
      display: flex;
      gap: 8px;
      padding: 4px 0;
    }
    .required-mark {
      color: var(--ion-color-danger);
      margin-left: 2px;
    }
  `],
  imports: [
    IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
    IonButton, IonIcon,
    RouterLink, DecimalPipe, TranslatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepLocationComponent {
  private readonly modalCtrl = inject(ModalController);
  private readonly zone = inject(NgZone);

  private readonly initializedInputs = new WeakSet<HTMLElement>();
  private addressInputEl: IonInput | undefined;

  constructor() {
    addIcons({ addCircleOutline });
  }

  type = input<CreationType | null>(null);
  city = input('');
  address = input('');
  placeId = input<string | null>(null);
  placeName = input<string>('');
  places = input<Place[]>([]);
  userLocation = input<GeoLocation | null>(null);
  userLocationLabel = input<string | null>(null);
  locationMode = input<'place' | 'profile' | 'map' | 'approximate' | undefined>(undefined);
  locationRadius = input<number | undefined>(undefined);
  locationCoords = input<[number, number] | undefined>(undefined);

  cityChange = output<string>();
  addressChange = output<string>();
  placeIdChange = output<string | null>();
  placeNameChange = output<string>();
  locationModeChange = output<'profile' | 'map' | 'approximate'>();
  locationRadiusChange = output<number>();
  locationCoordsChange = output<[number, number]>();

  @ViewChild('addressInput')
  set addressInput(el: IonInput | undefined) {
    if (el && el !== this.addressInputEl) {
      this.addressInputEl = el;
      el.getInputElement().then((htmlEl) => {
        if (this.initializedInputs.has(htmlEl)) return;
        this.initializedInputs.add(htmlEl);
        this.setupAutocomplete(htmlEl);
      });
    }
    if (!el) {
      this.addressInputEl = undefined;
    }
  }

  private setupAutocomplete(el: HTMLInputElement): void {
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
  }

  setProfileMode(): void {
    this.locationModeChange.emit('profile');
  }

  async openMapPicker(): Promise<void> {
    const profileCoords = this.userLocation()?.coordinates;
    const existingCoords = this.locationCoords();
    const coords: [number, number] | undefined = existingCoords
      ?? (profileCoords ? [profileCoords[1], profileCoords[0]] : undefined);

    const modal = await this.modalCtrl.create({
      component: LocationPickerModalComponent,
      componentProps: { coords, showRadius: false },
    });
    await modal.present();

    const { data } = await modal.onDidDismiss<{ coords: [number, number]; radius?: number } | null>();
    if (data?.coords) {
      this.locationModeChange.emit('map');
      this.locationCoordsChange.emit(data.coords);
    }
  }

  async openApproximatePicker(): Promise<void> {
    const profileCoords = this.userLocation()?.coordinates;
    const existingCoords = this.locationCoords();
    const coords: [number, number] | undefined = existingCoords
      ?? (profileCoords ? [profileCoords[1], profileCoords[0]] : undefined);

    const modal = await this.modalCtrl.create({
      component: LocationPickerModalComponent,
      componentProps: { coords, showRadius: true },
    });
    await modal.present();

    const { data } = await modal.onDidDismiss<{ coords: [number, number]; radius?: number } | null>();
    if (data?.coords) {
      this.locationModeChange.emit('approximate');
      this.locationCoordsChange.emit(data.coords);
      if (data.radius !== undefined) {
        this.locationRadiusChange.emit(data.radius);
      }
    }
  }

  onPlaceChange(id: string | null): void {
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
