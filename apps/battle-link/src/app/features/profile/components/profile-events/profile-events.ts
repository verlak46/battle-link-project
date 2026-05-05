import { Component, ChangeDetectionStrategy, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonIcon,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircleOutline, gameControllerOutline } from 'ionicons/icons';
import { TranslatePipe } from '@ngx-translate/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { Event } from '../../../../core/services/api.service';
import { ApiService } from '../../../../core/services/api.service';
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
    IonSegment,
    IonSegmentButton,
    IonLabel,
    TranslatePipe,
    EventCardComponent,
  ],
})
export class ProfileEventsComponent {
  private readonly api = inject(ApiService);

  /** Incremented by ProfilePage.ionViewWillEnter() to trigger a data reload */
  readonly reload = input(0);

  readonly activeTab = signal<'active' | 'history'>('active');

  readonly activeEvents = toSignal(
    toObservable(this.reload).pipe(
      switchMap(() => this.api.getMyEvents({ fromDate: new Date().toISOString() })),
    ),
    { initialValue: [] as Event[] },
  );

  readonly historyEvents = toSignal(
    toObservable(this.reload).pipe(
      switchMap(() => this.api.getMyEvents({ toDate: new Date().toISOString() })),
    ),
    { initialValue: [] as Event[] },
  );

  constructor() {
    addIcons({ addCircleOutline, gameControllerOutline });
  }
}
