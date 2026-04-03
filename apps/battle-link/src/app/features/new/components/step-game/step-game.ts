import { Component, inject, input, output } from '@angular/core';
import { IonItem, IonLabel, IonInput, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { CreationType } from '../../new-form.types';
import { ApiService } from '../../../../core/services/api.service';
import { Wargame } from '../../../../shared/models/IWargame';

@Component({
  selector: 'app-step-game',
  template: `
    <ion-item>
      <ion-label position="stacked">
        {{ (type() === 'partida' ? 'NEW.GAME_LABEL_GAME' : 'NEW.GAME_LABEL_EVENT') | translate }}
      </ion-label>
      <ion-select
        [value]="game()"
        (ionChange)="gameChange.emit($any($event).detail.value)"
        interface="popover"
        [placeholder]="'NEW.GAME_PLACEHOLDER' | translate">
        @for (wargame of wargames(); track wargame.id) {
          <ion-select-option [value]="wargame.id">
            {{ wargame.name }}
          </ion-select-option>
        }
      </ion-select>
    </ion-item>
    <ion-item>
      <ion-label position="stacked">{{ 'NEW.EDITION' | translate }}</ion-label>
      <ion-input
        [value]="system()"
        (ionInput)="systemChange.emit($any($event).detail.value)"
        [placeholder]="'NEW.EDITION_PLACEHOLDER' | translate">
      </ion-input>
    </ion-item>
  `,
  imports: [IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, TranslatePipe],
})
export class StepGameComponent {
  private readonly api = inject(ApiService);

  type = input.required<CreationType>();
  game = input('');
  system = input('');

  gameChange = output<string>();
  systemChange = output<string>();

  wargames = toSignal(this.api.getWargames(), {
    initialValue: [] as Wargame[],
  });
}
