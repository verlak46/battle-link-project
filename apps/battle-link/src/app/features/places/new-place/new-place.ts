import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  NgZone,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
  IonTextarea,
  IonTitle,
  IonToolbar,
  IonToast,
} from '@ionic/angular/standalone';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../core/services/api.service';
import { getApiError } from '../../../core/utils/api-error';
import { PlaceType } from '@battle-link/shared-models';
import { ImageUploadComponent } from '../../../shared/components/image-upload/image-upload';

@Component({
  selector: 'app-new-place',
  templateUrl: './new-place.html',
  styleUrl: './new-place.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonBackButton,
    IonButtons,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonSegment,
    IonSegmentButton,
    IonButton,
    IonToast,
    IonSpinner,
    GoogleMap,
    MapMarker,
    ImageUploadComponent,
    TranslatePipe,
  ],
})
export class NewPlacePage implements AfterViewInit {
  @ViewChild('addressInput') private addressInputRef!: IonInput;

  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly zone = inject(NgZone);
  private readonly translate = inject(TranslateService);

  name = signal('');
  type = signal<PlaceType>('store');
  city = signal('');
  address = signal('');
  description = signal('');
  phone = signal('');
  website = signal('');
  lat = signal<number | null>(null);
  lng = signal<number | null>(null);

  imageUrl = signal<string | undefined>(undefined);
  loading = signal(false);
  error = signal('');
  success = signal(false);
  locating = signal(false);

  mapCenter = computed<google.maps.LatLngLiteral | null>(() =>
    this.lat() !== null ? { lat: this.lat()!, lng: this.lng()! } : null,
  );

  readonly mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    clickableIcons: false,
  };

  ngAfterViewInit() {
    this.addressInputRef.getInputElement().then((el) => {
      const autocomplete = new google.maps.places.Autocomplete(el, {
        types: ['address'],
        fields: ['formatted_address', 'geometry', 'address_components'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        this.zone.run(() => {
          if (place.formatted_address) {
            this.address.set(place.formatted_address);
          }
          if (place.geometry?.location) {
            this.lat.set(place.geometry.location.lat());
            this.lng.set(place.geometry.location.lng());
          }
          const cityComp = place.address_components?.find((c) =>
            c.types.includes('locality') || c.types.includes('administrative_area_level_2'),
          );
          if (cityComp) {
            this.city.set(cityComp.long_name);
          }
        });
      });
    });
  }

  useMyLocation() {
    if (!navigator.geolocation) {
      this.error.set(this.translate.instant('ONBOARDING.ERROR_GEOLOCATION'));
      return;
    }
    this.locating.set(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.lat.set(pos.coords.latitude);
        this.lng.set(pos.coords.longitude);
        this.locating.set(false);
      },
      () => {
        this.error.set(this.translate.instant('ONBOARDING.ERROR_LOCATION'));
        this.locating.set(false);
      },
    );
  }

  async submit() {
    if (!this.name().trim() || !this.city().trim() || !this.address().trim()) {
      this.error.set(this.translate.instant('PLACES.ERROR_REQUIRED'));
      return;
    }
    if (this.lat() === null || this.lng() === null) {
      this.error.set(this.translate.instant('PLACES.ERROR_SELECT_ADDRESS'));
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.api
      .createPlace({
        name: this.name().trim(),
        type: this.type(),
        city: this.city().trim(),
        address: this.address().trim(),
        location: { type: 'Point', coordinates: [this.lng()!, this.lat()!] },
        description: this.description().trim() || undefined,
        phone: this.phone().trim() || undefined,
        website: this.website().trim() || undefined,
        imageUrl: this.imageUrl(),
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.success.set(true);
          setTimeout(() => this.router.navigate(['/mapa']), 2000);
        },
        error: (err: unknown) => {
          this.loading.set(false);
          this.error.set(getApiError(err));
        },
      });
  }
}
