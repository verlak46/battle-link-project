import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline, storefrontOutline, peopleOutline } from 'ionicons/icons';
import { TranslatePipe } from '@ngx-translate/core';
import { Event } from '../../../core/services/api.service';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.html',
  styleUrl: './event-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    TranslatePipe,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonChip,
    IonLabel,
    IonIcon,
  ],
})
export class EventCardComponent {
  event = input.required<Event>();
  /** Muestra el chip de tipo (Partida/Evento) antes del título, útil en listas mixtas */
  showKindBadge = input(false);

  constructor() {
    addIcons({ calendarOutline, storefrontOutline, peopleOutline });
  }
}
