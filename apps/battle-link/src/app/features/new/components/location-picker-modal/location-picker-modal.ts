import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-location-picker-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ 'NEW.LOCATION_MAP' | translate }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss(false)">{{ 'COMMON.CANCEL' | translate }}</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-item class="address-item">
        <ion-label position="stacked">{{ 'NEW.ADDRESS' | translate }}</ion-label>
        <ion-input
          #addressInput
          [placeholder]="'NEW.ADDRESS_PLACEHOLDER' | translate"
          autocomplete="off"
          clearInput>
        </ion-input>
      </ion-item>

      <div #mapDiv class="map-container"></div>

      @if (formattedAddress()) {
        <p class="pin-info">{{ formattedAddress() }}</p>
      }

      <div class="radius-selector">
        <ion-button
          [fill]="selectedRadius() === 500 ? 'solid' : 'outline'"
          size="small"
          (click)="setRadius(500)">
          {{ 'NEW.LOCATION_RADIUS_500' | translate }}
        </ion-button>
        <ion-button
          [fill]="selectedRadius() === 1000 ? 'solid' : 'outline'"
          size="small"
          (click)="setRadius(1000)">
          {{ 'NEW.LOCATION_RADIUS_1000' | translate }}
        </ion-button>
        <ion-button
          [fill]="selectedRadius() === 5000 ? 'solid' : 'outline'"
          size="small"
          (click)="setRadius(5000)">
          {{ 'NEW.LOCATION_RADIUS_5000' | translate }}
        </ion-button>
      </div>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <ion-button
          expand="block"
          color="primary"
          class="confirm-btn"
          (click)="dismiss(true)"
          [disabled]="!selectedCoords()">
          {{ 'NEW.LOCATION_CONFIRM' | translate }}
        </ion-button>
      </ion-toolbar>
    </ion-footer>
  `,
  styles: [`
    .address-item {
      margin: 8px 0 0;
    }
    .map-container {
      width: 100%;
      height: 300px;
      margin-top: 8px;
    }
    .pin-info {
      font-size: 13px;
      font-weight: 500;
      color: var(--ion-color-medium);
      text-align: center;
      margin: 10px 16px 0;
      letter-spacing: 0.02em;
    }
    .radius-selector {
      display: flex;
      gap: 8px;
      justify-content: center;
      padding: 12px 16px;
    }
    .confirm-btn {
      margin: 8px 16px;
    }
  `],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonContent, IonFooter, IonItem, IonLabel, IonInput,
    TranslatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationPickerModalComponent implements AfterViewInit {
  private readonly modalCtrl = inject(ModalController);
  private readonly zone = inject(NgZone);
  private readonly cdr = inject(ChangeDetectorRef);

  /** Set by ModalController via componentProps */
  coords: [number, number] | undefined;

  selectedCoords = signal<[number, number] | null>(null);
  selectedRadius = signal<number>(1000);
  formattedAddress = signal<string>('');

  private map!: google.maps.Map;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private marker!: any;
  private circle: google.maps.Circle | null = null;
  private geocoder!: google.maps.Geocoder;

  @ViewChild('mapDiv') private mapDivRef!: ElementRef<HTMLDivElement>;
  @ViewChild('addressInput') private addressInputRef!: IonInput;

  ngAfterViewInit(): void {
    this.geocoder = new google.maps.Geocoder();
    this.initMap();
    this.initAutocomplete();
  }

  private initMap(): void {
    const defaultCenter = { lat: 40.4168, lng: -3.7038 };
    const center = this.coords
      ? { lat: this.coords[0], lng: this.coords[1] }
      : defaultCenter;

    if (this.coords) {
      this.selectedCoords.set(this.coords);
    }

    this.map = new google.maps.Map(this.mapDivRef.nativeElement, {
      center,
      zoom: 13,
      disableDefaultUI: true,
      zoomControl: true,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.marker = new (google.maps as any).Marker({
      position: center,
      map: this.map,
      draggable: true,
    });

    if (this.coords) {
      this.drawCircle(center, this.selectedRadius());
      this.reverseGeocode(center);
    }

    this.marker.addListener('dragend', () => {
      const pos = this.marker.getPosition() as google.maps.LatLng;
      const latLng = { lat: pos.lat(), lng: pos.lng() };
      this.zone.run(() => {
        this.selectedCoords.set([pos.lat(), pos.lng()]);
        this.drawCircle(latLng, this.selectedRadius());
        this.reverseGeocode(latLng);
        this.cdr.markForCheck();
      });
    });

    this.map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const latLng = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        this.marker.setPosition(e.latLng);
        this.zone.run(() => {
          this.selectedCoords.set([e.latLng!.lat(), e.latLng!.lng()]);
          this.drawCircle(latLng, this.selectedRadius());
          this.reverseGeocode(latLng);
          this.cdr.markForCheck();
        });
      }
    });
  }

  private initAutocomplete(): void {
    this.addressInputRef.getInputElement().then((el) => {
      const autocomplete = new google.maps.places.Autocomplete(el, {
        types: ['geocode'],
        fields: ['geometry', 'address_components'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        const loc = place.geometry?.location;
        if (loc) {
          const latLng = { lat: loc.lat(), lng: loc.lng() };
          this.marker.setPosition(latLng);
          this.map.panTo(latLng);
          const formatted = this.formatAddress(place.address_components ?? []);
          this.zone.run(() => {
            this.selectedCoords.set([loc.lat(), loc.lng()]);
            this.formattedAddress.set(formatted);
            this.drawCircle(latLng, this.selectedRadius());
            el.value = formatted;
            this.cdr.markForCheck();
          });
        }
      });
    });
  }

  private reverseGeocode(latLng: google.maps.LatLngLiteral): void {
    this.geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK' && results && results.length > 0) {
        const result =
          results.find((r) =>
            r.address_components.some((c) => c.types.includes('postal_code')),
          ) ?? results[0];
        const formatted = this.formatAddress(result.address_components);
        this.zone.run(() => {
          this.formattedAddress.set(formatted);
          this.addressInputRef.getInputElement().then((el) => {
            el.value = formatted;
          });
          this.cdr.markForCheck();
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

  private drawCircle(center: google.maps.LatLngLiteral, radius: number): void {
    if (this.circle) {
      this.circle.setCenter(center);
      this.circle.setRadius(radius);
    } else {
      this.circle = new google.maps.Circle({
        map: this.map,
        center,
        radius,
        fillColor: '#4D8DFF',
        fillOpacity: 0.18,
        strokeColor: '#4D8DFF',
        strokeOpacity: 0.45,
        strokeWeight: 1.5,
        clickable: false,
      });
    }
    const bounds = this.circle.getBounds();
    if (bounds) this.map.fitBounds(bounds);
  }

  setRadius(radius: number): void {
    this.selectedRadius.set(radius);
    const coords = this.selectedCoords();
    if (coords) {
      this.drawCircle({ lat: coords[0], lng: coords[1] }, radius);
    }
  }

  dismiss(save: boolean): void {
    if (save && this.selectedCoords()) {
      this.modalCtrl.dismiss({
        coords: this.selectedCoords()!,
        radius: this.selectedRadius(),
        formattedAddress: this.formattedAddress(),
      });
    } else {
      this.modalCtrl.dismiss(null);
    }
  }
}
