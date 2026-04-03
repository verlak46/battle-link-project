import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircleOutline, gameControllerOutline } from 'ionicons/icons';
import { TranslatePipe } from '@ngx-translate/core';
import { Event } from '../../../../core/services/api.service';
import { EventCardComponent } from '../../../../shared/components/event-card/event-card';

@Component({
  selector: 'app-profile-events',
  templateUrl: './profile-events.html',
  styleUrl: './profile-events.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    IonIcon,
    IonButton,
    TranslatePipe,
    EventCardComponent,
  ],
})
export class ProfileEventsComponent {
  events = input<Event[]>([]);

  constructor() {
    addIcons({ addCircleOutline, gameControllerOutline });
  }
}
