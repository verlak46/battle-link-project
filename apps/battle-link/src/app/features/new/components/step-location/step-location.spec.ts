import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { StepLocationComponent } from './step-location';

@Component({
  template: `
    <app-step-location
      [ciudad]="ciudad"
      [direccion]="direccion"
      (ciudadChange)="lastCiudad = $event"
      (direccionChange)="lastDireccion = $event"
    />
  `,
  imports: [StepLocationComponent],
})
class TestHostComponent {
  ciudad = '';
  direccion = '';
  lastCiudad: string | null = null;
  lastDireccion: string | null = null;
}

describe('StepLocationComponent', () => {
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

  it('should show "Ciudad" label', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Ciudad');
  });

  it('should render map placeholder', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.map-placeholder')).toBeTruthy();
  });

  it('should emit ciudadChange on ionInput', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const inputs = fixture.nativeElement.querySelectorAll('ion-input');
    inputs[0].dispatchEvent(new CustomEvent('ionInput', { detail: { value: 'Sevilla' }, bubbles: true }));
    expect(fixture.componentInstance.lastCiudad).toBe('Sevilla');
  });

  it('should emit direccionChange on ionInput', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const inputs = fixture.nativeElement.querySelectorAll('ion-input');
    inputs[1].dispatchEvent(new CustomEvent('ionInput', { detail: { value: 'Calle Sierpes 1' }, bubbles: true }));
    expect(fixture.componentInstance.lastDireccion).toBe('Calle Sierpes 1');
  });
});
