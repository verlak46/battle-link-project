import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { of } from 'rxjs';
import { PasoJuegoComponent } from './paso-juego';
import { TipoCreacion } from '../../nuevo-form.types';
import { ApiService } from '../../../../core/services/api.service';
import { Wargame } from '../../../../shared/models/IWargame';

@Component({
  template: `
    <app-paso-juego
      [tipo]="tipo"
      [juego]="juego"
      [sistema]="sistema"
      (juegoChange)="lastJuego = $event"
      (sistemaChange)="lastSistema = $event"
    />
  `,
  imports: [PasoJuegoComponent],
})
class TestHostComponent {
  tipo: TipoCreacion = 'partida';
  juego = '';
  sistema = '';
  lastJuego: string | null = null;
  lastSistema: string | null = null;
}

describe('PasoJuegoComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        provideIonicAngular(),
        {
          provide: ApiService,
          useValue: {
            getWargames: () =>
              of<Wargame[]>([
                {
                  id: 'warhammer40k',
                  name: 'Warhammer 40,000',
                  players: 2,
                  scale: '28mm',
                  publisher: 'Games Workshop',
                  active: true,
                },
                {
                  id: 'boltaction',
                  name: 'Bolt Action',
                  players: 2,
                  scale: '28mm',
                  publisher: 'Warlord Games',
                  active: true,
                },
              ]),
          } satisfies Partial<ApiService>,
        },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render 2 ion-item elements', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('ion-item').length).toBe(2);
  });

  it('should show "Juego / Sistema" label when tipo is partida', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Juego / Sistema');
  });

  it('should show "Nombre del juego" label when tipo is evento', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.tipo = 'evento';
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Nombre del juego');
  });

  it('should emit juegoChange on ionChange of select', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const select = fixture.nativeElement.querySelector('ion-select') as HTMLElement;
    select.dispatchEvent(
      new CustomEvent('ionChange', {
        detail: { value: 'warhammer40k' },
        bubbles: true,
      }),
    );
    expect(fixture.componentInstance.lastJuego).toBe('warhammer40k');
  });

  it('should emit sistemaChange on ionInput for second field', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const inputs = fixture.nativeElement.querySelectorAll('ion-input');
    inputs[0].dispatchEvent(
      new CustomEvent('ionInput', {
        detail: { value: '5ª edición' },
        bubbles: true,
      }),
    );
    expect(fixture.componentInstance.lastSistema).toBe('5ª edición');
  });

  it('should render select options from API service', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const options = el.querySelectorAll('ion-select-option');
    expect(options.length).toBe(2);
    expect(el.textContent).toContain('Warhammer 40,000');
    expect(el.textContent).toContain('Bolt Action');
  });
});
