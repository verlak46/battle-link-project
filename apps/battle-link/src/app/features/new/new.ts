import { Component, signal, computed, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  gameControllerOutline,
  calendarOutline,
  locationOutline,
  listOutline,
  checkmarkOutline,
  chevronForwardOutline,
  chevronBackOutline,
} from 'ionicons/icons';
import { toSignal } from '@angular/core/rxjs-interop';

import { TipoCreacion, NuevoFormData, PASOS_WIZARD } from './new-form.types';
import { ApiService } from '../../core/services/api.service';
import { Place } from '@battle-link/shared-models';
import { TipoSelectorComponent } from './components/tipo-selector/tipo-selector';
import { StepHeaderComponent } from './components/step-header/step-header';
import { StepNavComponent } from './components/step-nav/step-nav';
import { PasoJuegoComponent } from './components/paso-juego/paso-juego';
import { PasoFechaComponent } from './components/paso-fecha/paso-fecha';
import { PasoUbicacionComponent } from './components/paso-ubicacion/paso-ubicacion';
import { PasoDetallesComponent } from './components/paso-detalles/paso-detalles';

@Component({
  selector: 'app-new',
  templateUrl: './new.html',
  styleUrl: './new.scss',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    TipoSelectorComponent,
    StepHeaderComponent,
    StepNavComponent,
    PasoJuegoComponent,
    PasoFechaComponent,
    PasoUbicacionComponent,
    PasoDetallesComponent,
  ],
})
export class NewPage {
  private readonly api = inject(ApiService);
  readonly pasos = PASOS_WIZARD;

  tipo = signal<TipoCreacion>('partida');
  pasoActual = signal(1);
  places = toSignal(this.api.getPlaces(), { initialValue: [] as Place[] });

  form = signal<NuevoFormData>({
    juego: '',
    sistema: '',
    fecha: '',
    hora: '',
    ciudad: '',
    direccion: '',
    titulo: '',
    descripcion: '',
    maxJugadores: '',
    imageUrl: undefined,
  });

  esPasoValido = computed(() => {
    const f = this.form();
    switch (this.pasoActual()) {
      case 1: return f.juego.trim().length > 0;
      case 2: return f.fecha.trim().length > 0;
      case 3: return f.ciudad.trim().length > 0;
      case 4: return f.titulo.trim().length > 0;
      default: return false;
    }
  });

  esUltimoPaso = computed(() => this.pasoActual() === this.pasos.length);

  constructor() {
    addIcons({
      gameControllerOutline,
      calendarOutline,
      locationOutline,
      listOutline,
      checkmarkOutline,
      chevronForwardOutline,
      chevronBackOutline,
    });
  }

  patch(partial: Partial<NuevoFormData>) {
    this.form.update((f) => ({ ...f, ...partial }));
  }

  irAPaso(paso: number) {
    if (paso < this.pasoActual()) {
      this.pasoActual.set(paso);
    }
  }

  siguiente() {
    if (!this.esPasoValido()) return;
    if (!this.esUltimoPaso()) {
      this.pasoActual.update((p) => p + 1);
    }
  }

  anterior() {
    if (this.pasoActual() > 1) {
      this.pasoActual.update((p) => p - 1);
    }
  }

  confirmar() {
    if (!this.esPasoValido()) return;
    console.log('Crear', this.tipo(), this.form());
  }
}
