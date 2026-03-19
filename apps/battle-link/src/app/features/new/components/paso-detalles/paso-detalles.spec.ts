import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { PasoDetallesComponent } from './paso-detalles';
import { TipoCreacion } from '../../nuevo-form.types';

@Component({
  template: `
    <app-paso-detalles
      [tipo]="tipo"
      [titulo]="titulo"
      [descripcion]="descripcion"
      [maxJugadores]="maxJugadores"
      (tituloChange)="lastTitulo = $event"
      (descripcionChange)="lastDescripcion = $event"
      (maxJugadoresChange)="lastMax = $event"
    />
  `,
  imports: [PasoDetallesComponent],
})
class TestHostComponent {
  tipo: TipoCreacion = 'partida';
  titulo = '';
  descripcion = '';
  maxJugadores = '';
  lastTitulo: string | null = null;
  lastDescripcion: string | null = null;
  lastMax: string | null = null;
}

describe('PasoDetallesComponent', () => {
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

  it('should render 3 ion-item elements', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('ion-item').length).toBe(3);
  });

  it('should show "Título de la partida" when tipo is partida', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Título de la partida');
  });

  it('should show "Título del evento" when tipo is evento', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.tipo = 'evento';
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Título del evento');
  });

  it('should render ion-textarea for descripcion', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('ion-textarea')).toBeTruthy();
  });

  it('should emit tituloChange on ionInput', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const inputs = fixture.nativeElement.querySelectorAll('ion-input');
    inputs[0].dispatchEvent(new CustomEvent('ionInput', { detail: { value: 'Torneo primavera' }, bubbles: true }));
    expect(fixture.componentInstance.lastTitulo).toBe('Torneo primavera');
  });

  it('should emit maxJugadoresChange on ionInput', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const inputs = fixture.nativeElement.querySelectorAll('ion-input');
    inputs[1].dispatchEvent(new CustomEvent('ionInput', { detail: { value: '8' }, bubbles: true }));
    expect(fixture.componentInstance.lastMax).toBe('8');
  });
});
