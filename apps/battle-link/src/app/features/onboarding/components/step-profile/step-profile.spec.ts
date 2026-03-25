import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { OnboardingStepProfileComponent } from './step-profile';
import { ExperienceLevel } from '../../../../core/services/api.service';

@Component({
  template: `
    <app-onboarding-step-profile
      [name]="name"
      [nick]="nick"
      [experienceLevel]="experienceLevel"
      (nameChange)="lastName = $event"
      (nickChange)="lastNick = $event"
      (experienceLevelChange)="lastLevel = $event"
    />
  `,
  imports: [OnboardingStepProfileComponent],
})
class TestHostComponent {
  name = '';
  nick = '';
  experienceLevel: ExperienceLevel | null = null;
  lastName = '';
  lastNick = '';
  lastLevel: ExperienceLevel | null = null;
}

describe('OnboardingStepProfileComponent', () => {
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

  it('should render ion-inputs for nick and name', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const inputs = el.querySelectorAll('ion-input');
    expect(inputs.length).toBe(2);
  });

  it('should render ion-segment with 3 experience level buttons', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const segment = el.querySelector('ion-segment');
    expect(segment).toBeTruthy();
    const buttons = el.querySelectorAll('ion-segment-button');
    expect(buttons.length).toBe(3);
  });

  it('should emit experienceLevelChange when segment button is clicked', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const buttons = el.querySelectorAll<HTMLElement>('ion-segment-button');
    buttons[1].click(); // "casual"
    expect(fixture.componentInstance.lastLevel).toBe('casual');
  });

  it('should emit experienceLevelChange: beginner on first button click', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const buttons = el.querySelectorAll<HTMLElement>('ion-segment-button');
    buttons[0].click();
    expect(fixture.componentInstance.lastLevel).toBe('beginner');
  });

  it('should emit experienceLevelChange: competitive on third button click', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const buttons = el.querySelectorAll<HTMLElement>('ion-segment-button');
    buttons[2].click();
    expect(fixture.componentInstance.lastLevel).toBe('competitive');
  });
});
