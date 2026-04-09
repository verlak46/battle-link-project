import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, ViewChild, inject, signal } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
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
    .map-container {
      width: 100%;
      height: 320px;
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
    IonContent, IonFooter,
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

  @ViewChild('mapDiv') mapDivRef!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    const defaultCenter = { lat: 40.4168, lng: -3.7038 };
    const center = this.coords
      ? { lat: this.coords[0], lng: this.coords[1] }
      : defaultCenter;

    if (this.coords) {
      this.selectedCoords.set(this.coords);
    }

    const map = new google.maps.Map(this.mapDivRef.nativeElement, {
      center,
      zoom: 14,
      disableDefaultUI: true,
      zoomControl: true,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const marker = new (google.maps as any).Marker({
      position: center,
      map,
      draggable: true,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    marker.addListener('dragend', () => {
      const pos = marker.getPosition() as google.maps.LatLng;
      this.zone.run(() => {
        this.selectedCoords.set([pos.lat(), pos.lng()]);
        this.cdr.markForCheck();
      });
    });

    map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        marker.setPosition(e.latLng);
        this.zone.run(() => {
          this.selectedCoords.set([e.latLng!.lat(), e.latLng!.lng()]);
          this.cdr.markForCheck();
        });
      }
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
