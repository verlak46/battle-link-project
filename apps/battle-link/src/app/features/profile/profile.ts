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
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
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
    TranslatePipe,
  ],
})
export class ProfilePage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly alertCtrl = inject(AlertController);
  private readonly translate = inject(TranslateService);

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
    if (this.showEdit()) return 'PROFILE.EDIT_HEADER';
    if (this.showAccount()) return 'PROFILE.ACCOUNT_HEADER';
    if (this.showSettings()) return 'PROFILE.SETTINGS_HEADER';
    return 'PROFILE.TITLE';
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
      header: this.translate.instant('PROFILE.DELETE_CONFIRM_HEADER'),
      message: this.translate.instant('PROFILE.DELETE_CONFIRM_MSG'),
      buttons: [
        { text: this.translate.instant('COMMON.CANCEL'), role: 'cancel' },
        {
          text: this.translate.instant('PROFILE.DELETE_CONFIRM_BTN'),
          role: 'destructive',
          cssClass: 'alert-button-danger',
          handler: async () => {
            await this.auth.logout();
            this.router.navigate(['/login']);
          },
        },
      ],
    });
    await alert.present();
  }
}
