import { Component, input, output } from '@angular/core';
import {
  IonItem,
  IonLabel,
  IonList,
  IonChip,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { Wargame } from '../../../../shared/models/IWargame';

@Component({
  selector: 'app-onboarding-step-games',
  template: `
    <section>
      <h3>{{ 'ONBOARDING.FAVORITE_GAMES' | translate }}</h3>
      <p class="onboarding__hint">
        {{ 'ONBOARDING.GAMES_HINT' | translate }}
      </p>

      <ion-list>
        @for (game of wargames(); track game.id) {
          <ion-item>
            <ion-label>{{ game.name }}</ion-label>
            <ion-chip
              [outline]="!isSelected(game.id)"
              color="primary"
              (click)="toggle(game.id)"
            >
              {{ (isSelected(game.id) ? 'COMMON.SELECTED' : 'COMMON.SELECT') | translate }}
            </ion-chip>
          </ion-item>
        }
      </ion-list>
    </section>
  `,
  styles: [`
    .onboarding__hint {
      font-size: 13px;
      color: var(--ion-color-medium);
      margin-bottom: 8px;
    }
  `],
  imports: [IonList, IonItem, IonLabel, IonChip, TranslatePipe],
})
export class OnboardingStepGamesComponent {
  wargames = input<Wargame[]>([]);
  selectedIds = input<string[]>([]);

  selectedIdsChange = output<string[]>();

  isSelected(id: string): boolean {
    return this.selectedIds().includes(id);
  }

  toggle(id: string): void {
    const current = this.selectedIds();
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    this.selectedIdsChange.emit(next);
  }
}
