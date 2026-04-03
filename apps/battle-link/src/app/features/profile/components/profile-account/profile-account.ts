import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { IonList, IonListHeader, IonItem, IonLabel, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline } from 'ionicons/icons';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-profile-account',
  templateUrl: './profile-account.html',
  styleUrl: './profile-account.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonList, IonListHeader, IonItem, IonLabel, IonIcon, TranslatePipe],
})
export class ProfileAccountComponent {
  email = input('');

  logout = output<void>();
  deleteAccount = output<void>();

  constructor() {
    addIcons({ mailOutline });
  }
}
