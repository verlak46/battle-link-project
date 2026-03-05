import { Component, computed, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { logOutOutline, mailOutline, personCircleOutline } from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
  ],
})
export class PerfilPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  user = computed(() => this.auth.user());

  displayName = computed(() => this.user()?.displayName || 'Jugador');
  email = computed(() => this.user()?.email ?? '');
  photoURL = computed(() => this.user()?.photoURL ?? null);

  initials = computed(() => {
    const name = this.displayName();
    if (!name) return '';
    const parts = name.trim().split(' ');
    const first = parts[0]?.[0] ?? '';
    const second = parts[1]?.[0] ?? '';
    return (first + second).toUpperCase();
  });

  constructor() {
    addIcons({ logOutOutline, mailOutline, personCircleOutline });
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }
}
