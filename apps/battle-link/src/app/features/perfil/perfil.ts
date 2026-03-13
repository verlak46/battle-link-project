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
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBack, logOutOutline, mailOutline, personCircleOutline } from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';
import { PerfilEditComponent } from './components/perfil-edit/perfil-edit';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
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
    PerfilEditComponent,
  ],
})
export class PerfilPage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  showEdit = signal(false);

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
    addIcons({ arrowBack, logOutOutline, mailOutline, personCircleOutline });
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
