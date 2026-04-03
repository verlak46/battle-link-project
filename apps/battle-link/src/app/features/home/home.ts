import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
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
  IonItem,
  IonList,
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  trophyOutline,
  compassOutline,
  storefrontOutline,
  addCircleOutline,
  peopleOutline,
} from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { Place } from '@battle-link/shared-models';
import { MOCK_EVENTS, MOCK_TOURNAMENTS } from '../../shared/mock/events.mock';

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
    IonItem,
    IonList,
    RouterLink,
    DatePipe,
    TranslatePipe,
  ],
})
export class HomePage {
  private readonly auth = inject(AuthService);
  private readonly api = inject(ApiService);

  readonly user = computed(() => this.auth.user());
  readonly displayNick = computed(() => this.user()?.nick ?? this.user()?.name ?? 'Jugador');

  readonly myEvents = computed(() => {
    const userId = this.user()?._id ?? 'mock-user-id';
    return MOCK_EVENTS.filter((e) => e.participants.includes(userId));
  });

  readonly myTournaments = computed(() => {
    const userId = this.user()?._id ?? 'mock-user-id';
    return MOCK_TOURNAMENTS.filter((t) => t.participants.some((p) => p.userId === userId));
  });

  readonly nearbyPlaces = toSignal(this.api.getPlaces(), { initialValue: [] as Place[] });

  constructor() {
    addIcons({
      calendarOutline,
      trophyOutline,
      compassOutline,
      storefrontOutline,
      addCircleOutline,
      peopleOutline,
    });
  }
}
