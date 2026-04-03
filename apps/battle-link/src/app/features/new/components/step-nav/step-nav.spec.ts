import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { StepNavComponent } from './step-nav';
import { CreationType } from '../../new-form.types';
import { provideTestTranslations } from '../../../../testing/translate-testing';

@Component({
  template: `
    <app-step-nav
      [type]="type"
      [valid]="valid"
      [isLastStep]="isLastStep"
      [showPrevious]="showPrevious"
      (previous)="previousCount = previousCount + 1"
      (next)="nextCount = nextCount + 1"
      (confirm)="confirmCount = confirmCount + 1"
    />
  `,
  imports: [StepNavComponent],
})
class TestHostComponent {
  type: CreationType = 'partida';
  valid = true;
  isLastStep = false;
  showPrevious = false;
  previousCount = 0;
  nextCount = 0;
  confirmCount = 0;
}

describe('StepNavComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideIonicAngular(), provideTestTranslations()],
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

  it('should show "Crear Partida" on last step with type partida', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.isLastStep = true;
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Crear Partida');
  });

  it('should show "Crear Evento" on last step with type evento', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.isLastStep = true;
    fixture.componentInstance.type = 'evento';
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Crear Evento');
  });

  it('should hide "Anterior" button when showPrevious is false', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const buttons = Array.from(el.querySelectorAll('ion-button'));
    expect(buttons.some((b) => b.textContent?.includes('Anterior'))).toBe(false);
  });

  it('should show "Anterior" button when showPrevious is true', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.showPrevious = true;
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const buttons = Array.from(el.querySelectorAll('ion-button'));
    expect(buttons.some((b) => b.textContent?.includes('Anterior'))).toBe(true);
  });

  it('should emit previous when Anterior is clicked', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.showPrevious = true;
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const anteriorBtn = Array.from(el.querySelectorAll('ion-button')).find((b) =>
      b.textContent?.includes('Anterior')
    ) as HTMLElement;
    anteriorBtn.click();
    expect(fixture.componentInstance.previousCount).toBe(1);
  });

  it('should emit next when Siguiente is clicked', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const siguienteBtn = Array.from(el.querySelectorAll('ion-button')).find((b) =>
      b.textContent?.includes('Siguiente')
    ) as HTMLElement;
    siguienteBtn.click();
    expect(fixture.componentInstance.nextCount).toBe(1);
  });

  it('should emit confirm when Crear button is clicked', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.isLastStep = true;
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const crearBtn = el.querySelector('ion-button') as HTMLElement;
    crearBtn.click();
    expect(fixture.componentInstance.confirmCount).toBe(1);
  });
});
