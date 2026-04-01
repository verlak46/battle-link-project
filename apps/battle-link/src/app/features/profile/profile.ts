import { Component, OnInit, computed, inject, signal } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonChip,
  IonSpinner,
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { addIcons } from 'ionicons';
import {
  arrowBack,
  logOutOutline,
  mailOutline,
  personCircleOutline,
  calendarOutline,
  addCircleOutline,
  peopleOutline,
  gameControllerOutline,
  locationOutline,
} from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';
import { ApiService, Event } from '../../core/services/api.service';
import { ProfileEditComponent } from './components/profile-edit/profile-edit';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonButtons,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonChip,
    IonSpinner,
    RouterLink,
    DatePipe,
    ProfileEditComponent,
  ],
})
export class ProfilePage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  showEdit = signal(false);
  myEvents = toSignal(this.api.getMyEvents(), { initialValue: [] as Event[] });

  user = computed(() => this.auth.user());

  displayNick = computed(() => this.user()?.nick || 'Jugador');
  displayName = computed(() => this.user()?.name || 'Jugador');
  email = computed(() => this.user()?.email ?? '');
  photoURL = computed(() => this.user()?.picture ?? null);

  initials = computed(() => {
    const name = this.displayName();
    if (!name) return '';
    const parts = name.trim().split(' ');
    const first = parts[0]?.[0] ?? '';
    const second = parts[1]?.[0] ?? '';
    return (first + second).toUpperCase();
  });

  constructor() {
    addIcons({ arrowBack, logOutOutline, mailOutline, personCircleOutline, calendarOutline, addCircleOutline, peopleOutline, gameControllerOutline, locationOutline });
  }

  ngOnInit(): void {
    this.auth.ready
      .then(() => this.auth.refreshProfile())
      .catch(() => { /* sesión restaurada desde caché, fallo silencioso aceptable */ });
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }
}
