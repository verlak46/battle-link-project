import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonIcon,
  IonLabel,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  bookOutline,
  calendarOutline,
  checkmarkCircleOutline,
  exitOutline,
  gameControllerOutline,
  medalOutline,
  peopleOutline,
  storefrontOutline,
  trophyOutline,
} from 'ionicons/icons';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService, Event } from '../../../core/services/api.service';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.html',
  styleUrl: './event-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    TranslatePipe,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonChip,
    IonLabel,
    IonIcon,
    IonSpinner,
  ],
})
export class EventCardComponent {
  private readonly api = inject(ApiService);

  event = input.required<Event>();
  /** Muestra el chip de tipo (Partida/Evento) antes del título, útil en listas mixtas */
  showKindBadge = input(false);
  /** Activa el botón de unirse/abandonar; los callers existentes no lo ven por defecto */
  showJoinButton = input(false);
  /** ID del usuario autenticado; null si no hay sesión */
  currentUserId = input<string | null>(null);

  joined = output<Event>();
  left = output<Event>();

  readonly joining = signal(false);
  readonly error = signal<string | null>(null);

  readonly isParticipant = computed(() => {
    const uid = this.currentUserId();
    return uid ? this.event().participants.includes(uid) : false;
  });

  readonly isOwner = computed(() => {
    const uid = this.currentUserId();
    return uid !== null && uid === this.event().createdBy;
  });

  readonly isFull = computed(() => {
    const e = this.event();
    return e.maxPlayers > 0 && e.currentPlayers >= e.maxPlayers;
  });

  readonly canJoin = computed(
    () => !this.isParticipant() && !this.isOwner() && !this.isFull() && this.event().status === 'published',
  );

  readonly canLeave = computed(
    () => this.isParticipant() && !this.isOwner() && this.event().status === 'published',
  );

  constructor() {
    addIcons({
      addCircleOutline,
      bookOutline,
      calendarOutline,
      checkmarkCircleOutline,
      exitOutline,
      gameControllerOutline,
      medalOutline,
      peopleOutline,
      storefrontOutline,
      trophyOutline,
    });
  }

  join(): void {
    if (!this.canJoin() || this.joining()) return;
    this.joining.set(true);
    this.error.set(null);
    this.api.joinEvent(this.event()._id).subscribe({
      next: (updated) => {
        this.joining.set(false);
        this.joined.emit(updated);
      },
      error: (err: unknown) => {
        this.joining.set(false);
        this.error.set(this.extractError(err));
      },
    });
  }

  leave(): void {
    if (!this.canLeave() || this.joining()) return;
    this.joining.set(true);
    this.error.set(null);
    this.api.leaveEvent(this.event()._id).subscribe({
      next: (updated) => {
        this.joining.set(false);
        this.left.emit(updated);
      },
      error: (err: unknown) => {
        this.joining.set(false);
        this.error.set(this.extractError(err));
      },
    });
  }

  private extractError(err: unknown): string {
    if (err && typeof err === 'object' && 'error' in err) {
      const apiErr = (err as { error?: { message?: string } }).error;
      if (apiErr?.message) return apiErr.message;
    }
    return 'Ha ocurrido un error';
  }
}
