import { Component, input, output } from '@angular/core';
import {
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { CreationType } from '../../new-form.types';

@Component({
  selector: 'app-type-selector',
  template: `
    <ion-segment [value]="type()" (ionChange)="typeChange.emit($any($event).detail.value)" class="tipo-segment">
      <ion-segment-button value="partida">
        <ion-label>{{ 'NEW.TYPE_GAME' | translate }}</ion-label>
      </ion-segment-button>
      <ion-segment-button value="evento">
        <ion-label>{{ 'NEW.TYPE_EVENT' | translate }}</ion-label>
      </ion-segment-button>
    </ion-segment>
  `,
  styles: [`
    .tipo-segment { margin-bottom: 24px; }
  `],
  imports: [IonSegment, IonSegmentButton, IonLabel, TranslatePipe],
})
export class TypeSelectorComponent {
  type = input.required<CreationType>();
  typeChange = output<CreationType>();
}
