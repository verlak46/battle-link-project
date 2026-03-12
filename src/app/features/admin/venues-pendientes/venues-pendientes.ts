import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonButton,
  IonSpinner,
  IonNote,
} from '@ionic/angular/standalone';
import { ApiService } from '../../../core/services/api.service';
import { Venue } from '../../../shared/models/IVenue';
import { getApiError } from '../../../core/utils/api-error';

@Component({
  selector: 'app-venues-pendientes',
  templateUrl: './venues-pendientes.html',
  styleUrl: './venues-pendientes.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonBackButton,
    IonButtons,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonButton,
    IonSpinner,
    IonNote,
  ],
})
export class VenuesPendientesPage {
  private readonly api = inject(ApiService);

  venues = signal<Venue[]>([]);
  loading = signal(true);
  error = signal('');

  constructor() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.api.getPendingVenues().subscribe({
      next: (data) => {
        this.venues.set(data);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.error.set(getApiError(err));
        this.loading.set(false);
      },
    });
  }

  approve(venue: Venue) {
    this.api.approveVenue(venue._id).subscribe({
      next: () => this.load(),
      error: (err: unknown) => this.error.set(getApiError(err)),
    });
  }

  reject(venue: Venue) {
    this.api.rejectVenue(venue._id).subscribe({
      next: () => this.load(),
      error: (err: unknown) => this.error.set(getApiError(err)),
    });
  }
}
