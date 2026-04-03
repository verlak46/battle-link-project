import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircleOutline } from 'ionicons/icons';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-profile-avatar',
  templateUrl: './profile-avatar.html',
  styleUrl: './profile-avatar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonIcon, TranslatePipe],
})
export class ProfileAvatarComponent {
  photoURL = input<string | null>(null);
  initials = input('');
  nick = input('');

  editClick = output<void>();

  constructor() {
    addIcons({ personCircleOutline });
  }
}
