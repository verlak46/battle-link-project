import { Component, computed, input, output } from '@angular/core';
import {
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { CreationType } from '../../new-form.types';

@Component({
  selector: 'app-type-selector',
  template: `
    <ion-segment
      [value]="uiCategory()"
      (ionChange)="onCategoryChange($any($event).detail.value)"
      class="tipo-segment">
      <ion-segment-button value="game">
        <ion-label>{{ 'NEW.TYPE_GAME' | translate }}</ion-label>
      </ion-segment-button>
      <ion-segment-button value="event">
        <ion-label>{{ 'NEW.TYPE_EVENT' | translate }}</ion-label>
      </ion-segment-button>
    </ion-segment>
  `,
  styles: [`.tipo-segment { margin-bottom: 16px; }`],
  imports: [IonSegment, IonSegmentButton, IonLabel, TranslatePipe],
})
export class TypeSelectorComponent {
  type = input.required<CreationType | null>();
  typeChange = output<CreationType | null>();

  uiCategory = computed<'game' | 'event'>(() =>
    this.type() === 'game' ? 'game' : 'event',
  );

  onCategoryChange(value: 'game' | 'event'): void {
    this.typeChange.emit(value === 'game' ? 'game' : null);
  }
}
