import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { PasoJuegoComponent } from './paso-juego';
import { TipoCreacion } from '../../nuevo-form.types';

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
      providers: [provideIonicAngular()],
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

  it('should emit juegoChange on ionInput', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const inputs = fixture.nativeElement.querySelectorAll('ion-input');
    inputs[0].dispatchEvent(new CustomEvent('ionInput', { detail: { value: 'D&D 5e' }, bubbles: true }));
    expect(fixture.componentInstance.lastJuego).toBe('D&D 5e');
  });

  it('should emit sistemaChange on ionInput for second field', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const inputs = fixture.nativeElement.querySelectorAll('ion-input');
    inputs[1].dispatchEvent(new CustomEvent('ionInput', { detail: { value: '5ª edición' }, bubbles: true }));
    expect(fixture.componentInstance.lastSistema).toBe('5ª edición');
  });
});
