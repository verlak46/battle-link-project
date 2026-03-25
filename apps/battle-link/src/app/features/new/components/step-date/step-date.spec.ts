import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { StepDateComponent } from './step-date';

@Component({
  template: `
    <app-step-date
      [date]="date"
      [time]="time"
      (dateChange)="lastDate = $event"
      (timeChange)="lastTime = $event"
    />
  `,
  imports: [StepDateComponent],
})
class TestHostComponent {
  date = '';
  time = '';
  lastDate: string | null = null;
  lastTime: string | null = null;
}

describe('StepDateComponent', () => {
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

  it('should show "Fecha" label', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Fecha');
  });

  it('should show "Hora" label', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Hora');
  });

  it('should emit dateChange on ionInput', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const inputs = fixture.nativeElement.querySelectorAll('ion-input');
    inputs[0].dispatchEvent(new CustomEvent('ionInput', { detail: { value: '2026-05-01' }, bubbles: true }));
    expect(fixture.componentInstance.lastDate).toBe('2026-05-01');
  });

  it('should emit timeChange on ionInput', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const inputs = fixture.nativeElement.querySelectorAll('ion-input');
    inputs[1].dispatchEvent(new CustomEvent('ionInput', { detail: { value: '18:00' }, bubbles: true }));
    expect(fixture.componentInstance.lastTime).toBe('18:00');
  });
});
