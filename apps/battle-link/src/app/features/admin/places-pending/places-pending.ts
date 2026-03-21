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
  IonButton,
  IonSpinner,
  IonNote,
} from '@ionic/angular/standalone';
import { ApiService } from '../../../core/services/api.service';
import { Place } from '@battle-link/shared-models';
import { getApiError } from '../../../core/utils/api-error';

@Component({
  selector: 'app-places-pending',
  templateUrl: './places-pending.html',
  styleUrl: './places-pending.scss',
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
    IonButton,
    IonSpinner,
    IonNote,
  ],
})
export class PlacesPendingPage {
  private readonly api = inject(ApiService);

  places = signal<Place[]>([]);
  loading = signal(true);
  error = signal('');

  constructor() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.api.getPendingPlaces().subscribe({
      next: (data) => {
        this.places.set(data);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.error.set(getApiError(err));
        this.loading.set(false);
      },
    });
  }

  approve(place: Place) {
    this.api.approvePlace(place._id).subscribe({
      next: () => this.load(),
      error: (err: unknown) => this.error.set(getApiError(err)),
    });
  }

  reject(place: Place) {
    this.api.rejectPlace(place._id).subscribe({
      next: () => this.load(),
      error: (err: unknown) => this.error.set(getApiError(err)),
    });
  }
}
