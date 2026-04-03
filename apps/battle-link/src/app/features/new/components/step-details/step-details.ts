import { Component, input, output } from '@angular/core';
import { IonItem, IonLabel, IonInput, IonTextarea } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { CreationType } from '../../new-form.types';
import { ImageUploadComponent } from '../../../../shared/components/image-upload/image-upload';

@Component({
  selector: 'app-step-details',
  template: `
    <ion-item>
      <ion-label position="stacked">
        {{ (type() === 'game' ? 'NEW.TITLE_GAME_LABEL' : 'NEW.TITLE_EVENT_LABEL') | translate }}
      </ion-label>
      <ion-input
        [value]="title()"
        (ionInput)="titleChange.emit($any($event).detail.value)"
        [placeholder]="'NEW.TITLE_PLACEHOLDER' | translate"
        clearInput>
      </ion-input>
    </ion-item>
    <ion-item>
      <ion-label position="stacked">{{ 'NEW.DESCRIPTION' | translate }}</ion-label>
      <ion-textarea
        [value]="description()"
        (ionInput)="descriptionChange.emit($any($event).detail.value)"
        [placeholder]="'NEW.DESCRIPTION_PLACEHOLDER' | translate"
        rows="4"
        autoGrow>
      </ion-textarea>
    </ion-item>
    <ion-item>
      <ion-label position="stacked">{{ 'NEW.MAX_PLAYERS' | translate }}</ion-label>
      <ion-input
        type="number"
        [value]="maxPlayers()"
        (ionInput)="maxPlayersChange.emit($any($event).detail.value)"
        [placeholder]="'NEW.MAX_PLAYERS_PLACEHOLDER' | translate"
        min="1">
      </ion-input>
    </ion-item>
    <ion-item>
      <ion-label position="stacked">{{ 'NEW.CONTACT' | translate }}</ion-label>
      <ion-input
        type="url"
        [value]="contactUrl()"
        (ionInput)="contactUrlChange.emit($any($event).detail.value)"
        [placeholder]="'NEW.CONTACT_PLACEHOLDER' | translate">
      </ion-input>
    </ion-item>
    <app-image-upload
      entityType="events"
      [imageUrl]="imageUrl()"
      (imageUrlChange)="imageUrlChange.emit($event)">
    </app-image-upload>
  `,
  imports: [IonItem, IonLabel, IonInput, IonTextarea, ImageUploadComponent, TranslatePipe],
})
export class StepDetailsComponent {
  type = input.required<CreationType | null>();
  title = input('');
  description = input('');
  maxPlayers = input('');
  contactUrl = input('');
  imageUrl = input<string | undefined>(undefined);

  titleChange = output<string>();
  descriptionChange = output<string>();
  maxPlayersChange = output<string>();
  contactUrlChange = output<string>();
  imageUrlChange = output<string>();
}
