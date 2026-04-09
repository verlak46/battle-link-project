import { Component, input, output } from '@angular/core';
import { IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { CreationType } from '../../new-form.types';

@Component({
  selector: 'app-step-event-kind',
  template: `
    <ion-item>
      <ion-label position="stacked">{{ 'NEW.EVENT_KIND_LABEL' | translate }}</ion-label>
      <ion-select
        [value]="kind()"
        (ionChange)="kindChange.emit($any($event).detail.value)"
        interface="popover"
        [placeholder]="'NEW.EVENT_KIND_PLACEHOLDER' | translate">
        <ion-select-option value="tournament">{{ 'NEW.TYPE_TOURNAMENT' | translate }}</ion-select-option>
        <ion-select-option value="campaign">{{ 'NEW.TYPE_CAMPAIGN' | translate }}</ion-select-option>
        <ion-select-option value="league">{{ 'NEW.TYPE_LEAGUE' | translate }}</ion-select-option>
      </ion-select>
    </ion-item>
  `,
  imports: [IonItem, IonLabel, IonSelect, IonSelectOption, TranslatePipe],
})
export class StepEventKindComponent {
  kind = input<CreationType | null>(null);
  kindChange = output<CreationType>();
}
