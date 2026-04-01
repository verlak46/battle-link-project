import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { StepDateComponent } from './step-date';

@Component({
  template: `
    <app-step-date
      [startDate]="startDate"
      [endDate]="endDate"
      [time]="time"
      (startDateChange)="lastStartDate = $event"
      (endDateChange)="lastEndDate = $event"
      (timeChange)="lastTime = $event"
    />
  `,
  imports: [StepDateComponent],
})
class TestHostComponent {
  startDate = '';
  endDate = '';
  time = '';
  lastStartDate: string | null = null;
  lastEndDate: string | null = null;
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

  it('should render 3 ion-item elements', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('ion-item').length).toBe(3);
  });

  it('should show "Fecha inicio" label', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Fecha inicio');
  });

  it('should show "Fecha fin" label', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Fecha fin');
  });

  it('should show "Hora" label', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Hora');
  });

  it('should emit startDateChange on ionInput', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const inputs = fixture.nativeElement.querySelectorAll('ion-input');
    inputs[0].dispatchEvent(new CustomEvent('ionInput', { detail: { value: '2026-05-01' }, bubbles: true }));
    expect(fixture.componentInstance.lastStartDate).toBe('2026-05-01');
  });

  it('should emit endDateChange on ionInput', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const inputs = fixture.nativeElement.querySelectorAll('ion-input');
    inputs[1].dispatchEvent(new CustomEvent('ionInput', { detail: { value: '2026-05-03' }, bubbles: true }));
    expect(fixture.componentInstance.lastEndDate).toBe('2026-05-03');
  });

  it('should emit timeChange on ionInput', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const inputs = fixture.nativeElement.querySelectorAll('ion-input');
    inputs[2].dispatchEvent(new CustomEvent('ionInput', { detail: { value: '18:00' }, bubbles: true }));
    expect(fixture.componentInstance.lastTime).toBe('18:00');
  });
});
