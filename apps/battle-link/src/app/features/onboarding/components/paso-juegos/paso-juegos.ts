import { Component, input, output } from '@angular/core';
import {
  IonItem,
  IonLabel,
  IonList,
  IonChip,
} from '@ionic/angular/standalone';
import { Wargame } from '../../../../shared/models/IWargame';

@Component({
  selector: 'app-onboarding-paso-juegos',
  template: `
    <section>
      <h3>Juegos favoritos</h3>
      <p class="onboarding__hint">
        Elige al menos un wargame para recomendarte partidas.
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
              {{ isSelected(game.id) ? 'Seleccionado' : 'Elegir' }}
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
  imports: [IonList, IonItem, IonLabel, IonChip],
})
export class PasoJuegosOnboardingComponent {
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

