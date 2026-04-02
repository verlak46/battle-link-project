import { Component, ChangeDetectionStrategy, output } from '@angular/core';
import { IonList, IonListHeader, IonItem, IonLabel, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, keyOutline, documentTextOutline, shieldCheckmarkOutline } from 'ionicons/icons';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.html',
  styleUrl: './profile-settings.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonList, IonListHeader, IonItem, IonLabel, IonIcon],
})
export class ProfileSettingsComponent {
  editProfile = output<void>();
  openAccount = output<void>();
  openPrivacy = output<void>();
  openTerms = output<void>();

  constructor() {
    addIcons({ personOutline, keyOutline, documentTextOutline, shieldCheckmarkOutline });
  }
}
