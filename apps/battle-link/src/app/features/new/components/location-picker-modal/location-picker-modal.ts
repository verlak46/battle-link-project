import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, ViewChild, inject, signal } from '@angular/core';
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
import { DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-location-picker-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          {{ (showRadius ? 'NEW.LOCATION_APPROXIMATE' : 'NEW.LOCATION_MAP') | translate }}
        </ion-title>
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

      @if (selectedCoords()) {
        <p class="pin-info">
          {{ 'NEW.LOCATION_PIN_SET' | translate }}:
          {{ selectedCoords()![0] | number:'1.4-4' }},
          {{ selectedCoords()![1] | number:'1.4-4' }}
        </p>
      }

      @if (showRadius) {
        <div class="radius-selector">
          <ion-button
            [fill]="selectedRadius() === 500 ? 'solid' : 'outline'"
            size="small"
            (click)="selectedRadius.set(500)">
            {{ 'NEW.LOCATION_RADIUS_500' | translate }}
          </ion-button>
          <ion-button
            [fill]="selectedRadius() === 1000 ? 'solid' : 'outline'"
            size="small"
            (click)="selectedRadius.set(1000)">
            {{ 'NEW.LOCATION_RADIUS_1000' | translate }}
          </ion-button>
          <ion-button
            [fill]="selectedRadius() === 5000 ? 'solid' : 'outline'"
            size="small"
            (click)="selectedRadius.set(5000)">
            {{ 'NEW.LOCATION_RADIUS_5000' | translate }}
          </ion-button>
        </div>
      }
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
      height: 260px;
      margin-top: 8px;
    }
    .pin-info {
      font-size: 12px;
      color: var(--ion-color-medium);
      text-align: center;
      margin: 8px 16px 0;
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
    DecimalPipe, TranslatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationPickerModalComponent implements AfterViewInit {
  private readonly modalCtrl = inject(ModalController);
  private readonly zone = inject(NgZone);
  private readonly cdr = inject(ChangeDetectorRef);

  // Set by ModalController via componentProps
  coords: [number, number] | undefined;
  showRadius = false;

  selectedCoords = signal<[number, number] | null>(null);
  selectedRadius = signal<number>(1000);

  private map!: google.maps.Map;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private marker!: any;

  @ViewChild('mapDiv') private mapDivRef!: ElementRef<HTMLDivElement>;
  @ViewChild('addressInput') private addressInputRef!: IonInput;

  ngAfterViewInit(): void {
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
      zoom: 14,
      disableDefaultUI: true,
      zoomControl: true,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.marker = new (google.maps as any).Marker({
      position: center,
      map: this.map,
      draggable: true,
    });

    this.marker.addListener('dragend', () => {
      const pos = this.marker.getPosition() as google.maps.LatLng;
      this.zone.run(() => {
        this.selectedCoords.set([pos.lat(), pos.lng()]);
        this.cdr.markForCheck();
      });
    });

    this.map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        this.marker.setPosition(e.latLng);
        this.zone.run(() => {
          this.selectedCoords.set([e.latLng!.lat(), e.latLng!.lng()]);
          this.cdr.markForCheck();
        });
      }
    });
  }

  private initAutocomplete(): void {
    this.addressInputRef.getInputElement().then((el) => {
      const autocomplete = new google.maps.places.Autocomplete(el, {
        types: ['geocode'],
        fields: ['geometry', 'formatted_address'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        const loc = place.geometry?.location;
        if (loc) {
          const latLng = { lat: loc.lat(), lng: loc.lng() };
          this.marker.setPosition(latLng);
          this.map.panTo(latLng);
          this.map.setZoom(15);
          this.zone.run(() => {
            this.selectedCoords.set([loc.lat(), loc.lng()]);
            this.cdr.markForCheck();
          });
        }
      });
    });
  }

  dismiss(save: boolean): void {
    if (save && this.selectedCoords()) {
      this.modalCtrl.dismiss({
        coords: this.selectedCoords()!,
        radius: this.showRadius ? this.selectedRadius() : undefined,
      });
    } else {
      this.modalCtrl.dismiss(null);
    }
  }
}
