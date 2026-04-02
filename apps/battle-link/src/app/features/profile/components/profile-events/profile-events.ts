import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonChip,
  IonLabel,
  IonIcon,
  IonButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  locationOutline,
  peopleOutline,
  addCircleOutline,
  gameControllerOutline,
} from 'ionicons/icons';
import { Event } from '../../../../core/services/api.service';

@Component({
  selector: 'app-profile-events',
  templateUrl: './profile-events.html',
  styleUrl: './profile-events.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    DatePipe,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonChip,
    IonLabel,
    IonIcon,
    IonButton,
  ],
})
export class ProfileEventsComponent {
  events = input<Event[]>([]);

  constructor() {
    addIcons({ calendarOutline, locationOutline, peopleOutline, addCircleOutline, gameControllerOutline });
  }
}
