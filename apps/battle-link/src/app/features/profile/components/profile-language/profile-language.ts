import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { IonList, IonItem, IonLabel, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmark } from 'ionicons/icons';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService, AppLanguage } from '../../../../core/services/language.service';

@Component({
  selector: 'app-profile-language',
  templateUrl: './profile-language.html',
  styleUrl: './profile-language.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonList, IonItem, IonLabel, IonIcon, TranslatePipe],
})
export class ProfileLanguageComponent {
  readonly language = inject(LanguageService);

  constructor() {
    addIcons({ checkmark });
  }

  setLanguage(lang: AppLanguage): void {
    this.language.setLanguage(lang);
  }
}
