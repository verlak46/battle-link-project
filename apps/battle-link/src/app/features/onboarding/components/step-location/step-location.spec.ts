import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { OnboardingStepLocationComponent } from './step-location';
import { provideTestTranslations } from '../../../../testing/translate-testing';

@Component({
  template: `
    <app-onboarding-step-location
      [location]="location"
      [locationLoading]="locationLoading"
      (useLocation)="useLocationCalled = true"
    />
  `,
  imports: [OnboardingStepLocationComponent],
})
class TestHostComponent {
  location: [number, number] | null = null;
  locationLoading = false;
  useLocationCalled = false;
}

describe('OnboardingStepLocationComponent', () => {
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

  it('should render the location button', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('ion-button')).toBeTruthy();
  });

  it('should emit useLocation when button is clicked', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const button = el.querySelector<HTMLElement>('ion-button')!;
    button.click();
    expect(fixture.componentInstance.useLocationCalled).toBe(true);
  });

  it('should show spinner when locationLoading is true', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.locationLoading = true;
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('ion-spinner')).toBeTruthy();
  });

  it('should not show spinner when locationLoading is false', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.locationLoading = false;
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('ion-spinner')).toBeFalsy();
  });

  it('should show location paragraph when location is provided', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.location = [40.4168, -3.7038];
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const locationP = el.querySelector('.onboarding__location');
    expect(locationP).toBeTruthy();
    expect(locationP!.textContent).toContain('40.4168');
  });

  it('should not show location paragraph when location is null', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.location = null;
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.onboarding__location')).toBeFalsy();
  });
});
