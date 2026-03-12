import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
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
  IonSelect,
  IonSelectOption,
  IonSegment,
  IonSegmentButton,
  IonButton,
  IonToast,
  IonSpinner,
} from '@ionic/angular/standalone';
import { ApiService } from '../../../core/services/api.service';
import { getApiError } from '../../../core/utils/api-error';
import { VenueType } from '../../../shared/models/IVenue';

@Component({
  selector: 'app-nueva-venue',
  templateUrl: './nueva-venue.html',
  styleUrl: './nueva-venue.scss',
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
    IonSelect,
    IonSelectOption,
    IonSegment,
    IonSegmentButton,
    IonButton,
    IonToast,
    IonSpinner,
  ],
})
export class NuevaVenuePage {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  name = signal('');
  type = signal<VenueType>('store');
  city = signal('');
  address = signal('');
  description = signal('');
  phone = signal('');
  website = signal('');
  lat = signal<number | null>(null);
  lng = signal<number | null>(null);

  loading = signal(false);
  error = signal('');
  success = signal(false);

  locating = signal(false);

  useMyLocation() {
    if (!navigator.geolocation) {
      this.error.set('Geolocalización no disponible en este dispositivo');
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
        this.error.set('No se pudo obtener la ubicación');
        this.locating.set(false);
      },
    );
  }

  async submit() {
    if (!this.name().trim() || !this.city().trim() || !this.address().trim()) {
      this.error.set('Nombre, ciudad y dirección son obligatorios');
      return;
    }
    if (this.lat() === null || this.lng() === null) {
      this.error.set('Debes establecer las coordenadas con "Usar mi ubicación"');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.api
      .createVenue({
        name: this.name().trim(),
        type: this.type(),
        city: this.city().trim(),
        address: this.address().trim(),
        location: { type: 'Point', coordinates: [this.lng()!, this.lat()!] },
        description: this.description().trim() || undefined,
        phone: this.phone().trim() || undefined,
        website: this.website().trim() || undefined,
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
