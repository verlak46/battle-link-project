import { Component, input, output } from '@angular/core';
import {
  IonItem,
  IonLabel,
  IonInput,
  IonSegment,
  IonSegmentButton,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { ExperienceLevel } from '../../../../core/services/api.service';

@Component({
  selector: 'app-onboarding-step-profile',
  template: `
    <section>
      <h3>{{ 'ONBOARDING.ABOUT' | translate }}</h3>
      <ion-item>
        <ion-label position="stacked">{{ 'ONBOARDING.NICK' | translate }}</ion-label>
        <ion-input
          [value]="nick()"
          (ionInput)="nickChange.emit($any($event.target).value ?? '')"
          [placeholder]="'ONBOARDING.NICK_PLACEHOLDER' | translate"
        ></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">{{ 'ONBOARDING.NAME' | translate }}</ion-label>
        <ion-input
          [value]="name()"
          (ionInput)="nameChange.emit($any($event.target).value ?? '')"
          [placeholder]="'ONBOARDING.NAME_PLACEHOLDER' | translate"
        ></ion-input>
      </ion-item>

      <ion-item lines="none" class="onboarding__segment-label">
        <ion-label>{{ 'ONBOARDING.EXPERIENCE' | translate }}</ion-label>
      </ion-item>
      <ion-segment [value]="experienceLevel()" scrollable="true" class="onboarding__segment">
        <ion-segment-button
          value="beginner"
          (click)="experienceLevelChange.emit('beginner')"
        >
          <ion-label>{{ 'ONBOARDING.BEGINNER' | translate }}</ion-label>
        </ion-segment-button>
        <ion-segment-button
          value="casual"
          (click)="experienceLevelChange.emit('casual')"
        >
          <ion-label>{{ 'ONBOARDING.CASUAL' | translate }}</ion-label>
        </ion-segment-button>
        <ion-segment-button
          value="competitive"
          (click)="experienceLevelChange.emit('competitive')"
        >
          <ion-label>{{ 'ONBOARDING.COMPETITIVE' | translate }}</ion-label>
        </ion-segment-button>
      </ion-segment>
    </section>
  `,
  styles: [`
    .onboarding__segment-label {
      margin-top: 12px;
    }

    .onboarding__segment {
      margin-top: 4px;
    }

    .onboarding__segment ion-segment-button {
      --padding-start: 8px;
      --padding-end: 8px;
      font-size: 13px;
    }
  `],
  imports: [IonItem, IonLabel, IonInput, IonSegment, IonSegmentButton, TranslatePipe],
})
export class OnboardingStepProfileComponent {
  name = input('');
  nick = input('');
  experienceLevel = input<ExperienceLevel | null>(null);

  nameChange = output<string>();
  nickChange = output<string>();
  experienceLevelChange = output<ExperienceLevel>();
}
