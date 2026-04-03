import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { OnboardingStepNavComponent } from './onboarding-step-nav';
import { provideTestTranslations } from '../../../../testing/translate-testing';

@Component({
  template: `
    <app-onboarding-step-nav
      [valid]="valid"
      [isLastStep]="isLastStep"
      [showPrevious]="showPrevious"
      [loading]="loading"
      (previous)="previousCalled = true"
      (next)="nextCalled = true"
      (finalize)="finalizeCalled = true"
    />
  `,
  imports: [OnboardingStepNavComponent],
})
class TestHostComponent {
  valid = false;
  isLastStep = false;
  showPrevious = false;
  loading = false;
  previousCalled = false;
  nextCalled = false;
  finalizeCalled = false;
}

describe('OnboardingStepNavComponent', () => {
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

  it('should show Siguiente button when not last step', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.isLastStep = false;
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const buttons = el.querySelectorAll('ion-button');
    const texts = Array.from(buttons).map((b) => b.textContent?.trim());
    expect(texts).toContain('Siguiente');
    expect(texts).not.toContain('Finalizar');
  });

  it('should show Finalizar button when last step', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.isLastStep = true;
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const buttons = el.querySelectorAll('ion-button');
    const texts = Array.from(buttons).map((b) => b.textContent?.trim());
    expect(texts).toContain('Finalizar');
    expect(texts).not.toContain('Siguiente');
  });

  it('should hide Anterior button when showPrevious is false', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.showPrevious = false;
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const buttons = Array.from(el.querySelectorAll('ion-button'));
    const texts = buttons.map((b) => b.textContent?.trim());
    expect(texts).not.toContain('Anterior');
  });

  it('should show Anterior button when showPrevious is true', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.showPrevious = true;
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const buttons = Array.from(el.querySelectorAll('ion-button'));
    const texts = buttons.map((b) => b.textContent?.trim());
    expect(texts).toContain('Anterior');
  });

  it('should emit previous when Anterior button is clicked', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.showPrevious = true;
    fixture.componentInstance.valid = true;
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const buttons = Array.from(el.querySelectorAll<HTMLElement>('ion-button'));
    const anteriorBtn = buttons.find((b) => b.textContent?.trim() === 'Anterior')!;
    anteriorBtn.click();
    expect(fixture.componentInstance.previousCalled).toBe(true);
  });

  it('should emit next when Siguiente button is clicked', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.valid = true;
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const buttons = Array.from(el.querySelectorAll<HTMLElement>('ion-button'));
    const nextBtn = buttons.find((b) => b.textContent?.trim() === 'Siguiente')!;
    nextBtn.click();
    expect(fixture.componentInstance.nextCalled).toBe(true);
  });

  it('should emit finalize when Finalizar button is clicked', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.isLastStep = true;
    fixture.componentInstance.valid = true;
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const buttons = Array.from(el.querySelectorAll<HTMLElement>('ion-button'));
    const finalizeBtn = buttons.find((b) => b.textContent?.trim() === 'Finalizar')!;
    finalizeBtn.click();
    expect(fixture.componentInstance.finalizeCalled).toBe(true);
  });
});
