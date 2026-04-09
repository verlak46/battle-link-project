import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { IonList, IonItem, IonLabel, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { moonOutline, sunnyOutline, checkmark } from 'ionicons/icons';
import { TranslatePipe } from '@ngx-translate/core';
import { ThemeService, AppTheme } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-profile-appearance',
  templateUrl: './profile-appearance.html',
  styleUrl: './profile-appearance.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonList, IonItem, IonLabel, IonIcon, TranslatePipe],
})
export class ProfileAppearanceComponent {
  readonly theme = inject(ThemeService);

  constructor() {
    addIcons({ moonOutline, sunnyOutline, checkmark });
  }

  setTheme(value: AppTheme): void {
    this.theme.setTheme(value);
  }
}
