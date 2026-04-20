import { Component, ChangeDetectionStrategy, inject, computed, signal } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonChip,
  IonLabel,
  IonIcon,
  IonButton,
  IonButtons,
  IonItem,
  IonList,
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { EventCardComponent } from '../../shared/components/event-card/event-card';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  trophyOutline,
  compassOutline,
  storefrontOutline,
  addCircleOutline,
  peopleOutline,
  chevronForwardOutline,
} from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';
import { ApiService, Event } from '../../core/services/api.service';
import { Place } from '@battle-link/shared-models';
import { MOCK_TOURNAMENTS } from '../../shared/mock/events.mock';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonChip,
    IonLabel,
    IonIcon,
    IonButton,
    IonButtons,
    IonItem,
    IonList,
    RouterLink,
    DatePipe,
    TranslatePipe,
    EventCardComponent,
  ],
})
export class HomePage {
  private readonly auth = inject(AuthService);
  private readonly api = inject(ApiService);

  readonly user = computed(() => this.auth.user());
  readonly displayNick = computed(() => this.user()?.nick ?? this.user()?.name ?? 'Jugador');

  readonly initials = computed(() => {
    const name = this.user()?.nick ?? this.user()?.name ?? '';
    if (!name) return '?';
    const parts = name.trim().split(' ');
    return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase().slice(0, 2);
  });

  readonly myEvents = toSignal(this.api.getMyEvents(), { initialValue: [] as Event[] });

  readonly myTournaments = computed(() => {
    const userId = this.user()?._id ?? 'mock-user-id';
    return MOCK_TOURNAMENTS.filter((t) => t.participants.some((p) => p.userId === userId));
  });

  private readonly placesReload = signal(0);
  readonly nearbyPlaces = toSignal(
    toObservable(this.placesReload).pipe(switchMap(() => this.api.getPlaces())),
    { initialValue: [] as Place[] },
  );

  ionViewWillEnter(): void {
    this.placesReload.update((v) => v + 1);
  }

  constructor() {
    addIcons({
      calendarOutline,
      trophyOutline,
      compassOutline,
      storefrontOutline,
      addCircleOutline,
      peopleOutline,
      chevronForwardOutline,
    });
  }
}
