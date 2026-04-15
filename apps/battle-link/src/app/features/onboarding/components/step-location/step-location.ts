import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, NgZone, ViewChild, effect, inject, input, output } from '@angular/core';
import { IonButton, IonInput, IonItem, IonLabel, IonSpinner } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-onboarding-step-location',
  template: `
    <section>
      <h3>{{ 'ONBOARDING.LOCATION_TITLE' | translate }}</h3>
      <p class="onboarding__hint">
        {{ 'ONBOARDING.LOCATION_HINT' | translate }}
      </p>

      <ion-button
        expand="block"
        color="secondary"
        (click)="useLocation.emit()"
        [disabled]="locationLoading()"
      >
        @if (locationLoading()) {
          <ion-spinner slot="start"></ion-spinner>
        }
        {{ 'ONBOARDING.USE_LOCATION' | translate }}
      </ion-button>

      <div class="separator">
        <span>{{ 'ONBOARDING.LOCATION_OR' | translate }}</span>
      </div>

      <ion-item>
        <ion-label position="stacked">{{ 'ONBOARDING.ADDRESS_LABEL' | translate }}</ion-label>
        <ion-input
          #addressInput
          [placeholder]="'ONBOARDING.ADDRESS_PLACEHOLDER' | translate"
          autocomplete="off"
          clearInput>
        </ion-input>
      </ion-item>

      @if (location()) {
        <div #mapDiv class="location-map"></div>
        @if (locationLabel()) {
          <p class="location-formatted">{{ locationLabel() }}</p>
        }
      }
    </section>
  `,
  styles: [`
    .onboarding__hint {
      font-size: 13px;
      color: var(--ion-color-medium);
      margin-bottom: 8px;
    }

    .separator {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 12px 0;
      color: var(--ion-color-medium);
      font-size: 13px;

      &::before,
      &::after {
        content: '';
        flex: 1;
        height: 1px;
        background: var(--ion-color-light-shade);
      }
    }

    .location-map {
      width: 100%;
      height: 180px;
      border-radius: 12px;
      overflow: hidden;
      margin-top: 16px;
    }

    .location-formatted {
      margin-top: 10px;
      font-size: 13px;
      font-weight: 500;
      color: var(--ion-color-medium);
      letter-spacing: 0.02em;
    }
  `],
  imports: [IonButton, IonSpinner, IonItem, IonLabel, IonInput, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingStepLocationComponent implements AfterViewInit {
  private readonly zone = inject(NgZone);

  private map: google.maps.Map | null = null;
  private marker: google.maps.Marker | null = null;
  private geocoder: google.maps.Geocoder | null = null;

  location = input<[number, number] | null>(null);
  locationLoading = input(false);
  locationLabel = input<string>('');

  useLocation = output<void>();
  locationChange = output<[number, number]>();
  locationLabelChange = output<string>();

  @ViewChild('addressInput') private addressInputRef!: IonInput;

  constructor() {
    effect(() => {
      const coords = this.location();
      if (coords && this.map && this.marker) {
        const latLng = { lat: coords[0], lng: coords[1] };
        this.map.setCenter(latLng);
        this.marker.setPosition(latLng);
      }
      // Geocode when coords change after initialization
      if (coords && this.geocoder) {
        this.reverseGeocode({ lat: coords[0], lng: coords[1] });
      }
    });
  }

  ngAfterViewInit(): void {
    this.geocoder = new google.maps.Geocoder();

    // Geocode initial coords if location is already set and no label yet
    const coords = this.location();
    if (coords && !this.locationLabel()) {
      this.reverseGeocode({ lat: coords[0], lng: coords[1] });
    }

    this.addressInputRef.getInputElement().then((el) => {
      const autocomplete = new google.maps.places.Autocomplete(el, {
        types: ['geocode'],
        fields: ['geometry', 'address_components'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        const loc = place.geometry?.location;
        if (loc) {
          const formatted = this.formatAddress(place.address_components ?? []);
          this.zone.run(() => {
            this.locationChange.emit([loc.lat(), loc.lng()]);
            this.locationLabelChange.emit(formatted);
            el.value = formatted;
          });
        }
      });
    });
  }

  @ViewChild('mapDiv')
  set mapDiv(el: ElementRef<HTMLDivElement> | undefined) {
    if (el) {
      setTimeout(() => this.initMap(el.nativeElement));
    } else {
      this.map = null;
      this.marker = null;
    }
  }

  private initMap(el: HTMLDivElement): void {
    const coords = this.location();
    if (!coords) return;

    const center = { lat: coords[0], lng: coords[1] };

    this.map = new google.maps.Map(el, {
      center,
      zoom: 14,
      disableDefaultUI: true,
      gestureHandling: 'none',
      keyboardShortcuts: false,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.marker = new (google.maps as any).Marker({
      position: center,
      map: this.map,
    });
  }

  private reverseGeocode(latLng: google.maps.LatLngLiteral): void {
    this.geocoder!.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK' && results && results.length > 0) {
        const result =
          results.find((r) =>
            r.address_components.some((c) => c.types.includes('postal_code')),
          ) ?? results[0];
        const formatted = this.formatAddress(result.address_components);
        this.zone.run(() => {
          this.locationLabelChange.emit(formatted);
        });
      }
    });
  }

  private formatAddress(components: google.maps.GeocoderAddressComponent[]): string {
    const get = (type: string) =>
      components.find((c) => c.types.includes(type))?.long_name ?? '';

    const postalCode = get('postal_code');
    const locality =
      get('locality') || get('sublocality') || get('administrative_area_level_3');
    const province =
      get('administrative_area_level_2') || get('administrative_area_level_1');

    if (postalCode && locality) {
      return province
        ? `${postalCode}, ${locality}, ${province}`
        : `${postalCode}, ${locality}`;
    }
    return locality && province ? `${locality}, ${province}` : locality || '';
  }
}
