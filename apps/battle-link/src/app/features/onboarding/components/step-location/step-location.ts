import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, NgZone, ViewChild, effect, inject, input, output } from '@angular/core';
import { IonButton, IonInput, IonItem, IonLabel, IonSpinner } from '@ionic/angular/standalone';
import { DecimalPipe } from '@angular/common';
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
        <p class="onboarding__location">
          {{ 'ONBOARDING.LOCATION_SAVED' | translate:{ lat: (location()![0] | number:'1.4-4'), lng: (location()![1] | number:'1.4-4') } }}
        </p>
      }

      <ion-item class="location-label-item">
        <ion-label position="stacked">{{ 'ONBOARDING.LOCATION_LABEL' | translate }}</ion-label>
        <ion-input
          [value]="locationLabel()"
          (ionInput)="locationLabelChange.emit($any($event).detail.value)"
          [placeholder]="'ONBOARDING.LOCATION_LABEL_PLACEHOLDER' | translate"
          clearInput>
        </ion-input>
      </ion-item>
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

    .onboarding__location {
      margin-top: 8px;
      font-size: 12px;
      color: var(--ion-color-medium);
    }

    .location-label-item {
      margin-top: 16px;
    }
  `],
  imports: [IonButton, IonSpinner, IonItem, IonLabel, IonInput, DecimalPipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingStepLocationComponent implements AfterViewInit {
  private readonly zone = inject(NgZone);

  private map: google.maps.Map | null = null;
  private marker: google.maps.Marker | null = null;

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
    });
  }

  ngAfterViewInit(): void {
    this.addressInputRef.getInputElement().then((el) => {
      const autocomplete = new google.maps.places.Autocomplete(el, {
        types: ['geocode'],
        fields: ['geometry', 'formatted_address'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        const loc = place.geometry?.location;
        if (loc) {
          this.zone.run(() => {
            this.locationChange.emit([loc.lat(), loc.lng()]);
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
}
