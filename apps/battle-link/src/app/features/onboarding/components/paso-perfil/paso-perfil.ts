import { Component, input, output } from '@angular/core';
import {
  IonItem,
  IonLabel,
  IonInput,
  IonSegment,
  IonSegmentButton,
} from '@ionic/angular/standalone';
import { ExperienceLevel } from '../../../../core/services/api.service';

@Component({
  selector: 'app-onboarding-paso-perfil',
  template: `
    <section>
      <h3>Sobre ti</h3>
      <ion-item>
        <ion-label position="stacked">Nick de jugador</ion-label>
        <ion-input
          [value]="nick()"
          (ionInput)="nickChange.emit($any($event.target).value ?? '')"
          placeholder="Cómo quieres que te vean otros jugadores"
        ></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Nombre</ion-label>
        <ion-input
          [value]="name()"
          (ionInput)="nameChange.emit($any($event.target).value ?? '')"
          placeholder="Tu nombre real"
        ></ion-input>
      </ion-item>


      <ion-item lines="none" class="onboarding__segment-label">
        <ion-label>Experiencia</ion-label>
      </ion-item>
      <ion-segment [value]="experienceLevel()" scrollable="true" class="onboarding__segment">
        <ion-segment-button
          value="beginner"
          (click)="experienceLevelChange.emit('beginner')"
        >
          <ion-label>Principiante</ion-label>
        </ion-segment-button>
        <ion-segment-button
          value="casual"
          (click)="experienceLevelChange.emit('casual')"
        >
          <ion-label>Casual</ion-label>
        </ion-segment-button>
        <ion-segment-button
          value="competitive"
          (click)="experienceLevelChange.emit('competitive')"
        >
          <ion-label>Competitivo</ion-label>
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
  imports: [IonItem, IonLabel, IonInput, IonSegment, IonSegmentButton],
})
export class PasoPerfilOnboardingComponent {
  name = input('');
  nick = input('');
  experienceLevel = input<ExperienceLevel | null>(null);

  nameChange = output<string>();
  nickChange = output<string>();
  experienceLevelChange = output<ExperienceLevel>();
}

