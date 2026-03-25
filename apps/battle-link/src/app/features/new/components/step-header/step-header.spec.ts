import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { StepHeaderComponent } from './step-header';
import { WizardStep } from '../../new-form.types';

const STEP_MOCK: WizardStep = { id: 2, title: 'Fecha', icon: 'calendar-outline' };

@Component({
  template: `
    <app-step-header
      [step]="step"
      [total]="4"
      [active]="active"
      [done]="done"
      (clicked)="lastClicked = $event"
    />
  `,
  imports: [StepHeaderComponent],
})
class TestHostComponent {
  step = STEP_MOCK;
  active = false;
  done = false;
  lastClicked: number | null = null;
}

describe('StepHeaderComponent', () => {
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

  it('should show step number when not done', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.step__bubble span')?.textContent?.trim()).toBe('2');
  });

  it('should show checkmark icon when done', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.done = true;
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.step__bubble ion-icon')).toBeTruthy();
    expect(el.querySelector('.step__bubble span')).toBeNull();
  });

  it('should render connector for steps after the first', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.step__connector')).toBeTruthy();
  });

  it('should NOT render connector for step 1', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.step = { id: 1, title: 'Juego', icon: 'game-controller-outline' };
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.step__connector')).toBeNull();
  });

  it('should display step title', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.step__title')?.textContent).toContain('Fecha');
  });

  it('should emit clicked when done and header is clicked', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.done = true;
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelector('.step__header') as HTMLElement;
    header.click();
    expect(fixture.componentInstance.lastClicked).toBe(2);
  });

  it('should NOT emit clicked when not done', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.done = false;
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelector('.step__header') as HTMLElement;
    header.click();
    expect(fixture.componentInstance.lastClicked).toBeNull();
  });
});
