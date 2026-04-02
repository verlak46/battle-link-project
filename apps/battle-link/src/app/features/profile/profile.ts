import { Component, OnInit, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonButtons,
  AlertController,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { addIcons } from 'ionicons';
import { arrowBack, settingsOutline } from 'ionicons/icons';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { ApiService, Event } from '../../core/services/api.service';
import { ProfileEditComponent } from './components/profile-edit/profile-edit';
import { ProfileAvatarComponent } from './components/profile-avatar/profile-avatar';
import { ProfileEventsComponent } from './components/profile-events/profile-events';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings';
import { ProfileAccountComponent } from './components/profile-account/profile-account';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonButtons,
    ProfileEditComponent,
    ProfileAvatarComponent,
    ProfileEventsComponent,
    ProfileSettingsComponent,
    ProfileAccountComponent,
  ],
})
export class ProfilePage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly alertCtrl = inject(AlertController);

  showEdit = signal(false);
  showSettings = signal(false);
  showAccount = signal(false);

  myEvents = toSignal(this.api.getMyEvents(), { initialValue: [] as Event[] });

  private readonly user = computed(() => this.auth.user());

  displayNick = computed(() => this.user()?.nick || 'Jugador');
  email = computed(() => this.user()?.email ?? '');
  photoURL = computed(() => this.user()?.picture ?? null);

  initials = computed(() => {
    const name = this.user()?.name ?? '';
    if (!name) return '';
    const parts = name.trim().split(' ');
    return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
  });

  constructor() {
    addIcons({ arrowBack, settingsOutline });
  }

  ngOnInit(): void {
    this.auth.ready
      .then(() => this.auth.refreshProfile())
      .catch(() => { /* sesión restaurada desde caché, fallo silencioso aceptable */ });
  }

  headerTitle = computed(() => {
    if (this.showEdit()) return 'Editar perfil';
    if (this.showAccount()) return 'Cuenta';
    if (this.showSettings()) return 'Configuración';
    return 'Perfil';
  });

  showBackButton = computed(() => this.showEdit() || this.showSettings() || this.showAccount());

  goBack(): void {
    if (this.showEdit() || this.showAccount()) {
      this.showEdit.set(false);
      this.showAccount.set(false);
      this.showSettings.set(true);
    } else {
      this.showSettings.set(false);
    }
  }

  openEditProfile(): void {
    this.showSettings.set(false);
    this.showEdit.set(true);
  }

  openAccount(): void {
    this.showSettings.set(false);
    this.showAccount.set(true);
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }

  openBrowser(page: 'privacy' | 'terms'): void {
    const urls: Record<typeof page, string> = {
      privacy: environment.legal.privacyUrl,
      terms: environment.legal.termsUrl,
    };
    window.open(urls[page], '_blank', 'noopener');
  }

  async deleteAccount(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar cuenta',
      message: '¿Estás seguro? Esta acción es irreversible y perderás todos tus datos.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          cssClass: 'alert-button-danger',
          handler: async () => {
            // TODO: llamar a la API para eliminar la cuenta
            await this.auth.logout();
            this.router.navigate(['/login']);
          },
        },
      ],
    });
    await alert.present();
  }
}
