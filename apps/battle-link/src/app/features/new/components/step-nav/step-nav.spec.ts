import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { StepNavComponent } from './step-nav';
import { TipoCreacion } from '../../new-form.types';

@Component({
  template: `
    <app-step-nav
      [tipo]="tipo"
      [valido]="valido"
      [esUltimoPaso]="esUltimoPaso"
      [mostrarAnterior]="mostrarAnterior"
      (anterior)="anteriorCount = anteriorCount + 1"
      (siguiente)="siguienteCount = siguienteCount + 1"
      (confirmar)="confirmarCount = confirmarCount + 1"
    />
  `,
  imports: [StepNavComponent],
})
class TestHostComponent {
  tipo: TipoCreacion = 'partida';
  valido = true;
  esUltimoPaso = false;
  mostrarAnterior = false;
  anteriorCount = 0;
  siguienteCount = 0;
  confirmarCount = 0;
}

describe('StepNavComponent', () => {
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

  it('should show "Siguiente" button when not last step', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const buttons = Array.from(el.querySelectorAll('ion-button'));
    expect(buttons.some((b) => b.textContent?.includes('Siguiente'))).toBe(true);
  });

  it('should show "Crear Partida" on last step with tipo partida', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.esUltimoPaso = true;
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Crear Partida');
  });

  it('should show "Crear Evento" on last step with tipo evento', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.esUltimoPaso = true;
    fixture.componentInstance.tipo = 'evento';
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Crear Evento');
  });

  it('should hide "Anterior" button when mostrarAnterior is false', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const buttons = Array.from(el.querySelectorAll('ion-button'));
    expect(buttons.some((b) => b.textContent?.includes('Anterior'))).toBe(false);
  });

  it('should show "Anterior" button when mostrarAnterior is true', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.mostrarAnterior = true;
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const buttons = Array.from(el.querySelectorAll('ion-button'));
    expect(buttons.some((b) => b.textContent?.includes('Anterior'))).toBe(true);
  });

  it('should emit anterior when Anterior is clicked', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.mostrarAnterior = true;
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const anteriorBtn = Array.from(el.querySelectorAll('ion-button')).find((b) =>
      b.textContent?.includes('Anterior')
    ) as HTMLElement;
    anteriorBtn.click();
    expect(fixture.componentInstance.anteriorCount).toBe(1);
  });

  it('should emit siguiente when Siguiente is clicked', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const siguienteBtn = Array.from(el.querySelectorAll('ion-button')).find((b) =>
      b.textContent?.includes('Siguiente')
    ) as HTMLElement;
    siguienteBtn.click();
    expect(fixture.componentInstance.siguienteCount).toBe(1);
  });

  it('should emit confirmar when Crear button is clicked', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.esUltimoPaso = true;
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const crearBtn = el.querySelector('ion-button') as HTMLElement;
    crearBtn.click();
    expect(fixture.componentInstance.confirmarCount).toBe(1);
  });
});
