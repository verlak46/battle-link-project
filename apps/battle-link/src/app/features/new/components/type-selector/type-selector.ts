import { Component, computed, input, output } from '@angular/core';
import {
  IonChip,
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

    @if (uiCategory() === 'event') {
      <div class="event-kind">
        <p class="event-kind__label">{{ 'NEW.EVENT_KIND_LABEL' | translate }}</p>
        <div class="event-kind__chips">
          <ion-chip
            [color]="type() === 'tournament' ? 'warning' : 'medium'"
            [outline]="type() !== 'tournament'"
            (click)="typeChange.emit('tournament')">
            {{ 'NEW.TYPE_TOURNAMENT' | translate }}
          </ion-chip>
          <ion-chip
            [color]="type() === 'campaign' ? 'tertiary' : 'medium'"
            [outline]="type() !== 'campaign'"
            (click)="typeChange.emit('campaign')">
            {{ 'NEW.TYPE_CAMPAIGN' | translate }}
          </ion-chip>
          <ion-chip
            [color]="type() === 'league' ? 'success' : 'medium'"
            [outline]="type() !== 'league'"
            (click)="typeChange.emit('league')">
            {{ 'NEW.TYPE_LEAGUE' | translate }}
          </ion-chip>
        </div>
      </div>
    }
  `,
  styles: [`
    .tipo-segment { margin-bottom: 16px; }
    .event-kind { margin-bottom: 24px; }
    .event-kind__label {
      font-size: 0.85rem;
      color: var(--ion-color-medium);
      margin: 0 0 8px;
    }
    .event-kind__chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  `],
  imports: [IonSegment, IonSegmentButton, IonLabel, IonChip, TranslatePipe],
})
export class TypeSelectorComponent {
  type = input.required<CreationType | null>();
  typeChange = output<CreationType | null>();

  /** 'game' when type is 'game', 'event' for any event sub-type or null (no sub-type chosen yet) */
  uiCategory = computed<'game' | 'event'>(() =>
    this.type() === 'game' ? 'game' : 'event',
  );

  onCategoryChange(value: 'game' | 'event'): void {
    if (value === 'game') {
      this.typeChange.emit('game');
    } else {
      this.typeChange.emit(null);
    }
  }
}
