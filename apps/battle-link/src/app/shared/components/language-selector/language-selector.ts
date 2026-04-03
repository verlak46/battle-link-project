import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { IonList, IonListHeader, IonItem, IonLabel, IonSegment, IonSegmentButton } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService, AppLanguage } from '../../../core/services/language.service';

@Component({
  selector: 'app-language-selector',
  template: `
    <ion-list>
      <ion-list-header>{{ 'LANGUAGE.LABEL' | translate }}</ion-list-header>
      <ion-item lines="none">
        <ion-segment [value]="lang.current" (ionChange)="onChange($any($event).detail.value)">
          <ion-segment-button value="es">
            <ion-label>{{ 'LANGUAGE.ES' | translate }}</ion-label>
          </ion-segment-button>
          <ion-segment-button value="en">
            <ion-label>{{ 'LANGUAGE.EN' | translate }}</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-item>
    </ion-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonList, IonListHeader, IonItem, IonLabel, IonSegment, IonSegmentButton, TranslatePipe],
})
export class LanguageSelectorComponent {
  readonly lang = inject(LanguageService);

  onChange(value: AppLanguage): void {
    this.lang.setLanguage(value);
  }
}
