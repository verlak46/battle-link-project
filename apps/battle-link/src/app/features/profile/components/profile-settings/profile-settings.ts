import { Component, ChangeDetectionStrategy, computed, inject, output } from '@angular/core';
import { IonList, IonListHeader, IonItem, IonLabel, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, keyOutline, documentTextOutline, shieldCheckmarkOutline, phonePortraitOutline, globeOutline } from 'ionicons/icons';
import { TranslatePipe } from '@ngx-translate/core';
import { ThemeService } from '../../../../core/services/theme.service';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.html',
  styleUrl: './profile-settings.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonList, IonListHeader, IonItem, IonLabel, IonIcon, TranslatePipe],
})
export class ProfileSettingsComponent {
  editProfile = output<void>();
  openAccount = output<void>();
  openAppearance = output<void>();
  openLanguage = output<void>();
  openPrivacy = output<void>();
  openTerms = output<void>();

  private readonly theme = inject(ThemeService);
  private readonly language = inject(LanguageService);

  readonly currentThemeLabel = computed(() =>
    this.theme.current() === 'dark' ? 'PROFILE.APPEARANCE_DARK' : 'PROFILE.APPEARANCE_LIGHT'
  );

  get currentLangLabel(): string {
    return this.language.current === 'es' ? 'LANGUAGE.ES' : 'LANGUAGE.EN';
  }

  constructor() {
    addIcons({ personOutline, keyOutline, documentTextOutline, shieldCheckmarkOutline, phonePortraitOutline, globeOutline });
  }
}
